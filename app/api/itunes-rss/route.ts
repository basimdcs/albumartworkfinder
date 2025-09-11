import { NextResponse } from 'next/server';

interface iTunesEntry {
  'im:name': { label: string };
  'im:artist': { label: string };
  'im:image': Array<{ label: string; attributes?: { height: string } }>;
  'im:releaseDate': { label: string; attributes: { label: string } };
  category: { attributes: { term: string; label: string } };
  id: { attributes: { 'im:id': string } };
  'im:contentType': { attributes: { term: string; label: string } };
  rights?: { label: string };
  title: { label: string };
  link: { attributes: { href: string } };
}

interface iTunesRSSResponse {
  feed: {
    entry: iTunesEntry[];
  };
}

interface CachedData {
  data: iTunesEntry[];
  timestamp: number;
}

// In-memory cache (in production, use Redis or similar)
const cache = new Map<string, CachedData>();

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

async function fetchItunesRSS(url: string): Promise<iTunesEntry[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AlbumArtworkFinder/1.0',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`iTunes RSS fetch failed: ${response.status}`);
    }

    const data: iTunesRSSResponse = await response.json();
    return data.feed.entry || [];
  } catch (error) {
    console.error('Error fetching iTunes RSS:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'albums' or 'songs'
    
    if (!type || !['albums', 'songs'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type parameter. Use "albums" or "songs"' },
        { status: 400 }
      );
    }

    const cacheKey = `itunes-${type}`;
    const now = Date.now();
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        data: cached.data,
        cached: true,
        cacheAge: Math.floor((now - cached.timestamp) / (1000 * 60 * 60)), // hours
      });
    }

    // Determine URL based on type
    const url = type === 'albums' 
      ? 'https://itunes.apple.com/us/rss/topalbums/limit=200/json'
      : 'https://itunes.apple.com/us/rss/topsongs/limit=200/json';

    // Fetch fresh data
    const entries = await fetchItunesRSS(url);
    
    // Cache the result
    cache.set(cacheKey, {
      data: entries,
      timestamp: now,
    });

    return NextResponse.json({
      data: entries,
      cached: false,
      totalCount: entries.length,
    });

  } catch (error) {
    console.error('iTunes RSS API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch iTunes data' },
      { status: 500 }
    );
  }
} 