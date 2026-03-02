import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/Question/QuestionCard';
import TimerChallenge from '../components/Gamification/TimerChallenge';
import AchievementPopup from '../components/Gamification/AchievementPopup';
import { getStageById } from '../data/worlds';
import { getTopicById } from '../data/curriculum';
import { usePlayerStore } from '../store/usePlayerStore';
import { useProgressStore } from '../store/useProgressStore';
import { shouldShowHint } from '../engine/adaptiveDifficulty';
import { shouldReview, generateReviewQuestion } from '../engine/spacedRepetition';
import { toMultipleChoice, toTrueFalse, randomQuestionType } from '../engine/questionGenerator';
import { xpForCorrectAnswer, xpForStageComplete } from '../utils/xp';
import type { Question, AnswerResult } from '../types';
import './PracticePage.css';

export default function PracticePage() {
  const { stageId } = useParams<{ stageId: string }>();
  const navigate = useNavigate();
  const addXp = usePlayerStore((s) => s.addXp);
  const updateStreak = usePlayerStore((s) => s.updateStreak);
  const player = usePlayerStore((s) => s.player);
  const { recordAnswer, completeStage, addSessionLog, progress } = useProgressStore();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [_answers, setAnswers] = useState<AnswerResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [startTime] = useState(Date.now());
  const [timerActive, setTimerActive] = useState(false);

  const stageData = stageId ? getStageById(stageId) : undefined;
  const stage = stageData?.stage;
  const world = stageData?.world;

  // Generate questions for the stage
  useEffect(() => {
    if (!stage) return;
    const topic = getTopicById(stage.topic);
    if (!topic) return;

    const mastery = progress.topicMastery[stage.topic];
    const difficulty = mastery?.currentDifficulty ?? 1;

    const generated: Question[] = [];
    for (let i = 0; i < stage.questionsCount; i++) {
      // Check if this should be a review question
      if (shouldReview(i) && generated.length > 2) {
        const reviewQ = generateReviewQuestion(
          progress.topicMastery,
          world?.grade ?? 2,
          stage.topic
        );
        if (reviewQ) {
          generated.push(reviewQ);
          continue;
        }
      }

      // Generate a new question with random type
      let q = topic.generator(difficulty);
      const type = randomQuestionType();
      if (type === 'multiple-choice' && q.type === 'fill-blank') {
        q = toMultipleChoice(q);
      } else if (type === 'true-false' && q.type === 'fill-blank') {
        q = toTrueFalse(q);
      }
      generated.push(q);
    }

    setQuestions(generated);

    // Start timer if stage has bonus time
    if (stage.bonusTimeSeconds) {
      setTimerActive(true);
    }
  }, [stage?.id]);

  const handleAnswer = useCallback((result: AnswerResult) => {
    setAnswers((a) => [...a, result]);
    recordAnswer(result.question.topic, result.correct);

    if (result.correct) {
      setCorrectCount((c) => c + 1);
      const xp = xpForCorrectAnswer(result.timeMs, player?.streak ?? 0);
      addXp(xp);
    }

    if (currentIndex + 1 >= questions.length) {
      // Stage complete
      finishStage(correctCount + (result.correct ? 1 : 0));
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, questions.length, correctCount, player?.streak]);

  const finishStage = useCallback((finalCorrect: number) => {
    setTimerActive(false);
    setIsComplete(true);

    updateStreak();

    const passed = stage ? finalCorrect >= stage.requiredCorrect : false;
    const ratio = questions.length > 0 ? finalCorrect / questions.length : 0;

    if (passed && stageId) {
      completeStage(stageId);
      const xp = xpForStageComplete(ratio);
      const achievements = addXp(xp);
      setNewAchievements(achievements);
    }

    addSessionLog({
      questionsAnswered: questions.length,
      correctAnswers: finalCorrect,
      topicsPracticed: [stage?.topic ?? ''],
      xpEarned: 0,
      timeSpentSeconds: Math.round((Date.now() - startTime) / 1000),
    });
  }, [stage, stageId, questions.length, startTime]);

  const handleTimeUp = useCallback(() => {
    finishStage(correctCount);
  }, [correctCount, finishStage]);

  if (!stage || !world) {
    return (
      <div className="practice-page">
        <p>השלב לא נמצא</p>
        <button onClick={() => navigate('/adventure')}>חזרה למפה</button>
      </div>
    );
  }

  if (isComplete) {
    const passed = correctCount >= stage.requiredCorrect;
    const ratio = questions.length > 0 ? correctCount / questions.length : 0;

    return (
      <div className="practice-page">
        {newAchievements.length > 0 && (
          <AchievementPopup
            achievementIds={newAchievements}
            onDone={() => setNewAchievements([])}
          />
        )}
        <div className="stage-result" style={{ borderColor: world.color }}>
          <div className="result-emoji">{passed ? '🎉' : '💪'}</div>
          <h2>{passed ? 'כל הכבוד!' : 'נסה שוב!'}</h2>
          <p className="result-score">
            {correctCount} מתוך {questions.length} נכונות ({Math.round(ratio * 100)}%)
          </p>
          <p className="result-required">
            {passed
              ? `עברת! (צריך ${stage.requiredCorrect})`
              : `צריך לפחות ${stage.requiredCorrect} נכונות כדי לעבור`}
          </p>
          <div className="result-actions">
            {!passed && (
              <button
                className="result-btn retry"
                onClick={() => {
                  setCurrentIndex(0);
                  setCorrectCount(0);
                  setAnswers([]);
                  setIsComplete(false);
                  setQuestions([]);
                  // Re-trigger question generation
                  setTimeout(() => window.location.reload(), 0);
                }}
              >
                🔄 נסה שוב
              </button>
            )}
            <button className="result-btn next" onClick={() => navigate('/adventure')}>
              🗺️ חזרה למפה
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const recentForTopic = progress.recentAnswers[currentQuestion.topic] ?? [];

  return (
    <div className="practice-page">
      <div className="practice-header" style={{ background: world.color }}>
        <span>{world.emoji} {world.name}</span>
        <span>{stage.name}</span>
      </div>

      {stage.bonusTimeSeconds && (
        <TimerChallenge
          totalSeconds={stage.bonusTimeSeconds}
          onTimeUp={handleTimeUp}
          active={timerActive}
        />
      )}

      <div className="practice-score">
        ✅ {correctCount} / {stage.requiredCorrect} נדרשות
      </div>

      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        onAnswer={handleAnswer}
        showHint={shouldShowHint(recentForTopic)}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
      />
    </div>
  );
}
