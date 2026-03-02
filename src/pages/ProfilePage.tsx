import { usePlayerStore } from '../store/usePlayerStore';
import { useProgressStore } from '../store/useProgressStore';
import { achievements } from '../data/achievements';
import { allTopics } from '../data/curriculum';
import CharacterAvatar from '../components/Adventure/CharacterAvatar';
import { levelTitle } from '../utils/xp';
import { getMasteryPercent } from '../engine/adaptiveDifficulty';
import './ProfilePage.css';

export default function ProfilePage() {
  const player = usePlayerStore((s) => s.player);
  const progress = useProgressStore((s) => s.progress);

  if (!player) return null;

  const totalCorrect = progress.history.reduce((s, l) => s + l.correctAnswers, 0);

  // Get practiced topics with mastery
  const practicedTopics = allTopics
    .filter((t) => progress.topicMastery[t.id]?.totalCount > 0)
    .sort((a, b) => (a.grade - b.grade));

  return (
    <div className="profile-page">
      <div className="profile-header">
        <CharacterAvatar avatarId={player.avatarId} size="large" />
        <h1>{player.name}</h1>
        <p>{levelTitle(player.level)} · רמה {player.level}</p>
        <div className="profile-stats-row">
          <span>🔥 {player.streak} ימים ברצף</span>
          <span>⭐ {player.totalXp} XP</span>
          <span>📊 {totalCorrect} נכונות</span>
        </div>
      </div>

      <section className="profile-section">
        <h2>🏆 הישגים ({player.achievements.length}/{achievements.length})</h2>
        <div className="achievements-grid">
          {achievements.map((a) => {
            const unlocked = player.achievements.includes(a.id);
            return (
              <div
                key={a.id}
                className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}
              >
                <span className="achievement-icon">{a.icon}</span>
                <span className="achievement-name">{a.name}</span>
                <span className="achievement-desc">{a.description}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="profile-section">
        <h2>📈 שליטה בנושאים</h2>
        <div className="mastery-list">
          {practicedTopics.map((topic) => {
            const mastery = progress.topicMastery[topic.id];
            const pct = mastery ? getMasteryPercent(mastery) : 0;
            return (
              <div key={topic.id} className="mastery-item">
                <div className="mastery-info">
                  <span className="mastery-name">{topic.name}</span>
                  <span className="mastery-grade">כיתה {
                    topic.grade === 2 ? 'ב׳' : topic.grade === 3 ? 'ג׳' : topic.grade === 4 ? 'ד׳' : topic.grade === 5 ? 'ה׳' : 'ו׳'
                  }</span>
                </div>
                <div className="mastery-bar-bg">
                  <div
                    className="mastery-bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: pct >= 85 ? '#4CAF50' : pct >= 60 ? '#FF9800' : '#f44336',
                    }}
                  />
                </div>
                <span className="mastery-pct">{pct}%</span>
              </div>
            );
          })}
          {practicedTopics.length === 0 && (
            <p className="empty-text">עוד לא תרגלת שום נושא. בוא נתחיל!</p>
          )}
        </div>
      </section>
    </div>
  );
}
