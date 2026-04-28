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

    public void processChunk(List<Map<String, Object>> chunk, Long jobId) {
        long startTime = System.currentTimeMillis();

        List<BatchPredictionResponse> predictions = mlServiceClient.batchPredictChunk(chunk);

        List<PredictionResult> results = new ArrayList<>();
        for (int i = 0; i < predictions.size(); i++) {
            BatchPredictionResponse pred = predictions.get(i);
            PredictionResult result = new PredictionResult();
            result.setJobId(jobId);
            result.setRecordId(chunk.get(i).getOrDefault("id", pred.getRecordId()).toString());
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
