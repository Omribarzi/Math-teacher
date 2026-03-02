import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { usePlayerStore } from './store/usePlayerStore';
import { useProgressStore } from './store/useProgressStore';
import { useSettingsStore } from './store/useSettingsStore';
import { initSync } from './lib/sync';
import * as api from './lib/api';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import AdventurePage from './pages/AdventurePage';
import PracticePage from './pages/PracticePage';
import ChallengePage from './pages/ChallengePage';
import ProfilePage from './pages/ProfilePage';
import ParentPage from './pages/ParentPage';
import type { Player, Progress, Settings } from './types';

function AppRoutes() {
  const player = usePlayerStore((s) => s.player);
  const authUser = useAuthStore((s) => s.user);

  // Parent users go straight to parent page
  if (authUser?.role === 'parent') {
    return (
      <Routes>
        <Route element={<Layout />}>
          <Route path="*" element={<ParentPage />} />
        </Route>
      </Routes>
    );
  }

  if (!player) {
    return <WelcomePage />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/adventure" element={<AdventurePage />} />
        <Route path="/practice/:stageId" element={<PracticePage />} />
        <Route path="/challenge" element={<ChallengePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/parent" element={<ParentPage />} />
      </Route>
    </Routes>
  );
}

function AuthenticatedApp() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFromServer() {
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
        // No saved state yet, use defaults
      } finally {
        setLoading(false);
        initSync();
      }
    }
    loadFromServer();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '1.5rem' }}>
        ...
      </div>
    );
  }

  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}

export default function App() {
  const isLoggedIn = useAuthStore((s) => s.token && s.user);

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return <AuthenticatedApp />;
}
