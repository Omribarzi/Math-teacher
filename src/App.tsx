import { HashRouter, Routes, Route } from 'react-router-dom';
import { usePlayerStore } from './store/usePlayerStore';
import Layout from './components/Layout/Layout';
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import AdventurePage from './pages/AdventurePage';
import PracticePage from './pages/PracticePage';
import ChallengePage from './pages/ChallengePage';
import ProfilePage from './pages/ProfilePage';
import ParentPage from './pages/ParentPage';

function AppRoutes() {
  const player = usePlayerStore((s) => s.player);

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

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
