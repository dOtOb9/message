import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCFY0FYCgvFAxY4q2ZyB5FnuzTljEfipiE",
  authDomain: "message-19a76.firebaseapp.com",
  projectId: "message-19a76",
  storageBucket: "message-19a76.firebasestorage.app",
  messagingSenderId: "242503901797",
  appId: "1:242503901797:web:14f7a81b21cfc5b2501c8c",
  measurementId: "G-E7M5CJYRHC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication 
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Cloud Functions and get a reference to the service
export const functions = getFunctions(app, 'asia-northeast1');

export default app;