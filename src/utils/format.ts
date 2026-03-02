/** Format a number for display in Hebrew context */
export function formatNumber(n: number): string {
  return n.toLocaleString('he-IL');
}

/** Format a fraction for display */
export function formatFraction(numerator: number, denominator: number): string {
  return `${numerator}/${denominator}`;
}

/** Format time in seconds to mm:ss */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Format percentage */
export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

/** Get today's date as ISO string (YYYY-MM-DD) */
export function today(): string {
  return new Date().toISOString().split('T')[0];
}

/** Check if a date string is today */
export function isToday(dateStr: string): boolean {
  return dateStr === today();
}

/** Check if a date string is yesterday */
export function isYesterday(dateStr: string): boolean {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateStr === d.toISOString().split('T')[0];
}

/** Generate a unique ID */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
