// Firebase Configuration for Zamra Web
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';


const firebaseConfig = {
  apiKey: "AIzaSyBiL_oYigmGpdL6Po-OYEKrIBkyHa95yNo",
  authDomain: "zamra-web.firebaseapp.com",
  projectId: "zamra-web",
  storageBucket: "zamra-web.firebasestorage.app",
  messagingSenderId: "667791446355",
  appId: "1:667791446355:web:744fe88826623837c291a6",
  measurementId: "G-5ZL3JCFZ7Z"
};

// Initialize Firebase (singleton)
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app, 'asia-south1');

export { app, auth, db, storage, functions };

