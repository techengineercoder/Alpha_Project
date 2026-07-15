"use client";

import React from "react";
import Link from "next/link";
import { Search, FileText, ChevronRight } from "lucide-react";

export interface ArtistItem {
  id: string;
  name: string;
  genre: string;
  priceRange: string;
  status: "Available" | "Touring";
  image: string;
}

interface RecommendedArtistsProps {
  artists: ArtistItem[];
}

const PRICE_COLOR_MAP: Record<number, string> = {
  0: "text-[#7C5CFF]",
  1: "text-[#10B981]",
  2: "text-[#F59E0B]",
  3: "text-[#EC4899]"
};

export function RecommendedArtists({ artists }: RecommendedArtistsProps) {
  return (
    <div 
      className="border-[1.24px] border-white/[0.05] hover:border-white/10 rounded-[24.71px] p-[24.71px] transition-all flex flex-col justify-between h-auto lg:h-[500px] shadow-lg"
      style={{
        background: "rgba(255, 255, 255, 0.04)"
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-lg font-bold text-white tracking-tight">Recommended Artists</h2>
        <Link href="/search" className="text-xs font-semibold text-[#00A5E5] hover:underline flex items-center gap-1">
          <span>Browse all</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Artists Cards Grid */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {artists.slice(0, 4).map((artist, idx) => (
          <div
            key={artist.id}
            className="group rounded-[19.77px] border-[1.24px] border-white/[0.04] hover:border-white/10 hover:scale-[1.02] p-[14.83px] transition-all flex flex-col justify-between h-[337.92px] shadow-inner"
            style={{
              background: "rgba(255, 255, 255, 0.03)"
            }}
          >
            {/* Rounded Cover Image */}
            <div className="relative w-full h-[150px] shrink-0 bg-zinc-900 rounded-[12px] overflow-hidden">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
              />
            </div>
            
            {/* Details */}
            <div className="pt-3 flex-1 flex flex-col justify-between">
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-white tracking-tight leading-tight group-hover:text-[#00A5E5] transition-colors">
                  {artist.name}
                </span>
                <span className="text-[11px] text-zinc-500 font-semibold mt-0.5">{artist.genre}</span>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <span className={`text-[13px] font-extrabold ${PRICE_COLOR_MAP[idx] || "text-[#00A5E5]"}`}>
                  {artist.priceRange}
                </span>
                
                {artist.status === "Available" ? (
                  <span className="text-[10px] font-bold w-fit px-2.5 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981]">
                    Available
                  </span>
                ) : (
                  <span className="text-[10px] font-bold w-fit px-2.5 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400">
                    Touring
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended panel actions */}
      <div className="flex items-center gap-4 shrink-0">
        <Link href="/search" className="flex-1">
          <button className="w-full py-3 h-12 rounded-2xl bg-[#00A5E5] hover:bg-[#00A5E5]/90 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(0,165,229,0.15)]">
            <Search className="w-4 h-4" />
            <span>Search Artists</span>
          </button>
        </Link>
        <button className="flex-1 py-3 h-12 rounded-2xl border border-white/10 hover:border-white/20 bg-white/[0.04] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-white/10">
          <FileText className="w-4 h-4 text-zinc-400" />
          <span>New Offer</span>
        </button>
      </div>
    </div>
  );
}
