import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import * as db from "../db";

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
    const firebaseUid = authHeader.substring(7);
    try {
      const foundUser = await db.getUserByFirebaseUid(firebaseUid);
      user = foundUser || null;
    } catch (error) {
      console.error("[Context] Firebase auth failed:", error);
      user = null;
    }
  }

  // Fallback to Manus OAuth for backward compatibility
  if (!user) {
    try {
      // This will fail gracefully if not a Manus OAuth request
      user = await sdk.authenticateRequest(opts.req);
    } catch (error) {
      // Authentication is optional for public procedures.
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
