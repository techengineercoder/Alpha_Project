"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, ChevronDown, Check, Activity, AlertTriangle, Trash2, Clock } from "lucide-react";
import { useDeleteTeamMemberMutation } from "@/redux/feature/team-managementSlice";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  role_label?: string;
  status: "Active" | "Approved" | "Pending" | "Declined";
  avatarBg: string;
  avatarChar: string;
  memberSince?: string;
  lastActive?: string;
  offersInvolved?: number;
  contractsSigned?: number;
}

interface MemberDetailsDrawerProps {
  selectedMember: Member | null;
  selectedTeamId?: string;
  onClose: () => void;
  rolesList: string[];
  roleDetails: Record<string, { desc: string; permissions: { sendOffers: boolean; viewBookings: boolean; financial: boolean; invite: boolean } }>;
  onRoleChange: (memberId: string, role: string) => void;
  onDeleteMember: (memberId: string) => void;
  getRoleBadgeStyle: (role: string) => string;
}

export function MemberDetailsDrawer({
  selectedMember,
  selectedTeamId,
  onClose,
  rolesList,
  roleDetails,
  onRoleChange,
  onDeleteMember,
  getRoleBadgeStyle,
}: MemberDetailsDrawerProps) {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  const [deleteTeamMember, { isLoading: isDeleting }] = useDeleteTeamMemberMutation();

  const handleRemoveTeamMember = async () => {
    if (!selectedMember) return;
    try {
      const res = await deleteTeamMember(
        selectedTeamId
          ? { id: selectedTeamId, memberId: selectedMember.id }
          : selectedMember.id
      ).unwrap();
      toast.success(res?.message || "Member removed successfully");
      setIsDeleteModalOpen(false);
      onDeleteMember(selectedMember.id);
      onClose();
    } catch (error: any) {
      console.error("Failed to remove member:", error);
      toast.error(error?.data?.message || error?.message || "Failed to remove member");
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <AnimatePresence>
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black backdrop-blur-sm"
          />

          {/* Right Drawer Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 250 }}
            className="relative w-full max-w-[440px] bg-[#09090b] border-l border-white/5 h-full z-10 flex flex-col p-6 overflow-y-auto no-scrollbar shadow-2xl space-y-6"
          >
            {/* Drawer Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-2xl border border-white/10 shrink-0 ${selectedMember.avatarBg}`}>
                  {selectedMember.avatarChar}
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="text-xl font-bold text-white truncate leading-tight tracking-tight">
                    {selectedMember.name}
                  </h3>
                  <p className="text-sm text-gray-400 truncate leading-normal mt-0.5 font-medium">
                    {selectedMember.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getRoleBadgeStyle(selectedMember.role_label || selectedMember.role)}`}>
                      {selectedMember.role_label || selectedMember.role}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border
                      ${selectedMember.status === "Active" || selectedMember.status === "Approved"
                        ? "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20"
                        : selectedMember.status === "Pending"
                          ? "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20"
                          : "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20"
                      }
                    `}>
                      {(selectedMember.status === "Active" || selectedMember.status === "Approved") && <span className="w-1 h-1 rounded-full bg-[#22C55E]" />}
                      {selectedMember.status === "Pending" && <Clock size={10} className="text-[#F59E0B] shrink-0" />}
                      {selectedMember.status === "Declined" && <span className="w-1 h-1 rounded-full bg-[#EF4444]" />}
                      <span>{selectedMember.status}</span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="h-px bg-white/5" />

            {/* Drawer Section 1: Role & Permissions */}
            <div className="bg-[#0E0E11] rounded-2xl border border-white/5 p-5 space-y-4">
              <div className="flex items-center gap-2.5 text-sm font-bold text-white tracking-tight">
                <Shield size={16} className="text-gray-400" />
                <span>Role & Permissions</span>
              </div>

              <div className="relative" ref={roleDropdownRef}>
                <div
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="w-full bg-[#131316] border border-white/10 hover:border-white/20 transition-all rounded-xl py-3 px-4 pr-10 text-sm font-semibold text-white cursor-pointer flex items-center justify-between select-none relative"
                >
                  <span>{selectedMember.role_label || selectedMember.role}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
                </div>

                <AnimatePresence>
                  {isRoleDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 right-0 mt-2 bg-[#0F0F12] border border-white/10 rounded-xl shadow-2xl p-1.5 z-20 max-h-72 overflow-y-auto no-scrollbar"
                    >
                      {rolesList.map((role) => {
                        const isSelected = role === (selectedMember.role_label || selectedMember.role);
                        return (
                          <div
                            key={role}
                            onClick={() => {
                              onRoleChange(selectedMember.id, role);
                              setIsRoleDropdownOpen(false);
                            }}
                            className={`flex items-center justify-between px-3.5 py-3 rounded-lg cursor-pointer text-sm font-semibold transition-all select-none
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

              {/* Permissions List */}
              <div className="space-y-3.5 pt-2">
                {[
                  { key: "sendOffers", label: "Can send offers" },
                  { key: "viewBookings", label: "Can view bookings" },
                  { key: "financial", label: "Can access financial data" },
                  { key: "invite", label: "Can invite members" },
                ].map((perm) => {
                  const isGranted = roleDetails[selectedMember.role_label || selectedMember.role]?.permissions[perm.key as keyof typeof roleDetails[string]["permissions"]] || false;
                  return (
                    <div key={perm.key} className="flex items-center gap-3.5 select-none">
                      {isGranted ? (
                        <div className="w-4.5 h-4.5 rounded-full border border-[#22C55E] flex items-center justify-center text-[#22C55E] bg-[#22C55E]/5 shrink-0">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-4.5 h-4.5 rounded-full border border-white/10 bg-transparent shrink-0" />
                      )}
                      <span className={`text-sm font-semibold transition-colors ${isGranted ? "text-gray-200" : "text-gray-500"}`}>
                        {perm.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Drawer Section 2: Activity Grid */}
            <div className="bg-[#0E0E11] rounded-2xl border border-white/5 p-5 space-y-4">
              <div className="flex items-center gap-2.5 text-sm font-bold text-white tracking-tight">
                <Activity size={16} className="text-gray-400" />
                <span>Activity</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-[#131316] rounded-xl border border-white/5 p-3.5 flex flex-col justify-between min-h-[75px]">
                  <span className="text-xs text-[#71717A] font-normal leading-none">
                    Member since
                  </span>
                  <span className="text-sm font-semibold text-white mt-1.5 block leading-none">
                    {selectedMember.memberSince || "Jan 12, 2024"}
                  </span>
                </div>

                <div className="bg-[#131316] rounded-xl border border-white/5 p-3.5 flex flex-col justify-between min-h-[75px]">
                  <span className="text-xs text-[#71717A] font-normal leading-none">
                    Last active
                  </span>
                  <span className="text-sm font-semibold text-white mt-1.5 block leading-none">
                    {selectedMember.lastActive || "2 min ago"}
                  </span>
                </div>

                <div className="bg-[#131316] rounded-xl border border-white/5 p-3.5 flex flex-col justify-between min-h-[75px]">
                  <span className="text-xs text-[#71717A] font-normal leading-none">
                    Offers involved
                  </span>
                  <span className="text-sm font-semibold text-white mt-1.5 block leading-none">
                    {selectedMember.offersInvolved ?? 142}
                  </span>
                </div>

                <div className="bg-[#131316] rounded-xl border border-white/5 p-3.5 flex flex-col justify-between min-h-[75px]">
                  <span className="text-xs text-[#71717A] font-normal leading-none">
                    Contracts signed
                  </span>
                  <span className="text-sm font-semibold text-white mt-1.5 block leading-none">
                    {selectedMember.contractsSigned ?? 38}
                  </span>
                </div>
              </div>
            </div>

            {/* Drawer Section 3: Danger Zone */}
            <div className="bg-[#1c0f0f]/30 rounded-2xl border border-red-500/15 p-5 space-y-3.5 mt-auto">
              <div className="flex items-center gap-2.5 text-sm font-bold text-[#FF6B6B] tracking-tight">
                <AlertTriangle size={16} className="text-[#FF6B6B] shrink-0" />
                <span>Danger Zone</span>
              </div>
              <p className="text-xs text-[#71717A] font-normal leading-relaxed">
                This will revoke their access immediately.
              </p>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-5 py-2.5 rounded-xl border border-[#FF6B6B]/30 hover:border-[#FF6B6B]/60 text-[#FF6B6B] font-semibold text-xs transition-all bg-transparent hover:bg-[#FF6B6B]/5 cursor-pointer active:scale-[0.98] w-fit block mt-3"
              >
                Remove Member
              </button>
            </div>
          </motion.aside>

          {/* ─── REMOVE MEMBER CONFIRMATION MODAL ─── */}
          <AnimatePresence>
            {isDeleteModalOpen && selectedMember && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
                  className="fixed inset-0 bg-black backdrop-blur-sm"
                />

                {/* Modal Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="relative w-full max-w-md bg-[#0D0D10] border border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-5"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                      <Trash2 size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">
                        Remove Member?
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Are you sure you want to remove <span className="text-white font-semibold">{selectedMember.name}</span>?
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 bg-white/[0.03] border border-white/5 rounded-xl p-3 leading-relaxed">
                    This will immediately revoke their access to this team and all associated permissions. This action cannot be undone.
                  </p>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={handleRemoveTeamMember}
                      className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isDeleting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Removing...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 size={14} />
                          <span>Yes, Remove Member</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
