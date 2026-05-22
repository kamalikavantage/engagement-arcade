import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../Common/Card';
import { useGame } from '../../context/GameContext';
import mockEmployees from '../../data/mockEmployees.json';
import { Trophy, Users } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  department: string;
  points: number;
  badges: number;
  level: number;
}

export const Leaderboards: React.FC = () => {
  const { userState } = useGame();
  const [tab, setTab] = useState<'company' | 'department'>('company');

  // Generate mock leaderboard data
  const leaderboardData: LeaderboardEntry[] = useMemo(() => {
    const employees: any[] = mockEmployees;
    return employees
      .map((emp, idx) => ({
        rank: idx + 1,
        id: emp.id,
        name: emp.name,
        avatar: emp.avatar,
        department: emp.department,
        points: Math.floor(Math.random() * 5000) + 1000,
        badges: Math.floor(Math.random() * 10),
        level: Math.floor(Math.random() * 50) + 1,
      }))
      .sort((a, b) => b.points - a.points)
      .map((entry, idx) => ({
        ...entry,
        rank: idx + 1,
      }));
  }, []);

  const departmentLeaderboard = useMemo(() => {
    return leaderboardData
      .filter((entry) => entry.department === userState?.userId?.split('_')[1] || entry.department === 'Engineering')
      .sort((a, b) => b.points - a.points)
      .map((entry, idx) => ({
        ...entry,
        rank: idx + 1,
      }));
  }, [leaderboardData, userState?.userId]);

  const displayData = tab === 'company' ? leaderboardData : departmentLeaderboard;

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const RankRow: React.FC<{ entry: LeaderboardEntry; isCurrentUser?: boolean }> = ({ entry, isCurrentUser }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
        isCurrentUser
          ? 'bg-gradient-to-r from-primary-500/30 to-secondary-500/30 border-2 border-primary-500/50'
          : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 flex items-center justify-center font-bold text-lg text-accent-400">
          {getMedalEmoji(entry.rank)}
        </div>

        <img src={entry.avatar} alt={entry.name} className="w-10 h-10 rounded-full border border-primary-500" />

        <div className="flex-1">
          <p className="font-semibold text-white">{entry.name}</p>
          <p className="text-xs text-slate-400">{entry.department}</p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <div className="text-center">
          <p className="text-xs text-slate-400">Level</p>
          <p className="text-lg font-bold text-secondary-400">{entry.level}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400">Badges</p>
          <p className="text-lg font-bold text-accent-400">{entry.badges}</p>
        </div>
      </div>

      <div className="text-center ml-4">
        <p className="text-xs text-slate-400">Points</p>
        <p className="text-2xl font-bold gradient-text">{entry.points}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <Card gradient>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy size={32} className="text-accent-400" />
            <div>
              <h2 className="text-3xl font-bold text-white">Leaderboards</h2>
              <p className="text-slate-300">See how you rank against your peers</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['company', 'department'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                tab === t
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {t === 'company' ? '🌍 Company' : '🏢 Department'}
            </button>
          ))}
        </div>
      </Card>

      {/* Top 3 Podium */}
      {displayData.slice(0, 3).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* 2nd Place */}
          {displayData[1] && (
            <Card gradient className="md:order-1">
              <div className="text-center">
                <div className="text-6xl mb-2">🥈</div>
                <div className="w-16 h-16 mx-auto rounded-full border-2 border-secondary-500 overflow-hidden mb-3">
                  <img src={displayData[1].avatar} alt={displayData[1].name} className="w-full h-full object-cover" />
                </div>
                <p className="font-bold text-white mb-1">{displayData[1].name}</p>
                <p className="text-sm text-slate-400 mb-3">{displayData[1].department}</p>
                <p className="text-2xl font-bold gradient-text">{displayData[1].points}</p>
                <p className="text-xs text-slate-400">Points</p>
              </div>
            </Card>
          )}

          {/* Placeholder for idx reference removal */}

          {/* 1st Place */}
          {displayData[0] && (
            <Card gradient className="md:order-none ring-2 ring-accent-400">
              <div className="text-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }} className="text-7xl mb-2">
                  🥇
                </motion.div>
                <div className="w-20 h-20 mx-auto rounded-full border-4 border-accent-400 overflow-hidden mb-3">
                  <img src={displayData[0].avatar} alt={displayData[0].name} className="w-full h-full object-cover" />
                </div>
                <p className="font-bold text-white mb-1 text-lg">{displayData[0].name}</p>
                <p className="text-sm text-slate-400 mb-3">{displayData[0].department}</p>
                <p className="text-3xl font-bold gradient-text">{displayData[0].points}</p>
                <p className="text-xs text-slate-400">Points</p>
              </div>
            </Card>
          )}

          {/* 3rd Place */}
          {displayData[2] && (
            <Card gradient className="md:order-2">
              <div className="text-center">
                <div className="text-6xl mb-2">🥉</div>
                <div className="w-16 h-16 mx-auto rounded-full border-2 border-amber-600 overflow-hidden mb-3">
                  <img src={displayData[2].avatar} alt={displayData[2].name} className="w-full h-full object-cover" />
                </div>
                <p className="font-bold text-white mb-1">{displayData[2].name}</p>
                <p className="text-sm text-slate-400 mb-3">{displayData[2].department}</p>
                <p className="text-2xl font-bold gradient-text">{displayData[2].points}</p>
                <p className="text-xs text-slate-400">Points</p>
              </div>
            </Card>
          )}
        </motion.div>
      )}

      {/* Full Leaderboard */}
      <Card>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Users size={24} /> Full Rankings
        </h3>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {displayData.map((entry) => (
            <RankRow key={entry.id} entry={entry} isCurrentUser={entry.id === userState?.userId} />
          ))}
        </div>
      </Card>
    </div>
  );
};
