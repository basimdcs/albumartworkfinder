'use client'

import { trackEvent } from '@/components/google-analytics'
import { useState } from 'react'

export default function TestAnalyticsPage() {
  const [events, setEvents] = useState<string[]>([])

  const addEvent = (eventName: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setEvents(prev => [`${timestamp}: ${eventName}`, ...prev])
  }

  const testEvents = [
    {
      name: 'Test Page View',
      action: () => {
        trackEvent('test_page_view', {
          page_path: '/test-analytics',
          test_type: 'manual'
        })
        addEvent('Page view tracked')
      }
    },
    {
      name: 'Test Search',
      action: () => {
        trackEvent('test_search', {
          search_term: 'Taylor Swift',
          result_count: 25,
          test_type: 'manual'
        })
        addEvent('Search event tracked')
      }
    },
    {
      name: 'Test Album Click',
      action: () => {
        trackEvent('test_album_click', {
          album_id: '12345',
          album_title: 'Test Album',
          artist_name: 'Test Artist',
          test_type: 'manual'
        })
        addEvent('Album click tracked')
      }
    },
    {
      name: 'Test Download',
      action: () => {
        trackEvent('test_download', {
          album_id: '12345',
          album_title: 'Test Album',
          download_source: 'test_page',
          test_type: 'manual'
        })
        addEvent('Download event tracked')
      }
    }
  ]

  const checkGoogleAnalytics = () => {
    if (typeof window !== 'undefined') {
      const hasGtag = typeof window.gtag !== 'undefined'
      const hasDataLayer = Array.isArray(window.dataLayer)
      const gaId = process.env.NEXT_PUBLIC_GA_ID
      
      addEvent(`Google Analytics Status:`)
      addEvent(`- gtag function: ${hasGtag ? '✅ Available' : '❌ Missing'}`)
      addEvent(`- dataLayer: ${hasDataLayer ? '✅ Available' : '❌ Missing'}`)
      addEvent(`- GA ID: ${gaId || '❌ Not set'}`)
      
      if (hasDataLayer) {
        addEvent(`- dataLayer length: ${window.dataLayer.length}`)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Google Analytics Test Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Controls</h2>
            
            <div className="space-y-4">
              <button
                onClick={checkGoogleAnalytics}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Check Google Analytics Status
              </button>
              
              {testEvents.map((test, index) => (
                <button
                  key={index}
                  onClick={test.action}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {test.name}
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Instructions:</h3>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Open browser developer tools (F12)</li>
                <li>2. Go to Console tab</li>
                <li>3. Click "Check Google Analytics Status"</li>
                <li>4. Look for GA loading messages in console</li>
                <li>5. Test events and check console for tracking logs</li>
                <li>6. Check Network tab for gtag requests</li>
              </ol>
            </div>
          </div>
          
          {/* Event Log */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Log</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-gray-500 text-center">No events yet. Click a test button to start.</p>
              ) : (
                <div className="space-y-2">
                  {events.map((event, index) => (
                    <div key={index} className="text-sm font-mono text-gray-700 border-b border-gray-200 pb-1">
                      {event}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={() => setEvents([])}
              className="mt-4 w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear Log
            </button>
          </div>
        </div>
        
        {/* Debug Information */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>GA ID:</strong> {process.env.NEXT_PUBLIC_GA_ID || 'Not set'}</p>
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 