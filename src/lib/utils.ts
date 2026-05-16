import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getMovieTitleStyle = (genres?: string[]) => {
  if (!genres || genres.length === 0) return 'font-sans font-bold tracking-tight text-white drop-shadow-2xl';
  const genreString = genres.join(' ').toLowerCase();
  
  if (genreString.includes('horror') || genreString.includes('thriller')) {
    return 'font-horror text-white drop-shadow-[0_4px_12px_rgba(200,0,0,0.5)]';
  }
  if (genreString.includes('action') || genreString.includes('war')) {
    return 'font-military leading-none tracking-widest text-[#E0E0E0] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]';
  }
  if (genreString.includes('sci-fi') || genreString.includes('cyberpunk') || (genreString.includes('animation') && !genreString.includes('drama'))) {
    return 'font-pixel !tracking-normal text-[#00E5FF] drop-shadow-[0_2px_8px_rgba(0,229,255,0.6)]';
  }
  if (genreString.includes('romance') || genreString.includes('drama') || genreString.includes('history')) {
    return 'font-serif italic tracking-wider text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] font-semibold';
  }
  if (genreString.includes('comedy')) {
    return 'font-roboto font-black tracking-tighter text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-none';
  }

  return 'font-sans font-bold tracking-tight text-white drop-shadow-2xl';
};
