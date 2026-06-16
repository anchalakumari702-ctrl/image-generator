import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/routers";

export const trpc = createTRPCReact<AppRouter>();

/**
 * Get Firebase token from localStorage
 */
export function getFirebaseToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("firebaseToken");
}

/**
 * Add Firebase token to request headers
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getFirebaseToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}
