import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Plus, Check, ChevronDown, ChevronUp, ArrowLeft, RotateCcw, RotateCw, List } from 'lucide-react';
import { type Movie } from '../types';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../lib/AuthContext';
import { addToWatchlist, removeFromWatchlist } from '../services/watchlist';
import { fetchTrailerVideoId } from '../services/youtube';
import { cn } from '../lib/utils';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
  startPlaying?: boolean;
  isInWatchlist?: boolean;
}

export function MovieModal({ movie, onClose, startPlaying = false, isInWatchlist = false }: MovieModalProps) {
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [activeEpisodeId, setActiveEpisodeId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(startPlaying);
  const [trailerId, setTrailerId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [episodePanelOpen, setEpisodePanelOpen] = useState(false);
  const [skipFeedback, setSkipFeedback] = useState<{ id: number; direction: 'forward' | 'backward' } | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const skipFeedbackIdRef = useRef(0);
  const { user, login } = useAuth();

  const handleMouseMove = useCallback(() => {
    if (!isPlaying) return;
    setControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  }, [isPlaying]);

  const triggerSkip = (direction: 'forward' | 'backward') => {
    // Show visual feedback
    skipFeedbackIdRef.current += 1;
    setSkipFeedback({ id: skipFeedbackIdRef.current, direction });
    setTimeout(() => setSkipFeedback(null), 900);
    // Attempt postMessage seek for players that support it
    try {
      const seconds = direction === 'forward' ? 10 : -10;
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'seek', time: seconds, action: 'seekBy' }, '*'
      );
      iframeRef.current?.contentWindow?.postMessage(
        { event: 'command', func: 'seekTo', args: [seconds, true] }, '*'
      );
    } catch (_) {}
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPlaying) {
          setIsPlaying(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, onClose]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (movie) {
      document.body.style.overflow = 'hidden';
      if (movie.type === 'tv' && movie.seasons && movie.seasons.length > 0) {
        setSelectedSeason(movie.seasons[0].id);
        setActiveEpisodeId(movie.seasons[0].episodes[0]?.id || null);
      } else {
        setSelectedSeason('');
        setActiveEpisodeId(null);
      }
      setIsPlaying(startPlaying);
      
      // Fetch Trailer
      fetchTrailerVideoId(movie.title).then(id => {
         setTrailerId(id);
      });
    } else {
      document.body.style.overflow = 'auto';
      setIsPlaying(false);
      setTrailerId(null);
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [movie, startPlaying]);

  if (!movie) return null;

  const currentSeason = movie.seasons?.find(s => s.id === selectedSeason) || movie.seasons?.[0];

  return (
    <>
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#0A0A0A] overflow-y-auto smooth-scroll hide-scrollbar w-full"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
         {/* Top action buttons */}
         <button 
           onClick={onClose}
           className="fixed top-4 sm:top-6 right-4 sm:right-8 z-[110] liquid-glass hover:bg-white/10 hover:text-white text-white/70 rounded-full p-2.5 sm:p-3 transition-all hover:scale-105 active:scale-95 shadow-2xl"
         >
           <X className="w-5 h-5 sm:w-6 sm:h-6" />
         </button>

         {/* Hero Header Area */}
         <div className="relative w-full h-[60vh] sm:h-[65vh] md:h-[80vh] shrink-0 border-b border-white/5 bg-black flex flex-col justify-end group overflow-hidden">
            {/* Background Trailer or Image */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-black">
               {trailerId && !isPlaying && !isMobile ? (
                  <iframe
                     src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailerId}&vq=hd1080&modestbranding=1&enablejsapi=1`}
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60"
                     style={{ width: "100vw", height: "56.25vw", minHeight: "100%", minWidth: "177.77vh" }}
                     allow="autoplay; encrypted-media"
                     loading="lazy"
                     title="Movie Trailer"
                  />
               ) : (
                  <img 
                    src={movie.backdrop || movie.poster} 
                    className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[20px] scale-110 saturate-150" 
                    alt=""
                  />
               )}
            </div>
            
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent z-10 w-full md:w-2/3 pointer-events-none" />
            <div className="absolute inset-y-0 bottom-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent z-10 h-3/4 flex mt-auto pointer-events-none" />

            {/* Hero Content */}
            <div className="relative z-20 w-full mx-auto max-w-[1600px] px-6 lg:px-16 pb-12 lg:pb-20 flex flex-col md:flex-row items-end gap-10">
                 {/* Floating Poster */}
                 <div className="hidden md:block w-48 lg:w-64 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/20 group-hover:scale-[1.02] transition-transform duration-500">
                    <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                 </div>
                 
                 <div className="flex-1 flex flex-col justify-end max-w-4xl pt-20 md:pt-0">
                    <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-black italic text-white mb-4 tracking-tighter drop-shadow-2xl leading-[1.05]">
                      {movie.title.toUpperCase()}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-6 text-sm font-semibold text-white/80">
                       <span className="bg-white/10 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
                         {movie.genre[0] || 'Drama'}
                       </span>
                       <span className="bg-white/10 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm text-yellow-400 flex items-center gap-1">
                         ★ {movie.rating}
                       </span>
                       <span className="bg-white/10 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm flex items-center gap-1.5 text-white/70">
                         {movie.type === 'tv' ? `${movie.seasons?.length || 1} Seasons` : movie.quality || 'HD'}
                       </span>
                       <span className="bg-white/10 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm text-white/70">
                         {movie.year}
                       </span>
                    </div>
                    
                    <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed drop-shadow-md line-clamp-3 md:line-clamp-4">
                      {movie.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4">
                       <button 
                         onClick={() => setIsPlaying(true)} 
                         className="bg-white rounded-full text-black px-8 py-3.5 flex items-center gap-3 font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                       >
                         <Play className="w-5 h-5 fill-current" /> 
                         Play {movie.type === 'tv' && currentSeason ? `Season ${currentSeason.seasonNumber}` : 'Movie'}
                       </button>
                       <button 
                          onClick={async () => {
                            if (!user) {
                              await login();
                              return;
                            }
                            if (isInWatchlist) {
                              await removeFromWatchlist(movie.id);
                            } else {
                              await addToWatchlist(movie);
                            }
                          }}
                         className={`bg-black/40 border border-white/10 hover:bg-white/10 backdrop-blur-md rounded-full px-8 py-3.5 flex items-center gap-3 font-semibold text-lg transition-all hover:scale-105 active:scale-95 ${isInWatchlist ? 'text-yellow-400 border-white/20' : 'text-white'}`}
                       >
                         {isInWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />} 
                         {isInWatchlist ? 'Added details' : 'List'}
                       </button>
                    </div>
                 </div>
              </div>
         </div>

         {/* Lower Content (Episodes for TV, more info for Movie) */}
         <div className="w-full max-w-[1600px] mx-auto pb-32">
            {movie.type === 'tv' && movie.seasons && movie.seasons.length > 0 && (
              <>
                 {/* Season Picker Bar */}
                 <div className="z-40 flex justify-center pt-10 pb-6 border-b border-transparent">
                    <div className="flex flex-wrap gap-3 max-w-[1400px] px-6 lg:px-16 w-full">
                      {movie.seasons.map(s => (
                        <button 
                          key={s.id}
                          onClick={() => setSelectedSeason(s.id)}
                          className={`whitespace-nowrap px-6 py-2 rounded-full font-bold text-[13px] transition-all border ${selectedSeason === s.id ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'bg-[#0f0f0f] text-[#AAA] border-[#252525] hover:border-[#444] hover:text-white'}`}
                        >
                          Season {s.seasonNumber}
                        </button>
                      ))}
                    </div>
                 </div>
                 
                 {/* Season Content */}
                 {currentSeason && (
                   <div className="px-6 lg:px-16 py-8 max-w-[1400px] mx-auto">
                      <div className="flex flex-col sm:flex-row gap-8 lg:gap-10 mb-12">
                         {/* Season Poster with red tag */}
                         <div className="hidden sm:block w-40 lg:w-[220px] shrink-0 rounded-[20px] overflow-hidden relative bg-[#111] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <img src={movie.poster} className="w-full h-full object-cover" />
                            {/* The red bottom banner seen in the screenshot */}
                            <div className="absolute bottom-0 inset-x-0 bg-red-600 text-white font-black italic tracking-widest text-center py-2 text-sm uppercase translate-y-1 transform-gpu">
                               SEASON {currentSeason.seasonNumber}
                            </div>
                         </div>
                         
                         {/* Season Overview */}
                         <div className="flex-1 flex flex-col justify-start pt-1">
                            <h2 className="text-3xl lg:text-[40px] font-black mb-5 text-white uppercase tracking-wide">SEASON {currentSeason.seasonNumber}</h2>
                            <div className="flex gap-6 items-center mb-6 text-[#AAA] font-medium text-[13px]">
                              <span className="flex items-center gap-2">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                September 22, {movie.year || '2013'}
                              </span>
                              <span className="flex items-center gap-2">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
                                {currentSeason.episodes.length} Episodes
                              </span>
                            </div>
                            <p className="text-[#CCC] text-[15px] leading-[1.7] max-w-[900px] font-medium">
                               {movie.description}
                            </p>
                         </div>
                      </div>

                      {/* Episodes Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                         {currentSeason.episodes.map(ep => (
                           <div 
                             key={ep.id}
                             onClick={() => {
                               setActiveEpisodeId(ep.id);
                               setIsPlaying(true);
                               window.scrollTo({ top: 0, behavior: 'smooth' });
                             }}
                             className="bg-[#141414] rounded-[16px] overflow-hidden group cursor-pointer hover:bg-[#1C1C1C] transition-all duration-300 flex flex-col pb-4 shadow-lg"
                           >
                             <div className="relative aspect-[16/9] w-full bg-[#0A0A0A] shrink-0">
                               <img 
                                 src={ep.poster} 
                                 className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-duration-500"
                                 onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1920';
                                 }}
                               />
                               {/* EP tag - Match Screenshot */}
                               <div className="absolute top-4 left-4 bg-[#111]/90 backdrop-blur-sm px-3 py-1.5 rounded-[6px] text-[10px] font-black text-white tracking-widest uppercase shadow-md">
                                 EP {ep.episodeNumber || ep.id.replace('e', '')}
                               </div>
                               {/* Play button overlay */}
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 backdrop-blur-sm">
                                 <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/30">
                                   <Play className="w-6 h-6 text-white text-opacity-100 fill-current ml-1" />
                                 </div>
                               </div>
                             </div>
                             
                             <div className="p-5 flex flex-col flex-1 pb-2">
                               <div className="mb-2">
                                  <h3 className="font-extrabold text-[17px] text-[#F3F3F3] line-clamp-1 tracking-tight">{ep.title}</h3>
                               </div>
                               <div className="flex justify-between items-center mb-4">
                                 <div className="text-[10px] font-black text-[#666] uppercase tracking-[0.15em]">
                                    SEPTEMBER {Math.floor(Math.random() * 28 + 1)}, {movie.year || '2013'}
                                 </div>
                                 <span className="flex items-center gap-1 text-[#eab308] text-[11px] font-bold shrink-0">
                                   <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                   {movie.rating}
                                 </span>
                               </div>
                               <p className="text-[#999] text-[13px] font-medium line-clamp-2 leading-[1.6]">
                                  {ep.description || `${ep.title} continues the thrilling story of Season ${currentSeason.seasonNumber}. The race to stop the next threat begins here.`}
                               </p>
                             </div>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </>
            )}

            {/* If Movie */}
            {movie.type === 'movie' && (
              <div className="px-6 lg:px-16 py-12">
                <h2 className="text-2xl font-bold mb-6">More Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Director</h4>
                    <p className="text-white/90 text-sm font-medium">Christopher Nolan</p>
                  </div>
                  <div>
                    <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Cast</h4>
                    <p className="text-white/90 text-sm font-medium">Hugh Jackman, Christian Bale</p>
                  </div>
                  <div>
                    <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Box Office</h4>
                    <p className="text-white/90 text-sm font-medium">$1.02 Billion</p>
                  </div>
                </div>
              </div>
            )}
         </div>

    {/* ── Fullscreen Video Player (portal to body to escape z-index stacking context) ── */}
    {isPlaying && createPortal(
      <AnimatePresence>
        <motion.div
          key="player"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn('fixed inset-0 bg-black overflow-hidden', !controlsVisible && !episodePanelOpen && 'cursor-none')}
          style={{ zIndex: 99999 }}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseMove}
        >
          {/* ── Embedded Video Player ── */}
          {movie && (
            <iframe
              ref={iframeRef}
              key={`${movie.id}-s${currentSeason?.seasonNumber}-${activeEpisodeId}`}
              src={
                movie.type === 'tv'
                  ? `https://vidsrc-embed.ru/embed/tv?imdb=${movie.id}&season=${currentSeason?.seasonNumber || 1}&episode=${activeEpisodeId ? activeEpisodeId.replace(/^s\d+e/, '') : 1}&autoplay=1&autonext=1`
                  : `https://vidsrc-embed.ru/embed/movie?imdb=${movie.id}&autoplay=1`
              }
              className="absolute inset-0 w-full h-full border-none"
              style={{ zIndex: 1 }}
              allowFullScreen
              allow="autoplay; fullscreen; encrypted-media"
              referrerPolicy="origin"
            />
          )}

          {/* ── Controls Overlay ── */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>

            {/* TOP BAR */}
            <AnimatePresence>
              {(controlsVisible || episodePanelOpen) && (
                <motion.div
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-auto flex items-start gap-4 px-4 sm:px-8 pt-5"
                >
                  {/* Exit Button */}
                  <button
                    onClick={() => { setIsPlaying(false); setEpisodePanelOpen(false); }}
                    className="flex items-center gap-2 shrink-0 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full px-4 py-2 transition-all hover:scale-105 active:scale-95 border border-white/15 font-semibold text-sm shadow-xl"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Exit</span>
                    <kbd className="hidden lg:inline-block px-1.5 py-0.5 bg-white/10 rounded text-[9px] text-white/40 border border-white/10">ESC</kbd>
                  </button>

                  {/* Title & Episode Info */}
                  {movie && (
                    <div className="flex flex-col min-w-0 mt-0.5">
                      <span className="text-white font-bold text-sm sm:text-base truncate leading-tight">{movie.title}</span>
                      {movie.type === 'tv' && currentSeason && activeEpisodeId && (
                        <span className="text-white/50 text-xs mt-0.5">
                          Season {currentSeason.seasonNumber} · Ep {activeEpisodeId.replace(/^s\d+e/, '')}
                          {currentSeason.episodes.find(e => e.id === activeEpisodeId)?.title
                            ? ` · ${currentSeason.episodes.find(e => e.id === activeEpisodeId)?.title}`
                            : ''}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* CENTER — Skip Buttons */}
            <AnimatePresence>
              {controlsVisible && !episodePanelOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-between px-6 sm:px-14 pointer-events-none"
                >
                  {/* ← -10s */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => triggerSkip('backward')}
                    className="pointer-events-auto flex flex-col items-center justify-center gap-1 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/30 hover:bg-black/55 backdrop-blur-md border border-white/10 text-white transition-colors shadow-2xl"
                  >
                    <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-[9px] sm:text-[10px] font-bold leading-none">10s</span>
                  </motion.button>

                  {/* → +10s */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => triggerSkip('forward')}
                    className="pointer-events-auto flex flex-col items-center justify-center gap-1 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/30 hover:bg-black/55 backdrop-blur-md border border-white/10 text-white transition-colors shadow-2xl"
                  >
                    <RotateCw className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-[9px] sm:text-[10px] font-bold leading-none">10s</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SKIP FEEDBACK ANIMATION */}
            <AnimatePresence>
              {skipFeedback && (
                <motion.div
                  key={skipFeedback.id}
                  initial={{ opacity: 1, scale: 0.7, y: 0 }}
                  animate={{ opacity: 0, scale: 1.3, y: -20 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 pointer-events-none',
                    skipFeedback.direction === 'backward' ? 'left-16 sm:left-20' : 'right-16 sm:right-20'
                  )}
                >
                  <div className="text-white text-3xl font-black drop-shadow-2xl select-none">
                    {skipFeedback.direction === 'backward' ? '−10s' : '+10s'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* BOTTOM BAR — Episode Panel (TV only) */}
            {movie && movie.type === 'tv' && (
              <AnimatePresence>
                {(controlsVisible || episodePanelOpen) && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-0 inset-x-0 pointer-events-auto"
                  >
                    {/* Toggle Button */}
                    {!episodePanelOpen && (
                      <div className="h-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end px-4 sm:px-8 pb-5">
                        <button
                          onClick={() => setEpisodePanelOpen(true)}
                          className="ml-auto flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full px-5 py-2.5 transition-all hover:scale-105 active:scale-95 border border-white/15 font-semibold text-sm shadow-xl"
                        >
                          <List className="w-4 h-4" />
                          Episodes
                          <ChevronUp className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Episode / Season Panel */}
                    <AnimatePresence>
                      {episodePanelOpen && (
                        <motion.div
                          initial={{ y: '100%' }}
                          animate={{ y: 0 }}
                          exit={{ y: '100%' }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute bottom-0 inset-x-0 bg-black/96 backdrop-blur-2xl border-t border-white/10 flex flex-col"
                          style={{ maxHeight: '62vh' }}
                        >
                          {/* Panel Header */}
                          <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/10 shrink-0">
                            <div>
                              <h3 className="text-white font-bold text-base sm:text-lg">{movie.title}</h3>
                              <p className="text-white/40 text-xs mt-0.5">{movie.seasons?.length} Season{(movie.seasons?.length ?? 0) > 1 ? 's' : ''}</p>
                            </div>
                            <button
                              onClick={() => setEpisodePanelOpen(false)}
                              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                            >
                              <ChevronDown className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Season Tabs */}
                          <div className="flex gap-2 px-5 sm:px-8 py-3 overflow-x-auto hide-scrollbar shrink-0 border-b border-white/5">
                            {movie.seasons?.map(s => (
                              <button
                                key={s.id}
                                onClick={() => {
                                  setSelectedSeason(s.id);
                                  setActiveEpisodeId(s.episodes[0]?.id || null);
                                }}
                                className={cn(
                                  'shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all',
                                  selectedSeason === s.id
                                    ? 'bg-white text-black shadow-lg'
                                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                                )}
                              >
                                Season {s.seasonNumber}
                              </button>
                            ))}
                          </div>

                          {/* Episodes Grid */}
                          <div className="overflow-y-auto hide-scrollbar flex-1 px-5 sm:px-8 py-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                              {currentSeason?.episodes.map(ep => {
                                const isActive = activeEpisodeId === ep.id;
                                const epNum = ep.episodeNumber ?? parseInt(ep.id.replace(/^s\d+e/, ''), 10);
                                const sceneThumbnail = ep.poster && ep.poster.includes('unsplash')
                                  ? `https://image.pollinations.ai/prompt/${encodeURIComponent(`${movie.title} season ${currentSeason.seasonNumber} episode ${epNum} ${ep.title} TV series cinematic widescreen still scene dramatic lighting`)}?width=640&height=360&nologo=true&seed=${movie.id}-s${currentSeason.seasonNumber}e${epNum}`
                                  : ep.poster;

                                return (
                                  <button
                                    key={ep.id}
                                    onClick={() => {
                                      setActiveEpisodeId(ep.id);
                                      setEpisodePanelOpen(false);
                                    }}
                                    className={cn(
                                      'relative rounded-xl overflow-hidden group text-left transition-all duration-200',
                                      isActive ? 'ring-2 ring-white scale-[1.02] opacity-100' : 'opacity-60 hover:opacity-100 hover:scale-[1.02]'
                                    )}
                                  >
                                    {/* Thumbnail */}
                                    <div className="aspect-video bg-white/5 relative overflow-hidden">
                                      <img
                                        src={sceneThumbnail}
                                        alt={ep.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                        onError={e => {
                                          (e.target as HTMLImageElement).src =
                                            `https://image.pollinations.ai/prompt/${encodeURIComponent(`${movie.title} ${ep.title} episode ${epNum} season ${currentSeason.seasonNumber} cinematic TV scene 16:9`)}?width=640&height=360&nologo=true&seed=${ep.id}`;
                                        }}
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full p-2.5 shadow-xl">
                                          <Play className="w-4 h-4 text-white fill-current" />
                                        </div>
                                      </div>
                                      {isActive && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />}
                                      <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded">
                                        EP {epNum}
                                      </div>
                                    </div>
                                    <div className="px-1.5 py-2">
                                      <p className="text-white text-[11px] font-semibold line-clamp-1 leading-tight">{ep.title}</p>
                                      <p className="text-white/35 text-[9px] mt-0.5">{ep.duration}</p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

          </div>
        </motion.div>
      </AnimatePresence>,
      document.body
    )}
    </>
  );
}

