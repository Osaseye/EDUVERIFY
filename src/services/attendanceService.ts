import { db } from '../config/firebase';
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, query, where, serverTimestamp, onSnapshot } from 'firebase/firestore';
import type { AttendanceSession, AttendanceRecord } from '../types';

const SESSIONS_COLLECTION = 'sessions';
const RECORDS_COLLECTION = 'records';

export const attendanceService = {
  createSession: async (sessionData: Omit<AttendanceSession, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
    try {
      const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), {
        ...sessionData,
        isActive: true, // Make sure new sessions are active
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  closeSession: async (sessionId: string) => {
    try {
      const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
      await updateDoc(sessionRef, {
        isActive: false,
        endTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error closing session:', error);
      throw error;
    }
  },

  getActiveSession: async (classId: string): Promise<AttendanceSession | null> => {
    try {
      const q = query(
        collection(db, SESSIONS_COLLECTION), 
        where('classId', '==', classId),
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString(),
        } as unknown as AttendanceSession;
      }
      return null;
    } catch (error) {
      console.error('Error getting active session:', error);
      throw error;
    }
  },

  subscribeToActiveSession: (classId: string, callback: (session: AttendanceSession | null) => void) => {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where('classId', '==', classId),
      where('isActive', '==', true)
    );

    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const data = docSnap.data();
        callback({
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString(),
        } as unknown as AttendanceSession);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error("Error subscribing to active session:", error);
      callback(null);
    });
  },

  getSessionById: async (sessionId: string): Promise<AttendanceSession | null> => {
    try {
      const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString(),
        } as unknown as AttendanceSession;
      }
      return null;
    } catch (error) {
      console.error('Error getting session:', error);
      throw error;
    }
  },

  getSessionsByClassId: async (classId: string): Promise<AttendanceSession[]> => {
    try {
      const q = query(collection(db, SESSIONS_COLLECTION), where('classId', '==', classId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString(),
        } as unknown as AttendanceSession;
      });
    } catch (error) {
      console.error('Error getting sessions:', error);
      throw error;
    }
  },

  markAttendance: async (recordData: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt' | 'timestamp'>) => {
    try {
      // Check if already checked in
      const q = query(
          collection(db, RECORDS_COLLECTION), 
          where('sessionId', '==', recordData.sessionId),
          where('userId', '==', recordData.userId)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
         throw new Error("You have already checked into this session.");
      }

      const docRef = await addDoc(collection(db, RECORDS_COLLECTION), {
        ...recordData,
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  },

  getRecordsBySessionId: async (sessionId: string): Promise<AttendanceRecord[]> => {
    try {
      const q = query(collection(db, RECORDS_COLLECTION), where('sessionId', '==', sessionId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString(),
        } as unknown as AttendanceRecord;
      });
    } catch (error) {
      console.error('Error getting records:', error);
      throw error;
    }
  },

  // Added for real-time live reporting in lecturer view
  subscribeToSessionRecords: (sessionId: string, callback: (records: AttendanceRecord[]) => void) => {
    const q = query(
        collection(db, RECORDS_COLLECTION), 
        where('sessionId', '==', sessionId)
        // Note: ordering requires composite indexing in firestore if filtering by sessionId, so omitted order for simplicity in MVP.
    );
    
    return onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
              id: docSnap.id,
              ...data,
          } as unknown as AttendanceRecord;
      });
      callback(records);
    }, (error) => {
      console.error("Error subscribing to records:", error);
    });
  },

  getRecordsByStudentId: async (studentId: string): Promise<AttendanceRecord[]> => {
    try {
      const q = query(collection(db, RECORDS_COLLECTION), where('userId', '==', studentId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString(),
        } as unknown as AttendanceRecord;
      });
    } catch (error) {
      console.error('Error getting student records:', error);
      throw error;
    }
  }
};
