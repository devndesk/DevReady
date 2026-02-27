import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Flashcards from './pages/Flashcards';
import CheatSheet from './pages/CheatSheet';
import Profile from './pages/Profile';
import Quiz from './pages/Quiz';
import { userService } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('Java Core'); // Default category

  // Global user sync on load
  useEffect(() => {
    const syncWithBackend = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem('devready_user'));
        const email = localUser?.email || 'dev.architect@example.com';

        // Fetch/Init user from backend
        const backendUser = await userService.getUser(email);

        // Merge and save back to local
        const mergedUser = {
          ...localUser,
          ...backendUser,
          id: backendUser.id, // Ensure we use the backend ID
          totalXp: backendUser.totalXp || 0,
          questionsSolved: backendUser.questionsSolved || 0,
          currentStreak: backendUser.currentStreak || 0,
          rank: backendUser.rank || 'NEWBIE',
          mastery: backendUser.mastery || {}
        };
        localStorage.setItem('devready_user', JSON.stringify(mergedUser));

        // Sync locally modified profile if any
        if (localUser) {
          await userService.syncUser(localUser);
        }
      } catch (error) {
        console.error("Backend sync failed:", error);
      }
    };
    syncWithBackend();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard setActiveTab={setActiveTab} setSelectedCategory={setSelectedCategory} />;
      case 'flashcards':
        return <Flashcards category={selectedCategory} />;
      case 'cheatsheet':
        return <CheatSheet category={selectedCategory} />;
      case 'profile':
        return <Profile setActiveTab={setActiveTab} />;
      case 'quiz':
        return <Quiz onBack={() => setActiveTab('home')} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} setSelectedCategory={setSelectedCategory} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden flex flex-col">
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
