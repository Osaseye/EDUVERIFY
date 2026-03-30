# CHAPTER THREE

## SYSTEM ANALYSIS AND DESIGN

---

### 3.1 Introduction

This chapter presents a comprehensive analysis and design of **EduVerify**, a multi-factor authentication attendance management system for higher institutions. The chapter examines the shortcomings of the existing manual attendance system, identifies the functional and non-functional requirements for the proposed system, and presents a detailed architectural and database design using standard software engineering modelling techniques. The system is designed to automate attendance verification through facial recognition, QR code scanning, and GPS geofencing, thereby eliminating impersonation, proxy attendance, and data manipulation inherent in traditional methods.

---

### 3.2 Analysis of the Existing System

#### 3.2.1 Description of the Existing System

The existing attendance management process in most Nigerian universities is predominantly paper-based. Lecturers pass around a physical attendance sheet at the beginning or during a lecture, and students sign against their names. In some cases, a roll call is conducted verbally. A few institutions have adopted rudimentary digital methods such as Google Forms or spreadsheets, but these still lack verification mechanisms.

#### 3.2.2 Problems of the Existing System

The following problems have been identified in the current system:

1. **Proxy Attendance (Impersonation):** Students can sign on behalf of absent colleagues, inflating attendance records and undermining academic integrity.
2. **Data Inaccuracy:** Manual entry is prone to errors such as duplicate entries, illegible handwriting, misspelled names, and missing records.
3. **Time Consumption:** Passing attendance sheets or conducting roll calls consumes significant lecture time, particularly in large classes.
4. **Lack of Real-time Monitoring:** Lecturers have no mechanism to monitor attendance in real time or receive live check-in updates.
5. **Difficult Record Retrieval:** Paper-based records are difficult to aggregate, analyse, or export for administrative purposes.
6. **No Location Verification:** There is no means to verify that a student is physically present in the lecture venue when marking attendance.
7. **No Centralised Reporting:** Administrators lack a unified platform to view attendance data across departments and courses.

#### 3.2.3 Justification for the Proposed System

The proposed system, EduVerify, addresses every shortcoming identified above through:

- **Biometric verification** (facial recognition) to eliminate proxy attendance.
- **QR code scanning** as a secondary verification method for speed and convenience.
- **GPS geofencing** to ensure physical presence at the lecture venue.
- **Real-time Firestore subscriptions** for instant attendance monitoring.
- **Automated data storage and CSV export** for seamless record-keeping and reporting.
- **Role-based dashboards** for students, lecturers, and administrators.

---

### 3.3 Requirements Analysis

#### 3.3.1 Functional Requirements

The following functional requirements have been identified through analysis:

| ID | Requirement | Description |
|---|---|---|
| FR-01 | User Registration | The system shall allow students and lecturers to register with email and password. |
| FR-02 | Role-based Authentication | The system shall authenticate users and direct them to role-specific dashboards (student, lecturer, admin). |
| FR-03 | Student Onboarding | The system shall require first-time students to capture a face photograph (for descriptor extraction) and complete a profile form (matric number, department, level, etc.). |
| FR-04 | Face Descriptor Storage | The system shall extract a 128-float face descriptor using face-api.js and store it in the Firestore database. |
| FR-05 | Class Management | Lecturers shall be able to create, edit, and archive class groups with course code, department, level, and schedule. |
| FR-06 | Student Enrollment | Lecturers shall be able to search for and enrol students into their classes by name or matriculation number. |
| FR-07 | Attendance Session Creation | Lecturers shall be able to start an attendance session for a class, during which the system captures the lecturer's GPS location and generates a unique QR token. |
| FR-08 | Facial Recognition Verification | Students shall be able to mark attendance by presenting their face to the webcam; the system shall compare the live descriptor against the stored descriptor using Euclidean distance (threshold < 0.6). |
| FR-09 | QR Code Verification | Students shall be able to mark attendance by scanning the QR code displayed by the lecturer using their device camera. |
| FR-10 | GPS Geofencing | The system shall calculate the distance between the student's location and the session location using the Haversine formula and reject check-ins outside the configured radius (default 100 m). |
| FR-11 | Duplicate Prevention | The system shall prevent a student from marking attendance more than once per session. |
| FR-12 | Real-time Check-in Feed | Lecturers shall see a live feed of students checking in during an active session. |
| FR-13 | Session Closure | Lecturers shall be able to close an active session, after which no further check-ins are accepted. |
| FR-14 | Attendance History | Students shall be able to view their attendance records per class, including timestamps and verification method. |
| FR-15 | CSV Export | Lecturers and administrators shall be able to export attendance records as CSV files. |
| FR-16 | User Management (Admin) | Administrators shall be able to create, view, and manage user accounts across all roles. |
| FR-17 | Secondary Account Creation | Administrators shall be able to create new user accounts without being logged out of their own session. |
| FR-18 | System Settings | Administrators shall be able to toggle strict face authentication and geofencing enforcement. |
| FR-19 | System Logs | The system shall maintain logs of system events (errors, warnings, informational, audits). |
| FR-20 | Password Reset | Users shall be able to request a password reset via email. |

