// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyChQzSy3DnOAX1SHRGL42cCFMUH5A7pm98",
  authDomain: "dashhrsuite-management.firebaseapp.com",
  databaseURL: "https://dashhrsuite-management-default-rtdb.firebaseio.com",
  projectId: "dashhrsuite-management",
  storageBucket: "dashhrsuite-management.firebasestorage.app",
  messagingSenderId: "41528740213",
  appId: "1:41528740213:web:121a546fbf2411bcdc6b3c",
  measurementId: "G-2XBPCLL72K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getDatabase(app);

export default app; 