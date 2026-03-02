/** XP needed to reach a given level */
export function xpForLevel(level: number): number {
  return level * 100;
}

/** Calculate total XP needed from level 1 to reach target level */
export function totalXpForLevel(level: number): number {
  // Sum of 100 + 200 + ... + level*100
  return (level * (level + 1) / 2) * 100;
}

/** Determine player level from total XP */
export function levelFromTotalXp(totalXp: number): number {
  // Solve: (level * (level+1) / 2) * 100 <= totalXp
  let level = 1;
  while (totalXpForLevel(level + 1) <= totalXp) {
    level++;
  }
  return level;
}

/** XP progress within current level (0 to 1) */
export function xpProgress(totalXp: number): number {
  const level = levelFromTotalXp(totalXp);
  const currentLevelStart = totalXpForLevel(level);
  const nextLevelStart = totalXpForLevel(level + 1);
  return (totalXp - currentLevelStart) / (nextLevelStart - currentLevelStart);
}

/** XP for a correct answer */
export function xpForCorrectAnswer(timeMs: number, streak: number): number {
  let xp = 10;
  // Speed bonus: under 5 seconds
  if (timeMs < 5000) xp += 5;
  // Streak bonus: capped at 7 days
  const streakBonus = Math.min(streak, 7) * 2;
  return xp + streakBonus;
}

/** XP for completing a stage */
export function xpForStageComplete(correctRatio: number): number {
  const base = 50;
  // Perfect score bonus
  if (correctRatio === 1) return base + 30;
  if (correctRatio >= 0.9) return base + 15;
  return base;
}

/** XP for daily challenge */
export function xpForDailyChallenge(correctRatio: number): number {
  return Math.round(100 * correctRatio);
}

/** Format level display */
export function levelTitle(level: number): string {
  if (level <= 5) return 'מתחיל';
  if (level <= 10) return 'לומד';
  if (level <= 20) return 'מתרגל';
  if (level <= 30) return 'מומחה';
  if (level <= 40) return 'אלוף';
  return 'גאון מתמטי';
}