#### 3.3.2 Non-Functional Requirements

| ID | Requirement | Description |
|---|---|---|
| NFR-01 | Performance | Face detection and descriptor comparison shall complete within 5 seconds on modern devices. |
| NFR-02 | Scalability | The system shall leverage Firebase's cloud infrastructure to handle concurrent users without server provisioning. |
| NFR-03 | Usability | The interface shall be responsive, supporting both desktop and mobile devices with intuitive navigation. |
| NFR-04 | Security | All data shall be protected by Firebase Authentication, Firestore Security Rules, and client-side role guards. |
| NFR-05 | Availability | The system shall be available 24/7, subject to Firebase's 99.95% uptime SLA. |
| NFR-06 | Portability | The system shall run on any modern web browser (Chrome, Firefox, Safari, Edge) without installation. |
| NFR-07 | Privacy | Face descriptors shall be stored as numeric arrays (not images); no raw photographs are persisted beyond the onboarding session. |
| NFR-08 | Accuracy | Facial recognition shall achieve a false acceptance rate below 5% with the 0.6 Euclidean distance threshold. |
| NFR-09 | Maintainability | The codebase shall follow modular, feature-based architecture with TypeScript for type safety. |
| NFR-10 | Real-time Responsiveness | Attendance updates shall propagate to all subscribed clients within 2 seconds via Firestore real-time listeners. |

---

### 3.4 System Architecture

#### 3.4.1 Architectural Overview

EduVerify adopts a **client-server architecture** with Firebase as the Backend-as-a-Service (BaaS). The client is a **Single Page Application (SPA)** built with React and TypeScript, compiled by Vite, and served as static files. All business logic executes in the browser, communicating with Firebase services over HTTPS and WebSocket connections.

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│                                                              │
│   React Components (Pages, Layouts, Forms)                   │
│   Tailwind CSS Styling · Responsive Design                   │
│   face-api.js (Face Detection UI) · html5-qrcode (Camera)   │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────┐
│                   APPLICATION LOGIC LAYER                    │
│                                                              │
│   Service Modules:                                           │
│   ├── authService.ts    (login, register, logout, reset)     │
│   ├── classService.ts   (CRUD classes, enrollment)           │
│   ├── attendanceService.ts (sessions, records, subscriptions)│
│   └── userService.ts    (profiles, face descriptors)         │
│                                                              │
│   State Management:                                          │
│   ├── Zustand (useAuthStore - persisted auth state)          │
│   └── TanStack React Query (server state cache)             │
│                                                              │
│   Algorithms:                                                │
│   ├── Euclidean Distance (face matching)                     │
│   └── Haversine Formula (geofencing)                         │
└────────────────────────────┬────────────────────────────────┘
                             │ Firebase SDK (HTTPS / WebSocket)
