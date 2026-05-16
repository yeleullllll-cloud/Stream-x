import { Home, Film, Tv, LayoutGrid, Search, Bookmark, User } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavbarProps {
  activeCategory: 'Home' | 'Movies' | 'TV' | 'Anime' | 'Search' | 'MyList' | 'Profile';
  onCategoryChange: (category: 'Home' | 'Movies' | 'TV' | 'Anime' | 'Search' | 'MyList' | 'Profile') => void;
}

export function Navbar({ activeCategory, onCategoryChange }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-10 py-4 sm:py-5 flex justify-between items-center transition-all duration-300 ${isScrolled ? 'bg-[#050505]/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-[#050505]/80 to-transparent'}`}>
      
      {/* Brand Logo */}
      <div className="text-xl sm:text-2xl font-black text-[#E50914] tracking-wider cursor-pointer z-20 flex-shrink-0" onClick={() => onCategoryChange('Home')}>
        STREAMX
      </div>

      {/* Main Links - centered on desktop */}
      <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 lg:gap-8">
        <button 
          onClick={() => onCategoryChange('Home')}
          className={`text-sm font-medium transition-colors hover:text-white ${activeCategory === 'Home' ? 'text-white' : 'text-gray-400'}`}
        >
          Home
        </button>
        <button 
          onClick={() => onCategoryChange('Movies')}
          className={`text-sm font-medium transition-colors hover:text-white ${activeCategory === 'Movies' ? 'text-white' : 'text-gray-400'}`}
        >
          Movies
        </button>
        <button 
          onClick={() => onCategoryChange('TV')}
          className={`text-sm font-medium transition-colors hover:text-white ${activeCategory === 'TV' ? 'text-white' : 'text-gray-400'}`}
        >
          TV Shows
        </button>
        <button 
          onClick={() => onCategoryChange('Anime')}
          className={`text-sm font-medium transition-colors hover:text-white ${activeCategory === 'Anime' ? 'text-white' : 'text-gray-400'}`}
        >
          Anime
        </button>
      </nav>

      {/* Icons */}
      <div className="flex items-center gap-4 sm:gap-6 z-20">
        <button 
          onClick={() => onCategoryChange('Search')}
          className={`transition-colors hover:text-white ${activeCategory === 'Search' ? 'text-white' : 'text-gray-400'}`}
        >
          <Search className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button 
          onClick={() => onCategoryChange('MyList')}
          className={`transition-colors hover:text-white hidden sm:block ${activeCategory === 'MyList' ? 'text-white' : 'text-gray-400'}`}
        >
          <Bookmark className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button 
          onClick={() => onCategoryChange('Profile')}
          className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center overflow-hidden border border-white/20 transition-transform hover:scale-105"
        >
          <User className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Mobile nav (bottom fixed) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#050505]/95 backdrop-blur-lg border-t border-white/5 py-3 px-6 flex justify-between items-center z-50">
        <button onClick={() => onCategoryChange('Home')} className={`flex flex-col items-center gap-1 ${activeCategory === 'Home' ? 'text-white' : 'text-gray-500'}`}>
           <Home className="w-5 h-5" />
           <span className="text-[10px] font-medium">Home</span>
        </button>
        <button onClick={() => onCategoryChange('Movies')} className={`flex flex-col items-center gap-1 ${activeCategory === 'Movies' ? 'text-white' : 'text-gray-500'}`}>
           <Film className="w-5 h-5" />
           <span className="text-[10px] font-medium">Movies</span>
        </button>
        <button onClick={() => onCategoryChange('TV')} className={`flex flex-col items-center gap-1 ${activeCategory === 'TV' ? 'text-white' : 'text-gray-500'}`}>
           <Tv className="w-5 h-5" />
           <span className="text-[10px] font-medium">TV</span>
        </button>
        <button onClick={() => onCategoryChange('MyList')} className={`flex flex-col items-center gap-1 ${activeCategory === 'MyList' ? 'text-white' : 'text-gray-500'}`}>
           <Bookmark className="w-5 h-5" />
           <span className="text-[10px] font-medium">My List</span>
        </button>
      </div>

    </header>
  );
}

