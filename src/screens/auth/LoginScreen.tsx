/**
 * LoginScreen.tsx
 * Interactive Authentication screen for students.
 * Includes validation, loading states, and direct sign-in.
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
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { fontSize, spacing } from '../../theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { validateEmail, validatePassword } from '../../utils/validationUtils';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { setUser } = useAuth();
  const { colors, toggleTheme, isDark } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = () => {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);

    setEmailError(eErr);
    setPasswordError(pErr);

    if (eErr || pErr) return;

    setIsSubmitting(true);
    // Simulate auth / fast login
    setTimeout(() => {
      setUser({
        uid: 'student-demo-123',
        email: email.trim(),
        displayName: 'Student Demo',
      });
      setIsSubmitting(false);
    }, 400);
  };

  const handleQuickDemo = () => {
    setUser({
      uid: 'demo-student-user',
      email: 'student@university.edu',
      displayName: 'Alex Rivers',
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themePill, { backgroundColor: colors.surfaceSecondary }]}
          >
            <Text style={{ color: colors.textPrimary, fontSize: fontSize.sm }}>
              {isDark ? '🌙 Dark' : '☀️ Light'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.logo}>📚</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>StudyBuddy</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your university companion for tasks, focus, and vocabulary.
          </Text>
        </View>

        <Card>
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

          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              if (passwordError) setPasswordError(null);
            }}
            error={passwordError}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotBtn}
          >
            <Text style={[styles.linkText, { color: colors.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button title="Sign In" onPress={handleLogin} isLoading={isSubmitting} />

          <View style={styles.divider}>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
            <Text style={[styles.orText, { color: colors.textSecondary }]}>OR</Text>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
          </View>

          <Button
            title="⚡ Quick Demo Login (Skip Auth)"
            variant="outline"
            onPress={handleQuickDemo}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.base }}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={[styles.linkBold, { color: colors.primary }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: spacing[6],
  },
  themePill: {
    alignSelf: 'flex-end',
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderRadius: 9999,
    marginBottom: spacing[2],
  },
  logo: {
    fontSize: 56,
    marginBottom: spacing[2],
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: '700',
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: fontSize.base,
    textAlign: 'center',
    maxWidth: 300,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing[4],
  },
  linkText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  linkBold: {
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing[4],
  },
  line: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: spacing[3],
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing[4],
  },
});
