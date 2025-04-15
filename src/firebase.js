import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // ✅ Importa o Realtime Database

const firebaseConfig = {
    apiKey: "AIzaSyAf15BItzTPNfgQXN1iTy2ymB-e_Jc_Pow",
    authDomain: "lista-fut-f01fb.firebaseapp.com",
    databaseURL: "https://lista-fut-f01fb-default-rtdb.firebaseio.com/",
    projectId: "lista-fut-f01fb",
    storageBucket: "lista-fut-f01fb.appspot.com", 
    messagingSenderId: "815697733906",
    appId: "1:815697733906:web:c6bd0b9dc3900ed37cebcb",
    measurementId: "G-FF3M0TCQDY"
  };


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app); 

export { app, analytics, database }; 
