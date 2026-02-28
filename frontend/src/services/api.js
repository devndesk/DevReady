import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://devready.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const userService = {
    getUser: async (email) => {
        const response = await api.get(`/users/${email}`);
        return response.data;
    },
    syncUser: async (userData) => {
        const response = await api.post('/users/sync', userData);
        return response.data;
    },
    updateProgress: async (userId, category, correct, difficulty) => {
        const response = await api.post(`/users/${userId}/progress`, null, {
            params: { category, correct, difficulty }
        });
        return response.data;
    },
};

export const flashcardService = {
    getRandomCard: async (category) => {
        const response = await api.get('/flashcards/random', {
            params: { category }
        });
        return response.data;
    },
};

export const streakService = {
    updateStreak: async (userId) => {
        const response = await api.post(`/streaks/${userId}/update`);
        return response.data;
    },
};

export const leagueService = {
    getLeaderboard: async (leagueGroupId) => {
        const response = await api.get('/league/leaderboard', {
            params: { leagueGroupId }
        });
        return response.data;
    },
};

export default api;
