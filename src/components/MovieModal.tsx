import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Plus, Youtube, Share2, ChevronDown } from 'lucide-react';
import { type Movie } from '../types';
import { useState, useEffect, useRef } from 'react';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
  startPlaying?: boolean;
}

type Tab = 'Episodes' | 'Overview' | 'Casts' | 'Reviews' | 'Related';

export function MovieModal({ movie, onClose, startPlaying = false }: MovieModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [selectedSeason, setSelectedSeason] = useState<string>('s1');
  const [activeEpisodeId, setActiveEpisodeId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(startPlaying);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (movie) {
      document.body.style.overflow = 'hidden';
      // Default to episodes if it's a TV show and they open it
      if (movie.type === 'tv' && movie.seasons && movie.seasons.length > 0) {
        setActiveTab('Episodes');
        setSelectedSeason(movie.seasons[0].id);
        setActiveEpisodeId(movie.seasons[0].episodes[0]?.id || null);
      } else {
        setActiveTab('Overview');
        setSelectedSeason('');
        setActiveEpisodeId(null);
      }
      setIsPlaying(startPlaying);
    } else {
      document.body.style.overflow = 'auto';
      setIsPlaying(false);
    }
    setIsSeasonDropdownOpen(false);
    return () => { document.body.style.overflow = 'auto'; };
  }, [movie, startPlaying]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsSeasonDropdownOpen(false);
      }
    };
    if (isSeasonDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSeasonDropdownOpen]);

  if (!movie) return null;

  const tabs: Tab[] = [];
  if (movie.type === 'tv' && movie.seasons && movie.seasons.length > 0) {
    tabs.push('Episodes');
  }
  tabs.push('Overview', 'Casts', 'Reviews', 'Related');

  const currentSeason = movie.seasons?.find(s => s.id === selectedSeason) || movie.seasons?.[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex justify-center items-center p-0 lg:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full h-full lg:h-[85vh] lg:max-h-[850px] lg:max-w-[1400px] bg-[#0A0A0A] lg:rounded-3xl flex flex-col lg:flex-row overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10"
        >
          {/* Close Button */}
          <button 
            onClick={() => isPlaying ? setIsPlaying(false) : onClose()}
            className="absolute top-4 right-4 z-[110] bg-black/40 hover:bg-white/10 hover:text-white text-white/70 rounded-full p-2 backdrop-blur-md transition-colors border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>

          {isPlaying && (
            <div className="absolute inset-0 z-[105] bg-black">
              <iframe
                src={movie.type === 'tv'
                  ? `https://vidsrc.xyz/embed/tv?imdb=${movie.id}&season=${currentSeason?.seasonNumber || 1}&episode=${activeEpisodeId ? activeEpisodeId.replace('e', '') : 1}`
                  : `https://vidsrc.xyz/embed/movie?imdb=${movie.id}`
                }
                className="w-full h-full border-0"
                allowFullScreen
                allow="autoplay; fullscreen; encrypted-media"
                referrerPolicy="origin"
              />
            </div>
          )}

          {/* Left Section (Backdrop & Floating Controls) */}
          <div className="relative flex-1 shrink-0 lg:rounded-l-3xl overflow-hidden bg-[#121212] h-[45vh] lg:h-full">
            {/* The backdrop or poster fallback */}
            <div className="absolute inset-0 bg-black">
              <img 
                src={movie.backdrop || movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover opacity-30 blur-[40px] scale-110 saturate-150"
              />
            </div>
            
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent opacity-100 pointer-events-none lg:bg-gradient-to-r lg:from-transparent lg:via-[#0A0A0A]/60 lg:to-[#0A0A0A]" />
            
            {/* Bottom Left Floating Panel */}
            <div className="absolute inset-0 p-6 lg:p-12 flex flex-col justify-end z-20">
              <div className="flex flex-col lg:flex-row items-end gap-6 lg:gap-10">
                {/* Sharp Poster overlay */}
                <div className="relative w-32 md:w-40 lg:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 shrink-0 hidden sm:block">
                   <img 
                     src={movie.poster} 
                     alt={movie.title} 
                     className="w-full h-full object-cover" 
                   />
                </div>
                
                {/* Title & Actions */}
                <div className="flex-1 flex flex-col justify-end pb-2">
                   <div className="flex items-center gap-3 mb-3">
                     <span className="text-[10px] lg:text-xs text-white/50 tracking-[0.2em] font-bold uppercase border border-white/10 px-2 py-1 rounded-md bg-white/5">
                       {movie.type === 'tv' ? 'Series' : 'Movie'}
                     </span>
                     <span className="text-yellow-400 font-bold text-sm bg-black/40 px-2 py-1 rounded-md border border-white/5 shadow-sm">
                       ★ {movie.rating.toFixed(1)}
                     </span>
                   </div>
                   <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight mb-6 lg:mb-8 drop-shadow-lg">{movie.title}</h2>
                   
                   <div className="flex items-center gap-3 lg:gap-4 flex-wrap">
                      <button 
                        onClick={() => setIsPlaying(true)}
                        className="bg-white text-black px-6 lg:px-8 py-3 rounded-full flex items-center gap-2 text-sm lg:text-base font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                      >
                        <Play className="w-4 h-4 lg:w-5 lg:h-5 fill-current"/> Watch Now
                      </button>
                      <button className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 lg:px-8 py-3 rounded-full flex items-center gap-2 text-sm lg:text-base font-bold shadow-lg transition-all active:scale-95">
                        <Plus className="w-4 h-4" /> My List
                      </button>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section (Sidebar Details) */}
          <div className="w-full lg:w-[480px] xl:w-[540px] shrink-0 bg-gradient-to-b from-[#111111] to-[#050505] flex flex-col p-6 lg:p-10 overflow-y-auto hide-scrollbar z-10 border-l border-white/5">
             {/* Tabs */}
             <div className="flex items-center gap-6 border-b border-white/10 pb-4 mb-8 overflow-x-auto hide-scrollbar whitespace-nowrap">
               {tabs.map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative text-sm lg:text-base font-semibold transition-colors pb-4 -mb-4 ${activeTab === tab ? 'text-white' : 'text-[#8B95A5] hover:text-[#B3B3B3]'}`}
                 >
                   {tab}
                   {activeTab === tab && (
                     <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-yellow-400 rounded-t-full shadow-[0_-2px_10px_rgba(250,204,21,0.5)]" />
                   )}
                 </button>
               ))}
             </div>
             
             {/* Tab Content */}
             <AnimatePresence mode="wait">
               {activeTab === 'Overview' && (
                 <motion.div 
                   key="overview"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   transition={{ duration: 0.2 }}
                   className="flex flex-col gap-8"
                 >
                   <div className="prose prose-invert max-w-none">
                     <p className="text-white/70 text-base leading-relaxed">
                       {movie.description}
                     </p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6">
                     <div>
                       <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Released</h4>
                       <p className="text-white/90 text-sm font-medium">{movie.year}</p>
                     </div>
                     <div>
                       <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Genre</h4>
                       <p className="text-white/90 text-sm font-medium">{movie.genre.join(', ')}</p>
                     </div>
                     
                     {movie.type === 'tv' && (
                       <>
                         <div>
                           <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Seasons</h4>
                           <p className="text-white/90 text-sm font-medium">{movie.seasons?.length || 1}</p>
                         </div>
                         <div>
                           <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Episodes</h4>
                           <p className="text-white/90 text-sm font-medium">{movie.seasons?.reduce((acc, season) => acc + season.episodes.length, 0) || 10}</p>
                         </div>
                       </>
                     )}
                   </div>
                   
                 </motion.div>
               )}

               {activeTab === 'Episodes' && movie.type === 'tv' && currentSeason && (
                  <motion.div 
                   key="episodes"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   transition={{ duration: 0.2 }}
                   className="flex flex-col gap-4"
                 >
                   <div className="flex items-center justify-between mb-4">
                     <div className="relative" ref={dropdownRef}>
                       <button 
                         onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
                         className="flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-white transition-colors"
                       >
                         Season {currentSeason.seasonNumber}
                         <ChevronDown className={`w-4 h-4 transition-transform ${isSeasonDropdownOpen ? 'rotate-180' : ''}`} />
                       </button>
                       
                       <AnimatePresence>
                         {isSeasonDropdownOpen && (
                           <motion.div 
                             initial={{ opacity: 0, y: -10, scale: 0.95 }}
                             animate={{ opacity: 1, y: 0, scale: 1 }}
                             exit={{ opacity: 0, y: -10, scale: 0.95 }}
                             className="absolute top-full left-0 mt-2 w-48 bg-[#121212] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20"
                           >
                             {movie.seasons?.map(season => (
                               <button
                                 key={season.id}
                                 onClick={() => {
                                   setSelectedSeason(season.id);
                                   setIsSeasonDropdownOpen(false);
                                 }}
                                 className={`w-full text-left px-5 py-3 hover:bg-white/5 transition-colors ${selectedSeason === season.id ? 'bg-white/10 font-bold text-white border-l-4 border-yellow-400' : 'text-white/60'}`}
                               >
                                 Season {season.seasonNumber}
                               </button>
                             ))}
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </div>
                   </div>

                   <div className="space-y-2">
                     {currentSeason?.episodes?.map(ep => (
                        <div 
                          key={ep.id} 
                          onClick={() => {
                            setActiveEpisodeId(ep.id);
                            setIsPlaying(true);
                          }}
                          className={`flex gap-4 p-3 rounded-2xl transition-colors cursor-pointer group ${activeEpisodeId === ep.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                        >
                          <div className="relative w-32 aspect-video rounded-xl overflow-hidden shrink-0 bg-[#1A1A1A]">
                            <img 
                              src={ep.poster} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x150?text='+ep.id;
                              }}
                            />
                            <div className={`absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center ${activeEpisodeId === ep.id ? 'bg-black/40' : ''}`}>
                              <Play className={`w-8 h-8 drop-shadow-md transition-transform group-hover:scale-110 ${activeEpisodeId === ep.id ? 'text-white fill-current' : 'text-white/80 fill-current'}`} />
                            </div>
                          </div>
                          <div className="flex flex-col justify-center flex-1 py-1">
                            <h5 className={`font-bold text-sm line-clamp-2 leading-snug mb-1 ${activeEpisodeId === ep.id ? 'text-white' : 'text-white/80'}`}>
                              {ep.id.replace('e', '')}. {ep.title}
                            </h5>
                            <p className="text-white/40 text-xs font-medium">{ep.duration}</p>
                          </div>
                        </div>
                     ))}
                   </div>
                 </motion.div>
               )}

               {activeTab !== 'Overview' && (activeTab !== 'Episodes' || movie.type !== 'tv') && (
                 <motion.div 
                   key="empty"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   transition={{ duration: 0.2 }}
                   className="flex-1 flex items-center justify-center py-20"
                 >
                   <p className="text-white/30 text-sm font-medium">No details available for {activeTab}</p>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
