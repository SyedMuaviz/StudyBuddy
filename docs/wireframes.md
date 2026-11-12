# StudyBuddy — Screen List & Wireframe Specifications (Figma Guide)

Use this document to reconstruct the UI prototypes in **Figma** or **Adobe XD** before or alongside evaluation demos.

---

## Design System Tokens

- **Base Canvas:** Mobile (390 x 844 px — iPhone 14/15/16 baseline)
- **Primary Color:** `#6366F1` (Indigo 500)
- **Primary Dark:** `#4338CA` (Indigo 700)
- **Accent Color:** `#F59E0B` (Amber 500)
- **Background (Light):** `#F9FAFB` (Gray 50)
- **Surface (Light):** `#FFFFFF` (White)
- **Background (Dark):** `#111827` (Gray 900)
- **Surface (Dark):** `#1F2937` (Gray 800)
- **Text Primary (Light):** `#111827`
- **Text Secondary (Light):** `#6B7280`
- **Border Radius:** Cards (`16px`), Buttons (`12px`), Pills (`9999px`)
- **Spacing Scale:** 4px, 8px, 12px, 16px, 20px, 24px, 32px

---

## 1. Authentication Flow

### 1.1 Login Screen (`LoginScreen`)
- **Top Bar:** None (Full screen layout with safe-area spacing).
- **Header Section:**
  - App Logo / Icon (64x64, Indigo, Study cap or book glyph).
  - Title: "Welcome Back" (28px Bold).
  - Subtitle: "Sign in to continue your study streak" (15px Regular, Gray).
- **Form Fields (Vertical stack, 16px gap):**
  - Email Input: Left icon `mail-outline`, Placeholder: `student@university.edu`, validation state container.
  - Password Input: Left icon `lock-closed-outline`, right toggle `eye-outline` / `eye-off-outline`, secure entry.
  - "Forgot Password?" right-aligned link (13px, Indigo).
- **Actions:**
  - Primary Button: "Sign In" (Indigo background, 50px height, full width, rounded 12px, white text 16px Semibold).
  - Social / Alternative Divider: "or continue with email".
- **Footer Section:**
  - Horizontal text: "Don't have an account? " + "Sign Up" (Indigo Semibold link).

### 1.2 Sign Up Screen (`SignUpScreen`)
- **Header Section:**
  - Back arrow (top-left, 44x44 tap area).
  - Title: "Create Account" (28px Bold).
  - Subtitle: "Organize your studies and stay consistent" (15px Regular).
- **Form Fields:**
  - Full Name Input: Left icon `person-outline`.
  - Email Input: Left icon `mail-outline`.
  - Password Input: Left icon `lock-closed-outline`.
  - Confirm Password Input: Left icon `shield-checkmark-outline`.
- **Actions:**
  - Primary Button: "Create Account".
  - Footer link: "Already have an account? Sign In".

### 1.3 Forgot Password Screen (`ForgotPasswordScreen`)
- **Header:** Back arrow, "Reset Password" (24px Bold), descriptive helper text.
- **Form:** Email input.
- **Action:** "Send Reset Link" button.
- **Feedback:** Inline success banner or error card.

---

## 2. Main Tab Screens

### 2.1 Home Dashboard (`HomeScreen`)
- **Header Bar:**
  - Greeting: "Hello, Student 👋" (13px Gray) + "Ready to focus?" (22px Bold).
  - Right Icon: Settings gear icon (navigates to Settings modal/screen).
- **Streak & Summary Card (Hero Component):**
  - Amber gradient background with soft glow.
  - Streak Fire Badge: 🔥 "5 Day Streak!" (24px Bold).
  - 2-Column Mini Stats:
    - Left: "Today's Focus: 50m"
    - Right: "Tasks Done: 3/5"
- **Quick Action Bar:**
  - "Start Focus" (Primary CTA with play icon)
  - "Add Task" (Outlined button with plus icon)
