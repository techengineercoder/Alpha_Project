"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { NotificationsDrawer } from "@/components/layout/notifications-drawer";
import { ReviewInvitationModal } from "@/components/layout/review-invitation-modal";
import { SignOutModal } from "@/components/layout/sign-out-modal";
import { useMyTeamQuery, useAcceptTeamMemberInvitationMutation } from "@/redux/feature/team-managementSlice";
import { LogoLoader } from "@/components/ui/logo-loader";

import {
  useGetNotificationQuery,
  useReadSingleNotificationMutation,
  useReadAllNotificationMutation,
} from "@/redux/feature/dashboardApi/notificationSlice";

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
    token?: string;
  };
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebar_collapsed");
      if (stored === "true") {
        setIsSidebarCollapsed(true);
      }
    }
  }, []);

  const handleToggleSidebar = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
    localStorage.setItem("sidebar_collapsed", collapsed.toString());
  };

  // Invitation flow states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewStep, setReviewStep] = useState<"details" | "success">("details");
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [userInitials, setUserInitials] = useState("NC");

  // Notifications State & Pagination
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedInvitationNotificationId, setSelectedInvitationNotificationId] = useState<string | null>(null);

  const limit = 20;

  // RTK Query for fetching notifications
  const { data: notificationData, isFetching: isNotificationsFetching } = useGetNotificationQuery(
    { limit, offset },
    { skip: false }
  );

  // Mutations
  const [readSingleNotification] = useReadSingleNotificationMutation();
  const [readAllNotification] = useReadAllNotificationMutation();
  const [acceptTeamMemberInvitation] = useAcceptTeamMemberInvitationMutation();

  // Reset offset to 0 when notifications drawer is opened to load page 1 fresh
  useEffect(() => {
    if (isNotificationsOpen) {
      setOffset(0);
    }
  }, [isNotificationsOpen]);

  // Sync API notifications to local state
  useEffect(() => {
    if (notificationData?.results) {
      const mapped = notificationData.results.map((item: any) => {
        let type: NotificationItem["type"] = "message";
        if (item.notification_type) {
          if (item.notification_type.includes("invitation")) {
            type = "invitation";
          } else if (item.notification_type.includes("offer")) {
            type = "offer_accepted";
          } else if (item.notification_type.includes("message")) {
            type = "message";
          } else if (item.notification_type.includes("deposit")) {
            type = "deposit";
          } else if (item.notification_type.includes("contract")) {
            type = "contract";
          }
        }

        let timestamp = "";
        if (item.created_at) {
          try {
            const now = new Date();
            const date = new Date(item.created_at);
            const diffMs = now.getTime() - date.getTime();
            if (!isNaN(diffMs)) {
              const diffMins = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMins / 60);
              const diffDays = Math.floor(diffHours / 24);

              if (diffMins < 1) timestamp = "Just now";
              else if (diffMins < 60) timestamp = `${diffMins}m ago`;
              else if (diffHours < 24) timestamp = `${diffHours}h ago`;
              else if (diffDays < 7) timestamp = `${diffDays}d ago`;
              else timestamp = date.toLocaleDateString();
            }
          } catch (e) {
            // ignore
          }
        }

        const mappedItem: NotificationItem = {
          id: item.id.toString(),
          type,
          title: item.title || "Notification",
          timestamp,
          isRead: !!item.is_read,
          description: item.message || "",
        };

        if (type === "invitation") {
          mappedItem.invitationData = {
            agency: item.data?.team_name || "Team",
            role: item.data?.role || "Member",
            invitedBy: item.data?.invited_by || "Team Admin",
            token: item.data?.token || item.data?.invitation_id?.toString() || "",
          };
        }

        return mappedItem;
      });

      if (offset === 0) {
        setNotifications(mapped);
      } else {
        setNotifications((prev) => {
          const updatedPrev = prev.map((item) => {
            const newItem = mapped.find((n: NotificationItem) => n.id === item.id);
            return newItem ? newItem : item;
          });
          const existingIds = new Set(prev.map((n: NotificationItem) => n.id));
          const newItems = mapped.filter((n: NotificationItem) => !existingIds.has(n.id));
          return [...updatedPrev, ...newItems];
        });
      }

      setHasMore(!!notificationData.next);
    }
  }, [notificationData, offset]);

  const { data: myTeamData, isLoading: isTeamLoading, isSuccess: isTeamSuccess } = useMyTeamQuery(undefined);

  const teamResults = myTeamData?.results || (Array.isArray(myTeamData) ? myTeamData : []);
  const hasNoTeam = isTeamSuccess && teamResults.length === 0;

  // Redirect to onboarding if teams API results array is empty
  useEffect(() => {
    if (!isTeamLoading && isTeamSuccess && teamResults.length === 0) {
      router.push("/onboarding");
    }
  }, [teamResults.length, isTeamLoading, isTeamSuccess, router]);

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
              if (selectedInvitationNotificationId) {
                handleNotificationClick(selectedInvitationNotificationId);
              }
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
  }, [isReviewModalOpen, reviewStep, selectedInvitationNotificationId]);

  // Derived State: Unread Count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSignOutConfirm = () => {
    setIsSignOutModalOpen(false);
    toast.success("Successfully signed out.");
    router.push("/login");
  };

  const handleMarkAllRead = async () => {
    const hasUnread = notifications.some((n) => !n.isRead);
    if (!hasUnread) return;

    // 1. Optimistic update
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
    // 2. Call mutation
    try {
      await readAllNotification(undefined).unwrap();
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
    }
  };

  const handleNotificationClick = async (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (notification?.isRead) return;

    // 1. Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    // 2. Call mutation
    try {
      await readSingleNotification(id).unwrap();
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !isNotificationsFetching) {
      setOffset((prev) => prev + limit);
    }
  };

  const selectedNotification = notifications.find((n) => n.id === selectedInvitationNotificationId);
  const selectedInvitationData = selectedNotification?.invitationData;

  const handleAcceptInvitation = async () => {
    const token = selectedInvitationData?.token;
    if (!token) {
      toast.error("Invitation token not found.");
      return;
    }

    try {
      await acceptTeamMemberInvitation({ token }).unwrap();
      setReviewStep("success");
      setLoadingProgress(0);
    } catch (err: any) {
      console.error("Failed to accept team invitation:", err);
      const msg = err?.data?.error?.message || err?.data?.message || "Failed to accept team invitation.";
      toast.error(msg);
    }
  };

  // Prevent dashboard UI flickering/flashing while checking team status or redirecting (placed AFTER all hooks!)
  if (isTeamLoading || !isTeamSuccess || hasNoTeam) {
    return <LogoLoader fullScreen={true} text="Loading Workspace..." />;
  }

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
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={handleToggleSidebar}
      />

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar bg-[#050505] relative transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "lg:pl-[76px]" : "lg:pl-72"}`}>
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
        onReviewInvitationClick={(notificationId) => {
          setIsNotificationsOpen(false);
          setIsReviewModalOpen(true);
          setReviewStep("details");
          setSelectedInvitationNotificationId(notificationId);
        }}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        isLoadingMore={isNotificationsFetching}
      />

      {/* Review Invitation Centered Modals */}
      <ReviewInvitationModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        step={reviewStep}
        loadingProgress={loadingProgress}
        onAccept={handleAcceptInvitation}
        invitationData={selectedInvitationData}
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
