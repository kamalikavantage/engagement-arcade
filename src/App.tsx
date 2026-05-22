import { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { ConfigProvider } from './context/ConfigContext';
import { UserProvider } from './context/UserContext';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { SpinWheel } from './components/Games/SpinWheel/SpinWheel';
import { QuizArena } from './components/Games/QuizArena/QuizArena';
import { ScratchCard } from './components/Games/ScratchCard/ScratchCard';
import { LuckyDraw } from './components/Games/LuckyDraw/LuckyDraw';
import { MissionsAndChallenges } from './components/Games/MissionsAndChallenges/MissionsAndChallenges';
import { Leaderboards } from './components/Leaderboards/Leaderboards';
import { AdminPanel } from './components/Admin/AdminPanel';
import { Button } from './components/Common/Button';
import { ChevronLeft } from 'lucide-react';

type Page = 'dashboard' | 'spinWheel' | 'quizArena' | 'scratchCard' | 'luckyDraw' | 'missions' | 'leaderboard' | 'admin';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'spinWheel':
        return <SpinWheel />;
      case 'quizArena':
        return <QuizArena />;
      case 'scratchCard':
        return <ScratchCard />;
      case 'luckyDraw':
        return <LuckyDraw />;
      case 'missions':
        return <MissionsAndChallenges />;
      case 'leaderboard':
        return <Leaderboards />;
      case 'admin':
        return <AdminPanel />;
      case 'dashboard':
      default:
        return <Dashboard onSelectGame={(game) => setCurrentPage(game as Page)} />;
    }
  };

  const getPageTitle = () => {
    const titles: Record<Page, string> = {
      dashboard: 'Dashboard',
      spinWheel: 'Daily Spin Wheel',
      quizArena: 'Quiz Arena',
      scratchCard: 'Scratch Card Rewards',
      luckyDraw: 'Lucky Draw',
      missions: 'Missions & Challenges',
      leaderboard: 'Leaderboards',
      admin: 'Admin Panel',
    };
    return titles[currentPage];
  };

  return (
    <Layout onAdminClick={() => setCurrentPage('admin')}>
      {currentPage !== 'dashboard' && (
        <div className="mb-6 flex items-center gap-2">
          <Button
            variant="ghost"
            icon={<ChevronLeft size={20} />}
            onClick={() => setCurrentPage('dashboard')}
          >
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">{getPageTitle()}</h1>
        </div>
      )}
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <GameProvider>
      <ConfigProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </ConfigProvider>
    </GameProvider>
  );
}

export default App;