┌────────────────────────────┴────────────────────────────────┐
│                       DATA LAYER                             │
│                   (Firebase Cloud Services)                   │
│                                                              │
│   ├── Firebase Authentication (email/password)               │
│   ├── Cloud Firestore (NoSQL document database)              │
│   │    Collections: users, classes, sessions, records        │
│   └── Firebase Analytics (usage tracking)                    │
└─────────────────────────────────────────────────────────────┘
```

#### 3.4.2 Justification for the Architecture

| Decision | Rationale |
|---|---|
| **SPA (React)** | Provides a seamless, app-like user experience without full page reloads; supports component reusability and modular development. |
| **Firebase BaaS** | Eliminates the need for custom server infrastructure; provides real-time database, authentication, and hosting out of the box. |
| **Client-side Face Recognition** | Avoids transmitting biometric images over the network; processing occurs entirely in the browser using face-api.js and WebAssembly. |
| **TypeScript** | Provides compile-time type checking, reducing runtime errors and improving developer productivity. |
| **Zustand + React Query** | Separates client state (auth) from server state (Firestore data) for clean, predictable state management. |

---

### 3.5 System Modelling

#### 3.5.1 Use Case Diagram

The system identifies three primary actors:

**Actors:**
- **Student** — Registers, completes onboarding, marks attendance, views history.
- **Lecturer** — Manages classes, starts/closes sessions, monitors attendance, exports reports.
- **Administrator** — Manages users, views global reports, configures system settings, views logs.

**Use Cases:**

```
                        ┌─────────────────────────────────────┐
                        │           EduVerify System           │
                        │                                     │
   ┌─────────┐          │  ┌──────────────────────────────┐   │
   │ Student │─────────>│  │ UC-01: Register Account       │   │
   │         │─────────>│  │ UC-02: Complete Onboarding    │   │
   │         │─────────>│  │ UC-03: View Dashboard         │   │
   │         │─────────>│  │ UC-04: View Enrolled Classes  │   │
   │         │─────────>│  │ UC-05: Mark Attendance (Face) │   │
   │         │─────────>│  │ UC-06: Mark Attendance (QR)   │   │
   │         │─────────>│  │ UC-07: View Attendance History│   │
   │         │─────────>│  │ UC-08: Update Settings        │   │
   └─────────┘          │  └──────────────────────────────┘   │
                        │                                     │
   ┌──────────┐         │  ┌──────────────────────────────┐   │
   │ Lecturer │────────>│  │ UC-09: Create/Edit Class      │   │
   │          │────────>│  │ UC-10: Enrol Students         │   │
   │          │────────>│  │ UC-11: Start Attendance Session│  │
   │          │────────>│  │ UC-12: Monitor Live Check-ins │   │
   │          │────────>│  │ UC-13: Close Session          │   │
   │          │────────>│  │ UC-14: View Attendance Tracking│  │
   │          │────────>│  │ UC-15: Export CSV Report       │   │
   └──────────┘         │  └──────────────────────────────┘   │
                        │                                     │
   ┌───────────┐        │  ┌──────────────────────────────┐   │
   │   Admin   │───────>│  │ UC-16: Manage Users (CRUD)    │   │
   │           │───────>│  │ UC-17: View All Classes       │   │
   │           │───────>│  │ UC-18: View Attendance Reports│   │
   │           │───────>│  │ UC-19: Export Global CSV      │   │
   │           │───────>│  │ UC-20: View System Logs       │   │
   │           │───────>│  │ UC-21: Configure Settings     │   │
   └───────────┘        │  └──────────────────────────────┘   │
                        └─────────────────────────────────────┘
```

#### 3.5.2 Use Case Descriptions

**UC-05: Mark Attendance via Facial Recognition**

| Element | Description |
|---|---|
| **Actor** | Student |
| **Preconditions** | Student is logged in, onboarding is complete (face descriptor stored), an active session exists for the student's class. |
| **Main Flow** | 1. Student navigates to class details page. 2. System displays "Active Session" card. 3. Student selects "Face ID" verification. 4. System activates webcam and loads face-api.js models. 5. System detects face and extracts 128-float descriptor. 6. System retrieves stored descriptor from Firestore. 7. System computes Euclidean distance between descriptors. 8. If distance < 0.6 and GPS within geofence, system creates attendance record. 9. System displays success notification. |
| **Alternative Flow** | 7a. If distance >= 0.6, system displays "Face not recognised" error. 8a. If GPS outside geofence, system displays "You are not within the class location" error. |
| **Postconditions** | Attendance record is persisted in the `records` collection with `verificationMethod: 'face'`, timestamp, location, and confidence score. |

**UC-11: Start Attendance Session**

| Element | Description |
|---|---|
| **Actor** | Lecturer |
| **Preconditions** | Lecturer is logged in, class exists with at least one enrolled student. |
| **Main Flow** | 1. Lecturer navigates to class details and clicks "Start Session". 2. System requests GPS permission. 3. System captures lecturer's latitude and longitude. 4. System generates a unique UUID v4 QR token. 5. System creates a session document in Firestore with `isActive: true`, location, geofenceRadius (100 m), and QR token. 6. System displays QR code for students to scan. |
| **Alternative Flow** | 2a. If class has zero enrolled students, system displays error and blocks session creation. 3a. If GPS permission denied, system creates session without geofencing. |
| **Postconditions** | Session document exists in `sessions` collection; students enrolled in the class can see the active session. |

#### 3.5.3 Class Diagram

The following class diagram describes the core data entities and their relationships within EduVerify:

```
┌──────────────────────────────┐       ┌─────────────────────────────────┐
│          User                │       │         ClassGroup              │
├──────────────────────────────┤       ├─────────────────────────────────┤
│ - uid: string                │       │ - id: string                    │
│ - email: string              │       │ - name: string                  │
│ - name: string               │       │ - code: string                  │
│ - role: UserRole             │       │ - description: string           │
│ - status: string             │       │ - department: string            │
│ - photoURL: string           │       │ - level: string                 │
│ - enrolledFaceId: string     │       │ - location: string              │
│ - faceDescriptor: number[]   │       │ - scheduleDays: string[]        │
│ - profile: StudentProfile    │       │ - scheduleTime: string          │
│ - createdAt: Timestamp       │       │ - lecturerId: string            │
├──────────────────────────────┤       │ - lecturerName: string          │
│ + login(email, pwd): void    │       │ - studentIds: string[]          │
│ + register(email, pwd): void │       │ - status: string                │
│ + saveFaceDescriptor(): void │       │ - createdAt: Timestamp          │
│ + updateProfile(): void      │       ├─────────────────────────────────┤
└──────────┬───────────────────┘       │ + create(): void                │
           │ 1                         │ + update(): void                │
           │                           │ + enrolStudent(uid): void       │
           │ *                         │ + getByLecturer(id): ClassGroup[]│
