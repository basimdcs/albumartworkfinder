'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ExternalLink, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createSEOSlug } from '@/lib/utils';

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

interface ApiResponse {
  data: iTunesEntry[];
  cached: boolean;
  cacheAge?: number;
  totalCount: number;
}

export default function TopAlbumsGrid() {
  const [albums, setAlbums] = useState<iTunesEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState<{ cached: boolean; age?: number } | null>(null);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        setLoading(true);
        const response = await fetch('/api/itunes-rss?type=albums');
        
        if (!response.ok) {
          throw new Error('Failed to fetch albums');
        }

        const data: ApiResponse = await response.json();
        
        // Validate the data structure
        if (data && data.data && Array.isArray(data.data)) {
          setAlbums(data.data.slice(0, 100)); // Limit to top 100
          setCacheInfo({ cached: data.cached, age: data.cacheAge });
        } else {
          throw new Error('Invalid data structure received from API');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchAlbums();
  }, []);

  const getHighestResolutionImage = (images: iTunesEntry['im:image']) => {
    // iTunes provides images in different sizes, get the largest one
    if (!images || !Array.isArray(images) || images.length === 0) {
      return '/placeholder.svg';
    }
    
    const sortedImages = images.sort((a, b) => {
      const heightA = parseInt(a.attributes?.height || '0');
      const heightB = parseInt(b.attributes?.height || '0');
      return heightB - heightA;
    });
    return sortedImages[0]?.label || images[images.length - 1]?.label || '/placeholder.svg';
  };

  const formatReleaseDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const getGenreColor = (genre: string) => {
    const colorMap: { [key: string]: string } = {
      'Pop': 'bg-pink-100 text-pink-800',
      'Rock': 'bg-red-100 text-red-800',
      'Hip-Hop/Rap': 'bg-purple-100 text-purple-800',
      'Country': 'bg-orange-100 text-orange-800',
      'R&B/Soul': 'bg-blue-100 text-blue-800',
      'Electronic': 'bg-green-100 text-green-800',
      'Alternative': 'bg-gray-100 text-gray-800',
      'Jazz': 'bg-yellow-100 text-yellow-800',
    };
    return colorMap[genre] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading top albums...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-semibold mb-2">Unable to Load Albums</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cache Status Info */}
      {cacheInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 text-sm font-medium">
              {cacheInfo.cached 
                ? `Data cached ${cacheInfo.age || 0} hours ago` 
                : 'Fresh data from iTunes'
              }
            </span>
            <Badge variant="secondary" className="text-xs">
              Updated Weekly
            </Badge>
          </div>
        </div>
      )}

      {/* Albums Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {albums.map((album, index) => {
          const imageUrl = getHighestResolutionImage(album['im:image']);
          const albumName = album['im:name']?.label || 'Unknown Album';
          const artistName = album['im:artist']?.label || 'Unknown Artist';
          const releaseDate = album['im:releaseDate']?.label || '';
          const genre = album.category?.attributes?.label || 'Music';
          const itunesId = album.id?.attributes?.['im:id'] || `album-${index}`;
          const itunesLink = album.link?.attributes?.href || '#';

          return (
            <Card key={itunesId} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-4">
                {/* Ranking Badge */}
                <div className="relative mb-3">
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                      #{index + 1}
                    </div>
                  </div>
                  
                  {/* Album Cover */}
                  <Link href={`/album/${itunesId}/${createSEOSlug(artistName)}-${createSEOSlug(albumName)}`} className="block">
                    <div className="aspect-square rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={imageUrl}
                        alt={`${albumName} by ${artistName}`}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                        loading={index < 12 ? 'eager' : 'lazy'}
                      />
                    </div>
                  </Link>
                </div>

                {/* Album Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {albumName}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-gray-600">
                    <User className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs truncate">{artistName}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs">{formatReleaseDate(releaseDate)}</span>
                  </div>
                  
                  <Badge className={`text-xs ${getGenreColor(genre)} border-0`}>
                    {genre}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                  >
                    <Link href={`/album/${itunesId}/${createSEOSlug(artistName)}-${createSEOSlug(albumName)}`}>
                      View Details
                    </Link>
                  </Button>
                  
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <a 
                      href={itunesLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More Button (if we want to show more than 100) */}
      <div className="text-center pt-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Want to Find Specific Album Artwork?
          </h3>
          <p className="text-gray-600 mb-4">
            Use our powerful search tool to find any album cover from millions of releases.
          </p>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
            <Link href="/">
              Search Album Artwork
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 