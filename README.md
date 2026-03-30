<p align="center">
  <img src="public/icon.png" alt="EduVerify Logo" width="120" />
</p>

<h1 align="center">EduVerify – Multi-Factor Authentication Attendance Management System</h1>

<p align="center">
  A biometric-powered, geofenced attendance verification platform for higher institutions.<br/>
  Built with React, Firebase, face-api.js, and QR code technology.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-12.10-FFCA28?logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [User Roles and Workflows](#user-roles-and-workflows)
- [Verification Methods](#verification-methods)
- [Firestore Database Schema](#firestore-database-schema)
- [Security](#security)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**EduVerify** is a multi-factor authentication attendance management system designed for Nigerian universities and other higher institutions. It replaces error-prone manual attendance processes with a dual-factor biometric verification system combining **facial recognition** and **QR code scanning**, reinforced by **GPS geofencing** to ensure students are physically present in the lecture venue.

The system serves three user roles — **Students**, **Lecturers**, and **Administrators** — each with dedicated dashboards and workflows built around a real-time Firebase backend.

---

## Key Features

### Student Features
- **Face ID Enrollment** — One-time face capture during onboarding; 128-float face descriptor stored securely in Firestore.
- **Dual Verification** — Mark attendance via Face ID or QR code scanning within active class sessions.
- **Geofence Enforcement** — GPS location validated against session coordinates using the Haversine formula (default 100 m radius).
- **Attendance History** — View per-class attendance records with timestamps and verification method used.
- **Profile and Onboarding** — Complete student profile (matric number, department, level, etc.) before accessing the system.

### Lecturer Features
- **Class Management** — Create, edit, and archive class groups with schedule, department, and level information.
- **Session Control** — Start and close attendance sessions; GPS coordinates captured automatically.
- **Live QR Code Display** — Unique session QR code generated in real time for students to scan.
- **Live Check-in Feed** — Real-time subscription to incoming attendance records during an active session.
- **Attendance Tracking** — Per-class student attendance tables with **CSV export**.
- **Student Enrollment** — Search and enroll students into classes by name or matric number.

### Admin Features
- **User Management** — Create, view, and manage all users across roles; create new lecturer/student accounts without logging out.
- **Class Oversight** — View and manage all classes across the institution.
- **Attendance Reports** — Global attendance records table with **CSV export**.
- **System Logs** — View system events (errors, warnings, info, audits).
- **System Settings** — Toggle strict face authentication and geofencing enforcement.

### Cross-cutting Concerns
- **Role-based Access Control** — Enforced at the route level via `RoleGuard`.
- **Real-time Updates** — Firestore `onSnapshot` subscriptions for sessions and records.
- **Responsive Design** — Fully responsive with a floating mobile navigation bar and sidebar for desktop.
- **Duplicate Prevention** — Server-side check prevents marking attendance twice for the same session.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19.2 + TypeScript 5.9 |
| **Build Tool** | Vite 7.3 |
| **Styling** | Tailwind CSS 3.4, clsx |
| **State Management** | Zustand 5.0 (persisted to localStorage) |
| **Server State** | TanStack React Query 5.90 |
| **Routing** | React Router DOM 7.13 |
| **Backend / Database** | Firebase 12.10 (Auth, Firestore, Analytics) |
| **Facial Recognition** | face-api.js (TinyFaceDetector, faceLandmark68Net, faceRecognitionNet) |
| **QR Scanning** | html5-qrcode 2.3 |
| **QR Generation** | qrcode.react 4.2 |
| **Camera** | react-webcam 7.2 |
| **Charts** | Recharts 3.7 |
| **Date Utilities** | date-fns 4.1 |
| **Notifications** | Sonner 2.0 |
| **Forms** | React Hook Form 7.71 |
| **Icons** | Lucide React, Material Icons |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Client (Browser)                       │
│  ┌────────────┐  ┌──────────┐  ┌───────────────────────┐ │
│  │  React SPA │  │ Zustand  │  │  TanStack React Query │ │
│  │  (Vite)    │  │  Store   │  │  (Cache + Fetch)      │ │
│  └─────┬──────┘  └────┬─────┘  └──────────┬────────────┘ │
│        │              │                    │              │
│  ┌─────┴──────────────┴────────────────────┴───────────┐  │
│  │              Service Layer (TypeScript)              │  │
│  │  authService · classService · attendanceService     │  │
│  │  userService                                        │  │
│  └─────────────────────┬───────────────────────────────┘  │
│                        │                                  │
│  ┌─────────────────────┴───────────────────────────────┐  │
│  │  face-api.js   │  html5-qrcode  │  Geolocation API │  │
│  │  (WebAssembly) │  (Camera)      │  (GPS)           │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────┘
                             │ HTTPS / WebSocket
┌────────────────────────────┴─────────────────────────────┐
│                  Firebase (Google Cloud)                   │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │  Firebase     │  │ Cloud      │  │  Firebase        │  │
│  │  Auth         │  │ Firestore  │  │  Analytics       │  │
│  └──────────────┘  └────────────┘  └──────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (or yarn / pnpm)
- A **Firebase project** with Authentication, Firestore, and Analytics enabled
- A modern browser with **camera** and **GPS** permissions

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/eduverify.git
cd eduverify

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Running the App

```bash
# Development server (default: http://localhost:5173)
npm run dev

# Type-check and build for production
npm run build

# Preview the production build
npm run preview
```

---

## Project Structure

```
EDUVERIFY/
├── public/
│   ├── icon.png                    # App logo
│   └── models/                     # face-api.js model weights
│       ├── tiny_face_detector_model-*
│       ├── face_landmark_68_model-*
│       └── face_recognition_model-*
├── src/
│   ├── App.tsx                     # Root component and route definitions
│   ├── main.tsx                    # Entry point
│   ├── index.css                   # Tailwind directives and global styles
│   ├── components/
│   │   ├── layout/                 # AuthLayout, DashboardLayout, Navbar, Sidebar,
│   │   │                           #   Header, Footer, FloatingMobileNav
│   │   ├── shared/                 # Reusable components
│   │   └── ui/                     # Design-system primitives
│   ├── config/
│   │   └── firebase.ts             # Firebase initialization
│   ├── features/
│   │   ├── attendance/             # Attendance-specific components, hooks, utils
│   │   ├── auth/
│   │   │   ├── components/         # LoginForm, AdminLoginForm, RoleGuard
│   │   │   └── hooks/
│   │   ├── classes/                # Class management components
│   │   ├── dashboard/
│   │   │   ├── admin/              # Admin pages (Dashboard, Users, Classes,
│   │   │   │                       #   Reports, Logs, Settings)
│   │   │   ├── lecturer/           # Lecturer pages (Dashboard, ClassDetails,
│   │   │   │                       #   CreateClass, EditClass, CreateSession,
│   │   │   │                       #   AttendanceTracking)
│   │   │   └── student/            # Student pages (Dashboard, MyClasses,
│   │   │       │                   #   ClassDetails, AttendanceHistory, Settings)
│   │   │       └── components/     # StudentActiveSessionScanner
│   │   ├── landing/                # Landing page components
│   │   └── onboarding/             # Student onboarding (face enrollment + profile)
│   ├── hooks/
│   │   └── useAuthListener.ts      # Firebase auth state observer
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   └── auth/                   # Login, Register, ForgotPassword, AdminLogin
│   ├── services/
│   │   ├── attendanceService.ts    # Session and record CRUD + real-time subscriptions
│   │   ├── authService.ts          # Auth operations (login, register, password reset)
│   │   ├── classService.ts         # Class CRUD + enrollment
│   │   └── userService.ts          # User CRUD + face descriptor storage
│   ├── store/
│   │   └── useAuthStore.ts         # Zustand auth store (persisted)
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   └── utils/
├── firestore.rules                 # Firestore security rules
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## User Roles and Workflows

### Student Workflow

1. **Register** with email and password (role set to `student`).
2. **Onboarding** — capture face via webcam (descriptor saved) then fill profile (matric number, department, level).
3. **Dashboard** — view enrolled classes, stats, upcoming sessions.
4. **Class Details** — if an active session exists, a scanner card appears:
   - Choose **Face ID** — webcam opens, face matched against stored descriptor (Euclidean distance < 0.6).
   - Choose **QR Code** — camera opens, scan the QR displayed by the lecturer.
5. **GPS check** — Haversine distance calculated; must be within `geofenceRadius` (default 100 m).
6. **Attendance marked** — record written to Firestore with timestamp, method, location, confidence score.

### Lecturer Workflow

1. **Login** and get redirected to lecturer dashboard.
2. **Create Class** — specify name, code, department, level, schedule.
3. **Enroll Students** — search by name or matric number, add to class.
4. **Start Session** — GPS captured; unique QR token generated; session marked `isActive`.
5. **Monitor** — live check-in feed shows students marking attendance in real time.
6. **Close Session** — session deactivated; all records persisted.
7. **Track** — view per-class attendance tables; export CSV.

### Admin Workflow

1. **Login** via `/admin/login` (auto-created admin account on first login with designated credentials).
2. **Dashboard** — overview stats (total users, classes, sessions, records).
3. **User Management** — CRUD for all users; create secondary accounts without logout.
4. **Class Management** — view and manage all institutional classes.
5. **Reports** — global attendance records with CSV export.
6. **Logs** — system event log viewer.
7. **Settings** — toggle strict face auth and geofencing.

---

## Verification Methods

### Facial Recognition

EduVerify uses **face-api.js** running entirely in the browser (no server-side processing):

| Model | Purpose |
|---|---|
| `TinyFaceDetector` | Lightweight CNN for face detection |
| `faceLandmark68Net` | 68-point facial landmark localization |
| `faceRecognitionNet` | 128-dimensional face descriptor extraction |

**Matching algorithm:** Euclidean distance between the live descriptor and the stored descriptor. Threshold: **< 0.6** for a match.

### QR Code Verification

- Lecturer's session generates a unique `qrCodeToken` (UUID v4).
- Token is displayed as a QR code SVG via `qrcode.react`.
- Student scans using `html5-qrcode` with automatic camera fallback (rear then front).
- Scanned token is validated against the active session's `qrCodeToken`.

### Geofencing

- **Haversine formula** calculates the great-circle distance between the student's GPS coordinates and the session's stored location.
- Configurable radius (default **100 metres**).
- Student must be within the geofence to mark attendance regardless of verification method.

---

## Firestore Database Schema

### `users` Collection

| Field | Type | Description |
|---|---|---|
| `uid` | `string` | Firebase Auth UID (document ID) |
| `email` | `string` | User email address |
| `name` | `string` | Full name |
| `role` | `string` | `admin` / `lecturer` / `student` |
| `status` | `string` | `active` / `inactive` |
| `photoURL` | `string?` | Profile photo URL |
| `enrolledFaceId` | `string?` | Face descriptor reference |
| `faceDescriptor` | `number[]?` | 128-float array from face-api |
| `profile` | `StudentProfile?` | Phone, DOB, gender, address, matric, department, level, group |
| `createdAt` | `Timestamp` | Account creation time |

### `classes` Collection

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Auto-generated document ID |
| `name` | `string` | Class name |
| `code` | `string` | Course code |
| `department` | `string` | Department name |
| `level` | `string` | Academic level |
| `scheduleDays` | `string[]` | e.g. `["Monday", "Wednesday"]` |
| `scheduleTime` | `string` | e.g. `"10:00 AM"` |
| `lecturerId` | `string` | Lecturer UID |
| `lecturerName` | `string` | Lecturer name |
| `studentIds` | `string[]` | Array of enrolled student UIDs |
| `status` | `string` | `Active` / `Archived` |
| `createdAt` | `Timestamp` | Creation time |

### `sessions` Collection

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Auto-generated document ID |
| `classId` | `string` | Associated class ID |
| `createdBy` | `string` | Lecturer UID |
| `startTime` | `Timestamp` | Session start |
| `endTime` | `Timestamp` | Session end |
| `isActive` | `boolean` | Whether session is ongoing |
| `qrCodeToken` | `string` | UUID v4 for QR verification |
| `location` | `GeoPoint` | `{ latitude, longitude }` |
| `geofenceRadius` | `number` | Radius in metres |

### `records` Collection

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Auto-generated document ID |
| `userId` | `string` | Student UID |
| `sessionId` | `string` | Associated session ID |
| `classId` | `string` | Denormalized class ID |
| `timestamp` | `Timestamp` | Check-in time |
| `status` | `string` | `present` / `absent` / `late` |
| `verificationMethod` | `string` | `face` / `qr` |
| `confidenceScore` | `number?` | Face match confidence |
| `location` | `GeoPoint` | Student GPS at check-in |

---

## Security

- **Firebase Authentication** — Email/password-based auth; admin accounts auto-created on first login.
- **Firestore Security Rules** — Fine-grained access control:
  - Helper functions: `isAuthenticated()`, `isOwner(userId)`, `isAdmin()`.
  - Users can only read/write their own documents (except admins).
  - Classes require authentication to read; only lecturers or admins can create.
  - Sessions and records enforce authenticated writes.
- **RoleGuard Component** — Client-side route protection by role; enforces onboarding completion for students.
- **Zustand Persist** — Auth state persisted to `localStorage` for session continuity.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Type-check (tsc) and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint with the flat config |

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`.
3. Commit your changes: `git commit -m "feat: add my feature"`.
4. Push to the branch: `git push origin feature/my-feature`.
5. Open a Pull Request.

Please follow the existing code style (TypeScript strict, Tailwind utility classes, functional components with hooks).

---

## License

This project is developed as a final-year Software Engineering project. All rights reserved.

---

<p align="center">
  <img src="public/icon.png" alt="EduVerify" width="40" />
  <br/>
  <sub>Built with care by the EduVerify Team</sub>
</p>