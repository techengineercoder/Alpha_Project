"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Bell, Trash2, Loader2 } from "lucide-react";
import { TeamSwitcher } from "@/components/dashboard/team/team-switcher";
import { CreateTeamModal } from "@/components/dashboard/team/create-team-modal";
import { InviteMemberModal } from "@/components/dashboard/team/invite-member-modal";
import { InviteSuccessModal } from "@/components/dashboard/team/invite-success-modal";
import { MemberDetailsDrawer } from "@/components/dashboard/team/member-details-drawer";
import { StatsCards } from "@/components/dashboard/team/stats-cards";
import { MembersTable } from "@/components/dashboard/team/members-table";

import mockData from "@/data/mock-data.json";
import { CommonHeader } from "@/components/dashboard/page-header";
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
  const { data, isFetching } = useMyTeamQuery(undefined);
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
      const apiTeams: Team[] = data.results.map((t: any) => ({
        id: String(t.id),
        name: t.name,
        type: "Team" as const,
        avatarBg: t.domain === "artist" ? "bg-sky-500" : "bg-[#F59E0B]",
        avatarChar: t.name.charAt(0).toUpperCase(),
        domain: t.domain
      }));

      // Auto-detect and select a newly created team (which is in apiTeams but not in current teams state)
      if (teams.length > 0 && apiTeams.length > teams.length) {
        const newTeam = apiTeams.find(at => !teams.some(t => t.id === at.id));
        if (newTeam) {
          setSelectedTeamId(newTeam.id);
          localStorage.setItem("active_team_id", newTeam.id);
        }
      }

      // Break infinite loop by comparing content before setting state
      const hasChanged = teams.length !== apiTeams.length ||
        apiTeams.some((at, idx) => teams[idx]?.id !== at.id || teams[idx]?.name !== at.name);
      if (hasChanged) {
        setTeams(apiTeams);
      }

      // Auto-select first team if current selection is invalid
      if (apiTeams.length > 0 && !isFetching) {
        const selectionExists = apiTeams.some(t => t.id === selectedTeamId);
        if (!selectionExists) {
          const activeTeamId = localStorage.getItem("active_team_id");
          const selectId = activeTeamId && apiTeams.some(t => t.id === activeTeamId) ? activeTeamId : apiTeams[0].id;
          setSelectedTeamId(selectId);
          localStorage.setItem("active_team_id", selectId);
        }
      }
    }
  }, [data, selectedTeamId, isFetching, teams]);

  // Team-specific Members Map State
  const [teamMembers, setTeamMembers] = useState<Record<string, Member[]>>({});

  // Sync API members into local teamMembers state
  useEffect(() => {
    if (teamMembersApiData?.results) {
      const apiMembers: Member[] = teamMembersApiData.results.map((m: any) => ({
        id: String(m.id || m.user?.id),
        name: m.user?.name || m.name || m.user?.email?.split("@")[0] || "User",
        email: m.user?.email || m.email || "",
        role: m.role || "Member",
        role_label: m.role_label || m.role || "Member",
        status: m.status
          ? ((m.status.charAt(0).toUpperCase() + m.status.slice(1).toLowerCase()) as Member["status"])
          : "Active",
        avatarBg: m.avatarBg || "bg-indigo-500",
        avatarChar: (m.user?.name || m.name || "U").charAt(0).toUpperCase(),
        memberSince: m.created_at ? new Date(m.created_at).toLocaleDateString() : "Just now",
        lastActive: m.last_active || "Just now",
      }));

      setTeamMembers((prev) => ({
        ...prev,
        [selectedTeamId]: apiMembers
      }));
    }
  }, [teamMembersApiData, selectedTeamId]);

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

      const res = await createTeam(payload).unwrap();
      toast.success("Team created successfully!");
      setIsCreateTeamOpen(false);
      setIsTeamDropdownOpen(false);

      const targetId = res?.id || res?.data?.id;
      if (targetId) {
        const teamId = String(targetId);
        setSelectedTeamId(teamId);
        localStorage.setItem("active_team_id", teamId);
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
      {/* Common Page Header */}
      <CommonHeader
        title="Organization "
        subtitle={
          <>
            Manage members, roles, and permissions for{" "}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#421515] text-[#FF6B6B] border border-[#FF6B6B]/15">
              {activeTeam.name}
            </span>
          </>
        }
        showSearch={false}
        actionButton={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto z-20">
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

            {/* Invite Button */}
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="h-11 px-5 rounded-[12px] bg-[#00AEF0] hover:bg-[#009bde] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-cyan-500/10 hover:scale-[1.01] active:scale-[0.99] w-full sm:w-auto shrink-0"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Invite Member</span>
            </button>
          </div>
        }
      />

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
