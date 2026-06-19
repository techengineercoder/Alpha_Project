"use client";

import React, { useState } from 'react';
import { useFavoritesByAllQuery } from '@/redux/feature/artistApi/bookingSlice';
import { ArtistList } from '@/components/search/ArtistList';

export default function FavoritesPage() {
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const { data, isLoading, refetch } = useFavoritesByAllQuery(undefined);

  const favorites = data?.results || [];
  const totalCount = data?.count || 0;

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Your Favorites
          </h1>
          <p className="text-[#A1A1AA] text-lg max-w-2xl">
            Keep track of your favorite artists, venues, and events all in one place.
          </p>
        </div>

        <div className="w-full">
          <ArtistList
            artists={favorites}
            isLoading={isLoading}
            refetch={refetch}
            totalCount={totalCount}
            limit={limit}
            offset={offset}
            onPageChange={setOffset}
          />
        </div>
      </div>
    </div >
  );
}
