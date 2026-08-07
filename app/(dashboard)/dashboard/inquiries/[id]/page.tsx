"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Mic,
  Calendar,
  MapPin,
  DollarSign,
  Check,
  X,
  Mail,
  Phone,
  Clock,
  Users
} from "lucide-react";
import { toast } from "sonner";
import { LogoLoader } from "@/components/ui/logo-loader";
import { useGetInquiryDetailsQuery, useAcceptInquiryMutation, useRejectInquiryMutation } from "@/redux/feature/dashboardApi/inquirieSlice";
import { useMyTeamQuery } from "@/redux/feature/team-managementSlice";
import { motion, AnimatePresence } from "framer-motion";

export default function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);

  const [mounted, setMounted] = useState(false);
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "accept" | "reject";
    id: string | number;
    clientName: string;
  } | null>(null);

  const { data: teamData } = useMyTeamQuery(undefined);
  const { data: inquiryData, isLoading, error } = useGetInquiryDetailsQuery(id);
  const [acceptInquiry, { isLoading: acceptLoading }] = useAcceptInquiryMutation();
  const [rejectInquiry, { isLoading: rejectLoading }] = useRejectInquiryMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTeamId = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("active_team_id");
    }
    return null;
  }, [mounted]);

  const activeTeam = useMemo(() => {
    if (!teamData?.results || !activeTeamId) return null;
    return teamData.results.find((t: any) => String(t.id) === String(activeTeamId));
  }, [teamData, activeTeamId]);

  const displayInquiry = useMemo(() => {
    if (!inquiryData?.inquiry) return null;
    const raw = inquiryData.inquiry;

    const inqId = raw.uid || `#${raw.id}`;
    const isArtist = activeTeam?.domain === "artist";
    const clientName = isArtist 
      ? (raw.receiver?.name || raw.receiver_email || "Unknown Recipient") 
      : (raw.full_name || raw.sender?.name || "Unknown Client");
    const companyName = isArtist 
      ? (raw.receiver?.email || raw.receiver_email || "") 
      : (raw.sender?.email || "Event Host");
    const artistName = raw.event_title || "Event";
    const eventDate = raw.start_date_time ? new Date(raw.start_date_time).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) : "TBD";
    const formattedDateTime = raw.start_date_time ? new Date(raw.start_date_time).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) : "TBD";
    const location = raw.receiver_email || "N/A";
    const budgetDisplay = raw.budget ? `$${parseFloat(raw.budget).toLocaleString()}` : "TBD";
    const note = raw.additional_notes || raw.note || '';
    const status = localStatus || raw.status || 'pending';
    const expectedAttendance = raw.expected_attendance || null;
    const phoneNumber = raw.phone_number || (isArtist ? raw.receiver?.phone : raw.sender?.phone) || null;
    const rawEmail = isArtist ? (raw.receiver?.email || raw.receiver_email) : (raw.sender?.email || raw.email);

    // Profile photo logic
    const getImageUrl = (imagePath?: string | null) => {
      if (!imagePath) return null;
      if (imagePath.startsWith("http")) return imagePath;
      const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "https://backend.getavails.com";
      return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
    };
    const avatarUrl = isArtist 
      ? getImageUrl(raw.receiver?.image) 
      : getImageUrl(raw.sender?.image);

    // initials
    const avatarChar = clientName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "UN";
    const bgColors = ["bg-blue-600", "bg-purple-600", "bg-rose-600", "bg-amber-600", "bg-emerald-600", "bg-violet-600"];
    const charSum = avatarChar.charCodeAt(0) + (avatarChar.charCodeAt(1) || 0);
    const avatarBg = bgColors[charSum % bgColors.length];

    return {
      id: raw.id,
      inqId,
      clientName,
      companyName,
      artistName,
      eventDate,
      formattedDateTime,
      location,
      budget: budgetDisplay,
      note,
      status,
      avatarChar,
      avatarBg,
      avatarUrl,
      expectedAttendance,
      phoneNumber,
      rawEmail,
      isArtist
    };
  }, [inquiryData, activeTeam, localStatus]);

  const handleAccept = () => {
    if (!displayInquiry) return;
    setConfirmModal({
      isOpen: true,
      type: "accept",
      id: displayInquiry.id,
      clientName: displayInquiry.clientName
    });
  };

  const handleReject = () => {
    if (!displayInquiry) return;
    setConfirmModal({
      isOpen: true,
      type: "reject",
      id: displayInquiry.id,
      clientName: displayInquiry.clientName
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal || !displayInquiry) return;
    const { type, id, clientName } = confirmModal;

    try {
      if (type === "accept") {
        await acceptInquiry(id).unwrap();
        setLocalStatus("accepted");
        toast.success(`Inquiry from ${clientName} accepted successfully!`);
      } else {
        await rejectInquiry(id).unwrap();
        setLocalStatus("rejected");
        toast.success(`Inquiry from ${clientName} declined successfully.`);
      }
      setConfirmModal(null);
    } catch (error: any) {
      const errorData = error?.data?.error;
      let errorMessage = `Failed to ${type} inquiry.`;

      if (errorData?.details) {
        const firstErrorKey = Object.keys(errorData.details)[0];
        const firstErrorValue = errorData.details[firstErrorKey];
        const errorText = Array.isArray(firstErrorValue) ? firstErrorValue[0] : firstErrorValue;
        errorMessage = firstErrorKey === 'detail' ? errorText : `${firstErrorKey}: ${errorText}`;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (typeof error?.data?.message === 'string') {
        errorMessage = error.data.message;
      }
      toast.error(errorMessage);
    }
  };

  if (!mounted || isLoading) {
    return <LogoLoader fullScreen={true} text="Loading Inquiry Details..." />;
  }

  if (error || !displayInquiry) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-bold text-red-500 mb-2">Inquiry Not Found</h2>
        <p className="text-zinc-400 mb-6">We couldn't retrieve the details for this inquiry.</p>
        <Link href="/dashboard/inquiries">
          <button className="h-10 px-5 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800/80 transition-all cursor-pointer">
            Back to Inquiries
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 lg:p-10 w-full space-y-8 pb-32 font-sans relative">
      {/* Top Navigation Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/inquiries">
            <button className="w-10 h-10 rounded-xl border border-zinc-800 bg-[#121214] flex items-center justify-center hover:bg-zinc-850 hover:border-zinc-700 transition-all cursor-pointer">
              <ChevronLeft size={20} className="text-zinc-300" />
            </button>
          </Link>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 text-xs font-mono font-semibold tracking-wider uppercase bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded select-none">
                {displayInquiry.inqId}
              </span>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                displayInquiry.status.toLowerCase() === "pending"
                  ? "bg-amber-500/10 border-amber-500/25 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.08)]"
                  : displayInquiry.status.toLowerCase() === "accepted"
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.08)]"
                    : "bg-rose-500/10 border-rose-500/25 text-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.08)]"
              }`}>
                {displayInquiry.status}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              Inquiry: {displayInquiry.artistName}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Main Details) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* EVENT INFORMATION CARD */}
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-6 md:p-8 space-y-6">
            <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block border-b border-zinc-800/60 pb-3">
              EVENT INFORMATION
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Title */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-center text-[#00AEF0] shrink-0">
                  <Mic size={18} />
                </div>
                <div className="leading-tight">
                  <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">
                    Event Title / Artist
                  </span>
                  <span className="text-white text-lg font-bold block mt-1">
                    {displayInquiry.artistName}
                  </span>
                </div>
              </div>

              {/* Event Date & Time */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-center text-[#00AEF0] shrink-0">
                  <Clock size={18} />
                </div>
                <div className="leading-tight">
                  <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">
                    Date & Time
                  </span>
                  <span className="text-white text-base font-semibold block mt-1">
                    {displayInquiry.formattedDateTime}
                  </span>
                </div>
              </div>

              {/* Recipient email or location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-center text-[#00AEF0] shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="leading-tight">
                  <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">
                    Recipient Email
                  </span>
                  <span className="text-white text-base font-semibold block mt-1 break-all">
                    {displayInquiry.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ADDITIONAL NOTES NOTEBOX */}
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-6 md:p-8">
            <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block mb-4">
              ADDITIONAL NOTES
            </span>
            {displayInquiry.note ? (
              <div className="text-zinc-300 text-base leading-relaxed border-l-2 border-[#00AEF0] pl-4 py-1 italic bg-zinc-900/20 rounded-r-2xl">
                "{displayInquiry.note}"
              </div>
            ) : (
              <span className="text-zinc-600 text-sm italic block">No additional notes provided.</span>
            )}
          </div>

          {/* STICKY ACTION BUTTONS FOR VENUE */}
          {activeTeam?.domain === "venue" && (
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href={`/dashboard/offers/create?inquiryId=${displayInquiry.id}`} className="flex-1">
                <button
                  className="w-full h-12 rounded-xl bg-[#00AEF0] hover:bg-[#009bde] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/10 hover:scale-[1.01] active:scale-[0.99]"
                >
                  Generate Offer
                </button>
              </Link>
              
              {displayInquiry.status.toLowerCase() === "pending" && (
                <button
                  onClick={handleAccept}
                  disabled={acceptLoading}
                  className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  <Check size={16} />
                  Accept Inquiry
                </button>
              )}

              {displayInquiry.status.toLowerCase() !== "rejected" && (
                <button
                  onClick={handleReject}
                  disabled={rejectLoading}
                  className="flex-1 h-12 rounded-xl bg-transparent hover:bg-rose-500/10 text-rose-500 border border-rose-500/20 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  Reject Inquiry
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column (Sidebar Metrics & Sender/Recipient Info) */}
        <div className="lg:col-span-4 space-y-6">
          {/* TOP METRICS (Budget & Attendance) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Budget Card */}
            <div className="relative overflow-hidden bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700/60 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#00AEF0]/10 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                OFFER BUDGET
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  {displayInquiry.budget}
                </span>
              </div>
            </div>

            {/* Attendance Card */}
            <div className="relative overflow-hidden bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700/60 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                ATTENDANCE
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  {displayInquiry.expectedAttendance || "TBD"}
                </span>
                {displayInquiry.expectedAttendance && (
                  <span className="text-zinc-550 text-xs font-semibold">guests</span>
                )}
              </div>
            </div>
          </div>

          {/* PROFILE (FROM / TO) CARD */}
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-6 hover:border-zinc-800 transition-all duration-300">
            <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block mb-4">
              {displayInquiry.isArtist ? "RECIPIENT DETAILS" : "SENDER DETAILS"}
            </span>
            
            <div className="flex items-center gap-4">
              {/* Avatar Picture or Initials */}
              {displayInquiry.avatarUrl ? (
                <div className="w-14 h-14 rounded-full overflow-hidden border border-zinc-700/50 shrink-0 bg-zinc-950 flex items-center justify-center">
                  <img 
                    src={displayInquiry.avatarUrl} 
                    alt={displayInquiry.clientName} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-base shadow-inner shrink-0 ${displayInquiry.avatarBg}`}>
                  {displayInquiry.avatarChar}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-white text-base leading-snug truncate">
                  {displayInquiry.clientName}
                </h4>
                <p className="text-zinc-400 text-xs mt-0.5 leading-snug truncate font-mono">
                  {displayInquiry.companyName}
                </p>
              </div>
            </div>

            {/* Contact Details List */}
            <div className="mt-5 pt-5 border-t border-zinc-800/60 space-y-3">
              {displayInquiry.rawEmail && (
                <div className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors">
                  <Mail size={16} className="text-zinc-500" />
                  <a href={`mailto:${displayInquiry.rawEmail}`} className="truncate hover:underline">
                    {displayInquiry.rawEmail}
                  </a>
                </div>
              )}
              {displayInquiry.phoneNumber && (
                <div className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors">
                  <Phone size={16} className="text-zinc-500" />
                  <a href={`tel:${displayInquiry.phoneNumber}`} className="hover:underline">
                    {displayInquiry.phoneNumber}
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmModal?.isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !acceptLoading && !rejectLoading && setConfirmModal(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110]"
            />

            {/* Modal Box */}
            <div className="fixed inset-0 z-[111] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md bg-[#121218] border border-white/10 rounded-[20px] p-6 shadow-2xl flex flex-col items-center text-center"
              >
                {/* Dynamic Icon */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${confirmModal.type === "accept"
                  ? "bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                  : "bg-red-950/40 border border-red-800/30 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                  }`}>
                  {confirmModal.type === "accept" ? (
                    <Check className="w-7 h-7" />
                  ) : (
                    <X className="w-7 h-7" />
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 font-sans">
                  {confirmModal.type === "accept" ? "Accept Inquiry?" : "Decline Inquiry?"}
                </h3>

                <p className="text-zinc-400 text-sm mb-6 max-w-xs leading-relaxed">
                  Are you sure you want to {confirmModal.type === "accept" ? "accept" : "decline"} the booking inquiry from <span className="text-white font-semibold">{confirmModal.clientName}</span>? This action cannot be undone.
                </p>

                {/* Footer buttons */}
                <div className="flex w-full gap-4">
                  <button
                    disabled={acceptLoading || rejectLoading}
                    onClick={() => setConfirmModal(null)}
                    className="flex-1 py-3.5 rounded-xl bg-[#22222E] border border-white/5 text-white text-sm font-medium hover:bg-[#2A2A35] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={acceptLoading || rejectLoading}
                    onClick={handleConfirmAction}
                    className={`flex-1 py-3.5 rounded-xl text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${confirmModal.type === "accept"
                      ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/10"
                      : "bg-[#FF3B30] hover:bg-[#E03126] shadow-red-500/10"
                      }`}
                  >
                    {acceptLoading || rejectLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : confirmModal.type === "accept" ? (
                      "Confirm Accept"
                    ) : (
                      "Confirm Decline"
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
