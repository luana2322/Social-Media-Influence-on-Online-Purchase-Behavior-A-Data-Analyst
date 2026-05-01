package com.example.socialpurchase.controller;

import com.example.socialpurchase.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/chatbot")
public class ChatbotController {
    private static final Logger logger = Logger.getLogger(ChatbotController.class.getName());

    @Autowired private ChatbotService chatbotService;

    @PostMapping("/ask")
    public ResponseEntity<?> askQuestion(@RequestBody Map<String, Object> request) {
        try {
            String question = (String) request.get("question");
            Object jobIdObj = request.get("jobId");

            if (question == null || question.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Question is required"));
            }
            if (jobIdObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "jobId is required"));
            }

            Long jobId = Long.valueOf(jobIdObj.toString());
            Long userId = request.containsKey("userId") ? Long.valueOf(request.get("userId").toString()) : 1L;

            String answer = chatbotService.askQuestion(question, jobId, userId);
            return ResponseEntity.ok().body(Map.of("answer", answer));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid jobId or userId format"));
        } catch (Exception e) {
            logger.severe("Chatbot error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<?> getChatHistory(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok().body(chatbotService.getChatHistory(userId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
