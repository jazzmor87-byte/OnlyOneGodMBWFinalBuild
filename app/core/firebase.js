import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCkkoR5sNaysN6u0aOKPEUcP88HGVehL7I",
  authDomain: "mbw-2b18c.firebaseapp.com",
  projectId: "mbw-2b18c",
  storageBucket: "mbw-2b18c.firebasestorage.app",
  messagingSenderId: "727114103252",
  appId: "1:727114103252:web:363a03b12c5b1400403e41"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
