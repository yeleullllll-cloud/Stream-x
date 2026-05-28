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
      const { query, key } = req.query;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query is required" });
      }

      const apiKey = key || process.env.YOUTUBE_API_KEY;
      let videoId: string | null = null;

      if (apiKey) {
        try {
          const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            query + " trailer"
          )}&maxResults=1&type=video&videoEmbeddable=true&videoDefinition=high&key=${apiKey}`;

          const response = await fetch(url);
          const text = await response.text();
          let data: any = {};
          try {
            data = JSON.parse(text);
          } catch (e) {
            console.error("YouTube API response was not JSON:", text);
          }

          if (data && data.items && data.items.length > 0) {
            videoId = data.items[0].id.videoId;
          } else if (data && data.error) {
            console.error("YouTube API Error from Google:", data.error.message || data.error);
          }
        } catch (apiErr) {
          console.error("YouTube API Key request failed:", apiErr);
        }
      }

      // Fallback: If no API Key was provided OR the API key limit was exceeded / search yielded nothing
      if (!videoId) {
        try {
          console.log(`No active YouTube API key or key failed. Searching public YouTube results for "${query} trailer"...`);
          const scrapeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + " trailer")}`;
          const scrapeResponse = await fetch(scrapeUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Accept-Language": "en-US,en;q=0.9"
            }
          });
          if (scrapeResponse.ok) {
            const html = await scrapeResponse.text();
            
            // Try matching initialData standard JSON format "videoId":"[11 chars]"
            const videoIdMatch = html.match(/"videoId"\s*:\s*"([a-zA-Z0-9_-]{11})"/);
            if (videoIdMatch && videoIdMatch[1]) {
              videoId = videoIdMatch[1];
              console.log(`Successfully parsed YouTube videoId from results JSON: ${videoId}`);
            } else {
              // Try alternate regex looking for standard watch links in text
              const watchMatch = html.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/);
              if (watchMatch && watchMatch[1]) {
                videoId = watchMatch[1];
                console.log(`Successfully parsed YouTube videoId from results watch: ${videoId}`);
              }
            }
          }
        } catch (scrapeErr) {
          console.error("YouTube search scrape fallback failed:", scrapeErr);
        }
      }

      // Last-resort fallback to a reliable general movie trailer
      if (!videoId) {
        console.warn("Using fallback video ID static default.");
        videoId = "aqz-KE-bpKQ"; // Big Buck Bunny
      }

      res.json({ videoId });
    } catch (error) {
      console.error("YouTube API Proxy Error:", error);
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
