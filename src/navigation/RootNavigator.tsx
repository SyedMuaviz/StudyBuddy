/**
 * RootNavigator.tsx
 * Top-level navigation logic.
 *
 * We show an AuthStack (Login / SignUp) when no user is signed in,
 * and an AppTabs stack (the main bottom-tab UI) when the user IS signed in.
 * A loading spinner covers the brief moment while Firebase restores the session.
 *
 * NavigationContainer must wrap everything — it manages the navigation state.
 */

import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';

// RootStack has two branches: Auth and App
// Using a type alias here keeps the navigator type-safe
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();

  // While Firebase restores a persisted session, show a spinner
  // so the user does not see a flash of the login screen
  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Authenticated — show the main app
          <Stack.Screen name="App" component={AppTabs} />
        ) : (
          // Not authenticated — show login / signup
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
