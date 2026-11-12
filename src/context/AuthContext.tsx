/**
 * AuthContext.tsx
 * Manages the user's authentication state (Firebase Auth).
 *
 * We expose a typed context so any screen can call signIn / signOut
 * without knowing the Firebase internals.  The actual Firebase calls
 * live in src/services/authService.ts (service layer keeps logic out of UI).
 *
 * NOTE: Firebase is wired up in Phase 2.  Right now the context holds
 * placeholder types so navigation and all screens can be built first.
 */

import { createContext, useContext, useMemo, useState, useCallback, type ReactNode } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextValue {
  user: AppUser | null;
  isLoading: boolean;
  /** Called by LoginScreen / SignUpScreen */
  setUser: (user: AppUser | null) => void;
  setLoading: (v: boolean) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AppUser | null>(null);
  const [isLoading, setLoadingState] = useState(true); // true while Firebase restores session

  const setUser = useCallback((u: AppUser | null) => setUserState(u), []);
  const setLoading = useCallback((v: boolean) => setLoadingState(v), []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, setUser, setLoading }),
    [user, isLoading, setUser, setLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
