'use client'

import { useState, useRef, useEffect } from 'react'
import { type Track } from '@/lib/api'

interface MusicPreviewProps {
  tracks: Track[]
  albumTitle: string
  artist: string
}

export default function MusicPreview({ tracks, albumTitle, artist }: MusicPreviewProps) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const tracksWithPreview = tracks.filter(track => track.previewUrl)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentTrack])

  const playTrack = async (track: Track) => {
    const audio = audioRef.current
    if (!audio || !track.previewUrl) return

    if (currentTrack?.id === track.id && isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    if (currentTrack?.id !== track.id) {
      audio.src = track.previewUrl
      setCurrentTrack(track)
      setCurrentTime(0)
    }

    try {
      await audio.play()
      setIsPlaying(true)
    } catch (error) {
      console.error('Error playing audio:', error)
    }
  }

  const togglePlayPause = async () => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch (error) {
        console.error('Error playing audio:', error)
      }
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (tracksWithPreview.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M13.828 8.172a1 1 0 011.414 0A5.983 5.983 0 0117 12a5.983 5.983 0 01-1.758 3.828 1 1 0 11-1.414-1.414A3.987 3.987 0 0015 12a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Music Preview
      </h3>

      <audio ref={audioRef} preload="none" />

      {/* Current Track Player */}
      {currentTrack && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{currentTrack.title}</p>
              <p className="text-sm text-gray-600 truncate">{artist} • {albumTitle}</p>
            </div>
            <button
              onClick={togglePlayPause}
              className="ml-4 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-1">
              <div 
                className="bg-primary h-1 rounded-full transition-all duration-100"
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Track List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {tracksWithPreview.map((track) => (
          <div
            key={track.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
              currentTrack?.id === track.id 
                ? 'bg-primary/10 border border-primary/20' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => playTrack(track)}
          >
            <div className="flex items-center flex-1 min-w-0">
              <div className="flex-shrink-0 w-8 text-center">
                {currentTrack?.id === track.id && isPlaying ? (
                  <div className="flex justify-center">
                    <div className="flex space-x-1">
                      <div className="w-1 h-3 bg-primary animate-pulse"></div>
                      <div className="w-1 h-3 bg-primary animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-3 bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">{track.trackNumber || '•'}</span>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{track.title}</p>
                <p className="text-sm text-gray-600">{track.duration}</p>
              </div>
            </div>
            <button
              className="ml-2 p-1 text-gray-400 hover:text-primary transition-colors"
              aria-label={`Play ${track.title}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Preview clips are 30 seconds long and provided by iTunes
      </p>
    </div>
  )
} 