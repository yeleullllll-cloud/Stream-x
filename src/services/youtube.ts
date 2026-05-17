export async function fetchTrailerVideoId(title: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/youtube/trailer?query=${encodeURIComponent(title)}`);
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data.videoId || null;
  } catch (error) {
    console.error("Failed to fetch trailer", error);
    return null;
  }
}
