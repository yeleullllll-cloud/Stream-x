import { type Movie } from '../types';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onMovieClick?: (movie: Movie) => void;
}

export function MovieCard({ movie, onMovieClick }: MovieCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="group relative cursor-pointer flex flex-col w-full h-full gap-3"
      onClick={() => onMovieClick?.(movie)}
    >
      <div className="aspect-[2/3] bg-[#2A2A2A] rounded-xl overflow-hidden relative shadow-lg w-full water-ripple">
        {/* Poster Image */}
        <img 
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Poster';
          }}
        />

        {/* Hover Overlay with liquid glass effect */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center backdrop-blur-0 group-hover:backdrop-blur-sm">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100 liquid-glass rounded-full p-4">
            <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white fill-current drop-shadow-2xl" />
          </div>
        </div>
      </div>
      
      {/* Title under the poster */}
      <div className="flex flex-col px-1">
        <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-1 group-hover:text-gray-300 transition-colors">{movie.title}</h3>
      </div>
    </motion.div>
  );
}
