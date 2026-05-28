export const getYouTubeApiKey = () => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('YOUTUBE_API_KEY');
    if (local) return local;
  }
  return '';
};

export async function fetchTrailerVideoId(title: string): Promise<string | null> {
  try {
    const apiKey = getYouTubeApiKey();
    const url = `/api/youtube/trailer?query=${encodeURIComponent(title)}${apiKey ? `&key=${apiKey}` : ''}`;
    const res = await fetch(url);
    const text = await res.text();
    
    if (!res.ok) {
      if (res.status === 400) {
        try {
          const errorData = JSON.parse(text);
          console.error("YouTube API rejected request:", errorData);
          alert(`YouTube API Error: ${errorData.error || 'Check console'}`);
        } catch (e) {
          console.error("YouTube API rejected request, not JSON:", text);
        }
      }
      return null;
    }
    
    try {
      const data = JSON.parse(text);
      return data.videoId || null;
    } catch (e) {
      console.error("Failed to parse trailer JSON, received:", text);
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch trailer", error);
    return null;
  }
}
