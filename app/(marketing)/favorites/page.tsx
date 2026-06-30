"use client";

import React, { useState } from 'react';
import { useFavoritesByAllQuery } from '@/redux/feature/artistApi/bookingSlice';
import { useShareListMutation, useDisableShareListMutation, useShareStatusCheckQuery } from '@/redux/feature/artistApi/favoriteSlice';
import { ArtistList } from '@/components/search/ArtistList';
import { toast } from 'sonner';
import { Share2, XCircle, Copy, Check } from 'lucide-react';

export default function FavoritesPage() {
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const { data, isLoading, refetch } = useFavoritesByAllQuery(undefined);

  const [shareList, { isLoading: isSharing }] = useShareListMutation();
  const [disableShare, { isLoading: isDisabling }] = useDisableShareListMutation();
  const { data: shareStatus, isLoading: isShareStatusLoading } = useShareStatusCheckQuery(undefined);

  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const favorites = data?.results || [];
  const totalCount = data?.count || 0;

  const isCurrentlyShared = shareStatus?.share?.is_shared === true;
  const displayUrl = shareUrl || (shareStatus?.share?.share_token ? `${window.location.origin}/favorites/share/${shareStatus.share.share_token}` : null);

  const handleShare = async () => {
    try {
      const res = await shareList({}).unwrap();
      if (res?.share?.share_token) {
        const url = `${window.location.origin}/favorites/share/${res.share.share_token}`;
        setShareUrl(url);
        toast.success("List shared successfully!");
        window.open(url, "_blank");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to share list");
    }
  };

  const handleDisableShare = async () => {
    try {
      await disableShare({}).unwrap();
      setShareUrl(null);
      setCopied(false);
      toast.success("Share disabled successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to disable share");
    }
  };

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
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
              Keep track of your favorite artists, venues, and events all in one place.
            </p>
          </div>
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
            {/* {displayUrl && isCurrentlyShared && (
              <div className="flex items-center gap-2 mt-2 bg-white/5 border border-white/10 rounded-lg p-2 w-full animate-in fade-in slide-in-from-top-2">
                <input
                  type="text"
                  readOnly
                  value={displayUrl}
                  className="bg-transparent border-none outline-none text-[#A1A1AA] text-sm w-full px-2"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(displayUrl);
                    setCopied(true);
                    toast.success("Link copied to clipboard!");
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-2 bg-white/5 rounded-md hover:bg-white/10 transition-colors text-white shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )} */}
          </div>
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
