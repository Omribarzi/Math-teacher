import { NavLink, Outlet } from 'react-router-dom';
import { usePlayerStore } from '../../store/usePlayerStore';
import XPBar from '../Gamification/XPBar';
import StreakBadge from '../Gamification/StreakBadge';
import CharacterAvatar from '../Adventure/CharacterAvatar';
import './Layout.css';

export default function Layout() {
  const player = usePlayerStore((s) => s.player);

  if (!player) return <Outlet />;

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-right">
          <CharacterAvatar avatarId={player.avatarId} size="small" />
          <span className="header-name">{player.name}</span>
        </div>
        <div className="header-center">
          <XPBar />
        </div>
        <div className="header-left">
          <StreakBadge />
        </div>
      </header>

      <nav className="layout-nav">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
          🏠 ראשי
        </NavLink>
        <NavLink to="/adventure" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          🗺️ הרפתקה
        </NavLink>
        <NavLink to="/challenge" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          ⚡ אתגר יומי
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          🏆 הישגים
        </NavLink>
      </nav>

      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
