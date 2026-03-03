import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Check, X, ArrowRight, BrainCircuit, Lock } from 'lucide-react';
import { userService } from '../services/api';
import { flashcardsData } from '../data/flashcardsData';

const Flashcards = ({ user, setUser, category = "Java Core" }) => {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const seenIdsRef = useRef([]);

    // Reset seen IDs when category changes
    useEffect(() => {
        seenIdsRef.current = [];
    }, [category]);

    const loadNewCard = useCallback(() => {
        setIsLoading(true);
        setIsFlipped(false);

        // Artificial delay for futuristic decryption feel, but much faster than API
        setTimeout(() => {
            const categoryCards = flashcardsData[category] || [];
            if (categoryCards.length === 0) {
                setCurrentQuestion(null);
                setIsLoading(false);
                return;
            }

            // Filter out seen cards
            let availableCards = categoryCards.filter(card => !seenIdsRef.current.includes(card.id));

            // If all cards seen, reset
            if (availableCards.length === 0) {
                seenIdsRef.current = [];
                availableCards = categoryCards;
            }

            const randomIndex = Math.floor(Math.random() * availableCards.length);
            const data = availableCards[randomIndex];

            if (data) {
                setCurrentQuestion(data);
                seenIdsRef.current = [...seenIdsRef.current, data.id];
            }
            setIsLoading(false);
        }, 400);
    }, [category]);

    useEffect(() => {
        loadNewCard();
    }, [loadNewCard]);

    const handleAction = async (isCorrect) => {
        if (!currentQuestion) return;

        // Update backend only if marked correct
        if (isCorrect && user?.id) {
            try {
                const updatedUser = await userService.updateProgress(
                    user.id,
                    category,
                    true,
                    currentQuestion?.difficulty || 'Easy'
                );
                if (updatedUser) {
                    const mergedUser = { ...user, ...updatedUser };
                    setUser(mergedUser);
                    localStorage.setItem('devready_user', JSON.stringify(mergedUser));
                }
            } catch (error) {
                console.error("Failed to sync progress:", error);
            }
        }

        loadNewCard();
    };

    if (isLoading && !currentQuestion) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
                <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-mono text-[10px] animate-pulse">DECRYPTING OFFLINE DATABASE...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 h-[calc(100vh-64px)] overflow-hidden">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white tracking-tight">{category}</h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-500/80 uppercase tracking-widest font-mono">Offline Protocol Active</span>
                </div>
            </div>

            <div className="relative w-full max-w-md h-[480px] perspective-1000">
                <motion.div
                    className="w-full h-full relative preserve-3d"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front: Question */}
                    <div className="absolute inset-0 glass-panel rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl border border-white/10 backface-hidden">
                        <span className="text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest absolute top-6 left-6 border border-emerald-500/20 font-mono uppercase">
                            {currentQuestion?.difficulty || "Easy"}
                        </span>

                        <div className="w-full text-center space-y-8">
                            <p className="text-2xl font-bold leading-tight text-white/90">
                                {currentQuestion?.question}
                            </p>

                            <div className="space-y-4">
                                <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">Secure Data Access</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsFlipped(true)}
                                    className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mx-auto"
                                >
                                    Tap to decrypt
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Back: Explanation */}
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-gray-900 to-black backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl border border-emerald-500/10 backface-hidden"
                        style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                    >
                        <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest absolute top-6 left-6 border border-emerald-500/20 font-mono uppercase">
                            Decrypted_MSG
                        </span>

                        <div className="w-full text-center">
                            <p className="text-lg font-medium leading-relaxed text-emerald-50/90 italic">
                                "{currentQuestion?.explanation || currentQuestion?.correctAnswer}"
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Action Footer */}
            <div className="mt-10 flex items-center gap-6">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAction(false)}
                    className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/5 hover:bg-red-500/20 transition-all"
                >
                    <X size={24} />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={loadNewCard}
                    className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/5 hover:bg-blue-500/20 transition-all"
                >
                    <RefreshCw size={24} className={isLoading ? "animate-spin" : ""} />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAction(true)}
                    className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/5 hover:bg-emerald-500/20 transition-all"
                >
                    <Check size={24} />
                </motion.button>
            </div>
        </div>
    );
};

export default Flashcards;
