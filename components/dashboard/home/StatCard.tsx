"use client";

import React from "react";
import { DollarSign, Calendar, FileText, Star } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  DollarSign,
  Calendar,
  FileText,
  Star
};

const RGBA_MAP: Record<string, string> = {
  DollarSign: "rgba(0, 165, 229, 0.12)",
  Calendar: "rgba(16, 185, 129, 0.12)",
  FileText: "rgba(245, 158, 11, 0.12)",
  Star: "rgba(124, 92, 255, 0.12)"
};

const ICON_CONTAINER_MAP: Record<string, string> = {
  DollarSign: "bg-[#00A5E5]/8 border-[#00A5E5]/20 text-[#00A5E5]",
  Calendar: "bg-[#10B981]/8 border-[#10B981]/20 text-[#10B981]",
  FileText: "bg-[#F59E0B]/8 border-[#F59E0B]/20 text-[#F59E0B]",
  Star: "bg-[#7C5CFF]/8 border-[#7C5CFF]/20 text-[#7C5CFF]"
};

export interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  color: string;
  iconBg: string;
  iconName: string;
}

export function StatCard({ label, value, change, trend, iconName }: StatCardProps) {
  const IconComponent = ICON_MAP[iconName] || DollarSign;
  const glowRgba = RGBA_MAP[iconName] || RGBA_MAP.DollarSign;
  const iconContainerClass = ICON_CONTAINER_MAP[iconName] || ICON_CONTAINER_MAP.DollarSign;
  const isUp = trend === "up";

  // Parse percentage and label
  const changeParts = change.split(" ");
  const percentage = changeParts[0];
  const durationLabel = changeParts.slice(1).join(" ");

  return (
    <div 
      className="border-[1.24px] border-white/[0.05] hover:border-white/10 rounded-[24.71px] p-[24.71px] hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between h-[160px] relative overflow-hidden shadow-2xl group"
      style={{
        background: `radial-gradient(130px circle at 85% 25%, ${glowRgba}, transparent), rgba(255, 255, 255, 0.04)`
      }}
    >
      {/* Top Header Row inside Card */}
      <div className="flex items-center justify-between w-full relative z-10">
        <span className="text-[11px] font-bold text-zinc-500 tracking-[0.05em] uppercase font-sans">
          {label}
        </span>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${iconContainerClass} group-hover:scale-105 duration-300`}>
          <IconComponent className="w-4 h-4" />
        </div>
      </div>
      
      {/* Value & Change indicators */}
      <div className="mt-auto relative z-10">
        <div className="text-[36px] font-bold text-white tracking-tight leading-none mb-3 font-sans">
          {value}
        </div>
        <div className="flex items-center gap-1.5 text-[12px] font-semibold">
          {isUp ? (
            <>
              <span className="text-[#10B981] font-bold flex items-center gap-0.5">
                <span className="text-[11px] font-bold">↗</span> {percentage}
              </span>
              <span className="text-zinc-500 font-medium font-sans">{durationLabel}</span>
            </>
          ) : (
            <>
              <span className="text-[#EF4444] font-bold flex items-center gap-0.5">
                <span className="text-[11px] font-bold">↘</span> {percentage}
              </span>
              <span className="text-zinc-500 font-medium font-sans">{durationLabel}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
