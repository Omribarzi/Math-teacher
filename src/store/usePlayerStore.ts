import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player } from '../types';
import { levelFromTotalXp } from '../utils/xp';
import { today, isToday, isYesterday } from '../utils/format';
import { achievements } from '../data/achievements';
import { worlds } from '../data/worlds';

interface PlayerStore {
  player: Player | null;
  createPlayer: (name: string, avatarId: string) => void;
  addXp: (amount: number) => string[]; // returns new achievement IDs
  updateStreak: () => void;
  unlockWorld: (worldId: string) => void;
  checkAchievements: () => string[];
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      player: null,

      createPlayer: (name, avatarId) => {
        set({
          player: {
            name,
            avatarId,
            level: 1,
            xp: 0,
            totalXp: 0,
            streak: 0,
            bestStreak: 0,
            lastPlayDate: '',
            achievements: [],
            unlockedWorlds: ['number-kingdom'],
            createdAt: today(),
          },
        });
      },

      addXp: (amount) => {
        const { player } = get();
        if (!player) return [];

        const newTotalXp = player.totalXp + amount;
        const newLevel = levelFromTotalXp(newTotalXp);
        const newXp = player.xp + amount;

        set({
          player: {
            ...player,
            xp: newXp,
            totalXp: newTotalXp,
            level: newLevel,
          },
        });

        // Check if any new worlds should be unlocked
        const { player: updatedPlayer } = get();
        if (updatedPlayer) {
          const newWorlds: string[] = [];
          for (const world of worlds) {
            if (
              !updatedPlayer.unlockedWorlds.includes(world.id) &&
              updatedPlayer.totalXp >= world.requiredXp
            ) {
              newWorlds.push(world.id);
            }
          }
          if (newWorlds.length > 0) {
            for (const wid of newWorlds) {
              get().unlockWorld(wid);
            }
          }
        }

        return get().checkAchievements();
      },

      updateStreak: () => {
        const { player } = get();
        if (!player) return;

        const todayStr = today();
        if (isToday(player.lastPlayDate)) return; // Already updated today

        let newStreak: number;
        if (isYesterday(player.lastPlayDate)) {
          newStreak = player.streak + 1;
        } else if (player.lastPlayDate === '') {
          newStreak = 1;
        } else {
          newStreak = 1; // Streak broken
        }

        set({
          player: {
            ...player,
            streak: newStreak,
            bestStreak: Math.max(player.bestStreak, newStreak),
            lastPlayDate: todayStr,
          },
        });
      },

      unlockWorld: (worldId) => {
        const { player } = get();
        if (!player || player.unlockedWorlds.includes(worldId)) return;
        set({
          player: {
            ...player,
            unlockedWorlds: [...player.unlockedWorlds, worldId],
          },
        });
      },

      checkAchievements: () => {
        const { player } = get();
        if (!player) return [];

        // We need progress store for some achievements but can't import it here
        // So we'll check achievements that only need player data
        const newAchievements: string[] = [];
        const progressStr = localStorage.getItem('math-progress');
        const progress = progressStr ? JSON.parse(progressStr)?.state?.progress : null;

        if (!progress) return [];

        for (const achievement of achievements) {
          if (!player.achievements.includes(achievement.id)) {
            if (achievement.condition(player, progress)) {
              newAchievements.push(achievement.id);
            }
          }
        }

        if (newAchievements.length > 0) {
          set({
            player: {
              ...player,
              achievements: [...player.achievements, ...newAchievements],
            },
          });
        }

        return newAchievements;
      },
    }),
    {
      name: 'math-player',
    }
  )
);
