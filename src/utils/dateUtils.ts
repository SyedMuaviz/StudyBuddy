/**
 * dateUtils.ts
 * Pure functions for formatting and comparing dates.
 * Pure functions are easy to unit-test without mocking anything.
 */

/**
 * Returns "YYYY-MM-DD" for the given Date (or today if omitted).
 * We store dates as strings so they serialise cleanly to/from JSON.
 */
export function toDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns a human-readable relative label:
 * "Today", "Tomorrow", "Yesterday", or "Mon 12 Jan" for other dates.
 */
export function toRelativeLabel(dateStr: string): string {
  const today = toDateString();
  const tomorrow = toDateString(new Date(Date.now() + 86_400_000));
  const yesterday = toDateString(new Date(Date.now() - 86_400_000));

  if (dateStr === today) return 'Today';
  if (dateStr === tomorrow) return 'Tomorrow';
  if (dateStr === yesterday) return 'Yesterday';

  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

/**
 * Returns true if `dateStr` is in the past (before today).
 */
export function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return dateStr < toDateString();
}

/**
 * Formats a minute count as "2h 05m" or "45m".
 */
export function formatDuration(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${String(m).padStart(2, '0')}m`;
}

/**
 * Returns the last N days as "YYYY-MM-DD" strings, oldest first.
 * Used by the stats chart to build the x-axis labels.
 */
export function lastNDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) =>
    toDateString(new Date(Date.now() - (n - 1 - i) * 86_400_000)),
  );
}
