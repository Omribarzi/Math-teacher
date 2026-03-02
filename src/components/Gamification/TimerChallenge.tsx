import { useState, useEffect, useRef } from 'react';
import { formatTime } from '../../utils/format';
import './TimerChallenge.css';

interface Props {
  totalSeconds: number;
  onTimeUp: () => void;
  active: boolean;
}

export default function TimerChallenge({ totalSeconds, onTimeUp, active }: Props) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (!active) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current);
          onTimeUp();
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [active, onTimeUp]);

  const percent = (remaining / totalSeconds) * 100;
  const isUrgent = remaining <= 30;

  return (
    <div className={`timer-challenge ${isUrgent ? 'timer-urgent' : ''}`}>
      <span className="timer-icon">⏱️</span>
      <div className="timer-bar-bg">
        <div
          className="timer-bar-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="timer-text">{formatTime(remaining)}</span>
    </div>
  );
}
