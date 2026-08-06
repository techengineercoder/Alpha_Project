"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Trash2, Loader2, ShieldAlert, Copy, Check, Settings2, Globe, Search, X, Users } from "lucide-react";
import { CommonHeader } from "@/components/dashboard/page-header";
import { DeleteTeamModal } from "@/components/dashboard/team/delete-team-modal";
import { useMyTeamQuery, useDeleteTeamMutation } from "@/redux/feature/team-managementSlice";
import { toast } from "sonner";

interface Team {
  id: string;
  name: string;
  type: "Team";
  avatarBg: string;
  avatarChar: string;
  domain: "artist" | "venue";
  myMembership?: {
    role?: string;
    role_label?: string;
    rank?: number;
    status?: string;
  } | null;
  createdBy?: {
    id: number;
    name: string;
    email: string;
  } | null;
}

export default function SettingsPage() {
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Queries & Mutations
  const { data, isFetching } = useMyTeamQuery(debouncedSearch);
  const [deleteTeam, { isLoading: isDeletingTeam }] = useDeleteTeamMutation();

  // Load local storage active team selection on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const activeTeamId = localStorage.getItem("active_team_id");
      if (activeTeamId) {
        setSelectedTeamId(activeTeamId);
      }
    }
  }, []);

  const teams = useMemo<Team[]>(() => {
    if (data?.results) {
      return data.results.map((t: any) => ({
        id: String(t.id),
        name: t.name,
        type: "Team" as const,
        avatarBg: t.domain === "artist" ? "bg-sky-500" : "bg-[#F59E0B]",
        avatarChar: t.name.charAt(0).toUpperCase(),
        domain: t.domain,
        myMembership: t.my_membership,
        createdBy: t.created_by
      }));
    }
    return [];
  }, [data]);

  const filteredTeams = useMemo(() => {
    return teams.filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teams, searchQuery]);

  // Sync to local storage if active selection is invalid, empty, or not found in teams list
  useEffect(() => {
    if (teams.length > 0) {
      const activeTeamId = localStorage.getItem("active_team_id");
      const hasStoredId = activeTeamId && teams.some(t => t.id === activeTeamId);
      const currentSelectedExists = teams.some(t => t.id === selectedTeamId);

      if (!selectedTeamId || !currentSelectedExists) {
        const selectId = hasStoredId ? activeTeamId : teams[0].id;
        setSelectedTeamId(selectId);
        localStorage.setItem("active_team_id", selectId);
        const selTeam = teams.find(t => t.id === selectId);
        if (selTeam) {
          localStorage.setItem("active_team_name", selTeam.name);
        }
      }
    }
  }, [teams, selectedTeamId]);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Organization ID copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteTeamConfirm = async () => {
    if (!teamToDelete) return;
    try {
      await deleteTeam({ id: teamToDelete.id }).unwrap();
      toast.success(`Organization "${teamToDelete.name}" deleted successfully!`);
      
      const isDeletingActive = teamToDelete.id === selectedTeamId;
      setTeamToDelete(null);

      if (isDeletingActive) {
        const remainingTeams = teams.filter((t) => t.id !== teamToDelete.id);
        if (remainingTeams.length > 0) {
          const nextTeam = remainingTeams[0];
          setSelectedTeamId(nextTeam.id);
          localStorage.setItem("active_team_id", nextTeam.id);
          localStorage.setItem("active_team_name", nextTeam.name);
          window.location.reload();
        } else {
          localStorage.removeItem("active_team_id");
          localStorage.removeItem("active_team_name");
          window.location.reload();
        }
      }
    } catch (err: any) {
      console.error("Failed to delete organization:", err);
      const msg = err?.data?.error?.message || err?.data?.message || err?.message || "Failed to delete organization.";
      toast.error(msg);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 w-full space-y-8 pb-16 relative">
      {/* Page Header */}
      <CommonHeader
        title="Settings"
        subtitle="Manage your organization settings, list, and preferences."
        showSearch={teams.length > 0}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search organizations..."
      />

      {isFetching ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="h-8 w-8 text-[#00A5E5] animate-spin" />
          <span className="text-sm text-zinc-400 font-medium">Loading settings...</span>
        </div>
      ) : (
        <div className="max-w-4xl space-y-8">
          {/* Organizations List */}
          <section className="bg-[#0A0A0C] border border-white/5 rounded-[24px] overflow-hidden p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-[#00A5E5]">
                  <Settings2 size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Your Organizations</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">A list of all organizations you belong to. Delete or switch active settings from here.</p>
                </div>
              </div>
              
              {teams.length > 0 && (
                <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm text-zinc-500 font-semibold px-2 shrink-0">
                  <Users size={16} className="text-zinc-650" />
                  <span>{filteredTeams.length} organizations</span>
                </div>
              )}
            </div>

            <div className="space-y-3.5 pt-2">
              {teams.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-sm">
                  No organizations found.
                </div>
              ) : filteredTeams.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-sm">
                  No matching organizations found.
                </div>
              ) : (
                filteredTeams.map((t) => {
                  const isActive = t.id === selectedTeamId;
                  const isCopied = copiedId === t.id;
                  return (
                    <div
                      key={t.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 bg-[#121215] border rounded-2xl transition-all duration-200 ${
                        isActive ? "border-[#00A5E5]/30 bg-[#00A5E5]/[0.02]" : "border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Avatar */}
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm ${t.avatarBg}`}>
                          {t.avatarChar}
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="font-semibold text-sm text-white truncate">{t.name}</span>
                            {isActive && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#00A5E5]/10 text-[#00A5E5] border border-[#00A5E5]/20 uppercase tracking-wide">
                                Active
                              </span>
                            )}
                          </div>
                          
                          {/* Created By Box */}
                           {t.createdBy && (
                             <div className="text-zinc-500 text-xs flex items-center gap-1">
                               <span>Created by:</span>
                               <span className="text-zinc-400 font-semibold">{t.createdBy.name || t.createdBy.email}</span>
                             </div>
                           )}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 shrink-0 self-end sm:self-center">
                        {/* Domain Badge */}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-white/[0.04] text-zinc-400 capitalize border border-white/5">
                          <Globe size={12} className="text-zinc-500" />
                          <span>{t.domain}</span>
                        </span>

                        {/* Role Badge */}
                        {t.myMembership?.role_label && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-white/[0.04] text-zinc-400 capitalize border border-white/5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 animate-pulse" />
                            <span>{t.myMembership.role_label}</span>
                          </span>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => setTeamToDelete(t)}
                          className="w-9 h-9 flex items-center justify-center bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-500 hover:text-red-400 rounded-xl cursor-pointer transition-colors"
                          title={`Delete ${t.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Danger Zone Alert Banner */}
          <section className="bg-red-500/[0.02] border border-red-500/10 rounded-[24px] p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider">Warning</h3>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Deleting an organization permanently removes all associated data, including members, roles, availability events, and negotiation history. This operation is highly destructive and cannot be reverted.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* Delete Team Modal */}
      <DeleteTeamModal
        isOpen={teamToDelete !== null}
        onClose={() => setTeamToDelete(null)}
        onConfirm={handleDeleteTeamConfirm}
        teamName={teamToDelete?.name || ""}
        isLoading={isDeletingTeam}
      />
    </div>
  );
}
