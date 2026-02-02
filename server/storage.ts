import { db } from "./db";
import { generatedFiles, type GeneratedFile, type InsertGeneratedFile } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createGeneratedFile(file: InsertGeneratedFile): Promise<GeneratedFile>;
  getGeneratedFile(id: number): Promise<GeneratedFile | undefined>;
  listGeneratedFiles(): Promise<GeneratedFile[]>;
}

export class DatabaseStorage implements IStorage {
  async createGeneratedFile(file: InsertGeneratedFile): Promise<GeneratedFile> {
    const [created] = await db.insert(generatedFiles).values(file).returning();
    return created;
  }

  async getGeneratedFile(id: number): Promise<GeneratedFile | undefined> {
    const [file] = await db
      .select()
      .from(generatedFiles)
      .where(eq(generatedFiles.id, id));
    return file;
  }

  async listGeneratedFiles(): Promise<GeneratedFile[]> {
    return await db
      .select()
      .from(generatedFiles)
      .orderBy(desc(generatedFiles.createdAt));
  }
}

export const storage = new DatabaseStorage();
