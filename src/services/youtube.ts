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
    if (!res.ok) {
      if (res.status === 400) {
        const errorData = await res.json();
        console.error("YouTube API rejected request:", errorData);
        alert(`YouTube API Error: ${errorData.error || 'Check console'}`);
      }
      return null;
    }
    const data = await res.json();
    return data.videoId || null;
  } catch (error) {
    console.error("Failed to fetch trailer", error);
    return null;
  }
}
