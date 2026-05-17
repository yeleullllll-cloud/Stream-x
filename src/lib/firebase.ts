import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { type User as FirebaseUser } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); // CRITICAL
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
     const result = await signInWithPopup(auth, provider);
     
     // Initialize user document if not exists
     const userRef = doc(db, 'users', result.user.uid);
     const userDoc = await getDoc(userRef);
     
     if (!userDoc.exists()) {
       await setDoc(userRef, {
         userId: result.user.uid,
         email: result.user.email,
         displayName: result.user.displayName,
         photoURL: result.user.photoURL,
         createdAt: serverTimestamp()
       });
     }
     
     return result.user;
  } catch (error) {
     console.error("Login failed", error);
     throw error;
  }
}

export async function logoutUser() {
  try {
     await signOut(auth);
  } catch (error) {
     console.error("Logout failed", error);
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
