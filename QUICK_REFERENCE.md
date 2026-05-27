# Stream X - Quick Reference Guide

## 🚀 Getting Started

### Start Development Server
```bash
npm run dev
```
Server runs on: **http://localhost:3000**

### Build for Production
```bash
npm run build
```

## 🎨 Key Features Implemented

### 1. **Responsive Design**
- ✅ Works perfectly on mobile, tablet, and desktop
- ✅ No unwanted zooming on any device
- ✅ Proper scaling for all screen sizes
- ✅ iPhone notch support

### 2. **Liquid Glass Effects**
- ✅ iOS-style glassmorphism throughout the UI
- ✅ Smooth animations with natural easing
- ✅ Water ripple effects on hover
- ✅ Dynamic navbar that changes on scroll

### 3. **Smooth Scrolling**
- ✅ iOS-like momentum scrolling
- ✅ Smooth transitions between sections
- ✅ No overscroll bounce
- ✅ Beautiful custom scrollbars

### 4. **Video Player**
- ✅ Fully functional embedded player
- ✅ Supports movies and TV series
- ✅ Episode/season navigation
- ✅ Auto-play functionality
- ✅ Fullscreen mode

### 5. **Episode Thumbnails**
- ✅ Uses real OMDB episode posters
- ✅ AI-generated fallbacks with context
- ✅ High-quality images (1280x720)
- ✅ Episode-specific content

### 6. **YouTube Trailers**
- ✅ Optimized for fast loading (720p)
- ✅ Preconnect hints for speed
- ✅ Lazy loading
- ✅ Auto-play in background

## 🎯 CSS Utility Classes

### Liquid Glass Effects
```css
.liquid-glass          /* Standard glass effect */
.liquid-glass-active   /* Active state glass */
.glass-card           /* Card with glass effect */
.water-ripple         /* Ripple effect on hover */
.floating-glass       /* Floating animation */
```

### Scrolling
```css
.smooth-scroll        /* Smooth momentum scrolling */
.hide-scrollbar       /* Hide scrollbar */
```

## 📱 Responsive Breakpoints

```css
/* Mobile First */
default               /* 0px - 639px (mobile) */
sm:                   /* 640px+ (large mobile) */
md:                   /* 768px+ (tablet) */
lg:                   /* 1024px+ (desktop) */
xl:                   /* 1280px+ (large desktop) */
2xl:                  /* 1536px+ (extra large) */
```

## 🎬 Video Player Usage

### Play a Movie
```typescript
onMovieClick(movie, true)  // true = start playing immediately
```

### Show Movie Details
```typescript
onMovieClick(movie, false) // false = show details modal
```

### Video Player Features
- Auto-play on open
- Episode selector for TV shows
- Season navigation
- Fullscreen support
- ESC key to exit

## 🖼️ Episode Thumbnail Logic

1. **First Priority**: Real OMDB episode poster
2. **Fallback**: AI-generated image with:
   - Show title
   - Episode title
   - Season/episode number
   - Cinematic scene description
   - High quality (1280x720)

## 🔧 Configuration

### API Keys (Optional)
Add to `.env` file:
```env
VITE_OMDB_API_KEY=your_key_here
VITE_YOUTUBE_API_KEY=your_key_here
```

Or configure in the Profile section of the app.

### Default Keys
- OMDB: `7bed534b` (built-in)
- YouTube: Fallback trailers used if not provided

## 🎨 Design Tokens

### Colors
```css
--color-primary: #000000      /* Black background */
--color-secondary: #0F0F0F    /* Dark gray */
--color-accent: #E50914       /* Netflix red */
--color-text-primary: #FFFFFF /* White text */
--color-text-secondary: #B3B3B3 /* Gray text */
```

### Fonts
```css
--font-sans: "Inter"          /* Main UI font */
--font-serif: "Playfair Display" /* Elegant titles */
--font-cinzel: "Cinzel"       /* Dramatic titles */
--font-roboto: "Roboto"       /* Alternative sans */
```

## 🚀 Performance Tips

1. **YouTube Trailers**: Use 720p for faster loading
2. **Images**: Lazy load with `loading="lazy"`
3. **Preconnect**: Already configured for external domains
4. **Animations**: Use GPU-accelerated transforms
5. **Scrolling**: Momentum scrolling enabled by default

## 📱 Mobile Optimization

### Touch Targets
- Minimum 44x44px for all buttons
- Larger spacing on mobile
- Bottom navigation for easy thumb access

### Viewport
- No zoom on double-tap
- Proper scaling on all devices
- Safe area insets for notches

### Performance
- Reduced motion on mobile
- Optimized images
- Lazy loading enabled

## 🎭 Animation Easing

```css
/* Natural easing curve */
cubic-bezier(0.4, 0, 0.2, 1)

/* Used for all transitions */
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
```

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Then restart
npm run dev
```

### YouTube Trailers Not Loading
- Check if YouTube API key is configured
- Fallback trailers will be used automatically
- Trailers only show on desktop (not mobile)

### Episode Thumbnails Not Showing
- OMDB API might be rate-limited
- AI-generated fallbacks will be used
- Check browser console for errors

## 📚 File Structure

```
Stream-x/
├── src/
│   ├── components/      # React components
│   │   ├── Hero.tsx    # Hero section with trailers
│   │   ├── MovieModal.tsx # Movie details & player
│   │   ├── Navbar.tsx  # Navigation bar
│   │   └── ...
│   ├── services/       # API services
│   │   ├── omdb.ts    # OMDB API integration
│   │   ├── youtube.ts # YouTube API
│   │   └── ...
│   ├── lib/           # Utilities
│   ├── App.tsx        # Main app component
│   └── index.css      # Global styles
├── index.html         # HTML entry point
└── package.json       # Dependencies
```

## 🎯 Key Components

### Hero Component
- Auto-rotating movie carousel
- Background trailers
- Water distortion effects
- Responsive poster display

### MovieModal Component
- Full movie details
- Video player integration
- Season/episode selector
- Trailer background

### Navbar Component
- Liquid glass effect
- Scroll-responsive
- Mobile bottom navigation
- User dropdown menu

## 💡 Tips

1. **Liquid Glass**: Works best with dark backgrounds
2. **Trailers**: Only load on desktop for performance
3. **Episodes**: Real OMDB data when available
4. **Scrolling**: Smooth by default, no configuration needed
5. **Responsive**: Mobile-first design approach

---

**Need Help?** Check the IMPROVEMENTS.md file for detailed changes.

**Version**: 2.0.0
**Last Updated**: May 27, 2026
