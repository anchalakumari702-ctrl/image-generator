import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8jxHAvTxZl4X-UeDbGKAQmAcrrRg9SvI",
  authDomain: "prince-f7668.firebaseapp.com",
  projectId: "prince-f7668",
  storageBucket: "prince-f7668.firebasestorage.app",
  messagingSenderId: "1058690670358",
  appId: "1:1058690670358:web:297d9e54740a767e9e7a37",
  measurementId: "G-5H29ZW59WH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Enable emulator in development (optional)
// Uncomment these lines if you want to use Firebase emulator locally
// if (window.location.hostname === "localhost") {
//   connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
//   connectFirestoreEmulator(db, "localhost", 8080);
// }

export default app;
