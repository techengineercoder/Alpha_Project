"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(500px_circle_at_center,_rgba(0,165,229,0.08),_transparent)] pointer-events-none" />

      {/* Glass container */}
      <div 
        className="max-w-md w-full text-center border-[1.24px] border-white/[0.05] rounded-[32px] p-8 md:p-10 shadow-2xl relative z-10 flex flex-col items-center space-y-6"
        style={{
          background: "rgba(255, 255, 255, 0.03)"
        }}
      >
        {/* Animated Compass Icon */}
        <div className="w-20 h-20 rounded-full bg-[#00A5E5]/10 border border-[#00A5E5]/20 flex items-center justify-center text-[#00A5E5] animate-pulse">
          <Compass className="w-10 h-10 stroke-[1.5]" />
        </div>

        {/* Big 404 Text */}
        <div className="space-y-2">
          <h1 className="text-[80px] font-extrabold tracking-tighter text-white leading-none font-sans">
            404
          </h1>
          <h2 className="text-xl font-bold text-zinc-200 tracking-tight">
            Lost in the Sound
          </h2>
        </div>

        {/* Description */}
        <p className="text-zinc-500 text-sm font-medium leading-relaxed font-sans">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
          <button
            onClick={() => router.back()}
            className="w-full sm:flex-1 py-3 px-5 rounded-full border border-white/10 hover:border-white/20 bg-white/[0.04] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
            <span>Go Back</span>
          </button>
          
          <Link href="/dashboard" className="w-full sm:flex-1">
            <button className="w-full py-3 px-5 rounded-full bg-[#00A5E5] hover:bg-[#00A5E5]/90 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(0,165,229,0.15)]">
              <span>Dashboard</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
