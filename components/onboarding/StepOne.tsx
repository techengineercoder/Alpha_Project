"use client";

import React from "react";
import { Mic, Building, ArrowRight } from "lucide-react";

interface StepOneProps {
  side: "Artist Side" | "Venue Side" | null;
  setSide: (side: "Artist Side" | "Venue Side") => void;
  onContinue: () => void;
}

export function StepOne({ side, setSide, onContinue }: StepOneProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase">Welcome to GetAvails</p>
        <h2 className="text-2xl md:text-[32px] font-bold text-white tracking-tight leading-tight">
          Which side are you on?
        </h2>
        <p className="text-sm text-gray-400 font-medium max-w-md mx-auto">
          This helps us personalize your experience and show you the right tools.
        </p>
      </div>

      {/* Two Option Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Artist Side Card */}
        <div
          onClick={() => setSide("Artist Side")}
          className={`border-[1.24px] rounded-[19.77px] p-6 flex flex-col gap-6 cursor-pointer transition-all duration-300 relative group
            ${side === "Artist Side"
              ? "bg-[#00A5E5]/[0.03] border-[#00A5E5] shadow-[0_0_20px_rgba(0,165,229,0.08)]"
              : "bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.05]"
            }`}
        >
          <div className="flex justify-center">
            <div className="w-[69.19px] h-[69.19px] rounded-[19.77px] bg-[#00A5E5]/[0.12] flex items-center justify-center text-[#00A5E5] group-hover:scale-105 transition-transform duration-300">
              <Mic size={24} strokeWidth={2.2} />
            </div>
          </div>

          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">Artist Side</h3>
            <p className="text-xs text-gray-400 font-normal leading-relaxed text-center px-2">
              You're a musician, performer, band, or part of an artist's team. You receive booking offers, manage availability, and handle contracts.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/5 w-full max-w-[280px] mx-auto">
            {[
              "Receive & manage booking offers",
              "Set your availability calendar",
              "Sign contracts & track payments",
              "Manage your artist profile & rider",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs text-gray-400 font-medium">
                <span className="text-[#00A5E5] text-base leading-none select-none">♪</span>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Venue Side Card */}
        <div
          onClick={() => setSide("Venue Side")}
          className={`border-[1.24px] rounded-[19.77px] p-6 flex flex-col gap-6 cursor-pointer transition-all duration-300 relative group
            ${side === "Venue Side"
              ? "bg-[#00A5E5]/[0.03] border-[#00A5E5] shadow-[0_0_20px_rgba(0,165,229,0.08)]"
              : "bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.05]"
            }`}
        >
          <div className="flex justify-center">
            <div className="w-[69.19px] h-[69.19px] rounded-[19.77px] bg-[#00A5E5]/[0.12] flex items-center justify-center text-[#00A5E5] group-hover:scale-105 transition-transform duration-300">
              <Building size={24} strokeWidth={2.2} />
            </div>
          </div>

          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">Venue Side</h3>
            <p className="text-xs text-gray-400 font-normal leading-relaxed text-center px-2">
              You're a venue, promoter, festival, talent buyer, or booking agent. You discover artists, send offers, and organize events.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/5 w-full max-w-[280px] mx-auto">
            {[
              "Discover & book artists",
              "Send offers & negotiate deals",
              "Manage your event calendar",
              "Track budgets & settlements",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs text-gray-400 font-medium">
                <span className="text-[#00A5E5] text-base leading-none select-none">♪</span>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="pt-6 border-t border-white/5">
        <button
          disabled={!side}
          onClick={onContinue}
          className={`w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer
            ${side
              ? "bg-[#00A5E5] hover:bg-[#00A5E5]/90 text-white shadow-[0_4px_16px_rgba(0,165,229,0.2)] active:scale-[0.98]"
              : "bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed"
            }`}
        >
          <span>Continue</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
