"use client";

import React from "react";
import { Search } from "lucide-react";

interface ShareWithUsersProps {
  allUsers: any[];
  selectedUserIds: number[];
  toggleUserSelection: (id: number) => void;
  userSearch: string;
  setUserSearch: (val: string) => void;
  shareTeamContainerClassName: string;
  isLoading?: boolean;
}

export const ShareWithUsers: React.FC<ShareWithUsersProps> = ({
  allUsers,
  selectedUserIds,
  toggleUserSelection,
  userSearch,
  setUserSearch,
  shareTeamContainerClassName,
  isLoading
}) => {
  return (
    <div className={`${shareTeamContainerClassName} space-y-6`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-widest uppercase font-sans">
          Share With Users
        </h3>
        {selectedUserIds.length > 0 && (
          <span className="text-xs text-[#00A5E5] font-bold">
            {selectedUserIds.length} Selected
          </span>
        )}
      </div>

      {/* Search Input bar */}
      <div className="relative font-sans w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-550" />
        <input
          type="text"
          placeholder="Search users by email..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
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

      {/* User Cards wrapper */}
      {isLoading ? (
        <div className="text-zinc-500 text-xs py-4">Loading users...</div>
      ) : allUsers.length === 0 ? (
        <div className="text-zinc-500 text-xs py-4 italic">No users found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
          {allUsers.map((u) => {
            const isSelected = selectedUserIds.includes(u.id);
            const firstLetter = u.name?.charAt(0).toUpperCase() || u.email?.charAt(0).toUpperCase() || "U";

            // Consistent dynamic bg colors
            const bgColors = [
              "bg-indigo-600",
              "bg-amber-600",
              "bg-emerald-600",
              "bg-purple-600",
              "bg-pink-600"
            ];
            const colorIndex = (u.name?.length || 0) % bgColors.length;
            const avatarBg = bgColors[colorIndex];

            return (
              <div
                key={u.id}
                onClick={() => toggleUserSelection(u.id)}
                className={`relative flex flex-col justify-between bg-white/[0.04] border rounded-[20px] p-4.5 w-full max-w-none sm:max-w-[312px] min-h-[130px] cursor-pointer transition-all ${isSelected ? "border-[#00A5E5] bg-[#00A5E5]/5 shadow-lg shadow-[#00A5E5]/5" : "border-white/10 hover:border-white/20"
                  }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 h-5 w-5 rounded-full bg-[#00A5E5] flex items-center justify-center text-black font-black text-xs">
                    ✓
                  </div>
                )}

                <div className="flex items-center gap-3.5">
                  <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center font-bold text-white text-base shrink-0 ${avatarBg}`}>
                    {firstLetter}
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-white text-base block truncate max-w-[150px]">{u.name || "User"}</span>
                    <span className="text-[10px] text-zinc-450 block truncate max-w-[170px]">
                      {u.email}
                    </span>
                  </div>
                </div>

                {/* <div className="pt-4 text-[#00A5E5] text-xs font-bold uppercase tracking-wider">
                  ID: {u.id}
                </div> */}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
