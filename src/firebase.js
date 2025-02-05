import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjP2vS3sTPBa1Ex2xIUe-87Lexxp_pUd8",
  authDomain: "mealtracker-6bcd6.firebaseapp.com",
  projectId: "mealtracker-6bcd6",
  storageBucket: "mealtracker-6bcd6.firebasestorage.app",
  messagingSenderId: "902979427036",
  appId: "1:902979427036:web:ec0410d60bf86b55f53219",
  measurementId: "G-2N638FXJHG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);