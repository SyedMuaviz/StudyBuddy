# StudyBuddy — User Manual

Welcome to **StudyBuddy**, your all-in-one companion for university studies. This manual walks you through every screen and feature of the application.

---

## Table of Contents
1. [Getting Started & Installation](#1-getting-started--installation)
2. [Authentication & Account Setup](#2-authentication--account-setup)
3. [Home Dashboard](#3-home-dashboard)
4. [Task Manager](#4-task-manager)
5. [Focus Timer & Streaks](#5-focus-timer--streaks)
6. [Dictionary & Vocabulary](#6-dictionary--vocabulary)
7. [Study Statistics](#7-study-statistics)
8. [Settings & Customization](#8-settings--customization)
9. [Troubleshooting & FAQs](#9-troubleshooting--faqs)

---

## 1. Getting Started & Installation

### Running with Expo Go
1. Download **Expo Go** from Google Play (Android) or the App Store (iOS).
2. Ensure your mobile device and computer are on the same Wi-Fi network.
3. Open terminal in the project root and run `npm start`.
4. Scan the QR code displayed in the terminal using Expo Go (or Camera on iOS).

### Installing the Android APK
1. Download the release `.apk` file from the course submission link or releases page.
2. Tap the downloaded file and allow installation from unknown sources if prompted.
3. Launch **StudyBuddy** from your app drawer.

---

## 2. Authentication & Account Setup

### Sign Up
1. On the initial screen, tap **"Sign Up"**.
2. Enter your full name, student email address, and a secure password (minimum 8 characters).
3. Tap **"Create Account"**. Your session will be securely saved, so you stay logged in even after closing the app.

> *[PLACEHOLDER: Mockup / Screenshot — Sign Up Screen]*

### Log In & Password Reset
1. Enter your registered email and password on the **Login** screen.
2. Tap **"Sign In"**.
3. If you forgot your password, tap **"Forgot Password?"**, provide your email address, and tap **"Send Reset Link"**. A recovery email will be delivered to your inbox.

> *[PLACEHOLDER: Mockup / Screenshot — Login Screen]*

---

## 3. Home Dashboard

The Home screen provides a high-level snapshot of your daily study routine.

- **Greeting & Date:** Shows your name and the current date.
- **Streak Tracker:** Displays your consecutive study days with a motivational badge (e.g., 🔥 5 Days).
- **Today's Focus Time:** Total minutes logged in focus sessions today.
- **Pending Tasks Overview:** Shows tasks due today. You can mark tasks as completed directly with the checkbox.
- **Quick Actions:** Tap **"Start Focus"** to jump directly to the timer or **"Add Task"** to create a new task.

> *[PLACEHOLDER: Mockup / Screenshot — Home Dashboard]*

---

## 4. Task Manager

Stay on top of assignments, coursework, and revision deadlines.

### Adding a Task
1. Tap the **Tasks** tab in the bottom bar.
2. Tap the floating **`+`** button in the bottom-right corner.
3. Fill in:
   - **Title:** e.g., "Complete Machine Learning Lab 3"
   - **Subject / Module:** e.g., "CS380"
   - **Priority:** Low, Medium, or High
   - **Due Date & Time:** Select when the task must be submitted.
   - **Reminder:** Toggle on to receive a push notification alert.
4. Tap **"Save Task"**.

### Managing Tasks
- **Mark as Done:** Tap the circular checkbox on the left of any task card.
- **Filter:** Tap the top filter chips (`All`, `Pending`, `Completed`, `High Priority`) to narrow down your view.
- **Edit / Delete:** Tap on a task card to edit its details or swipe to delete.

> *[PLACEHOLDER: Mockup / Screenshot — Task Manager & Add Task Modal]*

---

## 5. Focus Timer & Streaks

The Focus Timer uses the Pomodoro technique to keep you engaged without burnout.

### Using the Timer
1. Select a mode from the top segmented control:
   - **Focus:** 25 minutes (customizable in Settings)
   - **Short Break:** 5 minutes
   - **Long Break:** 15 minutes (earned every 4 sessions)
2. Tap the **Play** button to begin the countdown.
3. To take a pause, tap the **Pause** button.
4. To reset or skip to the next interval, tap the **Reset** button.
5. Once a focus session finishes:
   - A celebration sound and vibration notification trigger.
   - Your session is logged locally.
   - Your daily streak increments automatically!

> *[PLACEHOLDER: Mockup / Screenshot — Focus Timer Screen]*

---

## 6. Dictionary & Vocabulary

Look up academic and technical words without leaving the app.

### Searching for a Word
1. Tap the **Dictionary** tab.
2. Enter a term in the search box (e.g., "algorithm", "osmosis", "heuristic").
3. View the retrieved entry:
   - Phonetic transcription and audio pronunciation button.
   - Parts of speech (`noun`, `verb`, `adjective`).
   - Clear definitions and example sentences.

### Saving Favorites
1. Tap the **Star (⭐)** icon at the top of any search result.
2. Switch to the **Favorites** tab to review saved terms anytime — even completely offline!

> *[PLACEHOLDER: Mockup / Screenshot — Dictionary Search & Saved Favorites]*

---

## 7. Study Statistics

Understand your study patterns and stay accountable.

- **Weekly Hours Bar Chart:** Visualizes focus minutes across Monday through Sunday.
- **Key Metrics:**
  - Total Focus Time (all-time)
  - Current Streak vs. Best Streak
  - Total Tasks Finished
- **Subject Breakdown:** Percentage of focus time devoted to each course module.

> *[PLACEHOLDER: Mockup / Screenshot — Statistics Screen]*

---

## 8. Settings & Customization

Personalize your StudyBuddy experience:

- **Theme Mode:** Toggle between **Light** and **Dark** themes (or match System default).
- **Notifications:** Enable/disable task due alerts and timer completion sounds.
- **Timer Durations:** Adjust standard focus session lengths to match your personal study rhythm (e.g., 50 min focus / 10 min break).
- **Account & Security:** View logged-in account details or securely Sign Out.

> *[PLACEHOLDER: Mockup / Screenshot — Settings Screen]*

---

## 9. Troubleshooting & FAQs

**Q: Can I use the app offline?**  
A: Yes! Tasks, timers, streaks, settings, and saved dictionary favorites are stored on your device via AsyncStorage and work completely without internet access. Only user authentication and live dictionary search require connectivity.

**Q: Why did I not receive a task reminder?**  
A: Ensure notification permissions are enabled for StudyBuddy in your device's System Settings (`Settings > Apps > StudyBuddy > Notifications`).

**Q: How is my streak calculated?**  
A: Completing at least one full focus session (25 minutes) each calendar day extends your streak. If a calendar day passes without a session, the streak resets.
