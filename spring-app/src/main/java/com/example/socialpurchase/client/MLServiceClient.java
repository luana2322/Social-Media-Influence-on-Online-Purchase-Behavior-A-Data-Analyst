package com.example.socialpurchase.client;

import com.example.socialpurchase.dto.BatchPredictionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;
import java.time.Duration;
import java.util.*;

@Component
public class MLServiceClient {
    private static final java.util.logging.Logger logger = java.util.logging.Logger.getLogger(MLServiceClient.class.getName());

    private final WebClient webClient;

    public MLServiceClient(@Value("${ml.service.url:http://localhost:8000}") String mlServiceUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(mlServiceUrl)
                .build();
        logger.info("MLServiceClient initialized with URL: " + mlServiceUrl);
    }

    public List<BatchPredictionResponse> batchPredictChunk(List<Map<String, Object>> chunk, String datasetType) {
        long startTime = System.currentTimeMillis();
        try {
            Map<String, Object> requestBody = new LinkedHashMap<>();
            requestBody.put("datasetType", datasetType != null ? datasetType : "GENERAL");

            List<Map<String, Object>> records = chunk.stream()
                    .map(record -> {
                        Map<String, Object> req = new LinkedHashMap<>();
                        req.put("recordId", record.getOrDefault("id", "unknown").toString());
                        req.put("features", record);
                        return req;
                    })
                    .toList();
            requestBody.put("records", records);

            List<BatchPredictionResponse> responses = webClient.post()
                    .uri("/batch_predict_chunk")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Mono.just(requestBody), (Class<?>) Map.class)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<BatchPredictionResponse>>() {})
                    .retryWhen(Retry.backoff(3, Duration.ofMillis(500)))
                    .block();

            long latency = System.currentTimeMillis() - startTime;
            logger.info(String.format("Batch predict chunk of %d records in %dms (type: %s)", chunk.size(), latency, datasetType));
            return responses != null ? responses : List.of();
        } catch (Exception e) {
            logger.severe("Batch predict chunk failed: " + e.getMessage());
            throw new RuntimeException("ML service batch unavailable: " + e.getMessage(), e);
        }
    }
}
