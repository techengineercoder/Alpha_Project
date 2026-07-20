"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Check } from "lucide-react";
import { useSendTeamMemberInvitationMutation, useGetTeamRolesQuery } from "@/redux/feature/team-managementSlice";
import { toast } from "sonner";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTeamId: string;
  selectedTeamDomain: string;
  onInviteSuccess: (email: string, role: string, link: string) => void;
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  inviteRole: string;
  setInviteRole: (role: string) => void;
  inviteError: string;
  setInviteError: (error: string) => void;
  roleDetails: Record<string, { desc: string }>;
  rolesList: string[];
}

interface TeamRole {
  role: string;
  label: string;
  rank?: number;
}

export function InviteMemberModal({
  isOpen,
  onClose,
  selectedTeamId,
  selectedTeamDomain,
  onInviteSuccess,
  inviteEmail,
  setInviteEmail,
  inviteRole,
  setInviteRole,
  inviteError,
  setInviteError,
  roleDetails,
  rolesList,
}: InviteMemberModalProps) {
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [sendTeamMemberInvitation, { isLoading: isSendingInvite }] = useSendTeamMemberInvitationMutation();
  const { data: roles } = useGetTeamRolesQuery(undefined);

  // Determine active domain based on team selection
  const activeDomain = selectedTeamDomain === "venue" || selectedTeamDomain === "Venue Side" ? "venue" : "artist";
  const activeRoles: TeamRole[] = (roles?.domains?.[activeDomain] as TeamRole[]) || [];

  // Reset to first role of active domain if selection is invalid/default
  useEffect(() => {
    if (activeRoles.length > 0) {
      const isValid = activeRoles.some((r) => r.role === inviteRole);
      if (!isValid) {
        setInviteRole(activeRoles[0].role);
      }
    }
  }, [selectedTeamDomain, roles, activeRoles, inviteRole, setInviteRole]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsRoleOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      setInviteError("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      setInviteError("Please enter a valid email address");
      return;
    }

    try {
      const result = await sendTeamMemberInvitation({
        id: selectedTeamId,
        data: {
          email: inviteEmail.trim().toLowerCase(),
          role: inviteRole, // Send direct raw role string
        }
      }).unwrap();

      const displayRoleLabel = activeRoles.find((r) => r.role === inviteRole)?.label || inviteRole;
      const token = result?.invitation?.token || result?.token || result?.invitation_token || "";
      const baseUrl = "https://getavails.com";
      const inviteLink = token
        ? `${baseUrl}/teams-invitations-accept?token=${token}`
        : result?.invitation_link || result?.link || `${baseUrl}/teams-invitations-accept?token=demo-token`;

      onInviteSuccess(inviteEmail.trim().toLowerCase(), displayRoleLabel, inviteLink);
    } catch (err: any) {
      console.error("Invite error:", err);
      const msg = err?.data?.error?.message || err?.data?.message || err?.message || "Failed to send invitation. Please try again.";
      setInviteError(msg);
      toast.error(msg);
    }
  };

  const currentRoleLabel = activeRoles.find((r) => r.role === inviteRole)?.label || inviteRole;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black backdrop-blur-sm"
          />
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg bg-[#09090b] border border-white/10 rounded-[28px] shadow-2xl p-8 z-10 space-y-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-xl text-white leading-tight">Invite Member</h3>
                <p className="text-sm text-gray-500 font-normal mt-0.5">
                  Send an invitation to add a new team member.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div className="space-y-1.5">
                <label className="text-[16.06px] leading-[24.09px] font-semibold text-white tracking-[0px] mb-2.5 block select-none">
                  Enter an email address:
                </label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-[#131316] border border-white/10 focus:border-[#00A5E5]/40 transition-all rounded-xl py-3.5 px-4 text-sm text-white placeholder-gray-600 focus:outline-none"
                />
                <p className="text-xs text-gray-500 flex items-center gap-1.5 pl-1 font-normal select-none">
                  <span className="shrink-0">💡</span>
                  <span>The invited user must already have a NexaHub account.</span>
                </p>
              </div>

              {/* Choose a Role */}
              <div className="space-y-2">
                <div>
                  <label className="text-[16.06px] leading-[24.09px] font-semibold text-white tracking-[0px] mb-1 block select-none">
                    Choose a Role:
                  </label>
                  <p className="text-xs text-gray-500 font-normal select-none">
                    Assign roles according to responsibilities and permissions.
                  </p>
                </div>

                <div className="relative" ref={dropdownRef}>
                  <div
                    onClick={() => setIsRoleOpen(!isRoleOpen)}
                    className="w-full bg-[#131316] border border-white/10 hover:border-white/20 transition-all rounded-xl py-3.5 px-4 pr-10 text-sm font-semibold text-white cursor-pointer flex items-center justify-between select-none relative"
                  >
                    <span>{currentRoleLabel || "Select a role..."}</span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${isRoleOpen ? "rotate-180" : ""}`} />
                  </div>

                  <AnimatePresence>
                    {isRoleOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute left-0 right-0 mt-2 bg-[#0F0F12] border border-white/10 rounded-xl shadow-2xl p-1.5 z-20 max-h-56 overflow-y-auto no-scrollbar"
                      >
                        {activeRoles.map((roleObj) => {
                          const isSelected = roleObj.role === inviteRole;
                          return (
                            <div
                              key={roleObj.role}
                              onClick={() => {
                                setInviteRole(roleObj.role);
                                setIsRoleOpen(false);
                              }}
                              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg cursor-pointer text-sm font-semibold transition-all select-none
                                ${isSelected ? "text-[#00A5E5] hover:bg-[#00A5E5]/5" : "text-white hover:bg-white/[0.03]"}
                              `}
                            >
                              <span>{roleObj.label}</span>
                              {isSelected && <Check size={14} className="text-[#00A5E5] shrink-0" />}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dynamic Role Description Box */}
                <div className="bg-[#00A5E5]/5 border border-[#00A5E5]/20 rounded-xl p-4.5 space-y-1">
                  <p className="text-sm font-semibold text-white select-none">
                    {currentRoleLabel}
                  </p>
                  <p className="text-xs text-gray-400 font-normal leading-relaxed select-none">
                    {roleDetails[currentRoleLabel]?.desc || "Custom role assignment."}
                  </p>
                </div>
              </div>

              {inviteError && (
                <div className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/15 p-3 rounded-xl select-none">
                  {inviteError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full border border-white/10 text-white hover:bg-white/[0.05] transition-all text-sm font-semibold cursor-pointer bg-transparent"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSendingInvite}
                  className="bg-[#00A5E5] hover:bg-[#00A5E5]/90 disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-full px-6 py-2.5 text-sm transition-all cursor-pointer shadow-[0_4px_20px_rgba(0,165,229,0.15)] flex items-center justify-center"
                >
                  {isSendingInvite ? "Inviting..." : "Invite"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
