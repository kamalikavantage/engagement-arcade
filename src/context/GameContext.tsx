import React, { createContext, useContext, useEffect, useState } from 'react';
import type { GameContextType, UserGameState, QuizAttempt, MissionProgress, SpinAttempt, Badge } from '../types';

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'engagement_arcade_user_';
const CURRENT_USER_ID = 'emp_001'; // Default to first employee

const defaultGameState: UserGameState = {
  userId: CURRENT_USER_ID,
  totalPoints: 0,
  level: 1,
  currentXP: 0,
  badges: [],
  raffleEntries: 0,
  dailySpinUsed: false,
  streakCount: 0,
  quizAttempts: [],
  missionProgress: [],
  spinHistory: [],
  lastUpdated: new Date().toISOString(),
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<UserGameState | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const storageKey = `${STORAGE_KEY_PREFIX}${CURRENT_USER_ID}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        setUserState(JSON.parse(stored));
      } catch {
        setUserState(defaultGameState);
      }
    } else {
      setUserState(defaultGameState);
    }

    // Check if daily spin should reset (midnight)
    const lastSpinDate = stored ? JSON.parse(stored).lastSpinDate : null;
    if (lastSpinDate) {
      const lastDate = new Date(lastSpinDate);
      const today = new Date();
      if (lastDate.toDateString() !== today.toDateString()) {
        // Reset daily spin for new day
        const storageKey = `${STORAGE_KEY_PREFIX}${CURRENT_USER_ID}`;
        const current = JSON.parse(localStorage.getItem(storageKey) || JSON.stringify(defaultGameState));
        current.dailySpinUsed = false;
        localStorage.setItem(storageKey, JSON.stringify(current));
        setUserState(current);
      }
    }
  }, []);

  const saveState = (newState: UserGameState) => {
    const storageKey = `${STORAGE_KEY_PREFIX}${CURRENT_USER_ID}`;
    localStorage.setItem(storageKey, JSON.stringify(newState));
    setUserState(newState);
  };

  const addPoints = (points: number) => {
    if (!userState) return;
    const newState = {
      ...userState,
      totalPoints: userState.totalPoints + points,
      lastUpdated: new Date().toISOString(),
    };
    saveState(newState);
  };

  const addBadge = (badge: Badge) => {
    if (!userState) return;
    const newBadges = [...userState.badges];
    if (!newBadges.find(b => b.id === badge.id)) {
      newBadges.push(badge);
    }
    const newState = {
      ...userState,
      badges: newBadges,
      lastUpdated: new Date().toISOString(),
    };
    saveState(newState);
  };

  const addRaffleEntry = (count: number) => {
    if (!userState) return;
    const newState = {
      ...userState,
      raffleEntries: userState.raffleEntries + count,
      lastUpdated: new Date().toISOString(),
    };
    saveState(newState);
  };

  const recordQuizAttempt = (attempt: QuizAttempt) => {
    if (!userState) return;
    const newState = {
      ...userState,
      quizAttempts: [...userState.quizAttempts, attempt],
      totalPoints: attempt.isCorrect ? userState.totalPoints + attempt.pointsEarned : userState.totalPoints,
      lastUpdated: new Date().toISOString(),
    };
    saveState(newState);
  };

  const recordMissionProgress = (progress: MissionProgress) => {
    if (!userState) return;
    const existing = userState.missionProgress.find(m => m.missionId === progress.missionId);
    const newMissions = existing
      ? userState.missionProgress.map(m => m.missionId === progress.missionId ? progress : m)
      : [...userState.missionProgress, progress];

    const newState = {
      ...userState,
      missionProgress: newMissions,
      lastUpdated: new Date().toISOString(),
    };
    saveState(newState);
  };

  const recordSpinAttempt = (attempt: SpinAttempt) => {
    if (!userState) return;
    const newState = {
      ...userState,
      spinHistory: [...userState.spinHistory, attempt],
      totalPoints: userState.totalPoints + attempt.pointsEarned,
      dailySpinUsed: true,
      lastSpinDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    saveState(newState);
  };

  const updateStreak = (newStreak: number) => {
    if (!userState) return;
    const newState = {
      ...userState,
      streakCount: newStreak,
      lastActivityDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    saveState(newState);
  };

  const completeLevel = () => {
    if (!userState) return;
    const newState = {
      ...userState,
      level: userState.level + 1,
      currentXP: 0,
      lastUpdated: new Date().toISOString(),
    };
    saveState(newState);
  };

  const useDailySpin = (): boolean => {
    if (!userState) return false;
    if (userState.dailySpinUsed) return false;
    return true;
  };

  const resetDailySpin = () => {
    if (!userState) return;
    const newState = {
      ...userState,
      dailySpinUsed: false,
      lastUpdated: new Date().toISOString(),
    };
    saveState(newState);
  };

  return (
    <GameContext.Provider
      value={{
        userState,
        addPoints,
        addBadge,
        addRaffleEntry,
        recordQuizAttempt,
        recordMissionProgress,
        recordSpinAttempt,
        updateStreak,
        completeLevel,
        useDailySpin,
        resetDailySpin,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
