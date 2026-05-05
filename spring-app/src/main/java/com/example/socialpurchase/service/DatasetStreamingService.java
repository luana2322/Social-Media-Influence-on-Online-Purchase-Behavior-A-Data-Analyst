package com.example.socialpurchase.service;

import com.example.socialpurchase.entity.PredictionJob;
import com.example.socialpurchase.repository.PredictionJobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

@Service
public class DatasetStreamingService {
    private static final int CHUNK_SIZE = 1000;
    private static final Set<String> EXPECTED_COLUMNS = Set.of(
            "PageValues", "BounceRates", "ExitRates", "ProductRelated", "Administrative",
            "avg_sentiment", "total_engagement", "positive_ratio", "engagement_norm",
            "global_avg_price", "Month", "OperatingSystems", "Browser", "Region",
            "TrafficType", "VisitorType", "Weekend"
    );

    // Columns that could be used as record ID
    private static final Set<String> POTENTIAL_ID_COLUMNS = Set.of(
            "id", "customer_id", "user_id", "email", "username", "userid", "customerid"
    );

    @Autowired private PredictionJobRepository predictionJobRepository;
    @Autowired private MLBatchService mlBatchService;

    public int streamAndProcess(String datasetPath, Long jobId) throws IOException {
        PredictionJob job = predictionJobRepository.findById(jobId).orElseThrow();
        int chunkCount = 0;
        List<Map<String, Object>> chunk = new ArrayList<>(CHUNK_SIZE);
        List<String> recordIds = new ArrayList<>(CHUNK_SIZE);
        int totalRecords = 0;
        String idColumn = null;
        String[] headers = null;

        try (BufferedReader br = new BufferedReader(new FileReader(datasetPath))) {
            String line;
            boolean isHeader = true;

            while ((line = br.readLine()) != null) {
                if (isHeader) {
                    headers = parseCSVLine(line);
                    idColumn = detectIdColumn(headers);
                    job.setDatasetColumns(Arrays.toString(headers));
                    job.setDatasetType(detectDatasetType(headers));
                    job.setIdColumn(idColumn != null ? idColumn : headers[0]); // Fallback to first column
                    predictionJobRepository.saveAndFlush(job);
                    isHeader = false;
                    continue;
                }

                String[] values = parseCSVLine(line);
                Map<String, Object> record = new HashMap<>();
                String recordId = "row_" + (totalRecords + 1); // Simple: row_1, row_2, etc.

                for (int i = 0; i < Math.min(headers.length, values.length); i++) {
                    if (idColumn != null && headers[i].equalsIgnoreCase(idColumn)) {
                        recordId = values[i].trim();
                    }
                    record.put(headers[i].trim(), values[i].trim());
                }
                chunk.add(normalizeRecord(record));
                recordIds.add(recordId);
                totalRecords++;

                if (chunk.size() == CHUNK_SIZE) {
                    mlBatchService.processChunk(chunk, recordIds, jobId);
                    chunk.clear();
                    recordIds.clear();
                    chunkCount++;
                    updateProgress(job, totalRecords);
                }
            }

            if (!chunk.isEmpty()) {
                mlBatchService.processChunk(chunk, recordIds, jobId);
                chunkCount++;
                updateProgress(job, totalRecords);
            }

            job.setTotalRecords(totalRecords);
            job.setProcessedRecords(totalRecords);
            job.setProgressPercent(100.0f);
            predictionJobRepository.save(job);
        }
        return chunkCount;
    }

    private String[] parseCSVLine(String line) {
        List<String> result = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (char c : line.toCharArray()) {
            if (c == '"') { inQuotes = !inQuotes; }
            else if (c == ',' && !inQuotes) {
                result.add(current.toString());
                current = new StringBuilder();
            } else { current.append(c); }
        }
        result.add(current.toString());
        return result.toArray(new String[0]);
    }

    private Map<String, Object> normalizeRecord(Map<String, Object> record) {
        Map<String, Object> normalized = new HashMap<>();
        for (String key : EXPECTED_COLUMNS) {
            String matchedKey = findClosestKey(key, record.keySet());
            normalized.put(key, matchedKey != null ? record.get(matchedKey) : getDefaultValue(key));
        }
        return normalized;
    }

    private String findClosestKey(String target, Set<String> keys) {
        for (String key : keys) {
            if (key.equalsIgnoreCase(target) || key.replaceAll("[^a-zA-Z0-9]", "").equalsIgnoreCase(target.replaceAll("[^a-zA-Z0-9]", ""))) {
                return key;
            }
        }
        return null;
    }

    private Object getDefaultValue(String column) {
        if (column.equals("Month") || column.equals("VisitorType")) return "";
        if (column.equals("Weekend")) return 0;
        return 0.0;
    }

    private String detectIdColumn(String[] headers) {
        for (String h : headers) {
            String clean = h.trim().toLowerCase().replaceAll("[^a-z0-9]", "");
            for (String idCol : POTENTIAL_ID_COLUMNS) {
                String cleanId = idCol.toLowerCase().replaceAll("[^a-z0-9]", "");
                if (clean.equals(cleanId)) {
                    return h.trim();
                }
            }
        }
        return null;
    }

    private String detectDatasetType(String[] headers) {
        List<String> headerList = Arrays.stream(headers).map(String::toLowerCase).toList();
        if (headerList.stream().anyMatch(h -> h.contains("purchase") || h.contains("revenue") || h.contains("cart"))) {
            return "ECOMMERCE";
        }
        if (headerList.stream().anyMatch(h -> h.contains("sentiment") || h.contains("engagement") || h.contains("social"))) {
            return "SOCIAL_MEDIA";
        }
        if (headerList.stream().anyMatch(h -> h.contains("page") || h.contains("bounce") || h.contains("exit"))) {
            return "WEB_ANALYTICS";
        }
        return "GENERAL";
    }

    private void updateProgress(PredictionJob job, int processed) {
        job.setProcessedRecords(processed);
        if (job.getTotalRecords() != null && job.getTotalRecords() > 0) {
            job.setProgressPercent((float) ((processed * 100.0) / job.getTotalRecords()));
        }
        predictionJobRepository.saveAndFlush(job);
    }
}
