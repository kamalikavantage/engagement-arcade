import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useConfig } from '../../context/ConfigContext';
import { Card } from '../Common/Card';
import { StatCard } from '../Common/StatCard';
import { Badge } from '../Common/Badge';
import { Zap, Trophy, Flame, Gift, Star, Sparkles, Target } from 'lucide-react';

interface DashboardProps {
  onSelectGame?: (game: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectGame }) => {
  const { userState } = useGame();
  const { config } = useConfig();

  const modules = [
    {
      id: 'spinWheel',
      name: 'Daily Spin',
      description: 'Spin for daily rewards',
      icon: '⚡',
      color: 'from-yellow-500 to-orange-500',
      available: config.modules.spinWheel,
    },
    {
      id: 'quizArena',
      name: 'Quiz Arena',
      description: 'Test your knowledge',
      icon: '🧠',
      color: 'from-blue-500 to-cyan-500',
      available: config.modules.quizArena,
    },
    {
      id: 'scratchCard',
      name: 'Scratch Card',
      description: 'Reveal surprise rewards',
      icon: '🎰',
      color: 'from-purple-500 to-pink-500',
      available: config.modules.scratchCard,
    },
    {
      id: 'luckyDraw',
      name: 'Lucky Draw',
      description: 'Monthly raffle',
      icon: '🎁',
      color: 'from-red-500 to-pink-500',
      available: config.modules.luckyDraw,
    },
    {
      id: 'missions',
      name: 'Missions',
      description: 'Complete challenges',
      icon: '🎯',
      color: 'from-green-500 to-emerald-500',
      available: config.modules.missionsAndChallenges,
    },
    {
      id: 'leaderboard',
      name: 'Leaderboard',
      description: 'See rankings',
      icon: '📊',
      color: 'from-slate-500 to-slate-600',
      available: config.modules.leaderboards,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <Card gradient className="relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Welcome Back! 🎮</h1>
              <p className="text-slate-300 mb-4">
                Keep engaging to earn rewards, climb the leaderboard, and unlock achievements.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary-500/30 text-primary-300 rounded-full text-sm font-medium">
                  {userState?.streakCount || 0} day streak 🔥
                </span>
                <span className="px-3 py-1 bg-secondary-500/30 text-secondary-300 rounded-full text-sm font-medium">
                  Level {userState?.level || 1}
                </span>
              </div>
            </div>
            <div className="text-4xl">🎉</div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants}>
          <StatCard icon={<Star />} label="Total Points" value={userState?.totalPoints || 0} color="primary" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard icon={<Trophy />} label="Level" value={userState?.level || 1} color="secondary" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard icon={<Gift />} label="Badges" value={userState?.badges.length || 0} color="accent" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<Flame />}
            label="Raffle Entries"
            value={userState?.raffleEntries || 0}
            color="accent"
          />
        </motion.div>
      </motion.div>

      {/* Badges Section */}
      {userState && userState.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card gradient>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles size={24} /> Your Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userState.badges.map((badge, idx) => (
                <motion.div
                  key={badge.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Badge name={badge.name} icon={badge.icon} color={badge.color} size="sm" />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Games Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap size={24} /> Available Games
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {modules.map((module) => (
            <motion.div
              key={module.id}
              variants={itemVariants}
              onClick={() => module.available && onSelectGame?.(module.id)}
              className={module.available ? 'cursor-pointer' : 'opacity-40'}
            >
              <Card hover={module.available} gradient={module.available}>
                <div className={`bg-gradient-to-br ${module.color} rounded-xl p-6 text-white mb-4`}>
                  <div className="text-5xl">{module.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{module.name}</h3>
                <p className="text-slate-400 text-sm">{module.description}</p>
                {!module.available && (
                  <p className="text-yellow-400 text-xs mt-3 flex items-center gap-1">
                    <Target size={12} /> Disabled by admin
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};
