import { Flame, Code, Server, Database, ChevronRight, Terminal, Activity, Trophy } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Dashboard = ({ user, setActiveTab, setSelectedCategory }) => {

    return (
        <div className="p-5 space-y-8 pb-24">
            {/* Header Section */}
            <header className="flex justify-between items-center pt-2">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 mb-1"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-emerald-500 text-xs font-mono tracking-widest uppercase">System Online</p>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl font-bold text-white tracking-tight"
                    >
                        Hello, <span className="text-gradient">{user.name?.split(' ')[0] || 'Dev'}</span>
                    </motion.h1>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-4 py-2 rounded-xl border border-orange-500/20 backdrop-blur-md"
                >
                    <Flame className="text-orange-500" size={20} fill="currentColor" />
                    <div className="flex flex-col items-end leading-none">
                        <span className="font-bold text-white text-lg">{user.currentStreak || 0}</span>
                        <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">Streak</span>
                    </div>
                </motion.div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
                <StatCard icon={Trophy} label="Current Rank" value={user.rank || 'NEWBIE'} color="text-yellow-400" delay={0.2} />
                <StatCard icon={Activity} label="XP Gained" value={`${user.totalXp || 0} XP`} color="text-blue-400" delay={0.3} />
            </div>

            {/* Hero Card - Daily Challenge */}
            <section>
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Terminal size={18} className="text-emerald-500" />
                        Daily Protocol
                    </h2>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative overflow-hidden rounded-3xl border border-emerald-500/30 group"
                >
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-black to-black z-0" />
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 blur-[50px] rounded-full pointer-events-none" />

                    <div className="relative z-10 p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-wider">
                                <Code size={12} />
                                ALGORITHM
                            </div>
                            <span className="text-xs text-emerald-500/80 font-mono">HASH: #8A2F</span>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2 leading-tight">Mastering<br />Arrays & Strings</h3>
                        <p className="text-gray-400 text-sm mb-6 max-w-[80%]">Optimize your solution for O(n) time complexity.</p>

                        <button
                            onClick={() => {
                                setActiveTab('quiz');
                            }}
                            className="w-full bg-white text-black py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-emerald-500/10 hover:bg-emerald-400 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group-hover:shadow-emerald-500/20 cursor-pointer"
                        >
                            Initialize Quiz <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Categories Grid */}
            <section>
                <h2 className="text-lg font-bold mb-4 text-white">Modules</h2>
                <div className="grid grid-cols-2 gap-3">
                    <CategoryCard
                        icon={Code}
                        title="Java Core"
                        progress={user.mastery?.['Java Core'] || 0}
                        color="text-blue-400"
                        from="from-blue-500/20"
                        to="to-blue-600/5"
                        border="border-blue-500/30"
                        delay={0.5}
                        onClick={(tab) => {
                            setSelectedCategory('Java Core');
                            setActiveTab(tab);
                        }}
                    />
                    <CategoryCard
                        icon={Server}
                        title="Spring Boot"
                        progress={user.mastery?.['Spring Boot'] || 0}
                        color="text-emerald-400"
                        from="from-emerald-500/20"
                        to="to-emerald-600/5"
                        border="border-emerald-500/30"
                        delay={0.6}
                        onClick={(tab) => {
                            setSelectedCategory('Spring Boot');
                            setActiveTab(tab);
                        }}
                    />
                    <CategoryCard
                        icon={Database}
                        title="DSA"
                        progress={user.mastery?.['DSA'] || 0}
                        color="text-purple-400"
                        from="from-purple-500/20"
                        to="to-purple-600/5"
                        border="border-purple-500/30"
                        delay={0.7}
                        onClick={(tab) => {
                            setSelectedCategory('DSA');
                            setActiveTab(tab);
                        }}
                    />
                    <CategoryCard
                        icon={Flame}
                        title="Sys Design"
                        progress={user.mastery?.['Sys Design'] || 0}
                        color="text-orange-400"
                        from="from-orange-500/20"
                        to="to-orange-600/5"
                        border="border-orange-500/30"
                        delay={0.8}
                        onClick={(tab) => {
                            setSelectedCategory('Sys Design');
                            setActiveTab(tab);
                        }}
                    />
                </div>
            </section>
        </div>
    );
};

// eslint-disable-next-line no-unused-vars
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-sm flex items-center gap-3"
    >
        <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
            <Icon size={18} />
        </div>
        <div>
            <p className="text-[10px] text-muted uppercase tracking-wider">{label}</p>
            <p className="text-sm font-bold text-white">{value}</p>
        </div>
    </motion.div>
);

// eslint-disable-next-line no-unused-vars
const CategoryCard = ({ icon: Icon, title, progress, color, from, to, border, delay, onClick }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        className={`bg-gradient-to-br ${from} ${to} p-4 rounded-2xl border ${border} relative overflow-hidden group cursor-pointer`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
    >
        <div className={`w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center mb-4 ${color} ring-1 ring-white/10`}>
            <Icon size={20} />
        </div>

        <h3 className="font-bold text-white text-sm mb-3">{title}</h3>

        <div className="space-y-3 mt-auto">
            <div className="flex justify-between text-[10px] items-end mb-1">
                <span className="text-gray-400 font-mono">MASTERY</span>
                <span className={`${color} font-bold`}>{progress}%</span>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick('flashcards');
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold py-2 rounded-lg transition-all border border-white/5 active:scale-95"
                >
                    Cards
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick('cheatsheet');
                    }}
                    className={`flex-1 ${color.replace('text', 'bg')}/20 hover:${color.replace('text', 'bg')}/30 ${color} text-[10px] font-bold py-2 rounded-lg transition-all border border-white/5 active:scale-95`}
                >
                    Sheets
                </button>
            </div>
        </div>
    </motion.div>
);

export default Dashboard;
