'use client'

import { useEffect, useState } from 'react'

interface PWAProviderProps {
  children: React.ReactNode
}

export default function PWAProvider({ children }: PWAProviderProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check initial online status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false)
    setDeferredPrompt(null)
  }

  return (
    <>
      {children}
      
      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 px-4 z-50">
          <span className="text-sm font-medium">
            You're offline. Some features may not work.
          </span>
        </div>
      )}

      {/* PWA install prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white rounded-lg p-4 shadow-lg z-50 sm:left-auto sm:right-4 sm:max-w-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Install App</h3>
              <p className="text-xs opacity-90 mt-1">
                Install Album Artwork Finder for a better mobile experience
              </p>
            </div>
            <button
              onClick={dismissInstallPrompt}
              className="text-white/80 hover:text-white"
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="flex space-x-2 mt-3">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-white text-blue-600 rounded-md py-2 px-4 text-sm font-medium hover:bg-blue-50"
            >
              Install
            </button>
            <button
              onClick={dismissInstallPrompt}
              className="px-4 py-2 text-sm text-white/80 hover:text-white"
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </>
  )
} 