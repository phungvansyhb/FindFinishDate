import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getStorage , ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDERID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MESSUREMENTID
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db }
