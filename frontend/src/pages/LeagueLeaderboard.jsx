import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Timer, Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { leagueService } from '../services/api';

const LeagueLeaderboard = ({ user }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [timeLeft, setTimeLeft] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const leagues = [
        { name: 'BRONZE', color: 'text-orange-400', glow: 'shadow-orange-500/20' },
        { name: 'SILVER', color: 'text-gray-300', glow: 'shadow-gray-300/20' },
        { name: 'GOLD', color: 'text-yellow-400', glow: 'shadow-yellow-400/20' },
        { name: 'SAPPHIRE', color: 'text-blue-400', glow: 'shadow-blue-500/20' },
        { name: 'RUBY', color: 'text-red-500', glow: 'shadow-red-500/20' },
        { name: 'EMERALD', color: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
        { name: 'AMETHYST', color: 'text-purple-400', glow: 'shadow-purple-500/20' },
        { name: 'PEARL', color: 'text-pink-300', glow: 'shadow-pink-300/20' },
        { name: 'OBSIDIAN', color: 'text-slate-500', glow: 'shadow-slate-500/20' },
        { name: 'DIAMOND', color: 'text-cyan-400', glow: 'shadow-cyan-400/20' }
    ];

    const currentLeagueInfo = leagues.find(l => l.name === user.currentLeague) || leagues[0];

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!user.leagueGroupId) {
                setIsLoading(false);
                return;
            }
            try {
                const data = await leagueService.getLeaderboard(user.leagueGroupId);
                setLeaderboard(data);
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();

        // Auto-refresh leaderboard data every 30s
        const refreshInterval = setInterval(fetchLeaderboard, 30000);

        // Timer Logic (Countdown to next Monday 00:00)
        const updateTimer = () => {
            const now = new Date();
            const nextMonday = new Date();
            nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
            nextMonday.setHours(0, 0, 0, 0);

            if (nextMonday <= now) nextMonday.setDate(nextMonday.getDate() + 7);

            const diff = nextMonday - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            setTimeLeft(`${days}d ${hours}h ${mins}m`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 60000);
        return () => {
            clearInterval(interval);
            clearInterval(refreshInterval);
        };
    }, [user.leagueGroupId]);

    return (
        <div className="min-h-screen p-6 pb-24 relative overflow-hidden">
            {/* Header Area */}
            <div className="max-w-md mx-auto mb-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-mono font-bold tracking-widest uppercase mb-4">
                    <Shield size={14} className="animate-pulse" /> {user.currentLeague} LEAGUE ACTIVE
                </div>
                <h2 className="text-3xl font-black text-white tracking-tighter">GLOBAL <span className="text-gradient">LEADERBOARD</span></h2>

                <div className="flex items-center justify-center gap-4 mt-6">
                    <div className="glass-panel px-4 py-2 rounded-2xl flex items-center gap-2 border-white/5">
                        <Timer size={16} className="text-emerald-400" />
                        <span className="text-xs font-mono font-bold text-gray-300">{timeLeft}</span>
                    </div>
                </div>
            </div>

            {/* Main Leaderboard */}
            <div className="max-w-md mx-auto space-y-3">
                {!user.leagueGroupId ? (
                    <div className="glass-panel p-12 text-center rounded-[2.5rem] border-white/10">
                        <Trophy size={48} className="mx-auto mb-4 text-gray-600 opacity-20" />
                        <p className="text-gray-400 text-sm font-medium">Solve a question to join this week's league and start competing!</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex justify-center p-12">
                        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-2">
                        {leaderboard.length === 0 ? (
                            <div className="glass-panel p-12 text-center rounded-[2.5rem] border-white/10">
                                <Trophy size={48} className="mx-auto mb-4 text-emerald-500/20" />
                                <p className="text-gray-400 text-sm font-medium">Synchronizing your group leaderboard...</p>
                                <p className="text-[10px] text-gray-600 mt-2 font-mono">This usually takes a few seconds.</p>
                            </div>
                        ) : leaderboard.map((item, index) => {
                            const isCurrentUser = item.email === user.email;
                            const isPromotionZone = index < 3;

                            return (
                                <motion.div
                                    key={item.id || item._id || index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`relative glass-panel p-4 rounded-2xl flex items-center justify-between border-white/5 ${isCurrentUser ? 'ring-1 ring-emerald-500/50 bg-emerald-500/5' : ''
                                        } ${isPromotionZone ? 'before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-emerald-500 shadow-lg shadow-emerald-500/5' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`w-6 text-center font-mono text-sm font-bold ${index === 0 ? 'text-yellow-400' :
                                            index === 1 ? 'text-gray-300' :
                                                index === 2 ? 'text-orange-400' : 'text-gray-500'
                                            }`}>
                                            {index + 1}
                                        </span>
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white font-bold text-sm">
                                                {item.name ? item.name[0] : 'U'}
                                            </div>
                                            {isPromotionZone && (
                                                <div className="absolute -top-1 -right-1">
                                                    <TrendingUp size={12} className="text-emerald-500 bg-bg-primary rounded-full" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold ${isCurrentUser ? 'text-emerald-400' : 'text-white/90'}`}>
                                                {item.name || 'Anonymous User'}
                                            </p>
                                            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">{item.rank}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-black text-white">{item.weeklyXp}</p>
                                        <p className="text-[9px] text-gray-500 font-mono uppercase">WEEKLY XP</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* League info badge (Floating) */}
            <div className={`fixed top-6 right-6 glass-panel py-2 px-4 rounded-xl border-white/10 flex items-center gap-2 ${currentLeagueInfo.glow}`}>
                <Shield size={14} className={currentLeagueInfo.color} />
                <span className={`text-[10px] font-black font-mono tracking-tighter ${currentLeagueInfo.color}`}>{user.currentLeague}</span>
            </div>
        </div>
    );
};

export default LeagueLeaderboard;
