import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useProgressStore } from '../store/useProgressStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { allTopics } from '../data/curriculum';
import { getMasteryPercent } from '../engine/adaptiveDifficulty';
import { formatPercent } from '../utils/format';
import * as api from '../lib/api';
import type { KidInfo } from '../lib/api';
import './ParentPage.css';

function KidManager() {
  const [kids, setKids] = useState<KidInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const loadKids = async () => {
    try {
      const data = await api.listKids();
      setKids(data);
    } catch {
      setError('שגיאה בטעינת ילדים');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadKids(); }, []);

  const handleCreate = async () => {
    if (!username.trim() || !password || !name.trim()) return;
    setError('');
    try {
      await api.createKid({
        username: username.trim(),
        password,
        name: name.trim(),
        avatarId: 'wizard',
      });
      setUsername('');
      setPassword('');
      setName('');
      setShowForm(false);
      loadKids();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה ביצירת חשבון');
    }
  };

  if (loading) return <p>טוען...</p>;

  return (
    <div>
      <div className="kids-header">
        <h3>ילדים ({kids.length})</h3>
        <button className="add-kid-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'ביטול' : '+ הוסף ילד/ה'}
        </button>
      </div>

      {error && <div className="login-error">{error}</div>}

      {showForm && (
        <div className="add-kid-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="שם הילד/ה"
            className="login-input"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="שם משתמש להתחברות"
            className="login-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="סיסמה"
            className="login-input"
          />
          <button className="pin-submit" onClick={handleCreate}>
            צור חשבון
          </button>
        </div>
      )}

      <div className="kids-list">
        {kids.map((kid) => {
          const player = kid.player as Record<string, unknown> | null;
          const progress = kid.progress as Record<string, unknown> | null;
          const totalXp = (player?.totalXp as number) || 0;
          const level = (player?.level as number) || 0;
          const completedStages = (progress?.completedStages as string[]) || [];
          const history = (progress?.history as Array<{ correctAnswers: number; questionsAnswered: number }>) || [];
          const totalCorrect = history.reduce((s, l) => s + l.correctAnswers, 0);
          const totalAnswered = history.reduce((s, l) => s + l.questionsAnswered, 0);

          return (
            <div key={kid.id} className="kid-card">
              <div className="kid-card-header">
                <strong>{kid.name}</strong>
                <span className="kid-username">@{kid.username}</span>
              </div>
              <div className="kid-card-stats">
                <span>רמה {level}</span>
                <span>{totalXp} XP</span>
                <span>{completedStages.length} שלבים</span>
                <span>{totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0}% דיוק</span>
              </div>
            </div>
          );
        })}
        {kids.length === 0 && <p>אין ילדים עדיין. צור חשבון לילד/ה למעלה.</p>}
      </div>
    </div>
  );
}

function KidDashboard() {
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

export default function ParentPage() {
  const authUser = useAuthStore((s) => s.user);

  // Parent account: show kid management
  if (authUser?.role === 'parent') {
    return (
      <div className="parent-page">
        <h2>📊 דשבורד הורה</h2>
        <KidManager />
      </div>
    );
  }

  // Kid account: show PIN-protected dashboard
  return <KidDashboard />;
}
