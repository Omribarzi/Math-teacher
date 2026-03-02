import type { Question, TopicDefinition } from '../../types';
import { randomInt, randomPick, generateId } from '../../engine/questionGenerator';

// === יחסים ופרופורציות (Ratios) ===
function generateRatios(difficulty: 1 | 2 | 3): Question {
  switch (difficulty) {
    case 1: {
      const a = randomInt(1, 5);
      const b = randomInt(1, 5);
      const mult = randomInt(2, 5);
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 6,
        topic: 'ratios',
        difficulty,
        text: `היחס בין תפוחים לתפוזים הוא ${a}:${b}. אם יש ${a * mult} תפוחים, כמה תפוזים יש?`,
        correctAnswer: b * mult,
        hint: `${a} × ${mult} = ${a * mult}, אז גם ${b} × ?`,
        explanation: `${a}:${b} = ${a * mult}:${b * mult}, אז יש ${b * mult} תפוזים`,
      };
    }
    case 2: {
      // פרופורציה
      const a = randomInt(2, 8);
      const b = randomInt(2, 8);
      const mult = randomInt(3, 7);
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 6,
        topic: 'ratios',
        difficulty,
        text: `אם ${a}/${b} = ${a * mult}/x, מהו x?`,
        correctAnswer: b * mult,
        hint: 'מצאו באיזה מספר כפלנו את המונה',
        explanation: `כפלנו ב-${mult}: ${b} × ${mult} = ${b * mult}`,
      };
    }
    case 3: {
      // חלוקה ביחס
      const r1 = randomInt(1, 4);
      const r2 = randomInt(1, 4);
      const total = (r1 + r2) * randomInt(3, 8);
      const part1 = (total / (r1 + r2)) * r1;
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 6,
        topic: 'ratios',
        difficulty,
        text: `חלקו ${total} ביחס ${r1}:${r2}. מהו החלק הגדול?`,
        correctAnswer: Math.max(part1, total - part1),
        hint: `סך הכל ${r1 + r2} חלקים. כל חלק = ${total} ÷ ${r1 + r2}`,
        explanation: `כל חלק = ${total / (r1 + r2)}, החלק הגדול = ${Math.max(part1, total - part1)}`,
      };
    }
  }
}

// === שברים ועשרוניים מתקדם (Advanced Fractions) ===
function generateAdvancedFractions(difficulty: 1 | 2 | 3): Question {
  switch (difficulty) {
    case 1: {
      // כפל שבר במספר שלם
      const denom = randomPick([3, 4, 5, 6]);
      const numer = randomInt(1, denom - 1);
      const mult = randomInt(2, 5);
      const result = numer * mult;
      return {
        id: generateId(),
        type: 'multiple-choice',
        grade: 6,
        topic: 'advanced-fractions',
        difficulty,
        text: `${numer}/${denom} × ${mult} = ?`,
        correctAnswer: `${result}/${denom}`,
        options: [
          `${result}/${denom}`,
          `${numer}/${denom * mult}`,
          `${numer + mult}/${denom}`,
          `${result}/${denom * mult}`,
        ],
        hint: 'כופלים רק את המונה!',
        explanation: `${numer} × ${mult} = ${result}, אז ${result}/${denom}`,
      };
    }
    case 2: {
      // כפל שני שברים
      const d1 = randomPick([2, 3, 4, 5]);
      const n1 = randomInt(1, d1);
      const d2 = randomPick([2, 3, 4, 5]);
      const n2 = randomInt(1, d2);
      return {
        id: generateId(),
        type: 'multiple-choice',
        grade: 6,
        topic: 'advanced-fractions',
        difficulty,
        text: `${n1}/${d1} × ${n2}/${d2} = ?`,
        correctAnswer: `${n1 * n2}/${d1 * d2}`,
        options: [
          `${n1 * n2}/${d1 * d2}`,
          `${n1 + n2}/${d1 + d2}`,
          `${n1 * n2}/${d1 + d2}`,
          `${n1 + n2}/${d1 * d2}`,
        ],
        hint: 'כפלו מונה × מונה, מכנה × מכנה',
        explanation: `${n1}×${n2}/${d1}×${d2} = ${n1 * n2}/${d1 * d2}`,
      };
    }
    case 3: {
      // המרה בין שבר עשרוני לשבר רגיל
      const decimals: Record<string, string> = {
        '0.125': '1/8', '0.375': '3/8', '0.625': '5/8', '0.875': '7/8',
        '0.2': '1/5', '0.4': '2/5', '0.6': '3/5', '0.8': '4/5',
      };
      const dec = randomPick(Object.keys(decimals));
      return {
        id: generateId(),
        type: 'multiple-choice',
        grade: 6,
        topic: 'advanced-fractions',
        difficulty,
        text: `${dec} שווה לאיזה שבר?`,
        correctAnswer: decimals[dec],
        options: [decimals[dec], ...Object.values(decimals).filter(v => v !== decimals[dec]).slice(0, 3)],
        hint: 'נסו לכפול או לחלק כדי למצוא את השבר',
        explanation: `${dec} = ${decimals[dec]}`,
      };
    }
  }
}

