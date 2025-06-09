import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const speechRequests = pgTable("speech_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  identity: text("identity").notNull(),
  background: text("background"),
  whatYouDo: text("what_you_do").notNull(),
  motivation: text("motivation").notNull(),
  generatedSpeech: text("generated_speech"),
  wordCount: integer("word_count"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSpeechRequestSchema = createInsertSchema(speechRequests).pick({
  name: true,
  identity: true,
  background: true,
  whatYouDo: true,
  motivation: true,
});

export const speechResponseSchema = z.object({
  speech: z.string(),
  wordCount: z.number(),
  readTime: z.number(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSpeechRequest = z.infer<typeof insertSpeechRequestSchema>;
export type SpeechRequest = typeof speechRequests.$inferSelect;
export type SpeechResponse = z.infer<typeof speechResponseSchema>;
