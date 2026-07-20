"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { NotificationsDrawer } from "@/components/layout/notifications-drawer";
import { ReviewInvitationModal } from "@/components/layout/review-invitation-modal";
import { SignOutModal } from "@/components/layout/sign-out-modal";
import { useMyTeamQuery } from "@/redux/feature/team-managementSlice";

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
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  // Invitation flow states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewStep, setReviewStep] = useState<"details" | "success">("details");
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [userInitials, setUserInitials] = useState("NC");

  const { data: myTeamData, isLoading: isTeamLoading, isSuccess: isTeamSuccess } = useMyTeamQuery(undefined);

  // Redirect to onboarding if teams API results array is empty
  useEffect(() => {
    if (!isTeamLoading && isTeamSuccess && myTeamData) {
      const results = myTeamData?.results || (Array.isArray(myTeamData) ? myTeamData : []);
      if (results.length === 0) {
        router.push("/onboarding");
      }
    }
  }, [myTeamData, isTeamLoading, isTeamSuccess, router]);

  // Load user details for initials
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.name) {
            const initials = parsed.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
            setUserInitials(initials);
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  const handleSignOutConfirm = () => {
    setIsSignOutModalOpen(false);
    toast.success("Successfully signed out.");
    router.push("/login");
  };

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
        onSignOutClick={() => setIsSignOutModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar lg:pl-72 bg-[#050505] relative">
        {/* Mobile Top Header Bar */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-[#09090b] border-b border-white/5 shrink-0 sticky top-0 z-[40]">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <svg width="37" height="32" viewBox="0 0 37 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M33.3049 26.1478L9.16267 26.3806L18.2056 9.56264L23.1901 18.2399L15.4541 18.0862L13.05 22.6026L31.3047 22.6654L18.2867 0L0 31.6981L36.4528 31.6286L33.3049 26.1478Z" fill="#FEFEFE" />
            </svg>

            <span className="font-bold text-sm tracking-tight text-white">Artist Portal</span>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#9D7CFF] flex items-center justify-center text-white text-xs font-bold border border-white/10 relative text-center uppercase"
          >
            {userInitials}
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

      {/* Sign Out Confirmation Modal */}
      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={handleSignOutConfirm}
      />
    </div>
  );
}
