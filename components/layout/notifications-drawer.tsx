"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X, Tag, MessageSquare, DollarSign, Briefcase, ArrowRight } from "lucide-react";

interface NotificationItem {
  id: string;
  type: "invitation" | "offer_accepted" | "message" | "deposit" | "contract";
  title: string;
  timestamp: string;
  isRead: boolean;
  description: string;
  invitationData?: {
    agency: string;
    role: string;
    invitedBy: string;
    token?: string;
  };
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onNotificationClick: (id: string) => void;
  onReviewInvitationClick: (id: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export function NotificationsDrawer({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  onMarkAllRead,
  onNotificationClick,
  onReviewInvitationClick,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: NotificationsDrawerProps) {
  // State to track which card is active/expanded
  const [activeCardId, setActiveCardId] = useState<string>("");

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (
      hasMore &&
      !isLoadingMore &&
      container.scrollHeight - container.scrollTop <= container.clientHeight + 50
    ) {
      onLoadMore();
    }
  };

  // Render Custom Icons
  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "invitation":
        return (
          <div className="w-11 h-11 rounded-xl bg-[#162742] border border-[#00A5E5]/20 flex items-center justify-center text-white shrink-0 font-bold text-base select-none">
            A
          </div>
        );
      case "offer_accepted":
        return (
          <div className="w-10 h-10 rounded-full bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 select-none">
            <Tag size={16} />
          </div>
        );
      case "message":
        return (
          <div className="w-10 h-10 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 select-none">
            <MessageSquare size={16} />
          </div>
        );
      case "deposit":
        return (
          <div className="w-10 h-10 rounded-full bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 select-none">
            <DollarSign size={16} />
          </div>
        );
      case "contract":
        return (
          <div className="w-10 h-10 rounded-full bg-amber-950/40 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 select-none">
            <Briefcase size={16} />
          </div>
        );
      default:
        return null;
    }
  };


  const renderNotificationCard = (n: NotificationItem) => {
    const isInv = n.type === "invitation";
    const isActive = n.id === activeCardId;

    return (
      <motion.div
        layout
        key={n.id}
        onClick={() => {
          onNotificationClick(n.id);
          setActiveCardId((prev) => (prev === n.id ? "" : n.id));
        }}
        className={`relative transition-all flex items-start gap-3.5 cursor-pointer select-none
          ${isActive
            ? "bg-[#0E0E11] border-[1.6px] border-l-[4.8px] border-[#00A5E5] rounded-[25.62px] p-[22.42px] mx-6 my-2.5 shadow-[0_0_24px_rgba(0,165,229,0.08)] z-10"
            : "bg-transparent border-b border-white/5 hover:bg-white/[0.01] py-5 px-6"
          }
        `}
      >
        {getNotificationIcon(n.type)}

        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <span className={`font-bold text-white tracking-tight truncate leading-tight ${isActive ? "text-base" : "text-sm"}`}>
                {n.title}
              </span>
              {isActive && (
                <span className="text-xs text-gray-500 font-normal mt-0.5 select-none">
                  {n.timestamp}
                </span>
              )}
            </div>
            {!isActive && (
              <span className="text-[10px] text-gray-500 font-semibold shrink-0 select-none">
                {n.timestamp}
              </span>
            )}
          </div>

          {isInv && n.invitationData ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                You've been invited to join <span className="text-white font-bold">{n.invitationData.agency}</span> as <span className="text-white font-bold">{n.invitationData.role}</span>
              </p>

              <div className="flex items-center gap-2 mt-2 select-none">
                <div className="w-5 h-5 rounded-full bg-[#1E3E62] flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                  {n.invitationData.invitedBy.charAt(0)}
                </div>
                <span className="text-sm text-gray-400 font-medium">Invited by {n.invitationData.invitedBy}</span>
              </div>

              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="overflow-hidden"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReviewInvitationClick(n.id);
                      }}
                      className="bg-[#00A5E5] hover:bg-[#00A5E5]/90 text-white font-semibold w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_16px_rgba(0,165,229,0.15)] cursor-pointer"
                    >
                      <span>Review Invitation</span>
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                {n.description}
              </p>
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="overflow-hidden"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReviewInvitationClick(n.id);
                      }}
                      className="bg-[#00A5E5] hover:bg-[#00A5E5]/90 text-white font-semibold w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_16px_rgba(0,165,229,0.15)] cursor-pointer"
                    >
                      <span>Review Invitation</span>
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {!n.isRead && (
          <span className={`absolute top-6 right-6 w-2 h-2 rounded-full ${isActive ? "bg-[#00A5E5]" : "bg-[#EF4444]"}`} />
        )}
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 240 }}
            className="relative w-full max-w-[460px] bg-[#09090b] border-l border-white/5 h-full z-10 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between shrink-0 px-6 py-5">
              <div className="flex items-center gap-2.5">
                <Bell size={18} className="text-[#00A5E5]" />
                <h3 className="font-bold text-lg text-white leading-tight">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center shrink-0 ml-1.5 select-none">
                    {unreadCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={onMarkAllRead}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors cursor-pointer select-none font-bold"
                >
                  <Check size={12} strokeWidth={3} />
                  <span>Mark all read</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[#131316] border border-white/5 text-gray-400 hover:text-white transition-all hover:bg-[#18181F] cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="h-px bg-white/5 shrink-0" />

            {/* Scroll list */}
            <div
              className="flex-1 overflow-y-auto no-scrollbar"
              onScroll={handleScroll}
            >
              {notifications.map((n) => renderNotificationCard(n))}

              {isLoadingMore && (
                <div className="py-4 flex justify-center items-center select-none shrink-0">
                  <div className="w-5 h-5 border-2 border-t-transparent border-[#00A5E5] rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="h-px bg-white/5 shrink-0" />
            <div className="py-4.5 flex items-center justify-center shrink-0 bg-[#09090b]">
              <button className="text-xs text-gray-500 hover:text-white transition-colors select-none font-semibold cursor-pointer">
                View notification settings
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
