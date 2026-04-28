package com.example.socialpurchase.service;

import com.example.socialpurchase.client.MLServiceClient;
import com.example.socialpurchase.dto.BatchPredictionResponse;
import com.example.socialpurchase.dto.PredictionRequest;
import com.example.socialpurchase.dto.PredictionResponse;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class PredictionService {
    
    private static final Logger logger = Logger.getLogger(PredictionService.class.getName());
    
    private final MLServiceClient mlServiceClient;
    
    public PredictionService(MLServiceClient mlServiceClient) {
        this.mlServiceClient = mlServiceClient;
    }
    
    public PredictionResponse predict(PredictionRequest request) {
        logger.info("Processing prediction request");
        try {
            Map<String, Object> features = new java.util.HashMap<>();
            features.put("PageValues", request.getPageValues());
            features.put("BounceRates", request.getBounceRates());
            features.put("ExitRates", request.getExitRates());
            features.put("ProductRelated", request.getProductRelated());
            features.put("Administrative", request.getAdministrative());
            features.put("avg_sentiment", request.getAvgSentiment());
            features.put("total_engagement", request.getTotalEngagement());
            features.put("positive_ratio", request.getPositiveRatio());
            features.put("engagement_norm", request.getEngagementNorm());
            features.put("global_avg_price", request.getGlobalAvgPrice());
            features.put("Month", request.getMonth());
            features.put("OperatingSystems", request.getOperatingSystems());
            features.put("Browser", request.getBrowser());
            features.put("Region", request.getRegion());
            features.put("TrafficType", request.getTrafficType());
            features.put("VisitorType", request.getVisitorType());
            features.put("Weekend", request.getWeekend());

            List<Map<String, Object>> chunk = new java.util.ArrayList<>();
            chunk.add(features);
            List<BatchPredictionResponse> responses = mlServiceClient.batchPredictChunk(chunk);

            PredictionResponse response = new PredictionResponse();
            if (!responses.isEmpty()) {
                response.setPurchaseProbability(responses.get(0).getProbability());
                response.setModelVersion(responses.get(0).getModelVersion());
            }
            response.setModelType("XGBoost");
            return response;
        } catch (Exception e) {
            logger.severe("Prediction failed: " + e.getMessage());
            throw e;
        }
    }
}
