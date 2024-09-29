// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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
const auth = getAuth(app);
// Initialize Google Auth Provider for Gmail sign-in
const googleProvider = new GoogleAuthProvider();

// Firebase error message mapping
export const getFriendlyErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email is already in use.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/weak-password":
        return "Your password is too weak. Please choose a stronger password.";
      default:
        return "An error occurred. Please try again.";
    }
};

export { auth, googleProvider };
