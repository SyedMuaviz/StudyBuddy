# StudyBuddy — Viva Defense Guide & Examination Notes

This guide is prepared for both **Student A** and **Student B** to prepare for the viva presentation and technical demonstration. It explains every design choice, module responsibility, anticipated viva questions, and corresponding model answers.

---

## 1. Project Concept & Justification

### Elevator Pitch (30 seconds)
"StudyBuddy is a mobile application built using React Native and TypeScript designed specifically for university students. It solves academic fragmentation by unifying task scheduling, Pomodoro-based study sessions with automated streak incentives, an offline-capable academic dictionary, and study analytics. Everything is architected offline-first so students can study without distraction or dependency on erratic campus Wi-Fi."

### Division of Work
- **Student A (Frontend, UI/UX, Theme, Interaction):**
  - Designed the comprehensive design system (colors, typography, 8pt spacing grid, responsive card components).
  - Built navigation screens: `HomeScreen`, `TasksScreen`, `TimerScreen`, `DictionaryScreen`, `StatsScreen`, `SettingsScreen`.
  - Implemented the dynamic theme switcher supporting seamless Dark Mode.
- **Student B (Architecture, State, Storage, APIs, Notifications):**
  - Implemented clean service-oriented architecture: `authService`, `storageService`, `dictionaryService`, `notificationService`.
  - Handled persistent session management using Firebase Authentication.
  - Configured `@react-native-async-storage/async-storage` serialization with fault tolerance.
  - Implemented the streak tracking mathematical logic and date manipulation utilities with unit testing.

---

## 2. Library Selection Rationales

| Library | Why Chosen Over Alternatives? |
|---|---|
| **React Native + Expo** | Faster development lifecycle, cross-platform compilation without needing complex Xcode/Android Studio native wrappers for basic iteration. Standardized configuration via `app.json`. |
| **TypeScript (Strict Mode)** | Prevents runtime `TypeError: undefined is not a function`. Self-documenting domain models (`Task`, `StreakData`) simplify collaboration between Student A and Student B. |
| **React Navigation** | The industry standard for React Native. Provides native platform transitions (stack slides on iOS/Android) and bottom tabs adhering to Apple HIG and Material Design 3 guidelines. |
| **AsyncStorage** | Lightweight key-value storage engine ideal for offline-first JSON persistence. Avoids heavy SQLite ORM overhead while satisfying all course criteria. |
| **Axios** | Provides cleaner interceptor patterns, automated JSON parsing, and custom timeout configuration compared to the raw `fetch` API. |
| **Expo Notifications** | Provides unified cross-platform API for scheduling local background alarms, task notifications, and timer alerts without requiring third-party native bridging. |

---

## 3. Likely Viva Questions & Model Answers

### Q1: "Why did you choose React Native with Expo instead of Flutter?"
**Answer:**  
"React Native with Expo allows us to leverage TypeScript's strict typing system alongside the vast npm ecosystem. Expo's modern managed workflow provides robust pre-configured native APIs (such as `expo-notifications` and native screen drivers) while ensuring strict cross-platform compatibility across both iOS and Android from a single codebase. Furthermore, React's declarative component model and Hooks (`useContext`, `useReducer`) enable clean state separation without introducing external architectural boilerplate."

### Q2: "How does the app function when the student has no internet connection?"
**Answer:**  
"StudyBuddy follows an offline-first architectural paradigm. Core entities — including tasks, focus logs, streak metrics, settings, and saved dictionary vocabulary — are stored in the device's persistent sandbox using `@react-native-async-storage/async-storage` via our `storageService`. When offline, students can still create and manage tasks, run Pomodoro sessions, maintain streaks, and review their saved dictionary cards. Network access is only required for live user authentication and new dictionary word queries."

### Q3: "Explain how your streak tracking logic handles edge cases."
**Answer:**  
"Our streak calculation is isolated in `src/utils/streakUtils.ts` as a pure function. It compares today's date with the user's recorded `lastStudyDate`:
1. If `lastStudyDate` is equal to today's date, the student already completed a session today; the streak counter remains unchanged while total minutes increment.
2. If `lastStudyDate` is equal to yesterday's date, the consecutive streak increments by 1.
3. If the elapsed time exceeds 1 calendar day, the streak resets back to 1.
Because this logic is implemented as a pure function, it is 100% deterministic and verified with automated unit tests."

### Q4: "Where are sensitive credentials stored?"
**Answer:**  
"No API keys or sensitive credentials are ever committed to the Git repository. We use `.env.example` as a template and keep `.env` excluded through `.gitignore`. On Expo, public client variables are accessed via `process.env.EXPO_PUBLIC_*`."

### Q5: "How does your architecture keep business logic out of UI components?"
**Answer:**  
"We strictly implemented a four-tier architecture:
- Screens and components only render UI and dispatch user actions.
- React Context (`AuthContext`, `ThemeContext`) manages ambient app state.
- A dedicated Service layer (`src/services/`) encapsulates all external interactions (API calls, storage reads/writes, notifications, auth).
- Pure utility functions (`src/utils/`) handle all data transformations and calculations.
This ensures high testability, maintainability, and clean separation of concerns."

---

## 4. Key Challenges & Learnings

1. **Cross-Platform Safe Area Handling:**
   - *Challenge:* Notch, dynamic island, and Android navigation bars causing content clipping.
   - *Resolution:* Integrated `react-native-safe-area-context` and adaptive tab bar height calculation based on `Platform.OS`.
2. **Asynchronous Storage Serialization:**
   - *Challenge:* Handling corrupted or unexpected local JSON schema changes.
   - *Resolution:* Wrapped `getItem` and `setItem` with defensive try/catch blocks that fall back to null safe defaults without crashing the app.
3. **TypeScript Strictness Across Collaborative Work:**
   - *Challenge:* Avoiding typing collisions between UI screens and backend service responses.
   - *Resolution:* Established a single source of truth in `src/types/index.ts` containing all shared interfaces before developing screens.
