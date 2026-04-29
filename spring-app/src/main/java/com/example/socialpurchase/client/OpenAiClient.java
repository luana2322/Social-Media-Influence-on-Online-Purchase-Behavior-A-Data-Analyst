package com.example.socialpurchase.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Component
public class OpenAiClient {
    private static final Logger logger = Logger.getLogger(OpenAiClient.class.getName());

    @Value("${openai.api.key:}")
    private String apiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    @Value("${openai.model:gpt-3.5-turbo}")
    private String model;

    private final WebClient webClient;

    public OpenAiClient() {
        this.webClient = WebClient.builder().build();
    }

    public String callApi(String prompt) {
        return callApi(null, prompt);
    }

    public String callApi(String systemPrompt, String userPrompt) {
        if (apiKey == null || apiKey.isEmpty() || "dummy".equals(apiKey)) {
            logger.warning("OpenAI API key not configured, returning mock response");
            return "This is a mock response. Please configure openai.api.key for real responses.";
        }

        try {
            List<Map<String, String>> messages;
            if (systemPrompt != null && !systemPrompt.isEmpty()) {
                messages = List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", userPrompt)
                );
            } else {
                messages = List.of(Map.of("role", "user", "content", userPrompt));
            }

            Map<String, Object> request = Map.of(
                "model", model,
                "messages", messages,
                "temperature", 0.7
            );

            Map response = webClient.post()
                    .uri(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Mono.just(request), Map.class)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .retryWhen(Retry.backoff(3, Duration.ofSeconds(1)))
                    .block();

            List choices = (List) response.get("choices");
            Map firstChoice = (Map) choices.get(0);
            Map message = (Map) firstChoice.get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            logger.severe("OpenAI API call failed: " + e.getMessage());
            return "Error: Unable to get response from AI service.";
        }
    }
}
