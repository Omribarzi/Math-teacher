import { useState, useCallback } from 'react';
import QuestionCard from '../components/Question/QuestionCard';
import TimerChallenge from '../components/Gamification/TimerChallenge';
import AchievementPopup from '../components/Gamification/AchievementPopup';
import { usePlayerStore } from '../store/usePlayerStore';
import { useProgressStore } from '../store/useProgressStore';
import { allTopics } from '../data/curriculum';
import { toMultipleChoice, randomQuestionType, toTrueFalse } from '../engine/questionGenerator';
import { xpForCorrectAnswer, xpForDailyChallenge } from '../utils/xp';
import { today } from '../utils/format';
import type { Question, AnswerResult } from '../types';
import './ChallengePage.css';

const CHALLENGE_QUESTIONS = 10;
const CHALLENGE_TIME = 300; // 5 minutes

export default function ChallengePage() {
  const player = usePlayerStore((s) => s.player);
  const addXp = usePlayerStore((s) => s.addXp);
  const updateStreak = usePlayerStore((s) => s.updateStreak);
  const { progress, recordAnswer, addSessionLog } = useProgressStore();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [startTime, setStartTime] = useState(0);

  // Check if daily challenge was already completed today
  const todayLogs = progress.history.filter((l) => l.date === today());
  const alreadyDone = todayLogs.some((l) => l.topicsPracticed.includes('daily-challenge'));

  const generateChallenge = useCallback(() => {
    // Pick from topics the player has practiced
    const practicedTopics = allTopics.filter(
      (t) => t.grade <= (progress.currentGrade + 1) && progress.topicMastery[t.id]
    );
    const fallbackTopics = allTopics.filter((t) => t.grade <= 2);
    const pool = practicedTopics.length >= 3 ? practicedTopics : fallbackTopics;

    const generated: Question[] = [];
    for (let i = 0; i < CHALLENGE_QUESTIONS; i++) {
      const topic = pool[Math.floor(Math.random() * pool.length)];
      const mastery = progress.topicMastery[topic.id];
      const diff = mastery?.currentDifficulty ?? 1;

      let q = topic.generator(diff);
      const type = randomQuestionType();
      if (type === 'multiple-choice' && q.type === 'fill-blank') {
        q = toMultipleChoice(q);
      } else if (type === 'true-false' && q.type === 'fill-blank') {
        q = toTrueFalse(q);
      }
      generated.push(q);
    }
    return generated;
  }, [progress]);

  const handleStart = () => {
    setQuestions(generateChallenge());
    setStarted(true);
    setStartTime(Date.now());
  };

  const handleAnswer = useCallback((result: AnswerResult) => {
    recordAnswer(result.question.topic, result.correct);
    if (result.correct) {
      setCorrectCount((c) => c + 1);
      addXp(xpForCorrectAnswer(result.timeMs, player?.streak ?? 0));
    }

    if (currentIndex + 1 >= questions.length) {
      finishChallenge(correctCount + (result.correct ? 1 : 0));
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, questions.length, correctCount]);

  const finishChallenge = useCallback((finalCorrect: number) => {
    setIsComplete(true);
    updateStreak();

    const ratio = CHALLENGE_QUESTIONS > 0 ? finalCorrect / CHALLENGE_QUESTIONS : 0;
    const xp = xpForDailyChallenge(ratio);
    const achievements = addXp(xp);
    setNewAchievements(achievements);

    addSessionLog({
      questionsAnswered: CHALLENGE_QUESTIONS,
      correctAnswers: finalCorrect,
      topicsPracticed: ['daily-challenge'],
      xpEarned: xp,
      timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
    });
  }, [startTime]);

  const handleTimeUp = useCallback(() => {
    finishChallenge(correctCount);
  }, [correctCount, finishChallenge]);

  if (alreadyDone && !started) {
    return (
      <div className="challenge-page">
        <div className="challenge-done">
          <span className="challenge-done-icon">✅</span>
          <h2>סיימת את האתגר היומי!</h2>
          <p>חזור מחר לאתגר חדש</p>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="challenge-page">
        <div className="challenge-intro">
          <span className="challenge-intro-icon">⚡</span>
          <h2>אתגר יומי</h2>
          <p>{CHALLENGE_QUESTIONS} שאלות מעורבות</p>
          <p>⏱️ {CHALLENGE_TIME / 60} דקות</p>
          <p className="challenge-tip">ענו נכון ומהר לבונוס XP!</p>
          <button className="challenge-start-btn" onClick={handleStart}>
            🚀 התחל אתגר!
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const ratio = CHALLENGE_QUESTIONS > 0 ? correctCount / CHALLENGE_QUESTIONS : 0;
    return (
      <div className="challenge-page">
        {newAchievements.length > 0 && (
          <AchievementPopup
            achievementIds={newAchievements}
            onDone={() => setNewAchievements([])}
          />
        )}
        <div className="challenge-result">
          <span className="challenge-result-icon">
            {ratio >= 0.9 ? '🌟' : ratio >= 0.7 ? '🎉' : '💪'}
          </span>
          <h2>
            {ratio >= 0.9 ? 'מדהים!' : ratio >= 0.7 ? 'כל הכבוד!' : 'לא רע!'}
          </h2>
          <p className="challenge-result-score">
            {correctCount} / {CHALLENGE_QUESTIONS} נכונות ({Math.round(ratio * 100)}%)
          </p>
          <p>קיבלת {xpForDailyChallenge(ratio)} XP!</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="challenge-page">
      <TimerChallenge
        totalSeconds={CHALLENGE_TIME}
        onTimeUp={handleTimeUp}
        active={true}
      />
      <div className="challenge-score">
        ✅ {correctCount} נכונות
      </div>
      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        onAnswer={handleAnswer}
        questionNumber={currentIndex + 1}
        totalQuestions={CHALLENGE_QUESTIONS}
      />
    </div>
  );
}
