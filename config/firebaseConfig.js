import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import * as firestore from "firebase/firestore";
// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "schedsense.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "schedsense",
  storageBucket: "schedsense.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MESUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { app, db };

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
