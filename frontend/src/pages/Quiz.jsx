import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    ArrowRight,
    CheckCircle2,
    XCircle,
    Timer,
    Trophy,
    RefreshCcw,
    ChevronLeft,
    Loader2,
    Target,
    Zap
} from 'lucide-react';
import { userService } from '../services/api';

const Quiz = ({ onBack }) => {
    const [step, setStep] = useState('setup'); // setup, loading, playing, results
    const [topic, setTopic] = useState('Java Core');
    const [questionCount, setQuestionCount] = useState(10);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const topics = ['Java Core', 'Spring Boot', 'DSA', 'Sys Design'];
    const counts = [5, 10, 15, 20];

    const generateQuestions = async () => {
        setIsLoading(true);
        setStep('loading');
        setError(null);

        const apiKey = import.meta.env.VITE_GROQ_API_KEY;
        const prompt = `Generate ${questionCount} multiple choice questions for the topic "${topic}". 
        Return ONLY a raw JSON array of objects with this structure: 
        [{"question": "string", "options": ["string", "string", "string", "string"], "correctAnswer": "string", "explanation": "string"}].
        Ensure the correctAnswer exists in the options array exactly as written.
        Make them high-end technical interview level questions ranging from medium to hard.
        Return ONLY the array, no other text or formatting.`;

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            const text = data.choices[0].message.content;

            // Extract JSON from the response (sometimes AI wraps it in code blocks)
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const parsedQuestions = JSON.parse(jsonMatch[0]);
                setQuestions(parsedQuestions);
                setStep('playing');
            } else {
                throw new Error("Failed to parse questions format.");
            }
        } catch (err) {
            console.error("API Error:", err);
            setError("Failed to initialize Groq Neural Link. Check your API key and try again.");
            setStep('setup');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = async (option) => {
        if (selectedOption !== null) return;

        const isCorrect = option === questions[currentIndex].correctAnswer;
        setSelectedOption(option);

        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        // Backend Update
        try {
            const localUser = JSON.parse(localStorage.getItem('devready_user'));
            if (localUser?.id) {
                const updatedUser = await userService.updateProgress(localUser.id, topic, isCorrect, 'Hard');

                // Sync to localStorage immediately
                const mergedUser = { ...localUser, ...updatedUser };
                localStorage.setItem('devready_user', JSON.stringify(mergedUser));
            }
        } catch (error) {
            console.error("Failed to sync progress:", error);
        }

        setShowExplanation(true);
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setShowExplanation(false);
        } else {
            setStep('results');
        }
    };

    const restartQuiz = () => {
        setStep('setup');
        setCurrentIndex(0);
        setScore(0);
        setSelectedOption(null);
        setShowExplanation(false);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 -left-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <AnimatePresence mode="wait">
                {step === 'setup' && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-md space-y-8 z-10"
                    >
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-mono font-bold tracking-widest uppercase mb-4">
                                <Zap size={12} /> Training Module Initiation
                            </div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">Configure <span className="text-gradient">Quiz</span></h2>
                            <p className="text-gray-400 text-sm">Select your parameters for the technical assessment.</p>
                        </div>

                        <div className="space-y-6 bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-xl">
                            {/* Topic Selection */}
                            <div className="space-y-3">
                                <label className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] ml-1">Training Objective</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {topics.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTopic(t)}
                                            className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all border ${topic === t
                                                ? 'bg-emerald-500 text-black border-emerald-500 shadow-lg shadow-emerald-500/20'
                                                : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Count Selection */}
                            <div className="space-y-3">
                                <label className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] ml-1">Data Points (Questions)</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {counts.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setQuestionCount(c)}
                                            className={`py-3 rounded-2xl text-xs font-bold transition-all border ${questionCount === c
                                                ? 'bg-blue-500 text-black border-blue-500 shadow-lg shadow-blue-500/20'
                                                : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10'
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-red-400 text-[10px] font-mono text-center pt-2"
                                >
                                    ERROR: {error}
                                </motion.p>
                            )}

                            <button
                                onClick={generateQuestions}
                                disabled={isLoading}
                                className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-emerald-400 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-4 h-14"
                            >
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Access Server <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                            </button>
                        </div>

                        <button
                            onClick={onBack}
                            className="w-full py-4 text-gray-500 text-sm font-bold flex items-center justify-center gap-2 hover:text-white transition-colors"
                        >
                            <ChevronLeft size={18} /> Revert to Dashboard
                        </button>
                    </motion.div>
                )}

                {step === 'loading' && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-6"
                    >
                        <div className="relative">
                            <div className="w-24 h-24 border-2 border-emerald-500/20 rounded-full animate-ping absolute inset-0" />
                            <div className="w-24 h-24 border-t-2 border-emerald-500 rounded-full animate-spin flex items-center justify-center relative z-10">
                                <Brain size={40} className="text-emerald-500 animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white font-mono uppercase tracking-widest">Generating_Quiz</h3>
                            <p className="text-gray-500 text-xs font-mono tracking-tighter">Querying Neural Core for {topic} datasets...</p>
                        </div>
                    </motion.div>
                )}

                {step === 'playing' && (
                    <motion.div
                        key="playing"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full max-w-2xl space-y-6 z-10"
                    >
                        <div className="flex justify-between items-center mb-8 px-2">
                            <div className="space-y-1">
                                <span className="text-[10px] text-emerald-500 font-mono font-bold tracking-widest uppercase">{topic} Protocol</span>
                                <div className="flex items-center gap-4">
                                    <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            className="h-full bg-emerald-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-400 font-mono">{currentIndex + 1} / {questions.length}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-500 text-xs font-mono font-bold">
                                <Target size={14} /> SCORE: {score}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-white leading-tight">
                                {questions[currentIndex].question}
                            </h3>

                            <div className="grid grid-cols-1 gap-3">
                                {questions[currentIndex].options.map((option, idx) => {
                                    const isCorrect = option === questions[currentIndex].correctAnswer;
                                    const isSelected = selectedOption === option;
                                    const showResult = selectedOption !== null;

                                    let buttonClass = "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20";
                                    if (showResult) {
                                        if (isCorrect) buttonClass = "bg-emerald-500/20 border-emerald-500/40 text-emerald-400";
                                        else if (isSelected) buttonClass = "bg-red-500/20 border-red-500/40 text-red-400";
                                        else buttonClass = "bg-white/5 border-white/5 text-gray-600 opacity-50";
                                    }

                                    return (
                                        <motion.button
                                            key={idx}
                                            whileHover={!showResult ? { scale: 1.01, x: 5 } : {}}
                                            whileTap={!showResult ? { scale: 0.99 } : {}}
                                            onClick={() => handleAnswer(option)}
                                            disabled={showResult}
                                            className={`p-5 rounded-2xl border text-left text-sm font-medium transition-all flex justify-between items-center ${buttonClass}`}
                                        >
                                            {option}
                                            {showResult && isCorrect && <CheckCircle2 size={18} />}
                                            {showResult && isSelected && !isCorrect && <XCircle size={18} />}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            <AnimatePresence>
                                {showExplanation && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-6 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                                        <h4 className="text-[10px] text-emerald-500 font-mono font-bold uppercase tracking-widest mb-2">Protocol Analysis</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {questions[currentIndex].explanation}
                                        </p>
                                        <button
                                            onClick={nextQuestion}
                                            className="mt-6 w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                                        >
                                            {currentIndex === questions.length - 1 ? 'Finalize Report' : 'Next Protocol'} <ArrowRight size={16} />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {step === 'results' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md space-y-8 z-10 text-center"
                    >
                        <div className="relative inline-block">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                                className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20"
                            >
                                <Trophy size={60} className="text-white" />
                            </motion.div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 border-2 border-dashed border-emerald-500/20 rounded-[2.5rem] -m-4"
                            />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-white tracking-tighter">MISSION COMPLETE</h2>
                            <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.3em]">Assessment Report Ready</p>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] backdrop-blur-xl relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="grid grid-cols-2 gap-8 relative z-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest font-bold">Final Score</p>
                                    <p className="text-4xl font-black text-emerald-400 tracking-tighter">{Math.round((score / questions.length) * 100)}%</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest font-bold">Accuracy</p>
                                    <p className="text-4xl font-black text-blue-400 tracking-tighter">{score} / {questions.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={restartQuiz}
                                className="py-4 bg-white text-black rounded-2xl font-bold text-sm shadow-xl hover:bg-emerald-400 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <RefreshCcw size={18} /> Re-initialize Protocol
                            </button>
                            <button
                                onClick={onBack}
                                className="py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-sm hover:bg-white/10 transition-all"
                            >
                                Go Back to Base
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Quiz;
