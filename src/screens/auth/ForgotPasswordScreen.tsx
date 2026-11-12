/**
 * ForgotPasswordScreen.tsx
 * Password recovery screen.
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useTheme } from '../../context/ThemeContext';
import { fontSize, spacing } from '../../theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { validateEmail } from '../../utils/validationUtils';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = () => {
    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 400);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your student email and we'll send you recovery instructions.
          </Text>
        </View>

        <Card>
          {isSent ? (
            <View style={styles.successBox}>
              <Text style={styles.successIcon}>✉️</Text>
              <Text style={[styles.successTitle, { color: colors.textPrimary }]}>
                Check your inbox
              </Text>
              <Text style={[styles.successText, { color: colors.textSecondary }]}>
                A password reset link has been dispatched to {email}.
              </Text>
              <Button
                title="Back to Sign In"
                onPress={() => navigation.navigate('Login')}
                style={{ marginTop: spacing[4] }}
              />
            </View>
          ) : (
            <>
              <Input
                label="Student Email"
                placeholder="student@university.edu"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (emailError) setEmailError(null);
                }}
                error={emailError}
              />
              <Button title="Send Recovery Email" onPress={handleReset} isLoading={isSubmitting} />
            </>
          )}
        </Card>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backBtn}>
          <Text style={[styles.backText, { color: colors.primary }]}>← Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: spacing[5],
    justifyContent: 'center',
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: fontSize.base,
    textAlign: 'center',
    maxWidth: 320,
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: spacing[3],
  },
  successIcon: {
    fontSize: 48,
    marginBottom: spacing[2],
  },
  successTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing[1],
  },
  successText: {
    fontSize: fontSize.base,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  backBtn: {
    alignSelf: 'center',
    marginTop: spacing[4],
  },
  backText: {
    fontSize: fontSize.base,
    fontWeight: '600',
  },
});
