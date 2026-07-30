"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, Plus, X, User, Music, ArrowRight } from "lucide-react";
import { useMyTeamQuery } from "@/redux/feature/team-managementSlice";

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
  const { data } = useMyTeamQuery(undefined);
  console.log("Team data:", data);

  const [headerInfo, setHeaderInfo] = useState({
    title: "Talent Buyer Dashboard",
    subtitle: "Marcus Reid - Live Nation West"
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const onboardingCompleted = localStorage.getItem("onboarding_completed");
      const role = localStorage.getItem("user_role");
      const team = localStorage.getItem("active_team_name") || "My Team";

      if (storedUser && onboardingCompleted === "true") {
        try {
          const u = JSON.parse(storedUser);
          const displayRole = role || "Talent Buyer";
          setHeaderInfo({
            title: `${displayRole} Dashboard`,
            subtitle: `${u.name} - ${team}`
          });
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  // Sync API team name with header subtitle dynamically
  useEffect(() => {
    if (data?.results?.[0]?.name) {
      setHeaderInfo((prev) => {
        const namePart = prev.subtitle.split(" - ")[0];
        return {
          ...prev,
          subtitle: `${namePart} - ${data.results[0].name}`
        };
      });
    }
  }, [data]);

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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full pb-2 relative z-30">
      {/* Left: Title & Subtitle */}
      <div>
        <h1 className="text-3xl sm:text-[32px] font-bold tracking-tight text-white font-sans">
          {headerInfo.title}
        </h1>
        <p className="text-sm text-zinc-400 font-sans mt-1">
          {headerInfo.subtitle}
        </p>
      </div>

      {/* Right: Search, Bell, and CTA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto" ref={dropdownRef}>
        
        {/* Search & Bell mobile row */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search anything..."
              className="w-full h-10 pl-10 pr-10 rounded-full bg-[#121214] border border-zinc-800 text-sm text-white placeholder-zinc-550 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Autocomplete Search Dropdown */}
            {isFocused && searchQuery && (
              <div className="absolute top-full right-0 mt-2 w-full sm:w-[360px] bg-[#0E0E12] border border-white/10 rounded-[20px] shadow-2xl p-4 space-y-3 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
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
                            <span className="text-sm font-bold text-white group-hover:text-[#00AEF0] transition-colors">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-gray-500 font-medium">
                              {item.subtitle}
                            </span>
                          </div>
                        </div>

                        {/* Type Badge */}
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${item.type === "Artist"
                          ? "bg-[#00AEF0]/10 text-[#00AEF0] border-[#00AEF0]/20"
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
                    <button className="text-[11px] font-bold text-[#00AEF0] hover:text-[#00AEF0]/80 hover:underline flex items-center gap-1.5 transition-colors cursor-pointer">
                      <span>See all matches</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bell Button (hidden on mobile) */}
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("open-notifications"))}
            className="hidden sm:flex w-10 h-10 rounded-full border border-zinc-800 bg-[#121214] items-center justify-center relative hover:bg-zinc-800/60 hover:border-zinc-700 transition-all cursor-pointer group shrink-0"
            title="Notifications"
          >
            <Bell className="h-[18px] w-[18px] text-zinc-300 group-hover:text-white transition-colors" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ef4444] rounded-full ring-2 ring-[#121214]" />
          </button>
        </div>

        {/* CTA New Offer Button */}
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent("create-offer"))}
          className="h-11 px-5 rounded-[12px] bg-[#00AEF0] hover:bg-[#009bde] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-cyan-500/10 hover:scale-[1.01] active:scale-[0.99] w-full sm:w-auto shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          New Offer
        </button>
      </div>
    </div>
  );
}
