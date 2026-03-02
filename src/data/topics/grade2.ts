import type { Question, TopicDefinition } from '../../types';
import { randomInt, randomPick, generateId } from '../../engine/questionGenerator';

// === חיבור (Addition) ===
function generateAddition(difficulty: 1 | 2 | 3): Question {
  let a: number, b: number;
  switch (difficulty) {
    case 1: // עד 20
      a = randomInt(1, 10);
      b = randomInt(1, 10);
      break;
    case 2: // עד 50
      a = randomInt(5, 30);
      b = randomInt(5, 20);
      break;
    case 3: // עד 100
      a = randomInt(10, 60);
      b = randomInt(10, 100 - a);
      break;
  }
  return {
    id: generateId(),
    type: 'fill-blank',
    grade: 2,
    topic: 'addition',
    difficulty,
    text: `${a} + ${b} = ?`,
    correctAnswer: a + b,
    hint: `נסה לספור מ-${a} עוד ${b} קדימה`,
    explanation: `${a} + ${b} = ${a + b}`,
  };
}

// === חיסור (Subtraction) ===
function generateSubtraction(difficulty: 1 | 2 | 3): Question {
  let a: number, b: number;
  switch (difficulty) {
    case 1:
      a = randomInt(5, 18);
      b = randomInt(1, a - 1);
      break;
    case 2:
      a = randomInt(20, 50);
      b = randomInt(5, a - 1);
      break;
    case 3:
      a = randomInt(30, 100);
      b = randomInt(10, a - 1);
      break;
  }
  return {
    id: generateId(),
    type: 'fill-blank',
    grade: 2,
    topic: 'subtraction',
    difficulty,
    text: `${a} - ${b} = ?`,
    correctAnswer: a - b,
    hint: `נסה לספור מ-${a} אחורה ${b} צעדים`,
    explanation: `${a} - ${b} = ${a - b}`,
  };
}

// === כפל ראשוני (Basic Multiplication) ===
function generateBasicMultiplication(difficulty: 1 | 2 | 3): Question {
  let a: number, b: number;
  switch (difficulty) {
    case 1: // כפל ב-2, 5, 10
      a = randomPick([2, 5, 10]);
      b = randomInt(1, 5);
      break;
    case 2: // כפל ב-2, 3, 4, 5
      a = randomInt(2, 5);
      b = randomInt(2, 6);
      break;
    case 3: // כפל ב-2-5, מספרים גדולים יותר
      a = randomInt(2, 5);
      b = randomInt(3, 10);
      break;
  }
  const groups = `${b} קבוצות של ${a}`;
  return {
    id: generateId(),
    type: 'fill-blank',
    grade: 2,
    topic: 'basic-multiplication',
    difficulty,
    text: `${a} × ${b} = ?`,
    correctAnswer: a * b,
    hint: `חשבו על ${groups}`,
    explanation: `${a} × ${b} = ${a * b} (${groups})`,
  };
}

