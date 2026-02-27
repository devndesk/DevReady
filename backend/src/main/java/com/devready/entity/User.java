package com.devready.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Map;

@Document(collection = "users")
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;
    private String name;
    private String position;
    private String email;
    private String phone;
    private String profilePic;
    private String rank; // "PRO", "Elite", etc.

    // Core Stats
    private int totalXp;
    private int currentStreak;
    private int longestStreak;
    private int questionsSolved;
    private String lastActivityDate; // Format: YYYY-MM-DD

    // Mastery Progress (Category -> Percentage)
    private Map<String, Integer> mastery;

    // Earned Badges
    private List<Badge> badges;

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }

    public String getRank() {
        return rank;
    }

    public void setRank(String rank) {
        this.rank = rank;
    }

    public int getTotalXp() {
        return totalXp;
    }

    public void setTotalXp(int totalXp) {
        this.totalXp = totalXp;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }

    public int getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(int longestStreak) {
        this.longestStreak = longestStreak;
    }

    public int getQuestionsSolved() {
        return questionsSolved;
    }

    public void setQuestionsSolved(int questionsSolved) {
        this.questionsSolved = questionsSolved;
    }

    public String getLastActivityDate() {
        return lastActivityDate;
    }

    public void setLastActivityDate(String lastActivityDate) {
        this.lastActivityDate = lastActivityDate;
    }

    public Map<String, Integer> getMastery() {
        return mastery;
    }

    public void setMastery(Map<String, Integer> mastery) {
        this.mastery = mastery;
    }

    public List<Badge> getBadges() {
        return badges;
    }

    public void setBadges(List<Badge> badges) {
        this.badges = badges;
    }

    @NoArgsConstructor
    @AllArgsConstructor
    public static class Badge {
        private String name;
        private boolean unlocked;
        private String icon; // Icon name from lucide-react

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public boolean isUnlocked() {
            return unlocked;
        }

        public void setUnlocked(boolean unlocked) {
            this.unlocked = unlocked;
        }

        public String getIcon() {
            return icon;
        }

        public void setIcon(String icon) {
            this.icon = icon;
        }
    }
}
