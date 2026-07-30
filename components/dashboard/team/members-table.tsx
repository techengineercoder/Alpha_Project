"use client";

import React, { useMemo, useState } from "react";
import { Search, X, Users, Clock, MoreHorizontal, User, UserCheck, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTeamMembersQuery, useDeleteTeamMemberMutation } from "@/redux/feature/team-managementSlice";
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
}

interface MembersTableProps {
  members: Member[];
  selectedTeamId: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  onViewDetails: (member: Member) => void;
  onToggleStatus: (id: string) => void;
  onDeleteMember: (id: string) => void;
  getRoleBadgeStyle: (role: string) => string;
}

export function MembersTable({
  members,
  selectedTeamId,
  searchQuery,
  setSearchQuery,
  activeMenuId,
  setActiveMenuId,
  onViewDetails,
  onToggleStatus,
  onDeleteMember,
  getRoleBadgeStyle,
}: MembersTableProps) {

  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [deleteTeamMember, { isLoading: isDeleting }] = useDeleteTeamMemberMutation();

  const { data: teamMembers } = useTeamMembersQuery(
    { id: selectedTeamId, search: searchQuery },
    { skip: !selectedTeamId }
  );
  console.log("teamMembers", teamMembers);

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    try {
      const res = await deleteTeamMember({ id: selectedTeamId, memberId: memberToDelete.id }).unwrap();
      toast.success(res?.message || "Member removed successfully");
      onDeleteMember(memberToDelete.id);
      setMemberToDelete(null);
    } catch (error: any) {
      console.error("Failed to remove member:", error);
      toast.error(error?.data?.message || error?.message || "Failed to remove member");
    }
  };

  // Normalize API results to Member structure
  const apiMembers = teamMembers?.results || (Array.isArray(teamMembers) ? teamMembers : []);

  const displayMembers = useMemo<Member[]>(() => {
    if (apiMembers.length > 0) {
      return apiMembers.map((m: any) => ({
        id: String(m.id || m.user?.id),
        name: m.user?.name || m.name || m.user?.email?.split("@")[0] || "User",
        email: m.user?.email || m.email || "",
        role: m.role || "Member",
        role_label: m.role_label || m.role || "Member",
        status: m.status
          ? (m.status.charAt(0).toUpperCase() + m.status.slice(1).toLowerCase()) as Member["status"]
          : "Active",
        avatarBg: m.avatarBg || "bg-indigo-500",
        avatarChar: (m.user?.name || m.name || "U").charAt(0).toUpperCase(),
        memberSince: m.created_at ? new Date(m.created_at).toLocaleDateString() : "Just now",
        lastActive: m.last_active || "Just now"
      }));
    }
    return members;
  }, [apiMembers, members]);



  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter members list based on query (Bypassed as search is handled by the API)
  const filteredMembers = displayMembers;

  // Calculate total pages
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);

  // Paginated visible members list
  const paginatedMembers = useMemo(() => {
    const start = (activePage - 1) * itemsPerPage;
    return filteredMembers.slice(start, start + itemsPerPage);
  }, [filteredMembers, activePage, itemsPerPage]);

  return (
    <section className="bg-[#0A0A0C] border border-white/5 rounded-[24px] overflow-hidden">
      {/* Filter / Info Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 md:p-6 pb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121215] border border-white/5 hover:border-white/10 focus:border-[#00A5E5]/40 transition-all rounded-full py-2.5 pl-11 pr-4 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 text-xs md:text-sm text-gray-500 font-semibold px-2">
          <Users size={16} className="text-gray-600" />
          <span>{filteredMembers.length} members</span>
        </div>
      </div>

      <div className="h-px bg-white/5 w-full" />

      {/* Table Area (Desktop Viewport) */}
      {/* Table Area with min-height to prevent absolute menus from clipping */}
      <div className="hidden md:block overflow-x-auto w-full no-scrollbar min-h-[290px]">
        <table className="w-full border-collapse text-left min-w-[768px]">
          <thead>
            <tr className="border-b border-white/5 text-xs font-semibold text-[#71717A] uppercase tracking-wider select-none bg-transparent">
              <th className="py-4 px-6 w-1/3">User</th>
              <th className="py-4 px-6 text-center w-1/4">Role</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedMembers.length > 0 ? (
              paginatedMembers.map((member) => (
                <tr
                  key={member.id}
                  className="group hover:bg-white/[0.01] transition-colors"
                >
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-sm border border-white/5 shadow-inner shrink-0 ${member.avatarBg}`}>
                        {member.avatarChar}
                      </div>
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-sm font-semibold text-white tracking-tight truncate leading-tight group-hover:text-[#00A5E5] transition-colors">
                          {member.name}
                        </span>
                        {member.email && member.name !== member.email && (
                          <span className="text-xs text-[#71717A] truncate leading-tight mt-0.5 font-medium">
                            {member.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-5 px-6 text-center">
                    <div className="inline-block">
                      <span className={`px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getRoleBadgeStyle(member.role_label || member.role)}`}>
                        {member.role_label || member.role}
                      </span>
                    </div>
                  </td>

                  <td className="py-5 px-6 text-center">
                    <span
                      onClick={() => onToggleStatus(member.id)}
                      title="Click to toggle status (Demo)"
                      className={`cursor-pointer select-none justify-center inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border whitespace-nowrap
                        ${member.status === "Active" || member.status === "Approved"
                          ? "text-[#22C55E] bg-[#22C55E]/10 border-transparent"
                          : member.status === "Pending"
                            ? "text-[#F59E0B] bg-[#F59E0B]/10 border-transparent"
                            : "text-[#EF4444] bg-[#EF4444]/10 border-transparent"
                        }
                      `}
                    >
                      {member.status === "Active" || member.status === "Approved" ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      ) : member.status === "Pending" ? (
                        <Clock size={12} className="text-[#F59E0B] shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                      )}
                      <span className="ml-0.5">{member.status}</span>
                    </span>
                  </td>

                  <td className="py-5 px-6 text-center">
                    <div className="flex items-center justify-center gap-3.5">
                      <button
                        onClick={() => onViewDetails(member)}
                        className="px-4 py-1.5 rounded-full border border-white/10 text-xs font-semibold text-white hover:bg-white/[0.05] transition-all cursor-pointer"
                      >
                        View
                      </button>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === member.id ? null : member.id)
                          }
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {activeMenuId === member.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveMenuId(null)}
                            />
                            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-[#121216] border border-white/10 shadow-2xl p-1.5 z-20 overflow-hidden text-left">
                              <div className="px-3 py-1.5 border-b border-white/5 mb-1 select-none">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                  Member Actions
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  onViewDetails(member);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all text-left"
                              >
                                <User size={14} className="text-gray-400" />
                                <span>Profile details</span>
                              </button>
                              <div className="h-px bg-white/5 my-1" />
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setMemberToDelete(member);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left"
                              >
                                <Trash2 size={14} />
                                <span>Remove member</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-500">
                  No members found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards Area (Mobile/Tablet Viewports) */}
      <div className="block md:hidden divide-y divide-white/5 w-full min-h-[290px]">
        {paginatedMembers.length > 0 ? (
          paginatedMembers.map((member) => (
            <div
              key={member.id}
              className="p-5 flex flex-col gap-4 bg-transparent"
            >
              {/* Top Row: User Avatar/Name + Menu Button */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-sm border border-white/5 shadow-inner shrink-0 ${member.avatarBg}`}>
                    {member.avatarChar}
                  </div>
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="text-sm font-semibold text-white tracking-tight truncate leading-tight">
                      {member.name}
                    </span>
                    {member.email && member.name !== member.email && (
                      <span className="text-xs text-[#71717A] truncate leading-tight mt-0.5 font-medium">
                        {member.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveMenuId(activeMenuId === member.id ? null : member.id)
                    }
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {activeMenuId === member.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setActiveMenuId(null)}
                      />
                      <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-[#121216] border border-white/10 shadow-2xl p-1.5 z-20 overflow-hidden text-left">
                        <div className="px-3 py-1.5 border-b border-white/5 mb-1 select-none">
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            Member Actions
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            onViewDetails(member);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all text-left"
                        >
                          <User size={14} className="text-gray-400" />
                          <span>Profile details</span>
                        </button>
                        <div className="h-px bg-white/5 my-1" />
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            setMemberToDelete(member);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left"
                        >
                          <Trash2 size={14} />
                          <span>Remove member</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Row: Badges (Role, Status) + View details button */}
              <div className="flex items-center justify-between gap-3 pt-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${getRoleBadgeStyle(member.role_label || member.role)}`}>
                    {member.role_label || member.role}
                  </span>
                  
                  <span
                    onClick={() => onToggleStatus(member.id)}
                    title="Click to toggle status (Demo)"
                    className={`cursor-pointer select-none justify-center inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold transition-all border whitespace-nowrap
                      ${member.status === "Active" || member.status === "Approved"
                        ? "text-[#22C55E] bg-[#22C55E]/10 border-transparent"
                        : member.status === "Pending"
                          ? "text-[#F59E0B] bg-[#F59E0B]/10 border-transparent"
                          : "text-[#EF4444] bg-[#EF4444]/10 border-transparent"
                      }
                    `}
                  >
                    {member.status === "Active" || member.status === "Approved" ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    ) : member.status === "Pending" ? (
                      <Clock size={10} className="text-[#F59E0B] shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                    )}
                    <span className="ml-0.5">{member.status}</span>
                  </span>
                </div>

                <button
                  onClick={() => onViewDetails(member)}
                  className="px-4 py-1.5 rounded-full border border-white/10 text-xs font-semibold text-white hover:bg-white/[0.05] transition-all cursor-pointer"
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-gray-500 text-sm">
            No members found matching your search.
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-transparent select-none">
          <div className="text-xs text-[#71717A] font-semibold">
            Showing {((activePage - 1) * itemsPerPage) + 1} to {Math.min(activePage * itemsPerPage, filteredMembers.length)} of {filteredMembers.length} members
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={activePage === 1}
              className="px-3.5 py-1.5 rounded-lg border border-white/5 text-xs font-semibold text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-all cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={activePage === totalPages}
              className="px-3.5 py-1.5 rounded-lg border border-white/5 text-xs font-semibold text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {/* ─── REMOVE MEMBER CONFIRMATION MODAL ─── */}
      <AnimatePresence>
        {memberToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setMemberToDelete(null)}
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
                    Are you sure you want to remove <span className="text-white font-semibold">{memberToDelete.name}</span>?
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
                  onClick={() => setMemberToDelete(null)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
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
    </section>
  );
}
