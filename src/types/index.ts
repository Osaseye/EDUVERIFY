export type UserRole = 'admin' | 'lecturer' | 'student';

  export interface User {
    uid: string;
    email: string;
    role: UserRole;
    name: string;
    photoURL?: string;
    enrolledFaceId?: string; // Reference to face descriptor ID
  }

export interface AttendanceSession {
  id: string;
  classId: string;
  startTime: any; // Firestore Timestamp or Date
  endTime: any; // Firestore Timestamp or Date
  isActive: boolean;
  geofenceRadius: number; // in meters
  // QR details
  qrCodeToken: string;
  qrExpiryTime?: any;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: any; // Firestore Timestamp
  status: 'present' | 'absent' | 'late';
  verificationMethod: 'face' | 'qr';
  confidenceScore?: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface ClassGroup {
  id: string;
  name: string;
  lecturerId: string;
  studentIds: string[];
  schedule: string;
}
