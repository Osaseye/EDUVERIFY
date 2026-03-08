import { db } from '../config/firebase';
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, query, where, serverTimestamp, orderBy } from 'firebase/firestore';
import type { ClassGroup } from '../types';

const CLASSES_COLLECTION = 'classes';

export const classService = {
  // Create a new class
  createClass: async (classData: Omit<ClassGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, CLASSES_COLLECTION), {
        ...classData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  },

  // Get class by ID
  getClassById: async (classId: string): Promise<ClassGroup | null> => {
    try {
      const docRef = doc(db, CLASSES_COLLECTION, classId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString(),
        } as unknown as ClassGroup;
      }
      return null;
    } catch (error) {
      console.error('Error getting class:', error);
      throw error;
    }
  },

  // Get all classes across the system
  getAllClasses: async (): Promise<ClassGroup[]> => {
    try {
      const q = query(collection(db, CLASSES_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString(),
        } as unknown as ClassGroup;
      });
    } catch (error) {
      console.error('Error getting all classes:', error);
      throw error;
    }
  },

  // Get all classes for a lecturer
  getClassesByLecturer: async (lecturerId: string): Promise<ClassGroup[]> => {
    try {
      const q = query(collection(db, CLASSES_COLLECTION), where('lecturerId', '==', lecturerId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString(),
        } as unknown as ClassGroup;
      });
    } catch (error) {
      console.error('Error getting lecturer classes:', error);
      throw error;
    }
  },

  // Get all classes for a student
  getClassesByStudent: async (studentId: string): Promise<ClassGroup[]> => {
    try {
      const q = query(collection(db, CLASSES_COLLECTION), where('studentIds', 'array-contains', studentId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString(),
        } as unknown as ClassGroup;
      });
    } catch (error) {
      console.error('Error getting student classes:', error);
      throw error;
    }
  },

  // Update a class
  updateClass: async (classId: string, updateData: Partial<ClassGroup>) => {
    try {
      const classRef = doc(db, CLASSES_COLLECTION, classId);
      await updateDoc(classRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  },

  // Enroll a student in a class
  enrollStudent: async (classId: string, studentId: string) => {
    try {
      const classRef = doc(db, CLASSES_COLLECTION, classId);
      const classDoc = await getDoc(classRef);
      if (!classDoc.exists()) throw new Error('Class not found');

      const studentIds = classDoc.data().studentIds || [];
      if (!studentIds.includes(studentId)) {
        await updateDoc(classRef, {
          studentIds: [...studentIds, studentId],
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error enrolling student:', error);
      throw error;
    }
  }
};