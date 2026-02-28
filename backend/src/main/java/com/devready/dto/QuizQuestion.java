package com.devready.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizQuestion {
    private String id;
    private String category;
    private String question;
    private String correctAnswer;
    private List<String> options;
    private String difficulty;
}
