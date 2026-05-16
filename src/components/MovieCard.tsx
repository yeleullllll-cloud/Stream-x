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
      className="group relative cursor-pointer flex flex-col w-full h-full gap-3"
      onClick={() => onMovieClick?.(movie)}
    >
      <div className="aspect-[2/3] bg-[#2A2A2A] rounded-xl overflow-hidden relative shadow-lg w-full">
        {/* Poster Image */}
        <img 
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Poster';
          }}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
          <Play className="w-12 h-12 text-white fill-current opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100" />
        </div>
      </div>
      
      {/* Title under the poster */}
      <div className="flex flex-col px-1">
        <h3 className="text-white font-semibold text-base line-clamp-1 group-hover:text-gray-300 transition-colors">{movie.title}</h3>
      </div>
    </motion.div>
  );
}