// === מספרים שליליים (Negative Numbers) ===
function generateNegativeNumbers(difficulty: 1 | 2 | 3): Question {
  switch (difficulty) {
    case 1: {
      // חיבור עם שליליים
      const a = randomInt(1, 10);
      const b = randomInt(1, 15);
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 6,
        topic: 'negative-numbers',
        difficulty,
        text: `${a} + (${-b}) = ?`,
        correctAnswer: a - b,
        hint: `חיבור מספר שלילי זה כמו חיסור: ${a} - ${b}`,
        explanation: `${a} + (${-b}) = ${a} - ${b} = ${a - b}`,
      };
    }
    case 2: {
      // סדר על ציר המספרים
      const nums = Array.from({ length: 4 }, () => randomInt(-10, 10));
      const sorted = [...nums].sort((a, b) => a - b);
      return {
        id: generateId(),
        type: 'multiple-choice',
        grade: 6,
        topic: 'negative-numbers',
        difficulty,
        text: `מי הקטן ביותר: ${nums.join(', ')}?`,
        correctAnswer: String(sorted[0]),
        options: nums.map(String),
        hint: 'מספרים שליליים יותר גדולים (בערך מוחלט) הם יותר קטנים',
        explanation: `הסדר מהקטן לגדול: ${sorted.join(' < ')}`,
      };
    }
    case 3: {
      // חיסור שליליים
      const a = randomInt(-8, 8);
      const b = randomInt(-8, 8);
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 6,
        topic: 'negative-numbers',
        difficulty,
        text: `(${a}) - (${b}) = ?`,
        correctAnswer: a - b,
        hint: 'חיסור מספר שלילי = חיבור המספר החיובי',
        explanation: `(${a}) - (${b}) = ${a - b}`,
      };
    }
  }
}

// === אלגברה בסיסית (Basic Algebra) ===
function generateAlgebra(difficulty: 1 | 2 | 3): Question {
  switch (difficulty) {
    case 1: {
      // x + a = b
      const x = randomInt(1, 15);
      const a = randomInt(1, 10);
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 6,
        topic: 'algebra',
        difficulty,
        text: `x + ${a} = ${x + a}. מהו x?`,
        correctAnswer: x,
        hint: `העבירו את ${a} לצד השני: x = ${x + a} - ${a}`,
        explanation: `x = ${x + a} - ${a} = ${x}`,
      };
    }
    case 2: {
      // a × x = b
      const x = randomInt(2, 12);
      const a = randomInt(2, 8);
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 6,
        topic: 'algebra',
        difficulty,
        text: `${a} × x = ${a * x}. מהו x?`,
        correctAnswer: x,
        hint: `חלקו את שני הצדדים ב-${a}`,
        explanation: `x = ${a * x} ÷ ${a} = ${x}`,
      };
    }
    case 3: {
      // ax + b = c
      const x = randomInt(1, 10);
      const a = randomInt(2, 5);
      const b = randomInt(1, 10);
      const c = a * x + b;
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 6,
        topic: 'algebra',
        difficulty,
        text: `${a}x + ${b} = ${c}. מהו x?`,
        correctAnswer: x,
        hint: `קודם חסרו ${b} משני הצדדים, אחר כך חלקו ב-${a}`,
        explanation: `${a}x = ${c} - ${b} = ${c - b}, x = ${c - b} ÷ ${a} = ${x}`,
      };
    }
  }
}

