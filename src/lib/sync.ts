import { usePlayerStore } from '../store/usePlayerStore';
import { useProgressStore } from '../store/useProgressStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAuthStore } from '../store/useAuthStore';
import { saveState } from './api';

let syncTimeout: ReturnType<typeof setTimeout> | null = null;

function debouncedSync() {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    const player = usePlayerStore.getState().player;
    const progress = useProgressStore.getState().progress;
    const settings = useSettingsStore.getState().settings;

    saveState({
      player: player as unknown as Record<string, unknown>,
      progress: progress as unknown as Record<string, unknown>,
      settings: settings as unknown as Record<string, unknown>,
    }).catch((err) => {
      console.error('Failed to sync state to server:', err);
    });
  }, 1000);
}

let initialized = false;

export function initSync() {
  if (initialized) return;
  initialized = true;

  // Subscribe to store changes and sync to server
  usePlayerStore.subscribe(debouncedSync);
  useProgressStore.subscribe(debouncedSync);
  useSettingsStore.subscribe(debouncedSync);
}
