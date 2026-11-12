/**
 * SettingsScreen.tsx
 * Student preferences, theme customizer, notification settings, and account management.
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AppSettings } from '../types';
import {
  getSettings,
  saveSettings,
  saveStreak,
  saveTasks,
  getTasks,
} from '../services/storageService';
import { INITIAL_STREAK } from '../utils/streakUtils';
import { fontSize, spacing, radius } from '../theme';
import Card from '../components/Card';
import Button from '../components/Button';

export default function SettingsScreen() {
  const { user, setUser } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();

  const [settings, setSettings] = useState<AppSettings>({
    focusDurationMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    sessionsBeforeLongBreak: 4,
    notificationsEnabled: true,
    soundEnabled: true,
  });

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleResetStreak = () => {
    const doReset = async () => {
      await saveStreak(INITIAL_STREAK);
      if (Platform.OS === 'web') {
        window.alert('Study streak has been reset to 0.');
      } else {
        Alert.alert('Reset', 'Study streak has been reset to 0.');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Reset your study streak back to 0 days?')) doReset();
    } else {
      Alert.alert('Reset Streak', 'Reset your study streak back to 0 days?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: doReset },
      ]);
    }
  };

  const handleClearCompletedTasks = async () => {
    const currentTasks = await getTasks();
    const remaining = currentTasks.filter((t) => !t.isCompleted);
    await saveTasks(remaining);
    const count = currentTasks.length - remaining.length;
    const msg = `Removed ${count} completed task(s).`;
    if (Platform.OS === 'web') {
      window.alert(msg);
    } else {
      Alert.alert('Tasks Cleared', msg);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Preferences, timer defaults, and account details
        </Text>
      </View>

      {/* Account Info Card */}
      <Card>
        <View style={styles.profileRow}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {(user?.displayName || user?.email || 'S').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1, marginLeft: spacing[3] }}>
            <Text style={[styles.profileName, { color: colors.textPrimary }]}>
              {user?.displayName || 'Student User'}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
              {user?.email || 'student@university.edu'}
            </Text>
            <Text style={[styles.profileBadge, { color: colors.primary }]}>
              🎓 Active University Session
            </Text>
          </View>
        </View>
      </Card>

      {/* Appearance Section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Appearance</Text>
      </View>
      <Card>
        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Dark Theme</Text>
            <Text style={[styles.settingSub, { color: colors.textSecondary }]}>
              Reduce eye strain during late-night revision
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#D1D5DB', true: colors.primary }}
          />
        </View>
      </Card>

      {/* Notifications Section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Notifications & Alerts
        </Text>
      </View>
      <Card>
        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
              Task Due Reminders
            </Text>
            <Text style={[styles.settingSub, { color: colors.textSecondary }]}>
              Push alerts for approaching coursework deadlines
            </Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(v) => updateSetting('notificationsEnabled', v)}
            trackColor={{ false: '#D1D5DB', true: colors.primary }}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
              Focus Session End Alert
            </Text>
            <Text style={[styles.settingSub, { color: colors.textSecondary }]}>
              Play sound and vibrate when Pomodoro ends
            </Text>
          </View>
          <Switch
            value={settings.soundEnabled}
            onValueChange={(v) => updateSetting('soundEnabled', v)}
            trackColor={{ false: '#D1D5DB', true: colors.primary }}
          />
        </View>
      </Card>

      {/* Pomodoro Defaults */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Timer Defaults</Text>
      </View>
      <Card>
        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
          Standard Focus Duration
        </Text>
        <View style={styles.chipPicker}>
          {[15, 25, 45, 50].map((dur) => {
            const isSelected = settings.focusDurationMinutes === dur;
            return (
              <TouchableOpacity
                key={dur}
                onPress={() => updateSetting('focusDurationMinutes', dur)}
                style={[
                  styles.durChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceSecondary,
                  },
                ]}
              >
                <Text
                  style={{
                    color: isSelected ? colors.textOnPrimary : colors.textSecondary,
                    fontSize: fontSize.xs,
                    fontWeight: '700',
                  }}
                >
                  {dur} mins
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Data Management */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Data Management</Text>
      </View>
      <Card>
        <TouchableOpacity onPress={handleClearCompletedTasks} style={styles.actionRow}>
          <Text style={{ fontSize: 18, marginRight: spacing[2] }}>🧹</Text>
          <Text style={[styles.actionText, { color: colors.textPrimary }]}>
            Clear Completed Tasks
          </Text>
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <TouchableOpacity onPress={handleResetStreak} style={styles.actionRow}>
          <Text style={{ fontSize: 18, marginRight: spacing[2] }}>🔄</Text>
          <Text style={[styles.actionText, { color: colors.error }]}>
            Reset Study Streak Counter
          </Text>
        </TouchableOpacity>
      </Card>

      {/* About Project */}
      <Card style={{ marginTop: spacing[3] }}>
        <Text style={[styles.aboutTitle, { color: colors.textPrimary }]}>StudyBuddy v1.0.0</Text>
        <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
          Mobile Application Development Course Project{'\n'}
          Built with React Native, Expo, and TypeScript.{'\n'}
          Offline-first architecture with local persistence.
        </Text>
      </Card>

      {/* Sign Out Button */}
      <View style={{ marginTop: spacing[5], marginBottom: spacing[10] }}>
        <Button title="Sign Out of StudyBuddy" variant="danger" onPress={() => setUser(null)} />
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
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  profileName: {
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: fontSize.sm,
  },
  profileBadge: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeader: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[1],
  },
  settingLabel: {
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  settingSub: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: spacing[3],
  },
  chipPicker: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[3],
  },
  durChip: {
    flex: 1,
    paddingVertical: spacing[2],
    alignItems: 'center',
    borderRadius: radius.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  actionText: {
    fontSize: fontSize.base,
    fontWeight: '500',
  },
  aboutTitle: {
    fontSize: fontSize.base,
    fontWeight: '700',
    marginBottom: 4,
  },
  aboutText: {
    fontSize: fontSize.xs,
    lineHeight: 18,
  },
});
