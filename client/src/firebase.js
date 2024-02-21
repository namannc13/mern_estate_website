

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "chomchomestate.firebaseapp.com",
  projectId: "chomchomestate",
  storageBucket: "chomchomestate.appspot.com",
  messagingSenderId: "1062354077379",
  appId: "1:1062354077379:web:c0db8e12950155c8c98476",
  measurementId: "G-7RGYCMBTFK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);