import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { type Movie } from '../types';
import { cn } from '../lib/utils';

interface HeroProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie, startPlaying?: boolean) => void;
}

export function Hero({ movies, onMovieClick }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroMovies = movies.slice(0, 5);

  useEffect(() => {
    setCurrentIndex(0);
  }, [movies]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 8000); // Auto advances every 8 seconds
    return () => clearInterval(timer);
  }, [heroMovies.length]);

  const currentMovie = heroMovies[currentIndex];

  if (!currentMovie) {
    return null;
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
  };

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] lg:h-[85vh] shrink-0 flex flex-col justify-end bg-[#050505] overflow-hidden font-sans group">
      
      {/* Abstract Ambient Background */}
      <AnimatePresence initial={false}>
        <motion.img
          key={`bg-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          src={currentMovie.backdrop}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-[100px] scale-[1.2] opacity-40 saturate-150 pointer-events-none"
          onError={(e) => {
            (e.target as HTMLImageElement).src = currentMovie.poster;
          }}
        />
      </AnimatePresence>
        
      {/* Gradients to smoothly merge right and bottom edges with the background */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10 w-full md:w-3/4 pointer-events-none" />
      <div className="absolute inset-y-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 h-3/4 flex mt-auto pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto flex flex-col md:flex-row items-center md:items-end pb-12 sm:pb-20 lg:pb-32 px-6 sm:px-10 lg:px-16 gap-8 sm:gap-12 lg:gap-20">
        
        {/* Text and Actions */}
        <div className="flex-1 w-full max-w-3xl flex flex-col relative z-20 pt-20 md:pt-0">
          <AnimatePresence mode="wait">
            <motion.div 
              key={`content-${currentIndex}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full flex flex-col"
            >
              {/* Type tag */}
              <div className="mb-4">
                 <span className="text-white/70 font-bold tracking-[0.2em] uppercase text-xs sm:text-sm flex items-center gap-2">
                   <div className="w-8 h-px bg-yellow-500"></div>
                   {currentMovie.type === 'tv' ? 'Series' : 'Movie'}
                 </span>
              </div>

              <h1 className="mb-4 max-w-4xl text-left leading-[1.05] break-words text-white text-5xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tighter drop-shadow-2xl selection:bg-yellow-500/30">
                {currentMovie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-semibold text-white/80 mb-6 mt-2">
                 <span className="text-yellow-400 flex items-center gap-1 drop-shadow-md bg-white/5 px-2 py-1 rounded-md border border-white/5">★ {currentMovie.rating}</span>
                 <span className="bg-white/5 px-2 py-1 rounded-md border border-white/5">{currentMovie.year}</span>
                 {currentMovie.quality && <span className="px-2 py-1 bg-white/10 rounded-md border border-white/10 uppercase tracking-wider">{currentMovie.quality}</span>}
                 {currentMovie.seasons && <span className="bg-white/5 px-2 py-1 rounded-md border border-white/5">{currentMovie.seasons.length} Seasons</span>}
                 <span className="text-white/60 ml-2">{currentMovie.genre?.join(' • ')}</span>
              </div>

              <p className="text-sm sm:text-base lg:text-lg font-normal text-white/70 max-w-2xl leading-relaxed drop-shadow-lg line-clamp-3 md:line-clamp-4 mb-8">
                {currentMovie.description}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => onMovieClick?.(currentMovie, true)}
                  className="bg-white text-black px-8 py-3.5 sm:px-10 rounded-full font-bold flex items-center gap-3 hover:bg-gray-200 transition-colors duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  <Play className="w-5 h-5 fill-current" /> Play Now
                </button>
                <button 
                  onClick={() => onMovieClick?.(currentMovie)}
                  className="bg-white/10 backdrop-blur-md text-white px-8 py-3.5 sm:px-10 rounded-full font-semibold flex items-center gap-3 hover:bg-white/20 transition-colors duration-300 hover:scale-105 active:scale-95 border border-white/10"
                >
                  <Info className="w-5 h-5" /> More Info
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Poster (Right Side) */}
        <div className="hidden md:block w-56 lg:w-80 xl:w-[400px] shrink-0 z-30 perspective-1000 mb-4 lg:mb-8 pt-10">
          <AnimatePresence mode="wait">
            <motion.div 
              key={`poster-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.85, rotateY: 20, x: 40 }}
              animate={{ opacity: 1, scale: 1, rotateY: -12, x: 0, rotateZ: 2 }}
              exit={{ opacity: 0, scale: 0.85, rotateY: -20, x: -40 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="relative rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(255,255,255,0.1)] border border-white/20 group cursor-pointer"
              onClick={() => onMovieClick?.(currentMovie)}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />
              <img 
                src={currentMovie.poster} 
                alt={currentMovie.title} 
                className="w-full aspect-[2/3] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-30 transition-opacity duration-500 z-0" />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Manual Navigation Controls */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/20 text-white/60 hover:bg-black/60 hover:text-white backdrop-blur-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hidden sm:block border border-white/10"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/20 text-white/60 hover:bg-black/60 hover:text-white backdrop-blur-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hidden sm:block border border-white/10"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Interactive Progress Slider */}
      <div className="absolute bottom-6 left-0 right-0 z-40 w-full px-6 sm:px-10 lg:px-16 mx-auto max-w-[1600px] flex gap-2 h-1 pointer-events-none">
         {heroMovies.map((_, index) => (
           <div 
             key={index}
             onClick={() => setCurrentIndex(index)}
             className="flex-1 h-full bg-white/20 overflow-hidden cursor-pointer hover:bg-white/40 transition-colors duration-300 relative pointer-events-auto"
           >
             {index === currentIndex && (
               <motion.div 
                 key={`progress-${currentIndex}`}
                 initial={{ width: "0%" }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 8, ease: "linear" }}
                 onAnimationComplete={handleNext}
                 className="absolute inset-y-0 left-0 bg-white"
               />
             )}
             {index < currentIndex && (
               <div className="absolute inset-0 bg-white" />
             )}
           </div>
         ))}
      </div>
    </div>
  );
}

