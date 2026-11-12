/**
 * AppTabs.tsx
 * Bottom-tab navigator shown to authenticated users.
 *
 * Five tabs: Home, Tasks, Timer, Dictionary, Stats.
 * Settings is reachable from the Home / Stats screen header icon to keep
 * the tab bar uncluttered (5-tab guideline from Apple HIG / Material).
 *
 * We use react-native-vector-icons (Ionicons) for tab icons — this is
 * the standard choice for Expo managed workflow projects.
 */

import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { spacing, fontSize } from '../theme';

// ─── Screen imports ───────────────────────────────────────────────────────────
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/tasks/TasksScreen';
import TimerScreen from '../screens/timer/TimerScreen';
import DictionaryScreen from '../screens/dictionary/DictionaryScreen';
import StatsScreen from '../screens/StatsScreen';

// ─── Tab param list ───────────────────────────────────────────────────────────
export type AppTabsParamList = {
  Home: undefined;
  Tasks: undefined;
  Timer: undefined;
  Dictionary: undefined;
  Stats: undefined;
};

// Map tab names to Ionicons icon names
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
const TAB_ICONS: Record<keyof AppTabsParamList, { active: IoniconName; inactive: IoniconName }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Tasks: { active: 'checkbox', inactive: 'checkbox-outline' },
  Timer: { active: 'timer', inactive: 'timer-outline' },
  Dictionary: { active: 'book', inactive: 'book-outline' },
  Stats: { active: 'bar-chart', inactive: 'bar-chart-outline' },
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

export default function AppTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // ── Tab icon ──────────────────────────────────────────────────────
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name as keyof AppTabsParamList];
          const name: IoniconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={name} size={size} color={color} />;
        },
        // ── Tab bar styling ───────────────────────────────────────────────
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          // Extra padding on iOS because of the home indicator
          paddingBottom: Platform.OS === 'ios' ? spacing[5] : spacing[1],
          paddingTop: spacing[1],
          height: Platform.OS === 'ios' ? 84 : 60,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Timer" component={TimerScreen} />
      <Tab.Screen name="Dictionary" component={DictionaryScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
    </Tab.Navigator>
  );
}
