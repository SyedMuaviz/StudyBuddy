/**
 * ThemeContext.tsx
 * Provides the current color scheme (light | dark) and a toggle function
 * to every component in the tree without prop-drilling.
 *
 * We persist the user's preference in AsyncStorage so it survives app restarts.
 * We also respect the device's system preference as the initial default.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppColors, darkColors, lightColors } from '../theme';

// ─── Storage key ────────────────────────────────────────────────────────────
const THEME_KEY = '@studybuddy/theme';

// ─── Types ───────────────────────────────────────────────────────────────────
type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: AppColors;
  isDark: boolean;
  toggleTheme: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setMode] = useState<ThemeMode>(systemScheme === 'dark' ? 'dark' : 'light');

  // Load persisted preference once on mount
  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark') {
        setMode(saved);
      }
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next: ThemeMode = prev === 'light' ? 'dark' : 'light';
      // Fire-and-forget persistence — no need to await in the callback
      AsyncStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  // Memoize so consumers only re-render when mode actually changes
  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      colors: mode === 'dark' ? darkColors : lightColors,
      isDark: mode === 'dark',
      toggleTheme,
    }),
    [mode, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────
/** Throws if used outside <ThemeProvider> — catches wiring mistakes early. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
