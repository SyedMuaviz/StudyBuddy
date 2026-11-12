/**
 * EmptyState.tsx
 * Renders a friendly empty state message when a list or query has no data.
 */

import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { fontSize, spacing } from '../theme';

interface Props {
  icon?: string;
  title: string;
  message: string;
}

export default function EmptyState({ icon = '📂', title, message }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing[2],
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing[1],
    textAlign: 'center',
  },
  message: {
    fontSize: fontSize.base,
    textAlign: 'center',
    lineHeight: 22,
  },
});
