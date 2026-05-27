import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { type Movie } from '../types';
import { cn } from '../lib/utils';
import { fetchTrailerVideoId } from '../services/youtube';

interface HeroProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie, startPlaying?: boolean) => void;
}

export function Hero({ movies, onMovieClick }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerId, setTrailerId] = useState<string | null>(null);
  const [isTrailerReady, setIsTrailerReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const heroMovies = movies.slice(0, 5);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Water/glass effect values based on scroll
  const blurValue = useTransform(scrollY, [0, 500], [0, 40]);
  const scaleValue = useTransform(scrollY, [0, 500], [1, 1.05]);
  const yValue = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [movies]);

  const currentMovie = heroMovies[currentIndex];

  useEffect(() => {
    if (!currentMovie) return;
    let isMounted = true;
    setTrailerId(null);
    setIsTrailerReady(false);
    fetchTrailerVideoId(currentMovie.title).then(id => {
      if (isMounted && id) setTrailerId(id);
    });
    return () => { isMounted = false; };
  }, [currentMovie]);

  if (!currentMovie) {
    return null;
  }

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);

  const getTitleStyle = (movie: Movie) => {
    const charCodeSum = movie.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const styles: React.CSSProperties[] = [
      { fontFamily: 'var(--font-military)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'normal' },
      { fontFamily: 'var(--font-cinzel)', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 900 },
      { fontFamily: 'var(--font-staatliches)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'normal' },
      { fontFamily: 'var(--font-righteous)', textTransform: 'uppercase', letterSpacing: 'normal', fontWeight: 'normal' },
      { fontFamily: 'var(--font-serif)', fontStyle: 'italic', textTransform: 'none', letterSpacing: 'normal', fontWeight: 900 },
      { fontFamily: 'var(--font-marker)', textTransform: 'uppercase', letterSpacing: 'normal', fontWeight: 'normal' },
    ];
    return styles[charCodeSum % styles.length];
  };

  return (
    <div ref={containerRef} className="relative w-full h-[75vh] min-h-[500px] sm:h-[80vh] sm:min-h-[600px] lg:h-[95vh] shrink-0 flex flex-col justify-end overflow-hidden font-sans group">
      
      {/* Water Distortion Filter Definition */}
      <svg className="hidden">
        <filter id="water-distortion">
           <feTurbulence type="fractalNoise" baseFrequency="0.015 0.05" numOctaves="2" result="noise">
             <animate attributeName="baseFrequency" values="0.015 0.05; 0.025 0.06; 0.015 0.05" dur="10s" repeatCount="indefinite" />
           </feTurbulence>
           <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Abstract Ambient Background */}
      <motion.div 
        className="absolute inset-0 z-0 origin-center flex items-center justify-center overflow-hidden bg-black"
        style={{ scale: scaleValue, y: yValue }}
      >
        {trailerId && !isMobile && (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${trailerId}&vq=hd1080&enablejsapi=1`}
              onLoad={() => setTimeout(() => setIsTrailerReady(true), 1500)}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-1000 ${isTrailerReady ? 'opacity-80 saturate-[1.1]' : 'opacity-0'}`}
              style={{ width: "100vw", height: "56.25vw", minHeight: "100vh", minWidth: "177.77vh" }}
              allow="autoplay; encrypted-media"
              loading="lazy"
              title="Trailer"
            />
          </div>
        )}
        <AnimatePresence initial={false}>
          <motion.img
            key={`bg-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isTrailerReady && !isMobile ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            src={currentMovie.backdrop}
            alt=""
            className="absolute inset-0 w-full h-full object-cover saturate-[1.2] pointer-events-none"
            style={{ filter: "url(#water-distortion)" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = currentMovie.poster;
            }}
          />
        </AnimatePresence>
      </motion.div>
        
      {/* Scroll blur overlay for water-like transition to content */}
      <motion.div 
        className="absolute inset-0 z-10 pointer-events-none bg-black/20"
        style={{ backdropFilter: useTransform(blurValue, v => `blur(${v}px)`) }}
      />

      {/* Edge Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 w-full md:w-3/4 pointer-events-none" />
      <div className="absolute inset-y-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 h-3/4 flex mt-auto pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto flex flex-col md:flex-row items-center md:items-end pb-12 sm:pb-24 lg:pb-32 px-4 sm:px-10 lg:px-16 gap-8 sm:gap-12 lg:gap-20">
        
        {/* Text and Actions */}
        <div className="flex-1 w-full max-w-3xl flex flex-col relative z-20 pt-20 md:pt-0">
          <AnimatePresence mode="wait">
            <motion.div 
              key={`content-${currentIndex}`}
              initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full flex flex-col"
            >
              {/* Type tag */}
              <div className="mb-4">
                 <span className="text-white/80 font-bold tracking-[0.2em] uppercase text-xs sm:text-sm flex items-center gap-2">
                   <div className="w-8 h-px bg-white"></div>
                   {currentMovie.type === 'tv' ? 'Series' : 'Movie'}
                 </span>
              </div>

              <h1 
                className="mb-4 max-w-4xl text-left leading-[1.05] break-words text-white text-4xl sm:text-7xl lg:text-[5.5rem] drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] selection:bg-white/30 !text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70"
                style={getTitleStyle(currentMovie)}
              >
                {currentMovie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-semibold text-white/90 mb-6 mt-4">
                 <span className="liquid-glass px-2.5 sm:px-3 py-1.5 rounded-md flex items-center gap-1 hover:scale-105 transition-transform"><span className="text-yellow-400">★</span> {currentMovie.rating}</span>
                 <span className="liquid-glass px-2.5 sm:px-3 py-1.5 rounded-md hover:scale-105 transition-transform">{currentMovie.year}</span>
                 {currentMovie.quality && <span className="px-2.5 sm:px-3 py-1.5 liquid-glass rounded-md uppercase tracking-wider hover:scale-105 transition-transform">{currentMovie.quality}</span>}
                 {currentMovie.seasons && <span className="liquid-glass px-2.5 sm:px-3 py-1.5 rounded-md hover:scale-105 transition-transform">{currentMovie.seasons.length} Seasons</span>}
                 <span className="text-white/80 ml-2 text-xs sm:text-sm drop-shadow-md">{currentMovie.genre?.join(' • ')}</span>
              </div>

              <p className="text-sm sm:text-lg font-medium text-white/80 max-w-2xl leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-3 md:line-clamp-4 mb-6 md:mb-10">
                {currentMovie.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button 
                  onClick={() => onMovieClick?.(currentMovie, true)}
                  className="bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold flex items-center gap-2 sm:gap-3 hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.4)] text-base sm:text-lg"
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" /> Play Now
                </button>
                <button 
                  onClick={() => onMovieClick?.(currentMovie)}
                  className="liquid-glass text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold flex items-center gap-2 sm:gap-3 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 text-base sm:text-lg"
                >
                  <Info className="w-5 h-5 sm:w-6 sm:h-6" /> More Info
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Poster (Right Side) */}
        <div className="hidden lg:block w-72 xl:w-[350px] shrink-0 z-30 perspective-1000 mb-8 pt-10">
          <AnimatePresence mode="wait">
            <motion.div 
              key={`poster-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.85, rotateY: 20, y: 50 }}
              animate={{ opacity: 1, scale: 1, rotateY: -10, y: 0, rotateZ: 3 }}
              exit={{ opacity: 0, scale: 0.85, rotateY: -20, y: -50 }}
              transition={{ duration: 1, type: "spring", bounce: 0.3 }}
              className="relative rounded-[2rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(255,255,255,0.1)] border border-white/20 group cursor-pointer"
              onClick={() => onMovieClick?.(currentMovie)}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />
              <img 
                src={currentMovie.poster} 
                alt={currentMovie.title} 
                className="w-full aspect-[2/3] object-cover transition-transform duration-1000 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 transition-opacity duration-500 z-0 pointer-events-none" />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Manual Navigation Controls */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 md:p-4 rounded-full liquid-glass text-white/80 hover:text-white opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 hidden sm:block"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 md:p-4 rounded-full liquid-glass text-white/80 hover:text-white opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 hidden sm:block"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Interactive Progress Slider */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-40 w-full px-4 sm:px-6 md:px-10 lg:px-16 mx-auto max-w-[1600px] flex gap-2 sm:gap-3 h-1 sm:h-1.5 pointer-events-none">
         {heroMovies.map((_, index) => (
           <div 
             key={index}
             onClick={() => setCurrentIndex(index)}
             className="flex-1 h-full bg-white/20 overflow-hidden cursor-pointer hover:bg-white/40 transition-all duration-300 relative pointer-events-auto rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.5)] hover:scale-105"
           >
             {index === currentIndex && (
               <motion.div 
                 key={`progress-${currentIndex}`}
                 initial={{ width: "0%" }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 25, ease: "linear" }}
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

