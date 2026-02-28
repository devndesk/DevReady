import { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Check, X } from 'lucide-react';
import { flashcardsData } from '../data/flashcardsData';
import { userService } from '../services/api';

const Flashcards = ({ user, setUser, category = "Java Core" }) => {
    const [currentCard, setCurrentCard] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);

    const loadNewCard = useCallback(() => {
        const cards = flashcardsData[category] || flashcardsData["Java Core"];
        const randomIndex = Math.floor(Math.random() * cards.length);
        setCurrentCard(cards[randomIndex]);
        setIsFlipped(false);
    }, [category]);

    useEffect(() => {
        // Use timeout to avoid "setState synchronously within an effect" warning
        const timer = setTimeout(() => {
            loadNewCard();
        }, 0);
        return () => clearTimeout(timer);
    }, [loadNewCard]);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleMastered = async (correct) => {
        try {
            if (user?.id) {
                const updatedUser = await userService.updateProgress(
                    user.id,
                    category,
                    correct,
                    currentCard?.difficulty || 'Easy'
                );

                // Sync to global state and localStorage
                const mergedUser = { ...user, ...updatedUser };
                setUser(mergedUser);
                localStorage.setItem('devready_user', JSON.stringify(mergedUser));
            }
        } catch (error) {
            console.error("Failed to sync flashcard progress:", error);
        }

        // Brief delay before showing next card for smoother transition
        setTimeout(() => {
            loadNewCard();
        }, 300);
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 h-[calc(100vh-64px)] overflow-hidden">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white tracking-tight">{category}</h2>
                <p className="text-xs text-emerald-500/80 uppercase tracking-widest font-mono mt-1 animate-pulse">Neural Link Active</p>
            </div>

            <div className="relative w-full max-w-sm aspect-[3/4] perspective-1000">
                <motion.div
                    className="w-full h-full relative preserve-3d cursor-pointer"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    onClick={handleFlip}
                >
                    {/* Front */}
                    <div className="absolute inset-0 glass-panel rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl border border-white/10 backface-hidden">
                        <span className="text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest absolute top-6 left-6 border border-emerald-500/20 font-mono">
                            {currentCard?.difficulty?.toUpperCase() || "CORE"}
                        </span>
                        <p className="text-2xl text-center font-bold leading-tight text-white/90">
                            {currentCard?.question}
                        </p>
                        <div className="mt-8 flex flex-col items-center gap-2">
                            <span className="text-[10px] text-muted font-mono uppercase tracking-widest opacity-50">Secure Data Access</span>
                            <span className="text-xs text-emerald-400 font-mono bg-emerald-500/5 px-3 py-1 rounded-md border border-emerald-500/10">Tap to decrypt</span>
                        </div>
                    </div>

                    {/* Back */}
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-gray-900/95 backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl border border-emerald-500/30 backface-hidden"
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        <span className="text-emerald-400 text-[10px] font-bold tracking-widest absolute top-6 left-6 font-mono">DECRYPTED_MSG</span>
                        <p className="text-lg text-center text-white/90 leading-relaxed font-medium">
                            {currentCard?.answer}
                        </p>
                    </div>
                </motion.div>
            </div>

            <div className="flex gap-4 mt-8">
                <button onClick={() => handleMastered(false)} className="p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-95">
                    <X size={24} />
                </button>
                <button onClick={handleFlip} className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/20 hover:bg-blue-500/20 transition-all active:scale-95">
                    <RefreshCw size={24} />
                </button>
                <button onClick={() => handleMastered(true)} className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all active:scale-95">
                    <Check size={24} />
                </button>
            </div>
        </div>
    );
};

export default Flashcards;
