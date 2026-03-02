import { usePlayerStore } from '../../store/usePlayerStore';
import { xpProgress, levelTitle, totalXpForLevel } from '../../utils/xp';
import './XPBar.css';

export default function XPBar() {
  const player = usePlayerStore((s) => s.player);
  if (!player) return null;

  const progress = xpProgress(player.totalXp);
  const nextLevelXp = totalXpForLevel(player.level + 1);

  return (
    <div className="xp-bar-container">
      <div className="xp-level">
        <span className="xp-level-number">Lv.{player.level}</span>
        <span className="xp-level-title">{levelTitle(player.level)}</span>
      </div>
      <div className="xp-bar">
        <div className="xp-bar-fill" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="xp-text">
        {player.totalXp} / {nextLevelXp} XP
      </div>
    </div>
  );
}
