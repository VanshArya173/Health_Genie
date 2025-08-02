// client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // for database
import { getAuth } from "firebase/auth";             // for authentication

const firebaseConfig = {
  apiKey: "AIzaSyBsaf7kqtl32X2gU0CJo8Rt92FMN9czTLQ",
  authDomain: "astha-ai-1ba49.firebaseapp.com",
  projectId: "astha-ai-1ba49",
  storageBucket: "astha-ai-1ba49.appspot.com",
  messagingSenderId: "18587586879",
  appId: "1:18587586879:web:7c6ab3ea5d476cc381438a",
  measurementId: "G-09EK4BDS4S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
