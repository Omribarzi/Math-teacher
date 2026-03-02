import type { Question, TopicDefinition } from '../../types';
import { randomInt, randomPick, generateId } from '../../engine/questionGenerator';

// === כפל מורכב (Multi-digit Multiplication) ===
function generateMultiDigitMult(difficulty: 1 | 2 | 3): Question {
  let a: number, b: number;
  switch (difficulty) {
    case 1:
      a = randomInt(10, 30);
      b = randomInt(2, 9);
      break;
    case 2:
      a = randomInt(10, 50);
      b = randomInt(3, 12);
      break;
    case 3:
      a = randomInt(11, 99);
      b = randomInt(11, 30);
      break;
  }
  return {
    id: generateId(),
    type: 'fill-blank',
    grade: 4,
    topic: 'multi-digit-mult',
    difficulty,
    text: `${a} × ${b} = ?`,
    correctAnswer: a * b,
    hint: `נסו לפרק: ${a} × ${b} = ${Math.floor(a / 10) * 10} × ${b} + ${a % 10} × ${b}`,
    explanation: `${a} × ${b} = ${a * b}`,
  };
}

// === חילוק מורכב (Multi-digit Division) ===
function generateMultiDigitDiv(difficulty: 1 | 2 | 3): Question {
  let divisor: number, quotient: number;
  switch (difficulty) {
    case 1:
      divisor = randomInt(2, 9);
      quotient = randomInt(10, 30);
      break;
    case 2:
      divisor = randomInt(3, 12);
      quotient = randomInt(10, 50);
      break;
    case 3:
      divisor = randomInt(5, 20);
      quotient = randomInt(10, 50);
      break;
  }
  const dividend = divisor * quotient;
  return {
    id: generateId(),
    type: 'fill-blank',
    grade: 4,
    topic: 'multi-digit-div',
    difficulty,
    text: `${dividend} ÷ ${divisor} = ?`,
    correctAnswer: quotient,
    hint: `כמה פעמים ${divisor} נכנס ב-${dividend}?`,
    explanation: `${dividend} ÷ ${divisor} = ${quotient}`,
  };
}

// === פעולות עם שברים (Fraction Operations) ===
function generateFractionOps(difficulty: 1 | 2 | 3): Question {
  switch (difficulty) {
    case 1: {
      // חיבור שברים עם מכנה זהה
      const denom = randomPick([4, 6, 8]);
      const a = randomInt(1, denom / 2);
      const b = randomInt(1, denom / 2);
      return {
        id: generateId(),
        type: 'multiple-choice',
        grade: 4,
        topic: 'fraction-ops',
        difficulty,
        text: `${a}/${denom} + ${b}/${denom} = ?`,
        correctAnswer: `${a + b}/${denom}`,
        options: [
          `${a + b}/${denom}`,
          `${a + b}/${denom * 2}`,
          `${a * b}/${denom}`,
          `${a + b}/${denom + denom}`,
        ],
        hint: 'כשהמכנה זהה, מחברים רק את המונים',
        explanation: `${a}/${denom} + ${b}/${denom} = ${a + b}/${denom}`,
      };
    }
    case 2: {
      // חיסור שברים עם מכנה זהה
      const denom = randomPick([3, 5, 6, 8]);
      const a = randomInt(3, denom);
      const b = randomInt(1, a - 1);
      return {
        id: generateId(),
        type: 'multiple-choice',
        grade: 4,
        topic: 'fraction-ops',
        difficulty,
        text: `${a}/${denom} - ${b}/${denom} = ?`,
        correctAnswer: `${a - b}/${denom}`,
        options: [
          `${a - b}/${denom}`,
          `${a - b}/${denom - denom}` === `${a - b}/0` ? `${a}/${denom + 1}` : `${a - b}/${denom * 2}`,
          `${a + b}/${denom}`,
          `${b - a < 0 ? a : b}/${denom + 1}`,
        ],
        hint: 'כשהמכנה זהה, מחסרים רק את המונים',
        explanation: `${a}/${denom} - ${b}/${denom} = ${a - b}/${denom}`,
      };
    }
    case 3: {
      // חיבור שברים עם מכנים שונים (פשוט)
      const d1 = randomPick([2, 3, 4]);
      const d2 = d1 * 2;
      const a = randomInt(1, d1);
      const b = randomInt(1, d2 - 1);
      const commonDenom = d2;
      const result = a * (d2 / d1) + b;
      return {
        id: generateId(),
        type: 'multiple-choice',
        grade: 4,
        topic: 'fraction-ops',
        difficulty,
        text: `${a}/${d1} + ${b}/${d2} = ?`,
        correctAnswer: `${result}/${commonDenom}`,
        options: [
          `${result}/${commonDenom}`,
          `${a + b}/${d1 + d2}`,
          `${a + b}/${d2}`,
          `${result}/${d1}`,
        ],
        hint: `הרחיבו את ${a}/${d1} למכנה ${d2}`,
        explanation: `${a}/${d1} = ${a * (d2 / d1)}/${d2}, ואז ${a * (d2 / d1)}/${d2} + ${b}/${d2} = ${result}/${commonDenom}`,
      };
    }
  }
}

