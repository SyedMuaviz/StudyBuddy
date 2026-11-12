/**
 * types/index.ts
 * Shared TypeScript types for the whole app.
 * Keeping types in one place avoids circular imports and makes it easy
 * to see the full data model at a glance.
 */

// ─── Task ────────────────────────────────────────────────────────────────────
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  subject: string;
  priority: Priority;
  dueDate: string | null;    // ISO 8601 date string, null if no due date
  dueTime: string | null;    // "HH:MM" format, null if no specific time
  isCompleted: boolean;
  reminderEnabled: boolean;
  notificationId: string | null; // expo-notifications identifier
  createdAt: string;         // ISO 8601
}

// ─── Focus Session ───────────────────────────────────────────────────────────
export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface FocusSession {
  id: string;
  date: string;         // "YYYY-MM-DD"
  durationMinutes: number;
  completedAt: string;  // ISO 8601
}

// ─── Streak ──────────────────────────────────────────────────────────────────
export interface StreakData {
  currentStreak: number;  // consecutive study days
  longestStreak: number;
  lastStudyDate: string | null;  // "YYYY-MM-DD"
  totalSessions: number;
  totalMinutes: number;
}

// ─── Dictionary ──────────────────────────────────────────────────────────────
export interface DictionaryPhonetic {
  text?: string;
  audio?: string;
}

export interface DictionaryDefinition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
}

export interface DictionaryEntry {
  word: string;
  phonetics: DictionaryPhonetic[];
  meanings: DictionaryMeaning[];
  sourceUrls: string[];
}

// ─── Favorite Word ───────────────────────────────────────────────────────────
export interface FavoriteWord {
  id: string;
  word: string;
  partOfSpeech: string;   // first meaning's part of speech
  definition: string;     // first definition
  savedAt: string;        // ISO 8601
}

// ─── Settings ────────────────────────────────────────────────────────────────
export interface AppSettings {
  focusDurationMinutes: number;     // default 25
  shortBreakMinutes: number;        // default 5
  longBreakMinutes: number;         // default 15
  sessionsBeforeLongBreak: number;  // default 4
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  focusDurationMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
  notificationsEnabled: true,
  soundEnabled: true,
};
