/**
 * Card.tsx
 * Reusable surface container with borders and consistent padding.
 */

import { View, StyleSheet, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';
import { radius, spacing } from '../theme';

interface Props {
  children: ReactNode;
  style?: ViewStyle;
}

export default function Card({ children, style }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing[4],
    marginBottom: spacing[3],
  },
});
