
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if we're in development mode (using placeholder values)
const isDevelopmentMode = firebaseConfig.apiKey?.includes('placeholder');


// Mock user data for development
const createMockUser = (email: string, uid: string = 'mock-user-id'): User => ({
  uid,
  email,
  emailVerified: true,
  isAnonymous: false,
  providerData: [],
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
  refreshToken: 'mock-refresh-token',
  tenantId: null,
  displayName: email.split('@')[0],
  photoURL: null,
  phoneNumber: null,
  providerId: 'password',
  reload: () => Promise.resolve(),
  getIdToken: () => Promise.resolve('mock-id-token'),
  getIdTokenResult: () => Promise.resolve({
    token: 'mock-id-token',
    expirationTime: '2099-01-01T00:00:00Z',
    authTime: new Date().toISOString(),
    issuedAtTime: new Date().toISOString(),
    signInProvider: 'password',
    signInSecondFactor: null,
    claims: {},
  }),
  delete: () => Promise.resolve(),
  toJSON: () => ({
    uid,
    email,
    emailVerified: true,
    displayName: email.split('@')[0],
    photoURL: null,
    phoneNumber: null,
    isAnonymous: false,
    providerData: [],
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    },
    refreshToken: 'mock-refresh-token',
    tenantId: null,
  }),
} as User);

let app: any;
let auth: Auth;

// Create mock auth for development
const createMockAuth = () => ({
  currentUser: null,
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    // Return a mock unsubscribe function
    return () => {};
  },
});

const createMockFirebaseApp = () => ({
  name: '[DEFAULT]',
  options: {},
  automaticDataCollectionEnabled: false,
});

try {
  if (isDevelopmentMode) {
    console.log('Using mock Firebase for development');
    app = createMockFirebaseApp();
    auth = createMockAuth() as Auth;
  } else {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  }
} catch (error) {
  console.log('Firebase initialization failed, using mock auth');
  app = createMockFirebaseApp();
  auth = createMockAuth() as Auth;
}

export { auth };


export async function signUp(email: string, password: string) {
  try {
    if (isDevelopmentMode) {
      // Mock signup for development
      const mockUser = createMockUser(email, `mock-user-${Date.now()}`);
      return { user: mockUser, error: null };
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

export async function signIn(email: string, password: string) {
  try {
    if (isDevelopmentMode) {
      // Mock signin for development
      const mockUser = createMockUser(email, `mock-user-${Date.now()}`);
      return { user: mockUser, error: null };
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

export async function signOut() {
  try {
    if (isDevelopmentMode) {
      return { error: null };
    }
    
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function sendVerificationEmail(user: User) {
  try {
    if (isDevelopmentMode) {
      return { error: null };
    }
    
    await sendEmailVerification(user);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
