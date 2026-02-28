package com.devready.service;

import com.devready.entity.Inquiry;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final String API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Inquiry> generateFlashcards(String category, int count) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        String prompt = String.format(
            "Generate EXACTLY %d diverse, advanced, and unique technical interview flashcards for the topic '%s'. " +
            "Focus on non-obvious edge cases, architectural patterns, and deep-dive concepts. " +
            "Avoid basic definitions. Category MUST be exactly '%s'. " +
            "Response MUST be a raw JSON array of objects: " +
            "[{\"category\": \"...\", \"question\": \"...\", \"answer\": \"...\", \"difficultyLevel\": \"Easy/Medium/Hard\"}]. " +
            "No markdown, no preamble.",
            count, category, category
        );

        Map<String, Object> requestBody = Map.of(
            "model", "llama-3.3-70b-versatile",
            "messages", List.of(
                Map.of("role", "system", "content", "You are an elite technical interviewer. You provide unique, high-quality JSON data only."),
                Map.of("role", "user", "content", prompt)
            ),
            "temperature", 0.8
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(API_URL, entity, String.class);
            System.out.println("[AI DEBUG] Raw Response: " + response.getBody());
            return parseGrokResponse(response.getBody(), category);
        } catch (Exception e) {
            System.err.println("[AI ERROR] API Call Failed: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private List<Inquiry> parseGrokResponse(String responseBody, String requestedCategory) {
        List<Inquiry> inquiries = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            String content = root.path("choices").get(0).path("message").path("content").asText();
            
            // Extreme cleaning
            content = content.trim();
            if (content.contains("[") && content.contains("]")) {
                content = content.substring(content.indexOf("["), content.lastIndexOf("]") + 1);
            }

            JsonNode cardsArray = objectMapper.readTree(content);
            if (cardsArray.isArray()) {
                for (JsonNode node : cardsArray) {
                    Inquiry inquiry = new Inquiry();
                    inquiry.setCategory(requestedCategory);
                    inquiry.setQuestion(node.path("question").asText());
                    inquiry.setAnswer(node.path("answer").asText());
                    inquiry.setDifficultyLevel(node.path("difficultyLevel").asText("Medium"));
                    
                    if (inquiry.getQuestion() != null && !inquiry.getQuestion().isEmpty()) {
                        inquiries.add(inquiry);
                    }
                }
            }
            System.out.println("[AI DEBUG] Successfully parsed " + inquiries.size() + " cards.");
        } catch (Exception e) {
            System.err.println("[AI ERROR] Parsing Failed for body: " + responseBody);
            System.err.println("[AI ERROR] Exception: " + e.getMessage());
        }
        return inquiries;
    }
}
