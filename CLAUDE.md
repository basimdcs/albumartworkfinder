# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev          # Start development server (Next.js 15)
pnpm dev            # Alternative with PNPM

# Production
npm run build       # Build for production
npm run start       # Start production server

# Code Quality
npm run lint        # Run ESLint (Next.js built-in)
```

**Note**: No testing framework is currently configured. Consider adding Jest + React Testing Library for comprehensive testing.

## Application Architecture

**Album Artwork Finder** is a Next.js 15 (App Router) application that searches iTunes API for high-resolution album artwork. Built with TypeScript, Tailwind CSS, and Shadcn/ui components.

### Core Business Logic

- **`lib/api.ts`** (619 lines): iTunes API integration with client-side only implementation
- **`lib/search-tracking.ts`**: User behavior tracking for dynamic SEO sitemap generation
- **`lib/seo-utils.ts`**: SEO utilities for structured data and meta tags
- **`lib/seo-slug.ts`**: Enhanced SEO slug generation with international character support
- **`lib/utils.ts`**: General utility functions

### Key Architecture Patterns

**Client-Side API Strategy**: All iTunes API calls are made client-side only:
- Direct iTunes API calls for all devices (desktop and mobile)
- No CORS proxy services needed
- Client-side only implementation prevents server-side rate limiting

**Dynamic SEO System**: 
- Tracks user searches and album visits
- Generates dynamic sitemap with up to 1000 search queries + 2000 album pages
- Uses Redis for caching (via Upstash)
- Auto-cleanup of data older than 6 months

### Important File Structure

```
app/
├── layout.tsx                    # Root layout with GA4 integration
├── page.tsx                     # Homepage with search functionality
├── search/
│   ├── page.tsx                 # Search page with Suspense boundaries
│   ├── search-results.tsx       # Search results component
│   └── search-skeleton.tsx      # Loading skeleton for search
├── album/[id]/[...slug]/
│   ├── page.tsx                 # Dynamic album pages with visit tracking
│   └── layout.tsx               # Album page layout
├── privacy/page.tsx             # Privacy policy page
├── terms/page.tsx               # Terms of service page
├── sitemap.ts                   # Dynamic sitemap generation
├── robots.ts                    # Dynamic robots.txt
└── api/track-search/route.ts    # Search/album visit tracking API

lib/
├── api.ts                       # iTunes API client-side implementation
├── search-tracking.ts           # SEO tracking utilities
├── seo-utils.ts                 # SEO helper functions
├── seo-slug.ts                  # Enhanced SEO slug generation
└── utils.ts                     # General utility functions

components/
├── ui/                          # Shadcn/ui components (40+ components)
├── album-html-cache.tsx         # Album page HTML caching
├── album-tracker.tsx            # Album visit tracking
├── client-only.tsx              # Client-side only wrapper
├── global-search.tsx            # Global search functionality
├── google-analytics.tsx         # GA4 integration
├── high-res-download-button.tsx # High-res download functionality
├── homepage-html-cache.tsx      # Homepage HTML caching
├── optimized-image.tsx          # Cost-optimized image component
├── pwa-provider.tsx             # PWA functionality
├── theme-provider.tsx           # Theme/dark mode support
└── [20+ other components]       # Search, download, sharing, etc.

hooks/
├── use-mobile.tsx               # Mobile detection hook
└── use-toast.ts                 # Toast notification hook
```

## Development Guidelines

### Mobile-First Approach
Always test on mobile devices. iTunes API calls work directly on all devices - any changes to `lib/api.ts` require mobile testing.

### SEO Considerations
- All search queries and album visits are automatically tracked for SEO
- Dynamic sitemap updates based on user behavior
- Changes to search/album pages should consider SEO impact

### Performance Requirements
- Maintain 95+ mobile and 98+ desktop performance scores
- Use OptimizedImage/HighResImage components (not Next.js Image directly)
- Implement proper lazy loading for album grids

### Cost Optimization (CRITICAL)
**Vercel Image Optimization is DISABLED** to reduce costs:
- Use `OptimizedImage` component from `@/components/optimized-image` for thumbnails/grids
- Use `HighResImage` component for main album artwork only
- iTunes URLs are automatically optimized to smaller resolutions (300x300) for grids
- Only album detail pages get full 1000x1000 resolution
- **Never use `next/image` directly** - always use the custom components

### iTunes API Rate Limiting Prevention (CRITICAL)
**ALL iTunes API calls MUST be client-side only**:
- Server-side iTunes API calls will hit rate limits after a few requests
- All functions in `lib/api.ts` have `ensureClientSide()` guards
- Album pages are now client-side components (`'use client'`)
- **Never call iTunes API functions in**:
  - `generateMetadata()` functions
  - Server components
  - API routes
  - Any server-side context
- **Always use client-side components** for iTunes API integration

### Environment Variables
```bash
NEXT_PUBLIC_GA_ID=G-K9SYT9LZNM    # Google Analytics 4 ID
NODE_ENV=production               # Environment
```

## API Integration Notes

**iTunes API Specifics**:
- All requests are client-side only
- 30-minute response caching implemented
- High-resolution artwork URLs generated automatically (up to 1000x1000px)
- RSS feed integration for trending content

**CORS Proxy Chain**:
We dont use them 

## Deployment

Optimized for **Vercel** deployment with:
- Edge functions configured (30s timeout)
- Security headers in `next.config.js`
- Image optimization for iTunes domains
- Automatic HTTPS redirects

## Common Issues

**iTunes API Rate Limiting**: If you get rate limit errors, ensure all iTunes API calls are client-side only. Check for:
- Server-side calls in `generateMetadata()` functions
- iTunes API calls in server components
- Missing `'use client'` directives

**Mobile Search Failures**: iTunes API works directly on mobile devices. If issues occur, check network connectivity and ensure client-side execution.

**SEO Sitemap Issues**: Dynamic sitemap generation depends on Redis connection. Check Upstash configuration if sitemap appears empty.

**Performance Degradation**: Monitor bundle size - extensive Radix UI component library can impact performance if not properly tree-shaken.