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

    @Autowired private PredictionJobRepository predictionJobRepository;
    @Autowired private MLBatchService mlBatchService;

    public int streamAndProcess(String datasetPath, Long jobId) throws IOException {
        PredictionJob job = predictionJobRepository.findById(jobId).orElseThrow();
        int chunkCount = 0;
        List<Map<String, Object>> chunk = new ArrayList<>(CHUNK_SIZE);
        int totalRecords = 0;

        try (BufferedReader br = new BufferedReader(new FileReader(datasetPath))) {
            String line;
            boolean isHeader = true;
            String[] headers = null;

            while ((line = br.readLine()) != null) {
                if (isHeader) {
                    headers = parseCSVLine(line);
                    isHeader = false;
                    continue;
                }

                String[] values = parseCSVLine(line);
                Map<String, Object> record = new HashMap<>();
                for (int i = 0; i < Math.min(headers.length, values.length); i++) {
                    record.put(headers[i].trim(), values[i].trim());
                }
                chunk.add(normalizeRecord(record));
                totalRecords++;

                if (chunk.size() == CHUNK_SIZE) {
                    mlBatchService.processChunk(chunk, jobId);
                    chunk.clear();
                    chunkCount++;
                    updateProgress(job, totalRecords);
                }
            }

            if (!chunk.isEmpty()) {
                mlBatchService.processChunk(chunk, jobId);
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

    private void updateProgress(PredictionJob job, int processed) {
        job.setProcessedRecords(processed);
        if (job.getTotalRecords() != null && job.getTotalRecords() > 0) {
            job.setProgressPercent((float) ((processed * 100.0) / job.getTotalRecords()));
        }
        predictionJobRepository.save(job);
    }
}
