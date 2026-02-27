import { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Zap, Target, Star, Settings, ChevronRight, Award,
    Clock, BookOpen, User as UserIcon, Camera, Save, X, Mail, Phone, Briefcase
} from 'lucide-react';

const Profile = ({ setActiveTab }) => {
    // State for user info
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('devready_user');
        return saved ? JSON.parse(saved) : {
            name: 'Elite Architect',
            position: 'Senior Software Engineer',
            email: 'dev.architect@example.com',
            phone: '+91 98765 43210',
            profilePic: null, // null means use default icon
            rank: 'PRO'
        };
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(user);
    const fileInputRef = useRef(null);

    // Persist user data
    useEffect(() => {
        localStorage.setItem('devready_user', JSON.stringify(user));
    }, [user]);

    const handleSave = () => {
        setUser(editForm);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditForm(user);
        setIsEditing(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('devready_user');
        // If setActiveTab is provided, use it, otherwise fallback to reload
        if (setActiveTab) {
            setActiveTab('home');
        }
        window.location.reload();
    };

    const handleExport = () => {
        const data = {
            user,
            stats,
            mastery,
            badges,
            exportDate: new Date().toLocaleString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `devready_training_logs_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm({ ...editForm, profilePic: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const stats = [
        { label: 'Current Streak', value: `${user.currentStreak || 0} Days`, icon: Zap, color: 'text-orange-400' },
        { label: 'Longest Streak', value: `${user.longestStreak || 0} Days`, icon: Zap, color: 'text-emerald-400' },
        { label: 'Questions Solved', value: `${user.questionsSolved || 0}`, icon: Target, color: 'text-blue-400' },
        { label: 'Total XP Gain', value: `${user.totalXp || 0} XP`, icon: Star, color: 'text-purple-400' },
    ];

    const badges = (user.badges || []).map(b => ({
        id: b.name,
        name: b.name,
        icon: Star,
        unlocked: true
    }));

    // Add some default locked badges if none earned
    if (badges.length < 4) {
        badges.push({ id: 'locked1', name: 'Code Ninja', icon: Zap, unlocked: false });
        badges.push({ id: 'locked2', name: 'System Architect', icon: Trophy, unlocked: false });
    }

    const mastery = [
        { name: 'Java Core', progress: user.mastery?.['Java Core'] || 0, color: 'bg-blue-500' },
        { name: 'Spring Boot', progress: user.mastery?.['Spring Boot'] || 0, color: 'bg-emerald-500' },
        { name: 'DSA', progress: user.mastery?.['DSA'] || 0, color: 'bg-purple-500' },
        { name: 'Sys Design', progress: user.mastery?.['Sys Design'] || 0, color: 'bg-orange-500' },
    ];

    return (
        <div className="p-5 space-y-8 pb-10 overflow-y-auto h-[calc(100vh-64px)] scrollbar-hide">
            {/* Header Section */}
            <header className="flex flex-col items-center pt-8 relative">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className={`absolute right-0 top-0 p-2 bg-white/5 rounded-xl border border-white/10 ${isEditing ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-gray-400'}`}
                >
                    {isEditing ? <X size={20} /> : <Settings size={20} />}
                </motion.button>

                <div className="relative mb-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative group"
                    >
                        <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/20 via-blue-500/10 to-purple-500/20 flex items-center justify-center border-2 border-white/10 backdrop-blur-md relative z-10 overflow-hidden shadow-2xl">
                            {user.profilePic ? (
                                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon size={56} className="text-white/20" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent opacity-50" />

                            {isEditing && (
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                >
                                    <Camera size={24} />
                                </button>
                            )}
                        </div>

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {/* Enhanced PRO Badge - Now positioned absolutely relative to the container */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.5 }}
                            className="absolute -bottom-1 -right-1 z-30 flex items-center gap-1 bg-gradient-to-r from-emerald-400 to-emerald-600 text-black text-[11px] font-black px-3 py-1.5 rounded-2xl shadow-[0_4px_20px_rgba(16,185,129,0.4)] border-2 border-black tracking-tighter"
                        >
                            <Zap size={10} fill="currentColor" />
                            {user.rank}
                        </motion.div>
                    </motion.div>
                </div>

                <AnimatePresence mode="wait">
                    {!isEditing ? (
                        <motion.div
                            key="view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-bold text-white tracking-tight">
                                {user.name.split(' ')[0]} <span className="text-gradient">{user.name.split(' ').slice(1).join(' ')}</span>
                            </h2>
                            <p className="text-gray-400 text-[10px] font-mono uppercase tracking-[0.2em] mt-2 bg-white/5 py-1.5 px-4 rounded-full border border-white/5 inline-block">
                                {user.position}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-sm space-y-4 pt-2"
                        >
                            <div className="grid grid-cols-1 gap-4">
                                <EditField
                                    icon={UserIcon}
                                    label="Name"
                                    value={editForm.name}
                                    onChange={(val) => setEditForm({ ...editForm, name: val })}
                                />
                                <EditField
                                    icon={Briefcase}
                                    label="Position"
                                    value={editForm.position}
                                    onChange={(val) => setEditForm({ ...editForm, position: val })}
                                />
                                <EditField
                                    icon={Mail}
                                    label="Email"
                                    value={editForm.email}
                                    onChange={(val) => setEditForm({ ...editForm, email: val })}
                                />
                                <EditField
                                    icon={Phone}
                                    label="Phone"
                                    value={editForm.phone}
                                    onChange={(val) => setEditForm({ ...editForm, phone: val })}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 py-3 rounded-2xl font-bold text-sm transition-all border border-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                                >
                                    <Save size={16} /> Save Changes
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {!isEditing && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                >
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-sm group hover:bg-white/10 transition-all cursor-pointer"
                            >
                                <div className={`w-10 h-10 rounded-2xl bg-black/40 flex items-center justify-center mb-3 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={20} />
                                </div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{stat.label}</p>
                                <p className="text-lg font-bold text-white">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mastery Tracks */}
                    <section>
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <BookOpen size={18} className="text-emerald-500" />
                                Mastery Protocol
                            </h3>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-6">
                            {mastery.map((track, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between text-[10px] items-center">
                                        <span className="text-gray-400 font-mono uppercase tracking-widest">{track.name}</span>
                                        <span className="text-emerald-400 font-bold">{track.progress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${track.progress}%` }}
                                            transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                                            className={`h-full rounded-full ${track.color} shadow-[0_0_15px_rgba(255,255,255,0.05)]`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Achievements */}
                    <section>
                        <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                            <Award size={18} className="text-emerald-500" />
                            Earned Badges
                        </h3>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {badges.map((badge, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    className={`min-w-[110px] aspect-square rounded-[2rem] flex flex-col items-center justify-center gap-2 border transition-all ${badge.unlocked
                                        ? 'bg-gradient-to-br from-emerald-500/20 to-blue-500/10 border-emerald-500/30'
                                        : 'bg-white/5 border-white/5 opacity-40 grayscale'
                                        }`}
                                >
                                    <div className={`p-3 rounded-2xl ${badge.unlocked ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-gray-600'}`}>
                                        <badge.icon size={24} />
                                    </div>
                                    <span className="text-[9px] font-black text-white text-center px-2 uppercase tracking-tight">{badge.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className="space-y-3">
                        <ActionButton
                            icon={ChevronRight}
                            label="Export Training Logs"
                            color="bg-blue-500/20 text-blue-400"
                            onClick={handleExport}
                        />
                        <ActionButton
                            icon={ChevronRight}
                            label="System Logout"
                            color="bg-red-500/20 text-red-400"
                            isLast
                            onClick={handleLogout}
                        />
                    </section>
                </motion.div>
            )}
        </div>
    );
};

// eslint-disable-next-line no-unused-vars
const EditField = ({ icon: Icon, label, value, onChange }) => (
    <div className="space-y-1.5 group">
        <label className="text-[10px] text-gray-500 font-mono uppercase tracking-widest ml-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Icon size={16} className="text-gray-600 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all placeholder:text-gray-700"
            />
        </div>
    </div>
);

// eslint-disable-next-line no-unused-vars
const ActionButton = ({ icon: Icon, label, color, isLast, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group ${isLast ? 'text-red-400' : 'text-white'}`}
    >
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${color}`}>
                <Icon size={18} />
            </div>
            <span className="text-sm font-bold">{label}</span>
        </div>
        <ChevronRight size={16} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
    </button>
);

export default Profile;
