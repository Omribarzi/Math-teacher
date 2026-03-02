import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useProgressStore } from '../store/useProgressStore';
import { useSettingsStore } from '../store/useSettingsStore';
import * as api from '../lib/api';
import CharacterAvatar from '../components/Adventure/CharacterAvatar';
import type { Player, Progress, Settings } from '../types';
import './LoginPage.css';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatarId, setAvatarId] = useState('wizard');
  const [role, setRole] = useState<'kid' | 'parent'>('kid');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);

  const hydrateStores = async () => {
    try {
      const state = await api.loadState();
      if (state.player) {
        usePlayerStore.setState({ player: state.player as unknown as Player });
      }
      if (state.progress) {
        useProgressStore.setState({ progress: state.progress as unknown as Progress });
      }
      if (state.settings) {
        useSettingsStore.setState({ settings: state.settings as unknown as Settings });
      }
    } catch {
      // New user, no saved state yet
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.login(username.trim(), password);
      setAuth(res.token, res.user);
      await hydrateStores();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username.trim() || !password || !name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.register({
        username: username.trim(),
        password,
        name: name.trim(),
        avatarId,
        role,
      });
      setAuth(res.token, res.user);
      // For kids, create initial player state
      if (role === 'kid') {
        usePlayerStore.getState().createPlayer(name.trim(), avatarId);
        // Sync the newly created player to server
        const player = usePlayerStore.getState().player;
        const progress = useProgressStore.getState().progress;
        const settings = useSettingsStore.getState().settings;
        await api.saveState({ player: player as unknown as Record<string, unknown>, progress: progress as unknown as Record<string, unknown>, settings: settings as unknown as Record<string, unknown> });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>🧮 Math Adventure!</h1>
        <p className="login-subtitle">
          {mode === 'login' ? 'Log in to continue your adventure' : 'Create a new account'}
        </p>

        <div className="login-tabs">
          <button
            className={`login-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Log In
          </button>
          <button
            className={`login-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="login-field">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username..."
            className="login-input"
            autoFocus
          />
        </div>

        <div className="login-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="login-input"
            onKeyDown={(e) => { if (e.key === 'Enter' && mode === 'login') handleLogin(); }}
          />
        </div>

        {mode === 'register' && (
          <>
            <div className="login-field">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name..."
                className="login-input"
              />
            </div>

            <div className="login-field">
              <label>I am a...</label>
              <div className="role-select">
                <button
                  className={`role-btn ${role === 'kid' ? 'active' : ''}`}
                  onClick={() => setRole('kid')}
                >
                  🎒 Kid
                </button>
                <button
                  className={`role-btn ${role === 'parent' ? 'active' : ''}`}
                  onClick={() => setRole('parent')}
                >
                  👨‍👩‍👧 Parent
                </button>
              </div>
            </div>

            {role === 'kid' && (
              <div className="login-field">
                <label>Choose your character:</label>
                <CharacterAvatar
                  avatarId={avatarId}
                  selectable
                  onSelect={setAvatarId}
                />
              </div>
            )}
          </>
        )}

        <button
          className="login-submit"
          onClick={mode === 'login' ? handleLogin : handleRegister}
          disabled={loading || !username.trim() || !password || (mode === 'register' && !name.trim())}
        >
          {loading ? '...' : mode === 'login' ? 'Log In' : 'Create Account'}
        </button>
      </div>
    </div>
  );
}
