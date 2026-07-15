"use client";

import React, { useState, useMemo } from "react";
import { Plus, Bell } from "lucide-react";
import { TeamSwitcher } from "@/components/dashboard/team/team-switcher";
import { CreateTeamModal } from "@/components/dashboard/team/create-team-modal";
import { InviteMemberModal } from "@/components/dashboard/team/invite-member-modal";
import { InviteSuccessModal } from "@/components/dashboard/team/invite-success-modal";
import { MemberDetailsDrawer } from "@/components/dashboard/team/member-details-drawer";
import { StatsCards } from "@/components/dashboard/team/stats-cards";
import { MembersTable } from "@/components/dashboard/team/members-table";

import mockData from "@/data/mock-data.json";

// Types
interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Pending" | "Declined";
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
  // Teams State
  const [teams, setTeams] = useState<Team[]>(
    mockData.teams as Team[]
  );

  const [selectedTeamId, setSelectedTeamId] = useState("2");
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  // Team-specific Members Map State
  const [teamMembers, setTeamMembers] = useState<Record<string, Member[]>>({
    "1": [
      {
        id: "1",
        name: "Ghost Reyes",
        email: "ghost@apexagency.com",
        role: "CEO / GM",
        status: "Active",
        avatarBg: "bg-purple-600",
        avatarChar: "G",
        memberSince: "Jan 12, 2024",
        lastActive: "2 min ago",
        offersInvolved: 142,
        contractsSigned: 38
      }
    ],
    "2": mockData.members as Member[],
    "3": [
      {
        id: "5",
        name: "Lucas Vance",
        email: "lucas@bluewavefest.com",
        role: "CEO / GM",
        status: "Active",
        avatarBg: "bg-teal-500",
        avatarChar: "L",
        memberSince: "Nov 10, 2023",
        lastActive: "Just now",
        offersInvolved: 210,
        contractsSigned: 65
      },
      {
        id: "6",
        name: "Chloe Bennett",
        email: "chloe@bluewavefest.com",
        role: "Marketing Director",
        status: "Active",
        avatarBg: "bg-pink-500",
        avatarChar: "C",
        memberSince: "Dec 01, 2023",
        lastActive: "8 min ago",
        offersInvolved: 43,
        contractsSigned: 12
      },
      {
        id: "7",
        name: "Dylan Smith",
        email: "dylan@bluewavefest.com",
        role: "Talent Buyer",
        status: "Active",
        avatarBg: "bg-indigo-500",
        avatarChar: "D",
        memberSince: "Jan 15, 2024",
        lastActive: "2 hours ago",
        offersInvolved: 88,
        contractsSigned: 30
      },
      {
        id: "8",
        name: "Mia Garcia",
        email: "mia@bluewavefest.com",
        role: "Production Director",
        status: "Pending",
        avatarBg: "bg-emerald-500",
        avatarChar: "M",
        memberSince: "Invite pending",
        lastActive: "Never",
        offersInvolved: 0,
        contractsSigned: 0
      }
    ]
  });

  // Derived Active Members List
  const members = useMemo(() => {
    return teamMembers[selectedTeamId] || [];
  }, [teamMembers, selectedTeamId]);

  // Selected Team
  const activeTeam = useMemo(() => {
    return teams.find((t) => t.id === selectedTeamId) || teams[0];
  }, [teams, selectedTeamId]);

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Invite Form States
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("Talent Buyer");
  const [inviteError, setInviteError] = useState("");

  // Success Invitation States
  const [isInviteSuccessOpen, setIsInviteSuccessOpen] = useState(false);
  const [successInviteEmail, setSuccessInviteEmail] = useState("");
  const [successInviteRole, setSuccessInviteRole] = useState("");
  const [successInviteLink, setSuccessInviteLink] = useState("");

  // Dynamic metric calculations
  const stats = useMemo(() => {
    return {
      total: members.length,
      active: members.filter((m) => m.status === "Active").length,
      pending: members.filter((m) => m.status === "Pending").length,
      declined: members.filter((m) => m.status === "Declined").length,
    };
  }, [members]);

  // Handle Invitation Submit
  const handleInviteSubmit = (e: React.FormEvent) => {
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

    const emailExists = members.some(
      (m) => m.email.toLowerCase() === inviteEmail.toLowerCase()
    );
    if (emailExists) {
      setInviteError("Member with this email already exists");
      return;
    }

    const nameToUse = inviteName.trim() || inviteEmail.split("@")[0];
    const initial = nameToUse.charAt(0).toUpperCase();
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newMember: Member = {
      id: Date.now().toString(),
      name: nameToUse,
      email: inviteEmail.toLowerCase(),
      role: inviteRole,
      status: "Pending",
      avatarBg: randomColor,
      avatarChar: initial,
      memberSince: "Invite pending",
      lastActive: "Never",
      offersInvolved: 0,
      contractsSigned: 0
    };

    setTeamMembers((prev) => ({
      ...prev,
      [selectedTeamId]: [...(prev[selectedTeamId] || []), newMember]
    }));

    setSuccessInviteEmail(inviteEmail.toLowerCase());
    setSuccessInviteRole(inviteRole);
    const randomUuid = Math.random().toString(36).substring(2, 15) + "-" + Math.random().toString(36).substring(2, 15);
    setSuccessInviteLink(`https://getavails.com/invites/${randomUuid}`);
    setInviteEmail("");
    setInviteName("");
    setInviteRole("Talent Buyer");
    setInviteError("");
    setIsInviteModalOpen(false);
    setIsInviteSuccessOpen(true);
  };

  // Create Team Submit
  const handleCreateTeam = (name: string) => {
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-sky-500"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newTeamId = Date.now().toString();
    const newTeam: Team = {
      id: newTeamId,
      name: name.trim(),
      type: "Team",
      avatarBg: randomColor,
      avatarChar: name.trim().charAt(0).toUpperCase(),
    };

    setTeams([...teams, newTeam]);
    setTeamMembers((prev) => ({
      ...prev,
      [newTeamId]: [
        {
          id: "1",
          name: "Ghost Reyes",
          email: "ghost@apexagency.com",
          role: "CEO / GM",
          status: "Active",
          avatarBg: "bg-purple-600",
          avatarChar: "G",
          memberSince: "Jan 12, 2024",
          lastActive: "2 min ago",
          offersInvolved: 142,
          contractsSigned: 38
        }
      ]
    }));

    setSelectedTeamId(newTeamId);
    setIsCreateTeamOpen(false);
    setIsTeamDropdownOpen(false);
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
          const nextStatusMap: Record<string, "Active" | "Pending" | "Declined"> = {
            Active: "Pending",
            Pending: "Declined",
            Declined: "Active",
          };
          return { ...m, status: nextStatusMap[m.status] };
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
            <h2 className="text-2xl md:text-3xl lg:text-[37.07px] lg:leading-[44.48px] font-bold text-white tracking-[0px] animate-fade-in">
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
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        inviteName={inviteName}
        setInviteName={setInviteName}
        inviteRole={inviteRole}
        setInviteRole={setInviteRole}
        inviteError={inviteError}
        onSubmit={handleInviteSubmit}
        roleDetails={ROLE_DETAILS}
        rolesList={ROLES_LIST}
      />

      {/* ─── MEMBER DETAILS RIGHT SLIDE DRAWER ─── */}
      <MemberDetailsDrawer
        selectedMember={selectedMember}
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
