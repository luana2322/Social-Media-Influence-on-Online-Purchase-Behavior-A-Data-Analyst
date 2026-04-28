package com.example.socialpurchase.service;

import com.example.socialpurchase.client.OpenAiClient;
import com.example.socialpurchase.entity.ChatHistory;
import com.example.socialpurchase.entity.PredictionResult;
import com.example.socialpurchase.repository.ChatHistoryRepository;
import com.example.socialpurchase.repository.PredictionResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class ChatbotService {
    private static final Logger logger = Logger.getLogger(ChatbotService.class.getName());

    @Autowired private PredictionResultRepository predictionResultRepository;
    @Autowired private ChatHistoryRepository chatHistoryRepository;
    @Autowired private OpenAiClient openAiClient;

    public String askQuestion(String question, Long jobId, Long userId) {
        List<PredictionResult> results = predictionResultRepository.findByJobId(jobId);
        String context = buildDetailedContext(results);

        String prompt = String.format("""
            You are an expert marketing AI assistant.

            ## Context:
            %s

            ## Question:
            %s

            ## Instructions:
            1. Analyze segment distribution and identify targeting opportunities
            2. Explain WHY certain users are high/low intent (use feature importance)
            3. Provide SPECIFIC, ACTIONABLE marketing recommendations
            4. If asked "why", cite specific features and their impact
            5. Suggest campaign types based on segment characteristics

            ## Response Format:
            - Summary: [key insight]
            - Target: [which users, why]
            - Action: [specific next steps]
            - Expected Impact: [realistic outcome]
            """, context, question);

        String answer = openAiClient.callApi(prompt);

        ChatHistory history = new ChatHistory();
        history.setUserId(userId);
        history.setJobId(jobId);
        history.setQuestion(question);
        history.setAnswer(answer);
        chatHistoryRepository.save(history);

        return answer;
    }

    private String buildDetailedContext(List<PredictionResult> results) {
        if (results.isEmpty()) {
            return "No prediction results available yet.";
        }

        long high = results.stream().filter(r -> "High".equals(r.getSegment())).count();
        long medium = results.stream().filter(r -> "Medium".equals(r.getSegment())).count();
        long low = results.stream().filter(r -> "Low".equals(r.getSegment())).count();

        double avgProb = results.stream()
                .mapToDouble(PredictionResult::getProbability)
                .average().orElse(0.0);

        return String.format("""
            Total predictions: %d
            Segment distribution:
            - High intent (>0.8): %d users (%.1f%%)
            - Medium intent (0.4-0.8): %d users (%.1f%%)
            - Low intent (<0.4): %d users (%.1f%%)

            Average purchase probability: %.2f%%

            Key features driving predictions: PageValues, BounceRates, avg_sentiment, total_engagement

            Model: XGBoost (ROC-AUC: 0.954)
            """,
            results.size(),
            high, (high * 100.0 / results.size()),
            medium, (medium * 100.0 / results.size()),
            low, (low * 100.0 / results.size()),
            avgProb * 100);
    }

    public List<ChatHistory> getChatHistory(Long userId) {
        return chatHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
