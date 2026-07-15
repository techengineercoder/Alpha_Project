"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, Plus, X, User, Music, ArrowRight } from "lucide-react";

interface SearchResultItem {
  id: string;
  title: string;
  type: string;
  subtitle: string;
  image?: string;
  initials?: string;
  bg?: string;
}

const SEARCH_DATABASE: SearchResultItem[] = [
  { id: "1", title: "Drake", type: "Artist", subtitle: "Dark Folk • $35K-$55K", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { id: "2", title: "Taylor Swift", type: "Artist", subtitle: "Synth-pop • $50K-$80K", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
  { id: "3", title: "Rihanna", type: "Artist", subtitle: "Art Pop • Touring", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80" },
  { id: "4", title: "Bruno Mars", type: "Artist", subtitle: "Indie Rock • $30K-$45K", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { id: "5", title: "The Midnight", type: "Offer", subtitle: "Brooklyn Steel • Negotiation", initials: "TM", bg: "bg-[#00A5E5]/20 text-[#00A5E5]" },
  { id: "6", title: "Jungle", type: "Offer", subtitle: "The Wiltern • Offer Sent", initials: "JG", bg: "bg-[#10B981]/20 text-[#10B981]" },
  { id: "7", title: "Chappell Roan", type: "Offer", subtitle: "Stubb's • Confirmed", initials: "CR", bg: "bg-[#F59E0B]/20 text-[#F59E0B]" }
];

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter items based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setResults([]);
      return;
    }
    const filtered = SEARCH_DATABASE.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setResults(filtered);
  }, [searchQuery]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 relative z-50">
      <div>
        <h1 className="text-2xl md:text-[28px] font-bold text-white tracking-tight">Talent Buyer Dashboard</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Marcus Reid - Live Nation West</p>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto relative" ref={dropdownRef}>
        {/* Search Input Container */}
        <div className="relative flex-1 md:flex-initial md:w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search anything..."
            className="w-full bg-[#121218] border border-white/5 focus:border-[#00A5E5]/30 focus:outline-none rounded-full py-2.5 pl-11 pr-12 text-sm text-white placeholder-gray-500 transition-colors"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-gray-400">
              <span>⌘</span>K
            </kbd>
          )}

          {/* Autocomplete Search Dropdown */}
          {isFocused && searchQuery && (
            <div className="absolute top-full left-0 md:right-0 md:left-auto mt-2 w-full md:w-[360px] bg-[#0E0E12] border border-white/10 rounded-[20px] shadow-2xl p-4 space-y-3 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider px-1">
                <span>Search Results ({results.length})</span>
                <span className="text-[10px] text-gray-600 font-semibold">Press Enter ↵</span>
              </div>

              <div className="max-h-[280px] overflow-y-auto space-y-1.5 [&::-webkit-scrollbar]:hidden">
                {results.length > 0 ? (
                  results.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        {/* Image / Icon container */}
                        {item.image ? (
                          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-zinc-800">
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : item.initials ? (
                          <div className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${item.bg}`}>
                            {item.initials}
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                        )}

                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold text-white group-hover:text-[#00A5E5] transition-colors">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-gray-500 font-medium">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>

                      {/* Type Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${item.type === "Artist"
                        ? "bg-[#00A5E5]/10 text-[#00A5E5] border-[#00A5E5]/20"
                        : "bg-[#7C5CFF]/10 text-[#7C5CFF] border-[#7C5CFF]/20"
                        }`}>
                        {item.type}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500 text-sm font-medium">
                    No results match &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>

              {results.length > 0 && (
                <div className="pt-2 border-t border-white/5 flex items-center justify-center text-center">
                  <button className="text-[11px] font-bold text-[#00A5E5] hover:text-[#00A5E5]/80 hover:underline flex items-center gap-1.5 transition-colors cursor-pointer">
                    <span>See all matches</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="w-10 h-10 rounded-full bg-[#121218] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors relative cursor-pointer shrink-0">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 border border-black flex items-center justify-center text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* Action Button */}
        <button className="px-5 py-2.5 rounded-full bg-[#00A5E5] hover:bg-[#00A5E5]/90 text-white text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(0,165,229,0.25)] shrink-0">
          <Plus className="w-4 h-4" />
          <span>New Offer</span>
        </button>
      </div>
    </header>
  );
}
