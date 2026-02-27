package com.devready.repository;

import com.devready.entity.Inquiry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InquiryRepository extends MongoRepository<Inquiry, String> {

    List<Inquiry> findByCategory(String category);
}
