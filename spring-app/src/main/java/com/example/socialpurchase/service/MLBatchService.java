package com.example.socialpurchase.service;

import com.example.socialpurchase.client.MLServiceClient;
import com.example.socialpurchase.dto.BatchPredictionResponse;
import com.example.socialpurchase.entity.PredictionResult;
import com.example.socialpurchase.repository.PredictionResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class MLBatchService {
    private static final Logger logger = Logger.getLogger(MLBatchService.class.getName());
    private static final int BATCH_INSERT_SIZE = 1000;

    @Autowired private MLServiceClient mlServiceClient;
    @Autowired private PredictionResultRepository predictionResultRepository;

    public void processChunk(List<Map<String, Object>> chunk, List<String> recordIds, Long jobId, String datasetType) {
        long startTime = System.currentTimeMillis();

        List<BatchPredictionResponse> predictions = mlServiceClient.batchPredictChunk(chunk, datasetType);

        List<PredictionResult> results = new ArrayList<>();
        for (int i = 0; i < predictions.size(); i++) {
            BatchPredictionResponse pred = predictions.get(i);
            PredictionResult result = new PredictionResult();
            result.setJobId(jobId);
            // Use meaningful record ID from CSV, fallback to prediction's recordId, then row number
            String recordId = (i < recordIds.size()) ? recordIds.get(i) : pred.getRecordId();
            // Clean up recordId: if unknown/empty, use row number
            if (recordId == null || recordId.trim().isEmpty() || recordId.equalsIgnoreCase("unknown")) {
                recordId = "row_" + (i + 1);
            }
            result.setRecordId(recordId);
            // Create display ID: "Dòng X (ID: Y)" for clarity
            String displayId = "Dòng " + (i + 1) + (recordId != null && !recordId.startsWith("row_") ? " (ID: " + recordId + ")" : "");
            result.setDisplayId(displayId);
            result.setProbability(pred.getProbability());
            result.setSegment(pred.getSegment());
            result.setModelVersion(pred.getModelVersion());
            results.add(result);
        }

        batchInsert(results);

        long duration = System.currentTimeMillis() - startTime;
        logger.info(String.format("Processed chunk of %d records in %dms", chunk.size(), duration));
    }

    private void batchInsert(List<PredictionResult> results) {
        if (results.isEmpty()) return;

        for (int i = 0; i < results.size(); i += BATCH_INSERT_SIZE) {
            int end = Math.min(i + BATCH_INSERT_SIZE, results.size());
            List<PredictionResult> batch = results.subList(i, end);
            predictionResultRepository.saveAll(batch);
            predictionResultRepository.flush();
        }
    }
}
