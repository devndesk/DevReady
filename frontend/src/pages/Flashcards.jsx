import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Check, X, ArrowRight, BrainCircuit, Brain } from 'lucide-react';
import { flashcardService, userService } from '../services/api';

const Flashcards = ({ user, setUser, category = "Java Core" }) => {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const seenIdsRef = useRef([]);

    // Reset seen IDs when category changes
    useEffect(() => {
        seenIdsRef.current = [];
    }, [category]);

    const loadNewCard = useCallback(async () => {
        setIsLoading(true);
        setIsFlipped(false);
        setSelectedOption(null);
        setIsCorrect(null);

        try {
            const data = await flashcardService.getRandomCard(category, seenIdsRef.current);
            if (data) {
                setCurrentQuestion(data);
                seenIdsRef.current = [...seenIdsRef.current, data.id];
            }
        } catch (error) {
            console.error("Failed to fetch AI card:", error);
        } finally {
            setIsLoading(false);
        }
    }, [category]);

    useEffect(() => {
        loadNewCard();
    }, [loadNewCard]);

    const handleOptionSelect = (option) => {
        if (selectedOption !== null || !currentQuestion) return;

        const correct = option === currentQuestion.correctAnswer;
        setSelectedOption(option);
        setIsCorrect(correct);

        // Update backend only if correct
        if (user?.id) {
            userService.updateProgress(
                user.id,
                category,
                correct,
                currentQuestion?.difficulty || 'Easy'
            ).then(updatedUser => {
                if (correct) {
                    const mergedUser = { ...user, ...updatedUser };
                    setUser(mergedUser);
                    localStorage.setItem('devready_user', JSON.stringify(mergedUser));
                }
            }).catch(error => {
                console.error("Failed to sync progress:", error);
            });
        }
    };

    if (isLoading && !currentQuestion) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
                <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-mono text-[10px] animate-pulse">SYNCHRONIZING WITH GROK NEURAL NETWORK...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 h-[calc(100vh-64px)] overflow-hidden">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white tracking-tight">{category}</h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <BrainCircuit size={14} className="text-emerald-500" />
                    <span className="text-[10px] text-emerald-500/80 uppercase tracking-widest font-mono animate-pulse">AI Dynamic Mode</span>
                    <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
                    <span className="text-[10px] text-gray-500 font-mono uppercase">Live Neural Decryption</span>
                </div>
            </div>

            <div className="relative w-full max-w-md min-h-[520px] perspective-1000">
                <motion.div
                    className="w-full h-full relative preserve-3d"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front: Question */}
                    <div className="absolute inset-0 glass-panel rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl border border-white/10 backface-hidden">
                        <span className="text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest absolute top-6 left-6 border border-emerald-500/20 font-mono">
                            {currentQuestion?.difficulty?.toUpperCase() || "AI_NODE"}
                        </span>

                        <div className="w-full text-center space-y-6">
                            <p className="text-xl md:text-2xl font-bold leading-tight text-white/90">
                                {currentQuestion?.question}
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsFlipped(true)}
                                className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mx-auto"
                            >
                                Tap to Initialize Options <ArrowRight size={14} />
                            </motion.button>
                        </div>
                    </div>

                    {/* Back: MCQ Options */}
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-900/20 backdrop-blur-xl rounded-3xl p-6 flex flex-col shadow-2xl border border-white/5 backface-hidden"
                        style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-emerald-400 text-[10px] font-bold tracking-widest font-mono uppercase">Select correct Answer</span>
                            {selectedOption && (
                                <span className={`text-[10px] font-black font-mono ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {isCorrect ? 'ACCESS GRANTED +XP' : 'ACCESS DENIED 0XP'}
                                </span>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                            {currentQuestion?.options?.map((option, idx) => {
                                const isSelected = selectedOption === option;
                                const isTheCorrectAnswer = option === currentQuestion?.correctAnswer;

                                let stateClasses = "border-white/10 text-white/70 hover:bg-white/5 hover:border-white/20";
                                if (selectedOption) {
                                    if (isTheCorrectAnswer) {
                                        stateClasses = "border-emerald-500 bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50";
                                    } else if (isSelected && !isTheCorrectAnswer) {
                                        stateClasses = "border-red-500 bg-red-500/20 text-red-400 ring-1 ring-red-500/50";
                                    } else {
                                        stateClasses = "border-white/5 text-white/20 opacity-50";
                                    }
                                }

                                return (
                                    <motion.button
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => handleOptionSelect(option)}
                                        disabled={selectedOption !== null}
                                        className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all duration-300 relative overflow-hidden group ${stateClasses}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-mono opacity-30">0{idx + 1}</span>
                                            {option}
                                        </div>
                                        {isSelected && isCorrect && isTheCorrectAnswer && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4">
                                                <Check size={16} className="text-emerald-400" />
                                            </motion.div>
                                        )}
                                        {isSelected && !isCorrect && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4">
                                                <X size={16} className="text-red-400" />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {selectedOption && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={loadNewCard}
                                className="mt-4 w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all font-mono"
                            >
                                {isLoading ? (
                                    <RefreshCw size={14} className="animate-spin" />
                                ) : (
                                    <>Decrypt Next Node <RefreshCw size={14} className={isCorrect ? "animate-spin-slow" : ""} /></>
                                )}
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </div>

            <p className="mt-8 text-[10px] text-gray-600 font-mono text-center max-w-[200px]">
                {selectedOption ? "Neural sync complete. System ready for next entry." : "Questions are decrypted via Grok-Beta in real-time. Choose wisely."}
            </p>
        </div>
    );
};

export default Flashcards;
