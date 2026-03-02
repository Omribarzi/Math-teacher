import { worlds } from '../../data/worlds';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useProgressStore } from '../../store/useProgressStore';
import './WorldMap.css';

interface Props {
  onSelectWorld: (worldId: string) => void;
}

export default function WorldMap({ onSelectWorld }: Props) {
  const player = usePlayerStore((s) => s.player);
  const progress = useProgressStore((s) => s.progress);

  if (!player) return null;

  return (
    <div className="world-map">
      <h2 className="world-map-title">מפת ההרפתקה</h2>
      <div className="world-map-path">
        {worlds.map((world) => {
          const unlocked = player.unlockedWorlds.includes(world.id);
          const completedCount = world.stages.filter((s) =>
            progress.completedStages.includes(s.id)
          ).length;
          const totalStages = world.stages.length;
          const isCurrent = progress.currentWorldId === world.id;

          return (
            <button
              key={world.id}
              className={`world-node ${unlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`}
              style={{ '--world-color': world.color } as React.CSSProperties}
              onClick={() => unlocked && onSelectWorld(world.id)}
              disabled={!unlocked}
            >
              <span className="world-emoji">{world.emoji}</span>
              <span className="world-name">{world.name}</span>
              <span className="world-grade">כיתה {world.grade === 2 ? 'ב׳' : world.grade === 3 ? 'ג׳' : world.grade === 4 ? 'ד׳' : world.grade === 5 ? 'ה׳' : 'ו׳'}</span>
              {unlocked && (
                <span className="world-progress">
                  {completedCount}/{totalStages}
                </span>
              )}
              {!unlocked && (
                <span className="world-locked">🔒 {world.requiredXp} XP</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
