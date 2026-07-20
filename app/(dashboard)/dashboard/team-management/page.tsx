"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Bell } from "lucide-react";
import { TeamSwitcher } from "@/components/dashboard/team/team-switcher";
import { CreateTeamModal } from "@/components/dashboard/team/create-team-modal";
import { InviteMemberModal } from "@/components/dashboard/team/invite-member-modal";
import { InviteSuccessModal } from "@/components/dashboard/team/invite-success-modal";
import { MemberDetailsDrawer } from "@/components/dashboard/team/member-details-drawer";
import { StatsCards } from "@/components/dashboard/team/stats-cards";
import { MembersTable } from "@/components/dashboard/team/members-table";

import mockData from "@/data/mock-data.json";
import { useMyTeamQuery, useCreateTeamMutation, useGetTeamRolesQuery, useTeamMembersQuery } from "@/redux/feature/team-managementSlice";
import { toast } from "sonner";

// Types
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

interface Team {
  id: string;
  name: string;
  type: "Personal" | "Team";
  avatarBg: string;
  avatarChar: string;
  domain?: string;
}

// Role Descriptions & Permissions Map
const ROLE_DETAILS: Record<string, { desc: string; permissions: { sendOffers: boolean; viewBookings: boolean; financial: boolean; invite: boolean } }> = {
  "CEO / GM": {
    desc: "Full control over agency settings, billing, members, and all bookings.",
    permissions: { sendOffers: true, viewBookings: true, financial: true, invite: true }
  },
  "Entertainment Manager": {
    desc: "Can schedule shows, coordinate tours, and manage artist availability.",
    permissions: { sendOffers: false, viewBookings: true, financial: false, invite: false }
  },
  "Talent Buyer": {
    desc: "Can search artists, send offers, manage bookings and contracts.",
    permissions: { sendOffers: true, viewBookings: true, financial: false, invite: false }
  },
  "Production Director": {
    desc: "Manages show productions, rider execution, tech requirements, and logistics.",
    permissions: { sendOffers: false, viewBookings: true, financial: false, invite: false }
  },
  "Marketing Director": {
    desc: "Oversees promotional activities, PR campaigns, social media, and ticket sales.",
    permissions: { sendOffers: false, viewBookings: true, financial: false, invite: false }
  },
  "Finance Team": {
    desc: "Manages invoices, pay-outs, reports, taxes, and financial operations.",
    permissions: { sendOffers: false, viewBookings: true, financial: true, invite: false }
  },
  "Legal Team": {
    desc: "Reviews agreements, processes contracts, handles disputes, and monitors compliance.",
    permissions: { sendOffers: false, viewBookings: true, financial: false, invite: false }
  },
  "Artist": {
    desc: "Direct access to manage profiles, view contract offers, and calendar entries.",
    permissions: { sendOffers: false, viewBookings: true, financial: false, invite: false }
  },
  "Manager": {
    desc: "Manages multiple artist profiles, deals, incoming bookings, and calendars.",
    permissions: { sendOffers: true, viewBookings: true, financial: true, invite: true }
  },
  "Business Manager": {
    desc: "Reviews deals, approves offers, and handles financial contracts.",
    permissions: { sendOffers: true, viewBookings: true, financial: true, invite: false }
  },
  "Responsible Agent": {
    desc: "Primary representative for booking deals, negotiation, and agent approvals.",
    permissions: { sendOffers: true, viewBookings: true, financial: true, invite: true }
  },
  "Segment Agent": {
    desc: "Co-ordinates agent work for specific territories, genres, or events.",
    permissions: { sendOffers: true, viewBookings: true, financial: false, invite: false }
  },
  "Tour Manager": {
    desc: "On-the-road logistical coordination, travel plans, and rider checkouts.",
    permissions: { sendOffers: false, viewBookings: true, financial: false, invite: false }
  },
  "Legal Representative": {
    desc: "Authorized signer for contracts, riders, and legally binding papers.",
    permissions: { sendOffers: false, viewBookings: true, financial: false, invite: false }
  }
};

const ROLES_LIST = Object.keys(ROLE_DETAILS);

