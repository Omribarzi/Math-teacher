import type { TopicDefinition } from '../types';
import { grade2Topics } from './topics/grade2';
import { grade3Topics } from './topics/grade3';
import { grade4Topics } from './topics/grade4';
import { grade5Topics } from './topics/grade5';
import { grade6Topics } from './topics/grade6';

export const allTopics: TopicDefinition[] = [
  ...grade2Topics,
  ...grade3Topics,
  ...grade4Topics,
  ...grade5Topics,
  ...grade6Topics,
];

export function getTopicsForGrade(grade: number): TopicDefinition[] {
  return allTopics.filter((t) => t.grade === grade);
}

export function getTopicById(id: string): TopicDefinition | undefined {
  return allTopics.find((t) => t.id === id);
}

export function getGradeForTopic(topicId: string): number {
  return allTopics.find((t) => t.id === topicId)?.grade ?? 2;
}
