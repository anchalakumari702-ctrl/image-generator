import type { Request, Response } from "express";
import type { User } from "../../drizzle/schema";
import * as db from "../db";

/**
 * Firebase context for authenticated requests
 * This replaces the Manus OAuth context for Firebase-authenticated users
 */
export type FirebaseContext = {
  user: User | null;
  req: Request;
  res: Response;
};

/**
 * Extract Firebase user from request headers
 * Firebase sends the ID token in the Authorization header as "Bearer <token>"
 */
export function getFirebaseUidFromRequest(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  // Extract the token (in a real app, you'd verify this JWT)
  const token = authHeader.substring(7);
  
  // For now, we'll pass the token through and verify it on the client side
  // In production, you'd verify the JWT signature here
  return token;
}

/**
 * Build Firebase context for a request
 * This is called for each request to populate ctx.user
 */
export async function buildFirebaseContext(
  req: Request,
  res: Response,
  firebaseUid: string | null
): Promise<FirebaseContext> {
  let user: User | null = null;

  if (firebaseUid) {
    try {
      const foundUser = await db.getUserByFirebaseUid(firebaseUid);
      user = foundUser || null;
    } catch (error) {
      console.error("[Firebase Context] Failed to get user:", error);
    }
  }

  return {
    user,
    req,
    res,
  };
}

/**
 * Create a user from Firebase auth data
 */
export async function createUserFromFirebase(
  firebaseUid: string,
  email: string,
  displayName?: string
): Promise<User | null> {
  try {
    await db.upsertUser(firebaseUid, email, displayName);
    const user = await db.getUserByFirebaseUid(firebaseUid);
    return user || null;
  } catch (error) {
    console.error("[Firebase] Failed to create user:", error);
    return null;
  }
}
