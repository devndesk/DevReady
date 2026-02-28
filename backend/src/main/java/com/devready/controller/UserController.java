package com.devready.controller;

import com.devready.entity.User;
import com.devready.repository.UserRepository;
import com.devready.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProgressService progressService;

    @GetMapping("/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            // Create a default user if not found
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName("Dev User"); // Default placeholder
            newUser.setRank("NEWBIE");
            return userRepository.save(newUser);
        });
    }

    @PostMapping("/sync")
    public User syncUser(@RequestBody User user) {
        Optional<User> existing = userRepository.findByEmail(user.getEmail());
        if (existing.isPresent()) {
            User current = existing.get();
            user.setId(current.getId());
            return userRepository.save(user);
        }
        return userRepository.save(user);
    }

    @PostMapping("/{userId}/progress")
    public User updateProgress(
            @PathVariable String userId,
            @RequestParam String category,
            @RequestParam boolean correct,
            @RequestParam(required = false, defaultValue = "Easy") String difficulty) {
        return progressService.updateProgress(userId, category, correct, difficulty);
    }
}
