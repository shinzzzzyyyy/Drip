// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBs2H99IvPjJakMelcP2L_VQiZDq-lGQYU",
  authDomain: "drip-361c6.firebaseapp.com",
  projectId: "drip-361c6",
  storageBucket: "drip-361c6.firebasestorage.app",
  messagingSenderId: "610459611965",
  appId: "1:610459611965:web:84354e34078f0de2e64b54",
  measurementId: "G-PGMKST8MFW"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);