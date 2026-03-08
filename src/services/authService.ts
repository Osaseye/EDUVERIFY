import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  getAuth
} from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, firebaseConfig } from '../config/firebase';
import type { User, UserRole } from '../types';

export const authService = {
  async loginWithEmail(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Fetch custom user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) {
        throw new Error('User record not found in database.');
      }

      return userDoc.data() as User;
    } catch (error: any) {
      if ((error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') && email === 'admin@eduverify.com') {
        // Auto-create dummy admin credentials if they don't exist
        console.log('Admin account not found, auto-creating...');
        return await this.registerWithEmail(email, password, 'System Administrator', 'admin');
      }
      throw error;
    }
  },

  async registerWithEmail(email: string, password: string, name: string, role: UserRole): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const newUser: User = {
      uid,
      email,
      name,
      role,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', uid), newUser);

    return newUser;
  },

  async createSecondaryUser(email: string, password: string, name: string, role: UserRole): Promise<User> {
    // Uses a secondary Firebase instance so the current admin user isn't logged out
    const apps = getApps();
    const secondaryApp = apps.find(app => app.name === 'SecondaryApp') || initializeApp(firebaseConfig, 'SecondaryApp');
    const secondaryAuth = getAuth(secondaryApp);

    try {
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const uid = userCredential.user.uid;

      const newUser: User = {
        uid,
        email,
        name,
        role,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', uid), newUser);
      await signOut(secondaryAuth);
      
      return newUser;
    } catch (error) {
      console.error('Error creating secondary user:', error);
      throw error;
    }
  },

  async logoutUser(): Promise<void> {
    await signOut(auth);
  },

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }
};
