"use client";

import React, { useState } from 'react';
import { 
  useAddVenueToFavoriteMutation, 
  useRemoveVenueFromFavoriteMutation,
  useShareVenueMutation,
  useDisableShareVenueMutation 
} from '@/redux/feature/artistApi/venuesSlice';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, MapPin, Share2, Copy, Check, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

export function FavoriteVenueList({
  venues = [],
  isLoading = false,
  totalCount = 0,
  limit = 20,
  offset = 0,
  onPageChange,
  refetch,
  isReadOnly = false
}: {
  venues?: any[];
  isLoading?: boolean;
  totalCount?: number;
  limit?: number;
  offset?: number;
  onPageChange?: (newOffset: number) => void;
  refetch?: () => void;
  isReadOnly?: boolean;
}) {
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const currentPage = Math.floor(offset / limit) + 1;

  const [addVenueToFavorite] = useAddVenueToFavoriteMutation();
  const [removeVenueFromFavorite] = useRemoveVenueFromFavoriteMutation();
  const [shareVenue] = useShareVenueMutation();
  const [disableShareVenue] = useDisableShareVenueMutation();

  const [localFavorites, setLocalFavorites] = useState<Record<string, boolean>>({});
  const [loadingFavorites, setLoadingFavorites] = useState<Record<string, boolean>>({});

  const [sharedVenues, setSharedVenues] = useState<Record<string, string>>({});
  const [loadingShare, setLoadingShare] = useState<Record<string, boolean>>({});
  const [copiedVenueId, setCopiedVenueId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePageClick = (page: number) => {
    if (onPageChange) {
      onPageChange((page - 1) * limit);
    }
  };

  const handleSave = async (e: React.MouseEvent, venueId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalFavorites(prev => ({ ...prev, [venueId]: true }));
    setLoadingFavorites(prev => ({ ...prev, [venueId]: true }));
    try {
      await addVenueToFavorite({ venue_id: String(venueId) }).unwrap();
      toast.success("Venue saved to favorites!");
      if (refetch) refetch();
    } catch (error: any) {
      setLocalFavorites(prev => ({ ...prev, [venueId]: false }));
      toast.error(error.data?.message || error.data?.error?.message || "Failed to save venue");
    } finally {
      setLoadingFavorites(prev => ({ ...prev, [venueId]: false }));
    }
  };

  const handleRemoveFavorites = async (e: React.MouseEvent, venueId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalFavorites(prev => ({ ...prev, [venueId]: false }));
    setLoadingFavorites(prev => ({ ...prev, [venueId]: true }));
    try {
      await removeVenueFromFavorite(String(venueId)).unwrap();
      toast.success("Venue removed from favorites!");
      if (refetch) refetch();
    } catch (error: any) {
      setLocalFavorites(prev => ({ ...prev, [venueId]: true }));
      toast.error(error.data?.message || error.data?.error?.message || "Failed to remove venue from favorites");
    } finally {
      setLoadingFavorites(prev => ({ ...prev, [venueId]: false }));
    }
  };

  const handleShare = async (e: React.MouseEvent, venueId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingShare(prev => ({ ...prev, [venueId]: true }));
    try {
      const res = await shareVenue(venueId).unwrap();
      const token = res?.share?.venue_share_token || res?.venue_share_token || res?.share?.share_token || res?.share_token;
      const url = token 
        ? `${window.location.origin}/favorites/venue/share/${token}`
        : (res?.share?.share_url || `${window.location.origin}/venue/${venueId}`);
      
      setSharedVenues(prev => ({ ...prev, [venueId]: url }));
      toast.success("Venue shared successfully!");
      
      await navigator.clipboard.writeText(url);
      setCopiedVenueId(venueId);
      toast.success("Share link copied to clipboard!");
      setTimeout(() => setCopiedVenueId(null), 2000);
      if (refetch) refetch();
    } catch (error: any) {
      toast.error(error.data?.message || error.data?.error?.message || "Failed to share venue");
    } finally {
      setLoadingShare(prev => ({ ...prev, [venueId]: false }));
    }
  };

  const handleDisableShare = async (e: React.MouseEvent, venueId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingShare(prev => ({ ...prev, [venueId]: true }));
    try {
      await disableShareVenue(venueId).unwrap();
      setSharedVenues(prev => {
        const copy = { ...prev };
        delete copy[venueId];
        return copy;
      });
      toast.success("Sharing disabled for this venue!");
      if (refetch) refetch();
    } catch (error: any) {
      toast.error(error.data?.message || error.data?.error?.message || "Failed to disable sharing");
    } finally {
      setLoadingShare(prev => ({ ...prev, [venueId]: false }));
    }
  };

  const handleCopyLink = async (e: React.MouseEvent, venueId: string, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopiedVenueId(venueId);
      toast.success("Share link copied to clipboard!");
      setTimeout(() => setCopiedVenueId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-colors ${i === currentPage
            ? 'bg-[#00A5E5] text-white shadow-lg shadow-[#7C5CFF]/20'
            : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
            }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className={`flex flex-col gap-6 transition-opacity duration-300 ${isLoading && venues.length > 0 ? 'opacity-50 pointer-events-none' : ''}`}>
        {isLoading && venues.length === 0 && (
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full bg-[#121218] border border-white/5 rounded-lg overflow-hidden flex flex-col md:flex-row animate-pulse">
                <div className="w-full md:w-[280px] h-[200px] md:h-[240px] bg-white/5 shrink-0" />
                <div className="flex-1 p-6 flex flex-col relative">
                  <div className="flex items-baseline gap-3 mb-4 pr-12">
                    <div className="h-7 w-48 bg-white/10 rounded-md" />
                  </div>
                  <div className="mb-6">
                    <div className="h-4 w-20 bg-white/5 rounded mb-3" />
                  </div>
                  <div className="mt-auto flex items-center justify-end gap-3 pt-2">
                    <div className="h-10 w-32 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        {!isLoading && venues.length === 0 && (
          <div className="text-[#A1A1AA] text-center py-12 bg-[#121218] rounded-xl border border-white/5">
            No favorite venues found.
          </div>
        )}
        {!isLoading && venues.map((venue, index) => {
          const name = venue.name || venue.user?.name || 'Unknown Venue';
          const location = venue.city ? `${venue.city}, ${venue.state}` : (venue.location || venue.address || 'Location unknown');
          const capacity = venue.capacity ? `${venue.capacity} capacity` : 'Capacity unknown';
          const image = venue.image || venue.cover_image || venue.user?.image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80';
          const website = venue.website;

          const isFavorited = localFavorites[venue.id] !== undefined ? localFavorites[venue.id] : (venue.is_favorited === true || venue.is_favorited === 'true');
          const isFavoriteLoading = loadingFavorites[venue.id] || false;

          const shareToken = venue.venue_share_token || venue.share_token || venue.share?.venue_share_token || venue.share?.share_token || venue.share_info?.share_token;
          const isInitiallyShared = venue.venue_is_shared === true || venue.is_shared === true || !!shareToken;
          const currentShareUrl = sharedVenues[venue.id] || 
            (shareToken ? `${window.location.origin}/favorites/venue/share/${shareToken}` : null);
          const isShared = isInitiallyShared || !!sharedVenues[venue.id];
          const isSharingLoading = loadingShare[venue.id] || false;

          // Availability Logic
          let availableDates: string[] = ['Available'];
          if (venue.important_dates && venue.important_dates.length > 0) {
            availableDates = venue.important_dates
              .map((d: any) => formatDate(d.date))
              .slice(0, 3);
          } else if (venue.available_ranges && venue.available_ranges.length > 0) {
            availableDates = venue.available_ranges
              .map((r: any) => `${formatDate(r.start)} to ${formatDate(r.end)}`)
              .slice(0, 3);
          }

          return (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ willChange: "transform, opacity" }}
              className="w-full bg-[#121218] border border-white/5 rounded-lg overflow-hidden flex flex-col md:flex-row group transition-colors hover:border-white/10"
            >
              {/* Image */}
              <div className="relative w-full md:w-[280px] h-[200px] md:h-auto shrink-0">
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col relative">
                {!isReadOnly && (
                  <button
                    onClick={(e) => isFavorited ? handleRemoveFavorites(e, venue.id) : handleSave(e, venue.id)}
                    disabled={isFavoriteLoading}
                    className={`absolute cursor-pointer top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isFavoriteLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
                      } ${isFavorited ? 'bg-white/10' : 'bg-white/5'}`}
                  >
                    <Heart
                      fill={isFavorited ? "#ef4444" : "none"}
                      className={`w-5 h-5 transition-colors ${isFavorited
                        ? "text-red-500"
                        : "text-white group-hover:text-red-500"
                        }`}
                    />
                  </button>
                )}

                <div className="flex items-baseline gap-3 mb-3 pr-12">
                  <h2 className="text-xl md:text-2xl font-bold text-white">{name}</h2>
                </div>

                <div className="mb-3 flex flex-col gap-1.5 text-[#A1A1AA]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{location}</span>
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    {venue.score > 0 && (
                      <span className="px-2 py-0.5 rounded bg-white/5 text-xs">
                        Score: {(venue.score * 100).toFixed(0)}/100
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <h3 className="text-xs text-[#A1A1AA] mb-2">Availability</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableDates.map((date: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full border border-white/10 text-[10px] md:text-xs text-[#A1A1AA]"
                      >
                        {date}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
                  {/* Share controls */}
                  <div className="flex items-center gap-2">
                    {!isReadOnly && (
                      isShared && currentShareUrl ? (
                        <div className="flex items-center gap-1.5 bg-[#00A5E5]/10 border border-[#00A5E5]/20 rounded-full px-3 py-1.5 animate-in fade-in duration-200">
                          <span className="text-xs text-[#00A5E5] font-semibold pr-1 border-r border-[#00A5E5]/20">Shared</span>
                          <button
                            onClick={(e) => handleCopyLink(e, venue.id, currentShareUrl)}
                            className="p-1 hover:bg-white/5 rounded-full text-white transition-colors"
                            title="Copy Share Link"
                            disabled={isSharingLoading}
                          >
                            {copiedVenueId === venue.id ? (
                              <Check className="w-3.5 h-3.5 text-green-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={(e) => handleDisableShare(e, venue.id)}
                            className="p-1 hover:bg-red-500/10 rounded-full text-red-400 transition-colors"
                            title="Disable Sharing"
                            disabled={isSharingLoading}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleShare(e, venue.id)}
                          disabled={isSharingLoading}
                          className="px-4 py-2 rounded-full cursor-pointer border border-white/10 text-[#A1A1AA] hover:text-white hover:bg-white/5 text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          Share Venue
                        </button>
                      )
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {website && (
                      <button
                        onClick={() => {
                          window.open(website, "_blank");
                        }}
                        className="px-5 py-2 rounded-full cursor-pointer bg-none text-white text-xs font-semibold transition-colors border border-[#00A5E5]"
                      >
                        View Tickets
                      </button>
                    )}
                    <Link
                      href={`/venue/${venue.id}`}
                      className="px-5 py-2 rounded-full bg-[#00A5E5] text-white text-xs font-semibold transition-colors shadow-lg shadow-[#7C5CFF]/20"
                    >
                      View Venue
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center cursor-pointer gap-2 mt-8 mb-12">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageClick(currentPage - 1)}
            className="w-10 h-10 cursor-pointer rounded-xl flex items-center justify-center border border-white/10 text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="w-5 h-5" />
          </button>

          {renderPaginationButtons()}

          {currentPage < Math.max(1, totalPages - 2) && totalPages > 5 && (
            <>
              <span className="text-[#A1A1AA] px-1">...</span>
              <button
                onClick={() => handlePageClick(totalPages)}
                className="w-10 h-10 cursor-pointer rounded-xl flex items-center justify-center text-sm font-medium text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors">
                {totalPages}
              </button>
            </>
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageClick(currentPage + 1)}
            className="w-10 h-10 cursor-pointer rounded-xl flex items-center justify-center border border-white/10 text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
