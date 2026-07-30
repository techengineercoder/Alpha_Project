"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Calendar, Clock, ChevronRight } from "lucide-react";

export interface PipelineOffer {
  id: string;
  artist: string;
  venue: string;
  city: string;
  date: string;
  amount: string;
  stage: "Inquiry" | "Offer Sent" | "Negotiation" | "Contract" | "Signed" | "Confirmed";
  time: string;
  initials: string;
  initialsBg: string;
}

interface OfferPipelineProps {
  offers: PipelineOffer[];
  counts: Record<string, number>;
}

const STAGE_THEME: Record<string, { numColor: string; border: string; badge: string; dot: string }> = {
  Inquiry: {
    numColor: "text-zinc-400",
    border: "border-zinc-800",
    badge: "bg-zinc-800/20 text-zinc-400 border-zinc-700/25",
    dot: "bg-zinc-500"
  },
  "Offer Sent": {
    numColor: "text-[#00A5E5]",
    border: "border-[#00A5E5]/20",
    badge: "bg-[#00A5E5]/10 text-[#00A5E5] border-[#00A5E5]/20",
    dot: "bg-[#00A5E5]"
  },
  Negotiation: {
    numColor: "text-[#F59E0B]",
    border: "border-[#F59E0B]/20",
    badge: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
    dot: "bg-[#F59E0B]"
  },
  Contract: {
    numColor: "text-[#7C5CFF]",
    border: "border-[#7C5CFF]/20",
    badge: "bg-[#7C5CFF]/10 text-[#7C5CFF] border-[#7C5CFF]/20",
    dot: "bg-[#7C5CFF]"
  },
  Signed: {
    numColor: "text-[#3B82F6]",
    border: "border-[#3B82F6]/20",
    badge: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20",
    dot: "bg-[#3B82F6]"
  },
  Confirmed: {
    numColor: "text-[#10B981]",
    border: "border-[#10B981]/20",
    badge: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
    dot: "bg-[#10B981]"
  }
};

export function OfferPipeline({ offers, counts }: OfferPipelineProps) {
  const [activeStage, setActiveStage] = useState<string>("All");

  const filteredOffers = offers.filter(
    (off) => activeStage === "All" || off.stage === activeStage
  );

  return (
    <div
      className="border-[1.24px] border-white/[0.05] hover:border-white/10 rounded-[24.71px] p-4 sm:p-[24.71px] transition-all flex flex-col justify-between shadow-lg space-y-6"
      style={{
        background: "rgba(255, 255, 255, 0.04)"
      }}
    >
      {/* Header Info */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Offer Pipeline</h2>
          <p className="text-sm text-zinc-500 font-semibold mt-1">28 active offers across all stages</p>
        </div>
        <Link href="/artist/offers" className="text-xs font-bold text-[#00A5E5] hover:underline flex items-center gap-1">
          <span>View all offers</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Stage Counter Filter row */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4.5">
        {Object.keys(STAGE_THEME).map((stage) => {
          const count = counts[stage] || 0;
          const isSelected = activeStage === stage;
          const theme = STAGE_THEME[stage];

          return (
            <button
              key={stage}
              onClick={() => setActiveStage(isSelected ? "All" : stage)}
              className={`flex flex-col items-center justify-center p-2 sm:p-3.5 rounded-[16px] border transition-all cursor-pointer bg-white/[0.02]
                ${isSelected
                  ? "bg-[#00A5E5]/10 border-[#00A5E5] text-white shadow-[0_4px_16px_rgba(0,165,229,0.15)]"
                  : `${theme.border} text-zinc-500 hover:border-white/10 hover:text-zinc-300`
                }
              `}
            >
              <span className={`text-[24px] font-extrabold tracking-tight ${isSelected ? "text-white" : theme.numColor}`}>
                {count}
              </span>
              <span className="text-[11px] font-semibold mt-1 tracking-wider font-sans">
                {stage}
              </span>
            </button>
          );
        })}
      </div>

      {/* Offers pipeline tabular list */}
      <div className="flex flex-col gap-3">
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => {
            const theme = STAGE_THEME[offer.stage] || STAGE_THEME.Inquiry;

            return (
              <div
                key={offer.id}
                className="p-4 sm:p-4.5 rounded-[16px] border border-white/[0.04] hover:border-white/10 hover:bg-black/35 transition-all group flex cursor-pointer"
              >
                {/* Mobile Specific Layout */}
                <div className="flex sm:hidden flex-col gap-3.5 w-full">
                  <div className="flex items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${offer.initialsBg}`}>
                        {offer.initials}
                      </div>
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-sm font-bold text-white group-hover:text-[#00A5E5] transition-colors truncate">
                          {offer.artist}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold mt-1 font-sans truncate">
                          <MapPin className="w-3 h-3 opacity-60 shrink-0" />
                          <span className="truncate">{offer.venue}, {offer.city}</span>
                        </div>
                      </div>
                    </div>
                    {/* Price on right */}
                    <span className="text-sm font-extrabold text-white shrink-0">
                      {offer.amount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-0.5">
                    {/* Status Badge */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${theme.badge}`}>
                      <span className={`w-1 h-1 rounded-full ${theme.dot}`} />
                      {offer.stage}
                    </span>
                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
                      <span>{offer.date.split(",")[0]}</span>
                      <span>•</span>
                      <span>{offer.time}</span>
                    </div>
                  </div>
                </div>

                {/* Desktop Specific Layout */}
                <div className="hidden sm:flex flex-row items-center justify-between w-full gap-4">
                  {/* Left Side: Avatar Initials & Artist Info */}
                  <div className="flex items-center gap-4 w-[280px] shrink-0">
                    <div className={`w-11 h-11 rounded-full border flex items-center justify-center font-bold text-sm shrink-0 ${offer.initialsBg}`}>
                      {offer.initials}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[15px] font-bold text-white group-hover:text-[#00A5E5] transition-colors">
                        {offer.artist}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold mt-1 font-sans">
                        <MapPin className="w-3.5 h-3.5 opacity-60" />
                        <span>{offer.venue}, {offer.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Date, Amount, Badge, Relative Time, Chevron */}
                  <div className="flex-1 grid grid-cols-5 gap-4 items-center justify-items-end text-right w-full">
                    {/* Column 1: Date */}
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold font-sans">
                      <Calendar className="w-3.5 h-3.5 opacity-60" />
                      <span>{offer.date}</span>
                    </div>

                    {/* Column 2: Value */}
                    <span className="text-sm font-extrabold text-white font-sans">
                      {offer.amount}
                    </span>

                    {/* Column 3: Badge */}
                    <div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${theme.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                        {offer.stage}
                      </span>
                    </div>

                    {/* Column 4: Time */}
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold font-sans">
                      <Clock className="w-3.5 h-3.5 opacity-60" />
                      <span>{offer.time}</span>
                    </div>

                    {/* Column 5: Arrow */}
                    <div>
                      <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-zinc-500 font-semibold text-sm bg-black/20 border border-white/[0.04] rounded-[16px]">
            No offers in this stage currently.
          </div>
        )}
      </div>
    </div>
  );
}
