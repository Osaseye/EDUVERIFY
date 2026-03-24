export type UserRole = 'admin' | 'lecturer' | 'student';

export interface StudentProfile {
  phone: string;
  dob: string;
  gender: string;
  address: string;
  matricNumber: string;
  faculty?: string;
  department: string;
  level: string;
  group: string;
  yearOfAdmission?: string;
}

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  name: string;
  photoURL?: string;
  enrolledFaceId?: string; // Reference to face descriptor ID
  faceDescriptor?: number[]; // Array of 128 floats from face-api
  status?: 'active' | 'inactive';
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
  profile?: StudentProfile; // Populated during student onboarding
}

export interface AttendanceSession {
  id: string;
  classId: string;
  createdBy: string; // Lecturer userId
  startTime: any; // Firestore Timestamp or Date
  endTime: any; // Firestore Timestamp or Date
  isActive: boolean;
  geofenceRadius: number; // in meters
  location?: {
    latitude: number;
    longitude: number;
  };
  // QR details
  qrCodeToken: string;
  qrExpiryTime?: any;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  sessionId: string;
  classId?: string; // Denormalized for easy querying
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
  code: string;
  description?: string;
  department: string;
  level: string;
  location?: string;
  scheduleDays: string[];
  scheduleTime: string;
  lecturerId: string;
  lecturerName: string;
  studentIds: string[];
  status: 'Active' | 'Archived';
  createdAt?: any;
  updatedAt?: any;
  createdBy?: string;
}

export interface SystemLog {
  id: string;
  type: 'error' | 'warning' | 'info' | 'audit';
  action: string;
  details: string;
  timestamp: any;
  userId?: string;
}

export interface SystemSettings {
  strictFaceAuth: boolean;
  geofencing: boolean;
}
