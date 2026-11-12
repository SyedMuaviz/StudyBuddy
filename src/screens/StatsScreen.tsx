/**
 * StatsScreen.tsx
 * Academic Productivity Analytics.
 * Features:
 * - Total focus minutes & streak records
 * - 7-day weekly study-time visual bar chart
 * - Subject distribution analysis
 */

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { StreakData, FocusSession, Task } from '../types';
import { getStreak, getSessions, getTasks } from '../services/storageService';
import { INITIAL_STREAK } from '../utils/streakUtils';
import { formatDuration, lastNDays, toDateString } from '../utils/dateUtils';
import { fontSize, spacing, radius } from '../theme';
import Card from '../components/Card';

export default function StatsScreen() {
  const { colors, isDark } = useTheme();

  const [streak, setStreak] = useState<StreakData>(INITIAL_STREAK);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getStreak().then(setStreak);
    getSessions().then(setSessions);
    getTasks().then(setTasks);
  }, []);

  // Compute 7-day daily study minutes
  const past7Days = lastNDays(7); // "YYYY-MM-DD"
  const dailyFocusMap: Record<string, number> = {};
  past7Days.forEach((d) => (dailyFocusMap[d] = 0));

  sessions.forEach((s) => {
    if (dailyFocusMap[s.date] !== undefined) {
      dailyFocusMap[s.date] += s.durationMinutes;
    }
  });

  const maxMinutesInWeek = Math.max(...Object.values(dailyFocusMap), 60);

  // Compute subject distribution
  const subjectMap: Record<string, number> = {};
  tasks.forEach((t) => {
    subjectMap[t.subject] = (subjectMap[t.subject] || 0) + 1;
  });
  const totalTasks = tasks.length || 1;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Study Analytics</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Monitor your study habits, streaks, and subject balance
        </Text>
      </View>

      {/* 2x2 Metric Cards Grid */}
      <View style={styles.grid}>
        <Card style={styles.metricCard}>
          <Text style={styles.metricEmoji}>⏱️</Text>
          <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
            {formatDuration(streak.totalMinutes)}
          </Text>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
            Total Focus Time
          </Text>
        </Card>

        <Card style={styles.metricCard}>
          <Text style={styles.metricEmoji}>🔥</Text>
          <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
            {streak.currentStreak} Days
          </Text>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Current Streak</Text>
        </Card>

        <Card style={styles.metricCard}>
          <Text style={styles.metricEmoji}>🏆</Text>
          <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
            {streak.longestStreak} Days
          </Text>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Longest Streak</Text>
        </Card>

        <Card style={styles.metricCard}>
          <Text style={styles.metricEmoji}>✅</Text>
          <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
            {tasks.filter((t) => t.isCompleted).length} / {tasks.length}
          </Text>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Tasks Finished</Text>
        </Card>
      </View>

      {/* Weekly Study Time Bar Chart */}
      <Card>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Weekly Focus Minutes</Text>
        <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
          Daily minutes dedicated to study sessions over the past 7 days
        </Text>

        <View style={styles.chartContainer}>
          {past7Days.map((dateStr) => {
            const minutes = dailyFocusMap[dateStr] || 0;
            const barHeightPercent = Math.max(Math.round((minutes / maxMinutesInWeek) * 120), 6);
            const isToday = dateStr === toDateString();
            const dayLabel = new Date(dateStr).toLocaleDateString('en-US', {
              weekday: 'narrow',
            });

            return (
              <View key={dateStr} style={styles.barCol}>
                <Text style={[styles.barValue, { color: colors.textSecondary }]}>
                  {minutes > 0 ? `${minutes}m` : ''}
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: barHeightPercent,
                        backgroundColor: isToday ? colors.primary : colors.primaryLight,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.barDay,
                    {
                      color: isToday ? colors.primary : colors.textSecondary,
                      fontWeight: isToday ? '700' : '500',
                    },
                  ]}
                >
                  {dayLabel}
                </Text>
              </View>
            );
          })}
        </View>
      </Card>

      {/* Subject Distribution */}
      <Card style={{ marginTop: spacing[3] }}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Subject Distribution</Text>
        <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
          Coursework workload breakdown across registered subjects
        </Text>

        <View style={{ marginTop: spacing[3] }}>
          {Object.entries(subjectMap).map(([sub, count]) => {
            const pct = Math.round((count / totalTasks) * 100);
            return (
              <View key={sub} style={styles.subjectRow}>
                <View style={styles.subjectHeader}>
                  <Text style={[styles.subjectName, { color: colors.textPrimary }]}>{sub}</Text>
                  <Text style={[styles.subjectPct, { color: colors.textSecondary }]}>
                    {count} task(s) • {pct}%
                  </Text>
                </View>

                <View
                  style={[
                    styles.progressTrack,
                    { backgroundColor: isDark ? colors.surfaceSecondary : '#E5E7EB' },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${pct}%`, backgroundColor: colors.primary },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </Card>
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
    paddingBottom: spacing[10],
  },
  header: {
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  metricCard: {
    width: '48.5%',
    alignItems: 'center',
    paddingVertical: spacing[4],
    marginBottom: 0,
  },
  metricEmoji: {
    fontSize: 28,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  metricLabel: {
    fontSize: fontSize.xs,
    marginTop: 2,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
    marginTop: spacing[4],
    paddingHorizontal: spacing[2],
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barValue: {
    fontSize: 9,
    marginBottom: 4,
  },
  barTrack: {
    height: 120,
    width: 24,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barFill: {
    width: '100%',
    borderRadius: radius.sm,
  },
  barDay: {
    fontSize: fontSize.xs,
    marginTop: spacing[2],
  },
  subjectRow: {
    marginBottom: spacing[3],
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  subjectName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  subjectPct: {
    fontSize: fontSize.xs,
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.full,
  },
});
