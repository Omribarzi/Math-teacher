import type { Question, TopicDefinition } from '../../types';
import { randomInt, randomPick, generateId } from '../../engine/questionGenerator';

// === פעולות עם עשרוניים (Decimal Operations) ===
function generateDecimalOps(difficulty: 1 | 2 | 3): Question {
  switch (difficulty) {
    case 1: {
      const a = randomInt(1, 20) / 10;
      const b = randomInt(1, 20) / 10;
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 5,
        topic: 'decimal-ops',
        difficulty,
        text: `${a.toFixed(1)} + ${b.toFixed(1)} = ?`,
        correctAnswer: Number((a + b).toFixed(1)),
        hint: 'חברו כמו מספרים רגילים, שמרו על הנקודה העשרונית',
        explanation: `${a.toFixed(1)} + ${b.toFixed(1)} = ${(a + b).toFixed(1)}`,
      };
    }
    case 2: {
      const a = randomInt(10, 99) / 10;
      const b = randomInt(10, 99) / 10;
      const larger = Math.max(a, b);
      const smaller = Math.min(a, b);
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 5,
        topic: 'decimal-ops',
        difficulty,
        text: `${larger.toFixed(1)} - ${smaller.toFixed(1)} = ?`,
        correctAnswer: Number((larger - smaller).toFixed(1)),
        hint: 'חסרו כמו מספרים רגילים',
        explanation: `${larger.toFixed(1)} - ${smaller.toFixed(1)} = ${(larger - smaller).toFixed(1)}`,
      };
    }
    case 3: {
      const a = randomInt(11, 50) / 10;
      const b = randomInt(2, 9);
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 5,
        topic: 'decimal-ops',
        difficulty,
        text: `${a.toFixed(1)} × ${b} = ?`,
        correctAnswer: Number((a * b).toFixed(1)),
        hint: `כפלו ${a.toFixed(1)} ב-${b}: קודם כפלו כמספר שלם, אחר כך שימו את הנקודה`,
        explanation: `${a.toFixed(1)} × ${b} = ${(a * b).toFixed(1)}`,
      };
    }
  }
}

// === אחוזים (Percentages) ===
function generatePercentages(difficulty: 1 | 2 | 3): Question {
  switch (difficulty) {
    case 1: {
      const percent = randomPick([10, 25, 50, 75]);
      const total = randomPick([20, 40, 60, 80, 100, 200]);
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 5,
        topic: 'percentages',
        difficulty,
        text: `כמה זה ${percent}% מתוך ${total}?`,
        correctAnswer: (percent / 100) * total,
        hint: percent === 50 ? 'חצי!' : percent === 25 ? 'רבע!' : `${percent}% = ${percent}/100`,
        explanation: `${percent}% × ${total} = ${(percent / 100) * total}`,
      };
    }
    case 2: {
      const percent = randomPick([10, 20, 25, 30, 50]);
      const total = randomInt(2, 10) * 20;
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 5,
        topic: 'percentages',
        difficulty,
        text: `בכיתה יש ${total} תלמידים. ${percent}% מהם בנות. כמה בנות בכיתה?`,
        correctAnswer: (percent / 100) * total,
        hint: `חשבו: ${percent}% = ${percent}/100`,
        explanation: `${percent}% מ-${total} = ${(percent / 100) * total} בנות`,
      };
    }
    case 3: {
      // מה האחוז?
      const part = randomInt(1, 8) * 5;
      const total = randomPick([50, 100, 200]);
      const percent = (part / total) * 100;
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 5,
        topic: 'percentages',
        difficulty,
        text: `${part} מתוך ${total} זה כמה אחוז?`,
        correctAnswer: percent,
        hint: `חלקו ${part} ב-${total} וכפלו ב-100`,
        explanation: `${part}/${total} × 100 = ${percent}%`,
      };
    }
  }
}

