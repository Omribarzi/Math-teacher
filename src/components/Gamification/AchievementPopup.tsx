import { useEffect, useState } from 'react';
import { achievements } from '../../data/achievements';
import './AchievementPopup.css';

interface Props {
  achievementIds: string[];
  onDone: () => void;
}

export default function AchievementPopup({ achievementIds, onDone }: Props) {
  const [current, setCurrent] = useState(0);

  const achievementData = achievementIds
    .map((id) => achievements.find((a) => a.id === id))
    .filter(Boolean);

  useEffect(() => {
    if (current >= achievementData.length) {
      onDone();
      return;
    }
    const timer = setTimeout(() => {
      setCurrent((c) => c + 1);
    }, 3000);
    return () => clearTimeout(timer);
  }, [current, achievementData.length, onDone]);

  if (current >= achievementData.length) return null;
  const a = achievementData[current]!;

  return (
    <div className="achievement-overlay">
      <div className="achievement-popup">
        <div className="achievement-icon">{a.icon}</div>
        <div className="achievement-title">הישג חדש!</div>
        <div className="achievement-name">{a.name}</div>
        <div className="achievement-desc">{a.description}</div>
      </div>
    </div>
  );
}
