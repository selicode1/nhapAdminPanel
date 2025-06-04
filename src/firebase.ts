// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsMi2JKbvRjiqNx6zcxmrzibR3jS1xjjQ",
  authDomain: "adminpanel-280d4.firebaseapp.com",
  projectId: "adminpanel-280d4",
  storageBucket: "adminpanel-280d4.firebasestorage.app",
  messagingSenderId: "336834934858",
  appId: "1:336834934858:web:5fdc17ee3a5f4952788eb3",
  measurementId: "G-Z87NZGGVX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);