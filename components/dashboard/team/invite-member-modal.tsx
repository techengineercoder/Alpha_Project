"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Check } from "lucide-react";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  inviteName: string;
  setInviteName: (name: string) => void;
  inviteRole: string;
  setInviteRole: (role: string) => void;
  inviteError: string;
  onSubmit: (e: React.FormEvent) => void;
  roleDetails: Record<string, { desc: string }>;
  rolesList: string[];
}

export function InviteMemberModal({
  isOpen,
  onClose,
  inviteEmail,
  setInviteEmail,
  inviteName,
  setInviteName,
  inviteRole,
  setInviteRole,
  inviteError,
  onSubmit,
  roleDetails,
  rolesList,
}: InviteMemberModalProps) {
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg bg-[#09090b] border border-white/10 rounded-[28px] shadow-2xl p-8 z-10 space-y-6"
          >
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

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Email field */}
              <div className="space-y-1.5">
                <label className="text-[16.06px] leading-[24.09px] font-semibold text-white tracking-[0px] mb-2.5 block">
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
                <p className="text-xs text-gray-500 flex items-center gap-1.5 pl-1 font-normal">
                  <span className="shrink-0">💡</span>
                  <span>The invited user must already have a NexaHub account.</span>
                </p>
              </div>

              {/* Choose a Role */}
              <div className="space-y-2">
                <div>
                  <label className="text-[16.06px] leading-[24.09px] font-semibold text-white tracking-[0px] mb-1 block">
                    Choose a Role:
                  </label>
                  <p className="text-xs text-gray-500 font-normal">
                    Assign roles according to responsibilities and permissions.
                  </p>
                </div>

                <div className="relative" ref={dropdownRef}>
                  <div
                    onClick={() => setIsRoleOpen(!isRoleOpen)}
                    className="w-full bg-[#131316] border border-white/10 hover:border-white/20 transition-all rounded-xl py-3.5 px-4 pr-10 text-sm font-semibold text-white cursor-pointer flex items-center justify-between select-none relative"
                  >
                    <span>{inviteRole}</span>
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
                        {rolesList.map((role) => {
                          const isSelected = role === inviteRole;
                          return (
                            <div
                              key={role}
                              onClick={() => {
                                setInviteRole(role);
                                setIsRoleOpen(false);
                              }}
                              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg cursor-pointer text-sm font-semibold transition-all select-none
                                ${isSelected ? "text-[#00A5E5] hover:bg-[#00A5E5]/5" : "text-white hover:bg-white/[0.03]"}
                              `}
                            >
                              <span>{role}</span>
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
                  <p className="text-sm font-semibold text-white">
                    {inviteRole}
                  </p>
                  <p className="text-xs text-gray-400 font-normal leading-relaxed">
                    {roleDetails[inviteRole]?.desc || "Custom role assignment."}
                  </p>
                </div>
              </div>

              {inviteError && (
                <div className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/15 p-3 rounded-xl">
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
                  className="bg-[#00A5E5] hover:bg-[#00A5E5]/90 text-white font-semibold rounded-full px-6 py-2.5 text-sm transition-all cursor-pointer shadow-[0_4px_20px_rgba(0,165,229,0.15)]"
                >
                  Invite
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
