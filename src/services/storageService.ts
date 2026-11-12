/**
 * storageService.ts
 * Abstraction over AsyncStorage for offline-first local persistence.
 * Centralises keys, error handling, and serialization.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Task,
  StreakData,
  FocusSession,
  FavoriteWord,
  AppSettings,
  DEFAULT_SETTINGS,
} from '../types';
import { INITIAL_STREAK } from '../utils/streakUtils';
import { toDateString } from '../utils/dateUtils';

export const STORAGE_KEYS = {
  TASKS: '@studybuddy/tasks',
  SESSIONS: '@studybuddy/sessions',
  STREAK: '@studybuddy/streak',
  FAVORITES: '@studybuddy/favorites',
  SETTINGS: '@studybuddy/settings',
  THEME: '@studybuddy/theme',
} as const;

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Graceful failure
  }
}

export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

// ─── Domain-specific helpers ──────────────────────────────────────────────────

const SEED_TASKS: Task[] = [
  {
    id: 'seed-task-1',
    title: 'Review Machine Learning Lab 3',
    subject: 'Computer Science',
    priority: 'high',
    dueDate: toDateString(),
    dueTime: '17:00',
    isCompleted: false,
    reminderEnabled: true,
    notificationId: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-task-2',
    title: 'Calculus Problem Set 4',
    subject: 'Mathematics',
    priority: 'medium',
    dueDate: toDateString(new Date(Date.now() + 86400000)),
    dueTime: '23:59',
    isCompleted: false,
    reminderEnabled: false,
    notificationId: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-task-3',
    title: 'Read Operating Systems Chapter 5',
    subject: 'Computer Science',
    priority: 'low',
    dueDate: null,
    dueTime: null,
    isCompleted: true,
    reminderEnabled: false,
    notificationId: null,
    createdAt: new Date().toISOString(),
  },
];

export async function getTasks(): Promise<Task[]> {
  const tasks = await getItem<Task[]>(STORAGE_KEYS.TASKS);
  if (tasks === null) {
    // Seed initial tasks for first run
    await setItem(STORAGE_KEYS.TASKS, SEED_TASKS);
    return SEED_TASKS;
  }
  return tasks;
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await setItem(STORAGE_KEYS.TASKS, tasks);
}

export async function getStreak(): Promise<StreakData> {
  const streak = await getItem<StreakData>(STORAGE_KEYS.STREAK);
  return streak ?? INITIAL_STREAK;
}

export async function saveStreak(streak: StreakData): Promise<void> {
  await setItem(STORAGE_KEYS.STREAK, streak);
}

export async function getSessions(): Promise<FocusSession[]> {
  const sessions = await getItem<FocusSession[]>(STORAGE_KEYS.SESSIONS);
  return sessions ?? [];
}

export async function saveSessions(sessions: FocusSession[]): Promise<void> {
  await setItem(STORAGE_KEYS.SESSIONS, sessions);
}

export async function getFavorites(): Promise<FavoriteWord[]> {
  const favs = await getItem<FavoriteWord[]>(STORAGE_KEYS.FAVORITES);
  return favs ?? [];
}

export async function saveFavorites(favs: FavoriteWord[]): Promise<void> {
  await setItem(STORAGE_KEYS.FAVORITES, favs);
}

export async function getSettings(): Promise<AppSettings> {
  const settings = await getItem<AppSettings>(STORAGE_KEYS.SETTINGS);
  return settings ?? DEFAULT_SETTINGS;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await setItem(STORAGE_KEYS.SETTINGS, settings);
}
