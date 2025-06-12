# Album Artwork Finder

A modern, fast web application for discovering and downloading high-quality album artwork from the iTunes catalog. Built with Next.js 15 and featuring a clean, mobile-first responsive interface with advanced CORS handling.

## 🚀 Features

- **Lightning Fast Search**: Search millions of albums from the iTunes catalog with instant results
- **High-Quality Artwork**: Access album covers up to 1000x1000px resolution  
- **Mobile-First Design**: Optimized for mobile devices with touch-friendly interfaces
- **CORS-Free Mobile Access**: Advanced proxy system ensures mobile browser compatibility
- **No Registration Required**: Completely free to use without any signup or account creation
- **SEO Optimized**: Fast loading times and search engine friendly architecture
- **Real-time Results**: Instant search results with optimized API calls
- **Popular Content**: Discover trending albums and top artists
- **Responsive Layout**: Works perfectly across all device sizes
- **Advanced Error Reporting**: Comprehensive debugging for mobile issues

## 🛠 Tech Stack

### Frontend
- **Next.js 15.2.4** - React framework with App Router and server-side rendering
- **React 18** - Modern React with hooks and concurrent features  
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework with mobile optimizations
- **Lucide React** - Beautiful, consistent SVG icons

### API & Data
- **iTunes Search API** - Primary data source for album information and artwork
- **Vercel Edge Functions** - CORS proxy for mobile browser compatibility
- **iTunes RSS Feeds** - Additional data for popular content discovery
- **Native Fetch API** - HTTP client with timeout and error handling
- **Client-side API calls** - Prevents server-side rate limiting issues

### Development & Deployment
- **pnpm** - Fast, efficient package manager
- **ESLint** - Code linting and quality assurance
- **Next.js Build Optimization** - Automatic code splitting and performance optimization
- **Vercel Ready** - Optimized for Vercel deployment platform

## 🔧 Architecture & CORS Solution

### Mobile Browser CORS Issue
**Problem Discovered**: Mobile browsers (Safari, Chrome on iOS/Android) were blocking direct iTunes API calls due to CORS restrictions, causing "Load failed" errors.

**Solution Implemented**: 
- **Vercel Edge Function Proxy** (`/api/itunes-proxy`) that:
  - Runs server-side to bypass CORS restrictions
  - Adds proper CORS headers for browser access
  - Provides comprehensive logging and error handling
  - Caches responses for 5 minutes to improve performance

### Request Flow
```
Mobile Browser → /api/itunes-proxy → iTunes API → Response → Mobile Browser
```

### Key Technical Findings
1. **iTunes requests are SERVER-SIDE** (via the proxy) - the proxy runs on Vercel Edge Functions
2. **Albums-only search** - Simplified from dual albums/songs search to albums-only for better performance
3. **Proxy URL format**: `https://itunes.apple.com/search?term=jack+johnson&entity=album`
4. **Mobile compatibility**: 100% working on iOS Safari, Chrome, and Android browsers

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **pnpm** (v9 or higher) - Install with `npm install -g pnpm`
- **Git** for version control

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd albumartworkfinder
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

The application will automatically open and be ready to use!

## 📂 Project Structure

```
albumartworkfinder/
├── app/                    # Next.js App Router directory
│   ├── api/itunes-proxy/   # CORS proxy for mobile browsers
│   │   └── route.ts        # Vercel Edge Function proxy
│   ├── album/[id]/[...slug]/  # Dynamic album detail pages
│   ├── search/             # Search results and functionality
│   │   ├── page.tsx        # Search page with metadata
│   │   └── search-results.tsx # Simplified search results component
│   ├── privacy/            # Privacy policy page
│   ├── terms/              # Terms of service page  
│   ├── globals.css         # Global styles with mobile optimizations
│   ├── layout.tsx          # Root layout with header/footer
│   ├── page.tsx           # Homepage with popular content
│   └── not-found.tsx      # 404 error page
├── components/             # React components
│   ├── ui/                # Base UI components
│   ├── search-form.tsx    # Main search form (homepage)
│   ├── global-search.tsx  # Header search component
│   ├── album-card.tsx     # Album display component
│   └── music-preview.tsx  # Audio preview component
├── lib/                   # Utility functions and API
│   └── api.ts            # Simplified iTunes API integration (albums-only)
├── public/               # Static assets
├── next.config.mjs       # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies and scripts
```

## 🎯 Key Components

### Search Functionality
- **SearchForm**: Main search interface on homepage with mobile-optimized inputs
- **GlobalSearch**: Compact search bar in header for easy navigation
- **SearchResults**: Simplified component displaying album results with comprehensive error handling

