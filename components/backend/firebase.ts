// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCkTlN7PkzLz7Msi0FlA8_-Kx6VwZ1983o",
  authDomain: "asyouwish-57228.firebaseapp.com",
  projectId: "asyouwish-57228",
  storageBucket: "asyouwish-57228.appspot.com",
  messagingSenderId: "771273052126",
  appId: "1:771273052126:web:d8ed3a3128e4436657174f",
  measurementId: "G-PQGXNWL2DF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
