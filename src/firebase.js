// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc,addDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
import { setLogLevel } from "firebase/firestore";
setLogLevel("debug"); // This will log Firestore debug information to the console

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
const db = getFirestore(app); 

export { db, collection, getDocs, addDoc, deleteDoc, doc, updateDoc };