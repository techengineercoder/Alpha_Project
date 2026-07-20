"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAcceptTeamMemberInvitationMutation } from "@/redux/feature/team-managementSlice";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Check, X, ArrowRight } from "lucide-react";

function InvitationAcceptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [acceptInvitation, { isLoading: isAccepting }] = useAcceptTeamMemberInvitationMutation();
  const [status, setStatus] = useState<"pending" | "accepted" | "declined" | "error">("pending");
  const [errorMsg, setErrorMsg] = useState("");

  // Authentication Guard: Redirect to login/signup if not logged in, preserving path with token parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast.info("Please log in or register to accept the team invitation.");
        const currentPath = window.location.pathname + window.location.search;
        router.push(`/login?next=${encodeURIComponent(currentPath)}`);
      }
    }
  }, [router]);

  const handleAccept = async () => {
    if (!token) {
      toast.error("Invalid or missing invitation token.");
      setErrorMsg("Invitation token is missing.");
      setStatus("error");
      return;
    }

    try {
      const result = await acceptInvitation({ token }).unwrap();
      
      if (result.success || result.id) {
        setStatus("accepted");
        toast.success("Invitation accepted successfully!");
        

        
        // Push to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setErrorMsg("Failed to accept invitation.");
        setStatus("error");
        toast.error("Failed to accept invitation.");
      }
    } catch (err: any) {
      console.error("Accept invitation error:", err);
      const msg = err?.data?.error?.message || err?.data?.message || err?.message || "Failed to accept invitation.";
      setErrorMsg(msg);
      setStatus("error");
      toast.error(msg);
    }
  };

  const handleDecline = () => {
    setStatus("declined");
    toast.info("Invitation declined.");
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#00A5E5]/10 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-purple-600/5 blur-[90px] pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[480px] bg-white/5 border border-white/12 rounded-[28px] p-8 md:p-10 shadow-2xl relative z-10 space-y-6 text-center"
      >
        {status === "pending" && (
          <>
            {/* Top Icon */}
            <div className="flex justify-center">
              <div className="w-[68px] h-[68px] rounded-[20px] bg-[#00A5E5]/10 border border-[#00A5E5]/25 flex items-center justify-center text-[#00A5E5]">
                <Mail size={28} />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
                Team Invitation
              </h2>
              <p className="text-sm text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
                You have been invited to collaborate and join a team on GetAvails.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3.5 pt-4">
              <button
                disabled={isAccepting}
                onClick={handleAccept}
                className="w-full h-12 bg-[#00A5E5] hover:bg-[#00A5E5]/90 disabled:bg-[#00A5E5]/40 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_20px_rgba(0,165,229,0.2)] active:scale-[0.98]"
              >
                {isAccepting ? (
                  <span>Accepting...</span>
                ) : (
                  <>
                    <span>Accept Invitation</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <button
                disabled={isAccepting}
                onClick={handleDecline}
                className="w-full h-12 border border-red-500/35 hover:bg-red-500/10 disabled:bg-transparent text-red-400 hover:text-red-300 font-semibold rounded-xl flex items-center justify-center transition-all cursor-pointer"
              >
                Decline
              </button>
            </div>
          </>
        )}

        {status === "accepted" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 py-4"
          >
            <div className="flex justify-center">
              <div className="w-[68px] h-[68px] rounded-full border-[2.5px] border-[#10B981] flex items-center justify-center text-[#10B981] bg-transparent">
                <Check size={32} strokeWidth={3} />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
                Joined Successfully!
              </h2>
              <p className="text-sm text-gray-400 font-medium">
                You are now a member. Redirecting to your dashboard...
              </p>
            </div>
          </motion.div>
        )}

        {status === "declined" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 py-4"
          >
            <div className="flex justify-center">
              <div className="w-[68px] h-[68px] rounded-full border-[2.5px] border-red-500 flex items-center justify-center text-red-500 bg-transparent">
                <X size={32} strokeWidth={3} />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
                Invitation Declined
              </h2>
              <p className="text-sm text-gray-400 font-medium">
                You declined the invitation. Returning to home page...
              </p>
            </div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <div className="w-[68px] h-[68px] rounded-[20px] bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500">
                <X size={28} />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
                Invitation Error
              </h2>
              <p className="text-sm text-red-400 font-medium leading-relaxed max-w-sm mx-auto">
                {errorMsg || "This invitation is invalid or has expired."}
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => router.push("/")}
                className="w-full h-12 border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white font-semibold rounded-xl flex items-center justify-center transition-all cursor-pointer"
              >
                Go to Home
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-t-[#00A5E5] border-white/10 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-medium">Loading invitation details...</p>
        </div>
      </div>
    }>
      <InvitationAcceptContent />
    </Suspense>
  );
}
