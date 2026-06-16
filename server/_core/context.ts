import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import * as db from "../db";
import { verifyFirebaseToken } from "./firebase-admin";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // Try Firebase authentication first (from Authorization header)
  const authHeader = opts.req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const idToken = authHeader.substring(7);
    try {
      // Verify the Firebase ID token
      const decodedToken = await verifyFirebaseToken(idToken);
      const firebaseUid = decodedToken.uid;
      
      // Get or create user in database
      let foundUser = await db.getUserByFirebaseUid(firebaseUid);
      
      if (!foundUser) {
        // Create user if doesn't exist
        await db.upsertUser(
          firebaseUid,
          decodedToken.email || `user_${firebaseUid}@firebase.local`,
          decodedToken.name || undefined
        );
        foundUser = await db.getUserByFirebaseUid(firebaseUid);
      }
      
      user = foundUser || null;
    } catch (error) {
      console.debug("[Context] Firebase auth verification failed (expected in dev):", error instanceof Error ? error.message : error);
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
