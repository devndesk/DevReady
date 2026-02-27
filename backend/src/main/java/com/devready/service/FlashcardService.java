package com.devready.service;

import com.devready.entity.Inquiry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

@Service
public class FlashcardService {

    @Autowired
    private MongoTemplate mongoTemplate;

    public Inquiry getRandomFlashcard(String category) {
        Aggregation aggregation;
        if (category != null && !category.isEmpty()) {
            aggregation = Aggregation.newAggregation(
                    Aggregation.match(Criteria.where("category").is(category)),
                    Aggregation.sample(1));
        } else {
            aggregation = Aggregation.newAggregation(
                    Aggregation.sample(1));
        }

        AggregationResults<Inquiry> results = mongoTemplate.aggregate(aggregation, "inquiries", Inquiry.class);
        return results.getUniqueMappedResult();
    }
}
