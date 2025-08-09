// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjqHCvvAWzG4hMUHSdXutpzcAPQwe0Tog",
  authDomain: "tech-xplorers.firebaseapp.com",
  databaseURL: "https://tech-xplorers-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tech-xplorers",
  storageBucket: "tech-xplorers.firebasestorage.app",
  messagingSenderId: "120058263454",
  appId: "1:120058263454:web:f3ce43069e65b4c503c88f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);