import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";

const upload = multer({ dest: "/tmp/uploads/" });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync("/tmp/uploads/")) {
    fs.mkdirSync("/tmp/uploads/", { recursive: true });
  }

  app.post("/api/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const inputPath = req.file.path;
    const outputFilename = `timetable_${Date.now()}.xlsx`;
    const outputPath = path.join("/tmp/uploads/", outputFilename);

    // Call Python script
    const pythonProcess = spawn("python3", [
      path.join(process.cwd(), "server/process_timetable.py"),
      inputPath,
      outputPath
    ]);

    let errorData = "";

    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        return res.status(500).json({ 
          message: "Error processing file", 
          details: errorData 
        });
      }

      try {
        const generatedFile = await storage.createGeneratedFile({
          originalFilename: req.file!.originalname,
          processedFilename: outputFilename,
        });

        res.status(201).json(generatedFile);
      } catch (err) {
        res.status(500).json({ message: "Database error" });
      }
    });
  });

  app.get("/api/files", async (req, res) => {
    const files = await storage.listGeneratedFiles();
    res.json(files);
  });

  app.get("/api/files/:id/download", async (req, res) => {
    const id = parseInt(req.params.id);
    const file = await storage.getGeneratedFile(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join("/tmp/uploads/", file.processedFilename);
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File no longer exists on server" });
    }

    res.download(filePath, `timetable_${file.id}.xlsx`);
  });

  return httpServer;
}
