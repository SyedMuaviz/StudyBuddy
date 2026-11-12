/**
 * PlaceholderScreen.tsx
 * A generic placeholder used during development for screens not yet implemented.
 * This prevents the app from crashing due to missing screen components while
 * we build the navigation skeleton in Phase 1.
 *
 * Every real screen will replace this component in later phases.
 */

import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { fontSize, spacing } from '../theme';

interface Props {
  title: string;
}

export default function PlaceholderScreen({ title }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.emoji]}>🚧</Text>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>Coming in a later phase</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
  },
  emoji: { fontSize: 48, marginBottom: spacing[3] },
  title: { fontSize: fontSize.xl, fontWeight: '700', marginBottom: spacing[2] },
  sub: { fontSize: fontSize.base },
});