┌──────────┴───────────────────┐       └────────────┬────────────────────┘
│      StudentProfile          │                    │ 1
├──────────────────────────────┤                    │
│ - phone: string              │                    │ *
│ - dob: string                │       ┌────────────┴────────────────────┐
│ - gender: string             │       │      AttendanceSession          │
│ - address: string            │       ├─────────────────────────────────┤
│ - matricNumber: string       │       │ - id: string                    │
│ - department: string         │       │ - classId: string               │
│ - level: string              │       │ - createdBy: string             │
│ - group: string              │       │ - startTime: Timestamp          │
│ - faculty: string            │       │ - endTime: Timestamp            │
│ - yearOfAdmission: string    │       │ - isActive: boolean             │
└──────────────────────────────┘       │ - qrCodeToken: string           │
                                       │ - location: {lat, lng}          │
                                       │ - geofenceRadius: number        │
                                       ├─────────────────────────────────┤
                                       │ + create(): void                │
                                       │ + close(): void                 │
                                       │ + getActive(classId): Session   │
                                       └────────────┬────────────────────┘
                                                    │ 1
                                                    │
                                                    │ *
                                       ┌────────────┴────────────────────┐
                                       │      AttendanceRecord           │
                                       ├─────────────────────────────────┤
                                       │ - id: string                    │
                                       │ - userId: string                │
                                       │ - sessionId: string             │
                                       │ - classId: string               │
                                       │ - timestamp: Timestamp          │
                                       │ - status: string                │
                                       │ - verificationMethod: string    │
                                       │ - confidenceScore: number       │
                                       │ - location: {lat, lng}          │
                                       ├─────────────────────────────────┤
                                       │ + markAttendance(): void        │
                                       │ + getByStudent(uid): Record[]   │
                                       │ + getBySession(sid): Record[]   │
                                       └─────────────────────────────────┘
```

**Relationships:**
- A **User** (lecturer) creates many **ClassGroups** (1:N).
- A **User** (student) is enrolled in many **ClassGroups** (M:N via `studentIds` array).
- A **ClassGroup** has many **AttendanceSessions** (1:N).
- An **AttendanceSession** has many **AttendanceRecords** (1:N).
- A **User** (student) has many **AttendanceRecords** (1:N).

#### 3.5.4 Sequence Diagram — Facial Recognition Attendance

```
Student          Browser/React         face-api.js         Firestore          Geolocation API
  │                   │                    │                    │                    │
  │  Click "Face ID"  │                    │                    │                    │
  │──────────────────>│                    │                    │                    │
  │                   │  Load models       │                    │                    │
  │                   │───────────────────>│                    │                    │
  │                   │  Models loaded     │                    │                    │
  │                   │<───────────────────│                    │                    │
  │                   │  Start webcam      │                    │                    │
  │                   │───────────────────>│                    │                    │
  │                   │  Detect face       │                    │                    │
  │                   │───────────────────>│                    │                    │
  │                   │  Return descriptor │                    │                    │
  │                   │  (128 floats)      │                    │                    │
  │                   │<───────────────────│                    │                    │
  │                   │                    │                    │                    │
  │                   │  Get stored descriptor                  │                    │
  │                   │────────────────────────────────────────>│                    │
  │                   │  Return faceDescriptor[]                │                    │
  │                   │<────────────────────────────────────────│                    │
  │                   │                    │                    │                    │
  │                   │  Compute Euclidean Distance             │                    │
  │                   │  d = sqrt(sum((a[i]-b[i])^2))          │                    │
  │                   │                    │                    │                    │
  │                   │  [d < 0.6: MATCH]  │                    │                    │
  │                   │                    │                    │                    │
  │                   │  Request GPS position                   │                    │
  │                   │─────────────────────────────────────────────────────────────>│
  │                   │  Return {latitude, longitude}           │                    │
  │                   │<─────────────────────────────────────────────────────────────│
  │                   │                    │                    │                    │
  │                   │  Haversine distance check               │                    │
  │                   │  [distance <= 100m: PASS]               │                    │
  │                   │                    │                    │                    │
  │                   │  Create attendance record               │                    │
  │                   │────────────────────────────────────────>│                    │
  │                   │  Record confirmed                       │                    │
  │                   │<────────────────────────────────────────│                    │
  │                   │                    │                    │                    │
  │  Success toast    │                    │                    │                    │
  │<──────────────────│                    │                    │                    │
