/**
 * SignUpScreen.tsx
 * Student registration screen.
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

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: Props) {
  const { setUser } = useAuth();
  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = () => {
    let hasError = false;

    if (!name.trim()) {
      setNameError('Full name is required');
      hasError = true;
    } else {
      setNameError(null);
    }

    const eErr = validateEmail(email);
    setEmailError(eErr);
    if (eErr) hasError = true;

    const pErr = validatePassword(password);
    setPasswordError(pErr);
    if (pErr) hasError = true;

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      hasError = true;
    } else {
      setConfirmError(null);
    }

    if (hasError) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setUser({
        uid: 'user-' + Date.now(),
        email: email.trim(),
        displayName: name.trim(),
      });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Join StudyBuddy to start tracking tasks and building focus streaks.
          </Text>
        </View>

        <Card>
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            value={name}
            onChangeText={(t) => {
              setName(t);
              if (nameError) setNameError(null);
            }}
            error={nameError}
          />

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
            placeholder="At least 8 characters"
            secureTextEntry
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              if (passwordError) setPasswordError(null);
            }}
            error={passwordError}
          />

          <Input
            label="Confirm Password"
            placeholder="Repeat password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(t) => {
              setConfirmPassword(t);
              if (confirmError) setConfirmError(null);
            }}
            error={confirmError}
          />

          <Button title="Create Account" onPress={handleSignUp} isLoading={isSubmitting} />
        </Card>

        <View style={styles.footer}>
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.base }}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.linkBold, { color: colors.primary }]}>Sign In</Text>
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
  linkBold: {
    fontSize: fontSize.base,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing[4],
  },
});
