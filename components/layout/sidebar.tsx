"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  FileText,
  Tag,
  MessageSquare,
  Calendar,
  Briefcase,
  CreditCard,
  MapPin,
  Users,
  Settings,
  Bell,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpenText,
  ChevronDown,
  Check,
  Plus,
  Search,
  ChevronsUpDown,
  PlusCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "../icon/logo";
import { toast } from "sonner";
import { useMyTeamQuery, useCreateTeamMutation } from "@/redux/feature/team-managementSlice";
import { CreateTeamModal } from "@/components/dashboard/team/create-team-modal";

interface MenuItem {
  name: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: number;
}

// Sidebar Menu Array
const menuItems: MenuItem[] = [
  // { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  // { name: "Profile", icon: User, href: "/artist/profile" },
  // { name: "Inquiries", icon: FileText, href: "/artist/inquiries" },
  // { name: "Offers", icon: Tag, href: "/artist/offers", badge: 5 },
  // { name: "Messages", icon: MessageSquare, href: "/artist/messages" },
  // { name: "Availability", icon: Calendar, href: "/artist/availability" },
  // { name: "Contracts", icon: Briefcase, href: "/artist/contracts" },
  // { name: "Payments", icon: CreditCard, href: "/artist/payments" },
  // { name: "Tour Schedule", icon: MapPin, href: "/artist/tour-schedule" },
  { name: "Explore", icon: Search, href: "/dashboard/explore" },
  { name: "Organization", icon: Users, href: "/dashboard/team-management" },
  { name: "Inquiries", icon: BookOpenText, href: "/dashboard/inquiries" },
  { name: "Offers", icon: Tag, href: "/dashboard/offers" },
  { name: "Messages", icon: MessageSquare, href: "/dashboard/messages" },
  // { name: "Settings", icon: Settings, href: "/artist/settings" },
];

const getImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "https://backend.getavails.com";
  return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

interface Team {
  id: string;
  name: string;
  type: "Personal" | "Team";
  avatarBg: string;
  avatarChar: string;
  domain?: string;
}

