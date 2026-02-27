package com.devready.service;

import com.devready.entity.User;
import com.devready.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class ProgressService {

    @Autowired
    private UserRepository userRepository;

    public User updateProgress(String userId, String category, boolean correct, String difficulty) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return null;

        User user = userOpt.get();
        String today = LocalDate.now().toString();

        // 1. Dynamic XP Calculation
        int xpGain = 2; // Default for incorrect
        if (correct) {
            String diff = (difficulty != null) ? difficulty.toLowerCase() : "easy";
            switch (diff) {
                case "hard":
                    xpGain = 30;
                    break;
                case "medium":
                    xpGain = 20;
                    break;
                case "easy":
                default:
                    xpGain = 10;
                    break;
            }
            user.setQuestionsSolved(user.getQuestionsSolved() + 1);

            // Update Mastery
            Map<String, Integer> mastery = user.getMastery();
            if (mastery == null)
                mastery = new HashMap<>();

            int currentMastery = mastery.getOrDefault(category, 0);
            if (currentMastery < 100) {
                mastery.put(category, Math.min(100, currentMastery + 1));
            }
            user.setMastery(mastery);
        }
        user.setTotalXp(user.getTotalXp() + xpGain);

        // 2. Automated Streak Logic (String Based for reliability)
        String lastActivity = user.getLastActivityDate();
        System.out.println("[STREAK DEBUG] Current Streak: " + user.getCurrentStreak());
        System.out.println("[STREAK DEBUG] Last Activity: " + lastActivity);
        System.out.println("[STREAK DEBUG] Today: " + today);

        if (lastActivity == null || user.getCurrentStreak() == 0) {
            System.out.println("[STREAK DEBUG] Initializing streak to 1");
            user.setCurrentStreak(1);
        } else if (!lastActivity.equals(today)) {
            // Check if it was exactly yesterday
            LocalDate todayLD = LocalDate.parse(today);
            LocalDate lastLD = LocalDate.parse(lastActivity);

            if (lastLD.plusDays(1).equals(todayLD)) {
                System.out.println("[STREAK DEBUG] Incrementing streak");
                user.setCurrentStreak(user.getCurrentStreak() + 1);
            } else {
                System.out.println("[STREAK DEBUG] Gap detected, resetting streak to 1");
                user.setCurrentStreak(1);
            }
        } else {
            System.out.println("[STREAK DEBUG] Already active today, streak stays at: " + user.getCurrentStreak());
        }

        // Final Safeguard
        if (user.getCurrentStreak() <= 0) {
            user.setCurrentStreak(1);
        }

        user.setLastActivityDate(today);
        if (user.getCurrentStreak() > user.getLongestStreak()) {
            user.setLongestStreak(user.getCurrentStreak());
        }

        // Rank Calculation Logic
        updateRank(user);

        return userRepository.save(user);
    }

    public User updateStreak(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return null;

        User user = userOpt.get();
        user.setCurrentStreak(user.getCurrentStreak() + 1);

        if (user.getCurrentStreak() > user.getLongestStreak()) {
            user.setLongestStreak(user.getCurrentStreak());
        }

        return userRepository.save(user);
    }

    private void updateRank(User user) {
        int xp = user.getTotalXp();
        if (xp > 5000)
            user.setRank("ELITE");
        else if (xp > 2000)
            user.setRank("PRO");
        else if (xp > 500)
            user.setRank("JUNIOR");
        else
            user.setRank("NEWBIE");
    }
}
