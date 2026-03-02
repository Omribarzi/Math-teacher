import type { Question, TopicDefinition } from '../../types';
import { randomInt, randomPick, generateId } from '../../engine/questionGenerator';

// === לוח הכפל (Multiplication Tables) ===
function generateMultiplicationTable(difficulty: 1 | 2 | 3): Question {
  let a: number, b: number;
  switch (difficulty) {
    case 1: // כפל 2-5
      a = randomInt(2, 5);
      b = randomInt(2, 5);
      break;
    case 2: // כפל 2-9
      a = randomInt(2, 9);
      b = randomInt(2, 9);
      break;
    case 3: // כפל 2-12
      a = randomInt(2, 12);
      b = randomInt(2, 12);
      break;
  }
  return {
    id: generateId(),
    type: 'fill-blank',
    grade: 3,
    topic: 'multiplication-table',
    difficulty,
    text: `${a} × ${b} = ?`,
    correctAnswer: a * b,
    hint: `חשבו על ${b} פעמים ${a}`,
    explanation: `${a} × ${b} = ${a * b}`,
  };
}

// === חילוק בסיסי (Basic Division) ===
function generateDivision(difficulty: 1 | 2 | 3): Question {
  let divisor: number, quotient: number;
  switch (difficulty) {
    case 1:
      divisor = randomInt(2, 5);
      quotient = randomInt(1, 5);
      break;
    case 2:
      divisor = randomInt(2, 7);
      quotient = randomInt(2, 8);
      break;
    case 3:
      divisor = randomInt(2, 12);
      quotient = randomInt(2, 12);
      break;
  }
  const dividend = divisor * quotient;
  return {
    id: generateId(),
    type: 'fill-blank',
    grade: 3,
    topic: 'division',
    difficulty,
    text: `${dividend} ÷ ${divisor} = ?`,
    correctAnswer: quotient,
    hint: `כמה פעמים ${divisor} נכנס ב-${dividend}?`,
    explanation: `${dividend} ÷ ${divisor} = ${quotient} כי ${divisor} × ${quotient} = ${dividend}`,
  };
}

// === שברים - היכרות (Fractions Intro) ===
function generateFractionsIntro(difficulty: 1 | 2 | 3): Question {
  switch (difficulty) {
    case 1: {
      // זיהוי חלק מתוך שלם
      const denom = randomPick([2, 4]);
      const numer = randomInt(1, denom - 1);
      return {
        id: generateId(),
        type: 'multiple-choice',
        grade: 3,
        topic: 'fractions-intro',
        difficulty,
        text: `פיצה חולקה ל-${denom} חלקים שווים. אכלנו ${numer} חלקים. איזה שבר אכלנו?`,
        correctAnswer: `${numer}/${denom}`,
        options: [`${numer}/${denom}`, `${denom}/${numer}`, `${numer}/${denom + 1}`, `1/${denom}`],
        hint: 'המונה (למעלה) הוא מה שאכלנו, המכנה (למטה) הוא כמה חלקים בסך הכל',
        explanation: `אכלנו ${numer} מתוך ${denom} חלקים = ${numer}/${denom}`,
      };
    }
    case 2: {
      // השוואת שברים פשוטים
      const denom = randomPick([3, 4, 6]);
      const a = randomInt(1, denom - 1);
      let b = randomInt(1, denom - 1);
      if (b === a) b = a === 1 ? 2 : a - 1;
      return {
        id: generateId(),
        type: 'multiple-choice',
        grade: 3,
        topic: 'fractions-intro',
        difficulty,
        text: `מי גדול יותר: ${a}/${denom} או ${b}/${denom}?`,
        correctAnswer: a > b ? `${a}/${denom}` : `${b}/${denom}`,
        options: [`${a}/${denom}`, `${b}/${denom}`],
        hint: 'כשהמכנה שווה, השבר עם המונה הגדול יותר הוא הגדול',
        explanation: `${Math.max(a, b)}/${denom} > ${Math.min(a, b)}/${denom}`,
      };
    }
    case 3: {
      // שבר של כמות
      const denom = randomPick([2, 3, 4, 5]);
      const total = denom * randomInt(2, 6);
      const numer = 1;
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 3,
        topic: 'fractions-intro',
        difficulty,
        text: `מהו ${numer}/${denom} מתוך ${total}?`,
        correctAnswer: total / denom,
        hint: `חלקו את ${total} ל-${denom} חלקים שווים`,
        explanation: `${total} ÷ ${denom} = ${total / denom}`,
      };
    }
  }
}

// === מדידה (Measurement) ===
function generateMeasurement(difficulty: 1 | 2 | 3): Question {
  switch (difficulty) {
    case 1: {
      // המרת מטרים לסנטימטרים
      const meters = randomInt(1, 5);
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 3,
        topic: 'measurement',
        difficulty,
        text: `כמה סנטימטרים יש ב-${meters} מטרים?`,
        correctAnswer: meters * 100,
        hint: 'במטר אחד יש 100 ס"מ',
        explanation: `${meters} מטרים × 100 = ${meters * 100} ס"מ`,
      };
    }
    case 2: {
      // המרת ק"ג לגרמים
      const kg = randomInt(1, 5);
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 3,
        topic: 'measurement',
        difficulty,
        text: `כמה גרם יש ב-${kg} ק"ג?`,
        correctAnswer: kg * 1000,
        hint: 'בק"ג אחד יש 1000 גרם',
        explanation: `${kg} ק"ג × 1000 = ${kg * 1000} גרם`,
      };
    }
    case 3: {
      // שעות ודקות
      const hours = randomInt(1, 3);
      const minutes = randomInt(1, 3) * 15;
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 3,
        topic: 'measurement',
        difficulty,
        text: `כמה דקות יש ב-${hours} שעות ו-${minutes} דקות?`,
        correctAnswer: hours * 60 + minutes,
        hint: `בשעה יש 60 דקות`,
        explanation: `${hours} × 60 + ${minutes} = ${hours * 60 + minutes} דקות`,
      };
    }
  }
}

export const grade3Topics: TopicDefinition[] = [
  {
    id: 'multiplication-table',
    name: 'לוח הכפל',
    grade: 3,
    description: 'לוח הכפל עד 12',
    generator: generateMultiplicationTable,
  },
  {
    id: 'division',
    name: 'חילוק',
    grade: 3,
    description: 'חילוק בסיסי',
    generator: generateDivision,
  },
  {
    id: 'fractions-intro',
    name: 'שברים - היכרות',
    grade: 3,
    description: 'מהו שבר, השוואת שברים',
    generator: generateFractionsIntro,
  },
  {
    id: 'measurement',
    name: 'מדידה',
    grade: 3,
    description: 'יחידות מידה ומשקל',
    generator: generateMeasurement,
  },
];
