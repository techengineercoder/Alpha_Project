"use client";

import React, { useState } from 'react';
import { SearchFilters, SearchFiltersState } from '@/components/search/SearchFilters';
import { ArtistList } from '@/components/search/ArtistList';
import { Search, Share } from 'lucide-react';
import { useGetArtistsQuery } from '@/redux/feature/artistApi/artistSlice';
import { useGetVenuesQuery } from '@/redux/feature/artistApi/venuesSlice';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { VenueList } from '@/components/search/VenueList';
import { toast } from 'sonner';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [params, setParams] = useState<SearchFiltersState & { limit: number; offset: number; type: string }>({
    q: searchParams.get('q') || '',
    genres: searchParams.get('genres') || '',
    radius_miles: searchParams.get('radius_miles') || '',
    latitude: searchParams.get('latitude') || '',
    longitude: searchParams.get('longitude') || '',
    available_start: searchParams.get('available_start') || searchParams.get('available_from') || searchParams.get('available_on') || '',
    available_end: searchParams.get('available_end') || searchParams.get('available_to') || searchParams.get('available_on') || '',
    favorites_only: searchParams.get('favorites_only') === 'true',
    locationText: searchParams.get('locationText') || '',
    limit: Number(searchParams.get('limit')) || 20,
    offset: Number(searchParams.get('offset')) || 0,
    type: searchParams.get('type') || 'artists',
  });

  const [debouncedParams, setDebouncedParams] = useState(params);

  React.useEffect(() => {
    const urlType = searchParams.get('type') || 'artists';
    setParams(prev => {
      if (prev.type === urlType) return prev;
      return { ...prev, type: urlType };
    });
  }, [searchParams]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedParams(params);
    }, 500); // 500ms debounce delay
    return () => clearTimeout(handler);
  }, [params]);

  const queryParams = Object.fromEntries(
    Object.entries(debouncedParams)
      .map(([k, v]) => [k, String(v)])
      .filter(([_, v]) => v !== '' && v !== 'false')
  );

  // Do not send locationText to the API
  delete queryParams.locationText;

  // Handle date filters according to API requirements
  if (debouncedParams.available_start) {
    if (!debouncedParams.available_end || debouncedParams.available_start === debouncedParams.available_end) {
      queryParams.available_on = debouncedParams.available_start;
    } else {
      queryParams.available_from = debouncedParams.available_start;
      queryParams.available_to = debouncedParams.available_end;
    }
    delete queryParams.available_start;
    delete queryParams.available_end;
  }

  // Sync URL with active filters for easy sharing
  React.useEffect(() => {
    // We want the URL to explicitly mirror our exact debounced state structure
    const urlQuery = new URLSearchParams();
    Object.entries(debouncedParams).forEach(([k, v]) => {
      if (v !== '' && v !== false) {
        urlQuery.set(k, String(v));
      }
    });

    const newQueryStr = urlQuery.toString();
    const currentQueryStr = new URLSearchParams(window.location.search).toString();

    if (currentQueryStr !== newQueryStr) {
      router.replace(`/search?${newQueryStr}`, { scroll: false });
    }
  }, [debouncedParams, router]);


  const { data: artistsData, isLoading: isLoadingArtists, isFetching: isFetchingArtists, refetch } = useGetArtistsQuery(queryParams as Record<string, string>, {
    skip: params.type === 'venue'
  });

  const { data: venuesData, isLoading: isLoadingVenues, isFetching: isFetchingVenues } = useGetVenuesQuery(queryParams as Record<string, string>, {
    skip: params.type !== 'venue'
  });

  const isDebouncing = params !== debouncedParams;
  const isLoading = isDebouncing || (params.type === 'venue' ? (isLoadingVenues || isFetchingVenues) : (isLoadingArtists || isFetchingArtists));
  const data = params.type === 'venue' ? venuesData : artistsData;
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
      type: 'artists',
    });
    router.push('/search', { scroll: false });
  };

  const handlePageChange = (newOffset: number) => {
    setParams(prev => ({ ...prev, offset: newOffset }));
  };

  const items = data?.results || [];
  const totalCount = data?.count || 0;

  const startCount = totalCount > 0 ? params.offset + 1 : 0;
  const endCount = Math.min(params.offset + params.limit, totalCount);

  const handleShare = async () => {
    try {
      const shareUrl = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: 'GetAvails Search',
          text: `Check out these ${params.type === 'venue' ? 'venues' : 'artists'} on GetAvails!`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error("Failed to share link");
      }
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#0B0B0F] py-[100px]  sm:py-[150px]  px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          {/* Left Title (Above Filters) */}
          <div className="w-full lg:w-[320px] shrink-0">
            <h1 className="text-3xl font-bold text-white mb-2">Search {params.type === 'venue' ? 'Venues' : 'Artists'}</h1>
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
                placeholder={`Search ${params.type === 'venue' ? 'Venue' : 'Artist'}...`}
                className="w-full bg-[#121218] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-[#A1A1AA]/50 focus:outline-none focus:border-[#9D7CFF]/50 transition-colors"
              />
            </div>
            <button
              onClick={handleShare}
              className="flex cursor-pointer items-center gap-2 text-sm text-[#A1A1AA] hover:text-white transition-colors shrink-0 px-4"
            >
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Content Row */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          {/* <div className="sticky top-24"></div> */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div>
              <SearchFilters
                filters={params}
                onChange={React.useCallback((updates: any) => {
                  setParams(prev => ({ ...prev, ...updates }));
                  if (updates.type) {
                    const currentType = searchParams.get('type') || 'artists';
                    if (updates.type !== currentType) {
                      const newQuery = new URLSearchParams(searchParams.toString());
                      newQuery.set('type', updates.type);
                      router.replace(`/search?${newQuery.toString()}`, { scroll: false });
                    }
                  }
                }, [searchParams, router])}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
              />
            </div>
          </div>

          {/* Right Content - Results */}
          <div className="flex-1 min-w-0">
            {params.type === 'venue' ? (
              <VenueList
                venues={items}
                isLoading={isLoading}
                totalCount={totalCount}
                limit={params.limit}
                offset={params.offset}
                onPageChange={handlePageChange}
              />
            ) : (
              <ArtistList
                artists={items}
                isLoading={isLoading}
                totalCount={totalCount}
                limit={params.limit}
                refetch={refetch}
                offset={params.offset}
                onPageChange={handlePageChange}
              />
            )}
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
