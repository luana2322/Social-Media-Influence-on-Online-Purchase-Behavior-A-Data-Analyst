package com.example.socialpurchase.service;

import com.example.socialpurchase.client.MLServiceClient;
import com.example.socialpurchase.dto.PredictionRequest;
import com.example.socialpurchase.dto.PredictionResponse;
import org.springframework.stereotype.Service;
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
            PredictionResponse response = mlServiceClient.predict(request);
            logger.info(String.format("Prediction successful: probability=%.4f", 
                    response.getPurchaseProbability()));
            return response;
        } catch (Exception e) {
            logger.severe("Prediction failed: " + e.getMessage());
            throw e;
        }
    }
}
