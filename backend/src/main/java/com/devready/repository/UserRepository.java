package com.devready.repository;

import com.devready.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    java.util.List<User> findByLeagueGroupId(String leagueGroupId);
}
