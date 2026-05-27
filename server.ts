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
      const { query, key, imdbId } = req.query;

      // 1. Attempt to fetch the official trailer from the original source using IMDb ID
      if (imdbId && typeof imdbId === "string") {
        try {
          const kcResponse = await fetch(`https://api.kinocheck.com/movies?imdb_id=${imdbId}&language=en`);
          if (kcResponse.ok) {
            const kcData = await kcResponse.json();
            if (kcData && kcData.trailer && kcData.trailer.youtube_video_id) {
              console.log(`Successfully retrieved official trailer from KinoCheck: ${kcData.trailer.youtube_video_id}`);
              return res.json({ videoId: kcData.trailer.youtube_video_id });
            }
          }
        } catch (kcErr) {
          console.warn("Failed to fetch from KinoCheck proxy:", kcErr);
        }
      }

      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query is required" });
      }

      const apiKey = key || process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        // Smart fallback: Use a curated list of popular movie trailers
        console.warn("No YOUTUBE_API_KEY provided. Using smart fallback trailer.");
        
        // Map of popular movies to their actual trailer IDs
        const fallbackTrailers: Record<string, string> = {
          'avatar': 'd9MyW72ELq0',
          'inception': 'YoHD9XEInc0',
          'interstellar': 'zSWdZVtXT7E',
          'dark knight': 'EXeTwQWrcwY',
          'avengers': 'eOrNdBpGMv8',
          'spider-man': 'JfVOs4VSpmA',
          'iron man': '8ugaeA-nMTc',
          'thor': 'Go8nTmfrQd8',
          'black panther': 'xjDjIWPwcPU',
          'guardians': 'd96cjJhvlMA',
          'captain america': 'W4DlMggBPvc',
          'doctor strange': 'HSzx-zryEgM',
          'ant-man': 'pWdKf3MneyI',
          'deadpool': 'ONHBaC-pfsk',
          'wolverine': 'Yd47Z8HYf0Y',
          'x-men': 'gwG4oAKzEQQ',
          'fantastic four': 'NYnQnNL_Ndk',
          'batman': 'mqqft2x_Aa4',
          'superman': '1Q8fG0TtVAY',
          'wonder woman': 'VSB4wGIdDwo',
          'aquaman': 'WDkg3h8PCVU',
          'shazam': 'go6GEIrcvFY',
          'joker': 'zAGVQLHvwOY',
          'matrix': 'm8e-FF8MsqU',
          'john wick': 'C0BMx-qxsP4',
          'fast': 'aSiDu3Ywi8E',
          'mission impossible': 'wb49-oV0F78',
          'james bond': 'BIhNsAtPbPI',
          'star wars': 'sGbxmsDFVnE',
          'star trek': 'wgeEvRWfSKI',
          'lord of the rings': 'V75dMMIW2B4',
          'hobbit': 'SDnYMbYB-nU',
          'harry potter': 'VyHV0BRtdxo',
          'jurassic': 'QWBKEmWWL2k',
          'transformers': 'tP7JKbC-kGI',
          'terminator': 'jNU_jrPxs-0',
          'alien': 'LjLamj-b0I8',
          'predator': 'WaG1KZqrLvM',
          'dune': '8g18jFHCLXk',
          'blade runner': 'gCcx85zbxz4',
          'mad max': 'hEJnMQG9ev8',
          'gladiator': 'owK1qxDselE',
          'troy': 'znWGBUjKu5Y',
          '300': 'UrIbxk7idYA',
          'braveheart': '1NJO0jxBtMo',
          'titanic': 'kVrqfYjkTdQ',
          'avatar way of water': 'd9MyW72ELq0',
          'top gun': 'qSqVVswa420',
          'breaking bad': 'HhesaQXLuRY',
          'game of thrones': 'KPLWWIOCOOQ',
          'stranger things': 'b9EkMc79ZSU',
          'the boys': '06YT7bJQ1jc',
          'mandalorian': 'aOC8E8z_ifw',
          'witcher': 'ndl1W4ltcmg',
          'house of dragon': 'DotnJ7tTA34',
          'rings of power': 'x8UAUAuKNcU',
          'wednesday': 'Di310WS8zLk',
          'last of us': 'uLtkt4BXAkk',
          'fallout': 'V-mugKDQDlg',
          'oppenheimer': 'uYPbbksJxIg',
          'barbie': 'pBk4NYhWNMM',
          'dune 2': 'Way9Dexny3w',
          'deadpool 3': '73_1biulkYk',
          'gladiator 2': 'Ts0N8swyWFI',
          'wicked': 'fRiscUX5Qzk',
          'moana 2': 'hBZ0reCT8Hw',
          'inside out 2': 'LEjhY15eCx0',
          'kung fu panda 4': 'QhKxx8yT4Aw',
          'despicable me 4': 'qQlr9-rF32k',
          'sonic 3': 'qSu6i2iFMO0',
          'mufasa': 'o17MF9vnabg',
          'snow white': 'TdGYcAm4Nl4',
          'captain america brave new world': 'Ht-YLmVCJXs',
          'thunderbolts': 'Ht-YLmVCJXs',
          'fantastic four first steps': 'NYnQnNL_Ndk',
          'superman legacy': '1Q8fG0TtVAY',
          'batman': 'mqqft2x_Aa4',
          'naruto': 'j2hiC9BmJlQ',
          'attack on titan': 'LHtdKWJdif4',
          'demon slayer': '6vMuWuWlW4I',
          'one piece': 'Ades3pQbeh8',
          'my hero academia': 'D5fYOnwYkj4',
          'jujutsu kaisen': 'pkKu9hLT-t8',
          'chainsaw man': 'v4yLeNt-kCU',
          'spy family': 'U_rWZK_8vUY',
          'bleach': 'e8YBesRKq_U',
          'dragon ball': 'R1tLEyz_7Vw',
        };
        
        // Find matching trailer
        const queryLower = query.toLowerCase();
        for (const [key, videoId] of Object.entries(fallbackTrailers)) {
          if (queryLower.includes(key)) {
            return res.json({ videoId });
          }
        }
        
        // Ultimate fallback - a generic cinematic trailer
        return res.json({ videoId: 'd9MyW72ELq0' }); // Avatar trailer as default
      }

      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query + " official trailer"
      )}&maxResults=1&type=video&videoEmbeddable=true&videoDefinition=high&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.error("YouTube API Error from Google:", data.error.message);
        return res.status(400).json({ error: data.error.message, code: data.error.code });
      }

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