```

#### 3.5.5 Sequence Diagram — QR Code Attendance

```
Student          Browser/React        html5-qrcode         Firestore         Geolocation API
  │                   │                    │                    │                    │
  │  Click "QR Scan"  │                    │                    │                    │
  │──────────────────>│                    │                    │                    │
  │                   │  Request GPS       │                    │                    │
  │                   │─────────────────────────────────────────────────────────────>│
  │                   │  Return coords     │                    │                    │
  │                   │<─────────────────────────────────────────────────────────────│
  │                   │                    │                    │                    │
  │                   │  Haversine check   │                    │                    │
  │                   │  [distance <= 100m]│                    │                    │
  │                   │                    │                    │                    │
  │                   │  Start camera      │                    │                    │
  │                   │───────────────────>│                    │                    │
  │                   │                    │                    │                    │
  │  Scan QR code     │                    │                    │                    │
  │──────────────────>│  Decoded token     │                    │                    │
  │                   │<───────────────────│                    │                    │
  │                   │                    │                    │                    │
  │                   │  Validate token == session.qrCodeToken  │                    │
  │                   │────────────────────────────────────────>│                    │
  │                   │  Token valid                            │                    │
  │                   │<────────────────────────────────────────│                    │
  │                   │                    │                    │                    │
  │                   │  Check duplicate                        │                    │
  │                   │────────────────────────────────────────>│                    │
  │                   │  No existing record                     │                    │
  │                   │<────────────────────────────────────────│                    │
  │                   │                    │                    │                    │
  │                   │  Create record (verificationMethod: qr) │                    │
  │                   │────────────────────────────────────────>│                    │
  │                   │  Confirmed                              │                    │
  │                   │<────────────────────────────────────────│                    │
  │  Success toast    │                    │                    │                    │
  │<──────────────────│                    │                    │                    │
```

#### 3.5.6 Activity Diagram — Student Attendance Workflow

```
                    ┌─────────────┐
                    │   START     │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │ Student logs│
                    │ into system │
                    └──────┬──────┘
                           │
                    ┌──────┴──────────┐
                    │ Navigate to     │
                    │ class details   │
                    └──────┬──────────┘
                           │
                   ┌───────┴───────┐
                   │ Active session │
                   │   exists?      │
                   └───┬───────┬───┘
                   No  │       │ Yes
                       │       │
               ┌───────┴──┐  ┌─┴──────────────┐
               │ Show "No │  │ Display scanner │
               │ active   │  │ options         │
               │ session" │  └──┬──────────┬───┘
               └──────────┘     │          │
                          Face ID│      QR │Code
                                │          │
                    ┌───────────┴┐    ┌────┴────────┐
                    │ Open webcam│    │ Open camera  │
                    │ + detect   │    │ + scan QR    │
                    │ face       │    │ code         │
                    └─────┬──────┘    └──────┬───────┘
                          │                  │
                   ┌──────┴──────┐    ┌──────┴──────┐
                   │Face matched?│    │Token valid?  │
                   └──┬─────┬───┘    └──┬──────┬────┘
                   No │     │Yes     No │      │Yes
                      │     │          │       │
              ┌───────┴┐    │   ┌──────┴──┐    │
              │ Error: │    │   │ Error:  │    │
              │ "Face  │    │   │ "Invalid│    │
              │ not    │    │   │  QR"    │    │
              │ matched│    │   └─────────┘    │
              └────────┘    │                  │
                            └────────┬─────────┘
                                     │
                            ┌────────┴────────┐
                            │ Check GPS       │
                            │ geofence        │
                            └───┬─────────┬───┘
                            Out │         │ Within
                                │         │
                        ┌───────┴──┐ ┌────┴──────────┐
                        │ Error:   │ │ Mark          │
                        │ "Outside │ │ attendance    │
                        │  range"  │ │ in Firestore  │
                        └──────────┘ └───────┬───────┘
                                             │
                                    ┌────────┴────────┐
                                    │ Show success    │
                                    │ notification    │
                                    └────────┬────────┘
                                             │
                                      ┌──────┴──────┐
                                      │    END      │
                                      └─────────────┘
