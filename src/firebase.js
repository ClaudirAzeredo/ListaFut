// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAf15BItzTPNfgQXN1iTy2ymB-e_Jc_Pow",
  authDomain: "lista-fut-f01fb.firebaseapp.com",
  projectId: "lista-fut-f01fb",
  storageBucket: "lista-fut-f01fb.firebasestorage.app",
  messagingSenderId: "815697733906",
  appId: "1:815697733906:web:c6bd0b9dc3900ed37cebcb",
  measurementId: "G-FF3M0TCQDY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);