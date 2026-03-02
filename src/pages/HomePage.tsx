import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';
import { useProgressStore } from '../store/useProgressStore';
import { worlds } from '../data/worlds';

import CharacterAvatar from '../components/Adventure/CharacterAvatar';
import { levelTitle } from '../utils/xp';
import { formatPercent } from '../utils/format';
import './HomePage.css';

export default function HomePage() {
  const player = usePlayerStore((s) => s.player);
  const progress = useProgressStore((s) => s.progress);
  const navigate = useNavigate();

  if (!player) return null;

  const currentWorld = worlds.find((w) => w.id === progress.currentWorldId);

  // Find next incomplete stage
  const nextStage = currentWorld?.stages.find(
    (s) => !progress.completedStages.includes(s.id)
  );

  // Calculate overall stats
  const totalCorrect = progress.history.reduce((s, l) => s + l.correctAnswers, 0);
  const totalAnswered = progress.history.reduce((s, l) => s + l.questionsAnswered, 0);
  const accuracy = totalAnswered > 0 ? totalCorrect / totalAnswered : 0;

  return (
    <div className="home-page">
      <div className="home-hero">
        <CharacterAvatar avatarId={player.avatarId} size="large" />
        <h1>שלום {player.name}!</h1>
        <p className="home-subtitle">
          {levelTitle(player.level)} · רמה {player.level}
        </p>
      </div>

      <div className="home-stats">
        <div className="stat-card">
          <div className="stat-value">{progress.completedStages.length}</div>
          <div className="stat-label">שלבים הושלמו</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalCorrect}</div>
          <div className="stat-label">תשובות נכונות</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatPercent(accuracy)}</div>
          <div className="stat-label">דיוק</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{player.achievements.length}</div>
          <div className="stat-label">הישגים</div>
        </div>
      </div>

      {nextStage && currentWorld && (
        <div className="home-continue">
          <h2>המשך הרפתקה</h2>
          <button
            className="continue-btn"
            style={{ background: currentWorld.color }}
            onClick={() => navigate(`/practice/${nextStage.id}`)}
          >
            <span className="continue-emoji">{currentWorld.emoji}</span>
            <div className="continue-info">
              <span className="continue-world">{currentWorld.name}</span>
              <span className="continue-stage">{nextStage.name}</span>
            </div>
            <span className="continue-arrow">←</span>
          </button>
        </div>
      )}

      <div className="home-actions">
        <button className="action-btn action-adventure" onClick={() => navigate('/adventure')}>
          🗺️ מפת ההרפתקה
        </button>
        <button className="action-btn action-challenge" onClick={() => navigate('/challenge')}>
          ⚡ אתגר יומי
        </button>
      </div>
    </div>
  );
}
