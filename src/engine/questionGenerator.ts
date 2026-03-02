import type { Question, QuestionType } from '../types';
import { generateId } from '../utils/format';

export { generateId };

/** Random integer between min and max (inclusive) */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Pick a random element from an array */
export function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Shuffle an array in place (Fisher-Yates) */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Generate wrong answers for multiple choice that are plausible */
export function generateDistractors(
  correct: number,
  count: number = 3,
  min: number = 0,
  max?: number
): number[] {
  const distractors = new Set<number>();
  const range = Math.max(Math.abs(correct), 10);
  const lo = Math.max(min, correct - range);
  const hi = max ?? correct + range;

  let attempts = 0;
  while (distractors.size < count && attempts < 100) {
    const offset = randomInt(-range, range);
    const val = correct + offset;
    if (val !== correct && val >= lo && val <= hi) {
      distractors.add(val);
    }
    attempts++;
  }

  // Fill remaining if needed
  let fill = correct + 1;
  while (distractors.size < count) {
    if (fill !== correct && fill >= lo) distractors.add(fill);
    fill++;
  }

  return Array.from(distractors).slice(0, count);
}

/** Wrap a fill-blank question as multiple choice */
export function toMultipleChoice(q: Question): Question {
  if (q.type === 'multiple-choice') return q;

  const correct = Number(q.correctAnswer);
  if (isNaN(correct)) return { ...q, type: 'multiple-choice', options: [String(q.correctAnswer)] };

  const distractors = generateDistractors(correct);
  const options = shuffle([correct, ...distractors].map(String));

  return {
    ...q,
    id: generateId(),
    type: 'multiple-choice',
    options,
  };
}

/** Pick a random question type */
export function randomQuestionType(): QuestionType {
  return randomPick(['multiple-choice', 'fill-blank', 'true-false'] as QuestionType[]);
}

/** Create a true/false variant from a fill-blank question */
export function toTrueFalse(q: Question): Question {
  const correct = Number(q.correctAnswer);
  // ~35% true, ~65% false — ensures a good mix and avoids "always נכון" feel
  const showCorrect = Math.random() < 0.35;

  let displayAnswer: number;
  if (showCorrect) {
    displayAnswer = correct;
  } else {
    const offset = randomPick([-3, -2, -1, 1, 2, 3]);
    displayAnswer = correct + offset;
    // Avoid negative display answers for young kids
    if (displayAnswer < 0) displayAnswer = correct + Math.abs(offset);
  }

  const isTrue = displayAnswer === correct;

  return {
    id: generateId(),
    type: 'true-false',
    grade: q.grade,
    topic: q.topic,
    difficulty: q.difficulty,
    text: q.text.replace('?', `${displayAnswer}`) + ' - נכון או לא נכון?',
    correctAnswer: isTrue ? 'נכון' : 'לא נכון',
    options: ['נכון', 'לא נכון'],
    hint: q.hint,
    explanation: isTrue
      ? `נכון! התשובה היא ${correct}`
      : `לא נכון. התשובה הנכונה היא ${correct}`,
  };
}
