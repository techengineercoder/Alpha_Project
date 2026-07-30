"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface TeamCard {
  id: string;
  name: string;
  avatarChar: string;
  avatarBg: string;
  description: string;
}

interface ShareWithTeamProps {
  teams: TeamCard[];
  handleRemoveTeam: (id: string, name: string) => void;
  teamSearch: string;
  setTeamSearch: (val: string) => void;
  shareTeamContainerClassName: string;
}

export const ShareWithTeam: React.FC<ShareWithTeamProps> = ({
  teams,
  handleRemoveTeam,
  teamSearch,
  setTeamSearch,
  shareTeamContainerClassName
}) => {
  return (
    <div className={`${shareTeamContainerClassName} space-y-6`}>
      <h3 className="text-sm font-bold text-white tracking-widest uppercase font-sans">
        Share With Team
      </h3>

      {/* Search Input bar */}
      <div className="relative font-sans w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-550" />
        <input
          type="text"
          placeholder="Search team..."
          value={teamSearch}
          onChange={(e) => setTeamSearch(e.target.value)}
          style={{
            backgroundColor: "#18181F",
            borderWidth: "1px",
            borderColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            height: "50px"
          }}
          className="w-full pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
        />
      </div>

      {/* Team Cards wrapper */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
        {teams.map((t) => (
          <div
            key={t.id}
            className="relative flex flex-col justify-between bg-white/[0.04] border border-white/10 rounded-[20px] p-4.5 w-full max-w-none sm:max-w-[312px] min-h-[130px]"
          >
            <button
              type="button"
              onClick={() => handleRemoveTeam(t.id, t.name)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            
            <div className="flex items-center gap-3.5">
              <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center font-bold text-white text-base shrink-0 ${t.avatarBg}`}>
                {t.avatarChar}
              </div>
              <div className="space-y-1">
                <span className="font-bold text-white text-base block">{t.name}</span>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-transparent border border-[#00A5E5]/40 text-[#00A5E5]">
                  Team
                </span>
              </div>
            </div>

            <div className="pt-4 text-zinc-450 text-xs font-semibold">
              {t.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
