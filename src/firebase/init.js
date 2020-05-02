import firebase from "firebase/app";
import firestore from "firebase/firestore";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBwHyn1NfqPykUwB-k5w7GmH9NhGsiiLHE",
  authDomain: "bubbles-64b39.firebaseapp.com",
  databaseURL: "https://bubbles-64b39.firebaseio.com",
  projectId: "bubbles-64b39",
  storageBucket: "bubbles-64b39.appspot.com",
  messagingSenderId: "806282965746",
  appId: "1:806282965746:web:48f2393591f192a701166b"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore();
