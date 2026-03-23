# EduVerify — Bug Report

---

## Architectural Bugs

### 1. QR Scanner Crash (Critical)
**File:** `src/features/dashboard/student/components/StudentActiveSessionScanner.tsx`

- `onSuccess` (an inline arrow function from the parent) is in the `useEffect` dependency array. Since it's a new reference on every render, the effect constantly tears down and recreates the `html5-qrcode` instance on the same `reader` div before the async `stop()` resolves — causing an unhandled crash.
- `processAttendance` is a stale closure — it captures `user` and `sessionId` at mount time and never re-reads updated values.
- No guard against the `onScanSuccess` callback firing twice in quick succession, risking duplicate Firestore writes.
- The scanner cleanup in `useEffect` return runs asynchronously but the next effect can start before it finishes, leaving two scanner instances fighting over the same DOM node.

---

### 2. Infinite Firestore Re-subscription Loop (Critical)
**File:** `src/features/dashboard/student/ClassDetailsPage.tsx`

- `activeSession` is in the `useEffect` dependency array for the `subscribeToActiveSession` listener.
- Every time a student checks in, `activeSession` state updates → the effect re-runs → the old listener unsubscribes → a new listener subscribes → which immediately fires → updating `activeSession` again. Infinite loop.

---

### 3. Auth Loading Flash / Incorrect Redirect on Hard Refresh (High)
**File:** `src/store/useAuthStore.ts`

- `loading` is initialised to `false`.
- On a hard refresh, `RoleGuard` sees `loading: false, user: null` for a split second before `useAuthListener` resolves, and immediately redirects authenticated users to `/login`.
- Fix: initialise `loading: true` and never persist it (only persist `user`).

---

### 4. `RoleGuard` Wrong Fallback Redirect (High)
**File:** `src/features/auth/components/RoleGuard.tsx`

- When a user accesses a route their role isn't permitted for, they are redirected to `"/"` (the public landing page).
- They should be redirected to their own role's dashboard (`/student/dashboard`, `/lecturer/dashboard`, or `/admin/dashboard`).

---

### 5. `AdminSettingsPage` Toggles Not Persisted (High)
**File:** `src/features/dashboard/admin/AdminSettingsPage.tsx`

- `strictFaceAuth` and `geofencing` are plain `useState` — they reset to their defaults on every page visit.
- The component was designed to persist settings to Firestore (referenced in Chapter Four and the system design) but the Firestore read/write calls were never implemented.

---

### 6. Firestore Timestamp Rendered as "Invalid Date" (High)
**Files:** `src/features/dashboard/lecturer/LecturerDashboard.tsx`, `src/features/dashboard/student/StudentDashboard.tsx`

- Both dashboards call `new Date(cls.createdAt)` on a raw Firestore `Timestamp` object (which has `.seconds` and `.nanoseconds` properties, not a numeric value).
- This produces `"Invalid Date"` in all recent activity timestamps.
- Correct usage: `new Date(cls.createdAt.seconds * 1000)` or `cls.createdAt?.toDate()`.

---

### 7. Face-api.js Models Load on Onboarding Step 1 (Medium)
**File:** `src/features/onboarding/components/StudentOnboarding.tsx`

- The `useEffect` that fetches all three face-api model files (~6 MB total) runs unconditionally on component mount — before the user has filled in their personal or academic details.
- Models are only needed on step 3 ("Face Setup"). Loading them upfront wastes bandwidth for the ~30–60% of users who may abandon the flow before step 3.

---

### 8. `EnrollStudentsModal.tsx` is Dead Code (Low)
**File:** `src/features/dashboard/lecturer/EnrollStudentsModal.tsx`

- The file exists and is fully implemented but is never imported anywhere.
- `LecturerClassDetailsPage.tsx` implements its own inline enroll modal instead.
- The standalone component should either replace the inline one or be deleted.

---

