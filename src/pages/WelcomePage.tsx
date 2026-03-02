import { useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useProgressStore } from '../store/useProgressStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAuthStore } from '../store/useAuthStore';
import * as api from '../lib/api';
import CharacterAvatar from '../components/Adventure/CharacterAvatar';
import './WelcomePage.css';

export default function WelcomePage() {
  const authUser = useAuthStore((s) => s.user);
  const [name, setName] = useState(authUser?.name || '');
  const [avatarId, setAvatarId] = useState(authUser?.avatarId || 'wizard');
  const createPlayer = usePlayerStore((s) => s.createPlayer);

  const handleStart = () => {
    if (!name.trim()) return;
    createPlayer(name.trim(), avatarId);

    // Sync to server
    const player = usePlayerStore.getState().player;
    const progress = useProgressStore.getState().progress;
    const settings = useSettingsStore.getState().settings;
    api.saveState({
      player: player as unknown as Record<string, unknown>,
      progress: progress as unknown as Record<string, unknown>,
      settings: settings as unknown as Record<string, unknown>,
    }).catch(() => { /* will sync later */ });
  };

  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <h1>🧮 הרפתקה מתמטית!</h1>
        <p className="welcome-subtitle">בוא ללמוד חשבון דרך הרפתקה מרגשת</p>

        <div className="welcome-section">
          <label>מה השם שלך?</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="הכנס שם..."
            className="welcome-input"
            autoFocus
          />
        </div>

        <div className="welcome-section">
          <label>בחר דמות:</label>
          <CharacterAvatar
            avatarId={avatarId}
            selectable
            onSelect={setAvatarId}
          />
        </div>

        <button
          className="welcome-start"
          onClick={handleStart}
          disabled={!name.trim()}
        >
          🚀 בוא נתחיל!
        </button>
      </div>
    </div>
  );
}
