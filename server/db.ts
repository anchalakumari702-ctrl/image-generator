import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, generatedImages, imageGenerations } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/**
 * Create or update a user from Firebase authentication
 */
export async function upsertUser(firebaseUid: string, email: string, name?: string): Promise<void> {
  if (!firebaseUid || !email) {
    throw new Error("Firebase UID and email are required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      firebaseUid,
      email,
      name: name || null,
    };

    const updateSet: Record<string, unknown> = {
      email,
      updatedAt: new Date(),
    };

    if (name) {
      updateSet.name = name;
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

/**
 * Get user by Firebase UID
 */
export async function getUserByFirebaseUid(firebaseUid: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create a generated image record
 */
export async function createGeneratedImage(
  userId: number,
  prompt: string,
  style: string,
  aspectRatio: string,
  imageUrl: string,
  imageKey: string,
  generationId: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(generatedImages).values({
    userId,
    prompt,
    style,
    aspectRatio,
    imageUrl,
    imageKey,
    generationId,
  });

  return result;
}

/**
 * Get all generated images for a user
 */
export async function getGeneratedImagesByUserId(userId: number, limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(generatedImages)
    .where(eq(generatedImages.userId, userId))
    .orderBy(desc(generatedImages.createdAt))
    .limit(limit)
    .offset(offset);
}

/**
 * Delete a generated image (with ownership check)
 */
export async function deleteGeneratedImage(imageId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .delete(generatedImages)
    .where(and(eq(generatedImages.id, imageId), eq(generatedImages.userId, userId)));
}

/**
 * Create an image generation request
 */
export async function createImageGeneration(
  userId: number,
  prompt: string,
  style: string,
  aspectRatio: string,
  imageCount: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(imageGenerations).values({
    userId,
    prompt,
    style,
    aspectRatio,
    imageCount,
    status: "pending",
  });

  return result;
}

/**
 * Update image generation status
 */
export async function updateImageGenerationStatus(
  generationId: number,
  status: "pending" | "completed" | "failed",
  errorMessage?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(imageGenerations)
    .set({ status, errorMessage, updatedAt: new Date() })
    .where(eq(imageGenerations.id, generationId));
}
