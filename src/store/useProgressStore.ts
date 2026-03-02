import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Progress, TopicMastery, SessionLog } from '../types';
import { today } from '../utils/format';
import { getNextDifficulty } from '../engine/adaptiveDifficulty';

interface ProgressStore {
  progress: Progress;
  recordAnswer: (topicId: string, correct: boolean) => void;
  completeStage: (stageId: string) => void;
  setCurrentTopic: (topicId: string) => void;
  setCurrentWorld: (worldId: string) => void;
  addSessionLog: (log: Omit<SessionLog, 'date'>) => void;
  getTotalCorrect: () => number;
  getTotalAnswered: () => number;
}

const initialProgress: Progress = {
  currentGrade: 2,
  currentTopicId: 'addition',
  currentWorldId: 'number-kingdom',
  currentStageIndex: 0,
  completedStages: [],
  topicMastery: {},
  recentAnswers: {},
  history: [],
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: initialProgress,

      recordAnswer: (topicId, correct) => {
        const { progress } = get();

        // Update recent answers
        const recentForTopic = progress.recentAnswers[topicId] ?? [];
        const newRecent = [...recentForTopic, correct].slice(-10);

        // Update topic mastery
        const existingMastery = progress.topicMastery[topicId] ?? {
          topicId,
          correctCount: 0,
          totalCount: 0,
          currentDifficulty: 1 as const,
          lastPracticed: today(),
        };

        const updatedMastery: TopicMastery = {
          ...existingMastery,
          correctCount: existingMastery.correctCount + (correct ? 1 : 0),
          totalCount: existingMastery.totalCount + 1,
          currentDifficulty: getNextDifficulty(newRecent, existingMastery.currentDifficulty),
          lastPracticed: today(),
        };

        set({
          progress: {
            ...progress,
            recentAnswers: {
              ...progress.recentAnswers,
              [topicId]: newRecent,
            },
            topicMastery: {
              ...progress.topicMastery,
              [topicId]: updatedMastery,
            },
          },
        });
      },

      completeStage: (stageId) => {
        const { progress } = get();
        if (progress.completedStages.includes(stageId)) return;
        set({
          progress: {
            ...progress,
            completedStages: [...progress.completedStages, stageId],
          },
        });
      },

      setCurrentTopic: (topicId) => {
        set({ progress: { ...get().progress, currentTopicId: topicId } });
      },

      setCurrentWorld: (worldId) => {
        set({ progress: { ...get().progress, currentWorldId: worldId } });
      },

      addSessionLog: (log) => {
        const { progress } = get();
        set({
          progress: {
            ...progress,
            history: [
              ...progress.history,
              { ...log, date: today() },
            ],
          },
        });
      },

      getTotalCorrect: () => {
        return get().progress.history.reduce((s, l) => s + l.correctAnswers, 0);
      },

      getTotalAnswered: () => {
        return get().progress.history.reduce((s, l) => s + l.questionsAnswered, 0);
      },
    }),
    {
      name: 'math-progress',
    }
  )
);
