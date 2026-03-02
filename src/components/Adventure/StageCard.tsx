import type { Stage } from '../../types';
import { useProgressStore } from '../../store/useProgressStore';
import './StageCard.css';

interface Props {
  stage: Stage;
  index: number;
  worldColor: string;
  onSelect: (stageId: string) => void;
  isAccessible: boolean;
}

export default function StageCard({ stage, index, worldColor, onSelect, isAccessible }: Props) {
  const completedStages = useProgressStore((s) => s.progress.completedStages);
  const isCompleted = completedStages.includes(stage.id);

  return (
    <button
      className={`stage-card ${isCompleted ? 'completed' : ''} ${isAccessible ? 'accessible' : 'locked'}`}
      style={{ '--stage-color': worldColor } as React.CSSProperties}
      onClick={() => isAccessible && onSelect(stage.id)}
      disabled={!isAccessible}
    >
      <div className="stage-number">
        {isCompleted ? '✅' : isAccessible ? index + 1 : '🔒'}
      </div>
      <div className="stage-info">
        <div className="stage-name">{stage.name}</div>
        <div className="stage-desc">{stage.description}</div>
        <div className="stage-meta">
          {stage.questionsCount} שאלות · צריך {stage.requiredCorrect} נכונות
          {stage.bonusTimeSeconds && <span className="stage-timer"> · ⏱️ אתגר זמן!</span>}
        </div>
      </div>
    </button>
  );
}
