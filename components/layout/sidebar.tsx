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
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Sidebar Menu Array
const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Profile", icon: User, href: "/artist/profile" },
  { name: "Inquiries", icon: FileText, href: "/artist/inquiries" },
  { name: "Offers", icon: Tag, href: "/artist/offers", badge: 5 },
  { name: "Messages", icon: MessageSquare, href: "/artist/messages" },
  { name: "Availability", icon: Calendar, href: "/artist/availability" },
  { name: "Contracts", icon: Briefcase, href: "/artist/contracts" },
  { name: "Payments", icon: CreditCard, href: "/artist/payments" },
  { name: "Tour Schedule", icon: MapPin, href: "/artist/tour-schedule" },
  { name: "Team Management", icon: Users, href: "/dashboard/team-management" },
  { name: "Settings", icon: Settings, href: "/artist/settings" },
];

interface SidebarProps {
  pathname: string;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  unreadCount: number;
  onNotificationsClick: () => void;
  onSignOutClick: () => void;
}

export function Sidebar({
  pathname,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  unreadCount,
  onNotificationsClick,
  onSignOutClick,
}: SidebarProps) {
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
    return menuItems.map((item) => {
      const active = isLinkActive(item.href);
      return (
        <Link
          key={item.name}
          href={item.href}
          onClick={() => {
            if (closeMobile) setIsMobileSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between px-[14px] py-[10px] rounded-lg text-sm font-medium transition-all group h-12 gap-3
            ${active
              ? "text-[#00A5E5] bg-[#00A5E5]/[0.09]"
              : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <item.icon
              size={18}
              className={active ? "text-[#00A5E5]" : "text-gray-500 group-hover:text-white transition-colors"}
            />
            <span>{item.name}</span>
          </div>
          {item.badge && (
            <span className="w-5 h-5 rounded-full bg-[#00A5E5] text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(0,165,229,0.3)]">
              {item.badge}
            </span>
          )}
        </Link>
      );
    });
  };

  const renderFooter = (closeMobile = false) => {
    return (
      <div className="p-4 border-t border-white/5 space-y-4">
        <div className="space-y-1.5">
          <button
            onClick={() => {
              onNotificationsClick();
              if (closeMobile) setIsMobileSidebarOpen(false);
            }}
            className="w-full flex items-center justify-between px-[14px] py-[10px] rounded-lg h-12 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.02] transition-all group"
          >
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-gray-500 group-hover:text-white" />
              <span>Notifications</span>
            </div>
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              onSignOutClick();
              if (closeMobile) setIsMobileSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-[14px] py-[10px] rounded-lg h-12 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/[0.03] transition-all group"
          >
            <LogOut size={18} className="text-gray-500 group-hover:text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="h-px bg-white/5" />

        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#7C5CFF] to-[#9D7CFF] flex items-center justify-center text-white font-bold text-sm border border-white/10 shrink-0">
            NC
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white truncate leading-snug">Nova Collins</span>
            <span className="text-[11px] text-gray-500 font-medium">Artist</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#09090b] border-r border-white/5 h-screen fixed top-0 left-0 z-30 shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <Link href="/" className=" hover:opacity-85 transition-opacity flex items-center gap-3">
            <svg width="37" height="32" viewBox="0 0 37 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M33.3049 26.1478L9.16267 26.3806L18.2056 9.56264L23.1901 18.2399L15.4541 18.0862L13.05 22.6026L31.3047 22.6654L18.2867 0L0 31.6981L36.4528 31.6286L33.3049 26.1478Z" fill="#FEFEFE" />
            </svg>

            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-tight">GetAvails</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Artist Portal</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
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
                  <svg width="37" height="32" viewBox="0 0 37 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M33.3049 26.1478L9.16267 26.3806L18.2056 9.56264L23.1901 18.2399L15.4541 18.0862L13.05 22.6026L31.3047 22.6654L18.2867 0L0 31.6981L36.4528 31.6286L33.3049 26.1478Z" fill="#FEFEFE" />
                  </svg>

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
