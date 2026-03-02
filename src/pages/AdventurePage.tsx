import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WorldMap from '../components/Adventure/WorldMap';
import StageCard from '../components/Adventure/StageCard';
import { getWorldById } from '../data/worlds';
import { useProgressStore } from '../store/useProgressStore';
import './AdventurePage.css';

export default function AdventurePage() {
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  const navigate = useNavigate();
  const completedStages = useProgressStore((s) => s.progress.completedStages);

  const selectedWorld = selectedWorldId ? getWorldById(selectedWorldId) : null;

  const handleStageSelect = (stageId: string) => {
    navigate(`/practice/${stageId}`);
  };

  if (selectedWorld) {
    return (
      <div className="adventure-page">
        <button className="back-btn" onClick={() => setSelectedWorldId(null)}>
          → חזרה למפה
        </button>
        <div className="world-header" style={{ background: selectedWorld.color }}>
          <span className="world-header-emoji">{selectedWorld.emoji}</span>
          <div>
            <h2>{selectedWorld.name}</h2>
            <p>{selectedWorld.description}</p>
          </div>
        </div>
        <div className="stages-list">
          {selectedWorld.stages.map((stage, index) => {
            // A stage is accessible if it's the first, or the previous one is completed
            const isAccessible =
              index === 0 || completedStages.includes(selectedWorld.stages[index - 1].id);
            return (
              <StageCard
                key={stage.id}
                stage={stage}
                index={index}
                worldColor={selectedWorld.color}
                onSelect={handleStageSelect}
                isAccessible={isAccessible}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="adventure-page">
      <WorldMap onSelectWorld={setSelectedWorldId} />
    </div>
  );
}
