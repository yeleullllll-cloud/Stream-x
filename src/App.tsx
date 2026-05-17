/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MovieGrid } from './components/MovieGrid';
import { MovieCard } from './components/MovieCard';
import { Top10Grid } from './components/Top10Grid';
import { PlatformGrid } from './components/PlatformGrid';
import { MovieModal } from './components/MovieModal';
import { type Movie } from './types';
import { searchMovies, getMovieDetails, getCuratedMovies, CURATED_LISTS } from './services/omdb';
import { useAuth } from './lib/AuthContext';
import { subscribeToWatchlist } from './services/watchlist';

export default function App() {
  const { user, login, logout } = useAuth();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [startPlaying, setStartPlaying] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<'Home' | 'Movies' | 'TV' | 'Anime' | 'Search' | 'MyList' | 'Profile'>('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [homeMovies, setHomeMovies] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<Movie[]>([]);
  const [animeList, setAnimeList] = useState<Movie[]>([]);
  const [myWatchlist, setMyWatchlist] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        
        const [hRes, trRes, tRes, aRes] = await Promise.all([
          getCuratedMovies(CURATED_LISTS.trending),
          getCuratedMovies(CURATED_LISTS.topRated),
          getCuratedMovies(CURATED_LISTS.series),
          getCuratedMovies(CURATED_LISTS.anime)
        ]);
        setHomeMovies(hRes);
        setTopRated(trRes);
        setTvShows(tRes);
        setAnimeList(aRes);
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    const unsub = subscribeToWatchlist((movies) => {
      setMyWatchlist(movies);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (activeCategory === 'Search' && searchQuery.trim().length > 2) {
      const delayDebounceFn = setTimeout(async () => {
        setIsSearching(true);
        const results = await searchMovies(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, activeCategory]);

  const handleMovieClick = async (movie: Movie, play: boolean = false) => {
    setStartPlaying(play);
    if (movie.id.startsWith('tt')) { // OMDB movies start with 'tt'
      const details = await getMovieDetails(movie.id);
      if (details) {
        setSelectedMovie(details);
        return;
      }
    }
    setSelectedMovie(movie);
  };

  let activeMovies = homeMovies;
  if (activeCategory === 'Home') {
    // Create a mixed array for the Hero
    activeMovies = [];
    const maxLen = Math.max(homeMovies.length, tvShows.length, animeList.length);
    for (let i = 0; i < maxLen; i++) {
      if (homeMovies[i]) activeMovies.push(homeMovies[i]);
      if (tvShows[i]) activeMovies.push(tvShows[i]);
      if (animeList[i]) activeMovies.push(animeList[i]);
    }
  } else if (activeCategory === 'Movies') {
    activeMovies = homeMovies;
  } else if (activeCategory === 'TV') {
    activeMovies = tvShows;
  } else if (activeCategory === 'Anime') {
    activeMovies = animeList;
  } else if (activeCategory === 'MyList') {
    activeMovies = myWatchlist;
  }

  const trendingActive = activeMovies.slice(0, 5); // Just take a few for the hero

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
        <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-black text-white font-sans relative">
      <Navbar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <main className="flex-1 w-full pb-10">
        {(activeCategory === 'Home' || activeCategory === 'Movies' || activeCategory === 'TV' || activeCategory === 'Anime') && (
          <>
            <Hero movies={trendingActive.length > 0 ? trendingActive : activeMovies} onMovieClick={handleMovieClick} />
            
            {activeCategory === 'Home' && (
               <>
                 <Top10Grid movies={topRated} onMovieClick={handleMovieClick} />
                 <MovieGrid title="Trending Movies" movies={homeMovies.slice(5)} onMovieClick={handleMovieClick} />
                 <MovieGrid title="Trending TV Shows" movies={tvShows.slice(5)} onMovieClick={handleMovieClick} />
                 <MovieGrid title="Top Rated Anime" movies={animeList.slice(5)} onMovieClick={handleMovieClick} />
                 <PlatformGrid movies={homeMovies} />
               </>
            )}

            {activeCategory === 'Movies' && (
               <>
                 <MovieGrid title="Trending Movies" movies={homeMovies.slice(5)} onMovieClick={handleMovieClick} />
                 <MovieGrid title="Top Rated Movies" movies={topRated} onMovieClick={handleMovieClick} />
               </>
            )}

            {activeCategory === 'TV' && (
               <>
                 <MovieGrid title="Popular TV Shows" movies={tvShows.slice(5)} onMovieClick={handleMovieClick} />
               </>
            )}

            {activeCategory === 'Anime' && (
               <>
                 <MovieGrid title="Top Anime" movies={animeList.slice(5)} onMovieClick={handleMovieClick} />
               </>
            )}
          </>
        )}
        
        {activeCategory === 'Search' && (
          <div className="pt-32 px-10 max-w-[1600px] mx-auto min-h-[80vh]">
            <h2 className="text-3xl font-bold mb-8">Search</h2>
            <div className="relative mb-12">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, TV shows, anime..." 
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-2xl px-6 py-4 text-white text-lg focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            {isSearching ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : searchResults.length > 0 ? (
               <div className="mb-12">
                 <h3 className="text-xl font-bold mb-6">Search Results</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                   {searchResults.map((movie) => (
                     <div key={movie.id} className="flex flex-col gap-2">
                       <MovieCard movie={movie} onMovieClick={handleMovieClick} />
                       <div className="flex items-center justify-between text-sm text-gray-400 px-1">
                         <span>{movie.year}</span>
                         {movie.rating ? <span className="flex items-center gap-1 text-xs">⭐ {movie.rating}</span> : null}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            ) : searchQuery.trim().length > 2 ? (
               <p className="text-gray-400 text-center py-12">No results found for "{searchQuery}"</p>
            ) : (
               <MovieGrid title="Suggested for you" movies={homeMovies} onMovieClick={handleMovieClick} />
            )}
          </div>
        )}

         {activeCategory === 'MyList' && (
          <div className="pt-32 px-10 max-w-[1600px] mx-auto min-h-[80vh]">
             <h2 className="text-3xl font-bold mb-8">My List</h2>
             {!user ? (
               <div className="text-center py-20">
                 <h3 className="text-2xl font-bold mb-4">Sign in to view your list</h3>
                 <button onClick={login} className="mt-4 bg-[#E50914] hover:bg-[#F40612] text-white px-8 py-3 rounded-xl font-semibold transition-colors">Sign in</button>
               </div>
             ) : activeMovies.length > 0 ? (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                 {activeMovies.map((movie) => (
                   <div key={movie.id}>
                     <MovieCard movie={movie} onMovieClick={handleMovieClick} />
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-gray-400">Your list is empty. Add movies and TV shows to watch them later.</p>
             )}
          </div>
        )}

        {activeCategory === 'Profile' && (
          <div className="pt-32 px-10 max-w-[1600px] mx-auto min-h-[80vh]">
             <h2 className="text-3xl font-bold mb-8">Account Profile</h2>
             {user ? (
               <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 p-8 max-w-2xl mb-8">
                 <div className="flex items-center gap-6 mb-8">
                   {user.photoURL ? (
                     <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                   ) : (
                     <div className="w-24 h-24 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl font-bold uppercase">
                       {user.email?.[0] || 'U'}
                     </div>
                   )}
                   <div>
                     <h3 className="text-2xl font-bold">{user.displayName || 'User'}</h3>
                     <p className="text-gray-400">{user.email}</p>
                   </div>
                 </div>
                 <div className="space-y-4 border-t border-white/10 pt-6">
                   <button className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl transition-colors">Settings</button>
                   <button className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl transition-colors">Billing</button>
                   <button onClick={logout} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-red-500">Sign Out</button>
                 </div>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center bg-[#1A1A1A] rounded-2xl border border-white/10 p-8 max-w-2xl mx-auto mb-8">
                 <h3 className="text-2xl font-bold mb-4">Sign in to StreamX</h3>
                 <p className="text-gray-400 mb-8 text-center">Save your favorite movies and TV shows, and access your account across all devices.</p>
                 <button 
                   onClick={login}
                   className="bg-[#E50914] hover:bg-[#F40612] text-white px-8 py-4 rounded-xl font-semibold transition-colors text-lg w-full max-w-md"
                 >
                   Sign in with Google
                 </button>
               </div>
             )}

             <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 p-8 max-w-2xl mx-auto md:mx-0">
               <h3 className="text-2xl font-bold mb-4">API Configuration</h3>
               <p className="text-gray-400 mb-6 text-sm">
                 If search or movie data is not loading, the built-in API quota might have been exceeded. 
                 You can provide your own OMDB API key for uninterrupted access.
               </p>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-400 mb-2">OMDB API Key</label>
                   <div className="flex gap-4">
                     <input 
                       type="password" 
                       id="omdb-api-key"
                       placeholder="e.g. 7bed534b"
                       className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                       defaultValue={localStorage.getItem('OMDB_API_KEY') || ''}
                     />
                     <button 
                       onClick={() => {
                         const val = (document.getElementById('omdb-api-key') as HTMLInputElement).value;
                         if (val) {
                           localStorage.setItem('OMDB_API_KEY', val);
                           alert('OMDB API Key saved successfully! Reloading...');
                           window.location.reload();
                         } else {
                           localStorage.removeItem('OMDB_API_KEY');
                           alert('OMDB API Key cleared. Reloading...');
                           window.location.reload();
                         }
                       }}
                       className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                     >
                       Save
                     </button>
                   </div>
                   <p className="mt-2 text-xs text-gray-500">Get a free key at <a href="https://www.omdbapi.com/apikey.aspx" target="_blank" className="text-white hover:underline">omdbapi.com</a>.</p>
                 </div>
               </div>
             </div>
          </div>
        )}
      </main>
      <MovieModal 
         movie={selectedMovie} 
         startPlaying={startPlaying} 
         onClose={() => setSelectedMovie(null)} 
         isInWatchlist={selectedMovie ? myWatchlist.some(m => m.id === selectedMovie.id) : false}
      />
    </div>
  );
}