export default function TeamManagementPage() {
  // Teams & Selection States
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState("2");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Queries & Mutations
  const { data } = useMyTeamQuery(undefined);
  const [createTeam] = useCreateTeamMutation();
  const { data: rolesData } = useGetTeamRolesQuery(undefined);
  const { data: teamMembersApiData } = useTeamMembersQuery(
    { id: selectedTeamId, search: searchQuery },
    { skip: !selectedTeamId }
  );
  console.log("Team data:", data);
  console.log("Team members API data:", teamMembersApiData);

  // Load local storage active team selection on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const activeTeamId = localStorage.getItem("active_team_id");
      if (activeTeamId) {
        setSelectedTeamId(activeTeamId);
      }
    }
  }, []);

  // Sync API teams with local state dynamically
  useEffect(() => {
    if (data?.results) {
      const apiTeams = data.results.map((t: any) => ({
        id: String(t.id),
        name: t.name,
        type: "Team" as const,
        avatarBg: t.domain === "artist" ? "bg-sky-500" : "bg-[#F59E0B]",
        avatarChar: t.name.charAt(0).toUpperCase(),
        domain: t.domain
      }));

      setTeams((prev) => {
        const filteredPrev = prev.filter(p => !apiTeams.some((a: any) => a.id === p.id));
        const merged = [...filteredPrev, ...apiTeams];
        
        // Auto-select first team if current selection is invalid
        if (merged.length > 0) {
          const selectionExists = merged.some(t => t.id === selectedTeamId);
          if (!selectionExists) {
            const activeTeamId = localStorage.getItem("active_team_id");
            const selectId = activeTeamId && merged.some(t => t.id === activeTeamId) ? activeTeamId : merged[0].id;
            setSelectedTeamId(selectId);
          }
        }
        return merged;
      });
    }
  }, [data]);

  // Team-specific Members Map State
  const [teamMembers, setTeamMembers] = useState<Record<string, Member[]>>({});

  // Derived Active Members List
  const members = useMemo(() => {
    return teamMembers[selectedTeamId] || [];
  }, [teamMembers, selectedTeamId]);

  // Selected Team
  const activeTeam = useMemo(() => {
    return (
      teams.find((t) => t.id === selectedTeamId) ||
      teams[0] || {
        id: "",
        name: "No Team Selected",
        type: "Team" as const,
        avatarBg: "bg-gray-500",
        avatarChar: "?",
      }
    );
  }, [teams, selectedTeamId]);

  // Invite Form States
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Talent Buyer");
  const [inviteError, setInviteError] = useState("");

  // Success Invitation States
  const [isInviteSuccessOpen, setIsInviteSuccessOpen] = useState(false);
  const [successInviteEmail, setSuccessInviteEmail] = useState("");
  const [successInviteRole, setSuccessInviteRole] = useState("");
  const [successInviteLink, setSuccessInviteLink] = useState("");

  // Dynamic metric calculations
  const stats = useMemo(() => {
    const apiCounts = teamMembersApiData?.counts;
    if (apiCounts) {
      return {
        total: Number(apiCounts.total ?? 0),
        active: Number(apiCounts.active ?? 0),
        pending: Number(apiCounts.pending ?? 0),
        declined: Number(apiCounts.declined ?? 0),
      };
    }

    return {
      total: members.length,
      active: members.filter((m) => m.status === "Active" || m.status === "Approved").length,
      pending: members.filter((m) => m.status === "Pending").length,
      declined: members.filter((m) => m.status === "Declined").length,
    };
  }, [teamMembersApiData, members]);

  // Invite success callback handler
  const handleInviteSuccess = (email: string, role: string, link: string) => {
    setSuccessInviteEmail(email);
    setSuccessInviteRole(role);
    setSuccessInviteLink(link);
    setInviteEmail("");
    setInviteRole("Talent Buyer");
    setInviteError("");
    setIsInviteModalOpen(false);
    setIsInviteSuccessOpen(true);
  };

  // Create Team Submit via API
  const handleCreateTeam = async (name: string, domain: "artist" | "venue", role: string) => {
    try {
      const payload = {
        domain,
        name: name.trim(),
        role
      };

      const result = await createTeam(payload).unwrap();

      if (result.success || result.id || result.data?.id) {
        const teamId = String(result.id || result.data?.id || "team-" + Date.now());
        localStorage.setItem("active_team_id", teamId);
        localStorage.setItem("active_team_name", name.trim());
        setSelectedTeamId(teamId);
        setIsCreateTeamOpen(false);
        setIsTeamDropdownOpen(false);
        toast.success("Team created successfully!");
      } else {
        toast.error("Failed to create team. Please try again.");
      }
    } catch (err: any) {
      console.error("Error creating team:", err);
      const msg = err?.data?.error?.message || err?.data?.message || err?.message || "Failed to create team. Please try again.";
      toast.error(msg);
    }
  };

  // Remove Member
  const handleDeleteMember = (id: string) => {
    setTeamMembers((prev) => ({
      ...prev,
      [selectedTeamId]: (prev[selectedTeamId] || []).filter((m) => m.id !== id)
    }));
    setActiveMenuId(null);
    setSelectedMember(null);
  };

  // Change Member Status (for demonstration toggle)
  const handleToggleStatus = (id: string) => {
    setTeamMembers((prev) => ({
      ...prev,
      [selectedTeamId]: (prev[selectedTeamId] || []).map((m) => {
        if (m.id === id) {
          const nextStatusMap: Record<string, "Active" | "Approved" | "Pending" | "Declined"> = {
            Active: "Pending",
            Approved: "Pending",
            Pending: "Declined",
            Declined: "Active",
          };
          return { ...m, status: nextStatusMap[m.status] || "Active" };
        }
        return m;
      })
    }));
    setActiveMenuId(null);
  };

  // Change Role inside Drawer
  const handleRoleChange = (memberId: string, nextRole: string) => {
    setTeamMembers((prev) => ({
      ...prev,
      [selectedTeamId]: (prev[selectedTeamId] || []).map((m) => {
        if (m.id === memberId) {
          return { ...m, role: nextRole };
        }
        return m;
      })
    }));
    // Sync currently viewed drawer details
    if (selectedMember && selectedMember.id === memberId) {
      setSelectedMember({ ...selectedMember, role: nextRole });
    }
  };

  // Role Badge Styles
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "CEO / GM":
        return "text-[#EAB308] bg-[#EAB308]/10 border border-[#EAB308]/20";
      case "Responsible Agent":
        return "text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20";
      case "Talent Buyer":
        return "text-[#0D9488] bg-[#0D9488]/10 border border-[#0D9488]/20";
      case "Entertainment Manager":
        return "text-[#0284C7] bg-[#0284C7]/10 border border-[#0284C7]/20";
      default:
        return "text-gray-400 bg-gray-400/10 border border-gray-400/20";
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 w-full space-y-8 pb-16 relative">
      {/* ─── HEADER BAR ─── */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Title / Description */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl md:text-[28px] font-bold text-white tracking-tight  animate-fade-in">
              Team Management
            </h2>
          </div>
          <p className="text-[#A1A1AA] text-sm mt-2 font-normal">
            Manage members, roles, and permissions for{" "}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#421515] text-[#FF6B6B] border border-[#FF6B6B]/15">
              {activeTeam.name}
            </span>
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full md:w-auto justify-between md:justify-start z-20">
          {/* Team Switcher dropdown */}
          <TeamSwitcher
            activeTeam={activeTeam}
            teams={teams}
            isTeamDropdownOpen={isTeamDropdownOpen}
            setIsTeamDropdownOpen={setIsTeamDropdownOpen}
            teamSearchQuery={teamSearchQuery}
            setTeamSearchQuery={setTeamSearchQuery}
            selectedTeamId={selectedTeamId}
            setSelectedTeamId={setSelectedTeamId}
            onCreateTeamClick={() => setIsCreateTeamOpen(true)}
          />

          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            {/* Notification Bell */}
            <button
              onClick={() => window.dispatchEvent(new Event("open-notifications"))}
              className="w-12 h-12 rounded-[18px] flex items-center justify-center bg-[#0E0E10] border border-white/5 text-gray-400 hover:text-white hover:border-white/10 transition-all relative cursor-pointer shrink-0"
            >
              <Bell size={18} />
              <span className="absolute top-3.5 right-4 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-black" />
            </button>

            {/* Invite Button */}
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-[#00A5E5] hover:bg-[#00A5E5]/90 text-white font-bold rounded-[18px] h-12 px-5 flex items-center justify-center gap-2 text-sm shadow-[0_4px_20px_rgba(0,165,229,0.25)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex-1 sm:flex-initial"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Invite Member</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── STATISTICS ROW ─── */}
      <StatsCards stats={stats} />

      {/* ─── MEMBERS CONTAINER CARD ─── */}
      <MembersTable
        members={members}
        selectedTeamId={activeTeam.id}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeMenuId={activeMenuId}
        setActiveMenuId={setActiveMenuId}
        onViewDetails={setSelectedMember}
        onToggleStatus={handleToggleStatus}
        onDeleteMember={handleDeleteMember}
        getRoleBadgeStyle={getRoleBadgeStyle}
      />

      {/* ─── NEW TEAM MODAL ─── */}
      <CreateTeamModal
        isOpen={isCreateTeamOpen}
        onClose={() => setIsCreateTeamOpen(false)}
        onCreateTeam={handleCreateTeam}
      />

      {/* ─── INVITE MEMBER MODAL ─── */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        selectedTeamId={activeTeam.id}
        selectedTeamDomain={activeTeam.domain || "artist"}
        onInviteSuccess={handleInviteSuccess}
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        inviteRole={inviteRole}
        setInviteRole={setInviteRole}
        inviteError={inviteError}
        setInviteError={setInviteError}
        roleDetails={ROLE_DETAILS}
        rolesList={ROLES_LIST}
      />

      {/* ─── MEMBER DETAILS RIGHT SLIDE DRAWER ─── */}
      <MemberDetailsDrawer
        selectedMember={selectedMember}
        selectedTeamId={activeTeam.id}
        onClose={() => setSelectedMember(null)}
        rolesList={ROLES_LIST}
        roleDetails={ROLE_DETAILS}
        onRoleChange={handleRoleChange}
        onDeleteMember={handleDeleteMember}
        getRoleBadgeStyle={getRoleBadgeStyle}
      />

      {/* ─── MEMBER INVITED SUCCESS MODAL ─── */}
      <InviteSuccessModal
        isOpen={isInviteSuccessOpen}
        onClose={() => setIsInviteSuccessOpen(false)}
        email={successInviteEmail}
        role={successInviteRole}
        inviteLink={successInviteLink}
      />
    </div>
  );
}
