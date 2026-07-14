"use client";

import React, { useState } from 'react';
import { useAddVenueToFavoriteMutation, useRemoveVenueFromFavoriteMutation } from '@/redux/feature/artistApi/venuesSlice';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { VenueInquiryModal } from './VenueInquiryModal';

export function VenueList({
  venues = [],
  isLoading = false,
  totalCount = 0,
  limit = 20,
  offset = 0,
  onPageChange
}: {
  venues?: any[];
  isLoading?: boolean;
  totalCount?: number;
  limit?: number;
  offset?: number;
  onPageChange?: (newOffset: number) => void;
}) {
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const currentPage = Math.floor(offset / limit) + 1;


  const [addVenueToFavorite] = useAddVenueToFavoriteMutation()
  const [removeVenueFromFavorite] = useRemoveVenueFromFavoriteMutation()

  const [localFavorites, setLocalFavorites] = useState<Record<string, boolean>>({});
  const [loadingFavorites, setLoadingFavorites] = useState<Record<string, boolean>>({});
  const [selectedVenue, setSelectedVenue] = useState<{ id: string | number, name: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleSave = async (e: React.MouseEvent, venueId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalFavorites(prev => ({ ...prev, [venueId]: true }));
    setLoadingFavorites(prev => ({ ...prev, [venueId]: true }));
    try {
      await addVenueToFavorite({ venue_id: String(venueId) }).unwrap();
      toast.success("Venue saved to favorites!");
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
    } catch (error: any) {
      setLocalFavorites(prev => ({ ...prev, [venueId]: true }));
      toast.error(error.data?.message || error.data?.error?.message || "Failed to remove venue from favorites");
    } finally {
      setLoadingFavorites(prev => ({ ...prev, [venueId]: false }));
    }
  };

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
      {/* Venue Cards */}
      <div className="flex flex-col gap-6">
        {isLoading && (
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
          <div className="text-[#A1A1AA] text-center py-10">No venues found.</div>
        )}
        {!isLoading && venues.map((venue, index) => {
          const name = venue.name || venue.user?.name || 'Unknown Venue';
          const location = venue.city ? `${venue.city}, ${venue.state}` : (venue.location || venue.address || 'Location unknown');
          const capacity = venue.capacity ? `${venue.capacity} capacity` : 'Capacity unknown';
          const image = venue.image || venue.cover_image || venue.user?.image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80';
          const website = venue.website;

          const isFavorited = localFavorites[venue.id] !== undefined ? localFavorites[venue.id] : (venue.is_favorited === true || venue.is_favorited === 'true');
          const isFavoriteLoading = loadingFavorites[venue.id] || false;

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

                <div className="flex items-baseline gap-3 mb-3 pr-12">
                  <h2 className="text-xl md:text-2xl font-bold text-white">{name}</h2>
                </div>

                <div className="mb-3 flex flex-col gap-1.5 text-[#A1A1AA]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{location}</span>
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    {/* <span>{capacity}</span> */}
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
                        onClick={() => {
                          setSelectedVenue({ id: venue.id, name });
                          if (date !== 'Available') {
                            if (date.includes(' to ')) {
                              setSelectedDate(new Date(date.split(' to ')[0]));
                            } else {
                              setSelectedDate(new Date(date));
                            }
                          } else {
                            setSelectedDate(null);
                          }
                        }}
                        className="px-3 py-1.5 rounded-full border border-white/10 text-[10px] md:text-xs text-[#A1A1AA] hover:border-[#00A5E5] hover:text-[#00A5E5] transition-colors cursor-pointer"
                      >
                        {date}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-end gap-3 pt-2">
                  <Link
                    href={`/venue/${venue.id}`}
                    className="px-6 py-2.5 rounded-full cursor-pointer bg-none text-white text-sm font-medium  transition-colors border border-[#00A5E5]"

                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedVenue({ id: venue.id, name: name });
                      setSelectedDate(null);
                    }}
                    className="px-6 py-2.5 cursor-pointer rounded-full bg-[#00A5E5] text-white text-sm font-medium  transition-colors shadow-lg shadow-[#7C5CFF]/20"

                  >
                    Inquire
                  </button>
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

      {/* Venue Inquiry Modal */}
      <VenueInquiryModal
        isOpen={!!selectedVenue}
        onClose={() => {
          setSelectedVenue(null);
          setSelectedDate(null);
        }}
        venueName={selectedVenue?.name || ''}
        venueId={selectedVenue?.id || ''}
        initialDate={selectedDate}
      />
    </div>
  );
}
