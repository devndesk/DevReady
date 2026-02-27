package com.devready.service;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class StreakService {

    // Simulating database storage for user streaks
    private Map<Long, Integer> userStreaks = new HashMap<>();
    private Map<Long, LocalDate> lastActivityDate = new HashMap<>();

    public int updateStreak(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate lastDate = lastActivityDate.getOrDefault(userId, null);
        int currentStreak = userStreaks.getOrDefault(userId, 0);

        if (lastDate != null) {
            if (lastDate.equals(today.minusDays(1))) {
                // Continued streak
                currentStreak++;
            } else if (!lastDate.equals(today)) {
                // Broken streak, reset
                currentStreak = 1;
            }
            // If equal to today, do nothing (streak already updated for today)
        } else {
            // First time
            currentStreak = 1;
        }

        userStreaks.put(userId, currentStreak);
        lastActivityDate.put(userId, today);
        
        return currentStreak;
    }
    
    public int getStreak(Long userId) {
        return userStreaks.getOrDefault(userId, 0);
    }
}
