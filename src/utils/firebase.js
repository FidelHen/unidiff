import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJGwhDRkrywnl79w8uf-9xIQJHUNfzBSk",
  authDomain: "unidiff-8e5dd.firebaseapp.com",
  projectId: "unidiff-8e5dd",
  storageBucket: "unidiff-8e5dd.appspot.com",
  messagingSenderId: "1049437005745",
  appId: "1:1049437005745:web:a84f9979b64d1a65073f90",
  measurementId: "G-9KX8SF6C59",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
