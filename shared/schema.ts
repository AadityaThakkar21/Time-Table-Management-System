import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const generatedFiles = pgTable("generated_files", {
  id: serial("id").primaryKey(),
  originalFilename: text("original_filename").notNull(),
  processedFilename: text("processed_filename").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGeneratedFileSchema = createInsertSchema(generatedFiles).omit({ 
  id: true, 
  createdAt: true 
});

export type GeneratedFile = typeof generatedFiles.$inferSelect;
export type InsertGeneratedFile = z.infer<typeof insertGeneratedFileSchema>;

export const scheduleEntries = pgTable("schedule_entries", {
  id: serial("id").primaryKey(),
  fileId: integer("file_id").references(() => generatedFiles.id).notNull(),
  facultyName: text("faculty_name").notNull(),
  day: text("day").notNull(),
  timeSlot: text("time_slot").notNull(),
  subject: text("subject").notNull(),
  room: text("room"),
  batch: text("batch"),
});

export const insertScheduleEntrySchema = createInsertSchema(scheduleEntries).omit({ 
  id: true 
});

export type ScheduleEntry = typeof scheduleEntries.$inferSelect;
export type InsertScheduleEntry = z.infer<typeof insertScheduleEntrySchema>;
