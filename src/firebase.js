import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// REPLACE THIS OBJECT WITH YOUR ACTUAL FIREBASE KEYS
const firebaseConfig = {
  apiKey: "AIzaSyB3JaCSaZO53CSlvSZmtgJrJYGB4YoKHuY",
  authDomain: "rocket-simulator-backend.firebaseapp.com",
  projectId: "rocket-simulator-backend",
  storageBucket: "rocket-simulator-backend.firebasestorage.app",
  messagingSenderId: "840001594174",
  appId: "1:840001594174:web:f017a8b7a6afae1951826f",
  measurementId: "G-D4GMFL5J6Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export the Database and Auth modules so the rest of the app can use them
export const db = getFirestore(app);
export const auth = getAuth(app);