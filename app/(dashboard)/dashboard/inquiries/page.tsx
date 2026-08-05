"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Mic,
  Calendar,
  MapPin,
  DollarSign,
  Eye,
  Check,
  X
} from "lucide-react";
import { LogoLoader } from "@/components/ui/logo-loader";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CommonHeader } from "@/components/dashboard/page-header";
import { useAcceptInquiryMutation, useGetInquiriesQuery, useGetInquiryDetailsQuery, useRejectInquiryMutation } from "@/redux/feature/dashboardApi/inquirieSlice";
import Link from "next/link";



type FilterStatus = "All" | "Pending" | "Accepted" | "Rejected";

export default function InquiriesPage() {
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const offset = (currentPage - 1) * limit;

  const [activeTab, setActiveTab] = useState<FilterStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [localStatuses, setLocalStatuses] = useState<Record<string | number, string>>({});
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "accept" | "reject";
    id: string | number;
    clientName: string;
  } | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset page on search change
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle active status tab changes
  const handleTabChange = (tab: FilterStatus) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Construct query parameters
  const queryParams = useMemo(() => {
    const params: any = {
      limit,
      offset,
    };

    if (activeTab !== "All") {
      params.status = activeTab.toLowerCase();
    }

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    return params;
  }, [offset, activeTab, debouncedSearch]);

  const { data: inquiriesData, isLoading } = useGetInquiriesQuery(queryParams);
  const { data: inquiryDetailsData, isLoading: inquirieDetailsLoading } = useGetInquiryDetailsQuery(selectedId, {
    skip: !selectedId,
  });

  const [acceptInquiry, { isLoading: acceptInquiryLoading }] = useAcceptInquiryMutation();
  const [rejectInquiry, { isLoading: rejectInquiryLoading }] = useRejectInquiryMutation();

  const inquiries = inquiriesData?.results || [];
  const totalCount = inquiriesData?.count || 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayInquiry = useMemo(() => {
    const raw = inquiryDetailsData?.inquiry || inquiries.find((inq: any) => inq.id === selectedId);
    if (!raw) return null;

    const inqId = raw.uid || `#${raw.id}`;
    const clientName = raw.full_name || raw.sender?.name || "Unknown Client";
    const companyName = raw.sender?.email || "Event Host";
    const artistName = raw.event_title || "Event";
    const eventDate = raw.start_date_time ? new Date(raw.start_date_time).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) : "TBD";
    const location = raw.receiver_email || "N/A";
    const budgetDisplay = raw.budget ? `$${parseFloat(raw.budget).toLocaleString()}` : "TBD";
    const note = raw.additional_notes || raw.note || '';
    const status = localStatuses[raw.id] || raw.status || 'pending';

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
      location,
      budget: budgetDisplay,
      note,
      status,
      avatarChar,
      avatarBg
    };
  }, [inquiryDetailsData, inquiries, selectedId, localStatuses]);

  if (!mounted) {
    return <LogoLoader fullScreen={true} text="Loading Inquiries..." />;
  }

  // Handle Accept
  const handleAccept = (id: string | number, clientName: string) => {
    setConfirmModal({
      isOpen: true,
      type: "accept",
      id,
      clientName
    });
  };

  // Handle Reject
  const handleReject = (id: string | number, clientName: string) => {
    setConfirmModal({
      isOpen: true,
      type: "reject",
      id,
      clientName
    });
  };

  // Handle Confirm action in modal
  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    const { type, id, clientName } = confirmModal;

    try {
      if (type === "accept") {
        await acceptInquiry(id).unwrap();
        setLocalStatuses(prev => ({ ...prev, [id]: "accepted" }));
        toast.success(`Inquiry from ${clientName} accepted successfully!`);
      } else {
        await rejectInquiry(id).unwrap();
        setLocalStatuses(prev => ({ ...prev, [id]: "rejected" }));
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

  // Open Preview Drawer
  const handlePreview = (id: string | number) => {
    setSelectedId(id);
    setIsDrawerOpen(true);
  };

  // Close Drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 lg:p-10 w-full space-y-8 pb-20 font-sans relative overflow-x-hidden">

      {/* Common Page Header */}
      <CommonHeader
        title="Incoming Inquiries"
        subtitle="Manage and respond to booking requests"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* FILTER TABS */}
      <div className="flex overflow-x-auto no-scrollbar py-1">
        <div className="inline-flex p-1 bg-[#121214] border border-zinc-800 rounded-full gap-1">
          {(["All", "Pending", "Accepted", "Rejected"] as FilterStatus[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${isActive
                  ? "bg-[#00aef0] text-white font-bold shadow-md shadow-cyan-500/10"
                  : "text-zinc-400 hover:text-zinc-200"
                  }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* INQUIRIES LIST */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-[#0f0f11]/60 border border-zinc-800/50 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left Section: Avatar & Details Skeleton */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 shrink-0" />
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="h-3 bg-white/5 rounded w-16" />
                      <div className="h-4 bg-white/5 rounded w-12" />
                    </div>
                    <div className="h-5 bg-white/10 rounded w-48" />
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <div className="h-3 bg-white/5 rounded w-20" />
                      <div className="h-3 bg-white/5 rounded w-24" />
                      <div className="h-3 bg-white/5 rounded w-28" />
                    </div>
                  </div>
                </div>

                {/* Right Section: Actions Skeleton */}
                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-stretch sm:justify-start pt-2 sm:pt-0 border-t border-zinc-800/40 sm:border-0">
                  <div className="h-10 flex-1 sm:w-24 sm:flex-initial bg-white/5 rounded-xl animate-pulse" />
                  <div className="h-10 flex-1 sm:w-24 sm:flex-initial bg-white/10 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {inquiries.length > 0 ? (
              inquiries.map((inq: any) => {
                const inqId = inq.uid || `#${inq.id}`;
                const clientName = inq.full_name || inq.sender?.name || "Unknown Client";
                const companyName = inq.sender?.email || "Event Host";
                const artistName = inq.event_title || "Event";
                const eventDate = inq.start_date_time ? new Date(inq.start_date_time).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }) : "TBD";
                const receivedDate = inq.created_at ? `Received ${new Date(inq.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}` : "";
                const currentStatus = localStatuses[inq.id] || inq.status || "pending";
                const statusDisplay = currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1);

                // initials
                const avatarChar = clientName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "UN";
                const bgColors = ["bg-blue-600", "bg-purple-600", "bg-rose-600", "bg-amber-600", "bg-emerald-600", "bg-violet-600"];
                const charSum = avatarChar.charCodeAt(0) + (avatarChar.charCodeAt(1) || 0);
                const avatarBg = bgColors[charSum % bgColors.length];

                return (
                  <motion.div
                    key={inq.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#0f0f11] border border-zinc-800/80 rounded-2xl p-4 md:p-6 transition-all hover:border-zinc-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Left Section: Avatar and Info */}
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto min-w-0">
                      {/* Circle Avatar */}
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full shrink-0 flex items-center justify-center font-bold text-white text-sm sm:text-base shadow-inner ${avatarBg}`}>
                        {avatarChar}
                      </div>

                      {/* Details */}
                      <div className="flex flex-col space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-zinc-500 text-xs font-mono font-medium tracking-wide">
                            {inqId}
                          </span>
                          {/* Status Badge */}
                          <span className={`px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full border ${currentStatus.toLowerCase() === "pending"
                            ? "bg-zinc-800/80 border-zinc-700/50 text-zinc-300"
                            : currentStatus.toLowerCase() === "accepted"
                              ? "bg-emerald-950/40 border-emerald-800/30 text-emerald-500"
                              : "bg-red-950/40 border-red-800/30 text-red-500"
                            }`}>
                            {statusDisplay}
                          </span>
                        </div>

                        <h2 className="text-sm sm:text-base text-zinc-400 truncate">
                          <strong className="font-semibold text-white mr-1">
                            {clientName}
                          </strong>
                          · {companyName}
                        </h2>

                        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3.5 text-xs text-zinc-500 mt-1">
                          <span className="flex items-center gap-1.5">
                            <Mic className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                            <span className="truncate max-w-[120px] sm:max-w-none">{artistName}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                            <span>{eventDate}</span>
                          </span>
                          <span className="text-[11px] text-zinc-600 sm:text-zinc-500">
                            {receivedDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Action Buttons */}
                    <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-stretch sm:justify-start pt-2 sm:pt-0 border-t border-zinc-800/40 sm:border-0">
                      <button
                        onClick={() => handlePreview(inq.id)}
                        className="flex-1 sm:flex-initial h-10 px-4 rounded-xl border border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-300 font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>

                      {(activeTab === "All" || (currentStatus.toLowerCase() !== "accepted" && currentStatus.toLowerCase() !== "rejected")) && (
                        <button
                          onClick={() => handleAccept(inq.id, clientName)}
                          className="flex-1 sm:flex-initial h-10 px-5 rounded-xl bg-[#00aef0] hover:bg-[#009bde] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-cyan-500/10"
                        >
                          <Check className="h-4 w-4" />
                          Accept
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-dashed border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[350px] text-center bg-zinc-950/20"
              >
                <div className="rounded-full bg-zinc-900/80 border border-zinc-800 p-4 mb-4">
                  <FileText className="h-8 w-8 text-zinc-500" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-300">No inquiries found</h3>
                <p className="text-zinc-500 text-sm max-w-sm mt-1">
                  We couldn't find any inquiries matching "{searchQuery}" under {activeTab}.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* PAGINATION CONTROLS */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 mb-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="w-10 h-10 cursor-pointer rounded-xl flex items-center justify-center border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            &larr;
          </button>

          <span className="text-sm text-zinc-400 font-medium px-4">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="w-10 h-10 cursor-pointer rounded-xl flex items-center justify-center border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            &rarr;
          </button>
        </div>
      )}

      {/* INQUIRY DETAILS DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && displayInquiry && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDrawer}
              className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-[99]"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[460px] bg-[#0A0A0A]/95 backdrop-blur-[12px] border-l-[1.24px] border-[#FFFFFF]/12 z-[100] flex flex-col justify-between shadow-2xl h-screen"
            >
              {/* Drawer Header */}
              <div className="p-6 md:p-8 pb-5 border-b border-[#FFFFFF]/12 relative shrink-0">
                <button
                  onClick={handleCloseDrawer}
                  className="absolute top-8 right-6 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors cursor-pointer"
                  aria-label="Close details"
                >
                  <X className="h-5 w-5" />
                </button>

                <span className="text-zinc-500 text-xs font-mono font-medium tracking-wide uppercase mb-1 block">
                  {displayInquiry.inqId}
                </span>
                <h2 className="font-bold text-[24.71px] leading-[37.07px] tracking-normal text-white mt-1">
                  Inquiry Details
                </h2>
              </div>

              {/* Drawer Content Area (Scrollable) */}
              <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6 no-scrollbar">
                {inquirieDetailsLoading ? (
                  <div className="space-y-6 animate-pulse">
                    {/* FROM BOX SKELETON */}
                    <div className="bg-[#161618] border border-[#FFFFFF]/8 rounded-[24px] p-6 flex flex-col space-y-4">
                      <div className="h-3 w-12 bg-white/5 rounded" />
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/5 shrink-0" />
                        <div className="space-y-2 w-32">
                          <div className="h-4 bg-white/10 rounded w-full" />
                          <div className="h-3 bg-white/5 rounded w-3/4" />
                        </div>
                      </div>
                    </div>

                    {/* DETAILS LIST SKELETON */}
                    <div className="space-y-5 px-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3.5">
                          <div className="w-[38px] h-[38px] rounded-full bg-white/5 shrink-0" />
                          <div className="space-y-2">
                            <div className="h-3 bg-white/5 rounded w-16" />
                            <div className="h-4 bg-white/10 rounded w-36" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* NOTE BOX SKELETON */}
                    <div className="bg-[#161618] border border-[#FFFFFF]/8 rounded-[24px] p-6 flex flex-col space-y-4">
                      <div className="h-3 w-12 bg-white/5 rounded" />
                      <div className="space-y-2">
                        <div className="h-3 bg-white/5 rounded w-full" />
                        <div className="h-3 bg-white/5 rounded w-5/6" />
                        <div className="h-3 bg-white/5 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* FROM BOX */}
                    <div className="bg-[#161618] border border-[#FFFFFF]/8 rounded-[24px] p-6 flex flex-col space-y-4">
                      <span className="text-[11px] font-bold text-[#8E8E93] tracking-wider uppercase block">
                        FROM
                      </span>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shadow-inner shrink-0 ${displayInquiry.avatarBg}`}>
                          {displayInquiry.avatarChar}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-base leading-snug">
                            {displayInquiry.clientName}
                          </h4>
                          <p className="text-zinc-400 text-sm mt-0.5 leading-snug">
                            {displayInquiry.companyName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* DETAILS LIST CONTAINER */}
                    <div className="space-y-5 px-1">
                      {/* Artist */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-[38px] h-[38px] rounded-full bg-[#0A1C2A] border border-[#00AEF0]/15 flex items-center justify-center text-[#00AEF0] shrink-0">
                          <Mic className="h-[18px] w-[18px]" />
                        </div>
                        <div className="leading-tight">
                          <span className="text-[12px] text-[#8E8E93] font-medium block">
                            Event Title
                          </span>
                          <span className="text-white text-[16px] font-bold block mt-[2px]">
                            {displayInquiry.artistName}
                          </span>
                        </div>
                      </div>

                      {/* Event Date */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-[38px] h-[38px] rounded-full bg-[#0A1C2A] border border-[#00AEF0]/15 flex items-center justify-center text-[#00AEF0] shrink-0">
                          <Calendar className="h-[18px] w-[18px]" />
                        </div>
                        <div className="leading-tight">
                          <span className="text-[12px] text-[#8E8E93] font-medium block">
                            Event Date
                          </span>
                          <span className="text-white text-[16px] font-bold block mt-[2px]">
                            {displayInquiry.eventDate}
                          </span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-[38px] h-[38px] rounded-full bg-[#0A1C2A] border border-[#00AEF0]/15 flex items-center justify-center text-[#00AEF0] shrink-0">
                          <MapPin className="h-[18px] w-[18px]" />
                        </div>
                        <div className="leading-tight">
                          <span className="text-[12px] text-[#8E8E93] font-medium block">
                            Receiver Email
                          </span>
                          <span className="text-white text-[16px] font-bold block mt-[2px] break-all">
                            {displayInquiry.location}
                          </span>
                        </div>
                      </div>

                      {/* Budget */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-[38px] h-[38px] rounded-full bg-[#0A1C2A] border border-[#00AEF0]/15 flex items-center justify-center text-[#00AEF0] shrink-0">
                          <DollarSign className="h-[18px] w-[18px]" />
                        </div>
                        <div className="leading-tight">
                          <span className="text-[12px] text-[#8E8E93] font-medium block">
                            Budget
                          </span>
                          <span className="text-white text-[16px] font-bold block mt-[2px]">
                            {displayInquiry.budget}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* NOTE BOX */}
                    <div className="bg-[#161618] border border-[#FFFFFF]/8 rounded-[24px] p-6 flex flex-col space-y-4">
                      <span className="text-[11px] font-bold text-[#8E8E93] tracking-wider uppercase block">
                        NOTE
                      </span>
                      <div className="text-[#D1D1D6] text-[15px] leading-relaxed font-normal">
                        {displayInquiry.note}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 md:p-8 border-t border-[#FFFFFF]/12 bg-transparent flex flex-col gap-4 shrink-0">
                <Link href={`/dashboard/offers/create?inquiryId=${displayInquiry.id}`} >
                  <button

                    className="w-full h-10 rounded-[14px] bg-[#00AEF0] hover:bg-[#009bde] text-white font-medium text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/10 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Generate Offer
                  </button>
                </Link>

                {displayInquiry.status.toLowerCase() !== "rejected" && (
                  <button
                    onClick={() => {
                      handleReject(displayInquiry.id, displayInquiry.clientName);
                      handleCloseDrawer();
                    }}
                    className="w-full h-10 rounded-[14px] bg-[#FF3B30] hover:bg-[#E03126] text-white font-medium text-base flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Reject Inquiry
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmModal?.isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !acceptInquiryLoading && !rejectInquiryLoading && setConfirmModal(null)}
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
                    disabled={acceptInquiryLoading || rejectInquiryLoading}
                    onClick={() => setConfirmModal(null)}
                    className="flex-1 py-3.5 rounded-xl bg-[#22222E] border border-white/5 text-white text-sm font-medium hover:bg-[#2A2A35] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={acceptInquiryLoading || rejectInquiryLoading}
                    onClick={handleConfirmAction}
                    className={`flex-1 py-3.5 rounded-xl text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${confirmModal.type === "accept"
                      ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/10"
                      : "bg-[#FF3B30] hover:bg-[#E03126] shadow-red-500/10"
                      }`}
                  >
                    {acceptInquiryLoading || rejectInquiryLoading ? (
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
