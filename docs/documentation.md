# StudyBuddy — Technical Documentation

**Course:** Mobile Applications Development  
**Group:** Student A (UI / Frontend) & Student B (Backend / Architecture / API)  
**Project:** StudyBuddy (Mobile Academic Productivity Assistant)  
**Stack:** React Native, Expo, TypeScript, Firebase Auth, AsyncStorage, Dictionary API  
**Date:** November 2026  

---

## 1. Introduction

University education demands that students balance lectures, laboratory assignments, coursework deadlines, revision schedules, and vocabulary comprehension. Without centralized organization, students often experience deadline fatigue and fragmented study routines.

**StudyBuddy** is a mobile application developed from scratch using **React Native with Expo** and **TypeScript** to solve this problem. It consolidates four core productivity pillars:
1. **Academic Task Management:** Prioritized task tracking with due dates, course tags, and mobile reminders.
2. **Pomodoro Focus Timer:** Structured focus sessions (25 min focus / 5 min short break / 15 min long break) coupled with an automatic streak calculator.
3. **Integrated Academic Dictionary:** Contextual word lookup powered by the Free Dictionary API, with offline local persistence for favorites.
4. **Study Analytics:** Clear visual representations of weekly study hours and subject distribution.

---

## 2. System Architecture

StudyBuddy follows a clean, modular, layered architecture that strictly separates user interface components from business logic, data persistence, and external APIs.

```
┌────────────────────────────────────────────────────────┐
│                   Presentation Layer                   │
│  (Screens: Home, Tasks, Timer, Dictionary, Stats, Auth)│
│  (Reusable Components: Buttons, Inputs, Cards, Badges) │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    State & Context                     │
│    (ThemeContext [Colors/Mode], AuthContext [User])    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                     Service Layer                      │
│   ├── authService         (Firebase Authentication)    │
│   ├── storageService      (AsyncStorage / Offline)     │
│   ├── dictionaryService   (Axios HTTP Client)          │
│   └── notificationService (expo-notifications)         │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│               External APIs & Operating System         │
│   ├── Firebase Auth SDK                                │
│   ├── api.dictionaryapi.dev                            │
│   └── iOS & Android Notification Subsystems            │
└────────────────────────────────────────────────────────┘
```

### Architectural Principles
- **No Direct API/Storage Calls in UI:** Screens and UI components invoke service methods only. For example, `TasksScreen` does not interact with `@react-native-async-storage/async-storage` directly; it calls `storageService`.
- **Offline-First Resilience:** The app remains functional in lecture halls and libraries without active internet access. Tasks, timer history, streaks, settings, and saved dictionary terms are stored locally.
- **Type Safety:** TypeScript strict mode is enabled across the entire codebase (`"strict": true`, `"noImplicitAny": true`). All domain entities (`Task`, `FocusSession`, `StreakData`, `DictionaryEntry`) have explicit interfaces in `src/types/index.ts`.
- **System Theme Synchronization:** Built-in dynamic theme engine (`ThemeContext`) supporting instant light/dark switching and automatic synchronization with the host operating system.

---

## 3. Directory Structure

```
StudyBuddy/
├── App.tsx                     # Top-level application root & context provider hierarchy
├── app.json                    # Expo configuration & permission definitions
├── tsconfig.json               # TypeScript strict configuration
├── eslint.config.js            # Flat ESLint configuration (v9/v10 compatible)
├── .prettierrc.json            # Code formatting rules
├── .env.example                # Template for environment credentials
├── docs/                       # Project documentation & grading deliverables
│   ├── proposal.md             # One-page project proposal & justification
│   ├── documentation.md        # Technical architecture & API reference (this file)
│   ├── user_manual.md          # User manual with mockup placeholders
│   ├── wireframes.md           # Figma layout and screen specifications
│   ├── viva_notes.md           # Viva defense guide & Q&A preparation
│   ├── presentation_outline.md # Slide deck outline for final presentation
│   └── README.md               # Repository landing & developer onboarding
└── src/
    ├── config/                 # Third-party configurations (Firebase)
    ├── context/                # Global React contexts (ThemeContext, AuthContext)
    ├── navigation/             # Navigation stacks & bottom tabs
    │   ├── RootNavigator.tsx   # Conditional auth/app root router
    │   ├── AuthStack.tsx       # Stack router for unauthenticated screens
    │   └── AppTabs.tsx         # Bottom tab navigator for main features
    ├── screens/                # Screen views
    │   ├── auth/               # LoginScreen, SignUpScreen, ForgotPasswordScreen
    │   ├── tasks/              # TasksScreen
    │   ├── timer/              # TimerScreen
    │   ├── dictionary/         # DictionaryScreen
    │   ├── HomeScreen.tsx      # Dashboard view
    │   ├── StatsScreen.tsx     # Statistics & charts view
    │   └── SettingsScreen.tsx  # User preferences & account view
    ├── components/             # Reusable UI components
    ├── services/               # Service abstraction layer
    │   ├── authService.ts      # Authentication wrapper
    │   ├── storageService.ts   # Persistent local storage
    │   ├── dictionaryService.ts# External Dictionary API client
    │   └── notificationService.ts # Local push notification manager
    ├── theme/                  # Design tokens: palette, spacing, typography
    ├── types/                  # Central TypeScript definitions
    └── utils/                  # Pure utility functions (dateUtils, streakUtils)
```

---

## 4. API Integration Details

### Free Dictionary API
- **Endpoint:** `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
- **Protocol:** HTTPS REST (GET)
- **Authentication:** None required (Public domain API)
- **Response Handling:**
  - Encapsulated in `dictionaryService.ts` via an isolated `axios` instance configured with a 10-second timeout.
  - Returns structured phonetics (with audio URLs when provided), definitions grouped by grammatical part of speech, and usage examples.
  - Implements defensive error handling: differentiates between network failure (`ERR_NETWORK`) and lexical not-found conditions (HTTP 404).

---

## 5. Mobile-Specific Capabilities

### 1. Local Push Notifications (`expo-notifications`)
- Scheduled alerts for pending task deadlines.
- Completion alerts triggered upon the conclusion of Pomodoro focus blocks and rest intervals.
- Graceful permission handling: prompts the user appropriately and maintains app operation even if notification permissions are denied.

### 2. Native Storage Engine (`@react-native-async-storage/async-storage`)
- Stores serialized JSON documents representing tasks, timer records, streak counters, and favorites.
- Protected against data corruption through try/catch parsing abstractions in `storageService.ts`.

---

## 6. Academic Integrity & Development Hygiene
- **Zero Third-Party Templates:** The codebase is constructed exclusively on top of the clean `blank-typescript` Expo starter.
- **Incremental Git Commits:** Every milestone and phase is committed with conventional commit messages (`feat:`, `fix:`, `docs:`, `chore:`).
- **In-Depth Code Commentary:** Every file contains explanatory comments documenting architectural intent and component roles to facilitate student viva explanations.
