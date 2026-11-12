/**
 * notificationService.ts
 * Wraps expo-notifications so screens never call it directly.
 * Centralising notification logic means we can change behaviour
 * (e.g. switch to a push server) without editing every screen.
 *
 * Full implementation in Phase 4.
 */

// TODO (Phase 4): implement scheduleTaskReminder, scheduleTimerEnd, cancelNotification
export const notificationService = {
  requestPermission: async (): Promise<boolean> => {
    // Stub — returns false until Phase 4
    return false;
  },
};
