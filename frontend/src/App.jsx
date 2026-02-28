import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Flashcards from './pages/Flashcards';
import CheatSheet from './pages/CheatSheet';
import Profile from './pages/Profile';
import Quiz from './pages/Quiz';
import LeagueLeaderboard from './pages/LeagueLeaderboard';
import Login from './pages/Login';
import { userService } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('devready_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedCategory, setSelectedCategory] = useState('Java Core'); // Default category

  // Global user sync on load (Skip if recently logged in)
  useEffect(() => {
    const isRecent = localStorage.getItem('devready_recent_login');
    if (isRecent) {
      localStorage.removeItem('devready_recent_login');
      return;
    }

    const syncWithBackend = async () => {
      if (!user?.email) return;

      try {
        const backendUser = await userService.getUser(user.email);
        const mergedUser = {
          ...user,
          ...backendUser,
          id: backendUser.id || user.id,
        };
        localStorage.setItem('devready_user', JSON.stringify(mergedUser));
        setUser(mergedUser);
      } catch (error) {
        console.error("Backend sync failed:", error);
      }
    };
    syncWithBackend();
  }, [user?.email]);

  const handleLogin = (userData) => {
    localStorage.setItem('devready_recent_login', 'true');
    setUser(userData);
    setActiveTab('home');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard user={user} setActiveTab={setActiveTab} setSelectedCategory={setSelectedCategory} />;
      case 'league':
        return <LeagueLeaderboard user={user} />;
      case 'flashcards':
        return <Flashcards user={user} setUser={setUser} category={selectedCategory} />;
      case 'cheatsheet':
        return <CheatSheet category={selectedCategory} />;
      case 'profile':
        return <Profile user={user} setUser={setUser} setActiveTab={setActiveTab} />;
      case 'quiz':
        return <Quiz user={user} setUser={setUser} onBack={() => setActiveTab('home')} />;
      default:
        return <Dashboard user={user} setActiveTab={setActiveTab} setSelectedCategory={setSelectedCategory} />;
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
