package com.example.socialpurchase.client;

import com.example.socialpurchase.dto.PredictionRequest;
import com.example.socialpurchase.dto.PredictionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;
import reactor.util.retry.Retry;
import java.time.Duration;
import java.util.logging.Logger;

@Component
public class MLServiceClient {
    
    private static final Logger logger = Logger.getLogger(MLServiceClient.class.getName());
    
    private final WebClient webClient;
    
    public MLServiceClient(@Value("${ml.service.url:http://localhost:8000}") String mlServiceUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(mlServiceUrl)
                .clientConnector(new ReactorClientHttpConnector(
                    HttpClient.create()
                        .responseTimeout(Duration.ofSeconds(5))
                        .option(io.netty.channel.ChannelOption.CONNECT_TIMEOUT_MILLIS, 3000)
                ))
                .build();
        logger.info("MLServiceClient initialized with URL: " + mlServiceUrl);
    }
    
    public PredictionResponse predict(PredictionRequest request) {
        String requestId = java.util.UUID.randomUUID().toString().substring(0, 8);
        long startTime = System.currentTimeMillis();
        
        logger.info(String.format("[%s] Calling ML service /predict", requestId));
        
        try {
            PredictionResponse response = webClient.post()
                    .uri("/predict")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Mono.just(request), PredictionRequest.class)
                    .retrieve()
                    .bodyToMono(PredictionResponse.class)
                    .retryWhen(Retry.backoff(3, Duration.ofMillis(500))
                            .filter(throwable -> !(throwable instanceof WebClientResponseException))
                            .onRetryExhaustedThrow((retrySpec, retrySignal) -> 
                                new RuntimeException("Retry exhausted for ML service call")))
                    .block();
            
            long latency = System.currentTimeMillis() - startTime;
            logger.info(String.format("[%s] ML service responded in %dms with probability: %.4f", 
                    requestId, latency, response.getPurchaseProbability()));
            
            return response;
            
        } catch (Exception e) {
            long latency = System.currentTimeMillis() - startTime;
            logger.severe(String.format("[%s] ML service call failed after %dms: %s", 
                    requestId, latency, e.getMessage()));
            throw new RuntimeException("ML service unavailable: " + e.getMessage(), e);
        }
    }
}
