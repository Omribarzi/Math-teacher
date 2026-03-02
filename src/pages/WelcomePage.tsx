import { useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import CharacterAvatar from '../components/Adventure/CharacterAvatar';
import './WelcomePage.css';

export default function WelcomePage() {
  const [name, setName] = useState('');
  const [avatarId, setAvatarId] = useState('wizard');
  const createPlayer = usePlayerStore((s) => s.createPlayer);

  const handleStart = () => {
    if (!name.trim()) return;
    createPlayer(name.trim(), avatarId);
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
