package com.devready.service;

import com.devready.entity.Inquiry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import com.devready.dto.QuizQuestion;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class FlashcardService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private AiService aiService;

    @Autowired
    private com.devready.repository.InquiryRepository inquiryRepository;

    public QuizQuestion getRandomFlashcard(String category, List<String> excludeIds) {
        String targetCategory = (category != null && !category.isEmpty()) ? category : "Java Core";
        System.out.println("[FLASHCARD] Request for category: " + targetCategory + " (Excluding: " + (excludeIds != null ? excludeIds.size() : 0) + ")");

        // 1. Calculate Unseen Count
        Criteria poolCriteria = Criteria.where("category").is(targetCategory);
        if (excludeIds != null && !excludeIds.isEmpty()) {
            poolCriteria = poolCriteria.and("_id").nin(excludeIds);
        }
        
        long unseenCount = mongoTemplate.count(
                org.springframework.data.mongodb.core.query.Query.query(poolCriteria),
                "inquiries"
        );

        // 2. Proactive AI Generation (If pool is empty or very small)
        if (unseenCount < 2) { 
            System.out.println("[FLASHCARD] Critical Pool Alert (" + unseenCount + "). Synergizing with Groq...");
            try {
                List<Inquiry> aiCards = aiService.generateFlashcards(targetCategory, 12);
                if (!aiCards.isEmpty()) {
                    inquiryRepository.saveAll(aiCards);
                    System.out.println("[FLASHCARD] Injected 12 fresh neural nodes.");
                    // Reset criteria to include newly added cards
                    poolCriteria = Criteria.where("category").is(targetCategory);
                    if (excludeIds != null && !excludeIds.isEmpty()) {
                        poolCriteria = poolCriteria.and("_id").nin(excludeIds);
                    }
                }
            } catch (Exception e) {
                System.err.println("[FLASHCARD] AI Synergetic failure: " + e.getMessage());
            }
        }

        // 3. Select Principal Question
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(poolCriteria),
                Aggregation.sample(1)
        );
        AggregationResults<Inquiry> results = mongoTemplate.aggregate(aggregation, "inquiries", Inquiry.class);
        Inquiry mainCard = results.getUniqueMappedResult();

        // 4. Recovery: If still null after AI attempt, reset exclusion
        if (mainCard == null && excludeIds != null && !excludeIds.isEmpty()) {
             System.out.println("[FLASHCARD] Neural loop complete. Resetting seen list.");
             return getRandomFlashcard(targetCategory, null);
        }

        if (mainCard == null) {
            System.out.println("[FLASHCARD] ERROR: Neural network empty. Returning fallback.");
            return getFallbackQuestion(targetCategory);
        }

        // 5. Build MCQ Options
        Aggregation distractorAggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("category").is(targetCategory).and("_id").ne(mainCard.getId())),
                Aggregation.sample(3)
        );
        AggregationResults<Inquiry> distractorResults = mongoTemplate.aggregate(distractorAggregation, "inquiries", Inquiry.class);
        List<Inquiry> distractors = distractorResults.getMappedResults();

        List<String> options = new ArrayList<>();
        options.add(mainCard.getAnswer());
        for (Inquiry d : distractors) {
            options.add(d.getAnswer());
        }
        
        while (options.size() < 4) {
             options.add("Neural Distractor Node " + (options.size() + 1));
        }
        Collections.shuffle(options);

        // Normalize Difficulty
        String diff = (mainCard.getDifficultyLevel() != null && !mainCard.getDifficultyLevel().isEmpty()) 
                       ? mainCard.getDifficultyLevel() : "Medium";

        QuizQuestion q = new QuizQuestion(
                mainCard.getId(),
                mainCard.getCategory(),
                mainCard.getQuestion(),
                mainCard.getAnswer(),
                options,
                diff
        );
        System.out.println("[FLASHCARD] Dispatched: ID=" + q.getId() + " | Diff=" + q.getDifficulty());
        return q;
    }

    private QuizQuestion getFallbackQuestion(String category) {
        List<String> options = new ArrayList<>(List.of(
            "Finalize code and reset server",
            "Check neural connectivity",
            "Re-generate AI dataset",
            "Initialize local cache"
        ));
        Collections.shuffle(options);
        return new QuizQuestion(
            UUID.randomUUID().toString(),
            category,
            "System is still learning this node. What is the first step to fix a data loading error?",
            "Initialize local cache",
            options,
            "Medium"
        );
    }
}
