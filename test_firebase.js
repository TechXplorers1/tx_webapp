import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDjqHCvvAWzG4hMUHSdXutpzcAPQwe0Tog",
  authDomain: "tech-xplorers.firebaseapp.com",
  databaseURL: "https://tech-xplorers-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tech-xplorers",
  storageBucket: "tech-xplorers.firebasestorage.app",
  messagingSenderId: "120058263454",
  appId: "1:120058263454:web:f3ce43069e65b4c503c88f"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function testFetch() {
  try {
    const metaRef = ref(database, "metadata/projects_last_updated");
    const metaSnap = await get(metaRef);
    console.log("Metadata:", metaSnap.val());
    
    const projectsRef = ref(database, "projects");
    const projectsSnap = await get(projectsRef);
    console.log("Projects count:", projectsSnap.exists() ? Object.keys(projectsSnap.val()).length : 0);
  } catch (error) {
    console.error("Firebase Error:", error.message);
  }
}

testFetch();
