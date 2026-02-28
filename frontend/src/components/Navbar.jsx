import { Home, Layers, FileText, User, Trophy } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Navbar = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'league', icon: Trophy, label: 'League' },
        { id: 'flashcards', icon: Layers, label: 'Cards' },
        { id: 'cheatsheet', icon: FileText, label: 'Sheets' },
        { id: 'profile', icon: User, label: 'Profile' },
    ];

    return (
        <nav className="fixed bottom-0 w-full max-w-[480px] bg-black/80 backdrop-blur-md border-t border-white/5 h-16 flex items-center justify-around z-50">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative group ${isActive ? 'text-emerald-500' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="navParams"
                                className="absolute -top-4 w-12 h-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                        <span className="text-[10px] mt-1 font-medium relative z-10">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default Navbar;
