import type { TopicMastery } from '../types';

/**
 * Determine the next difficulty level based on recent answers.
 * - 80%+ correct → increase difficulty
 * - 50-80% → stay same
 * - <50% → decrease difficulty
 */
export function getNextDifficulty(
  recentAnswers: boolean[],
  currentDifficulty: 1 | 2 | 3
): 1 | 2 | 3 {
  if (recentAnswers.length < 3) return currentDifficulty;

  const last = recentAnswers.slice(-10);
  const correctRate = last.filter(Boolean).length / last.length;

  if (correctRate >= 0.8 && currentDifficulty < 3) {
    return (currentDifficulty + 1) as 1 | 2 | 3;
  }
  if (correctRate < 0.5 && currentDifficulty > 1) {
    return (currentDifficulty - 1) as 1 | 2 | 3;
  }
  return currentDifficulty;
}

/**
 * Get mastery percentage for a topic.
 */
export function getMasteryPercent(mastery: TopicMastery): number {
  if (mastery.totalCount === 0) return 0;
  return Math.round((mastery.correctCount / mastery.totalCount) * 100);
}

/**
 * Check if a topic is considered mastered (>= 85% with at least 20 questions).
 */
export function isTopicMastered(mastery: TopicMastery): boolean {
  return mastery.totalCount >= 20 && getMasteryPercent(mastery) >= 85;
}

/**
 * Should we show a hint? Show hint after 2 consecutive wrong answers.
 */
export function shouldShowHint(recentAnswers: boolean[]): boolean {
  if (recentAnswers.length < 2) return false;
  const last2 = recentAnswers.slice(-2);
  return last2.every((a) => !a);
}