### 9. `CreateAttendanceSessionPage` — `duration` Field Captured but Never Used (Low)
**File:** `src/features/dashboard/lecturer/CreateAttendanceSessionPage.tsx`

- The form collects a `duration` value from the user but it is never passed to `attendanceService.createSession()`.
- The session document has no `duration` field, so the "Indefinite (Manual Close)" vs timed behaviour is never enforced.

---

## UI Bugs

### 10. `bg-primary-hover` Undefined in Tailwind Config (Critical)
**Files:** Used across `LecturerDashboard`, `CreateClassPage`, `EditClassPage`, `ClassDetailsPage`, `StudentOnboarding`, `EnrollStudentsModal` and more.

- `hover:bg-primary-hover` is referenced on at least 10 buttons throughout the app but the `primary-hover` colour is never defined in `tailwind.config.js`.
- Tailwind silently drops unknown utility classes, so every hover state that uses this is broken — buttons show no visual feedback on hover.
- Fix: add `"primary-hover": "#0B6357"` (or similar darker shade) to the `colors` object in `tailwind.config.js`.

---

### 11. Sidebar Profile Section `mt-auto` Has No Effect (Critical)
**File:** `src/components/layout/Sidebar.tsx`

- The `<aside>` element uses `overflow-y-auto` but is **not** `flex flex-col`, so `mt-auto` on the profile section does nothing — it just stacks directly below the nav links instead of being pinned to the bottom.
- Fix: add `flex flex-col` to the `<aside>` and `flex-1 overflow-y-auto` to the nav wrapper div.

---

### 12. `StudentDashboard` Attendance Stats Are Hardcoded (High)
**File:** `src/features/dashboard/student/StudentDashboard.tsx`

- "Attendance Rate" is hardcoded as `"100%"` and "Classes Today" is hardcoded as `"0"`.
- Neither stat reads from Firestore. The student sees the same values regardless of their actual attendance record.

---

### 13. LIVE Badge on `MyClassesPage` Never Appears (High)
**File:** `src/features/dashboard/student/MyClassesPage.tsx`

- The component checks `cls.isSessionOpen` to show a "LIVE" ribbon on class cards, but `isSessionOpen` is not a field on the `ClassGroup` Firestore document and is never populated.
- The ribbon is permanently invisible for all students.
- Fix: either query active sessions client-side and annotate classes before rendering, or add a real-time `isActive` field to session documents and denormalise it onto the class.

---

### 14. `AttendanceHistoryPage` Filter and Export Buttons Are No-ops (Medium)
**File:** `src/features/dashboard/student/AttendanceHistoryPage.tsx`

- Both the "Filter" and "Export" buttons render correctly but have no `onClick` handlers — clicking them does nothing.

---

### 15. `AdminDashboard` Stats Grid Is Always Empty (Medium)
**File:** `src/features/dashboard/admin/AdminDashboard.tsx`

- `const stats: any[] = []` is hardcoded as an empty array at the top of the file.
- The grid always renders the "No stats available" fallback. No Firestore queries are made.
- The design calls for aggregate counts of users, classes, sessions, and records.

---

### 16. `QRCodeSVG` in `LecturerClassDetailsPage` Encodes the Wrong Value (Medium)
**File:** `src/features/dashboard/lecturer/LecturerClassDetailsPage.tsx`

- The QR code is generated with `value={JSON.stringify({ sessionId: activeSession.id })}`.
- However, in `StudentActiveSessionScanner`, the scan handler validates `payload.sessionId !== sessionId` where `sessionId` is the prop passed in (also `activeSession.id`).
- These **do** match so this works — but in `ScannerPage.tsx` (the older standalone scanner) the decoded payload is passed directly to `markAttendance` with no token validation at all, meaning any QR code with a valid `sessionId` key would mark attendance even for a different session.

---

*Total: 16 bugs — 3 Critical, 6 High, 5 Medium, 2 Low*
