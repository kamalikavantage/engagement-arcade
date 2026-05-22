// Employee and User Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  avatar: string;
  title: string;
  joinDate: string;
}

// Reward Types
export type RewardType = 'points' | 'badge' | 'voucher' | 'raffle' | 'no_reward';

export interface Reward {
  id: string;
  type: RewardType;
  name: string;
  value: number | string;
  probability: number;
  icon: string;
  description: string;
}

export interface UserReward {
  id: string;
  rewardId: string;
  reward: Reward;
  earnedAt: string;
}

// Badge Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt?: string;
}

// Quiz Types
export type QuizCategory = 'company-values' | 'wellness' | 'learning';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  question: string;
  category: QuizCategory;
  difficulty: Difficulty;
  options: string[];
  correctAnswer: number;
  points: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  pointsEarned: number;
  completedAt: string;
  timeSpent: number; // in seconds
  category: QuizCategory;
}

export interface QuizLeaderboardEntry {
  userId: string;
  userName: string;
  avatar: string;
  totalPoints: number;
  questionsAttempted: number;
  accuracyRate: number;
  streak: number;
  rank: number;
}

// Mission Types
export type MissionType = 'recognition' | 'wellness' | 'appreciation' | 'learning' | 'collaboration';
export type MissionFrequency = 'daily' | 'weekly';

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  frequency: MissionFrequency;
  xpReward: number;
  pointsReward: number;
  icon: string;
  color: string;
  targetCount?: number; // e.g., "Send 5 recognitions"
}

export interface MissionProgress {
  missionId: string;
  userId: string;
  completionCount: number;
  isCompleted: boolean;
  completedAt?: string;
  streak?: number; // consecutive completions
}

// Spin Wheel Types
export interface SpinReward extends Reward {
  probability: number;
}

export interface SpinAttempt {
  id: string;
  userId: string;
  rewardId: string;
  reward: Reward;
  spinAt: string;
  pointsEarned: number;
}

// Lucky Draw Types
export interface RaffleEntry {
  id: string;
  userId: string;
  entries: number;
  earnedAt: string[];
}

export interface DrawResult {
  id: string;
  drawDate: string;
  winnerId: string;
  winnerName: string;
  prizeValue: number;
  numberOfParticipants: number;
}

// Scratch Card Types
export interface ScratchCardReward {
  id: string;
  type: RewardType;
  value: number | string;
  name: string;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar: string;
  department: string;
  totalPoints: number;
  badges: number;
  level: number;
  streak: number;
  missionsCompleted: number;
}

// User Game State
export interface UserGameState {
  userId: string;
  totalPoints: number;
  level: number;
  currentXP: number;
  badges: Badge[];
  raffleEntries: number;
  dailySpinUsed: boolean;
  lastSpinDate?: string;
  streakCount: number;
  lastActivityDate?: string;
  quizAttempts: QuizAttempt[];
  missionProgress: MissionProgress[];
  spinHistory: SpinAttempt[];
  lastUpdated: string;
}

// Admin Config Types
export interface ModuleConfig {
  spinWheel: boolean;
  quizArena: boolean;
  scratchCard: boolean;
  luckyDraw: boolean;
  missionsAndChallenges: boolean;
  leaderboards: boolean;
}

export interface ProbabilityConfig {
  points: number;
  badge: number;
  voucher: number;
  raffle: number;
  noReward: number;
}

export interface PointsConfig {
  quizPointsBase: number;
  missionPointsBase: number;
  dailyBonusPoints: number;
  streakMultiplier: number;
}

export interface CampaignConfig {
  startDate: string;
  endDate: string;
  name: string;
  description: string;
}

export interface AdminConfig {
  modules: ModuleConfig;
  probabilities: ProbabilityConfig;
  pointsConfig: PointsConfig;
  campaigns: CampaignConfig;
  rewards: Reward[];
  quizzes: QuizQuestion[];
}

// Context State Types
export interface GameContextType {
  userState: UserGameState | null;
  addPoints: (points: number) => void;
  addBadge: (badge: Badge) => void;
  addRaffleEntry: (count: number) => void;
  recordQuizAttempt: (attempt: QuizAttempt) => void;
  recordMissionProgress: (progress: MissionProgress) => void;
  recordSpinAttempt: (attempt: SpinAttempt) => void;
  updateStreak: (newStreak: number) => void;
  completeLevel: () => void;
  useDailySpin: () => boolean;
  resetDailySpin: () => void;
}

export interface ConfigContextType {
  config: AdminConfig;
  updateConfig: (config: Partial<AdminConfig>) => void;
  updateModules: (modules: Partial<ModuleConfig>) => void;
  updateProbabilities: (probabilities: Partial<ProbabilityConfig>) => void;
  updatePointsConfig: (points: Partial<PointsConfig>) => void;
}

export interface UserContextType {
  currentUser: Employee | null;
  setCurrentUser: (user: Employee) => void;
  department: string;
  setDepartment: (dept: string) => void;
}

// UI Component Props
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  glass?: boolean;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export interface BadgeProps {
  name: string;
  icon: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
