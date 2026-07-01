"use client";

import React, { useState } from 'react';
import { useGetSharedVenueListQuery } from '@/redux/feature/artistApi/venuesSlice';
import { useParams } from 'next/navigation';
import { FavoriteVenueList } from '@/components/search/FavoriteVenueList';

export default function SharedVenueList() {
    const { id } = useParams();
    const [offset, setOffset] = useState(0);
    const limit = 20;
    
    const { data, isLoading, refetch } = useGetSharedVenueListQuery(id as string, { skip: !id });

    const sharedVenues = data?.results || [];
    const totalCount = data?.count || 0;

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1100px] mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                        Shared Favorites List - Venues
                    </h1>
                    <p className="text-[#A1A1AA] text-lg max-w-2xl">
                        Explore the venues shared with you.
                    </p>
                </div>

                <div className="w-full">
                    <FavoriteVenueList
                        venues={sharedVenues}
                        isLoading={isLoading}
                        refetch={refetch}
                        totalCount={totalCount}
                        limit={limit}
                        offset={offset}
                        onPageChange={setOffset}
                        isReadOnly={true}
                    />
                </div>
            </div>
        </div >
    );
}
