package com.devready.controller;

import com.devready.entity.Inquiry;
import com.devready.service.FlashcardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flashcards")
@CrossOrigin(origins = "*") // Allow requests from frontend
public class FlashcardController {

    @Autowired
    private FlashcardService flashcardService;

    @GetMapping("/random")
    public Inquiry getRandomCard(@RequestParam(required = false) String category) {
        return flashcardService.getRandomFlashcard(category);
    }
}
