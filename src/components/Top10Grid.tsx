import { type Movie } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getMovieTitleStyle, cn } from '../lib/utils';

interface Top10GridProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

export function Top10Grid({ movies, onMovieClick }: Top10GridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const itemWidth = scrollRef.current.children[0]?.clientWidth || 240;
      // Calculate which item is currently near the left edge of the visible area
      const index = Math.round(scrollLeft / itemWidth);
      setActiveIndex(index);
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    };

    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
      // Initial check
      handleScroll();
    }
    return () => el?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="flex-grow bg-transparent px-4 sm:px-6 lg:px-10 py-10 overflow-hidden w-full m-auto max-w-full">
      <div className="max-w-[1600px] mx-auto relative group/section">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-5xl md:text-6xl lg:text-8xl font-sans tracking-tight text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)', color: 'transparent' }}>
            TOP 10
          </h2>
          <span className="text-xs md:text-sm tracking-[0.3em] text-[#B3B3B3] uppercase pt-2 lg:pt-6 font-medium">
            Content Today
          </span>
        </div>

        <div className="flex items-center relative">
          {canScrollLeft && (
            <button 
              onClick={() => scroll('left')}
              className="absolute -left-4 sm:left-0 z-20 w-12 sm:w-16 h-full bg-gradient-to-r from-black via-black/80 to-transparent text-white/0 group-hover/section:text-white transition-all flex items-center justify-start pointer-events-auto"
            >
              <ChevronLeft className="w-8 h-8 drop-shadow-md" />
            </button>
          )}

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-12 sm:gap-16 pb-8 px-4 sm:px-12 snap-x hide-scrollbar w-full pt-10 scroll-smooth"
          >
            {movies.slice(0, 10).map((movie, index) => (
              <motion.div 
                key={movie.id} 
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
                className="relative w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] snap-start shrink-0 flex items-center justify-end group"
              >
                {/* Number Outline */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.6, x: -50 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, type: 'spring', bounce: 0.5, delay: 0.1 }}
                  className={`absolute -left-6 md:-left-12 bottom-0 md:-bottom-4 text-[120px] sm:text-[140px] md:text-[180px] font-black leading-none z-0 transition-colors duration-500 pointer-events-none group-hover:text-[#FFD700] ${
                    index === activeIndex ? 'text-[#FFD700]' : 'text-transparent'
                  }`}
                  style={{ 
                    WebkitTextStroke: '3px #FFD700', 
                  }}
                >
                  {index + 1}
                </motion.div>
                {/* Poster Image */}
                <div 
                  className="z-10 w-[75%] aspect-[2/3] bg-[#2A2A2A] rounded-xl overflow-hidden relative shadow-2xl group-hover:scale-105 transition-transform duration-300 cursor-pointer border border-white/5"
                  onClick={() => onMovieClick?.(movie)}
                >
                  <img 
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Poster';
                    }}
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 ease-out z-20 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </div>

          {canScrollRight && (
            <button 
              onClick={() => scroll('right')}
              className="absolute -right-4 sm:right-0 z-20 w-12 sm:w-16 h-full bg-gradient-to-l from-black via-black/80 to-transparent text-white/0 group-hover/section:text-white transition-all flex items-center justify-end pointer-events-auto"
            >
              <ChevronRight className="w-8 h-8 drop-shadow-md" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