```

---

### 3.6 Database Design

#### 3.6.1 Database Technology

EduVerify uses **Cloud Firestore**, a NoSQL document-oriented database provided by Google Firebase. Firestore organises data as **collections** of **documents**, where each document is a JSON-like object containing fields of various types. This schema-less design offers flexibility, real-time synchronisation, and automatic scaling.

#### 3.6.2 Collection Schema

The database comprises four primary collections:

**Table 3.1: `users` Collection Schema**

| Field | Data Type | Constraint | Description |
|---|---|---|---|
| uid | String | Primary Key (Document ID) | Matches Firebase Auth UID |
| email | String | Required, Unique | User's email address |
| name | String | Required | Full name |
| role | String | Required; enum: admin, lecturer, student | User role |
| status | String | Default: "active" | Account status |
| photoURL | String | Optional | Profile photo URL |
| enrolledFaceId | String | Optional | Reference to face data |
| faceDescriptor | Array of Number | Optional; 128 elements | Face embedding vector |
| profile | Map (StudentProfile) | Optional | Student demographic data |
| createdAt | Timestamp | Auto-generated | Account creation time |
| updatedAt | Timestamp | Auto-generated | Last update time |

**Table 3.2: `classes` Collection Schema**

| Field | Data Type | Constraint | Description |
|---|---|---|---|
| id | String | Primary Key (Document ID) | Auto-generated |
| name | String | Required | Course name |
| code | String | Required | Course code (e.g., CSC 401) |
| description | String | Optional | Course description |
| department | String | Required | Department name |
| level | String | Required | Academic level (e.g., 400) |
| location | String | Optional | Venue description |
| scheduleDays | Array of String | Required | e.g., ["Monday", "Wednesday"] |
| scheduleTime | String | Required | e.g., "10:00 AM" |
| lecturerId | String | Required (FK to users) | Creator lecturer's UID |
| lecturerName | String | Required | Denormalized lecturer name |
| studentIds | Array of String | Default: [] | Enrolled student UIDs |
| status | String | Default: "Active" | Active or Archived |
| createdAt | Timestamp | Auto-generated | Creation time |
| createdBy | String | Optional | Creator UID |

**Table 3.3: `sessions` Collection Schema**

| Field | Data Type | Constraint | Description |
|---|---|---|---|
| id | String | Primary Key (Document ID) | Auto-generated |
| classId | String | Required (FK to classes) | Associated class |
| createdBy | String | Required (FK to users) | Lecturer who started session |
| startTime | Timestamp | Required | Session start time |
| endTime | Timestamp | Nullable | Session end time (set on close) |
| isActive | Boolean | Default: true | Whether session is ongoing |
| qrCodeToken | String | Required, Unique per session | UUID v4 for QR verification |
| qrExpiryTime | Timestamp | Optional | QR token expiry |
| location | Map {latitude: Number, longitude: Number} | Optional | Lecturer's GPS coordinates |
| geofenceRadius | Number | Default: 100 | Allowed radius in metres |

**Table 3.4: `records` Collection Schema**

| Field | Data Type | Constraint | Description |
|---|---|---|---|
| id | String | Primary Key (Document ID) | Auto-generated |
| userId | String | Required (FK to users) | Student who checked in |
| sessionId | String | Required (FK to sessions) | Associated session |
| classId | String | Required (FK to classes) | Denormalized for querying |
| timestamp | Timestamp | Required | Check-in time |
| status | String | Required; enum: present, absent, late | Attendance status |
| verificationMethod | String | Required; enum: face, qr | Method used |
| confidenceScore | Number | Optional | Face match confidence (1 - distance) |
| location | Map {latitude: Number, longitude: Number} | Required | Student's GPS at check-in |

#### 3.6.3 Entity Relationship Diagram (Textual Representation)

```
[users] 1 ──────────── * [classes]        (lecturerId -> users.uid)
[users] * ──────────── * [classes]        (studentIds contains users.uid)
[classes] 1 ─────────── * [sessions]      (classId -> classes.id)
[sessions] 1 ────────── * [records]       (sessionId -> sessions.id)
[users] 1 ──────────── * [records]        (userId -> users.uid)
```

#### 3.6.4 Indexing Strategy

Firestore automatically indexes all fields. The following composite indexes are used for efficient queries:

| Collection | Fields | Purpose |
|---|---|---|
| `sessions` | `classId` ASC, `isActive` ASC | Find active session for a class |
| `records` | `sessionId` ASC, `userId` ASC | Duplicate check before marking attendance |
| `records` | `userId` ASC, `timestamp` DESC | Student attendance history |
| `records` | `timestamp` DESC | Admin global reports (ordered by recency) |
| `classes` | `studentIds` ARRAY_CONTAINS | Find classes a student is enrolled in |
| `classes` | `lecturerId` ASC | Find classes owned by a lecturer |

---

### 3.7 Algorithm Design

#### 3.7.1 Facial Recognition Matching Algorithm

The face matching process uses the **Euclidean distance** metric to compare two 128-dimensional face descriptor vectors.

**Algorithm: FaceMatch**

```
INPUT:  liveDescriptor[128], storedDescriptor[128], threshold = 0.6
OUTPUT: Boolean (matched / not matched)

