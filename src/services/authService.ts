/**
 * authService.ts
 * Wrapper around Firebase Authentication.
 * All Firebase calls are centralised here — screens never import Firebase directly.
 * This makes it easy to swap the auth provider without touching UI code.
 *
 * Full implementation in Phase 2.
 * Stub exported so TypeScript compiles and navigation works in Phase 1.
 */

// TODO (Phase 2): import { auth } from '../config/firebase';

export const authService = {
  signUp: async (_email: string, _password: string) => {
    throw new Error('authService.signUp not yet implemented — Phase 2');
  },
  signIn: async (_email: string, _password: string) => {
    throw new Error('authService.signIn not yet implemented — Phase 2');
  },
  signOut: async () => {
    throw new Error('authService.signOut not yet implemented — Phase 2');
  },
  sendPasswordReset: async (_email: string) => {
    throw new Error('authService.sendPasswordReset not yet implemented — Phase 2');
  },
};
