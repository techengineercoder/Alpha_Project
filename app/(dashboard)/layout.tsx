"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { NotificationsDrawer } from "@/components/layout/notifications-drawer";
import { ReviewInvitationModal } from "@/components/layout/review-invitation-modal";

import mockData from "@/data/mock-data.json";

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
  };
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Invitation flow states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewStep, setReviewStep] = useState<"details" | "success">("details");
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Notifications State matching the reference design
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    mockData.notifications as NotificationItem[]
  );

  // Derived State: Unread Count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Listen to child page dispatch events to open notifications
  useEffect(() => {
    const handleOpenNotifications = () => {
      setIsNotificationsOpen(true);
    };
    window.addEventListener("open-notifications", handleOpenNotifications);
    return () => {
      window.removeEventListener("open-notifications", handleOpenNotifications);
    };
  }, []);

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, isRead: true }))
    );
  };

  // Click single notification to mark as read
  const handleNotificationClick = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Accept Invitation Flow Trigger
  const handleAcceptInvitation = () => {
    setReviewStep("success");
    setLoadingProgress(0);
  };

  // Simulate dashboard setup loading progress bar
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isReviewModalOpen && reviewStep === "success") {
      timer = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            // Completed load flow
            setTimeout(() => {
              // Mark the invitation read
              setNotifications(
                notifications.map((n) => (n.id === "1" ? { ...n, isRead: true } : n))
              );
              setIsReviewModalOpen(false);
              setReviewStep("details");
              setLoadingProgress(0);
              toast.success("Welcome to Apex Agency! Dashboard successfully set up.");
            }, 300);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isReviewModalOpen, reviewStep, notifications]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex overflow-hidden">
      {/* Sidebar - Desktop and Mobile Drawer */}
      <Sidebar
        pathname={pathname}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        unreadCount={unreadCount}
        onNotificationsClick={() => setIsNotificationsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar lg:pl-72 bg-[#050505] relative">
        {/* Mobile Top Header Bar */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-[#09090b] border-b border-white/5 shrink-0 sticky top-0 z-20">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <svg width="24" height="26" viewBox="0 0 46 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#00A5E5]">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M32.9569 21.7233L20.0412 21.7003L17.8361 26.1268L29.5818 26.1158L31.8116 30.1778L13.6943 30.1943L22.5078 13.3497L26.3062 20.1239H32.0697L22.6059 3.53371L4.59839 35.047L40.5691 35.0429L32.9569 21.7233Z"
                fill="currentColor"
              />
            </svg>
            <span className="font-bold text-sm tracking-tight text-white">Artist Portal</span>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#9D7CFF] flex items-center justify-center text-white text-xs font-bold border border-white/10 relative"
          >
            NC
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-black" />
            )}
          </button>
        </header>

        {/* Dashboard Pages Content */}
        <div className="flex-1 w-full bg-[#050505] relative">
          {children}
        </div>
      </main>

      {/* Notifications Right Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAllRead={handleMarkAllRead}
        onNotificationClick={handleNotificationClick}
        onReviewInvitationClick={() => {
          setIsNotificationsOpen(false);
          setIsReviewModalOpen(true);
          setReviewStep("details");
        }}
      />

      {/* Review Invitation Centered Modals */}
      <ReviewInvitationModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        step={reviewStep}
        loadingProgress={loadingProgress}
        onAccept={handleAcceptInvitation}
      />
    </div>
  );
}