1.  SET sumOfSquares = 0
2.  FOR i = 0 TO 127 DO
3.      SET diff = liveDescriptor[i] - storedDescriptor[i]
4.      SET sumOfSquares = sumOfSquares + (diff * diff)
5.  END FOR
6.  SET distance = SQRT(sumOfSquares)
7.  IF distance < threshold THEN
8.      RETURN true   // Face matched
9.  ELSE
10.     RETURN false  // Face not recognised
11. END IF
```

**Complexity:** O(n) where n = 128 (constant), so effectively O(1).

#### 3.7.2 Haversine Geofencing Algorithm

The **Haversine formula** calculates the great-circle distance between two points on a sphere given their latitudes and longitudes.

**Algorithm: HaversineDistance**

```
INPUT:  lat1, lon1 (student position)
        lat2, lon2 (session position)
        radius = 100 (allowed distance in metres)
OUTPUT: Boolean (within geofence / outside geofence)

CONSTANT: R = 6371000  // Earth's radius in metres

1.  SET dLat = toRadians(lat2 - lat1)
2.  SET dLon = toRadians(lon2 - lon1)
3.  SET a = sin(dLat/2)^2 + cos(toRadians(lat1)) * cos(toRadians(lat2)) * sin(dLon/2)^2
4.  SET c = 2 * atan2(sqrt(a), sqrt(1 - a))
5.  SET distance = R * c
6.  IF distance <= radius THEN
7.      RETURN true   // Within geofence
8.  ELSE
9.      RETURN false  // Outside geofence
10. END IF
```

**Complexity:** O(1) — constant-time trigonometric computation.

#### 3.7.3 Duplicate Attendance Prevention Algorithm

```
INPUT:  userId, sessionId
OUTPUT: Boolean (can mark / already marked)

1.  QUERY records WHERE sessionId == sessionId AND userId == userId
2.  IF query returns any documents THEN
3.      RETURN false  // Already marked, reject
4.  ELSE
5.      RETURN true   // No existing record, allow check-in
6.  END IF
```

#### 3.7.4 Authentication and Role Routing Algorithm

```
INPUT:  Firebase Auth state change event
OUTPUT: Redirect to appropriate dashboard or login page

1.  ON authStateChanged(firebaseUser):
2.      IF firebaseUser IS NULL THEN
3.          SET authStore.user = null
4.          REDIRECT to /login
5.      ELSE
6.          QUERY users/{firebaseUser.uid} from Firestore
7.          SET authStore.user = userDocument
8.          SWITCH user.role:
9.              CASE 'student':
10.                 IF user.enrolledFaceId IS NULL OR user.profile IS NULL THEN
11.                     REDIRECT to /student/onboarding
12.                 ELSE
13.                     REDIRECT to /student/dashboard
14.                 END IF
15.             CASE 'lecturer':
16.                 REDIRECT to /lecturer/dashboard
17.             CASE 'admin':
18.                 REDIRECT to /admin/dashboard
19.         END SWITCH
20.     END IF
```

---

### 3.8 Security Design

#### 3.8.1 Authentication Layer

EduVerify uses **Firebase Authentication** with email and password credentials. Upon successful authentication, Firebase issues a JSON Web Token (JWT) that is automatically included in all subsequent Firestore requests for server-side verification.

#### 3.8.2 Firestore Security Rules

The security rules implement three helper functions:

```javascript
function isAuthenticated() {
    return request.auth != null;
}

