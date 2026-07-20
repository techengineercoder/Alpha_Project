"use client";

import React, { useState } from "react";
import { ChevronDown, ArrowRight, Check } from "lucide-react";
import { useGetTeamRolesQuery } from "@/redux/feature/team-managementSlice";

interface TeamRole {
  role: string;
  label: string;
  rank?: number;
}

interface StepTwoProps {
  side: "Artist Side" | "Venue Side";
  role: string;
  setRole: (role: string) => void;
  teamName: string;
  setTeamName: (name: string) => void;
  onContinue: () => void;
}

export function StepTwo({ side, role, setRole, teamName, setTeamName, onContinue }: StepTwoProps) {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const { data: roles } = useGetTeamRolesQuery(undefined);
  console.log(roles, '====================')

  const activeRoles: TeamRole[] = (roles?.domains?.[side === "Artist Side" ? "artist" : "venue"] as TeamRole[]) || [];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#00A5E5]/10 text-[#00A5E5] border border-[#00A5E5]/20 select-none">
          {side}
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl md:text-[32px] font-bold text-white tracking-tight leading-tight">
            What's your role?
          </h2>
          <p className="text-sm text-gray-400 font-medium">
            Choose the role that best describes what you do.
          </p>
        </div>
      </div>

      {/* Inputs Section */}
      <div className="space-y-6 w-full max-w-[620.23px] mx-auto">

        {/* Select Role Input */}
        <div className="space-y-2 relative mb-6">
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider select-none">
            Choose your Role
          </label>
          <button
            type="button"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="w-full h-[52px] bg-white/5 border-[1.24px] border-white/12 rounded-[14.83px] px-4 flex items-center justify-between text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00A5E5]/30 transition-all cursor-pointer text-left"
          >
            <span className={role ? "text-white font-medium" : "text-gray-500 font-normal"}>
              {activeRoles.find((r) => r.role === role)?.label || "Select your role..."}
            </span>
            <ChevronDown size={16} className={`text-gray-500 transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Floating Dropdown options */}
          {isRoleDropdownOpen && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-[#09090b] border border-white/10 rounded-[14.83px] shadow-2xl overflow-y-auto max-h-[300px] z-50 py-2 select-none [&::-webkit-scrollbar]:hidden animate-in fade-in slide-in-from-top-1.5 duration-200">
              {activeRoles.map((item) => {
                const isSelected = role === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => {
                      setRole(item.role);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full px-5 py-3.5 flex items-center justify-between text-left text-sm transition-colors hover:bg-white/[0.04] cursor-pointer
                      ${isSelected ? "text-[#00A5E5] font-semibold" : "text-gray-300 hover:text-white"}`}
                  >
                    <span>{item.label}</span>
                    {isSelected && <Check size={16} className="text-[#00A5E5]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Team Name Input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider select-none">
            Team Name
          </label>
          <input
            type="text"
            placeholder="e.g. XYZ Team, Apex Agency, Live Nation..."
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full h-[52px] bg-white/5 border-[1.24px] border-white/12 rounded-[14.83px] px-4 focus:outline-none focus:border-[#00A5E5]/30 text-sm text-white placeholder-gray-500 transition-all font-medium"
          />
        </div>

      </div>

      <div className="pt-6 border-t border-white/5">
        <button
          disabled={!role || !teamName.trim()}
          onClick={onContinue}
          className={`w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer
            ${role && teamName.trim()
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
