"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  History, 
  Search, 
  MapPin, 
  Calendar, 
  Music, 
  Compass, 
  ArrowRight, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useGetRecentSearchesQuery } from '@/redux/feature/artistApi/artistSlice';
import { useGetUsersQuery } from '@/redux/feature/userSlice';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchHistoryPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  // Get current user to check auth status
  const { data: userProfile, isLoading: isUserLoading } = useGetUsersQuery(undefined);
  
  // Get recent searches from API (skip if user is not logged in)
  const { data: recentSearchesData, isLoading: isHistoryLoading } = useGetRecentSearchesQuery({}, {
    skip: !userProfile
  });

  const recentSearches = recentSearchesData?.results || [];

  // Filter searches client-side based on search term
  const filteredSearches = useMemo(() => {
    if (!searchTerm.trim()) return recentSearches;
    
    const term = searchTerm.toLowerCase();
    return recentSearches.filter((item: any) => {
      const displayTitle = (item.display_title || '').toLowerCase();
      const query = (item.query || '').toLowerCase();
      const location = (item.location || '').toLowerCase();
      const genres = (item.genres || []).join(' ').toLowerCase();
      return (
        displayTitle.includes(term) ||
        query.includes(term) ||
        location.includes(term) ||
        genres.includes(term)
      );
    });
  }, [recentSearches, searchTerm]);

  // Helper to format time
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  // Group searches by date: Today, Yesterday, Earlier
  const groupedSearches = useMemo(() => {
    const groups: { [key: string]: any[] } = {
      'Today': [],
      'Yesterday': [],
      'Earlier': []
    };

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    filteredSearches.forEach((item: any) => {
      if (!item.created_at) {
        groups['Earlier'].push(item);
        return;
      }

      const date = new Date(item.created_at);
      if (isNaN(date.getTime())) {
        groups['Earlier'].push(item);
        return;
      }

      const isToday = date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear();

      const isYesterday = date.getDate() === yesterday.getDate() &&
                          date.getMonth() === yesterday.getMonth() &&
                          date.getFullYear() === yesterday.getFullYear();

      if (isToday) {
        groups['Today'].push(item);
      } else if (isYesterday) {
        groups['Yesterday'].push(item);
      } else {
        groups['Earlier'].push(item);
      }
    });

    // Remove empty groups
    return Object.fromEntries(
      Object.entries(groups).filter(([_, items]) => items.length > 0)
    );
  }, [filteredSearches]);

  // Handle rerunning a search
  const handleRerunSearch = (item: any) => {
    const queryParams = new URLSearchParams();
    
    if (item.query) {
      queryParams.set('q', item.query);
    }
    if (item.genres && item.genres.length > 0) {
      queryParams.set('genres', item.genres.join(','));
    }
    if (item.radius_miles) {
      queryParams.set('radius_miles', String(item.radius_miles));
    }
    if (item.latitude) {
      queryParams.set('latitude', String(item.latitude));
    }
    if (item.longitude) {
      queryParams.set('longitude', String(item.longitude));
    }
    if (item.target_date) {
      queryParams.set('available_start', item.target_date);
      queryParams.set('available_end', item.target_date);
    }
    if (item.location) {
      queryParams.set('locationText', item.location);
    } else if (item.latitude && item.longitude) {
      queryParams.set('locationText', `${item.latitude}, ${item.longitude}`);
    }

    // Redirect user to the search page with the active search filters
    router.push(`/search?${queryParams.toString()}`);
  };

  const isLoading = isUserLoading || (userProfile && isHistoryLoading);

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Premium background glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00A5E5]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#7C5CFF]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3 text-[#00A5E5]">
              <History className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Search History
            </h1>
            <p className="text-[#A1A1AA] text-lg max-w-2xl">
              Keep track of your search activity and rerun queries instantly to find artists or venues.
            </p>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="space-y-8">
            <div className="h-12 bg-white/5 rounded-xl w-72 animate-pulse" />
            <SearchHistorySkeleton />
          </div>
        ) : !userProfile ? (
          // Log In Required state
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-4 bg-white/[0.01] border border-white/5 rounded-3xl text-center backdrop-blur-md"
          >
            <div className="p-4 bg-white/5 rounded-2xl text-white/40 mb-6">
              <History className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Sign in to view history</h3>
            <p className="text-[#A1A1AA] text-sm max-w-sm mb-8 leading-relaxed">
              Log in to save, review, and quickly re-run your location and genre searches automatically.
            </p>
            <Link
              href="/login"
              className="px-8 py-3 rounded-full bg-[#00A5E5] text-white text-sm font-semibold hover:bg-[#0090C8] transition-all hover:scale-105 shadow-lg shadow-[#00A5E5]/20"
            >
              Sign In to Your Account
            </Link>
          </motion.div>
        ) : recentSearches.length === 0 ? (
          // Empty State (no recent searches run)
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-4 bg-white/[0.01] border border-white/5 rounded-3xl text-center backdrop-blur-md"
          >
            <div className="p-4 bg-white/5 rounded-2xl text-white/40 mb-6">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Search History Yet</h3>
            <p className="text-[#A1A1AA] text-sm max-w-sm mb-8 leading-relaxed">
              It looks like you haven't run any searches yet. Start browsing artists or venues nearby!
            </p>
            <Link
              href="/search"
              className="px-8 py-3 rounded-full bg-[#00A5E5] text-white text-sm font-semibold hover:bg-[#0090C8] transition-all hover:scale-105 shadow-lg shadow-[#00A5E5]/20"
            >
              Start Searching
            </Link>
          </motion.div>
        ) : (
          // Search History Data Render
          <div className="space-y-8">
            
            {/* Filter Search History Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]/50" />
              <input
                type="text"
                placeholder="Search history by genre, location, query..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#121218]/80 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-[#A1A1AA]/40 focus:outline-none focus:border-[#00A5E5]/40 transition-colors backdrop-blur-md"
              />
            </div>

            {/* Filtered Empty State */}
            {filteredSearches.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center bg-white/[0.01] border border-white/5 rounded-2xl"
              >
                <p className="text-[#A1A1AA] text-sm">No recent searches match &ldquo;{searchTerm}&rdquo;</p>
              </motion.div>
            ) : (
              <div className="space-y-10">
                {Object.entries(groupedSearches).map(([groupTitle, items]) => (
                  <div key={groupTitle} className="space-y-4">
                    
                    {/* Group Title (Today, Yesterday, Earlier) */}
                    <div className="flex items-center gap-2 px-2">
                      <h2 className="text-sm font-semibold tracking-wider text-[#A1A1AA]/60 uppercase">
                        {groupTitle}
                      </h2>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>

                    {/* Group Items */}
                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {items.map((item: any, index: number) => (
                          <motion.div
                            key={item.id || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            onClick={() => handleRerunSearch(item)}
                            className="group flex flex-col md:flex-row md:items-center justify-between p-5 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-[#00A5E5]/30 rounded-2xl cursor-pointer transition-all duration-200"
                          >
                            {/* Left Side: Search info */}
                            <div className="flex items-start gap-4 flex-grow min-w-0">
                              <div className="p-3 bg-white/5 rounded-xl text-white/40 group-hover:text-[#00A5E5] group-hover:bg-[#00A5E5]/10 transition-colors shrink-0">
                                <Search className="w-4 h-4" />
                              </div>

                              <div className="min-w-0 flex-grow">
                                <h3 className="font-semibold text-base text-white group-hover:text-[#00A5E5] transition-colors mb-2 break-words leading-tight">
                                  {item.display_title || (item.query ? `"${item.query}"` : "Search")}
                                </h3>

                                {/* Badges */}
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {/* Query tag if text search */}
                                  {item.query && (
                                    <span className="text-[11px] font-medium px-2 py-0.5 bg-white/5 text-[#A1A1AA] border border-white/5 rounded-full">
                                      Query: &ldquo;{item.query}&rdquo;
                                    </span>
                                  )}

                                  {/* Genres tags */}
                                  {item.genres && item.genres.map((g: string) => (
                                    <span key={g} className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 bg-[#7C5CFF]/10 text-[#A892FF] border border-[#7C5CFF]/20 rounded-full">
                                      <Music className="w-3 h-3" />
                                      {g}
                                    </span>
                                  ))}

                                  {/* Location tags */}
                                  {(item.location || (item.latitude && item.longitude)) && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 bg-[#00A5E5]/10 text-[#33BEF5] border border-[#00A5E5]/20 rounded-full">
                                      <MapPin className="w-3 h-3" />
                                      {item.location || `${Number(item.latitude).toFixed(2)}, ${Number(item.longitude).toFixed(2)}`}
                                    </span>
                                  )}

                                  {/* Distance radius */}
                                  {item.radius_miles && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 bg-white/5 text-[#A1A1AA] border border-white/5 rounded-full">
                                      <Compass className="w-3 h-3" />
                                      {item.radius_miles} miles
                                    </span>
                                  )}

                                  {/* Target Search Date */}
                                  {item.target_date && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full">
                                      <Calendar className="w-3 h-3" />
                                      {new Date(item.target_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right Side: Metadata / Action button */}
                            <div className="flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-white/5 shrink-0">
                              <div className="text-xs text-[#A1A1AA]/50 group-hover:text-[#A1A1AA] transition-colors">
                                {item.created_at ? formatTime(item.created_at) : ''}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-[#00A5E5] font-semibold uppercase tracking-wider bg-[#00A5E5]/10 group-hover:bg-[#00A5E5] group-hover:text-white px-4 py-2 rounded-full transition-all duration-200">
                                Rerun
                                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

// Skeleton loading component
function SearchHistorySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/[0.01] border border-white/5 rounded-2xl animate-pulse">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-11 h-11 bg-white/5 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2.5">
              <div className="h-5 bg-white/5 rounded w-1/3" />
              <div className="flex flex-wrap gap-2 pt-1">
                <div className="h-5 bg-white/5 rounded-full w-20" />
                <div className="h-5 bg-white/5 rounded-full w-24" />
                <div className="h-5 bg-white/5 rounded-full w-16" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-white/5 shrink-0">
            <div className="h-4 bg-white/5 rounded w-12" />
            <div className="h-8 bg-white/5 rounded-full w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
