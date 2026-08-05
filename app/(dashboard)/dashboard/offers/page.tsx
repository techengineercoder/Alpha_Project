"use client";

import React, { useState, useMemo } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  Clock,
  Download,
  Plus,
  Search,
  Users,
  X,
  Calendar as CalendarIcon
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { OfferDetailsSidebar } from "@/components/dashboard/offer/OfferDetailsSidebar";
import { CommonHeader } from "@/components/dashboard/page-header";
import { useGetAllOfferQuery, useGetOfferByIdQuery, useShareOfferMutation, useUnshareOfferMutation } from "@/redux/feature/dashboardApi/offerSlice";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAcceptOfferMutation, useRejectOfferMutation, useSignOfferMutation } from "@/redux/feature/team-managementSlice";

interface OfferItem {
  id: string;
  offerId: string;
  artistName: string;
  genre: string;
  agency: string;
  eventDate: string;
  eventTime: string;
  setLength: string;
  stage: string;
  capacity: string;
  fee: string;
  status: "Pending" | "Accepted" | "Rejected";
  flow: "Received" | "Sent";
  timeAgo: string;
  avatarChar: string;
  avatarBg: string;
  type?: string;
}

export default function OffersDashboardPage() {
  const router = useRouter();

  // Offers List State
  const [activeTab, setActiveTab] = useState<"Recent" | "Sent" | "Rejected" | "Shared">("Recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<OfferItem | null>(null);

  // Date Picker States
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  // Dynamic offer details by ID
  const { data: offerListDetails, isLoading: offerListDetailsLoading } = useGetOfferByIdQuery(
    selectedOffer?.id ? parseInt(selectedOffer.id) : 1,
    { skip: !selectedOffer }
  );
  console.log(offerListDetails, "offer list details ===========");

  const [rejectOffer, { isLoading: rejectOfferLoading }] = useRejectOfferMutation();
  const [acceptOffer, { isLoading: acceptOfferLoading }] = useAcceptOfferMutation();
  const [signOffer, { isLoading: signOfferLoading }] = useSignOfferMutation();
  const [shareOffer] = useShareOfferMutation();
  const [unshareOffer] = useUnshareOfferMutation();

  const getErrorMessage = (err: any, fallback: string) => {
    if (err?.data?.error?.message) {
      return err.data.error.message;
    }
    if (err?.data?.message) {
      return err.data.message;
    }
    if (err?.data?.detail) {
      return err.data.detail;
    }
    return fallback;
  };

  const handleAcceptOffer = async (id: string) => {
    try {
      await acceptOffer({ id }).unwrap();
      toast.success("Offer accepted successfully!");
      setSelectedOffer(null);
    } catch (err: any) {
      console.error(err);
      toast.error(getErrorMessage(err, "Failed to accept offer."));
    }
  };

  const handleRejectOffer = async (id: string) => {
    try {
      await rejectOffer({ id }).unwrap();
      toast.success("Offer rejected successfully!");
      setSelectedOffer(null);
    } catch (err: any) {
      console.error(err);
      toast.error(getErrorMessage(err, "Failed to reject offer."));
    }
  };

  const handleSignOffer = async (id: string, body: FormData) => {
    try {
      toast.loading("Uploading signature...", { id: "sign-offer" });
      await signOffer({ id, data: body }).unwrap();
      toast.success("Offer signed successfully!", { id: "sign-offer" });
    } catch (err: any) {
      console.error(err);
      toast.error(getErrorMessage(err, "Failed to upload signature."), { id: "sign-offer" });
    }
  };

  const handleShareOffer = async (id: string, data: any) => {
    try {
      toast.loading("Sharing offer...", { id: "share-action" });
      await shareOffer({ id, data }).unwrap();
      toast.success("Offer shared successfully!", { id: "share-action" });
    } catch (err: any) {
      console.error(err);
      toast.error(getErrorMessage(err, "Failed to share offer."), { id: "share-action" });
    }
  };

  const handleUnshareOffer = async (id: string, data: any) => {
    try {
      toast.loading("Unsharing offer...", { id: "share-action" });
      await unshareOffer({ id, data }).unwrap();
      toast.success("Offer unshared successfully!", { id: "share-action" });
    } catch (err: any) {
      console.error(err);
      toast.error(getErrorMessage(err, "Failed to unshare offer."), { id: "share-action" });
    }
  };

  // Construct query parameters for the API query based on active tab, date filters and search query
  const queryParams = useMemo(() => {
    const params: any = {};

    // 1. Status and sharing parameters
    if (activeTab === "Recent") {
      params.status = "pending";
    } else if (activeTab === "Sent") {
      params.status = "accepted";
    } else if (activeTab === "Rejected") {
      params.status = "rejected";
    } else if (activeTab === "Shared") {
      params.shared_with_me = true;
    }

    // 2. Date Picker params
    if (fromDate) {
      params.date_from = format(fromDate, "yyyy-MM-dd");
    }
    if (toDate) {
      params.date_to = format(toDate, "yyyy-MM-dd");
    }

    // 3. Search query as email param
    if (searchQuery) {
      params.email = searchQuery;
    }

    return params;
  }, [activeTab, fromDate, toDate, searchQuery]);

  // Main offer list query using dynamic parameters
  const { data: allOfferlist, isLoading: allOfferlistLoading } = useGetAllOfferQuery(queryParams);
  console.log(allOfferlist, "offer list    ");

  // Background query to get counts for all tabs
  const { data: countsData } = useGetAllOfferQuery(undefined);

  // Parse API data into UI OfferItem structure
  const parsedOffers = useMemo(() => {
    if (!allOfferlist?.results) return [];

    return allOfferlist.results.map((item: any) => {
      let formattedDate = item.date;
      try {
        if (item.date) {
          formattedDate = format(parseISO(item.date), "MMM dd, yyyy");
        }
      } catch (e) {
        console.error(e);
      }

      let timeAgo = "Just now";
      try {
        if (item.created_at) {
          const created = new Date(item.created_at).getTime();
          const now = new Date().getTime();
          const diffMs = now - created;
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMins / 60);
          const diffDays = Math.floor(diffHours / 24);

          if (diffDays > 0) {
            timeAgo = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
          } else if (diffHours > 0) {
            timeAgo = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
          } else if (diffMins > 0) {
            timeAgo = `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
          }
        }
      } catch (e) {
        console.error(e);
      }

      const statusMap: Record<string, "Pending" | "Accepted" | "Rejected"> = {
        pending: "Pending",
        accepted: "Accepted",
        rejected: "Rejected"
      };

      const artistName = item.artist_name || "Unknown Artist";
      const firstLetter = artistName.charAt(0).toUpperCase() || "A";

      const bgColors = [
        "bg-indigo-950/50 text-indigo-400 border border-indigo-900/30",
        "bg-pink-950/50 text-pink-400 border border-pink-900/30",
        "bg-purple-950/50 text-purple-400 border border-purple-900/30",
        "bg-teal-950/50 text-teal-400 border border-teal-900/30",
        "bg-amber-950/50 text-amber-400 border border-amber-900/30"
      ];
      const colorIndex = artistName.length % bgColors.length;

      return {
        id: String(item.id),
        offerId: `OFF-${String(item.id).padStart(4, "0")}`,
        artistName: artistName,
        genre: "Performance Artist",
        agency: item.sender?.name ? `via ${item.sender.name}` : "via Buyer",
        eventDate: formattedDate,
        eventTime: item.door_time || "N/A",
        setLength: "N/A",
        stage: item.venue || "Main Stage",
        capacity: item.expected_attendance ? Number(item.expected_attendance).toLocaleString() : "N/A",
        fee: item.offer_amount || "0",
        status: statusMap[item.status?.toLowerCase()] || "Pending",
        flow: item.sender?.role === "admin" ? "Sent" : "Received",
        timeAgo: timeAgo,
        avatarChar: firstLetter,
        avatarBg: bgColors[colorIndex],
        type: "Flat Guarantee"
      };
    });
  }, [allOfferlist]);

  // Compute dynamic tab counts based on unfiltered background API data and status mapping
  const counts = useMemo(() => {
    const list = countsData?.results || [];
    const statusMap: Record<string, "Pending" | "Accepted" | "Rejected"> = {
      pending: "Pending",
      accepted: "Accepted",
      rejected: "Rejected"
    };

    const parsed = list.map((item: any) => {
      return {
        status: statusMap[item.status?.toLowerCase()] || "Pending",
        flow: item.sender?.role === "admin" ? "Sent" : "Received",
      };
    });

    return {
      Recent: parsed.filter((o: any) => o.status === "Pending").length,
      Sent: parsed.filter((o: any) => o.status === "Accepted").length,
      Rejected: parsed.filter((o: any) => o.status === "Rejected").length,
      Shared: parsed.filter((o: any) => o.flow === "Received").length
    };
  }, [countsData]);

  // Filtering and sorting offers based on search and sort
  const filteredOffers = useMemo(() => {
    let list = parsedOffers.filter((offer: OfferItem) => {
      // Search matching logic
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          offer.artistName.toLowerCase().includes(query) ||
          offer.genre.toLowerCase().includes(query) ||
          offer.offerId.toLowerCase().includes(query) ||
          offer.agency.toLowerCase().includes(query)
        );
      }
      return true;
    });

    // Default sorting logic (Newest first)
    return [...list].sort((a, b) => {
      return parseInt(b.id) - parseInt(a.id);
    });
  }, [parsedOffers, searchQuery]);

  const handleNotificationsClick = () => {
    window.dispatchEvent(new CustomEvent("open-notifications"));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 lg:p-10 w-full space-y-8 pb-32 font-sans relative">

      {/* Common Page Header */}
      <CommonHeader
        title="Offers"
        subtitle="Manage all incoming and outgoing offers for your venue"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by email"
        actionButton={
          <button
            onClick={() => router.push("/dashboard/offers/create")}
            className="h-11 px-5 rounded-[12px] bg-[#00AEF0] hover:bg-[#009bde] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-cyan-500/10 hover:scale-[1.01] active:scale-[0.99] shrink-0 w-full sm:w-auto"
          >
            <Plus className="h-4.5 w-4.5" />
            New Offer
          </button>
        }
      />

      {/* Filters Row: Tabs on the Left, Date Pickers on the Right */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 w-full">
        {/* Tabs Filter Container (Left Side) */}
        <div className="flex items-center border-[1.24px] border-[#FFFFFF]/8 bg-[#FFFFFF]/[0.02] rounded-[14px] p-[4px] overflow-x-auto no-scrollbar w-full sm:w-auto">
          {[
            { label: "Recent Offers", count: counts.Recent, tabKey: "Recent" },
            { label: "Sent Offers", count: counts.Sent, tabKey: "Sent" },
            { label: "Rejected Offers", count: counts.Rejected, tabKey: "Rejected" },
            { label: "Shared With Me", count: counts.Shared, tabKey: "Shared" }
          ].map((tab) => {
            const isSelected = activeTab === tab.tabKey;
            return (
              <button
                key={tab.tabKey}
                onClick={() => setActiveTab(tab.tabKey as any)}
                className={`flex-1 sm:flex-none flex items-center justify-center h-[46px] sm:h-[62px] px-2 sm:px-7 gap-1.5 sm:gap-2.5 border-b-[2.5px] font-bold text-xs sm:text-sm shrink-0 transition-all cursor-pointer rounded-[10px] ${isSelected
                  ? "border-[#00AEF0] bg-[#00AEF0]/5 text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.01]"
                  }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="inline sm:hidden">{tab.tabKey}</span>
              </button>
            );
          })}
        </div>

        {/* Date Pickers (Right Side) */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* From Date Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-medium">From:</span>
            <Popover>
              <PopoverTrigger>
                <div
                  className="h-10 px-4 rounded-xl border border-zinc-800 bg-[#121214] text-xs text-zinc-300 flex items-center justify-between gap-2 hover:text-white transition-colors cursor-pointer min-w-[130px]"
                >
                  <span>{fromDate ? format(fromDate, "MMM dd, yyyy") : "Select date"}</span>
                  <CalendarIcon className="h-3.5 w-3.5 text-zinc-500" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#0F0F12] border border-white/10 rounded-2xl shadow-2xl" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                  className="bg-[#0F0F12] text-white p-3 rounded-2xl"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* To Date Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-medium">To:</span>
            <Popover>
              <PopoverTrigger>
                <div
                  className="h-10 px-4 rounded-xl border border-zinc-800 bg-[#121214] text-xs text-zinc-300 flex items-center justify-between gap-2 hover:text-white transition-colors cursor-pointer min-w-[130px]"
                >
                  <span>{toDate ? format(toDate, "MMM dd, yyyy") : "Select date"}</span>
                  <CalendarIcon className="h-3.5 w-3.5 text-zinc-500" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#0F0F12] border border-white/10 rounded-2xl shadow-2xl" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  initialFocus
                  className="bg-[#0F0F12] text-white p-3 rounded-2xl"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Reset button (Visible when any date is selected) */}
          {(fromDate || toDate) && (
            <button
              onClick={() => {
                setFromDate(undefined);
                setToDate(undefined);
              }}
              className="h-10 px-4 rounded-xl border border-zinc-800 bg-red-950/20 text-red-500 text-xs font-bold hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Offers list stack */}
      <div className="space-y-4">
        {allOfferlistLoading ? (
          <div className="text-center py-16 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/10">
            Loading offers...
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/10">
            No offers found matching the current selections.
          </div>
        ) : (
          <AnimatePresence>
            {filteredOffers.map((offer) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  borderWidth: "1.24px",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                  backgroundColor: "rgba(255, 255, 255, 0.04)"
                }}
                className="hover:border-zinc-700 transition-all rounded-2xl sm:rounded-[20px] p-4 sm:p-5 md:px-8 md:py-6"
              >
                {/* Mobile & Tablet Card Layout */}
                <div className="flex flex-col gap-3.5 md:hidden">
                  {/* Top Row: Artist details and Status Pill */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-base shrink-0 bg-[#3f2038] border border-[#522d4a]">
                        {offer.avatarChar}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-sm text-white block truncate leading-tight">{offer.artistName}</span>
                        <span className="text-xs text-zinc-500 block mt-1 leading-none">{offer.genre}</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {offer.status === "Pending" && (
                        <span className="px-2.5 py-1 rounded-full text-amber-500 bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold flex items-center gap-1.5 font-sans">
                          ⏳ Pending
                        </span>
                      )}
                      {offer.status === "Accepted" && (
                        <span className="px-2.5 py-1 rounded-full text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1 font-sans">
                          ✓ Accepted
                        </span>
                      )}
                      {offer.status === "Rejected" && (
                        <span className="px-2.5 py-1 rounded-full text-rose-500 bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold flex items-center gap-1 font-sans">
                          ✕ Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-white/5 my-0.5" />

                  {/* Middle Section: 2x2 grid of details */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                    {/* Left Col: Event Info */}
                    <div className="space-y-2.5 border-r border-white/5 pr-2">
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold block">Event Date</span>
                        <span className="font-bold text-zinc-200 block text-xs">{offer.eventDate}</span>
                        <span className="text-zinc-400 block text-[10px]">{offer.eventTime} &bull; {offer.setLength}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold block">Stage</span>
                        <span className="text-zinc-300 font-medium block text-xs truncate">{offer.stage}</span>
                        <span className="text-zinc-500 block text-[10px]">{offer.capacity} capacity</span>
                      </div>
                    </div>

                    {/* Right Col: Price/Id */}
                    <div className="space-y-2.5 pl-2">
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold block">Guarantee Fee</span>
                        <span className="font-bold text-white text-sm block">${parseFloat(offer.fee.replace(/,/g, "")).toLocaleString()}</span>
                        <span className="text-zinc-500 block text-[10px]">ID: {offer.offerId}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold block">Agency / Origin</span>
                        <span className="text-zinc-300 font-medium block text-xs truncate">{offer.agency.replace("via ", "")}</span>
                        <span className="text-zinc-500 block text-[10px]">{offer.flow} &bull; {offer.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 my-0.5" />

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 pt-1 w-full">
                    <button
                      onClick={() => setSelectedOffer(offer)}
                      className="flex-1 h-9 rounded-lg bg-[#00A5E5] hover:bg-[#009bde] text-white font-semibold text-xs flex items-center justify-center cursor-pointer transition-colors shadow-md"
                    >
                      View
                    </button>
                    <button
                      onClick={() => toast.info(`Opening messages with ${offer.artistName}...`)}
                      className="flex-1 h-9 rounded-lg bg-[#1a1a1f] border border-zinc-800 hover:bg-zinc-800/40 text-zinc-300 font-semibold text-xs flex items-center justify-center cursor-pointer transition-colors"
                    >
                      Message
                    </button>

                  </div>
                </div>

                {/* Desktop Grid Layout */}
                <div
                  className="hidden md:grid grid-cols-12 items-start gap-6"
                >

                  {/* 1. Artist Details */}
                  <div className="md:col-span-3 flex items-start gap-4 min-w-0 w-full">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white text-xl shrink-0 bg-[#3f2038] border border-[#522d4a]">
                      {offer.avatarChar}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-lg text-white block truncate leading-tight">{offer.artistName}</span>
                      <span className="text-xs text-zinc-500 block mt-1.5 font-medium leading-none">{offer.genre}</span>
                      <span className="text-xs text-zinc-400 block italic mt-1.5 leading-none">{offer.agency}</span>
                    </div>
                  </div>

                  {/* 2. Logistics Details */}
                  <div className="md:col-span-3 space-y-1 w-full">
                    <span className="text-[10px] text-zinc-500 font-sans tracking-wide uppercase font-semibold block leading-none">{offer.offerId}</span>
                    <span className="text-base font-bold text-white block leading-tight mt-1.5">{offer.eventDate}</span>
                    <span className="text-xs text-zinc-400 block mt-1.5">{offer.eventTime} - {offer.setLength} set</span>
                    <span className="text-xs text-zinc-400 block mt-1.5">{offer.stage}</span>
                    <span className="text-xs text-zinc-550 flex items-center gap-1.5 mt-1.5 leading-none">
                      <Users className="h-3.5 w-3.5 text-zinc-500" />
                      {offer.capacity}
                    </span>
                  </div>

                  {/* 3. Pricing */}
                  <div className="md:col-span-2 space-y-1.5 w-full">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-sans tracking-wide uppercase font-semibold block leading-none">Fee</span>
                      <span className="text-lg font-bold text-white block font-sans mt-1.5 leading-tight">${parseFloat(offer.fee.replace(/,/g, "")).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-sans tracking-wide uppercase font-semibold block leading-none mt-3.5">Type</span>
                      <span className="text-xs text-zinc-400 block mt-1.5 leading-none">{offer.type}</span>
                    </div>
                  </div>

                  {/* 4. Status Badge & Timeline */}
                  <div className="md:col-span-2 space-y-3 w-full">
                    {offer.status === "Pending" && (
                      <span
                        style={{
                          height: "32.38px",
                          borderRadius: "9999px",
                          borderWidth: "1.24px",
                          borderColor: "rgba(245, 158, 11, 0.4)",
                          backgroundColor: "rgba(245, 158, 11, 0.15)",
                          paddingTop: "4.95px",
                          paddingBottom: "4.95px",
                          paddingLeft: "12.38px",
                          paddingRight: "12.38px"
                        }}
                        className="w-full max-w-[256px] text-[#F59E0B] text-xs font-bold flex items-center justify-start gap-1.5 font-sans"
                      >
                        <span className="text-[11px] leading-none">⏳</span>
                        <span>Pending</span>
                      </span>
                    )}
                    {offer.status === "Accepted" && (
                      <span
                        style={{
                          height: "32.38px",
                          borderRadius: "9999px",
                          borderWidth: "1.24px",
                          borderColor: "rgba(16, 185, 129, 0.4)",
                          backgroundColor: "rgba(16, 185, 129, 0.15)",
                          paddingTop: "4.95px",
                          paddingBottom: "4.95px",
                          paddingLeft: "12.38px",
                          paddingRight: "12.38px"
                        }}
                        className="w-full max-w-[256px] text-[#10B981] text-xs font-bold flex items-center justify-start gap-1 font-sans"
                      >
                        <span className="text-sm font-black leading-none">✓</span>
                        <span>Accepted</span>
                      </span>
                    )}
                    {offer.status === "Rejected" && (
                      <span
                        style={{
                          height: "32.38px",
                          borderRadius: "9999px",
                          borderWidth: "1.24px",
                          borderColor: "rgba(239, 68, 68, 0.4)",
                          backgroundColor: "rgba(239, 68, 68, 0.15)",
                          paddingTop: "4.95px",
                          paddingBottom: "4.95px",
                          paddingLeft: "12.38px",
                          paddingRight: "12.38px"
                        }}
                        className="w-full max-w-[256px] text-[#ef4444] text-xs font-bold flex items-center justify-start gap-1 font-sans"
                      >
                        <span className="text-xs font-black leading-none">✕</span>
                        <span>Rejected</span>
                      </span>
                    )}
                    <div className="space-y-1.5 pl-1.5">
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1.5 font-medium leading-none">
                        <span className="text-zinc-600 font-bold text-xs leading-none">↙</span>
                        {offer.flow}
                      </span>
                      <span className="text-[11px] text-zinc-550 flex items-center gap-1.5 font-medium leading-none">
                        <span className="text-zinc-600 font-bold leading-none">🕒</span>
                        {offer.timeAgo}
                      </span>
                    </div>
                  </div>

                  {/* 5. Action Triggers */}
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <button
                      onClick={() => setSelectedOffer(offer)}
                      className="w-full h-[38px] rounded-[10px] bg-[#00A5E5] hover:bg-[#009bde] text-white font-semibold text-xs flex items-center justify-center cursor-pointer transition-colors shadow-md"
                    >
                      View
                    </button>
                    <button
                      onClick={() => toast.info(`Opening messages with ${offer.artistName}...`)}
                      className="w-full h-[38px] rounded-[10px] bg-[#1a1a1f] border border-zinc-800 hover:bg-zinc-800/40 text-zinc-300 font-semibold text-xs flex items-center justify-center cursor-pointer transition-colors"
                    >
                      Message
                    </button>

                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* SLIDE-OVER DETAIL SIDEBAR */}
      <OfferDetailsSidebar
        selectedOffer={selectedOffer}
        offerDetails={offerListDetails}
        isLoading={offerListDetailsLoading}
        onClose={() => setSelectedOffer(null)}
        onAccept={handleAcceptOffer}
        onReject={handleRejectOffer}
        onSign={handleSignOffer}
        onShare={handleShareOffer}
        onUnshare={handleUnshareOffer}
        acceptLoading={acceptOfferLoading}
        rejectLoading={rejectOfferLoading}
        signLoading={signOfferLoading}
      />

    </div>
  );
}
