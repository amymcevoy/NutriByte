// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8f4F7UIBacaHeqxSwVSRiVPjU6V_NMqQ",
  authDomain: "nutri-byte-a808b.firebaseapp.com",
  projectId: "nutri-byte-a808b",
  storageBucket: "nutri-byte-a808b.firebasestorage.app",
  messagingSenderId: "307616467076",
  appId: "1:307616467076:web:2aa8a57a3e2d429ce09ad1",
  measurementId: "G-9EYV5QMYZ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);