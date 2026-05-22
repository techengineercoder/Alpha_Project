"use client";

import React, { useState } from 'react';
import { SearchFilters, SearchFiltersState } from '@/components/search/SearchFilters';
import { ArtistList } from '@/components/search/ArtistList';
import { Search, Share } from 'lucide-react';
import { useGetArtistsQuery } from '@/redux/feature/artistApi/artistSlice';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [params, setParams] = useState<SearchFiltersState & { limit: number; offset: number }>({
    q: searchParams.get('q') || '',
    genres: searchParams.get('genres') || '',
    radius_miles: searchParams.get('radius_miles') || '',
    latitude: searchParams.get('latitude') || '',
    longitude: searchParams.get('longitude') || '',
    available_start: searchParams.get('available_from') || searchParams.get('available_on') || '',
    available_end: searchParams.get('available_to') || searchParams.get('available_on') || '',
    favorites_only: searchParams.get('favorites_only') === 'true',
    locationText: searchParams.get('locationText') || '',
    limit: Number(searchParams.get('limit')) || 20,
    offset: Number(searchParams.get('offset')) || 0,
  });

  const queryParams = Object.fromEntries(
    Object.entries(params)
      .map(([k, v]) => [k, String(v)])
      .filter(([_, v]) => v !== '' && v !== 'false')
  );

  // Do not send locationText to the API
  delete queryParams.locationText;

  // Handle date filters according to API requirements
  if (params.available_start) {
    if (!params.available_end || params.available_start === params.available_end) {
      queryParams.available_on = params.available_start;
    } else {
      queryParams.available_from = params.available_start;
      queryParams.available_to = params.available_end;
    }
    delete queryParams.available_start;
    delete queryParams.available_end;
  }



  const { data, isLoading } = useGetArtistsQuery(queryParams as Record<string, string>);

  const handleApplyFilters = () => {
    setParams(prev => ({ ...prev, offset: 0 }));
    const newQuery = new URLSearchParams(queryParams as Record<string, string>);
    router.push(`/search?${newQuery.toString()}`, { scroll: false });
  };

  const handleResetFilters = () => {
    setParams({
      q: '',
      genres: '',
      radius_miles: '',
      latitude: '',
      longitude: '',
      available_start: '',
      available_end: '',
      favorites_only: false,
      locationText: '',
      limit: 20,
      offset: 0,
    });
    router.push('/search', { scroll: false });
  };

  const handlePageChange = (newOffset: number) => {
    setParams(prev => ({ ...prev, offset: newOffset }));
  };

  const artists = data?.results || [];
  const totalCount = data?.count || 0;

  const startCount = totalCount > 0 ? params.offset + 1 : 0;
  const endCount = Math.min(params.offset + params.limit, totalCount);

  return (
    <main className="w-full min-h-screen bg-[#0B0B0F] py-[100px]  sm:py-[150px]  px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          {/* Left Title (Above Filters) */}
          <div className="w-full lg:w-[320px] shrink-0">
            <h1 className="text-3xl font-bold text-white mb-2">Search Artists</h1>
            <p className="text-[#A1A1AA] text-sm">
              {isLoading ? 'Loading...' : `Showing ${startCount}-${endCount} of ${totalCount} Results`}
            </p>
          </div>

          {/* Right Header (Above Artist List) */}
          <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
              <input
                type="text"
                value={params.q}
                onChange={(e) => setParams(prev => ({ ...prev, q: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApplyFilters();
                }}
                placeholder="Search Artist..."
                className="w-full bg-[#121218] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-[#A1A1AA]/50 focus:outline-none focus:border-[#9D7CFF]/50 transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-white transition-colors shrink-0 px-4">
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Content Row */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="sticky top-24">
              <SearchFilters
                filters={params}
                onChange={(updates) => setParams(prev => ({ ...prev, ...updates }))}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
              />
            </div>
          </div>

          {/* Right Content - Results */}
          <div className="flex-1 min-w-0">
            <ArtistList
              artists={artists}
              isLoading={isLoading}
              totalCount={totalCount}
              limit={params.limit}
              offset={params.offset}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
