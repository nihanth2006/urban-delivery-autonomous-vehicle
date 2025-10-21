import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB1E0Q79lD4153z3cP7UAmpGnZz4cDg-0Q",
  authDomain: "food-96c58.firebaseapp.com",
  projectId: "food-96c58",
  storageBucket: "food-96c58.firebasestorage.app",
  messagingSenderId: "786074765345",
  appId: "1:786074765345:web:5809f2a5940a467864bb60",
  measurementId: "G-BSW7WCCJD2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    return { user: userCredential.user, token };
  } catch (error) {
    console.error('Firebase signup error:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered. Please try logging in instead, or use a different email address.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Please enter a valid email address.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password should be at least 6 characters long.');
    } else {
      throw new Error('An error occurred during registration. Please try again.');
    }
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    return { user: userCredential.user, token };
  } catch (error) {
    console.error('Firebase signin error:', error);
    if (error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password. Please check your credentials and try again.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed login attempts. Please try again later or reset your password.');
    } else {
      throw new Error('An error occurred during sign in. Please try again.');
    }
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export { auth };