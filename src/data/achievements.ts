import type { Achievement } from '../types';

export const achievements: Achievement[] = [
  {
    id: 'first-step',
    name: 'צעד ראשון',
    description: 'השלמת שלב ראשון!',
    icon: '👣',
    condition: (_, progress) => progress.completedStages.length >= 1,
  },
  {
    id: 'five-stages',
    name: 'חמש וקדימה',
    description: 'השלמת 5 שלבים',
    icon: '✋',
    condition: (_, progress) => progress.completedStages.length >= 5,
  },
  {
    id: 'ten-stages',
    name: 'עשר שלבים',
    description: 'השלמת 10 שלבים!',
    icon: '🔟',
    condition: (_, progress) => progress.completedStages.length >= 10,
  },
  {
    id: 'twenty-stages',
    name: 'עשרים שלבים',
    description: 'השלמת 20 שלבים!',
    icon: '⭐',
    condition: (_, progress) => progress.completedStages.length >= 20,
  },
  {
    id: 'fifty-stages',
    name: 'חמישים שלבים!',
    description: 'השלמת 50 שלבים!',
    icon: '🏆',
    condition: (_, progress) => progress.completedStages.length >= 50,
  },
  {
    id: 'beginner-math',
    name: 'מתמטיקאי מתחיל',
    description: '100 תשובות נכונות',
    icon: '🧮',
    condition: (_, progress) => {
      const total = progress.history.reduce((sum, s) => sum + s.correctAnswers, 0);
      return total >= 100;
    },
  },
  {
    id: 'math-expert',
    name: 'מומחה חשבון',
    description: '500 תשובות נכונות',
    icon: '🎓',
    condition: (_, progress) => {
      const total = progress.history.reduce((sum, s) => sum + s.correctAnswers, 0);
      return total >= 500;
    },
  },
  {
    id: 'math-genius',
    name: 'גאון מתמטי',
    description: '1000 תשובות נכונות!',
    icon: '🧠',
    condition: (_, progress) => {
      const total = progress.history.reduce((sum, s) => sum + s.correctAnswers, 0);
      return total >= 1000;
    },
  },
  {
    id: 'streak-3',
    name: 'שלושה ימים ברצף',
    description: '3 ימים רצופים של תרגול',
    icon: '🔥',
    condition: (player) => player.streak >= 3,
  },
  {
    id: 'streak-7',
    name: 'שבוע של חשבון',
    description: '7 ימים רצופים!',
    icon: '🔥',
    condition: (player) => player.streak >= 7,
  },
  {
    id: 'streak-14',
    name: 'שבועיים חזק',
    description: '14 ימים רצופים!',
    icon: '💪',
    condition: (player) => player.streak >= 14,
  },
  {
    id: 'streak-30',
    name: 'חודש שלם!',
    description: '30 ימים רצופים של תרגול',
    icon: '🌟',
    condition: (player) => player.streak >= 30,
  },
  {
    id: 'level-5',
    name: 'רמה 5',
    description: 'הגעת לרמה 5!',
    icon: '📈',
    condition: (player) => player.level >= 5,
  },
  {
    id: 'level-10',
    name: 'רמה 10',
    description: 'הגעת לרמה 10!',
    icon: '📊',
    condition: (player) => player.level >= 10,
  },
  {
    id: 'level-25',
    name: 'רמה 25',
    description: 'הגעת לרמה 25!',
    icon: '🏅',
    condition: (player) => player.level >= 25,
  },
  {
    id: 'world-2',
    name: 'סייר ביער',
    description: 'פתחת את יער החשבונות (כיתה ג׳)',
    icon: '🌲',
    condition: (player) => player.unlockedWorlds.includes('calculation-forest'),
  },
  {
    id: 'world-3',
    name: 'כובש מבצרים',
    description: 'פתחת את מבצר הפעולות (כיתה ד׳)',
    icon: '🏯',
    condition: (player) => player.unlockedWorlds.includes('operations-fortress'),
  },
  {
    id: 'world-4',
    name: 'מגלה איים',
    description: 'פתחת את אי האחוזים (כיתה ה׳)',
    icon: '🏝️',
    condition: (player) => player.unlockedWorlds.includes('percent-island'),
  },
  {
    id: 'world-5',
    name: 'חוקר חלל',
    description: 'פתחת את חלל האלגברה (כיתה ו׳)',
    icon: '🚀',
    condition: (player) => player.unlockedWorlds.includes('algebra-space'),
  },
  {
    id: 'speed-demon',
    name: 'מהיר כברק',
    description: 'השלמת אתגר זמן בהצלחה',
    icon: '⚡',
    condition: (_, progress) => {
      // Check if any stage with bonus time was completed
      return progress.completedStages.some(id =>
        id.includes('-7') || id.includes('-12') || id.includes('-15') || id.includes('-3') || id.includes('-13')
      );
    },
  },
  {
    id: 'all-worlds',
    name: 'שולט בכל העולמות',
    description: 'פתחת את כל 5 העולמות!',
    icon: '👑',
    condition: (player) => player.unlockedWorlds.length >= 5,
  },
];
