import firebase from "firebase";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAc69SFX0Uvo5EayC8hq3e8DmSGFl4BWYs",
  authDomain: "findmyowner-6abcb.firebaseapp.com",
  projectId: "findmyowner-6abcb",
  storageBucket: "findmyowner-6abcb.appspot.com",
  messagingSenderId: "698389077056",
  appId: "1:698389077056:web:bf918b41b3192324da93a5",
  measurementId: "G-QNWH88L143"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();
const analytics = getAnalytics(app);