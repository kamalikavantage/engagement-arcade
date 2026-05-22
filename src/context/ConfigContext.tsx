import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ConfigContextType, AdminConfig, ModuleConfig, ProbabilityConfig, PointsConfig } from '../types';
import mockRewards from '../data/mockRewards.json';
import mockQuizzes from '../data/mockQuizzes.json';

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const CONFIG_STORAGE_KEY = 'engagement_arcade_admin_config';

const defaultConfig: AdminConfig = {
  modules: {
    spinWheel: true,
    quizArena: true,
    scratchCard: true,
    luckyDraw: true,
    missionsAndChallenges: true,
    leaderboards: true,
  },
  probabilities: {
    points: 0.75,
    badge: 0.14,
    voucher: 0.07,
    raffle: 0.03,
    noReward: 0.01,
  },
  pointsConfig: {
    quizPointsBase: 10,
    missionPointsBase: 50,
    dailyBonusPoints: 25,
    streakMultiplier: 1.5,
  },
  campaigns: {
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    name: 'May Engagement Challenge',
    description: 'Join us in celebrating employee engagement this month!',
  },
  rewards: mockRewards as any,
  quizzes: mockQuizzes as any,
};

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AdminConfig>(defaultConfig);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (stored) {
      try {
        setConfig(JSON.parse(stored));
      } catch {
        setConfig(defaultConfig);
      }
    } else {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(defaultConfig));
    }
  }, []);

  const updateConfig = (newConfig: Partial<AdminConfig>) => {
    const updated = { ...config, ...newConfig };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
    setConfig(updated);
  };

  const updateModules = (modules: Partial<ModuleConfig>) => {
    const updated = {
      ...config,
      modules: { ...config.modules, ...modules },
    };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
    setConfig(updated);
  };

  const updateProbabilities = (probabilities: Partial<ProbabilityConfig>) => {
    const updated = {
      ...config,
      probabilities: { ...config.probabilities, ...probabilities },
    };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
    setConfig(updated);
  };

  const updatePointsConfig = (points: Partial<PointsConfig>) => {
    const updated = {
      ...config,
      pointsConfig: { ...config.pointsConfig, ...points },
    };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
    setConfig(updated);
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        updateConfig,
        updateModules,
        updateProbabilities,
        updatePointsConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
};
