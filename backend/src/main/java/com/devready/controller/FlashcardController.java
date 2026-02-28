package com.devready.controller;

import com.devready.dto.QuizQuestion;
import com.devready.service.FlashcardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flashcards")
@CrossOrigin(origins = "*") // Allow requests from frontend
public class FlashcardController {

    @Autowired
    private FlashcardService flashcardService;

    @GetMapping("/random")
    public QuizQuestion getRandomCard(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) List<String> excludeIds) {
        System.out.println("[API] Request: category=" + category + ", excludeIdsSize=" + (excludeIds != null ? excludeIds.size() : 0));
        return flashcardService.getRandomFlashcard(category, excludeIds);
    }
}
