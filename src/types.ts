export interface Episode {
  id: string;
  episodeNumber?: number;
  title: string;
  duration: string;
  poster: string;
  description: string;
}

export interface Season {
  id: string;
  seasonNumber: number;
  episodes: Episode[];
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  quality: 'HD' | '4K';
  rating: number;
  poster: string;
  backdrop: string;
  logo: string;
  genre: string[];
  description: string;
  isTrending?: boolean;
  type?: 'movie' | 'tv' | 'anime';
  seasons?: Season[];
}
