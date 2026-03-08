import { db } from '../config/firebase';
import { collection, doc, getDoc, getDocs, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';
import type { User } from '../types';

const USERS_COLLECTION = 'users';

export const userService = {
  // Get user by ID
  getUserById: async (userId: string): Promise<User | null> => {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id, // Ensure we map the doc id
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString(),
        } as unknown as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Get users by role
  getUsersByRole: async (role: 'student' | 'lecturer' | 'admin'): Promise<User[]> => {
    try {
      const q = query(collection(db, USERS_COLLECTION), where('role', '==', role));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString(),
        } as unknown as User;
      });
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw error;
    }
  },

  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString(),
        } as unknown as User;
      });
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  },

  // Update user profile
  updateUser: async (userId: string, updateData: Partial<User>) => {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Function mainly for saving student face descriptors
  saveFaceDescriptor: async (userId: string, descriptor: number[]) => {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(docRef, {
        faceDescriptor: descriptor,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error saving face descriptor:', error);
      throw error;
    }
  },

  // Function for retrieving a user's face descriptor
  getFaceDescriptor: async (userId: string): Promise<number[] | null> => {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().faceDescriptor) {
        return docSnap.data().faceDescriptor as number[];
      }
      return null;
    } catch (error) {
      console.error('Error getting face descriptor:', error);
      throw error;
    }
  }
};
