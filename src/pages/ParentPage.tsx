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
      setError('Failed to load kids');
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
      setError(err instanceof Error ? err.message : 'Failed to create kid');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="kids-header">
        <h3>Kids ({kids.length})</h3>
        <button className="add-kid-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Kid'}
        </button>
      </div>

      {error && <div className="login-error">{error}</div>}

      {showForm && (
        <div className="add-kid-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Kid's name"
            className="login-input"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username for login"
            className="login-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="login-input"
          />
          <button className="pin-submit" onClick={handleCreate}>
            Create Account
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
                <span>Level {level}</span>
                <span>{totalXp} XP</span>
                <span>{completedStages.length} stages</span>
                <span>{totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0}% accuracy</span>
              </div>
            </div>
          );
        })}
        {kids.length === 0 && <p>No kids yet. Create an account for your child above.</p>}
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
          <h2>Parent Dashboard</h2>
          <p>Enter access code (default: 1234)</p>
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN code"
            className="pin-input"
          />
          <button
            className="pin-submit"
            onClick={() => {
              if (pin === settings.parentPin) setAuthenticated(true);
              else setPin('');
            }}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  if (!player) return <p>No player data</p>;

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
      <h2>Parent Dashboard</h2>

      <div className="parent-overview">
        <div className="parent-stat">
          <div className="parent-stat-value">{totalDays}</div>
          <div className="parent-stat-label">Practice days</div>
        </div>
        <div className="parent-stat">
          <div className="parent-stat-value">{totalAnswered}</div>
          <div className="parent-stat-label">Total questions</div>
        </div>
        <div className="parent-stat">
          <div className="parent-stat-value">{formatPercent(totalAnswered > 0 ? totalCorrect / totalAnswered : 0)}</div>
          <div className="parent-stat-label">Accuracy</div>
        </div>
        <div className="parent-stat">
          <div className="parent-stat-value">{Math.round(totalTime / 60)}</div>
          <div className="parent-stat-label">Total minutes</div>
        </div>
        <div className="parent-stat">
          <div className="parent-stat-value">{progress.completedStages.length}</div>
          <div className="parent-stat-label">Stages completed</div>
        </div>
        <div className="parent-stat">
          <div className="parent-stat-value">{player.streak}</div>
          <div className="parent-stat-label">Current streak</div>
        </div>
      </div>

      <h3>Topic Mastery</h3>
      <table className="parent-table">
        <thead>
          <tr>
            <th>Topic</th>
            <th>Grade</th>
            <th>Questions</th>
            <th>Accuracy</th>
            <th>Difficulty</th>
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

      <h3>Last 14 Days Activity</h3>
      <div className="activity-log">
        {last14.length === 0 && <p>No activity</p>}
        {last14.reverse().map((log, i) => (
          <div key={i} className="activity-entry">
            <span className="activity-date">{log.date}</span>
            <span>{log.questionsAnswered} questions</span>
            <span>{log.correctAnswers} correct</span>
            <span>{Math.round(log.timeSpentSeconds / 60)} min</span>
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
        <h2>Parent Dashboard</h2>
        <KidManager />
      </div>
    );
  }

  // Kid account: show PIN-protected dashboard
  return <KidDashboard />;
}
