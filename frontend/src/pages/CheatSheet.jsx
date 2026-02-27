import { useState } from 'react';
import { Search, BookOpen, Info, X, ChevronRight, Code, Terminal } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { cheatSheetsData } from '../data/cheatSheetsData';

const CheatSheet = ({ category = "Java Core" }) => {
    const [search, setSearch] = useState("");
    const [activeConcept, setActiveConcept] = useState(null);

    const data = cheatSheetsData[category] || cheatSheetsData["Java Core"];

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-5 h-[calc(100vh-64px)] flex flex-col space-y-6 overflow-hidden relative">
            {/* Header Section */}
            <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2 text-emerald-500 mb-2">
                    <BookOpen size={20} />
                    <span className="text-[10px] uppercase font-mono tracking-widest font-bold">Encrypted Documentation</span>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">{category} <span className="text-gradient">Cheat Sheet</span></h2>
                <p className="text-gray-400 text-sm">Rapid access to core concepts and syntax.</p>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                </div>
                <input
                    type="text"
                    placeholder={`Search ${category} concepts...`}
                    className="block w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all backdrop-blur-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Cheat Sheet Items */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-3 custom-scrollbar">
                {filteredData.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setActiveConcept(item)}
                        className="group bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 relative overflow-hidden cursor-pointer active:scale-[0.98]"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={18} className="text-emerald-500" />
                        </div>
                        <h3 className="font-mono text-emerald-400 font-bold text-base mb-2 group-hover:translate-x-1 transition-transform">{item.name}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-white transition-colors">{item.desc}</p>
                    </motion.div>
                ))}

                {filteredData.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-600">
                            <Search size={32} />
                        </div>
                        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">No matching protocols found.</p>
                    </div>
                )}
            </div>

            {/* Concept Detail Overlay */}
            <AnimatePresence>
                {activeConcept && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[60] bg-black/95 backdrop-blur-xl p-6 flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h4 className="text-emerald-500 font-mono text-xs uppercase tracking-widest mb-2">Deep Dive Protocol</h4>
                                <h3 className="text-2xl font-bold text-white tracking-tight">{activeConcept.name}</h3>
                            </div>
                            <button
                                onClick={() => setActiveConcept(null)}
                                className="p-2 bg-white/5 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                            {/* Detailed Explanation */}
                            <section className="space-y-4">
                                <h5 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                    <Info size={16} className="text-emerald-500" />
                                    Key Characteristics
                                </h5>
                                <div className="space-y-3">
                                    {activeConcept.details ? activeConcept.details.map((point, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ x: -10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex gap-3 text-sm text-gray-400 leading-relaxed"
                                        >
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                            <p>{point}</p>
                                        </motion.div>
                                    )) : (
                                        <p className="text-sm text-gray-500 italic">No detailed documentation points available for this concept yet. Decoding soon...</p>
                                    )}
                                </div>
                            </section>

                            {/* Syntax / Code Example */}
                            <section className="space-y-4">
                                <h5 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                    <Code size={16} className="text-emerald-500" />
                                    Technical Syntax
                                </h5>
                                <div className="bg-black/50 border border-white/5 rounded-2xl p-4 relative font-mono text-[13px] leading-relaxed group">
                                    <div className="absolute top-3 right-3 opacity-30">
                                        <Terminal size={14} />
                                    </div>
                                    <pre className="text-emerald-300/90 whitespace-pre-wrap">
                                        {activeConcept.syntax || "// Documentation loading..."}
                                    </pre>
                                </div>
                            </section>
                        </div>

                        {/* Footer Action */}
                        <div className="pt-6 mt-auto">
                            <button
                                onClick={() => setActiveConcept(null)}
                                className="w-full py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                Acknowledge & Return
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CheatSheet;
