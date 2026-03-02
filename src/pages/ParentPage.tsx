import { useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useProgressStore } from '../store/useProgressStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { allTopics } from '../data/curriculum';
import { getMasteryPercent } from '../engine/adaptiveDifficulty';
import { formatPercent } from '../utils/format';
import './ParentPage.css';

export default function ParentPage() {
  const player = usePlayerStore((s) => s.player);
  const progress = useProgressStore((s) => s.progress);
  const { settings } = useSettingsStore();
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return (
      <div className="parent-page">
        <div className="pin-form">
          <h2>🔒 דשבורד הורה</h2>
          <p>הכנס קוד גישה (ברירת מחדל: 1234)</p>
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="קוד PIN"
            className="pin-input"
          />
          <button
            className="pin-submit"
            onClick={() => {
              if (pin === settings.parentPin) setAuthenticated(true);
              else setPin('');
            }}
          >
            כניסה
          </button>
        </div>
      </div>
    );
  }

  if (!player) return <p>אין נתוני שחקן</p>;

  const totalDays = progress.history.reduce((days, log) => {
    days.add(log.date);
    return days;
  }, new Set<string>()).size;

  const totalCorrect = progress.history.reduce((s, l) => s + l.correctAnswers, 0);
  const totalAnswered = progress.history.reduce((s, l) => s + l.questionsAnswered, 0);
  const totalTime = progress.history.reduce((s, l) => s + l.timeSpentSeconds, 0);

  // Group by date (last 14 days)
  const last14 = progress.history
    .filter((l) => {
      const d = new Date(l.date);
      const now = new Date();
      return now.getTime() - d.getTime() < 14 * 86400000;
    });

  return (
    <div className="parent-page">
      <h2>📊 דשבורד הורה</h2>

      <div className="parent-overview">
        <div className="parent-stat">
          <div className="parent-stat-value">{totalDays}</div>
          <div className="parent-stat-label">ימי תרגול</div>
        </div>
        <div className="parent-stat">
          <div className="parent-stat-value">{totalAnswered}</div>
          <div className="parent-stat-label">שאלות סה"כ</div>
        </div>
        <div className="parent-stat">
          <div className="parent-stat-value">{formatPercent(totalAnswered > 0 ? totalCorrect / totalAnswered : 0)}</div>
          <div className="parent-stat-label">דיוק כללי</div>
        </div>
        <div className="parent-stat">
          <div className="parent-stat-value">{Math.round(totalTime / 60)}</div>
          <div className="parent-stat-label">דקות סה"כ</div>
        </div>
        <div className="parent-stat">
          <div className="parent-stat-value">{progress.completedStages.length}</div>
          <div className="parent-stat-label">שלבים הושלמו</div>
        </div>
        <div className="parent-stat">
          <div className="parent-stat-value">{player.streak}</div>
          <div className="parent-stat-label">רצף נוכחי</div>
        </div>
      </div>

      <h3>שליטה בנושאים</h3>
      <table className="parent-table">
        <thead>
          <tr>
            <th>נושא</th>
            <th>כיתה</th>
            <th>שאלות</th>
            <th>דיוק</th>
            <th>רמת קושי</th>
          </tr>
        </thead>
        <tbody>
          {allTopics
            .filter((t) => progress.topicMastery[t.id]?.totalCount > 0)
            .map((topic) => {
              const m = progress.topicMastery[topic.id];
              return (
                <tr key={topic.id}>
                  <td>{topic.name}</td>
                  <td>{topic.grade}</td>
                  <td>{m.totalCount}</td>
                  <td>{getMasteryPercent(m)}%</td>
                  <td>{'⭐'.repeat(m.currentDifficulty)}</td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <h3>פעילות ב-14 ימים אחרונים</h3>
      <div className="activity-log">
        {last14.length === 0 && <p>אין פעילות</p>}
        {last14.reverse().map((log, i) => (
          <div key={i} className="activity-entry">
            <span className="activity-date">{log.date}</span>
            <span>{log.questionsAnswered} שאלות</span>
            <span>{log.correctAnswers} נכונות</span>
            <span>{Math.round(log.timeSpentSeconds / 60)} דקות</span>
          </div>
        ))}
      </div>
    </div>
  );
}
