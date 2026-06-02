"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, Share, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { BookingModal } from './BookingModal';
import Link from 'next/link';
import { useAddFavoritesMutation } from '@/redux/feature/artistApi/bookingSlice';
import { toast } from 'sonner';

export function ArtistList({
  artists = [],
  isLoading = false,
  totalCount = 0,
  limit = 20,
  offset = 0,
  onPageChange
}: {
  artists?: any[];
  isLoading?: boolean;
  totalCount?: number;
  limit?: number;
  offset?: number;
  onPageChange?: (newOffset: number) => void;
}) {
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  const [addFavorites, { isLoading: addFavoritesLoading }] = useAddFavoritesMutation();


  const totalPages = Math.ceil(totalCount / limit) || 1;
  const currentPage = Math.floor(offset / limit) + 1;

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
            ? 'bg-[#7C5CFF] text-white shadow-lg shadow-[#7C5CFF]/20'
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
      {/* Artist Cards */}
      <div className="flex flex-col gap-6">
        {isLoading && (
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full bg-[#121218] border border-white/5 rounded-lg overflow-hidden flex flex-col md:flex-row animate-pulse">
                {/* Image Placeholder */}
                <div className="w-full md:w-[280px] h-[200px] md:h-[240px] bg-white/5 shrink-0" />

                {/* Content Placeholder */}
                <div className="flex-1 p-6 flex flex-col relative">
                  <div className="flex items-baseline gap-3 mb-4 pr-12">
                    <div className="h-7 w-48 bg-white/10 rounded-md" />
                    <div className="h-5 w-24 bg-white/5 rounded-md hidden md:block" />
                  </div>
                  <div className="mb-6">
                    <div className="h-4 w-20 bg-white/5 rounded mb-3" />
                    <div className="flex flex-wrap gap-2">
                      <div className="h-7 w-24 bg-white/5 rounded-full" />
                      <div className="h-7 w-28 bg-white/5 rounded-full" />
                      <div className="h-7 w-20 bg-white/5 rounded-full hidden md:block" />
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-end gap-3 pt-2">
                    <div className="h-10 w-40 bg-white/5 rounded-full hidden md:block" />
                    <div className="h-10 w-32 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        {!isLoading && artists.length === 0 && (
          <div className="text-[#A1A1AA] text-center py-10">No artists found.</div>
        )}
        {!isLoading && artists.map((artist, index) => {
          const name = artist.name || artist.user?.name || 'Unknown Artist';
          const role = artist.genres?.join(', ') || artist.user?.role || artist.provider_name || '';
          const image = artist.image || artist.cover_image || artist.user?.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80';

          let availableDates = ['Available'];
          if (artist.booked_dates && artist.booked_dates.length > 0) {
            availableDates = artist.booked_dates.map((d: any) => d.start_date || d.date).slice(0, 4);
          } else if (artist.available_ranges && artist.available_ranges.length > 0) {
            availableDates = artist.available_ranges.map((r: any) => `${r.start} to ${r.end}`).slice(0, 3);
          }

          const handleSave = async (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            try {
              await addFavorites({ artist_id: String(artist.id) }).unwrap();
              toast.success(artist.is_favorited ? "Artist removed from favorites" : "Artist saved to favorites!");
            } catch (error: any) {
              if (error.status === 401 || error.data?.error?.status === 401) {
                toast.error("Please log in to save favorites");
              } else {
                toast.error(error.data?.error?.message || error.data?.message || "Failed to save artist");
              }
            }
          };

          return (
            <motion.div
              key={artist.id}
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
                {/* Heart Icon */}
                <button
                  onClick={handleSave}
                  disabled={addFavoritesLoading}
                  className={`absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${addFavoritesLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
                    } ${artist.is_favorited ? 'bg-white/10' : 'bg-white/5'}`}
                >
                  <Heart className={`w-4 h-4 transition-colors ${artist.is_favorited ? 'fill-[#7C5CFF] text-[#7C5CFF]' : 'text-[#A1A1AA] hover:text-[#7C5CFF]'
                    }`} />
                </button>

                <div className="flex items-baseline gap-3 mb-4 pr-12">
                  <h2 className="text-xl md:text-2xl font-bold text-white">{name}</h2>
                  {/* {role && <span className="text-sm md:text-base text-[#A1A1AA] capitalize">{role}</span>} */}
                </div>

                <div className="mb-6">
                  <h3 className="text-xs text-[#A1A1AA] mb-3">Availability</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableDates.map((date: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full border border-white/10 text-[10px] md:text-xs text-[#A1A1AA] hover:border-white/30 hover:text-white transition-colors cursor-pointer"
                      >
                        {date}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-end gap-3 pt-2">
                  <Link href={`/search/${artist.id}`} className="px-6 py-2.5 rounded-full border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors">
                    See All Availability
                  </Link>
                  <button
                    onClick={() => setSelectedArtist(name)}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#9D7CFF] text-white text-sm font-medium hover:bg-[#6A4BE5] transition-colors shadow-lg shadow-[#7C5CFF]/20"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 mb-12">
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

      {/* Booking Modal */}
      <BookingModal
        isOpen={!!selectedArtist}
        onClose={() => setSelectedArtist(null)}
        artistName={selectedArtist || ''}
        artistId={selectedArtist || ''}
      />
    </div>
  );
}
