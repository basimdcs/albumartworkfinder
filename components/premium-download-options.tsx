'use client';

import { useState } from 'react';
import { Download, ExternalLink, Gem, Zap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getArtworkResolutions, estimateFileSize } from '@/lib/utils';

interface PremiumDownloadOptionsProps {
  artworkUrl: string;
  albumTitle: string;
  artistName: string;
  className?: string;
}

export default function PremiumDownloadOptions({ 
  artworkUrl, 
  albumTitle, 
  artistName, 
  className = '' 
}: PremiumDownloadOptionsProps) {
  const [downloadingResolution, setDownloadingResolution] = useState<string | null>(null);
  
  const resolutions = getArtworkResolutions(artworkUrl);
  
  const handleDownload = async (url: string, resolution: string, filename: string) => {
    setDownloadingResolution(resolution);
    
    try {
      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Append to document, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloadingResolution(null);
    }
  };
  
  const generateFilename = (resolution: string) => {
    const cleanTitle = albumTitle.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const cleanArtist = artistName.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    return `${cleanArtist} - ${cleanTitle} (${resolution}).jpg`;
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
            <Gem className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Premium Download Options</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Choose your preferred resolution and quality
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Higher resolutions provide better quality but result in larger file sizes. 
            Choose based on your intended use case.
          </AlertDescription>
        </Alert>
        
        {/* Resolution Options */}
        <div className="space-y-3">
          {resolutions.map((resolution, index) => (
            <div 
              key={resolution.size}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                resolution.premium 
                  ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300' 
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              {resolution.premium && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    ULTRA HD
                  </Badge>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{resolution.label}</h4>
                    {resolution.premium && (
                      <div className="flex items-center gap-1 text-purple-600">
                        <Gem className="h-4 w-4" />
                        <span className="text-xs font-medium">Premium Quality</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Resolution: {resolution.size.replace('bb', '')}</span>
                    <span>Size: {estimateFileSize(resolution.size)}</span>
                    <span className="text-blue-600 font-medium">{resolution.recommended}</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleDownload(
                    resolution.url,
                    resolution.size,
                    generateFilename(resolution.size)
                  )}
                  disabled={downloadingResolution === resolution.size}
                  className={`${
                    resolution.premium
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white border-0`}
                >
                  {downloadingResolution === resolution.size ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </>
                  )}
                </Button>
              </div>
              
              {resolution.premium && (
                <div className="mt-3 p-3 bg-white/50 rounded-lg border border-purple-200">
                  <div className="flex items-start gap-2">
                    <Gem className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-purple-700">
                      <strong>Ultra High Definition:</strong> Professional-grade quality perfect for 
                      large format printing, design projects, and archival collections. 
                      This is the highest resolution available from iTunes.
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Usage Guidelines */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Usage Guidelines
          </h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 300px-600px: Perfect for web use, social media, and digital displays</li>
            <li>• 1000px: Ideal for digital music libraries and medium-size prints</li>
            <li>• 3000px: High-quality prints up to 10x10 inches at 300 DPI</li>
            <li>• 5000px: Professional use, large format printing, and archival quality</li>
          </ul>
        </div>
        
        {/* Copyright Notice */}
        <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-100 rounded-lg">
          <strong>Copyright Notice:</strong> All artwork is provided for personal use only. 
          Rights belong to respective artists and record labels. Please respect copyright 
          when using these images.
        </div>
      </CardContent>
    </Card>
  );
} 