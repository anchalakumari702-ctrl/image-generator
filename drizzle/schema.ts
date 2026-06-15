import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Generated images table - stores all AI-generated images per user
 */
export const generatedImages = mysqlTable("generatedImages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  prompt: text("prompt").notNull(),
  style: varchar("style", { length: 64 }).notNull().default("realistic"),
  aspectRatio: varchar("aspectRatio", { length: 16 }).notNull().default("1:1"),
  imageUrl: text("imageUrl").notNull(),
  imageKey: varchar("imageKey", { length: 255 }).notNull(),
  generationId: varchar("generationId", { length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GeneratedImage = typeof generatedImages.$inferSelect;
export type InsertGeneratedImage = typeof generatedImages.$inferInsert;

/**
 * Image generations table - tracks generation requests and their metadata
 */
export const imageGenerations = mysqlTable("imageGenerations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  prompt: text("prompt").notNull(),
  style: varchar("style", { length: 64 }).notNull(),
  aspectRatio: varchar("aspectRatio", { length: 16 }).notNull(),
  imageCount: int("imageCount").notNull().default(1),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ImageGeneration = typeof imageGenerations.$inferSelect;
export type InsertImageGeneration = typeof imageGenerations.$inferInsert;