// === גיאומטריה - זוויות ומשולשים (Geometry) ===
function generateGeometry(difficulty: 1 | 2 | 3): Question {
  switch (difficulty) {
    case 1: {
      // סוגי זוויות
      const angle = randomInt(1, 17) * 10;
      let type: string;
      if (angle < 90) type = 'חדה';
      else if (angle === 90) type = 'ישרה';
      else type = 'קהה';
      return {
        id: generateId(),
        type: 'multiple-choice',
        grade: 5,
        topic: 'geometry',
        difficulty,
        text: `זווית של ${angle}° היא זווית:`,
        correctAnswer: type,
        options: ['חדה', 'ישרה', 'קהה'],
        hint: 'חדה: פחות מ-90°, ישרה: בדיוק 90°, קהה: יותר מ-90°',
        explanation: `${angle}° היא זווית ${type}`,
      };
    }
    case 2: {
      // סכום זוויות במשולש
      const a = randomInt(30, 80);
      const b = randomInt(30, 150 - a);
      const c = 180 - a - b;
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 5,
        topic: 'geometry',
        difficulty,
        text: `במשולש שתי זוויות הן ${a}° ו-${b}°. מהי הזווית השלישית?`,
        correctAnswer: c,
        hint: 'סכום הזוויות במשולש הוא תמיד 180°',
        explanation: `180° - ${a}° - ${b}° = ${c}°`,
      };
    }
    case 3: {
      // שטח משולש
      const base = randomInt(3, 12);
      const height = randomInt(2, 10);
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 5,
        topic: 'geometry',
        difficulty,
        text: `מהו שטח משולש עם בסיס ${base} ס"מ וגובה ${height} ס"מ?`,
        correctAnswer: (base * height) / 2,
        hint: 'שטח משולש = (בסיס × גובה) ÷ 2',
        explanation: `(${base} × ${height}) ÷ 2 = ${(base * height) / 2} סמ"ר`,
      };
    }
  }
}

// === סדר פעולות (Order of Operations) ===
function generateOrderOfOps(difficulty: 1 | 2 | 3): Question {
  switch (difficulty) {
    case 1: {
      // כפל לפני חיבור
      const a = randomInt(2, 8);
      const b = randomInt(2, 5);
      const c = randomInt(1, 10);
      const result = a + b * c;
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 5,
        topic: 'order-of-ops',
        difficulty,
        text: `${a} + ${b} × ${c} = ?`,
        correctAnswer: result,
        hint: 'קודם כפל, אחר כך חיבור!',
        explanation: `קודם ${b} × ${c} = ${b * c}, אחר כך ${a} + ${b * c} = ${result}`,
      };
    }
    case 2: {
      // סוגריים
      const a = randomInt(2, 8);
      const b = randomInt(2, 8);
      const c = randomInt(2, 5);
      const result = (a + b) * c;
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 5,
        topic: 'order-of-ops',
        difficulty,
        text: `(${a} + ${b}) × ${c} = ?`,
        correctAnswer: result,
        hint: 'קודם פותרים את הסוגריים!',
        explanation: `(${a} + ${b}) = ${a + b}, ואז ${a + b} × ${c} = ${result}`,
      };
    }
    case 3: {
      // ביטוי מורכב
      const a = randomInt(2, 6);
      const b = randomInt(2, 6);
      const c = randomInt(1, 5);
      const d = randomInt(1, 5);
      const result = a * b + c * d;
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 5,
        topic: 'order-of-ops',
        difficulty,
        text: `${a} × ${b} + ${c} × ${d} = ?`,
        correctAnswer: result,
        hint: 'קודם כל הכפל, אחר כך חיבור',
        explanation: `${a}×${b}=${a * b}, ${c}×${d}=${c * d}, ואז ${a * b}+${c * d}=${result}`,
      };
    }
  }
}

export const grade5Topics: TopicDefinition[] = [
  {
    id: 'decimal-ops',
    name: 'פעולות עם עשרוניים',
    grade: 5,
    description: 'חיבור, חיסור וכפל של מספרים עשרוניים',
    generator: generateDecimalOps,
  },
  {
    id: 'percentages',
    name: 'אחוזים',
    grade: 5,
    description: 'חישוב אחוזים',
    generator: generatePercentages,
  },
  {
    id: 'geometry',
    name: 'גיאומטריה',
    grade: 5,
    description: 'זוויות, משולשים ושטחים',
    generator: generateGeometry,
  },
  {
    id: 'order-of-ops',
    name: 'סדר פעולות חשבון',
    grade: 5,
    description: 'סדר פעולות וסוגריים',
    generator: generateOrderOfOps,
  },
];
