package com.example.socialpurchase.controller;

import com.example.socialpurchase.dto.PredictionRequest;
import com.example.socialpurchase.dto.PredictionResponse;
import com.example.socialpurchase.service.PredictionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.logging.Logger;

@RestController
@RequestMapping("/predict")
public class PredictionController {
    
    private static final Logger logger = Logger.getLogger(PredictionController.class.getName());
    
    private final PredictionService predictionService;
    
    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }
    
    @PostMapping
    public ResponseEntity<PredictionResponse> predict(@Valid @RequestBody PredictionRequest request) {
        logger.info("Received prediction request");
        long startTime = System.currentTimeMillis();
        
        try {
            PredictionResponse response = predictionService.predict(request);
            long latency = System.currentTimeMillis() - startTime;
            logger.info(String.format("Prediction completed in %dms", latency));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            long latency = System.currentTimeMillis() - startTime;
            logger.severe(String.format("Prediction failed after %dms: %s", latency, e.getMessage()));
            PredictionResponse errorResponse = new PredictionResponse();
            errorResponse.setPurchaseProbability(0.0);
            errorResponse.setModelVersion("error");
            errorResponse.setModelType("error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Spring Boot service is running");
    }
}
