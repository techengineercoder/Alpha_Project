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
  BookOpenText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "../icon/logo";

interface MenuItem {
  name: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: number;
}

// Sidebar Menu Array
const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  // { name: "Profile", icon: User, href: "/artist/profile" },
  // { name: "Inquiries", icon: FileText, href: "/artist/inquiries" },
  // { name: "Offers", icon: Tag, href: "/artist/offers", badge: 5 },
  // { name: "Messages", icon: MessageSquare, href: "/artist/messages" },
  // { name: "Availability", icon: Calendar, href: "/artist/availability" },
  // { name: "Contracts", icon: Briefcase, href: "/artist/contracts" },
  // { name: "Payments", icon: CreditCard, href: "/artist/payments" },
  // { name: "Tour Schedule", icon: MapPin, href: "/artist/tour-schedule" },
  { name: "Team Management", icon: Users, href: "/dashboard/team-management" },
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

        <div className={`p-6 flex items-center border-b border-white/5 h-[81px] shrink-0 ${isCollapsed ? "justify-center" : "gap-3"}`}>
          <Link href="/" className="hover:opacity-85 transition-opacity flex items-center gap-3 shrink-0">
            <Logo />
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <h1 className="text-lg font-bold text-white tracking-tight leading-tight">GetAvails</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Artist Portal</p>
              </motion.div>
            )}
          </Link>
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
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Logo />

                  <div>
                    <h1 className="text-base font-bold text-white tracking-tight leading-tight">GetAvails</h1>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Artist Portal</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
                {renderNavLinks(true)}
              </nav>
              {renderFooter(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
