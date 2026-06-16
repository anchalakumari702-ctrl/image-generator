import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

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
          const idToken = await user.getIdToken();
          // Store token in localStorage for API calls
          localStorage.setItem("firebaseToken", idToken);
        } catch (error) {
          console.error("Failed to get ID token:", error);
        }
      } else {
        localStorage.removeItem("firebaseToken");
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
      return result.user;
    } catch (error: any) {
      const errorMessage = error.message || "Signup failed";
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
      return result.user;
    } catch (error: any) {
      const errorMessage = error.message || "Login failed";
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
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error: any) {
      const errorMessage = error.message || "Google login failed";
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
      await signOut(auth);
    } catch (error: any) {
      const errorMessage = error.message || "Logout failed";
      setAuthState((prev) => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  const getAuthToken = async (): Promise<string | null> => {
    if (!authState.user) return null;
    try {
      return await authState.user.getIdToken();
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
