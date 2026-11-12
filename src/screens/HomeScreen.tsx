/**
 * HomeScreen.tsx
 * Student Home Dashboard showing streak, tasks overview, and study stats.
 */

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { fontSize, spacing, radius } from '../theme';
import Card from '../components/Card';
import Button from '../components/Button';

export default function HomeScreen() {
  const { user, setUser } = useAuth();
  const { colors, toggleTheme, isDark } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Top Header */}
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back,</Text>
          <Text style={[styles.name, { color: colors.textPrimary }]}>
            {user?.displayName || 'Student'} 👋
          </Text>
        </View>

        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.themeBtn, { backgroundColor: colors.surfaceSecondary }]}
        >
          <Text style={{ fontSize: fontSize.base }}>{isDark ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>
      </View>

      {/* Streak Hero Card */}
      <Card
        style={{
          backgroundColor: isDark ? colors.surface : '#EEF2FF',
          borderColor: colors.primary,
          borderWidth: 1.5,
        }}
      >
        <View style={styles.streakRow}>
          <Text style={styles.streakFlame}>🔥</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.streakTitle, { color: colors.primary }]}>5 Day Study Streak!</Text>
            <Text style={[styles.streakSub, { color: colors.textSecondary }]}>
              You're building great consistency. Keep it up!
            </Text>
          </View>
        </View>

        <View style={[styles.statSplit, { borderTopColor: colors.border }]}>
          <View style={styles.statCol}>
            <Text style={[styles.statNum, { color: colors.textPrimary }]}>45m</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Today's Focus</Text>
          </View>
          <View style={[styles.dividerVertical, { backgroundColor: colors.border }]} />
          <View style={styles.statCol}>
            <Text style={[styles.statNum, { color: colors.textPrimary }]}>3 / 4</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tasks Completed</Text>
          </View>
        </View>
      </Card>

      {/* Today's Tasks Section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Today's Tasks</Text>
      </View>

      <Card>
        <View style={styles.taskItem}>
          <Text style={styles.check}>✅</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.taskTitle,
                { color: colors.textSecondary, textDecorationLine: 'line-through' },
              ]}
            >
              Review CS204 Lecture Notes
            </Text>
            <Text style={[styles.taskTag, { color: colors.primary }]}>
              Computer Science • Completed
            </Text>
          </View>
        </View>

        <View style={[styles.itemDivider, { backgroundColor: colors.border }]} />

        <View style={styles.taskItem}>
          <Text style={styles.check}>⭕</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.taskTitle, { color: colors.textPrimary }]}>
              Mobile App Dev Project Proposal
            </Text>
            <Text style={[styles.taskTag, { color: colors.warning }]}>
              Due 11:59 PM • High Priority
            </Text>
          </View>
        </View>
      </Card>

      {/* Quick Word of the Day */}
      <Card>
        <Text style={[styles.wotdBadge, { color: colors.primary }]}>📖 Word of the Day</Text>
        <Text style={[styles.wotdWord, { color: colors.textPrimary }]}>
          Heuristic <Text style={styles.wotdPos}>(noun)</Text>
        </Text>
        <Text style={[styles.wotdDef, { color: colors.textSecondary }]}>
          "A practical problem-solving technique not guaranteed to be optimal, but sufficient for
          immediate goals."
        </Text>
      </Card>

      {/* Account Info & Logout */}
      <View style={{ marginTop: spacing[4], marginBottom: spacing[8] }}>
        <Button title="Sign Out" variant="outline" onPress={() => setUser(null)} />
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  greeting: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  themeBtn: {
    padding: spacing[2],
    borderRadius: radius.full,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  streakFlame: {
    fontSize: 40,
    marginRight: spacing[3],
  },
  streakTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  streakSub: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  statSplit: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: spacing[3],
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  dividerVertical: {
    width: 1,
    height: '100%',
  },
  sectionHeader: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  check: {
    fontSize: 20,
    marginRight: spacing[3],
  },
  taskTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  taskTag: {
    fontSize: fontSize.xs,
    marginTop: 2,
    fontWeight: '500',
  },
  itemDivider: {
    height: 1,
    marginVertical: spacing[2],
  },
  wotdBadge: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing[1],
  },
  wotdWord: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing[1],
  },
  wotdPos: {
    fontSize: fontSize.sm,
    fontWeight: '400',
    fontStyle: 'italic',
  },
  wotdDef: {
    fontSize: fontSize.base,
    lineHeight: 22,
  },
});
