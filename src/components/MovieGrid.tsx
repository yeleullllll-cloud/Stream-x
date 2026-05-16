import { type Movie } from '../types';
import { MovieCard } from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface MovieGridProps {
  title: string;
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

export function MovieGrid({ title, movies, onMovieClick }: MovieGridProps) {
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
    <section className="flex-grow bg-transparent px-4 sm:px-6 lg:px-10 py-6 overflow-hidden w-full m-auto max-w-full">
      <div className="max-w-[1600px] mx-auto relative group/section">
        <div className="flex items-end justify-between mb-4">
          <div className="flex items-baseline gap-4">
            <h2 className="text-lg md:text-xl font-bold text-white relative pb-1">
              {title}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00E5FF]"></span>
            </h2>
            <a href="#" className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">
              View all
            </a>
          </div>
          
          <div className="flex items-center gap-2 hidden sm:flex">
            {canScrollLeft && (
              <button 
                onClick={() => scroll('left')}
                className="p-1.5 liquid-glass rounded-full text-white/50 hover:text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {canScrollRight && (
              <button 
                onClick={() => scroll('right')}
                className="p-1.5 liquid-glass rounded-full text-white/50 hover:text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
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
              <div key={movie.id} className="w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] snap-start shrink-0">
                <MovieCard movie={movie} onMovieClick={onMovieClick} />
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
