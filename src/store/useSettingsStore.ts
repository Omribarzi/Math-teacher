import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types';

interface SettingsStore {
  settings: Settings;
  setSoundEnabled: (enabled: boolean) => void;
  setParentPin: (pin: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: {
        soundEnabled: true,
        parentPin: '1234',
        dailyChallengeReminder: true,
      },

      setSoundEnabled: (enabled) => {
        set({ settings: { ...get().settings, soundEnabled: enabled } });
      },

      setParentPin: (pin) => {
        set({ settings: { ...get().settings, parentPin: pin } });
      },
    }),
    {
      name: 'math-settings',
    }
  )
);
