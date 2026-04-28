package com.example.socialpurchase.controller;

import com.example.socialpurchase.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {
    private static final Logger logger = Logger.getLogger(ChatbotController.class.getName());

    @Autowired private ChatbotService chatbotService;

    @PostMapping("/ask")
    public ResponseEntity<?> askQuestion(@RequestBody Map<String, Object> request) {
        try {
            String question = (String) request.get("question");
            Long jobId = Long.valueOf(request.get("jobId").toString());
            Long userId = request.containsKey("userId") ? Long.valueOf(request.get("userId").toString()) : 1L;

            String answer = chatbotService.askQuestion(question, jobId, userId);
            return ResponseEntity.ok().body(Map.of("answer", answer));
        } catch (Exception e) {
            logger.severe("Chatbot error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
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
