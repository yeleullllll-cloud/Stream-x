import { type Movie } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface PlatformGridProps {
  movies: Movie[];
}

export function PlatformGrid({ movies }: PlatformGridProps) {
  const platforms = ['Netflix', 'Prime', 'Max', 'Disney+', 'AppleTV', 'Paramount'];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [movies]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-transparent px-4 sm:px-6 lg:px-10 py-6 overflow-hidden w-full m-auto max-w-full mt-4">
      <div className="max-w-[1600px] mx-auto relative group/section">
        <div className="flex flex-col sm:flex-row lg:items-end justify-between mb-4 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1 h-6 bg-[#E50914] rounded-sm"></span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Series on <span className="text-[#E50914]">Netflix</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar pb-2 sm:pb-0">
            {platforms.map((platform, idx) => (
              <button 
                key={platform}
                className={`text-sm font-medium whitespace-nowrap pb-1 ${
                  idx === 0 
                    ? 'text-[#E50914] border-b-2 border-[#E50914]' 
                    : 'text-[#B3B3B3] hover:text-white transition-colors'
                }`}
              >
                {platform}
              </button>
            ))}
            <div className="hidden lg:flex items-center gap-2 ml-4">
              {canScrollLeft && (
                <button 
                  onClick={() => scroll('left')}
                  className="p-1.5 liquid-glass rounded-full text-white/50 hover:text-white transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {canScrollRight && (
                <button 
                  onClick={() => scroll('right')}
                  className="p-1.5 liquid-glass rounded-full text-white/50 hover:text-white transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="relative">
          {canScrollLeft && (
            <button 
              onClick={() => scroll('left')}
              className="absolute -left-4 sm:left-0 z-20 w-12 h-full top-0 bg-gradient-to-r from-black to-transparent text-white/0 group-hover/section:text-white transition-all flex items-center justify-start pointer-events-auto sm:hidden group-hover/section:sm:flex"
            >
              <ChevronLeft className="w-8 h-8 drop-shadow-md" />
            </button>
          )}
          
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar scroll-smooth"
          >
            {movies.map((movie) => (
              <div key={movie.id} className="min-w-[200px] sm:min-w-[240px] md:min-w-[280px] lg:min-w-[320px] aspect-video snap-start shrink-0">
                <div className="w-full h-full bg-[#2A2A2A] rounded-md overflow-hidden relative shadow-lg group cursor-pointer border border-white/5">
                  {/* Blurred Background */}
                  <img 
                    src={movie.backdrop}
                    alt={`${movie.title} background`}
                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450?text=No+Backdrop';
                    }}
                  />
                  {/* Contained Poster */}
                  <img 
                    src={movie.backdrop}
                    alt={movie.title}
                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 py-2" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450?text=No+Backdrop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
                     <h3 className="text-white font-bold text-sm md:text-base truncate">{movie.title}</h3>
                     <div className="flex items-center gap-2 text-[10px] md:text-xs text-[#B3B3B3] mt-1">
                       <span className="text-[#E50914] font-bold border border-[#E50914] px-1 rounded">TV-MA</span>
                       <span>{movie.year}</span>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {canScrollRight && (
            <button 
              onClick={() => scroll('right')}
              className="absolute -right-4 sm:right-0 z-20 w-12 h-full top-0 bg-gradient-to-l from-black to-transparent text-white/0 group-hover/section:text-white transition-all flex items-center justify-end pointer-events-auto sm:hidden group-hover/section:sm:flex"
            >
              <ChevronRight className="w-8 h-8 drop-shadow-md" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
