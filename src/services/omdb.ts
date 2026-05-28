export const DEFAULT_OMDB_KEYS = [
  '7bed534b',
  'a0e3805f',
  '263af1d4',
  'e9491fb1',
  'f4227318',
  '9a35e612',
  'b28b78cf'
];

let currentKeyIndex = 0;

export const getOMDBApiKey = () => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('OMDB_API_KEY');
    if (local) return local;
  }
  return (import.meta as any).env?.VITE_OMDB_API_KEY || DEFAULT_OMDB_KEYS[currentKeyIndex];
};

export const rotateOMDBKey = () => {
  if (typeof window !== 'undefined' && localStorage.getItem('OMDB_API_KEY')) {
    return false;
  }
  if ((import.meta as any).env?.VITE_OMDB_API_KEY) {
    return false;
  }
  currentKeyIndex = (currentKeyIndex + 1) % DEFAULT_OMDB_KEYS.length;
  console.log(`OMDB key rotated to index ${currentKeyIndex}: ${DEFAULT_OMDB_KEYS[currentKeyIndex]}`);
  return true;
};

export const OMDB_API_URL = 'https://www.omdbapi.com/';

export async function fetchOMDB(queryParams: string): Promise<any> {
  const maxRetries = DEFAULT_OMDB_KEYS.length;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const key = getOMDBApiKey();
    const url = `${OMDB_API_URL}?apikey=${key}&${queryParams}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`OMDb HTTP error ${res.status}`);
      }
      const data = await res.json();
      if (data && data.Response === 'False' && (data.Error === 'Request limit reached!' || data.Error?.toLowerCase().includes('limit') || data.Error?.toLowerCase().includes('key'))) {
        console.warn(`OMDB API key limit hit for key: ${key}. Error: ${data.Error}. Rotating key...`);
        const rotated = rotateOMDBKey();
        if (!rotated) {
          return data;
        }
        continue;
      }
      return data;
    } catch (err) {
      console.error(`OMDB fetch attempt ${attempt + 1} failed:`, err);
      const rotated = rotateOMDBKey();
      if (!rotated) {
        throw err;
      }
    }
  }
  throw new Error("All OMDB API keys exhausted or failed.");
}

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

export function mapOMDBToMovie(omdb: OMDBMovie, seasonsData?: any[]): Movie {
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
  
  const isTV = omdb.Type === 'series';

  let seasons = undefined;
  if (isTV) {
    if (seasonsData && seasonsData.length > 0) {
      // Map real real season data from OMDB API
      seasons = seasonsData
        .filter(s => s && s.Response === 'True' && s.Episodes && s.Episodes.length > 0)
        .map(s => {
          const sNum = parseInt(s.Season || '1', 10);
          return {
            id: `s${sNum}`,
            seasonNumber: sNum,
            episodes: s.Episodes.map((ep: any, index: number) => {
              const epNum = parseInt(ep.Episode || `${index + 1}`, 10);
              const realTitle = ep.Title || `Episode ${epNum}`;
              return {
                id: `s${sNum}e${epNum}`,
                episodeNumber: epNum,
                title: realTitle,
                duration: `${Math.floor(Math.random() * 20) + 40}m`,
                poster: `https://image.pollinations.ai/prompt/${encodeURIComponent(`${omdb.Title} tv series season ${sNum} episode ${epNum} ${realTitle} cinematic scene`)}?width=640&height=360&nologo=true&seed=${ep.imdbID}`,
                description: `Season ${sNum}, Episode ${epNum}: ${realTitle}. Rating: ${ep.imdbRating || 'N/A'}`
              }
            })
          };
        });
    } else {
      // Fallback: Generate mock seasons for TV series if details aren't passed
      let parsedSeasons = parseInt((omdb as any).totalSeasons || (omdb as any).TotalSeasons, 10);
      const numSeasons = isNaN(parsedSeasons) ? (Math.floor(Math.random() * 5) + 5) : parsedSeasons; // Fallback to 5-9 seasons if missing
      
      seasons = Array.from({ length: numSeasons > 0 ? numSeasons : 1 }, (_, i) => {
        const sNum = i + 1;
        const numEpisodes = Math.floor(Math.random() * 8) + 12; // 12-19 episodes
        return {
          id: `s${sNum}`,
          seasonNumber: sNum,
          episodes: Array.from({ length: numEpisodes }, (_, j) => {
            const epNum = j + 1;
            return {
              id: `s${sNum}e${epNum}`,
              episodeNumber: epNum,
              title: `Episode ${epNum}`,
              duration: `${Math.floor(Math.random() * 20) + 40}m`,
              poster: `https://image.pollinations.ai/prompt/${encodeURIComponent(`${omdb.Title} tv series season ${sNum} episode ${epNum} cinematic scene`)}?width=640&height=360&nologo=true&seed=${omdb.imdbID}${sNum}${epNum}`,
              description: `This is a placeholder description for Episode ${epNum} of Season ${sNum}. The stakes are higher than ever in this thrilling chapter of ${omdb.Title}.`
            }
          })
        };
      });
    }
  }

  return {
    id: omdb.imdbID,
    title: omdb.Title,
    poster: posterUrl,
    backdrop: backdropUrl,
    logo: posterUrl,
    description: omdb.Plot && omdb.Plot !== 'N/A' ? omdb.Plot : 'No description available.',
    type: (isTV ? 'tv' : omdb.Type === 'movie' ? 'movie' : 'movie') as any,
    isTrending: false,
    genre: omdb.Genre && omdb.Genre !== 'N/A' ? omdb.Genre.split(', ') : [],
    quality: 'HD',
    rating: parseFloat(omdb.imdbRating || '0') || 7.0,
    year: parseInt(omdb.Year) || new Date().getFullYear(),
    seasons
  };
}

