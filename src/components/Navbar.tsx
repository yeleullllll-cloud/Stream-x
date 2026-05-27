import { Home, Film, Tv, LayoutGrid, Search, Bookmark, User, Settings, Bell, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeCategory: 'Home' | 'Movies' | 'TV' | 'Anime' | 'Search' | 'MyList' | 'Profile';
  onCategoryChange: (category: 'Home' | 'Movies' | 'TV' | 'Anime' | 'Search' | 'MyList' | 'Profile') => void;
}

export function Navbar({ activeCategory, onCategoryChange }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, login, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full flex justify-center transition-all duration-500 ease-out ${isScrolled ? 'pt-3 sm:pt-4' : 'pt-4 sm:pt-6'}`}>
      
      {/* Pill Navbar */}
      <div className={`flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-500 will-change-transform ${isScrolled ? 'liquid-glass scale-90 sm:scale-95 md:scale-100 shadow-[0_10px_40px_rgba(0,0,0,0.5)]' : 'liquid-glass shadow-[0_4px_20px_rgba(0,0,0,0.3)]'}`}>
        
        {/* Brand Icon */}
        <button 
          onClick={() => onCategoryChange('Home')}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 active:scale-95 flex items-center justify-center shrink-0 water-ripple"
        >
          <span className="text-base sm:text-lg font-bold text-white tracking-tighter">S</span>
        </button>

        {/* Main Links - desktop only */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <button 
            onClick={() => onCategoryChange('Home')}
            className={`text-sm font-semibold transition-all hover:text-white hover:scale-105 active:scale-95 ${activeCategory === 'Home' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-white/60'}`}
          >
            Home
          </button>
          <button 
            onClick={() => onCategoryChange('Movies')}
            className={`text-sm font-semibold transition-all hover:text-white hover:scale-105 active:scale-95 ${activeCategory === 'Movies' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-white/60'}`}
          >
            Movies
          </button>
          <button 
            onClick={() => onCategoryChange('TV')}
            className={`text-sm font-semibold transition-all hover:text-white hover:scale-105 active:scale-95 ${activeCategory === 'TV' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-white/60'}`}
          >
            Series
          </button>
          <button 
            onClick={() => onCategoryChange('Anime')}
            className={`text-sm font-semibold transition-all hover:text-white hover:scale-105 active:scale-95 ${activeCategory === 'Anime' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-white/60'}`}
          >
            Discover
          </button>
          <button 
            onClick={() => onCategoryChange('MyList')}
            className={`text-sm font-semibold transition-all hover:text-white hover:scale-105 active:scale-95 ${activeCategory === 'MyList' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-white/60'}`}
          >
            List
          </button>
        </nav>

        {/* Divider */}
        <div className="hidden md:block w-px h-5 bg-white/20" />

        {/* Icons */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 relative" ref={dropdownRef}>
          <button onClick={() => onCategoryChange('Search')} className={`transition-all hover:text-white hover:scale-110 active:scale-95 ${activeCategory === 'Search' ? 'text-white' : 'text-white/60'}`}>
            <Search className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`transition-all hover:text-white text-white/60 flex items-center gap-1 overflow-hidden hover:scale-105 active:scale-95 ${isDropdownOpen || activeCategory === 'Profile' ? 'text-white' : ''}`}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full object-cover border border-white/20 hover:scale-110 transition-transform" />
            ) : (
              <User className="w-4 h-4 hover:scale-110 transition-transform" />
            )}
            <ChevronDown className={`w-3 h-3 transition-transform hidden sm:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Accounts Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="absolute top-full right-0 mt-3 sm:mt-4 w-52 sm:w-56 glass-card rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
              >
                {!user ? (
                   <div className="p-4 flex flex-col gap-3">
                     <p className="text-white/70 text-xs text-center">Sign in for more features</p>
                     <button
                       onClick={() => {
                         login();
                         setIsDropdownOpen(false);
                       }}
                       className="w-full py-2 bg-white text-black font-bold text-sm rounded-lg hover:bg-white/90 transition-colors"
                     >
                       Sign In
                     </button>
                   </div>
                ) : (
                   <>
                      <div className="p-4 border-b border-white/5 flex items-center gap-3">
                         <img src={user.photoURL || ''} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                         <div className="flex flex-col">
                            <span className="text-sm font-semibold text-white truncate max-w-[120px]">{user.displayName}</span>
                            <span className="text-[10px] text-white/50 truncate max-w-[120px]">{user.email}</span>
                         </div>
                      </div>
                      
                      <div className="py-2 flex flex-col">
                        <button 
                          onClick={() => { onCategoryChange('Profile'); setIsDropdownOpen(false); }} 
                          className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors text-white/80 hover:text-white text-sm"
                        >
                           <User className="w-4 h-4" /> Account Profile
                        </button>
                        <button 
                          className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors text-white/80 hover:text-white text-sm"
                        >
                           <Bell className="w-4 h-4" /> Notifications
                           <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">3</span>
                        </button>
                        <button 
                          className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors text-white/80 hover:text-white text-sm"
                        >
                           <Settings className="w-4 h-4" /> Settings
                        </button>
                        
                        <div className="h-px bg-white/5 my-1" />
                        
                        <button 
                          onClick={() => {
                            logout();
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors text-red-400 hover:text-red-300 text-sm"
                        >
                           <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </div>
                   </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile nav (bottom fixed) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 liquid-glass border-t-0 border-b-0 border-x-0 !rounded-none py-2.5 sm:py-3 px-4 sm:px-6 flex justify-between items-center z-50 safe-area-inset-bottom">
        <button onClick={() => onCategoryChange('Home')} className={`flex flex-col items-center gap-0.5 sm:gap-1 transition-all hover:scale-105 active:scale-95 ${activeCategory === 'Home' ? 'text-white' : 'text-gray-500'}`}>
           <Home className="w-5 h-5" />
           <span className="text-[9px] sm:text-[10px] font-medium">Home</span>
        </button>
        <button onClick={() => onCategoryChange('Movies')} className={`flex flex-col items-center gap-0.5 sm:gap-1 transition-all hover:scale-105 active:scale-95 ${activeCategory === 'Movies' ? 'text-white' : 'text-gray-500'}`}>
           <Film className="w-5 h-5" />
           <span className="text-[9px] sm:text-[10px] font-medium">Movies</span>
        </button>
        <button onClick={() => onCategoryChange('TV')} className={`flex flex-col items-center gap-0.5 sm:gap-1 transition-all hover:scale-105 active:scale-95 ${activeCategory === 'TV' ? 'text-white' : 'text-gray-500'}`}>
           <Tv className="w-5 h-5" />
           <span className="text-[9px] sm:text-[10px] font-medium">TV</span>
        </button>
        <button onClick={() => onCategoryChange('MyList')} className={`flex flex-col items-center gap-0.5 sm:gap-1 transition-all hover:scale-105 active:scale-95 ${activeCategory === 'MyList' ? 'text-white' : 'text-gray-500'}`}>
           <Bookmark className="w-5 h-5" />
           <span className="text-[9px] sm:text-[10px] font-medium">My List</span>
        </button>
      </div>

    </header>
  );
}

