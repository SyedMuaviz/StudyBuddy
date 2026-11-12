/**
 * utils.test.ts
 * Comprehensive unit tests for dateUtils, streakUtils, and validationUtils.
 * Tested using Node.js built-in test runner (node:test, node:assert).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  toDateString,
  toRelativeLabel,
  isOverdue,
  formatDuration,
  lastNDays,
} from '../utils/dateUtils';
import { updateStreak, INITIAL_STREAK } from '../utils/streakUtils';
import { validateEmail, validatePassword, sanitize, titleCase } from '../utils/validationUtils';
import type { StreakData } from '../types';

describe('dateUtils', () => {
  it('formats current date to YYYY-MM-DD string', () => {
    const fixedDate = new Date(2026, 10, 12); // Nov 12, 2026
    assert.equal(toDateString(fixedDate), '2026-11-12');
  });

  it('correctly labels Today, Tomorrow, and Yesterday', () => {
    const today = toDateString();
    const tomorrow = toDateString(new Date(Date.now() + 86_400_000));
    const yesterday = toDateString(new Date(Date.now() - 86_400_000));

    assert.equal(toRelativeLabel(today), 'Today');
    assert.equal(toRelativeLabel(tomorrow), 'Tomorrow');
    assert.equal(toRelativeLabel(yesterday), 'Yesterday');
  });

  it('determines if a past date is overdue', () => {
    const yesterday = toDateString(new Date(Date.now() - 86_400_000));
    const tomorrow = toDateString(new Date(Date.now() + 86_400_000));

    assert.equal(isOverdue(yesterday), true);
    assert.equal(isOverdue(tomorrow), false);
    assert.equal(isOverdue(null), false);
  });

  it('formats durations into human-readable strings', () => {
    assert.equal(formatDuration(25), '25m');
    assert.equal(formatDuration(60), '1h');
    assert.equal(formatDuration(75), '1h 15m');
    assert.equal(formatDuration(125), '2h 05m');
  });

  it('generates the last N days list', () => {
    const days = lastNDays(7);
    assert.equal(days.length, 7);
    assert.equal(days[6], toDateString()); // latest day is today
  });
});

describe('streakUtils', () => {
  it('initializes a new streak on first session', () => {
    const updated = updateStreak(INITIAL_STREAK, 25);
    assert.equal(updated.currentStreak, 1);
    assert.equal(updated.longestStreak, 1);
    assert.equal(updated.totalSessions, 1);
    assert.equal(updated.totalMinutes, 25);
    assert.equal(updated.lastStudyDate, toDateString());
  });

  it('maintains streak on multiple sessions completed on the same day', () => {
    const state1 = updateStreak(INITIAL_STREAK, 25);
    const state2 = updateStreak(state1, 30);

    assert.equal(state2.currentStreak, 1); // still 1 day streak
    assert.equal(state2.totalSessions, 2);
    assert.equal(state2.totalMinutes, 55);
  });

  it('increments streak when session is completed the very next day', () => {
    const yesterday = toDateString(new Date(Date.now() - 86_400_000));
    const previousState: StreakData = {
      currentStreak: 3,
      longestStreak: 5,
      lastStudyDate: yesterday,
      totalSessions: 8,
      totalMinutes: 200,
    };

    const updated = updateStreak(previousState, 25);
    assert.equal(updated.currentStreak, 4);
    assert.equal(updated.longestStreak, 5); // 5 was previous best
    assert.equal(updated.totalSessions, 9);
    assert.equal(updated.totalMinutes, 225);
  });

  it('resets streak to 1 if a day was skipped', () => {
    const twoDaysAgo = toDateString(new Date(Date.now() - 2 * 86_400_000));
    const previousState: StreakData = {
      currentStreak: 5,
      longestStreak: 5,
      lastStudyDate: twoDaysAgo,
      totalSessions: 10,
      totalMinutes: 250,
    };

    const updated = updateStreak(previousState, 25);
    assert.equal(updated.currentStreak, 1); // reset to 1
    assert.equal(updated.longestStreak, 5); // longest streak preserved!
    assert.equal(updated.totalSessions, 11);
  });
});

describe('validationUtils', () => {
  it('validates email addresses properly', () => {
    assert.equal(validateEmail('student@university.edu'), null);
    assert.notEqual(validateEmail(''), null);
    assert.notEqual(validateEmail('invalid-email'), null);
    assert.notEqual(validateEmail('student@'), null);
  });

  it('validates password requirements', () => {
    assert.equal(validatePassword('securePass123'), null);
    assert.notEqual(validatePassword(''), null);
    assert.notEqual(validatePassword('short'), null); // < 8 characters
  });

  it('sanitizes and title-cases strings', () => {
    assert.equal(sanitize('  computer   science   '), 'computer science');
    assert.equal(titleCase('computer science lab'), 'Computer Science Lab');
  });
});
