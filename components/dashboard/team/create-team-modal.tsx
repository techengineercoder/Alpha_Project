"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Check } from "lucide-react";
import { useGetTeamRolesQuery } from "@/redux/feature/team-managementSlice";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (name: string, domain: "artist" | "venue", role: string) => void;
}

interface TeamRole {
  role: string;
  label: string;
  rank?: number;
}

export function CreateTeamModal({
  isOpen,
  onClose,
  onCreateTeam,
}: CreateTeamModalProps) {
  const [newTeamName, setNewTeamName] = useState("");
  const [domain, setDomain] = useState<"artist" | "venue">("artist");
  const [selectedRole, setSelectedRole] = useState("");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const { data: roles } = useGetTeamRolesQuery(undefined);

  // Active roles based on selected domain
  const activeRoles: TeamRole[] = (roles?.domains?.[domain] as TeamRole[]) || [];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !selectedRole) return;
    onCreateTeam(newTeamName.trim(), domain, selectedRole);
    setNewTeamName("");
    setSelectedRole("");
    setIsRoleDropdownOpen(false);
  };

  const handleClose = () => {
    setNewTeamName("");
    setSelectedRole("");
    setIsRoleDropdownOpen(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black backdrop-blur-sm"
          />
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-[#09090b] border border-white/10 rounded-[28px] shadow-2xl p-8 z-10 space-y-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-xl text-white leading-tight">New Team</h3>
                <p className="text-sm text-gray-500 font-normal mt-1">
                  Teams have their own members, roles, and permissions.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Team Name */}
              <div className="space-y-2">
                <label className="text-[16.06px] leading-[24.09px] font-semibold text-white tracking-[0px] mb-2.5 block select-none">
                  Team Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Agency, Bluewave Booking..."
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full bg-[#131316] border border-white/10 focus:border-[#00A5E5]/30 transition-all rounded-2xl py-3.5 px-4 text-sm text-white placeholder-[#71717A] focus:outline-none"
                />
              </div>

              {/* Team Domain Switcher Tab */}
              <div className="space-y-2">
                <label className="text-[16.06px] leading-[24.09px] font-semibold text-white tracking-[0px] mb-2.5 block select-none">
                  Select Team Domain
                </label>
                <div className="flex gap-2 p-1 bg-[#131316] border border-white/10 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setDomain("artist");
                      setSelectedRole("");
                    }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer select-none ${
                      domain === "artist"
                        ? "bg-[#00A5E5] text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Artist Side
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDomain("venue");
                      setSelectedRole("");
                    }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer select-none ${
                      domain === "venue"
                        ? "bg-[#00A5E5] text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Venue Side
                  </button>
                </div>
              </div>

              {/* Choose your Role Select Dropdown */}
              <div className="space-y-2 relative">
                <label className="text-[16.06px] leading-[24.09px] font-semibold text-white tracking-[0px] mb-2.5 block select-none">
                  Choose your Role
                </label>
                <button
                  type="button"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="w-full h-[52px] bg-[#131316] border border-white/10 rounded-2xl px-4 flex items-center justify-between text-sm text-white focus:outline-none focus:border-[#00A5E5]/30 transition-all cursor-pointer text-left"
                >
                  <span className={selectedRole ? "text-white font-medium" : "text-gray-500 font-normal"}>
                    {activeRoles.find((r) => r.role === selectedRole)?.label || "Select your role..."}
                  </span>
                  <ChevronDown size={16} className={`text-gray-500 transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-y-auto max-h-[160px] z-50 py-2 select-none [&::-webkit-scrollbar]:hidden animate-in fade-in duration-150">
                    {activeRoles.map((item) => {
                      const isSelected = selectedRole === item.role;
                      return (
                        <button
                          key={item.role}
                          type="button"
                          onClick={() => {
                            setSelectedRole(item.role);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full px-5 py-3 flex items-center justify-between text-left text-sm transition-colors hover:bg-white/[0.04] cursor-pointer
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

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTeamName.trim() || !selectedRole}
                  className="bg-[#00A5E5] hover:bg-[#00A5E5]/90 disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-full px-6 py-2.5 text-sm shadow-[0_4px_16px_rgba(0,165,229,0.15)] transition-all cursor-pointer"
                >
                  Create Team
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
