"use client";

import React, { useMemo } from "react";
import { Search, X, Users, Clock, MoreHorizontal, User, UserCheck, Trash2 } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Pending" | "Declined";
  avatarBg: string;
  avatarChar: string;
}

interface MembersTableProps {
  members: Member[];
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
  searchQuery,
  setSearchQuery,
  activeMenuId,
  setActiveMenuId,
  onViewDetails,
  onToggleStatus,
  onDeleteMember,
  getRoleBadgeStyle,
}: MembersTableProps) {
  // Filter members list based on query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    const query = searchQuery.toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

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

      {/* Table Area */}
      <div className="overflow-x-auto w-full no-scrollbar">
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
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
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
                      <span className={`px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getRoleBadgeStyle(member.role)}`}>
                        {member.role}
                      </span>
                    </div>
                  </td>

                  <td className="py-5 px-6 text-center">
                    <span
                      onClick={() => onToggleStatus(member.id)}
                      title="Click to toggle status (Demo)"
                      className={`cursor-pointer select-none justify-center inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border whitespace-nowrap
                        ${member.status === "Active"
                          ? "text-[#22C55E] bg-[#22C55E]/10 border-transparent"
                          : member.status === "Pending"
                            ? "text-[#F59E0B] bg-[#F59E0B]/10 border-transparent"
                            : "text-[#EF4444] bg-[#EF4444]/10 border-transparent"
                        }
                      `}
                    >
                      {member.status === "Active" ? (
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
                              <button
                                onClick={() => onToggleStatus(member.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all text-left"
                              >
                                <UserCheck size={14} className="text-gray-400" />
                                <span>Cycle Status</span>
                              </button>
                              <div className="h-px bg-white/5 my-1" />
                              <button
                                onClick={() => onDeleteMember(member.id)}
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
    </section>
  );
}
