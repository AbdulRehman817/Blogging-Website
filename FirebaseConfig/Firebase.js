// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {
  getFirestore,
  addDoc,
  getDocs,
  collection,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCx58Q-ZJklKMNSIIeZy8lhkzx3IaAuKDk",
  authDomain: "input-88449.firebaseapp.com",
  projectId: "input-88449",
  storageBucket: "input-88449.appspot.com",
  messagingSenderId: "739851458745",
  appId: "1:739851458745:web:1226463d129ca44f406368",
  measurementId: "G-5Q184YFRH8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  db,
  doc,
  collection,
  addDoc,
  getDocs,
  getDoc,
  uploadBytesResumable,
};
