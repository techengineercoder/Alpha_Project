"use client";

import React from "react";
import { Search, Bell } from "lucide-react";

interface CommonHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  actionButton?: React.ReactNode;
  showSearch?: boolean;
}

export function CommonHeader({
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  actionButton,
  showSearch = true,
}: CommonHeaderProps) {
  
  const handleNotificationsClick = () => {
    window.dispatchEvent(new CustomEvent("open-notifications"));
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full pb-2">
      {/* Left: Title & Subtitle */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-[32px] font-bold tracking-tight text-white font-sans">
          {title}
        </h1>
        {subtitle && (
          <div className="text-sm text-zinc-400 font-sans">
            {subtitle}
          </div>
        )}
      </div>

      {/* Right: Search, Bell, and Action Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        
        {/* Search & Bell mobile row */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {showSearch && onSearchChange !== undefined ? (
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-full bg-[#121214] border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-colors"
              />
            </div>
          ) : (
            <div className="flex-1 sm:hidden" />
          )}

          <button 
            onClick={handleNotificationsClick}
            className="hidden sm:flex w-10 h-10 rounded-full border border-zinc-800 bg-[#121214] items-center justify-center relative hover:bg-zinc-800/60 hover:border-zinc-700 transition-all cursor-pointer group shrink-0"
            title="Notifications"
          >
            <Bell className="h-[18px] w-[18px] text-zinc-300 group-hover:text-white transition-colors" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ef4444] rounded-full ring-2 ring-[#121214]" />
          </button>
        </div>

        {/* Action Button wrapper */}
        {actionButton && (
          <div className="w-full sm:w-auto">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
}
