package com.devready.controller;

import com.devready.service.ProgressService;
import com.devready.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/streaks")
@CrossOrigin(origins = "*")
public class StreakController {

    @Autowired
    private ProgressService progressService;

    @PostMapping("/{userId}/update")
    public User updateStreak(@PathVariable String userId) {
        return progressService.updateStreak(userId);
    }
}
