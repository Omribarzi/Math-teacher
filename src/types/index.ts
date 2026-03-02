// === Player & Gamification ===

export interface Player {
  name: string;
  avatarId: string;
  level: number;
  xp: number;
  totalXp: number;
  streak: number;
  bestStreak: number;
  lastPlayDate: string; // ISO date string YYYY-MM-DD
  achievements: string[];
  unlockedWorlds: string[];
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (player: Player, progress: Progress) => boolean;
}

// === Progress & Learning ===

export interface Progress {
  currentGrade: number; // 2-6
  currentTopicId: string;
  currentWorldId: string;
  currentStageIndex: number;
  completedStages: string[]; // stage IDs
  topicMastery: Record<string, TopicMastery>;
  recentAnswers: Record<string, boolean[]>; // topic -> last 10 answers
  history: SessionLog[];
}

export interface TopicMastery {
  topicId: string;
  correctCount: number;
  totalCount: number;
  currentDifficulty: 1 | 2 | 3;
  lastPracticed: string;
}

export interface SessionLog {
  date: string;
  questionsAnswered: number;
  correctAnswers: number;
  topicsPracticed: string[];
  xpEarned: number;
  timeSpentSeconds: number;
}

// === Questions ===

export type QuestionType = 'multiple-choice' | 'fill-blank' | 'true-false';

export interface Question {
  id: string;
  type: QuestionType;
  grade: number;
  topic: string;
  difficulty: 1 | 2 | 3;
  text: string;
  correctAnswer: number | string;
  options?: string[];
  hint?: string;
  explanation?: string;
}

export interface AnswerResult {
  question: Question;
  userAnswer: string | number;
  correct: boolean;
  timeMs: number;
}

// === World & Adventure ===

export interface World {
  id: string;
  name: string;
  description: string;
  grade: number;
  topics: string[];
  stages: Stage[];
  requiredXp: number;
  emoji: string;
  color: string;
}

export interface Stage {
  id: string;
  name: string;
  topic: string;
  questionsCount: number;
  requiredCorrect: number;
  bonusTimeSeconds?: number;
  description: string;
}

// === Topic Definition ===

export interface TopicDefinition {
  id: string;
  name: string;
  grade: number;
  description: string;
  generator: (difficulty: 1 | 2 | 3) => Question;
}

// === Settings ===

export interface Settings {
  soundEnabled: boolean;
  parentPin: string;
  dailyChallengeReminder: boolean;
}