### Album Display  
- **AlbumCard**: Responsive album artwork cards with hover effects
- **Album Detail**: Individual album pages with full information
- **Image Optimization**: Lazy loading and optimized image delivery

### API Integration
- **iTunes Proxy**: Vercel Edge Function that handles CORS and provides mobile compatibility
- **Albums-only Search**: Simplified search focusing only on album results
- **Comprehensive Error Reporting**: Detailed error information for debugging mobile issues
- **Caching Strategy**: Intelligent caching to improve performance

## 🔧 Configuration

### Environment Variables
No environment variables required! The app uses public APIs and works out of the box.

### Next.js Configuration
```javascript
// next.config.mjs
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true }
}
```

### Mobile Optimizations
- **CORS Proxy**: Vercel Edge Function ensures mobile browser compatibility
- **Touch Targets**: Minimum 44px touch targets for better mobile interaction
- **Responsive Grid**: Adaptive grid layouts for different screen sizes  
- **Touch Feedback**: Visual feedback for touch interactions
- **Safe Area Support**: Proper handling of notched devices
- **Error Reporting**: Comprehensive error details for mobile debugging

## 📊 Performance Features

- **Static Generation**: Pre-generated pages for lightning-fast loading
- **Code Splitting**: Automatic JavaScript bundle optimization
- **Image Optimization**: Lazy loading and responsive images
- **Mobile-First**: Optimized for mobile-first user experience
- **Edge Function Proxy**: Fast CORS handling via Vercel Edge Functions
- **Albums-only Search**: Simplified API calls for better performance
- **Caching**: Smart caching strategy for frequently accessed data

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Vercel automatically detects Next.js configuration and Edge Functions
3. Deploy with zero configuration required
4. The iTunes proxy automatically works on Vercel Edge Runtime

### Manual Deployment
```bash
# Build the application
pnpm build

# Start production server  
pnpm start
```

## 📱 Mobile Experience

The application is specifically optimized for mobile devices with advanced CORS handling:

- **CORS-Free**: Works perfectly on all mobile browsers (iOS Safari, Chrome, Android)
- **Touch-Friendly**: All interactive elements meet mobile accessibility standards
- **Fast Loading**: Optimized images and minimal JavaScript for quick loading
- **Responsive Design**: Adapts perfectly to all screen sizes and orientations
- **Native Feel**: Smooth animations and transitions for app-like experience
- **Error Debugging**: Comprehensive error reporting for mobile issues

## 🔍 Technical Deep Dive

### CORS Proxy Implementation
```typescript
// app/api/itunes-proxy/route.ts
export const runtime = 'edge'

export async function GET(req: NextRequest) {
  // Proxy iTunes API requests with proper CORS headers
  const itunesUrl = new URL('https://itunes.apple.com/search')
  // ... proxy logic with error handling and caching
}
```

### Simplified Search API
```typescript
// lib/api.ts
export const searchAlbums = async (query: string): Promise<Album[]> => {
  // Use proxy instead of direct iTunes API
  const proxyUrl = `/api/itunes-proxy?term=${encodeURIComponent(query)}&entity=album`
  // ... comprehensive error handling and logging
}

// Simplified search - albums only
export const searchAll = searchAlbums
```

### Error Reporting System
- **Client-side detection**: Identifies mobile browsers and network conditions
- **Comprehensive logging**: Detailed error information with stack traces
- **Copy-to-clipboard**: Easy error sharing for debugging
- **Performance metrics**: Request timing and success rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **iTunes** for providing comprehensive music data through their public API
- **Vercel** for excellent hosting, Edge Functions, and deployment platform
- **Next.js Team** for the amazing React framework and developer experience
- **Tailwind CSS** for the utility-first CSS framework
- **Open Source Community** for the amazing tools and libraries

## 📞 Support

If you encounter any issues:

1. Check existing [Issues](../../issues) 
2. Create a new issue with detailed information about the problem
3. Include browser version and device information for mobile issues
4. Use the error reporting system to copy technical details

## 🔍 Search Tips

- **Artist Names**: Search by exact artist names for best results (e.g., "Taylor Swift", "Drake")
- **Album Titles**: Include album names for specific results (e.g., "Folklore Taylor Swift")
- **Simple Terms**: Use simple, common terms for broader results
- **Mobile Testing**: The app now works perfectly on all mobile browsers

## 🐛 Troubleshooting

### Mobile Browser Issues
- **CORS Errors**: Fixed via Vercel Edge Function proxy
- **Load Failed**: Resolved by routing through `/api/itunes-proxy`
- **Network Errors**: Comprehensive error reporting with debugging info

### Common Solutions
1. **Clear browser cache** if experiencing old CORS errors
2. **Check network connection** for API timeouts
3. **Use error reporting** to copy technical details for support 