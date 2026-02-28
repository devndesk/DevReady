import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User as UserIcon, ArrowRight, Zap, Loader2, ShieldCheck } from 'lucide-react';
import { userService } from '../services/api';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isNewUser, setIsNewUser] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // 1. Fetch/Create user
            let user = await userService.getUser(email);

            // 2. Update name if it's a new user and name was provided
            if (name && (user.name === "Dev User" || !user.name)) {
                user.name = name;
                user = await userService.syncUser(user);
            }

            // 3. Signal App.jsx to skip redundant sync
            localStorage.setItem('devready_recent_login', 'true');
            localStorage.setItem('devready_user', JSON.stringify(user));

            onLogin(user);
        } catch (err) {
            console.error("Login Error:", err);
            setError("Authentication failed. Neural link timeout.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="text-center mb-10 space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-6"
                    >
                        <ShieldCheck size={40} className="text-white" />
                    </motion.div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-mono font-bold tracking-widest uppercase">
                        <Zap size={12} /> Access Protocol Required
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">
                        Dev<span className="text-gradient">Ready</span>
                    </h1>
                    <p className="text-gray-400 text-sm max-w-[280px] mx-auto">
                        Synchronize your professional growth metrics across the neural network.
                    </p>
                </div>

                <div className="glass-panel rounded-[2.5rem] p-8 space-y-6 border border-white/10 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] ml-1">Identity Vector (Email)</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-600 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="architect@nexus.com"
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all placeholder:text-gray-700"
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {isNewUser && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2 overflow-hidden"
                                >
                                    <label className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] ml-1">Alias (Full Name)</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <UserIcon size={18} className="text-gray-600 group-focus-within:text-emerald-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Elite Architect"
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all placeholder:text-gray-700"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {error && (
                            <p className="text-red-400 text-[10px] font-mono text-center animate-pulse">
                                ERROR: {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-emerald-400 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group h-14"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>Initiate Session <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="pt-4 text-center">
                        <button
                            onClick={() => setIsNewUser(!isNewUser)}
                            className="text-[10px] text-gray-500 font-mono uppercase tracking-widest hover:text-emerald-500 transition-colors"
                        >
                            {isNewUser ? "Already have a neural signature?" : "Initialize new neural link?"}
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-[10px] text-gray-600 font-mono uppercase tracking-[0.3em]">
                    SECURE DATA LINK LAYER 4.0
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
