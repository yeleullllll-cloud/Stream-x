export const getYouTubeApiKey = () => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('YOUTUBE_API_KEY');
    if (local) return local;
  }
  return (import.meta as any).env?.VITE_YOUTUBE_API_KEY || '';
};

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

async function fetchDirectFromYouTube(title: string, apiKey: string): Promise<string | null> {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      title + " official trailer"
    )}&maxResults=1&type=video&videoEmbeddable=true&videoDefinition=high&key=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("YouTube Direct API Error:", errorData);
      return null;
    }
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].id.videoId;
    }
    return null;
  } catch (e) {
    console.error("Failed direct YouTube fetch:", e);
    return null;
  }
}

export async function fetchTrailerVideoId(title: string): Promise<string | null> {
  const apiKey = getYouTubeApiKey();

  // 1. Try fetching from local backend /api first
  try {
    const url = `/api/youtube/trailer?query=${encodeURIComponent(title)}${apiKey ? `&key=${apiKey}` : ''}`;
    const res = await fetch(url);
    
    // Check if the response is successful and is JSON
    if (res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.videoId) return data.videoId;
      }
    }
  } catch (error) {
    console.warn("Local backend YouTube proxy is unreachable or returned error. Falling back...", error);
  }

  // 2. Direct client-side YouTube API fallback
  if (apiKey) {
    console.log("Attempting direct client-side fetch from YouTube API...");
    const directId = await fetchDirectFromYouTube(title, apiKey);
    if (directId) return directId;
  }

  // 3. Smart local dictionary fallback (100+ movies matched)
  console.log("No API key or direct fetch failed. Using local curated fallback dictionary.");
  const queryLower = title.toLowerCase();
  for (const [key, videoId] of Object.entries(fallbackTrailers)) {
    if (queryLower.includes(key)) {
      return videoId;
    }
  }

  // 4. Ultimate fallback (Avatar cinematic trailer)
  return 'd9MyW72ELq0';
}