- **Today's Due Tasks Section:**
  - Header: "Today's Tasks" + "See All" button.
  - Task Cards (Vertical list, 12px gap):
    - Checkbox circle (interactive).
    - Title: "CS302 Assignment 2" (15px Semibold).
    - Tag badge: "Computer Science" (soft blue chip).
    - Due time: "Due 5:00 PM" + priority flag badge (Red/Orange/Green).
- **Word of the Day Teaser:**
  - Compact card linking to Dictionary tab with a daily vocabulary highlight.

### 2.2 Task Manager (`TasksScreen`)
- **Header:**
  - "My Tasks" title (24px Bold).
  - Filter chips row (horizontal scroll): "All", "Pending", "Completed", "High Priority".
- **Search Bar:**
  - Search input with search icon and clear button.
- **Task List (FlatList):**
  - Empty State illustration if no tasks ("No tasks found. Tap + to add one!").
  - Each item: swipe to delete / edit, checkbox to complete with strike-through animation, priority indicator ribbon on left edge.
- **Floating Action Button (FAB):**
  - Bottom-right floating circle (+ icon, 56x56, Indigo shadow) opening Add Task Modal.

### 2.3 Focus Timer (`TimerScreen`)
- **Header:**
  - "Focus Timer" title.
  - Mode Switcher Segmented Control: `[ Focus (25m) | Short Break (5m) | Long Break (15m) ]`.
- **Center Visualizer:**
  - Circular Countdown Progress Ring (260x260 px).
  - Time display: `25:00` (48px Bold Monospaced / Sans-serif).
  - Current task label: "Working on: Algorithm Analysis" (optional selector).
- **Controls (Bottom row):**
  - Reset / Skip button (circular, gray).
  - Main Play / Pause CTA button (72x72 circle, Indigo, large Play/Pause icon).
  - Settings quick-adjust icon.
- **Bottom Streak Bar:**
  - "🔥 4 Pomodoros completed today".

### 2.4 Dictionary (`DictionaryScreen`)
- **Header:**
  - "Dictionary & Vocabulary" (24px Bold).
  - Segmented toggle: `[ Search | Saved Favorites (⭐) ]`.
- **Search Bar:**
  - Input field with debounce, search icon, clear button.
- **Word Details Card (when searched):**
  - Word heading: "Ephemeral" (26px Bold) + phonetic `/ɪˈfɛmərəl/`.
  - Audio pronunciation speaker button (plays phonetic audio if available).
  - Meaning blocks grouped by Part of Speech (`noun`, `adjective` chips).
  - Definitions bullet list with example sentences in italicized gray.
  - Floating/Header Favorite Star button (saves locally to AsyncStorage).
- **Favorites List (when toggle is on Saved):**
  - List of saved vocabulary cards with instant swipe-to-remove.

### 2.5 Statistics (`StatsScreen`)
- **Header:**
  - "Study Statistics" (24px Bold).
  - Time period filter: `[ This Week | This Month ]`.
- **Metric Cards (2x2 Grid):**
  - Total Focus Hours (`14.5 hrs`).
  - Current Streak (`5 days`).
  - Tasks Completed (`28 tasks`).
  - Longest Streak (`12 days`).
- **Weekly Bar Chart Component:**
  - Visual 7-day columns (Mon–Sun) showing daily focus minutes.
  - Active day highlight.
- **Subject Distribution Card:**
  - Breakdown of focus time per subject tag with percentage bars.

### 2.6 Settings Screen (`SettingsScreen`)
- **Account Card:** User avatar, email address, "Logged in via Firebase".
- **Preferences Section:**
  - Theme toggle: Light / Dark Mode switch.
  - Push Notifications toggle: Reminders & Timer Alerts switch.
- **Timer Settings Section:**
  - Focus duration picker (15, 25, 45, 60 min).
  - Short break picker (3, 5, 10 min).
  - Long break picker (10, 15, 20 min).
- **About & Academic Info:**
  - App Name & Version (`StudyBuddy v1.0.0`).
  - University Mobile Apps Development Course Project.
- **Logout Button:** Red text / outlined destructive button.
