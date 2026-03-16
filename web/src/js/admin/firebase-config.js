// Firebase Configuration for Zamra Web
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';


const firebaseConfig = {
  apiKey: "AIzaSyAktrHNfNsRzZQpt2KuyDFjmkDt48vBauA",
  authDomain: "zamra-web-01.firebaseapp.com",
  projectId: "zamra-web-01",
  storageBucket: "zamra-web-01.firebasestorage.app",
  messagingSenderId: "871356823310",
  appId: "1:871356823310:web:ca0d35ef2d21c6f602895f",
  measurementId: "G-CRR6LJWDFJ"
};

// Initialize Firebase (singleton)
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app, 'asia-south1');

export { app, auth, db, storage, functions };
