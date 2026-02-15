// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAY1xkrQDbcRiCJdGOgfDVulzsf9lpwwE",
  authDomain: "a-plus-polyclinic-asansol.firebaseapp.com",
  projectId: "a-plus-polyclinic-asansol",
  storageBucket: "a-plus-polyclinic-asansol.firebasestorage.app",
  messagingSenderId: "9166853906",
  appId: "1:9166853906:web:e2f37566b5cea5879b85cb",
  measurementId: "G-XV8R2H5EGV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
