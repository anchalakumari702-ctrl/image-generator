import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6Yz2ddFSyHv23AB8k84bJvn4X_TkH8_Q",
  authDomain: "satyamo-c2c21.firebaseapp.com",
  projectId: "satyamo-c2c21",
  storageBucket: "satyamo-c2c21.firebasestorage.app",
  messagingSenderId: "160553592760",
  appId: "1:160553592760:web:408cbf70104c96d4e6514d",
  measurementId: "G-QX2DNH6Z93"
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
