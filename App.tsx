/**
 * App.tsx  — entry point for StudyBuddy
 *
 * Renders the context providers in the correct order:
 *   ThemeProvider  →  AuthProvider  →  RootNavigator
 *
 * Order matters:
 * - ThemeProvider must be outermost because AuthProvider and all screens
 *   read colors from it.
 * - AuthProvider wraps the navigator so navigation can react to auth state.
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

/**
 * Inner component reads theme AFTER ThemeProvider is mounted.
 * We need this because useTheme() requires the ThemeContext to exist.
 */
function AppInner() {
  const { isDark } = useTheme();
  return (
    <>
      {/* StatusBar adapts to light/dark theme automatically */}
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
