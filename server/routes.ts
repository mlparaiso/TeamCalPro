import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { teamMemberSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get team members from Google Sheets
  app.post("/api/sync-sheets", async (req, res) => {
    try {
      const { spreadsheetId, apiKey } = req.body;
      
      if (!spreadsheetId || !apiKey) {
        return res.status(400).json({ 
          message: "Missing required fields: spreadsheetId and apiKey" 
        });
      }

      const range = "Schedule!A:D";
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        return res.status(400).json({ 
          message: `Google Sheets API error: ${response.statusText}` 
        });
      }
      
      const data = await response.json();
      const rows = data.values || [];
      
      if (rows.length < 2) {
        return res.status(400).json({ 
          message: "Sheet must have at least a header row and one data row" 
        });
      }

      // Skip header row and parse data
      const teamMembers = rows.slice(1).map((row: string[]) => ({
        teamMember: row[0] || "",
        analyst: row[1] || "",
        loginTime: row[2] || "",
        timeOffs: row[3] || "",
      }));

      // Validate data
      const validatedMembers = teamMembers.map((member: any) => {
        const result = teamMemberSchema.safeParse(member);
        if (!result.success) {
          throw new Error(`Invalid data format: ${result.error.message}`);
        }
        return result.data;
      });

      storage.setTeamMembers(validatedMembers);
      
      res.json({ 
        message: "Data synced successfully", 
        count: validatedMembers.length 
      });
    } catch (error) {
      console.error("Error syncing Google Sheets:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to sync data" 
      });
    }
  });

  // Get analysts
  app.get("/api/analysts", async (req, res) => {
    try {
      const analysts = await storage.getAnalysts();
      res.json(analysts);
    } catch (error) {
      console.error("Error fetching analysts:", error);
      res.status(500).json({ message: "Failed to fetch analysts" });
    }
  });

  // Get schedule data
  app.get("/api/schedule", async (req, res) => {
    try {
      const { analyst, day } = req.query;
      const scheduleData = await storage.getScheduleData(
        analyst as string || "", 
        day as string || ""
      );
      res.json(scheduleData);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      res.status(500).json({ message: "Failed to fetch schedule data" });
    }
  });

  // Get statistics
  app.get("/api/statistics", async (req, res) => {
    try {
      const { analyst, day } = req.query;
      const stats = await storage.getStatistics(
        analyst as string || "", 
        day as string || ""
      );
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
