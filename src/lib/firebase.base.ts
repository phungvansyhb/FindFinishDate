import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getStorage , ref } from "firebase/storage";

// TODO: move to .env
const firebaseConfig = {
    apiKey: "AIzaSyAKrQxR_E6bcZC3_p-fKKELuanCvH21eAs",
    authDomain: "classmanage-7b65c.firebaseapp.com",
    projectId: "classmanage-7b65c",
    storageBucket: "classmanage-7b65c.appspot.com",
    messagingSenderId: "633402335058",
    appId: "1:633402335058:web:6f5c5625d473187002a48b",
    measurementId: "G-KSRKEES5WX"
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const storageRef =(fileName:string)=> ref(getStorage(app),fileName);
export { db  }
