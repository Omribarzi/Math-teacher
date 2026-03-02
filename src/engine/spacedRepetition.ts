import type { TopicMastery, Question, TopicDefinition } from '../types';
import { getTopicsForGrade } from '../data/curriculum';
import { getMasteryPercent } from './adaptiveDifficulty';

/**
 * Every N new questions, insert a review question from a previously learned topic.
 * Returns true if the next question should be a review question.
 */
export function shouldReview(questionIndex: number, reviewInterval: number = 5): boolean {
  return questionIndex > 0 && questionIndex % reviewInterval === 0;
}

/**
 * Pick a topic to review, preferring topics with lower mastery
 * that haven't been practiced recently.
 */
export function pickReviewTopic(
  topicMastery: Record<string, TopicMastery>,
  currentGrade: number,
  currentTopicId: string
): TopicDefinition | null {
  // Get all topics from current and previous grades
  const reviewCandidates: { topic: TopicDefinition; score: number }[] = [];

  for (let grade = 2; grade <= currentGrade; grade++) {
    const topics = getTopicsForGrade(grade);
    for (const topic of topics) {
      if (topic.id === currentTopicId) continue;

      const mastery = topicMastery[topic.id];
      if (!mastery || mastery.totalCount === 0) continue;

      // Score: lower mastery and older practice = higher priority
      const masteryPct = getMasteryPercent(mastery);
      const daysSincePractice = mastery.lastPracticed
        ? Math.floor((Date.now() - new Date(mastery.lastPracticed).getTime()) / 86400000)
        : 30;

      // Priority score: lower mastery + more days since practice = higher score
      const score = (100 - masteryPct) + daysSincePractice * 2;
      reviewCandidates.push({ topic, score });
    }
  }

  if (reviewCandidates.length === 0) return null;

  // Sort by score (highest first) and pick from top 3 randomly
  reviewCandidates.sort((a, b) => b.score - a.score);
  const topN = reviewCandidates.slice(0, Math.min(3, reviewCandidates.length));
  return topN[Math.floor(Math.random() * topN.length)].topic;
}

/**
 * Generate a review question from a previously learned topic.
 */
export function generateReviewQuestion(
  topicMastery: Record<string, TopicMastery>,
  currentGrade: number,
  currentTopicId: string
): Question | null {
  const topic = pickReviewTopic(topicMastery, currentGrade, currentTopicId);
  if (!topic) return null;

  const mastery = topicMastery[topic.id];
  const difficulty = mastery?.currentDifficulty ?? 1;

  const question = topic.generator(difficulty);
  return {
    ...question,
    hint: `🔄 חזרה: ${topic.name} - ${question.hint ?? ''}`,
  };
}
