export const OMDB_API_KEY = (import.meta as any).env?.VITE_OMDB_API_KEY || '7bed534b';
export const OMDB_API_URL = 'https://www.omdbapi.com/';

export interface OMDBMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  Plot?: string;
  Genre?: string;
  Runtime?: string;
  Director?: string;
  Actors?: string;
  imdbRating?: string;
  Response?: string;
}

export interface OMDBSearchResponse {
  Search: OMDBMovie[];
  totalResults: string;
  Response: string;
}

// Convert OMDB schema to our local Movie schema
import { type Movie } from '../types';

export function mapOMDBToMovie(omdb: OMDBMovie): Movie {
  const getHighQualityPoster = (url: string, isBackdrop: boolean = false) => {
    if (!url || url === 'N/A') return 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1920';
    // Split on _V1_ and append our own sizing correctly, because some have UX, CR, etc.
    const parts = url.split('_V1_');
    if (parts.length === 2) {
      if (isBackdrop) return `${parts[0]}_V1_SX1920.jpg`;
      return `${parts[0]}_V1_SX800.jpg`;
    }
    return url;
  };

  const posterUrl = getHighQualityPoster(omdb.Poster);
  const backdropUrl = getHighQualityPoster(omdb.Poster, true);

  return {
    id: omdb.imdbID,
    title: omdb.Title,
    poster: posterUrl,
    backdrop: backdropUrl,
    logo: posterUrl,
    description: omdb.Plot && omdb.Plot !== 'N/A' ? omdb.Plot : 'No description available.',
    type: (omdb.Type === 'series' ? 'tv' : omdb.Type === 'movie' ? 'movie' : 'movie') as any,
    isTrending: false,
    genre: omdb.Genre && omdb.Genre !== 'N/A' ? omdb.Genre.split(', ') : [],
    quality: 'HD',
    rating: parseFloat(omdb.imdbRating || '0') || 7.0,
    year: parseInt(omdb.Year) || new Date().getFullYear()
  };
}

export async function searchMovies(query: string, maxResults: number = 20): Promise<Movie[]> {
  if (!query) return [];
  try {
    const fetchPage = async (page: number) => {
      const res = await fetch(`${OMDB_API_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&page=${page}`);
      return await res.json() as OMDBSearchResponse;
    };

    const firstPage = await fetchPage(1);
    let allResults = firstPage.Search || [];

    // Attempt an exact title match to get the most relevant one
    let exactMatch: OMDBMovie | null = null;
    try {
      const exactRes = await fetch(`${OMDB_API_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(query)}&plot=short`);
      const exactData = await exactRes.json();
      if (exactData.Response === 'True' && exactData.Poster && exactData.Poster !== 'N/A') {
        exactMatch = exactData;
      }
    } catch {
      // Ignore errors for exact match
    }

    if ((firstPage.Response === 'True' && allResults.length > 0) || exactMatch) {
      if (firstPage.Response === 'True' && allResults.length < maxResults && parseInt(firstPage.totalResults || '0') > 10) {
        const secondPage = await fetchPage(2);
        if (secondPage.Response === 'True' && secondPage.Search) {
          allResults = [...allResults, ...secondPage.Search];
        }
      }

      // Filter out items without posters and non-movie/series
      allResults = allResults.filter(m => m.Poster !== 'N/A' && (m.Type === 'movie' || m.Type === 'series'));

      // Put exact match at the beginning and remove duplicates
      if (exactMatch) {
         allResults = allResults.filter(m => m.imdbID !== exactMatch!.imdbID);
         allResults.unshift(exactMatch);
      }

      const resultsToFetch = allResults.slice(0, maxResults);
      const detailedMovies = await Promise.all(
        resultsToFetch.map(async (movie) => {
          if (movie.Plot && movie.Genre) {
             return mapOMDBToMovie(movie);
          }
          try {
            const detailRes = await fetch(`${OMDB_API_URL}?apikey=${OMDB_API_KEY}&i=${movie.imdbID}&plot=short`);
            if (!detailRes.ok) return mapOMDBToMovie(movie);
            const detailData: OMDBMovie = await detailRes.json();
            return mapOMDBToMovie({ ...movie, ...detailData });
          } catch {
            return mapOMDBToMovie(movie);
          }
        })
      );
      // Filter out duplicate movies using a Map. OMDB sometimes returns duplicate ids
      const uniqueMovies = Array.from(new Map(detailedMovies.map(m => [m.id, m])).values());
      return uniqueMovies;
    }
    return [];
  } catch (error) {
    console.error("OMDB Search Error", error);
    return [];
  }
}

export async function getCuratedMovies(imdbIDs: string[], limit: number = 15): Promise<Movie[]> {
  // Remove duplicates, shuffle array and pick the top 'limit' items
  const uniqueIDs = Array.from(new Set(imdbIDs));
  const shuffled = [...uniqueIDs].sort(() => 0.5 - Math.random());
  const selectedIDs = shuffled.slice(0, limit);

  try {
    const movies = await Promise.all(
      selectedIDs.map(id => getMovieDetails(id))
    );
    return movies.filter((m): m is Movie => m !== null);
  } catch (e) {
    console.error("Failed to get curated movies", e);
    return [];
  }
}

export const CURATED_LISTS = {
  trending: [
    'tt15398776', 'tt1160419', 'tt10872600', 'tt2085059', 'tt1631634', 'tt1517268', 'tt9362722', 'tt10366206', 'tt15239678', // Originals
    'tt0499549', 'tt1630029', 'tt10857160', 'tt1115532', 'tt8111088', 'tt10676048', 'tt14230458', 'tt27802490', 'tt2356777', // Avatar, Mandalorian, etc.
    'tt12593682', 'tt0141842' // Bullet train, Sopranos
  ],
  topRated: [
    'tt0111161', 'tt0068646', 'tt0468569', 'tt0108052', 'tt0167260', 'tt1375666', 'tt0133093', 'tt0099685', 'tt0120737', // Originals
    'tt0066921', 'tt0109830', 'tt0076759', 'tt0080684', 'tt0241527', 'tt8503618', 'tt4154796' // Godfather 2, Forrest Gump, Star wars, Harry Potter, Hamilton, Avengers
  ],
  series: [
    'tt0903747', 'tt0944947', 'tt0472954', 'tt0386676', 'tt10048342', 'tt4574334', 'tt0141842', 'tt0455275', // Originals
    'tt1190634', 'tt0285331', 'tt0898266', 'tt2442560', 'tt3032476', 'tt0804503', 'tt1856010' // The Boys, 24, Big Bang Theory, Peaky Blinders, Better Call Saul, Mad Men, House of Cards
  ],
  anime: [
    'tt0988824', 'tt2560140', 'tt0203259', 'tt0092067', 'tt10444120', 'tt0436904', 'tt0374030', 'tt10313888', 'tt5626028', // Originals
    'tt1525413', 'tt2373281', 'tt0213338', 'tt3105408', 'tt9335498', 'tt4508902' // FMA Brotherhood, Sword Art, HunterxHunter, Cyberpunk, Demon Slayer
  ]
};

export async function getMovieDetails(imdbID: string): Promise<Movie | null> {
  try {
    const res = await fetch(`${OMDB_API_URL}?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=full`);
    const data: OMDBMovie = await res.json();
    if (data.Response === 'True') {
      return mapOMDBToMovie(data);
    }
    return null;
  } catch (error) {
    console.error("OMDB Detail Error", error);
    return null;
  }
}
