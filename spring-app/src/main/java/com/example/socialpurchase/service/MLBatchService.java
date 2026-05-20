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
        double sumProb = 0, minProb = 1, maxProb = 0;
        int highCount = 0, medCount = 0, lowCount = 0;
        for (int i = 0; i < predictions.size(); i++) {
            BatchPredictionResponse pred = predictions.get(i);
            PredictionResult result = new PredictionResult();
            result.setJobId(jobId);
            String recordId = (i < recordIds.size()) ? recordIds.get(i) : pred.getRecordId();
            if (recordId == null || recordId.trim().isEmpty() || recordId.equalsIgnoreCase("unknown")) {
                recordId = "row_" + (i + 1);
            }
            result.setRecordId(recordId);
            String displayId = "Dòng " + (i + 1) + (recordId != null && !recordId.startsWith("row_") ? " (ID: " + recordId + ")" : "");
            result.setDisplayId(displayId);
            result.setProbability(pred.getProbability());
            result.setSegment(pred.getSegment());
            result.setModelVersion(pred.getModelVersion());
            results.add(result);

            double prob = pred.getProbability();
            sumProb += prob;
            if (prob < minProb) minProb = prob;
            if (prob > maxProb) maxProb = prob;
            if (prob > 0.8) highCount++;
            else if (prob > 0.5) medCount++;
            else lowCount++;

            if (predictions.size() <= 10 || i < 3) {
                System.out.printf("  [PRED] %s | probability=%.4f | segment=%s%n",
                        recordId, prob, pred.getSegment());
            }
        }

        batchInsert(results);

        long duration = System.currentTimeMillis() - startTime;
        double avgProb = sumProb / predictions.size();
        String logMsg = String.format("Chunk %d records | Prob: avg=%.3f min=%.3f max=%.3f | Segments: High=%d Med=%d Low=%d | %dms",
                chunk.size(), avgProb, minProb, maxProb, highCount, medCount, lowCount, duration);
        logger.info(logMsg);
        System.out.println(logMsg);
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
