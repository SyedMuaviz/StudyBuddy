/**
 * TimerScreen.tsx
 * Pomodoro Focus Timer with automated streak tracking and session history.
 * Modes: Focus (25m), Short Break (5m), Long Break (15m).
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { TimerMode, StreakData } from '../../types';
import { getStreak, saveStreak, saveSessions, getSessions } from '../../services/storageService';
import { updateStreak, INITIAL_STREAK } from '../../utils/streakUtils';
import { toDateString } from '../../utils/dateUtils';
import { fontSize, spacing, radius } from '../../theme';
import Card from '../../components/Card';
import Button from '../../components/Button';

const MODE_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

export default function TimerScreen() {
  const { colors, isDark } = useTheme();

  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_DURATIONS.focus);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [streakData, setStreakData] = useState<StreakData>(INITIAL_STREAK);
  const [sessionCount, setSessionCount] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load streak and session count on mount
  useEffect(() => {
    getStreak().then(setStreakData);
    getSessions().then((sessions) => {
      const today = toDateString();
      const todaySessions = sessions.filter((s) => s.date === today);
      setSessionCount(todaySessions.length);
    });
  }, []);

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Switch mode
  const handleSwitchMode = (newMode: TimerMode) => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
  };

  // Handle session completed
  const handleSessionCompleted = useCallback(async () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (mode === 'focus') {
      const durationMins = Math.floor(MODE_DURATIONS.focus / 60);

      // 1. Update streak
      const updatedStreak = updateStreak(streakData, durationMins);
      setStreakData(updatedStreak);
      await saveStreak(updatedStreak);

      // 2. Save session log
      const currentSessions = await getSessions();
      const newSession = {
        id: 'session-' + Date.now(),
        date: toDateString(),
        durationMinutes: durationMins,
        completedAt: new Date().toISOString(),
      };
      await saveSessions([newSession, ...currentSessions]);
      setSessionCount((prev) => prev + 1);

      const msg = `Great job! You completed a ${durationMins}-minute focus session. Streak: ${updatedStreak.currentStreak} day(s)!`;
      if (Platform.OS === 'web') {
        window.alert('🎉 Focus Session Completed!\n' + msg);
      } else {
        Alert.alert('🎉 Focus Session Completed!', msg);
      }
    } else {
      const breakMsg = 'Break is over! Ready to focus again?';
      if (Platform.OS === 'web') {
        window.alert('☕ Break Ended!\n' + breakMsg);
      } else {
        Alert.alert('☕ Break Ended!', breakMsg);
      }
    }

    // Reset timer for current mode
    setTimeLeft(MODE_DURATIONS[mode]);
  }, [mode, streakData]);

  // Timer tick effect
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionCompleted();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, handleSessionCompleted]);

  // Controls
  const toggleStartPause = () => {
    setIsActive((prev) => !prev);
  };

  const handleReset = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(MODE_DURATIONS[mode]);
  };

  const totalDuration = MODE_DURATIONS[mode];
  const progressPercent = Math.round(((totalDuration - timeLeft) / totalDuration) * 100);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Title */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Focus Timer</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Stay immersed using the Pomodoro technique
        </Text>
      </View>

      {/* Mode Selector Tabs */}
      <View style={[styles.modeRow, { backgroundColor: colors.surfaceSecondary }]}>
        {(['focus', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => {
          const isSelected = mode === m;
          const labels: Record<TimerMode, string> = {
            focus: 'Focus (25m)',
            shortBreak: 'Short Break (5m)',
            longBreak: 'Long Break (15m)',
          };
          return (
            <TouchableOpacity
              key={m}
              onPress={() => handleSwitchMode(m)}
              style={[
                styles.modeTab,
                {
                  backgroundColor: isSelected ? colors.surface : 'transparent',
                  shadowOpacity: isSelected ? 0.1 : 0,
                },
              ]}
            >
              <Text
                style={[
                  styles.modeTabText,
                  {
                    color: isSelected ? colors.primary : colors.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {labels[m]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Big Timer Dial Card */}
      <Card style={styles.timerCard}>
        <View
          style={[
            styles.timerRing,
            {
              borderColor: isDark ? colors.border : '#E0E7FF',
              backgroundColor: isDark ? colors.surfaceSecondary : '#F5F7FF',
            },
          ]}
        >
          <Text style={styles.modeEmoji}>
            {mode === 'focus' ? '🎯' : mode === 'shortBreak' ? '☕' : '🌴'}
          </Text>
          <Text style={[styles.timerDigits, { color: colors.textPrimary }]}>
            {formatTime(timeLeft)}
          </Text>
          <Text style={[styles.progressLabel, { color: colors.primary }]}>
            {progressPercent}% Complete
          </Text>
        </View>

        {/* Action Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            onPress={handleReset}
            style={[styles.secondaryControl, { backgroundColor: colors.surfaceSecondary }]}
          >
            <Text style={{ fontSize: 20 }}>🔄</Text>
          </TouchableOpacity>

          <Button
            title={isActive ? '⏸ Pause' : '▶ Start Focus'}
            onPress={toggleStartPause}
            style={styles.mainStartBtn}
          />

          <TouchableOpacity
            onPress={() => handleSessionCompleted()}
            style={[styles.secondaryControl, { backgroundColor: colors.surfaceSecondary }]}
          >
            <Text style={{ fontSize: 20 }}>⏭️</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Daily Streak & Session Info */}
      <View style={styles.statsGrid}>
        <Card style={styles.statMiniCard}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {streakData.currentStreak} Days
          </Text>
          <Text style={[styles.statTitle, { color: colors.textSecondary }]}>Current Streak</Text>
        </Card>

        <Card style={styles.statMiniCard}>
          <Text style={styles.statEmoji}>🍅</Text>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>{sessionCount}</Text>
          <Text style={[styles.statTitle, { color: colors.textSecondary }]}>Today's Sessions</Text>
        </Card>

        <Card style={styles.statMiniCard}>
          <Text style={styles.statEmoji}>⏱️</Text>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {streakData.totalMinutes}m
          </Text>
          <Text style={[styles.statTitle, { color: colors.textSecondary }]}>All-Time Focus</Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing[5],
    paddingTop: spacing[8],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
  },
  subtitle: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  modeRow: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    padding: 4,
    marginBottom: spacing[5],
  },
  modeTab: {
    flex: 1,
    paddingVertical: spacing[2],
    alignItems: 'center',
    borderRadius: radius.md,
  },
  modeTabText: {
    fontSize: fontSize.xs,
  },
  timerCard: {
    alignItems: 'center',
    paddingVertical: spacing[8],
    marginBottom: spacing[5],
  },
  timerRing: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  modeEmoji: {
    fontSize: 32,
    marginBottom: spacing[1],
  },
  timerDigits: {
    fontSize: 52,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  progressLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    marginTop: spacing[2],
    textTransform: 'uppercase',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    width: '100%',
    paddingHorizontal: spacing[4],
  },
  secondaryControl: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainStartBtn: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  statMiniCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[1],
  },
  statEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  statValue: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  statTitle: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
});