// === עשרוניים - היכרות (Decimals Intro) ===
function generateDecimalsIntro(difficulty: 1 | 2 | 3): Question {
  switch (difficulty) {
    case 1: {
      // המרת שבר עשרוני לשבר רגיל
      const decimal = randomPick([0.5, 0.25, 0.75, 0.1, 0.2]);
      const fractions: Record<number, string> = {
        0.5: '1/2', 0.25: '1/4', 0.75: '3/4', 0.1: '1/10', 0.2: '2/10',
      };
      return {
        id: generateId(),
        type: 'multiple-choice',
        grade: 4,
        topic: 'decimals-intro',
        difficulty,
        text: `${decimal} שווה לאיזה שבר?`,
        correctAnswer: fractions[decimal],
        options: [fractions[decimal], '1/3', '2/5', '3/10'],
        hint: '0.5 = חצי, 0.25 = רבע',
        explanation: `${decimal} = ${fractions[decimal]}`,
      };
    }
    case 2: {
      // חיבור עשרוניים פשוט
      const a = randomInt(1, 9) / 10;
      const b = randomInt(1, 9 - a * 10) / 10;
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 4,
        topic: 'decimals-intro',
        difficulty,
        text: `${a.toFixed(1)} + ${b.toFixed(1)} = ?`,
        correctAnswer: Number((a + b).toFixed(1)),
        hint: 'חברו כמו מספרים רגילים, שימו לב לנקודה העשרונית',
        explanation: `${a.toFixed(1)} + ${b.toFixed(1)} = ${(a + b).toFixed(1)}`,
      };
    }
    case 3: {
      // סדר עשרוניים
      const nums = Array.from({ length: 3 }, () => randomInt(1, 99) / 10);
      nums.sort((x, y) => x - y);
      const smallest = nums[0];
      return {
        id: generateId(),
        type: 'multiple-choice',
        grade: 4,
        topic: 'decimals-intro',
        difficulty,
        text: `מי הקטן ביותר?`,
        correctAnswer: smallest.toFixed(1),
        options: nums.map(n => n.toFixed(1)),
        hint: 'השוו קודם את החלק השלם, אחר כך את החלק העשרוני',
        explanation: `${nums.map(n => n.toFixed(1)).join(' < ')}`,
      };
    }
  }
}

// === שטח והיקף (Area & Perimeter) ===
function generateAreaPerimeter(difficulty: 1 | 2 | 3): Question {
  switch (difficulty) {
    case 1: {
      // היקף ריבוע
      const side = randomInt(2, 10);
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 4,
        topic: 'area-perimeter',
        difficulty,
        text: `מהו ההיקף של ריבוע עם צלע ${side} ס"מ?`,
        correctAnswer: side * 4,
        hint: 'היקף ריבוע = צלע × 4',
        explanation: `${side} × 4 = ${side * 4} ס"מ`,
      };
    }
    case 2: {
      // שטח מלבן
      const w = randomInt(2, 10);
      const h = randomInt(2, 10);
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 4,
        topic: 'area-perimeter',
        difficulty,
        text: `מהו השטח של מלבן עם אורך ${w} ס"מ ורוחב ${h} ס"מ?`,
        correctAnswer: w * h,
        hint: 'שטח מלבן = אורך × רוחב',
        explanation: `${w} × ${h} = ${w * h} סמ"ר`,
      };
    }
    case 3: {
      // היקף מלבן
      const w = randomInt(3, 15);
      const h = randomInt(3, 15);
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 4,
        topic: 'area-perimeter',
        difficulty,
        text: `מהו ההיקף של מלבן עם אורך ${w} ס"מ ורוחב ${h} ס"מ?`,
        correctAnswer: (w + h) * 2,
        hint: 'היקף מלבן = (אורך + רוחב) × 2',
        explanation: `(${w} + ${h}) × 2 = ${(w + h) * 2} ס"מ`,
      };
    }
  }
}

export const grade4Topics: TopicDefinition[] = [
  {
    id: 'multi-digit-mult',
    name: 'כפל מרובה ספרות',
    grade: 4,
    description: 'כפל מספרים גדולים',
    generator: generateMultiDigitMult,
  },
  {
    id: 'multi-digit-div',
    name: 'חילוק מרובה ספרות',
    grade: 4,
    description: 'חילוק מספרים גדולים',
    generator: generateMultiDigitDiv,
  },
  {
    id: 'fraction-ops',
    name: 'פעולות עם שברים',
    grade: 4,
    description: 'חיבור וחיסור שברים',
    generator: generateFractionOps,
  },
  {
    id: 'decimals-intro',
    name: 'מספרים עשרוניים',
    grade: 4,
    description: 'היכרות עם מספרים עשרוניים',
    generator: generateDecimalsIntro,
  },
  {
    id: 'area-perimeter',
    name: 'שטח והיקף',
    grade: 4,
    description: 'חישוב שטח והיקף',
    generator: generateAreaPerimeter,
  },
];