function isOwner(userId) {
    return request.auth.uid == userId;
}

function isAdmin() {
    return request.auth != null &&
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

**Access Control Matrix:**

| Collection | Read | Write | Update | Delete |
|---|---|---|---|---|
| `users` | Owner or Admin | Auth required | Owner or Admin | Admin only |
| `classes` | Authenticated | Authenticated | Authenticated | Admin only |
| `sessions` | Authenticated | Authenticated | Authenticated | Admin only |
| `records` | Authenticated | Authenticated | Authenticated | Admin only |

#### 3.8.3 Client-Side Route Protection

The `RoleGuard` component wraps protected routes and performs three checks:

1. **Authentication check:** If no authenticated user, redirect to `/login`.
2. **Role check:** If user's role is not in `allowedRoles`, redirect to the appropriate dashboard for their actual role.
3. **Onboarding check (students only):** If `enrolledFaceId` or `profile` is missing, redirect to `/student/onboarding`.

#### 3.8.4 Biometric Data Privacy

Face descriptors are stored as **numeric arrays** (128 floating-point numbers), not as images. The original photograph captured during onboarding is processed in-browser by face-api.js and is never uploaded or persisted. This approach minimises privacy risk while maintaining verification capability.

---

### 3.9 Development Tools and Environment

**Table 3.5: Development Tools**

| Tool | Version | Purpose |
|---|---|---|
| Visual Studio Code | Latest | Integrated Development Environment (IDE) |
| Node.js | >= 18.x | JavaScript runtime for build tools |
| npm | >= 9.x | Package manager |
| Vite | 7.3.1 | Build tool and development server with HMR |
| TypeScript | 5.9.3 | Statically typed JavaScript superset |
| React | 19.2.0 | UI component library |
| Firebase Console | Web | Backend service management |
| Git | Latest | Version control |
| Chrome DevTools | Latest | Debugging and performance profiling |
| ESLint | 9.39.1 | Code linting and style enforcement |
| PostCSS | 8.5.6 | CSS transformation pipeline (with Tailwind) |

**Table 3.6: Key Libraries and Frameworks**

| Library | Version | Role in System |
|---|---|---|
| firebase | 12.10.0 | Authentication, Firestore database, Analytics |
| face-api.js | 0.22.2 | Client-side facial recognition |
| @vladmandic/face-api | 1.7.15 | Enhanced face-api.js fork (model loading) |
| html5-qrcode | 2.3.8 | QR code scanning from device camera |
| qrcode.react | 4.2.0 | QR code SVG generation |
| react-webcam | 7.2.0 | Webcam video stream component |
| zustand | 5.0.11 | Lightweight state management |
| @tanstack/react-query | 5.90.21 | Server state management and caching |
| react-router-dom | 7.13.1 | Client-side routing |
| tailwindcss | 3.4.19 | Utility-first CSS framework |
| recharts | 3.7.0 | Data visualisation (charts) |
| date-fns | 4.1.0 | Date formatting and manipulation |
| sonner | 2.0.7 | Toast notifications |
| react-hook-form | 7.71.2 | Form state management and validation |
| lucide-react | 0.575.0 | Icon library |
| uuid | 13.0.0 | UUID generation for QR tokens |

---

### 3.10 Summary

This chapter has presented a thorough analysis of the existing manual attendance system and identified its key shortcomings, including proxy attendance, data inaccuracy, and lack of location verification. The proposed EduVerify system was then analysed in terms of functional and non-functional requirements, resulting in twenty functional requirements and ten non-functional requirements.

The system architecture follows a client-server model with React as the frontend SPA and Firebase as the Backend-as-a-Service, eliminating the need for custom server infrastructure. The design was illustrated through use case diagrams, class diagrams, sequence diagrams, and activity diagrams, all conforming to standard UML conventions.

The database design uses four Firestore collections — `users`, `classes`, `sessions`, and `records` — with clearly defined schemas, data types, and relationships. Key algorithms were specified in pseudocode, including the Euclidean distance face matching algorithm, the Haversine geofencing formula, and the duplicate prevention mechanism.

Finally, the security architecture was detailed across three layers: Firebase Authentication, Firestore Security Rules, and client-side RoleGuard route protection, ensuring comprehensive access control and biometric data privacy.
