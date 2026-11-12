# StudyBuddy — Project Proposal

**Course:** Mobile Applications Development  
**Group Members:** Student A (UI/Screens) · Student B (Auth/Services/Storage)  
**Date:** November 2026  
**Framework:** React Native with Expo (TypeScript)

---

## 1. Problem Statement

University students frequently struggle to manage competing academic deadlines, maintain consistent study habits, and quickly look up unfamiliar terminology — all without reliable internet access in libraries or lecture halls. Existing productivity apps are either too generic (not built for academic workflows) or require expensive subscriptions.

## 2. Proposed Solution — StudyBuddy

**StudyBuddy** is a mobile companion designed exclusively for university students. It combines four tools — a task planner, a Pomodoro focus timer, a vocabulary dictionary, and study analytics — in a single, offline-capable app.

| Tool | Purpose |
|---|---|
| Task Manager | Create, prioritise, and track study tasks with due-date reminders |
| Focus Timer | Pomodoro sessions (25 / 5 / 15 min) with streak tracking to build habits |
| Dictionary | Instant word lookups with definitions, examples and phonetics; save favourites offline |
| Statistics | Weekly study-time chart to visualise consistency and motivate improvement |

## 3. Target Audience

University students aged 18–26 who use Android or iOS smartphones and need to:
- Juggle multiple subjects with tight deadlines.
- Build a consistent study routine.
- Quickly look up academic vocabulary without switching apps.

## 4. Mobile-Specific Features

| Feature | Technology |
|---|---|
| **Local push notifications** | `expo-notifications` — task due-date reminders, focus session end alerts |
| **Offline-first storage** | `AsyncStorage` — tasks, sessions, streak and favourites work without Wi-Fi |
| **System theme detection** | `useColorScheme` — automatically matches the device's light/dark setting |

## 5. External API Integration

- **Free Dictionary API** (`https://api.dictionaryapi.dev/api/v2/entries/en/{word}`) — no API key required, completely free, provides definitions, phonetics, parts of speech and example sentences.

## 6. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | React Native + Expo (TypeScript) | Cross-platform, managed workflow, fast iteration |
| Navigation | react-navigation (stack + tabs) | Official, well-maintained, type-safe |
| Auth | Firebase Authentication | Free tier, persistent sessions, email+OAuth |
| Storage | AsyncStorage | Simple key-value store, works offline |
| HTTP client | axios | Cleaner than fetch, easy error handling |
| Notifications | expo-notifications | Expo-managed, works on Android & iOS |
| State | React Context + useReducer | No extra dependency, appropriate for this scale |

## 7. Unique Value Proposition

StudyBuddy is built from scratch for the academic context. Unlike Todoist or Forest, it ties task management, timed focus sessions, vocabulary learning, and habit streaks together in one place — with everything working offline and no subscription required.

## 8. Project Timeline

| Week | Milestone |
|---|---|
| Week 1 (12–18 Nov 2026) | Proposal, project setup, navigation skeleton, theme |
| Week 2 (19–25 Nov 2026) | Firebase Auth — sign-up, login, logout, password reset |
| Week 3 (26 Nov – 2 Dec 2026) | Task manager — CRUD, priorities, due dates, local storage |
| Week 4 (3–9 Dec 2026) | Focus timer, streaks, notifications → **Working Prototype** |
| Week 5 (10–16 Dec 2026) | Dictionary API, favourites |
| Week 6 (17–23 Dec 2026) | Statistics, settings, dark mode, polish, innovation feature |
| Week 7 (24–28 Dec 2026) | Tests, lint, cross-platform testing (Android + iOS) |
| Week 8 (29–31 Dec 2026) | APK build, documentation, slides — **Final Submission** |

---

*Repository:* [github.com/YOUR_USERNAME/StudyBuddy] — to be made public before submission.
