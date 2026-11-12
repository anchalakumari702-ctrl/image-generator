import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

function formatAuthError(error: any, fallback: string) {
  switch (error?.code) {
    case "auth/user-cancelled":
      return "Google sign-in cancel ho gaya. Google button dobara press karke account select karein.";
    case "auth/popup-closed-by-user":
      return "Google sign-in window band ho gayi. Dobara try karein.";
    case "auth/unauthorized-domain":
      return "Is website domain ko Firebase Authentication ke Authorized domains me add karna zaroori hai.";
    case "auth/operation-not-allowed":
      return "Firebase Console me Email/Password ya Google sign-in provider enable nahi hai.";
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
      return "Email ya password galat hai.";
    default:
      return error?.message || fallback;
  }
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useFirebaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get ID token to send to backend
          const idToken = await user.getIdToken(true); // Force refresh
          // Store token in localStorage for API calls
          localStorage.setItem("firebaseToken", idToken);
          localStorage.setItem("firebaseUser", JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          }));
        } catch (error) {
          console.error("Failed to get ID token:", error);
        }
      } else {
        localStorage.removeItem("firebaseToken");
        localStorage.removeItem("firebaseUser");
      }
      
      setAuthState({
        user,
        loading: false,
        error: null,
      });
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Get token immediately after signup
      const idToken = await result.user.getIdToken(true);
      localStorage.setItem("firebaseToken", idToken);
      return result.user;
    } catch (error: any) {
      const errorMessage = formatAuthError(error, "Signup failed");
      setAuthState((prev) => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Get token immediately after login
      const idToken = await result.user.getIdToken(true);
      localStorage.setItem("firebaseToken", idToken);
      return result.user;
    } catch (error: any) {
      const errorMessage = formatAuthError(error, "Login failed");
      setAuthState((prev) => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  const loginWithGoogle = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      const provider = new GoogleAuthProvider();
      const isMobile = typeof window !== "undefined" &&
        window.matchMedia("(max-width: 768px)").matches;
      if (isMobile) {
        // Redirect is more reliable than a popup inside mobile browsers and
        // avoids auth/user-cancelled caused by popup blocking/closing.
        await signInWithRedirect(auth, provider);
        return null;
      }
      const result = await signInWithPopup(auth, provider);
      // Get token immediately after Google login
      const idToken = await result.user.getIdToken(true);
      localStorage.setItem("firebaseToken", idToken);
      return result.user;
    } catch (error: any) {
      const errorMessage = formatAuthError(error, "Google login failed");
      setAuthState((prev) => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  const logout = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      localStorage.removeItem("firebaseToken");
      localStorage.removeItem("firebaseUser");
      await signOut(auth);
    } catch (error: any) {
      const errorMessage = formatAuthError(error, "Logout failed");
      setAuthState((prev) => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  const getAuthToken = async (): Promise<string | null> => {
    if (!authState.user) return null;
    try {
      // Always refresh token to ensure it's valid
      return await authState.user.getIdToken(true);
    } catch (error) {
      console.error("Failed to get auth token:", error);
      return null;
    }
  };

  return {
    ...authState,
    signup,
    login,
    loginWithGoogle,
    logout,
    getAuthToken,
  };
};
