package com.example.socialpurchase.client;

import com.example.socialpurchase.dto.BatchPredictionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Component
public class MLServiceClient {
    private static final Logger logger = Logger.getLogger(MLServiceClient.class.getName());

    private final WebClient webClient;

    public MLServiceClient(@Value("${ml.service.url:http://localhost:8000}") String mlServiceUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(mlServiceUrl)
                .build();
        logger.info("MLServiceClient initialized with URL: " + mlServiceUrl);
    }

    public List<BatchPredictionResponse> batchPredictChunk(List<Map<String, Object>> chunk) {
        long startTime = System.currentTimeMillis();
        try {
            List<Map<String, Object>> requests = chunk.stream()
                    .map(record -> {
                        Map<String, Object> req = new java.util.HashMap<>();
                        req.put("recordId", record.getOrDefault("id", "unknown").toString());
                        req.put("features", record);
                        return req;
                    })
                    .toList();

            List<BatchPredictionResponse> responses = webClient.post()
                    .uri("/batch_predict_chunk")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Mono.just(requests), (Class<?>) List.class)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<BatchPredictionResponse>>() {})
                    .retryWhen(Retry.backoff(3, Duration.ofMillis(500)))
                    .block();

            long latency = System.currentTimeMillis() - startTime;
            logger.info(String.format("Batch predict chunk of %d records in %dms", chunk.size(), latency));
            return responses != null ? responses : List.of();
        } catch (Exception e) {
            logger.severe("Batch predict chunk failed: " + e.getMessage());
            throw new RuntimeException("ML service batch unavailable: " + e.getMessage(), e);
        }
    }
}