// === מערכת צירים (Coordinate System) ===
function generateCoordinates(difficulty: 1 | 2 | 3): Question {
  switch (difficulty) {
    case 1: {
      // זיהוי רביע
      const x = randomPick([-5, -3, -1, 1, 3, 5]);
      const y = randomPick([-4, -2, -1, 1, 2, 4]);
      let quadrant: string;
      if (x > 0 && y > 0) quadrant = 'ראשון';
      else if (x < 0 && y > 0) quadrant = 'שני';
      else if (x < 0 && y < 0) quadrant = 'שלישי';
      else quadrant = 'רביעי';
      return {
        id: generateId(),
        type: 'multiple-choice',
        grade: 6,
        topic: 'coordinates',
        difficulty,
        text: `הנקודה (${x}, ${y}) נמצאת ברביע ה:`,
        correctAnswer: quadrant,
        options: ['ראשון', 'שני', 'שלישי', 'רביעי'],
        hint: 'רביע ראשון: x>0, y>0. רביע שני: x<0, y>0. וכו\'',
        explanation: `(${x}, ${y}) ברביע ה${quadrant}`,
      };
    }
    case 2: {
      // מרחק מהראשית
      const x = randomPick([3, 4, 5, 6, 8]);
      const y = x === 3 ? 4 : x === 4 ? 3 : x === 5 ? 12 : x === 6 ? 8 : 6;
      const dist = Math.sqrt(x * x + y * y);
      return {
        id: generateId(),
        type: 'fill-blank',
        grade: 6,
        topic: 'coordinates',
        difficulty,
        text: `מה המרחק של הנקודה (${x}, ${y}) מהראשית (0, 0)?`,
        correctAnswer: dist,
        hint: 'השתמשו במשפט פיתגורס: √(x² + y²)',
        explanation: `√(${x}² + ${y}²) = √(${x * x} + ${y * y}) = √${x * x + y * y} = ${dist}`,
      };
    }
    case 3: {
      // אמצע קטע
      const x1 = randomInt(-5, 5) * 2;
      const y1 = randomInt(-5, 5) * 2;
      const x2 = randomInt(-5, 5) * 2;
      const y2 = randomInt(-5, 5) * 2;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      return {
        id: generateId(),
        type: 'multiple-choice',
        grade: 6,
        topic: 'coordinates',
        difficulty,
        text: `מהי נקודת האמצע של הקטע בין (${x1},${y1}) ל-(${x2},${y2})?`,
        correctAnswer: `(${mx},${my})`,
        options: [
          `(${mx},${my})`,
          `(${x1 + x2},${y1 + y2})`,
          `(${mx + 1},${my - 1})`,
          `(${mx - 1},${my + 1})`,
        ],
        hint: 'אמצע = ממוצע של ה-x-ים וממוצע של ה-y-ים',
        explanation: `((${x1}+${x2})/2, (${y1}+${y2})/2) = (${mx}, ${my})`,
      };
    }
  }
}

export const grade6Topics: TopicDefinition[] = [
  {
    id: 'ratios',
    name: 'יחסים ופרופורציות',
    grade: 6,
    description: 'יחסים, פרופורציות וחלוקה ביחס',
    generator: generateRatios,
  },
  {
    id: 'advanced-fractions',
    name: 'שברים מתקדם',
    grade: 6,
    description: 'כפל שברים, המרות',
    generator: generateAdvancedFractions,
  },
  {
    id: 'negative-numbers',
    name: 'מספרים שליליים',
    grade: 6,
    description: 'פעולות עם מספרים שליליים',
    generator: generateNegativeNumbers,
  },
  {
    id: 'algebra',
    name: 'אלגברה',
    grade: 6,
    description: 'פתרון משוואות פשוטות',
    generator: generateAlgebra,
  },
  {
    id: 'coordinates',
    name: 'מערכת צירים',
    grade: 6,
    description: 'נקודות, רביעים ומרחקים',
    generator: generateCoordinates,
  },
];
