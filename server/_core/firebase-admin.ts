import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

let adminApp: any = null;

// Initialize Firebase Admin SDK
// This should be called once at server startup
export function initializeFirebaseAdmin() {
  // Check if already initialized
  if (adminApp) {
    return adminApp;
  }

  try {
    // Initialize with default credentials (works in Cloud Run, App Engine, etc.)
    // For local development, set GOOGLE_APPLICATION_CREDENTIALS env var
    adminApp = admin.initializeApp({
      projectId: "satyamo-c2c21",
    });

    console.log("[Firebase Admin] Initialized successfully");
    return adminApp;
  } catch (error) {
    console.error("[Firebase Admin] Failed to initialize:", error);
    // In development, Firebase Admin may not be available
    // This is OK - we'll just skip token verification
    return null;
  }
}

/**
 * Verify Firebase ID token and extract user info
 * @param idToken Firebase ID token from client
 * @returns Decoded token with user information
 */
export async function verifyFirebaseToken(idToken: string) {
  try {
    // Initialize if not already done
    if (!adminApp) {
      initializeFirebaseAdmin();
    }

    if (!adminApp) {
      throw new Error("Firebase Admin not initialized");
    }

    // Use getAuth from firebase-admin/auth
    const auth = getAuth(adminApp);
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("[Firebase] Token verification failed:", error);
    throw new Error("Invalid Firebase token");
  }
}

/**
 * Get Firebase Auth instance
 */
export function getFirebaseAuth() {
  if (!adminApp) {
    initializeFirebaseAdmin();
  }

  if (!adminApp) {
    throw new Error("Firebase Admin not initialized");
  }

  return getAuth(adminApp);
}

/**
 * Check if Firebase Admin is properly initialized
 */
export function isFirebaseAdminReady(): boolean {
  return adminApp !== null;
}
