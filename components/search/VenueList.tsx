"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
                <div className="flex items-baseline gap-3 mb-4 pr-12">
                  <h2 className="text-xl md:text-2xl font-bold text-white">{name}</h2>
                </div>

                <div className="mb-6 flex flex-col gap-2 text-[#A1A1AA]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{location}</span>
                  </div>
                  <div className="text-sm mt-1">
                    {capacity}
                  </div>
                  {venue.score > 0 && (
                    <div className="text-sm mt-1">
                      Score: {(venue.score * 100).toFixed(0)}/100
                    </div>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-end gap-3 pt-2">
                  <Link
                    href={`/venue/${venue.id}`}
                    className="px-6 py-2.5 rounded-full bg-[#00A5E5] text-white text-sm font-medium  transition-colors shadow-lg shadow-[#7C5CFF]/20"
                  >
                    View Venue
                  </Link>
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
