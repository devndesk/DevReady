package com.devready.service;

import com.devready.entity.League;
import com.devready.entity.User;
import com.devready.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeagueService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Finds or creates a group for the user's current league.
     * Groups are limited to 50 users.
     */
    public String assignToGroup(User user) {
        League currentLeague = user.getCurrentLeague();

        // Find all users in this league to see group distribution
        // In a real production app, we would use a dedicated 'LeagueGroup' entity for
        // performance.
        // For now, we'll query by league and group users.

        List<User> allInLeague = userRepository.findAll().stream()
                .filter(u -> u.getCurrentLeague() == currentLeague && u.getLeagueGroupId() != null)
                .collect(Collectors.toList());

        Map<String, Long> groupCounts = allInLeague.stream()
                .collect(Collectors.groupingBy(User::getLeagueGroupId, Collectors.counting()));

        // Find a group with space
        for (Map.Entry<String, Long> entry : groupCounts.entrySet()) {
            if (entry.getValue() < 50) {
                return entry.getKey();
            }
        }

        // No space or no groups yet, create new ID
        return currentLeague.name() + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    public List<User> getLeaderboard(String leagueGroupId) {
        if (leagueGroupId == null)
            return new ArrayList<>();
        return userRepository.findByLeagueGroupId(leagueGroupId).stream()
                .sorted(Comparator.comparing(User::getWeeklyXp).reversed())
                .collect(Collectors.toList());
    }

    /**
     * Runs every Monday at 12:00 AM
     */
    @Scheduled(cron = "0 0 0 * * MON")
    public void performWeeklyReset() {
        System.out.println("[LEAGUE] Starting Weekly Reset & Promotion Cycle...");

        List<User> allUsers = userRepository.findAll();
        Map<String, List<User>> groups = allUsers.stream()
                .filter(u -> u.getLeagueGroupId() != null)
                .collect(Collectors.groupingBy(User::getLeagueGroupId));

        for (Map.Entry<String, List<User>> entry : groups.entrySet()) {
            List<User> groupUsers = entry.getValue().stream()
                    .sorted(Comparator.comparing(User::getWeeklyXp).reversed())
                    .collect(Collectors.toList());

            if (groupUsers.isEmpty())
                continue;

            // 1. Promotions (Top 3)
            for (int i = 0; i < Math.min(3, groupUsers.size()); i++) {
                promoteUser(groupUsers.get(i));
            }

            // 2. Demotions (Bottom 5)
            if (groupUsers.size() > 10) { // Only demote if group is somewhat full
                for (int i = groupUsers.size() - 1; i >= Math.max(0, groupUsers.size() - 5); i--) {
                    demoteUser(groupUsers.get(i));
                }
            }
        }

        // 3. Reset Weekly XP and clear groups (to be reassigned on first XP gain)
        for (User user : allUsers) {
            user.setWeeklyXp(0L);
            user.setLeagueGroupId(null);
            userRepository.save(user);
        }

        System.out.println("[LEAGUE] Weekly Cycle Complete.");
    }

    private void promoteUser(User user) {
        League current = user.getCurrentLeague();
        League[] leagues = League.values();
        if (current.ordinal() < leagues.length - 1) {
            user.setCurrentLeague(leagues[current.ordinal() + 1]);
        }
    }

    private void demoteUser(User user) {
        League current = user.getCurrentLeague();
        if (current.ordinal() > 0) {
            user.setCurrentLeague(League.values()[current.ordinal() - 1]);
        }
    }
}
