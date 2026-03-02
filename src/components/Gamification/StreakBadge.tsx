import { usePlayerStore } from '../../store/usePlayerStore';
import './StreakBadge.css';

export default function StreakBadge() {
  const player = usePlayerStore((s) => s.player);
  if (!player) return null;

  return (
    <div className={`streak-badge ${player.streak >= 7 ? 'streak-hot' : ''}`}>
      <span className="streak-icon">{player.streak > 0 ? '🔥' : '💤'}</span>
      <span className="streak-count">{player.streak}</span>
      <span className="streak-label">ימים ברצף</span>
    </div>
  );
}
