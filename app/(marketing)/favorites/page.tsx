"use client";

import React, { useState } from 'react';
import { useFavoritesByAllQuery } from '@/redux/feature/artistApi/bookingSlice';
import { useShareListMutation, useDisableShareListMutation, useShareStatusCheckQuery } from '@/redux/feature/artistApi/favoriteSlice';
import { 
  useGetFavoriteVenuesQuery,
  useShareVenueMutation,
  useDisableShareVenueMutation,
  useCheckVenueShareStatusQuery
} from '@/redux/feature/artistApi/venuesSlice';
import { ArtistList } from '@/components/search/ArtistList';
import { FavoriteVenueList } from '@/components/search/FavoriteVenueList';
import { toast } from 'sonner';
import { Share2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<'artists' | 'venues'>('artists');
  const [offset, setOffset] = useState(0);
  const [venueOffset, setVenueOffset] = useState(0);
  const limit = 20;

  // Artist Favorites Queries
  const { data, isLoading, refetch } = useFavoritesByAllQuery(undefined);
  const [shareList, { isLoading: isSharing }] = useShareListMutation();
  const [disableShare, { isLoading: isDisabling }] = useDisableShareListMutation();
  const { data: shareStatus, isLoading: isShareStatusLoading, refetch: refetchShareStatus } = useShareStatusCheckQuery(undefined);

  // Venue Favorites Queries
  const { 
    data: venuesData, 
    isLoading: isVenuesLoading, 
    refetch: refetchVenues 
  } = useGetFavoriteVenuesQuery({ limit, offset: venueOffset }, { skip: false });

  const [shareVenueList, { isLoading: isSharingVenueList }] = useShareVenueMutation();
  const [disableShareVenueList, { isLoading: isDisablingVenueList }] = useDisableShareVenueMutation();
  const { data: venueShareStatus, isLoading: isVenueShareStatusLoading, refetch: refetchVenueShareStatus } = useCheckVenueShareStatusQuery(undefined);

  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [venueShareUrl, setVenueShareUrl] = useState<string | null>(null);

  const favorites = data?.results || [];
  const totalCount = data?.count || 0;

  const isCurrentlyShared = shareStatus?.share?.is_shared === true;
  const isVenueCurrentlyShared = venueShareStatus?.share?.venue_is_shared === true || venueShareStatus?.share?.is_shared === true;

  const handleShare = async () => {
    try {
      const res = await shareList({}).unwrap();
      if (res?.share?.share_token) {
        const url = `${window.location.origin}/favorites/share/${res.share.share_token}`;
        setShareUrl(url);
        toast.success("List shared successfully!");
        window.open(url, "_blank");
        refetchShareStatus();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to share list");
    }
  };

  const handleDisableShare = async () => {
    try {
      await disableShare({}).unwrap();
      setShareUrl(null);
      toast.success("Share disabled successfully!");
      refetchShareStatus();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to disable share");
    }
  };

  const handleVenueShare = async () => {
    try {
      const res = await shareVenueList(undefined).unwrap();
      const token = res?.share?.venue_share_token || res?.venue_share_token || res?.share?.share_token || res?.share_token;
      if (token) {
        const url = `${window.location.origin}/favorites/venue/share/${token}`;
        setVenueShareUrl(url);
        toast.success("Venue list shared successfully!");
        window.open(url, "_blank");
        refetchVenueShareStatus();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to share venue list");
    }
  };

  const handleVenueDisableShare = async () => {
    try {
      await disableShareVenueList(undefined).unwrap();
      setVenueShareUrl(null);
      toast.success("Venue list share disabled successfully!");
      refetchVenueShareStatus();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to disable venue share");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Your Favorites
            </h1>
            <p className="text-[#A1A1AA] text-lg max-w-2xl">
              Keep track of your favorite artists and venues all in one place.
            </p>
          </div>
          
          {activeTab === 'artists' && (
            <div className="w-full md:w-auto flex flex-col gap-3 mt-4 md:mt-0">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <button
                  onClick={handleShare}
                  disabled={isSharing || favorites.length === 0 || isShareStatusLoading || isCurrentlyShared}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 cursor-pointer px-6 py-3 md:px-5 md:py-2.5 rounded-full bg-[#00A5E5] text-white text-sm font-medium transition-colors shadow-lg shadow-[#7C5CFF]/20 hover:bg-[#0090C8] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Share2 className="w-4 h-4" />
                  {isCurrentlyShared ? 'List Shared' : 'Share List'}
                </button>
                <button
                  onClick={handleDisableShare}
                  disabled={isDisabling || isShareStatusLoading || !isCurrentlyShared}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 cursor-pointer px-6 py-3 md:px-5 md:py-2.5 rounded-full border border-white/10 text-white text-sm font-medium transition-colors hover:bg-white/5 hover:text-red-400 hover:border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-4 h-4" />
                  Disable Share
                </button>
              </div>
            </div>
          )}

          {activeTab === 'venues' && (
            <div className="w-full md:w-auto flex flex-col gap-3 mt-4 md:mt-0">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <button
                  onClick={handleVenueShare}
                  disabled={isSharingVenueList || (venuesData?.results?.length === 0) || isVenueShareStatusLoading || isVenueCurrentlyShared}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 cursor-pointer px-6 py-3 md:px-5 md:py-2.5 rounded-full bg-[#00A5E5] text-white text-sm font-medium transition-colors shadow-lg shadow-[#7C5CFF]/20 hover:bg-[#0090C8] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Share2 className="w-4 h-4" />
                  {isVenueCurrentlyShared ? 'List Shared' : 'Share List'}
                </button>
                <button
                  onClick={handleVenueDisableShare}
                  disabled={isDisablingVenueList || isVenueShareStatusLoading || !isVenueCurrentlyShared}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 cursor-pointer px-6 py-3 md:px-5 md:py-2.5 rounded-full border border-white/10 text-white text-sm font-medium transition-colors hover:bg-white/5 hover:text-red-400 hover:border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-4 h-4" />
                  Disable Share
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-white/5 mb-8 gap-6">
          <button
            onClick={() => setActiveTab('artists')}
            className={`pb-4 text-sm font-semibold tracking-wide transition-colors relative cursor-pointer ${
              activeTab === 'artists' ? 'text-[#00A5E5]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Artists ({totalCount})
            {activeTab === 'artists' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00A5E5]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('venues')}
            className={`pb-4 text-sm font-semibold tracking-wide transition-colors relative cursor-pointer ${
              activeTab === 'venues' ? 'text-[#00A5E5]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Venues ({venuesData?.count || 0})
            {activeTab === 'venues' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00A5E5]"
              />
            )}
          </button>
        </div>

        {/* Render Tab Contents */}
        <div className="w-full">
          {activeTab === 'artists' ? (
            <ArtistList
              artists={favorites}
              isLoading={isLoading}
              refetch={refetch}
              totalCount={totalCount}
              limit={limit}
              offset={offset}
              onPageChange={setOffset}
            />
          ) : (
            <FavoriteVenueList
              venues={venuesData?.results || []}
              isLoading={isVenuesLoading}
              refetch={refetchVenues}
              totalCount={venuesData?.count || 0}
              limit={limit}
              offset={venueOffset}
              onPageChange={setVenueOffset}
            />
          )}
        </div>
      </div>
    </div>
  );
}
