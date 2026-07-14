"use client";

import React, { useRef, useEffect } from "react";
import { ChevronDown, Search, Check, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Team {
  id: string;
  name: string;
  type: "Personal" | "Team";
  avatarBg: string;
  avatarChar: string;
}

interface TeamSwitcherProps {
  activeTeam: Team;
  teams: Team[];
  isTeamDropdownOpen: boolean;
  setIsTeamDropdownOpen: (open: boolean) => void;
  teamSearchQuery: string;
  setTeamSearchQuery: (query: string) => void;
  selectedTeamId: string;
  setSelectedTeamId: (id: string) => void;
  onCreateTeamClick: () => void;
}

export function TeamSwitcher({
  activeTeam,
  teams,
  isTeamDropdownOpen,
  setIsTeamDropdownOpen,
  teamSearchQuery,
  setTeamSearchQuery,
  selectedTeamId,
  setSelectedTeamId,
  onCreateTeamClick,
}: TeamSwitcherProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsTeamDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsTeamDropdownOpen]);

  // Filter Switcher Teams
  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(teamSearchQuery.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
        className="flex items-center gap-3 bg-[#0E0E10] border border-white/5 rounded-[18px] p-1.5 pr-4 hover:border-white/10 hover:bg-[#131317] transition-all cursor-pointer select-none group h-12"
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm shrink-0 border border-white/10 ${activeTeam.avatarBg}`}>
          {activeTeam.avatarChar}
        </div>
        <span className="font-semibold text-white tracking-[0px] text-[17.3px] leading-[24.71px] truncate max-w-[80px] xs:max-w-[120px] sm:max-w-none">
          {activeTeam.name}
        </span>
        <span className="px-2.5 py-0.5 rounded-lg bg-white/5 text-gray-400 text-xs font-semibold border border-white/5">
          {activeTeam.type}
        </span>
        <ChevronDown size={14} className={`text-gray-500 group-hover:text-white transition-transform ${isTeamDropdownOpen ? "rotate-180" : ""}`} />
      </div>

      <AnimatePresence>
        {isTeamDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-2.5 w-[calc(100vw-32px)] sm:w-80 bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl p-5 space-y-5.5 z-30"
          >
            {/* Search team input */}
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" />
              <input
                type="text"
                placeholder="Search team..."
                value={teamSearchQuery}
                onChange={(e) => setTeamSearchQuery(e.target.value)}
                className="w-full bg-[#131316] border border-white/5 focus:border-[#00A5E5]/20 focus:bg-[#15151B] transition-all rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-[#71717A] focus:outline-none h-12"
              />
            </div>

            {/* Your Teams list */}
            <div className="space-y-1.5">
              <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest pl-1 mb-2 select-none">
                Your Teams
              </p>
              <div className="max-h-60 overflow-y-auto no-scrollbar space-y-1">
                {filteredTeams.map((t) => {
                  const isSelected = t.id === selectedTeamId;
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTeamId(t.id);
                        setIsTeamDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between p-2 rounded-2xl cursor-pointer hover:bg-white/[0.03] transition-all
                        ${isSelected ? "bg-white/[0.01]" : ""}
                      `}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-base border border-white/5 shrink-0 ${t.avatarBg}`}>
                          {t.avatarChar}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-white truncate leading-tight">{t.name}</span>
                          <span className="text-xs text-gray-500 font-medium mt-0.5">{t.type}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <Check size={16} className="text-[#00A5E5] mr-1 shrink-0" strokeWidth={2.5} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Create Team Trigger */}
            <button
              onClick={onCreateTeamClick}
              className="w-full h-12 rounded-2xl border border-dashed border-[#00A5E5]/30 hover:border-[#00A5E5]/50 text-[#00A5E5] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#00A5E5]/5 transition-all cursor-pointer select-none"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Create Team</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
