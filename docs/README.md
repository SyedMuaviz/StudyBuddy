# StudyBuddy

A study companion for university students — task scheduling, Pomodoro focus timer with streaks, vocabulary dictionary, and weekly statistics.

Built with **React Native + Expo (TypeScript)** as a university Mobile Apps Development project.

---

## Features

| Feature | Status |
|---|---|
| ✅ User Authentication (Firebase) | Phase 2 |
| ✅ Task Manager with reminders | Phase 3 |
| ✅ Pomodoro Timer + Streaks | Phase 4 |
| ✅ Push Notifications | Phase 4 |
| ✅ Dictionary API | Phase 5 |
| ✅ Statistics (weekly chart) | Phase 6 |
| ✅ Dark / Light mode | Phase 6 |
| ✅ Settings | Phase 6 |

---

## Prerequisites

- Node.js ≥ 18
- Expo CLI: `npm install -g expo-cli`
- Android Studio (for Android emulator) **or** Xcode (for iOS simulator on macOS)
- Expo Go app on your physical device (optional, for quick testing)

---

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/StudyBuddy.git
cd StudyBuddy

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and fill in your Firebase credentials (see Phase 2 notes)

# 4. Start the development server
npx expo start
```

Then press:
- `a` — open Android emulator
- `i` — open iOS simulator (macOS only)
- Scan the QR code with Expo Go on your phone

---

## Folder Structure

```
StudyBuddy/
├── App.tsx                   # Entry point, context providers
├── app.json                  # Expo configuration
├── .env.example              # Environment variable template
├── docs/                     # All project documentation
│   ├── proposal.md
│   ├── documentation.md
│   ├── user_manual.md
│   ├── viva_notes.md
│   ├── presentation_outline.md
│   └── README.md  (this file)
└── src/
    ├── config/               # Firebase initialisation
    ├── context/              # React Context (Auth, Theme)
    ├── hooks/                # Custom hooks
    ├── navigation/           # RootNavigator, AuthStack, AppTabs
    ├── screens/              # One folder per feature area
    │   ├── auth/             # Login, SignUp, ForgotPassword
    │   ├── tasks/            # TasksScreen, AddTaskScreen, EditTaskScreen
    │   ├── timer/            # TimerScreen
    │   ├── dictionary/       # DictionaryScreen
    │   ├── HomeScreen.tsx
    │   ├── StatsScreen.tsx
    │   └── SettingsScreen.tsx
    ├── components/           # Reusable UI components
    ├── services/             # authService, storageService, dictionaryService, notificationService
    ├── theme/                # colors, typography, spacing
    ├── types/                # Shared TypeScript interfaces
    └── utils/                # dateUtils, streakUtils, validationUtils
```

---

## Running Tests

```bash
npm test
```

---

## Building for Release

```bash
# Android APK (EAS Build — Phase 8)
eas build --platform android --profile preview

# iOS (requires Apple Developer account)
eas build --platform ios --profile preview
```

---

## Team Contributions

| Task Area | Student |
|---|---|
| UI / Screens / Components / Theme | **Student A** |
| Auth / Services / Storage / Notifications / API | **Student B** |

Both students contributed to: navigation setup, testing, documentation, and the viva.

---

## Libraries Used

| Library | Purpose |
|---|---|
| `expo` | Managed workflow, build tools |
| `@react-navigation/native` | Navigation container |
| `@react-navigation/native-stack` | Stack navigator for auth flow |
| `@react-navigation/bottom-tabs` | Tab bar for main app |
| `@react-native-async-storage/async-storage` | Offline local storage |
| `axios` | HTTP client for Dictionary API |
| `firebase` | Authentication (Phase 2) |
| `expo-notifications` | Push notifications (Phase 4) |
| `@expo/vector-icons` | Tab bar and UI icons |
| `react-native-safe-area-context` | Safe area handling |
| `react-native-screens` | Native screen optimization |

---

## Academic Integrity

All code in this repository was written from scratch by the team listed above. No pre-built templates, cloned open-source apps, or externally generated code was used beyond the official Expo blank TypeScript starter and the libraries listed above.