// === צורות בסיסיות (Basic Shapes) ===
function generateShapes(difficulty: 1 | 2 | 3): Question {
  const shapes = [
    { name: 'משולש', sides: 3, emoji: '🔺' },
    { name: 'ריבוע', sides: 4, emoji: '🟦' },
    { name: 'מלבן', sides: 4, emoji: '🟩' },
    { name: 'עיגול', sides: 0, emoji: '🔴' },
    { name: 'משושה', sides: 6, emoji: '⬡' },
    { name: 'מחומש', sides: 5, emoji: '⬠' },
  ];

  switch (difficulty) {
    case 1: {
      // כמה צלעות לצורה?
      const shape = randomPick(shapes.filter(s => s.sides > 0));
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 2,
        topic: 'shapes',
        difficulty,
        text: `כמה צלעות יש ל${shape.name}? ${shape.emoji}`,
        correctAnswer: shape.sides,
        hint: `${shape.name} ${shape.emoji} - נסה לספור את הצלעות`,
        explanation: `ל${shape.name} יש ${shape.sides} צלעות`,
      };
    }
    case 2: {
      // זיהוי צורה לפי מספר צלעות
      const shape = randomPick(shapes.filter(s => s.sides > 0));
      return {
        id: generateId(),
        type: 'multiple-choice',
        grade: 2,
        topic: 'shapes',
        difficulty,
        text: `לאיזו צורה יש ${shape.sides} צלעות?`,
        correctAnswer: shape.name,
        options: [shape.name, ...shapes.filter(s => s.name !== shape.name && s.sides > 0).slice(0, 3).map(s => s.name)],
        hint: `חשבו על צורות שאתם מכירים`,
        explanation: `ל${shape.name} יש ${shape.sides} צלעות`,
      };
    }
    case 3: {
      // סכום צלעות של שתי צורות
      const s1 = randomPick(shapes.filter(s => s.sides > 0));
      let s2 = randomPick(shapes.filter(s => s.sides > 0 && s.name !== s1.name));
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 2,
        topic: 'shapes',
        difficulty,
        text: `כמה צלעות יש ל${s1.name} ${s1.emoji} ול${s2.name} ${s2.emoji} ביחד?`,
        correctAnswer: s1.sides + s2.sides,
        hint: `ספרו את הצלעות של כל צורה בנפרד וחברו`,
        explanation: `${s1.name} (${s1.sides}) + ${s2.name} (${s2.sides}) = ${s1.sides + s2.sides} צלעות`,
      };
    }
  }
}

// === מספרים וסדר (Number Sense) ===
function generateNumberSense(difficulty: 1 | 2 | 3): Question {
  switch (difficulty) {
    case 1: {
      // מה המספר הבא?
      const start = randomInt(1, 15);
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 2,
        topic: 'number-sense',
        difficulty,
        text: `מה המספר הבא בסדרה: ${start}, ${start + 1}, ${start + 2}, ?`,
        correctAnswer: start + 3,
        hint: 'כל פעם מוסיפים 1',
        explanation: `הסדרה עולה ב-1: הבא הוא ${start + 3}`,
      };
    }
    case 2: {
      // סדרה בקפיצות
      const step = randomPick([2, 3, 5]);
      const start = randomInt(0, 10) * step;
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 2,
        topic: 'number-sense',
        difficulty,
        text: `מה המספר הבא: ${start}, ${start + step}, ${start + step * 2}, ?`,
        correctAnswer: start + step * 3,
        hint: `כל פעם מוסיפים ${step}`,
        explanation: `הסדרה עולה ב-${step}: הבא הוא ${start + step * 3}`,
      };
    }
    case 3: {
      // איזה מספר גדול/קטן יותר
      const a = randomInt(10, 99);
      let b = a + randomPick([-randomInt(1, 20), randomInt(1, 20)]);
      b = Math.max(1, Math.min(99, b));
      if (b === a) b = a + 1;
      return {
        id: generateId(),
        type: 'multiple-choice',
        grade: 2,
        topic: 'number-sense',
        difficulty,
        text: `איזה מספר גדול יותר?`,
        correctAnswer: String(Math.max(a, b)),
        options: [String(a), String(b)],
        hint: 'חשבו איזה מספר יותר רחוק מ-0',
        explanation: `${Math.max(a, b)} גדול יותר מ-${Math.min(a, b)}`,
      };
    }
  }
}

export const grade2Topics: TopicDefinition[] = [
  {
    id: 'addition',
    name: 'חיבור',
    grade: 2,
    description: 'חיבור מספרים עד 100',
    generator: generateAddition,
  },
  {
    id: 'subtraction',
    name: 'חיסור',
    grade: 2,
    description: 'חיסור מספרים עד 100',
    generator: generateSubtraction,
  },
  {
    id: 'basic-multiplication',
    name: 'כפל ראשוני',
    grade: 2,
    description: 'הכרת פעולת הכפל',
    generator: generateBasicMultiplication,
  },
  {
    id: 'shapes',
    name: 'צורות',
    grade: 2,
    description: 'צורות גיאומטריות בסיסיות',
    generator: generateShapes,
  },
  {
    id: 'number-sense',
    name: 'חוש מספרי',
    grade: 2,
    description: 'סדרות, השוואת מספרים',
    generator: generateNumberSense,
  },
];
