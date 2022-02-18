import firebase from "firebase";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { signInWithPopup, FacebookAuthProvider} from "firebase/auth";

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

const provider = new FacebookAuthProvider();

provider.setCustomParameters({
  'display': 'popup'
});

const signInWithFacebook = async () => {
  try{
    const res = await auth.signInWithPopup(provider);
    console.log(provider);
    const user = res.user;
    const query = await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get();
    if (query.docs.length === 0) {
      await db.collection("users").add({
        uid: user.uid,
        name: user.displayName,
        authProvider: "facebook",
        email: user.email,
      });
    }
  }
  catch (error){
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);

    // ..
  }
};

const signInWithEmailAndPassword = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    console.log(auth);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await auth.createUserWithEmailAndPassword(email, password);
    const user = res.user;
    window.location = ("/");
    console.log("hi");
    await db.collection("users").add({
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const sendPasswordResetEmail = async (email) => {
  try {
    await auth.sendPasswordResetEmail(email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  auth.signOut();
  window.location = ("/");
};
export {
  auth,
  db,
  signInWithPopup,
  signInWithFacebook,
  signInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordResetEmail,
  logout,
};
export default firebase;