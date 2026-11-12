/**
 * storageService.ts
 * Abstraction over AsyncStorage / expo-sqlite.
 * Keeps raw storage keys and serialisation logic in one place.
 *
 * Full implementation wired up in Phase 3 (Tasks) and Phase 4 (Timer).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/** Generic get with automatic JSON deserialisation */
export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    // If the stored value is somehow corrupt, return null rather than crashing
    return null;
  }
}

/** Generic set with automatic JSON serialisation */
export async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

/** Remove a single key */
export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

/** Remove multiple keys at once — useful for logout */
export async function clearItems(keys: string[]): Promise<void> {
  await AsyncStorage.multiRemove(keys);
}

// ─── Storage key constants ────────────────────────────────────────────────────
// Centralised here so a typo in one file doesn't silently miss the right key.
export const STORAGE_KEYS = {
  TASKS: '@studybuddy/tasks',
  SESSIONS: '@studybuddy/sessions',
  STREAK: '@studybuddy/streak',
  FAVORITES: '@studybuddy/favorites',
  SETTINGS: '@studybuddy/settings',
  THEME: '@studybuddy/theme',        // also used by ThemeContext
} as const;
