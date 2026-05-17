import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/youtube/trailer", async (req, res) => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query is required" });
      }

      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        // Fallback for demonstration if no API key is provided
        console.warn("No YOUTUBE_API_KEY provided. Using fallback trailer.");
        return res.json({ videoId: "zSWdZVtXT7E" });
      }

      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query + " Official Movie Trailer"
      )}&maxResults=1&type=video&videoEmbeddable=true&videoDefinition=high&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        return res.json({ videoId: data.items[0].id.videoId });
      } else {
        return res.status(404).json({ error: "Trailer not found" });
      }
    } catch (error) {
      console.error("YouTube API Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/search/predict", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Query is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({ titles: [] });
      }

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `The user searched for a movie or TV show using the query "${q}". 
They might have made spelling errors. Provide a JSON array of up to 3 official, correct movie/TV show titles that best match this query. 
Only output a valid JSON array of strings, nothing else. Example: ["Spider-Man", "Spider-Man: No Way Home", "The Amazing Spider-Man"]`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      let titles: string[] = [];
      try {
        titles = JSON.parse(response.text || "[]");
      } catch (e) {
        console.error("Failed to parse Gemini response", e);
      }

      res.json({ titles });
    } catch (error) {
      console.error("Prediction Error:", error);
      // Fallback returning empty array
      res.json({ titles: [] });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
