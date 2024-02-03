// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "loginsignup-d6185.firebaseapp.com",
  projectId: "loginsignup-d6185",
  storageBucket: "loginsignup-d6185.appspot.com",
  messagingSenderId: "497585846020",
  appId: "1:497585846020:web:190261b6bf5cafe3428251"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);