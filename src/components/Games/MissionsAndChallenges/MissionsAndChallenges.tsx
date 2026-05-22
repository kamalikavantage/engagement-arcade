import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../Common/Card';
import { Button } from '../../Common/Button';
import { useGame } from '../../../context/GameContext';
import { CelebrationEffect } from '../../Common/CelebrationEffect';
import { Target, Zap, CheckCircle } from 'lucide-react';
import mockMissions from '../../../data/mockMissions.json';

export const MissionsAndChallenges: React.FC = () => {
  const { userState, recordMissionProgress, addPoints } = useGame();
  const [filter, setFilter] = useState<'daily' | 'weekly'>('daily');
  const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);

  const missions = (mockMissions as any[]).filter((m) => m.frequency === filter);

  const completeMission = (missionId: string, mission: any) => {
    if (completedMissions.has(missionId)) return;

    setCompletedMissions(new Set(completedMissions).add(missionId));
    addPoints(mission.pointsReward);

    recordMissionProgress({
      missionId,
      userId: userState?.userId || 'unknown',
      completionCount: 1,
      isCompleted: true,
      completedAt: new Date().toISOString(),
    });

    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1000);
  };

  return (
    <div className="space-y-6">
      <Card gradient>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              <Target size={32} /> Missions & Challenges
            </h2>
            <p className="text-slate-300">Complete daily and weekly missions to earn rewards</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <p className="text-slate-400 text-sm">Completed Today</p>
            <p className="text-2xl font-bold text-primary-400">{completedMissions.size}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <p className="text-slate-400 text-sm">XP Earned</p>
            <p className="text-2xl font-bold text-secondary-400">{userState?.currentXP || 0}/100</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <p className="text-slate-400 text-sm">Streak</p>
            <p className="text-2xl font-bold text-accent-400">{userState?.streakCount || 0} 🔥</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(['daily', 'weekly'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === f
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      {/* Missions Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {missions.map((mission: any, idx: number) => {
          const isCompleted = completedMissions.has(mission.id);

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card hover={!isCompleted} gradient={!isCompleted}>
                <div className={`rounded-lg p-4 mb-4 ${mission.color} bg-opacity-20`}>
                  <div className="text-3xl">{mission.icon}</div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{mission.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{mission.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-3">
                    <span className="px-2 py-1 bg-primary-500/20 text-primary-300 text-xs rounded font-semibold">
                      +{mission.pointsReward} Points
                    </span>
                    <span className="px-2 py-1 bg-secondary-500/20 text-secondary-300 text-xs rounded font-semibold">
                      +{mission.xpReward} XP
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => completeMission(mission.id, mission)}
                  disabled={isCompleted}
                  size="sm"
                  className="w-full"
                  icon={isCompleted ? <CheckCircle size={16} /> : <Zap size={16} />}
                >
                  {isCompleted ? 'Completed' : 'Complete Mission'}
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Leaderboard Stats */}
      <Card>
        <h3 className="text-xl font-bold text-white mb-4">Your Progress</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300">Level {userState?.level || 1}</span>
              <span className="text-slate-400 text-sm">{userState?.currentXP || 0}/100 XP</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((userState?.currentXP || 0) / 100) * 100}%` }}
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
              />
            </div>
          </div>
        </div>
      </Card>

      <CelebrationEffect trigger={showCelebration} intensity="medium" />
    </div>
  );
};
