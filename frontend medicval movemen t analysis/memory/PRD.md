# MEDMOVE AI — Product Requirements (UI Phase 1)

## Vision
AI-powered tele-rehabilitation platform for patients, doctors, and admins. Patients perform rehab exercises at home while real-time MediaPipe-based pose & face mesh analysis scores their movement, ROM and symmetry. Doctors monitor cohorts and assign protocols. Admins manage the platform.

## Current scope (Phase 1 — UI-first, mock data)
Built a complete production-grade Expo (React Native + TypeScript) mobile UI for **all three roles** with mocked data. No backend wiring yet — FastAPI + MongoDB + real MediaPipe inference will be added in subsequent phases.

## Stack
- Expo SDK 54, expo-router (file-based)
- TypeScript, React Native, react-native-svg, react-native-reanimated
- expo-camera (Live Analysis), expo-blur, expo-linear-gradient, expo-image
- @react-navigation/drawer 7.7.2 + @react-navigation/bottom-tabs (via expo-router)
- Custom theme system (medical teal/blue) with light + dark mode + persisted toggle

## Implemented screens

### Onboarding / Auth
- Splash + role picker (Patient / Doctor / Admin) with gradient hero
- Role-aware Login (mock submit logs you in)
- Patient + Doctor registration forms (different fields per role)
- Forgot password

### Patient experience
- Drawer (Dashboard, Notifications, Reports, Session History, **Baseline Discharge Videos**, **About the Team**, **Help & Support**, Sign out)
- Bottom tabs: Home, Exercises, **Live** (floating CTA), Progress, Profile
- Home: animated recovery progress ring, ROM/Accuracy/Compliance KPIs, today's exercises, recovery trend SVG line chart, last analysis card
- Exercise Library: category chip row (Upper / Lower / Spine / Facial), 12 mock exercises with thumbnails, ROM, reps
- Exercise Detail: instructions, target ROM, movement guidance legend, "Start with AI Coach" CTA
- **Live Analysis HUD (hero screen)**: real `expo-camera` preview, animated SVG skeleton overlay (15 body landmarks for pose, 22-point face mesh + dashed face oval + symmetry axis for facial), green/red start-end markers, trajectory arc, top status pills (joint angle, score, FPS), rep counter, voice toggle, camera flip, animated record halo button, contextual feedback bubbles ("Lift slightly higher", "Excellent form!" etc.). MediaPipe inference is currently mocked — wiring requires native dev build.
- Progress: range chip row, recovery ring, ROM/Accuracy/Compliance/Sessions KPIs, multi-series line chart, recent sessions
- Session History, Reports (PDF list w/ download/share/view actions), Notifications, Baseline Videos (collapsible programs with nested sessions), About Team, Help/FAQ, Profile (light/dark toggle live, settings rows)

### Doctor experience
- Drawer + Tabs (Home, Patients, Assign, Reports, Profile)
- Dashboard: clinic banner, KPIs (active patients, compliance, recovery, risk flags), cohort trend chart, flagged patients
- Patients: search, risk filter chips, patient cards with compliance + recovery
- Patient Detail: progress ring, recovery trajectory chart, recent sessions, Message + Assign Exercise CTAs
- Assign Exercise: category filter, multi-select exercises, reps/days inputs
- Assignments list, Reports per patient, Profile

### Admin experience
- Drawer + Tabs (Overview, Users, Library, Analytics, Profile)
- Overview: uptime hero, KPIs, engagement chart, system health metrics
- Users: filter chips, status badges, accept/manage rows
- Exercise Library management
- Analytics: DAU/MAU, retention, engagement chart, top conditions

## Design system
Custom palette in `src/theme/index.ts` (light + dark) with medical teal/blue, generous 8pt spacing, rounded 12–16px cards, subtle shadows, no gradients on dark, soft pulsing animations on overlays.

## Mocked / Next phase
- MediaPipe Pose & Face Mesh real inference (currently visual SVG mock) — **MOCKED**
- FastAPI + MongoDB backend (auth, exercises, sessions, reports, notifications)
- Cloudinary video storage
- PDF generation, email verification, JWT, refresh tokens
- Real charts library if richer interactions needed

## File layout
```
app/frontend/
├── app/                    # expo-router file routes
│   ├── _layout.tsx
│   ├── index.tsx           # Splash + role picker
│   ├── (auth)/             # login, register, forgot-password
│   ├── (patient)/          # drawer + tabs + stack
│   ├── (doctor)/           # drawer + tabs + stack
│   └── (admin)/            # drawer + tabs + stack
└── src/
    ├── theme/              # palette, ThemeProvider
    ├── data/mock.ts        # all mock data
    └── components/         # Button, ChipRow, ExerciseCard, ProgressRing,
                            # LineChart, MetricCard, PatientCard, ScreenHeader,
                            # SkeletonOverlay (SVG body), FaceMeshOverlay (SVG)
```

## Demo credentials (mock — any creds work)
- Patient: `aarav@medmove.ai` / `demo1234`
- Doctor: `neha@medmove.ai` / `demo1234`
- Admin: `admin@medmove.ai` / `demo1234`
