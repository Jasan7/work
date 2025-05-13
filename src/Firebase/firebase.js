import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC0NwLUs7PCPRiKADVn1B0ndOUxTveWdlE",
  authDomain: "pipeline-assessment.firebaseapp.com",
  projectId: "pipeline-assessment",
  storageBucket: "pipeline-assessment.firebasestorage.app",
  messagingSenderId: "794692941691",
  appId: "1:794692941691:web:726ed244d2cdfc58d3afde",
  measurementId: "G-GF1E4FPELD"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
