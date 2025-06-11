import React from 'react'

export default function SearchSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="mb-6 flex items-center space-x-2">
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
          <div className="h-4 w-1 bg-gray-200 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>

        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 sm:h-10 sm:w-80"></div>
          <div className="h-5 bg-gray-200 rounded w-48 sm:w-60"></div>
        </div>

        {/* Search form skeleton */}
        <div className="mb-8 rounded-lg bg-gray-50 p-4 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:max-w-2xl">
            <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 w-full sm:w-24 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="mt-2 h-4 bg-gray-200 rounded w-3/4 sm:w-1/2"></div>
        </div>

        {/* Results grid skeleton - responsive */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 