export async function searchMovies(query: string, maxResults: number = 20): Promise<Movie[]> {
  if (!query) return [];
  try {
    let queriesToTry = [query];
    try {
      const predictRes = await fetch(`/api/search/predict?q=${encodeURIComponent(query)}`);
      if (predictRes.ok) {
        const predictData = await predictRes.json();
        if (predictData.titles && predictData.titles.length > 0) {
          // Add predicted titles to our search queries (max 2 to avoid spamming OMDB)
          predictData.titles.slice(0, 2).forEach((t: string) => {
             if (t.toLowerCase() !== query.toLowerCase() && !queriesToTry.includes(t)) {
                queriesToTry.push(t);
             }
          });
        }
      }
    } catch (e) {
      console.error("Prediction fetch failed", e);
    }

    const fetchPage = async (page: number, q: string) => {
      return await fetchOMDB(`s=${encodeURIComponent(q)}&page=${page}`) as OMDBSearchResponse;
    };

    let allResults: OMDBMovie[] = [];
    let exactMatch: OMDBMovie | null = null;

    for (const q of queriesToTry) {
        if (allResults.length >= maxResults) break;

        const firstPage = await fetchPage(1, q);
        let currentResults = firstPage.Search || [];
        
        if (!exactMatch) {
            try {
              const exactData = await fetchOMDB(`t=${encodeURIComponent(q)}&plot=short`);
              if (exactData && exactData.Response === 'True' && exactData.Poster && exactData.Poster !== 'N/A') {
                exactMatch = exactData;
              }
            } catch {
              // Ignore errors for exact match
            }
        }

        if (firstPage && firstPage.Response === 'True' && currentResults.length > 0) {
          if (currentResults.length < maxResults && parseInt(firstPage.totalResults || '0') > 10) {
            const secondPage = await fetchPage(2, q);
            if (secondPage && secondPage.Response === 'True' && secondPage.Search) {
              currentResults = [...currentResults, ...secondPage.Search];
            }
          }
          allResults = [...allResults, ...currentResults];
        }
    }

    if (allResults.length > 0 || exactMatch) {
      // Filter out items without posters and non-movie/series
      allResults = allResults.filter(m => m && m.Poster !== 'N/A' && (m.Type === 'movie' || m.Type === 'series'));

      // Remove duplicates by imdbID
      const uniqueOMDB = Array.from(new Map(allResults.map(m => [m.imdbID, m])).values());
      allResults = uniqueOMDB;

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
            const detailData = await fetchOMDB(`i=${movie.imdbID}&plot=short`);
            if (!detailData || detailData.Response === 'False') return mapOMDBToMovie(movie);
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
    'tt0499549', 'tt1630029', 'tt10857160', 'tt15314262', 'tt8111088', 'tt10676048', 'tt14230458', 'tt27802490', 'tt2356777', // Avatar, Mandalorian, etc.
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
    'tt0409591', 'tt2560140', 'tt0315465', 'tt4508902', 'tt0877057', 'tt2098220', 'tt1910272', 'tt0112159', 'tt0388629', 
    'tt0214341', 'tt0245429', 'tt12343534', 'tt0434665', 'tt5626028' // Naruto, AOT, Demon Slayer, OPM, Death Note, HxH, Steins Gate, Evangelion, One Piece...
  ]
};

export async function getMovieDetails(imdbID: string): Promise<Movie | null> {
  try {
    const data: OMDBMovie = await fetchOMDB(`i=${imdbID}&plot=full`);
    if (data && data.Response === 'True') {
      const isTV = data.Type === 'series';
      let seasonsData: any[] = [];
      
      if (isTV) {
         let parsedSeasons = parseInt((data as any).totalSeasons || (data as any).TotalSeasons, 10);
         const numSeasons = isNaN(parsedSeasons) ? 1 : parsedSeasons;
         // Fetch all seasons in parallel
         const maxSeasons = Math.min(numSeasons, 15);
         const seasonPromises = [];
         for (let sNum = 1; sNum <= maxSeasons; sNum++) {
            seasonPromises.push(
               fetchOMDB(`i=${imdbID}&Season=${sNum}`)
                 .catch(() => null)
            );
         }
         seasonsData = await Promise.all(seasonPromises);
      }

      return mapOMDBToMovie(data, seasonsData);
    }
    return null;
  } catch (error) {
    console.error("OMDB Detail Error", error);
    return null;
  }
}
