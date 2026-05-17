package com.example.socialpurchase.service;

import com.example.socialpurchase.entity.PredictionJob;
import com.example.socialpurchase.repository.PredictionJobRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

@Service
public class DatasetStreamingService {
    private static final int CHUNK_SIZE = 1000;

    private static final Set<String> POTENTIAL_ID_COLUMNS = Set.of(
            "id", "customer_id", "user_id", "email", "username", "userid", "customerid"
    );

    @Autowired private PredictionJobRepository predictionJobRepository;
    @Autowired private MLBatchService mlBatchService;
    @Autowired private SchemaMapper schemaMapper;
    @Autowired private ColumnValidator columnValidator;
    @Autowired private ObjectMapper objectMapper;

    public int streamAndProcess(String datasetPath, Long jobId) throws IOException {
        PredictionJob job = predictionJobRepository.findById(jobId).orElseThrow();
        int chunkCount = 0;
        List<Map<String, Object>> chunk = new ArrayList<>(CHUNK_SIZE);
        List<String> recordIds = new ArrayList<>(CHUNK_SIZE);
        int totalRecords = 0;
        String idColumn = null;
        String[] headers = null;
        Map<String, String> columnMapping = null;

        try (BufferedReader br = new BufferedReader(new FileReader(datasetPath))) {
            String line;
            boolean isHeader = true;

            while ((line = br.readLine()) != null) {
                if (isHeader) {
                    headers = parseCSVLine(line);
                    idColumn = detectIdColumn(headers);
                    columnMapping = schemaMapper.mapColumns(headers);
                    job.setDatasetColumns(Arrays.toString(headers));
                    job.setDatasetType(detectDatasetType(headers));
                    job.setIdColumn(idColumn != null ? idColumn : headers[0]);
                    job.setColumnWarnings(buildWarningsJson(headers, columnMapping));
                    predictionJobRepository.saveAndFlush(job);
                    isHeader = false;
                    continue;
                }

                String[] values = parseCSVLine(line);
                Map<String, Object> rawRecord = new HashMap<>();
                String recordId = "row_" + (totalRecords + 1);

                for (int i = 0; i < Math.min(headers.length, values.length); i++) {
                    if (idColumn != null && headers[i].equalsIgnoreCase(idColumn)) {
                        recordId = values[i].trim();
                    }
                    rawRecord.put(headers[i].trim(), values[i].trim());
                }
                chunk.add(schemaMapper.normalizeRecord(rawRecord, columnMapping));
                recordIds.add(recordId);
                totalRecords++;

                if (chunk.size() == CHUNK_SIZE) {
                    mlBatchService.processChunk(chunk, recordIds, jobId, job.getDatasetType());
                    chunk.clear();
                    recordIds.clear();
                    chunkCount++;
                    updateProgress(job, totalRecords);
                }
            }

            if (!chunk.isEmpty()) {
                mlBatchService.processChunk(chunk, recordIds, jobId, job.getDatasetType());
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

    private String buildWarningsJson(String[] headers, Map<String, String> columnMapping) {
        try {
            Map<String, Object> validation = columnValidator.validate(headers, columnMapping);
            return objectMapper.writeValueAsString(validation);
        } catch (JsonProcessingException e) {
            return "{\"error\": \"Failed to serialize warnings\"}";
        }
    }

    private void updateProgress(PredictionJob job, int processed) {
        job.setProcessedRecords(processed);
        if (job.getTotalRecords() != null && job.getTotalRecords() > 0) {
            job.setProgressPercent((float) ((processed * 100.0) / job.getTotalRecords()));
        }
        predictionJobRepository.saveAndFlush(job);
    }
}