interface SidebarProps {
  pathname: string;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  unreadCount: number;
  onNotificationsClick: () => void;
  onSignOutClick: () => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

export function Sidebar({
  pathname,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  unreadCount,
  onNotificationsClick,
  onSignOutClick,
  isCollapsed = false,
  setIsCollapsed,
}: SidebarProps) {
  const [user, setUser] = React.useState<{ name: string; role: string; initials: string; image?: string | null } | null>(null);

  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = React.useState(false);
  const [teamSearchQuery, setTeamSearchQuery] = React.useState("");
  const [isCreateTeamOpen, setIsCreateTeamOpen] = React.useState(false);
  const [selectedTeamId, setSelectedTeamId] = React.useState("");

  // RTK Query for fetching teams and creating teams
  const { data: myTeamData } = useMyTeamQuery(undefined);
  const [createTeam] = useCreateTeamMutation();

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Parse teams from api
  const teams: Team[] = React.useMemo(() => {
    if (!myTeamData?.results) return [];
    return myTeamData.results.map((t: any) => ({
      id: String(t.id),
      name: t.name,
      type: "Team" as const,
      avatarBg: t.domain === "artist" ? "bg-sky-500" : "bg-[#F59E0B]",
      avatarChar: t.name.charAt(0).toUpperCase(),
      domain: t.domain
    }));
  }, [myTeamData]);

  // Load selectedTeamId from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const activeTeamId = localStorage.getItem("active_team_id");
      if (activeTeamId) {
        setSelectedTeamId(activeTeamId);
      }
    }
  }, []);

  // Sync selection if invalid, empty, or not found in teams list
  React.useEffect(() => {
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

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsTeamDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Find active team
  const activeTeam = React.useMemo(() => {
    return (
      teams.find((t) => t.id === selectedTeamId) ||
      teams[0] || {
        id: "",
        name: "Loading...",
        type: "Team" as const,
        avatarBg: "bg-gray-500",
        avatarChar: "?",
      }
    );
  }, [teams, selectedTeamId]);

  const filteredTeams = React.useMemo(() => {
    return teams.filter((t) =>
      t.name.toLowerCase().includes(teamSearchQuery.toLowerCase())
    );
  }, [teams, teamSearchQuery]);

  const handleSelectTeam = (id: string, name: string) => {
    setSelectedTeamId(id);
    localStorage.setItem("active_team_id", id);
    localStorage.setItem("active_team_name", name);
    setIsTeamDropdownOpen(false);

    // Dispatch a custom event and reload window to sync and re-fetch for all components
    window.dispatchEvent(new CustomEvent("activeTeamChanged", { detail: { id, name } }));
    window.location.reload();
  };

  const handleCreateTeamSubmit = async (name: string, domain: "artist" | "venue", role: string) => {
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
        localStorage.setItem("active_team_name", name.trim());
        window.location.reload();
      }
    } catch (err: any) {
      console.error("Error creating team:", err);
      const msg = err?.data?.error?.message || err?.data?.message || err?.message || "Failed to create team. Please try again.";
      toast.error(msg);
    }
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedRole = localStorage.getItem("user_role");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const name = parsed.name || "Nova Collins";
          const role = storedRole || parsed.role || "Artist";
          const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
          const image = parsed.image || null;
          setUser({ name, role, initials, image });
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  // Check if a menu item is active
  const isLinkActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    if (href === "/dashboard/team-management") {
      return pathname.startsWith("/dashboard/team-management");
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const renderNavLinks = (closeMobile = false) => {
    const collapsed = isCollapsed && !closeMobile;
    return menuItems.map((item) => {
      const active = isLinkActive(item.href);
      return (
        <Link
          key={item.name}
          href={item.href}
          onClick={() => {
            if (closeMobile) setIsMobileSidebarOpen(false);
          }}
          className={`w-full flex items-center rounded-lg text-sm font-medium transition-all group h-12 relative
            ${collapsed ? "justify-center px-0" : "justify-between px-[14px] py-[10px] gap-3"}
            ${active
              ? "text-[#00A5E5] bg-[#00A5E5]/[0.09]"
              : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
            }
          `}
        >
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
            <div className="relative flex items-center justify-center shrink-0">
              <item.icon
                size={18}
                className={active ? "text-[#00A5E5]" : "text-gray-500 group-hover:text-white transition-colors"}
              />
              {collapsed && item.badge && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00A5E5] shadow-[0_0_6px_rgba(0,165,229,0.5)]" />
              )}
            </div>
            {!collapsed && <span>{item.name}</span>}
          </div>
          {!collapsed && item.badge && (
            <span className="w-5 h-5 rounded-full bg-[#00A5E5] text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(0,165,229,0.3)]">
              {item.badge}
            </span>
          )}

          {/* Tooltip when collapsed */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#18181b] border border-white/10 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 shadow-lg z-50">
              {item.name}
              {item.badge && (
                <span className="ml-2 inline-flex w-4 h-4 rounded-full bg-[#00A5E5] text-white text-[9px] font-bold items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
          )}
        </Link>
      );
    });
  };

  const renderFooter = (closeMobile = false) => {
    const collapsed = isCollapsed && !closeMobile;
    return (
      <div className="p-4 border-t border-white/5 space-y-4">
        <div className="space-y-1.5">
          <button
            onClick={() => {
              onNotificationsClick();
              if (closeMobile) setIsMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center rounded-lg h-12 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.02] transition-all group relative
              ${collapsed ? "justify-center px-0" : "justify-between px-[14px] py-[10px] gap-3"}
            `}
          >
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              <div className="relative flex items-center justify-center shrink-0">
                <Bell size={18} className="text-gray-500 group-hover:text-white" />
                {collapsed && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
                )}
              </div>
              {!collapsed && <span>Notifications</span>}
            </div>
            {!collapsed && unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                {unreadCount}
              </span>
            )}

            {/* Tooltip when collapsed */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#18181b] border border-white/10 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 shadow-lg z-50">
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </div>
            )}
          </button>

          {/* Settings Button */}
          <Link
            href="/dashboard/settings"
            onClick={() => {
              if (closeMobile) setIsMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center rounded-lg h-12 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.02] transition-all group relative
              ${collapsed ? "justify-center px-0" : "gap-3 px-[14px] py-[10px]"}
            `}
          >
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              <div className="relative flex items-center justify-center shrink-0">
                <Settings size={18} className="text-gray-500 group-hover:text-white" />
              </div>
              {!collapsed && <span>Settings</span>}
            </div>

            {/* Tooltip when collapsed */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#18181b] border border-white/10 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 shadow-lg z-50">
                Settings
              </div>
            )}
          </Link>

          <button
            onClick={() => {
              onSignOutClick();
              if (closeMobile) setIsMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center rounded-lg h-12 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/[0.03] transition-all group relative
              ${collapsed ? "justify-center px-0" : "gap-3 px-[14px] py-[10px]"}
            `}
          >
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              <LogOut size={18} className="text-gray-500 group-hover:text-red-400" />
              {!collapsed && <span>Sign Out</span>}
            </div>

            {/* Tooltip when collapsed */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#18181b] border border-white/10 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 shadow-lg z-50">
                Sign Out
              </div>
            )}
          </button>
        </div>

        <div className="h-px bg-white/5" />

        <div className={`flex items-center relative group ${collapsed ? "justify-center py-1" : "gap-3 px-2 py-1"}`}>
          <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-sm border border-white/10 shrink-0 uppercase ${user && user.image && getImageUrl(user.image) ? "bg-transparent" : "bg-gradient-to-br from-[#7C5CFF] to-[#9D7CFF]"
            }`}>
            {user && user.image && getImageUrl(user.image) ? (
              <img src={getImageUrl(user.image)!} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user ? user.initials : "NC"
            )}
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate leading-snug">{user ? user.name : "Nova Collins"}</span>
              <span className="text-[11px] text-gray-500 font-medium">{user ? user.role : "Artist"}</span>
            </div>
          )}

          {/* Avatar Tooltip when collapsed */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#18181b] border border-white/10 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 shadow-lg z-50">
              <div className="font-bold">{user ? user.name : "Nova Collins"}</div>
              <div className="text-[10px] text-gray-400">{user ? user.role : "Artist"}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden lg:flex flex-col bg-[#09090b] border-r border-white/5 h-screen fixed top-0 left-0 z-30 shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? "w-[76px]" : "w-72"}`}>
        {/* Floating Toggle Button */}
        <button
          onClick={() => setIsCollapsed?.(!isCollapsed)}
          className="absolute top-[28px] -right-3 z-40 hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-[#18181b] border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all shadow-md cursor-pointer hover:scale-105"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        <div
          ref={dropdownRef}
          className={`px-4 flex items-center border-b border-white/5 h-[81px] shrink-0 relative ${isCollapsed ? "justify-center" : ""}`}
        >
          {/* Switcher container */}
          <div className="flex items-center w-full min-w-0">
            <Link href="/" className="hover:opacity-85 transition-opacity shrink-0">
              <Logo />
            </Link>

            {!isCollapsed && (
              <>
                <span className="text-zinc-650 mx-2 text-xl font-extralight select-none">/</span>

                {/* Team Switcher Button */}
                <button
                  onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
                  className="flex items-center gap-2 min-w-0 hover:bg-white/[0.03] px-2.5 py-1.5 rounded-lg transition-all text-left group cursor-pointer select-none border border-transparent hover:border-white/5 flex-1"
                >
                  <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors truncate max-w-[90px]">
                    {activeTeam.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded-full font-medium tracking-wide bg-zinc-950/60 select-none uppercase scale-[0.85] shrink-0">
                    {activeTeam.domain || "Free"}
                  </span>
                  <ChevronsUpDown size={13} className="text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0 ml-auto" />
                </button>
              </>
            )}

            {isCollapsed && (
              <button
                onClick={() => {
                  setIsCollapsed?.(false);
                  setIsTeamDropdownOpen(true);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Switch Workspace"
              />
            )}
          </div>

          {/* Switcher dropdown */}
          <AnimatePresence>
            {isTeamDropdownOpen && !isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.12 }}
                className="absolute left-4 right-4 top-[70px] bg-[#0E0E12] border border-zinc-800 rounded-xl shadow-2xl p-2.5 z-50 select-none animate-in fade-in duration-100"
              >
                <div className="space-y-1.5">
                  <p className="text-[11.5px] text-zinc-400 font-semibold px-2.5 py-1">
                    Organizations
                  </p>
                  <div className="space-y-1">
                    {teams.map((t) => {
                      const isSelected = t.id === selectedTeamId;
                      return (
                        <div
                          key={t.id}
                          onClick={() => handleSelectTeam(t.id, t.name)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all
                            ${isSelected
                              ? "bg-[#1E1E24] border border-zinc-700 text-white"
                              : "border border-transparent hover:bg-white/[0.04] text-zinc-300 hover:text-white"
                            }
                          `}
                        >
                          <span className="text-[13.5px] font-medium truncate">{t.name}</span>
                          {isSelected && (
                            <Check size={14} className="text-zinc-200 shrink-0" strokeWidth={2.5} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-white/5 my-2.5" />

                {/* Create organization Button */}
                <button
                  onClick={() => {
                    setIsCreateTeamOpen(true);
                    setIsTeamDropdownOpen(false);
                  }}
                  className="w-full h-9 rounded-lg hover:bg-white/[0.04] text-[#E4E4E7] hover:text-white text-[13.5px] font-medium flex items-center gap-2.5 px-3 transition-all cursor-pointer select-none"
                >
                  <PlusCircle size={15} strokeWidth={2} className="text-zinc-450" />
                  <span>Create organization</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <nav className={`flex-1 px-4 py-6 space-y-1.5 no-scrollbar ${isCollapsed ? "overflow-visible" : "overflow-y-auto"}`}>
          {renderNavLinks(false)}
        </nav>
        {renderFooter(false)}
      </aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-[1000] flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative flex flex-col w-80 max-w-[85vw] bg-[#09090b] border-r border-white/5 h-full z-10"
            >
              {/* MOBILE DRAWER HEADER SWITCHER */}
              <div className="p-4 flex items-center justify-between border-b border-white/5 relative">
                <div className="flex items-center min-w-0 flex-1">
                  <Logo />
                  <span className="text-zinc-650 mx-2 text-xl font-extralight select-none">/</span>

                  {/* Mobile Team Switcher Button */}
                  <button
                    onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
                    className="flex items-center gap-2 min-w-0 hover:bg-white/[0.03] px-2.5 py-1.5 rounded-lg transition-all text-left group cursor-pointer select-none border border-transparent hover:border-white/5 flex-1"
                  >
                    <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors truncate max-w-[90px]">
                      {activeTeam.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded-full font-medium tracking-wide bg-zinc-950/60 select-none uppercase scale-[0.85] shrink-0">
                      {activeTeam.domain || "Free"}
                    </span>
                    <ChevronsUpDown size={13} className="text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0 ml-auto" />
                  </button>
                </div>

                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white shrink-0 ml-2"
                >
                  <X size={18} />
                </button>

                {/* Mobile Dropdown Panel */}
                <AnimatePresence>
                  {isTeamDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-4 right-4 top-[65px] bg-[#0E0E12] border border-zinc-800 rounded-xl shadow-2xl p-2.5 z-[1100] select-none"
                    >
                      <div className="space-y-1.5">
                        <p className="text-[11.5px] text-zinc-400 font-semibold px-2.5 py-1">
                          Organizations
                        </p>
                        <div className="space-y-1">
                          {teams.map((t) => {
                            const isSelected = t.id === selectedTeamId;
                            return (
                              <div
                                key={t.id}
                                onClick={() => {
                                  handleSelectTeam(t.id, t.name);
                                  setIsMobileSidebarOpen(false);
                                }}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all
                                  ${isSelected
                                    ? "bg-[#1E1E24] border border-zinc-700 text-white"
                                    : "border border-transparent hover:bg-white/[0.04] text-zinc-300 hover:text-white"
                                  }
                                `}
                              >
                                <span className="text-[13.5px] font-medium truncate">{t.name}</span>
                                {isSelected && (
                                  <Check size={14} className="text-zinc-200 shrink-0" strokeWidth={2.5} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="h-px bg-white/5 my-2.5" />

                      {/* Create organization Button */}
                      <button
                        onClick={() => {
                          setIsCreateTeamOpen(true);
                          setIsTeamDropdownOpen(false);
                          setIsMobileSidebarOpen(false);
                        }}
                        className="w-full h-9 rounded-lg hover:bg-white/[0.04] text-[#E4E4E7] hover:text-white text-[13.5px] font-medium flex items-center gap-2.5 px-3 transition-all cursor-pointer select-none"
                      >
                        <PlusCircle size={15} strokeWidth={2} className="text-zinc-450" />
                        <span>Create organization</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
                {renderNavLinks(true)}
              </nav>
              {renderFooter(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
      <CreateTeamModal
        isOpen={isCreateTeamOpen}
        onClose={() => setIsCreateTeamOpen(false)}
        onCreateTeam={handleCreateTeamSubmit}
      />
    </>
  );
}
