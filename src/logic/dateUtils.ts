export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

export function getMonthDates(year: number, month: number): string[] {
  // month: 1-12
  const dates: string[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    dates.push(formatDate(new Date(year, month - 1, d)));
  }
  return dates;
}

export function getCalendarGrid(year: number, month: number): (string | null)[] {
  // 月曜始まりのグリッド。前後の月の日は null。
  const first = new Date(year, month - 1, 1);
  const jsDay = first.getDay(); // 0=Sun
  const leadingBlanks = (jsDay + 6) % 7; // 月曜=0始まりに変換
  const dates = getMonthDates(year, month);
  const grid: (string | null)[] = Array(leadingBlanks).fill(null);
  grid.push(...dates);
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

export const WEEKDAY_LABELS = ['月', '火', '水', '木', '金', '土', '日'];

export function isSameMonth(dateStr: string, year: number, month: number): boolean {
  const [y, m] = dateStr.split('-').map(Number);
  return y === year && m === month;
}

export function todayStr(): string {
  return formatDate(new Date());
}

const WEEKDAY_JP = ['日', '月', '火', '水', '木', '金', '土'];

export function formatDisplayDate(dateStr: string): string {
  const [y, mo, da] = dateStr.split('-').map(Number);
  const date = new Date(y, mo - 1, da);
  return `${mo}月${da}日(${WEEKDAY_JP[date.getDay()]})`;
}
