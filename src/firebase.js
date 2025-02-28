// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRLX77vGbemI_dgBpFXOluzmEb3slbukg",
  authDomain: "nutribyte123-13cd4.firebaseapp.com",
  projectId: "nutribyte123-13cd4",
  storageBucket: "nutribyte123-13cd4.firebasestorage.app",
  messagingSenderId: "263542581655",
  appId: "1:263542581655:web:cddc7b624b03339c4ebcd2",
  measurementId: "G-8L998LN3S1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);