// src/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
// For production, it's highly recommended to use environment variables for these keys
const firebaseConfig = {
  apiKey: "AIzaSyDjqHCvvAWzG4hMUHSdXutpzcAPQwe0Tog",
  authDomain: "tech-xplorers.firebaseapp.com",
  databaseURL: "https://tech-xplorers-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tech-xplorers",
  storageBucket: "tech-xplorers.firebasestorage.app", // Corrected storage bucket format
  messagingSenderId: "120058263454",
  appId: "1:120058263454:web:f3ce43069e65b4c503c88f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you need
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

