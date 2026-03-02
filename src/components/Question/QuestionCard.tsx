import { useState, useEffect, useCallback } from 'react';
import type { Question, AnswerResult } from '../../types';
import MultipleChoice from './MultipleChoice';
import FillBlank from './FillBlank';
import TrueFalse from './TrueFalse';
import './QuestionCard.css';

interface Props {
  question: Question;
  onAnswer: (result: AnswerResult) => void;
  showHint?: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({ question, onAnswer, showHint, questionNumber, totalQuestions }: Props) {
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [startTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    setAnswered(false);
    setResult(null);
    setShowExplanation(false);
  }, [question.id]);

  const handleAnswer = useCallback((userAnswer: string | number) => {
    if (answered) return;

    const correct = String(userAnswer).trim() === String(question.correctAnswer).trim();
    const answerResult: AnswerResult = {
      question,
      userAnswer,
      correct,
      timeMs: Date.now() - startTime,
    };
    setAnswered(true);
    setResult(answerResult);

    // Show explanation briefly, then continue
    setShowExplanation(true);
    setTimeout(() => {
      onAnswer(answerResult);
    }, correct ? 1500 : 2500);
  }, [answered, question, startTime, onAnswer]);

  return (
    <div className={`question-card ${answered ? (result?.correct ? 'correct' : 'wrong') : ''}`}>
      <div className="question-progress">
        שאלה {questionNumber} מתוך {totalQuestions}
      </div>

      <div className="question-text">{question.text}</div>

      {showHint && question.hint && !answered && (
        <div className="question-hint">💡 {question.hint}</div>
      )}

      <div className="question-input">
        {question.type === 'multiple-choice' && (
          <MultipleChoice
            options={question.options ?? []}
            onSelect={handleAnswer}
            disabled={answered}
            correctAnswer={answered ? String(question.correctAnswer) : undefined}
          />
        )}
        {question.type === 'fill-blank' && (
          <FillBlank
            onSubmit={handleAnswer}
            disabled={answered}
          />
        )}
        {question.type === 'true-false' && (
          <TrueFalse
            onSelect={handleAnswer}
            disabled={answered}
            correctAnswer={answered ? String(question.correctAnswer) : undefined}
          />
        )}
      </div>

      {showExplanation && result && (
        <div className={`question-feedback ${result.correct ? 'feedback-correct' : 'feedback-wrong'}`}>
          {result.correct ? (
            <span>✅ כל הכבוד! נכון!</span>
          ) : (
            <span>❌ לא נכון. {question.explanation}</span>
          )}
        </div>
      )}
    </div>
  );
}
