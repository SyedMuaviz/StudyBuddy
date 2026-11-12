/**
 * streakUtils.ts
 * Pure functions for calculating study streaks.
 * Keeping streak logic here (not inside a component or timer) means
 * it can be unit-tested independently and reused by both the timer
 * and the home screen.
 */

import { StreakData } from '../types';
import { toDateString } from './dateUtils';

/**
 * Updates streak data after a focus session is completed.
 *
 * Rules:
 * - If the user already studied today → increment totalSessions/minutes only.
 * - If last study was yesterday → extend the streak.
 * - Otherwise → reset streak to 1 (started a new streak today).
 */
export function updateStreak(current: StreakData, sessionMinutes: number): StreakData {
  const today = toDateString();
  const yesterday = toDateString(new Date(Date.now() - 86_400_000));

  let newStreak = current.currentStreak;

  if (current.lastStudyDate === today) {
    // Already studied today — streak doesn't change, just add time
  } else if (current.lastStudyDate === yesterday) {
    // Studied yesterday → extend streak
    newStreak = current.currentStreak + 1;
  } else {
    // Gap of more than one day → streak resets
    newStreak = 1;
  }

  return {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, current.longestStreak),
    lastStudyDate: today,
    totalSessions: current.totalSessions + 1,
    totalMinutes: current.totalMinutes + sessionMinutes,
  };
}

/** Initial state for a brand-new user who has never studied. */
export const INITIAL_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  totalSessions: 0,
  totalMinutes: 0,
};
