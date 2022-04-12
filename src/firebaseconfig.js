import firebase from "firebase/compat/app";
import 'firebase/compat/database';
import 'firebase/compat/storage';
import { ref } from 'firebase/storage';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { signInWithPopup, FacebookAuthProvider} from "firebase/auth";
import { firebaseAPIkey } from "./keys";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: `${firebaseAPIkey}`,
  authDomain: "findmyowner-6abcb.firebaseapp.com",
  projectId: "findmyowner-6abcb",
  storageBucket: "findmyowner-6abcb.appspot.com",
  messagingSenderId: "698389077056",
  appId: "1:698389077056:web:bf918b41b3192324da93a5",
  measurementId: "G-QNWH88L143",
  databaseURL: "https://findmyowner-6abcb-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();
const db2 = firebase.database();
const storage = firebase.storage();

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
      window.location = ("/FindMyOwner/home");
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
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.email;
    const credential = FacebookAuthProvider.credentialFromError(error);
  }
};

const signInWithEmailAndPassword = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    window.location = ("/FindMyOwner/home");
  } catch (err) {
    console.error(err);
    if(!(email.includes("@"))){
      alert("Not a valid email address. Make sure to include the \"@\" key.");
    }
    if(err.code === "auth/user-not-found"){
      alert("Not a valid account. Please register a account if you wish to login.")
    }
    if(err.code === "auth/wrong-password"){
      alert("Wrong password entered. Please re-enter password.");
    }
    else{
      alert(err.message);
    }
  }
};
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await auth.createUserWithEmailAndPassword(email, password);
    const user = res.user;
    await db.collection("users").add({
      uid: user.uid,
      authProvider: "local",
      email,
    }).then(
    updateDisplayName(name));
  } catch (err) {
    console.log(err.code);
    console.log(err.message);
    if(!(email.includes("@"))){
      alert("Not a valid email address. Make sure to include the \"@\" character");
    }
    alert(err.message);
  }
};
const updateDisplayName = async (name, check) => {
  const update = {
    displayName: name,
  };
  await auth.currentUser.updateProfile(update);
  console.log("finished");
  //alert("Account created. Welcome "+name);
  // window.location = ("/FindMyOwner/home");
  const checks = 1;
  storage.ref("ProfilePictures/DefaultProfilePicture.jpg").getDownloadURL()
  .then((url) =>{
    console.log(url);
    updateProfilePic(url, checks)
  })
}

const updateProfilePic = async (photo, check) => {
  console.log(photo)
  const update = {
    photoURL: photo,
  }
  await auth.currentUser.updateProfile(update);
  if(!(check === 1)){
    alert("Photo Uploaded");
    window.location.reload(false);
    console.log(auth);
    const db3 = db2.ref("Posts");
    db3.on("value", (snap) => {
        const postsFromDatabase = snap.val();
        for(let id in postsFromDatabase){
            const newRef = db2.ref(`Posts/${id}/comments`);
            newRef.on("value", (snap) => {
                const moreValues = snap.val();
                for(let commentid in moreValues){
                    const newRef2 = db2.ref(`Posts/${id}/comments/${commentid}`);
                    newRef2.on("value", (snap) => {
                        const commentinfo = snap.val();
                        if(commentinfo.email === auth.currentUser.email){
                            console.log(auth.currentUser.photoURL);
                            db2.ref(`Posts/${id}/comments/${commentid}/`).update({"commenterPhoto": auth.currentUser.photoURL})
                        }
                    })
                }
            })
        }
    })
  }
}

const sendPasswordResetEmail = async (email) => {
  try {
    await auth.sendPasswordResetEmail(email);
    alert("Password reset link sent!");
  } catch (err) {
    if(!(email.includes("@"))){
      alert("Not a valid email address. Make sure to include the \"@\" character");
    }
    else if(err.code === "auth/user-not-found"){
      alert("This email does not have an account. Please register an account")
    }
  }
};

const getUserInfo = async (email) => {
  await auth.getUserByEmail(email)
  .then(function(records){
    console.log('Successfully fetched user data:', records.toJSON());
  })
  .catch(function(error){
    console.log('Error fetching user data: ' + error);
  })
}

const logout = () => {
  auth.signOut();
  window.location = ("/FindMyOwner/login");
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
  getDownloadURL,
  storage,
  ref,
  updateProfilePic,
  getUserInfo,
};

export default db2;