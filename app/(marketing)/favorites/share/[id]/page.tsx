"use client";

import React, { useState } from 'react';
import { useGetShareListQuery } from '@/redux/feature/artistApi/favoriteSlice';
import { useParams } from 'next/navigation';
import { ArtistList } from '@/components/search/ArtistList';

export default function ShareList() {
    const { id } = useParams();
    const [offset, setOffset] = useState(0);
    const limit = 20;
    
    // In actual implementation, we might want to pass limit and offset if the API supports it.
    // For now, based on the structure, we fetch using id.
    const { data, isLoading, refetch } = useGetShareListQuery(id as string);

    const sharedFavorites = data?.results || [];
    const totalCount = data?.count || 0;

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1100px] mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                        Shared Favorites List
                    </h1>
                    <p className="text-[#A1A1AA] text-lg max-w-2xl">
                        Explore the artists, venues, and events shared with you.
                    </p>
                </div>

                <div className="w-full">
                    <ArtistList
                        artists={sharedFavorites}
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
