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
  X
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { OfferDetailsSidebar } from "@/components/dashboard/offer/OfferDetailsSidebar";
import { CommonHeader } from "@/components/dashboard/page-header";

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

// Initial Mock Offers Data matching the user's screenshot
const INITIAL_OFFERS: OfferItem[] = [
  {
    id: "1",
    offerId: "OFF-0042",
    artistName: "Nova Reyes",
    genre: "Latin Pop",
    agency: "via Apex Agency",
    eventDate: "Aug 14, 2026",
    eventTime: "9:00 PM",
    setLength: "75 min",
    stage: "Main Stage",
    capacity: "8,000",
    fee: "18,000",
    status: "Pending",
    flow: "Received",
    timeAgo: "2 hours ago",
    avatarChar: "N",
    avatarBg: "bg-indigo-950/50 text-indigo-400 border border-indigo-900/30"
  },
  {
    id: "2",
    offerId: "OFF-0041",
    artistName: "Flock of Seagulls",
    genre: "New Wave",
    agency: "via WME Agency",
    eventDate: "Aug 21, 2026",
    eventTime: "8:00 PM",
    setLength: "60 min",
    stage: "Main Stage",
    capacity: "5,000",
    fee: "12,500",
    status: "Accepted",
    flow: "Received",
    timeAgo: "5 hours ago",
    avatarChar: "F",
    avatarBg: "bg-pink-950/50 text-pink-400 border border-pink-900/30"
  },
  {
    id: "3",
    offerId: "OFF-0040",
    artistName: "The Midnight",
    genre: "Synthwave",
    agency: "via WME Agency",
    eventDate: "Sep 05, 2026",
    eventTime: "10:00 PM",
    setLength: "90 min",
    stage: "Sunset Stage",
    capacity: "6,000",
    fee: "15,000",
    status: "Pending",
    flow: "Sent",
    timeAgo: "1 day ago",
    avatarChar: "T",
    avatarBg: "bg-purple-950/50 text-purple-400 border border-purple-900/30"
  },
  {
    id: "4",
    offerId: "OFF-0039",
    artistName: "Gunship",
    genre: "Retro Electro",
    agency: "via Apex Agency",
    eventDate: "Sep 12, 2026",
    eventTime: "9:30 PM",
    setLength: "75 min",
    stage: "Main Stage",
    capacity: "8,000",
    fee: "20,000",
    status: "Rejected",
    flow: "Received",
    timeAgo: "3 days ago",
    avatarChar: "G",
    avatarBg: "bg-teal-950/50 text-teal-400 border border-teal-900/30"
  }
];

export default function OffersDashboardPage() {
  const router = useRouter();
  
  // Offers List State
  const [offersList] = useState<OfferItem[]>(INITIAL_OFFERS);
  const [activeTab, setActiveTab] = useState<"Recent" | "Sent" | "Rejected" | "Shared">("Recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<OfferItem | null>(null);

  // Time & Sort Filter States
  const [timeFilter, setTimeFilter] = useState<"Today" | "This Week" | "All Time">("All Time");
  const [sortFilter, setSortFilter] = useState<"Newest" | "Oldest" | "Highest Fee" | "Lowest Fee">("Newest");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const handleToggleTime = () => {
    setShowTimeDropdown(!showTimeDropdown);
    setShowSortDropdown(false);
  };

  const handleToggleSort = () => {
    setShowSortDropdown(!showSortDropdown);
    setShowTimeDropdown(false);
  };

  // Close dropdowns on outside clicks
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-trigger")) {
        setShowTimeDropdown(false);
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Filtering and sorting offers based on tab, time, search and sort
  const filteredOffers = useMemo(() => {
    let list = offersList.filter(offer => {
      // Tab matching logic
      if (activeTab === "Sent" && offer.flow !== "Sent") return false;
      if (activeTab === "Rejected" && offer.status !== "Rejected") return false;
      if (activeTab === "Shared" && offer.id === "4") return false; // simple filter simulation

      // Time matching logic
      if (timeFilter === "Today") {
        return offer.timeAgo.includes("hours");
      }
      if (timeFilter === "This Week") {
        return offer.timeAgo.includes("hours") || offer.timeAgo.includes("day");
      }

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

    // Sorting logic
    return [...list].sort((a, b) => {
      if (sortFilter === "Newest") {
        return parseInt(b.id) - parseInt(a.id);
      }
      if (sortFilter === "Oldest") {
        return parseInt(a.id) - parseInt(b.id);
      }
      if (sortFilter === "Highest Fee") {
        const feeA = parseFloat(a.fee.replace(/,/g, ""));
        const feeB = parseFloat(b.fee.replace(/,/g, ""));
        return feeB - feeA;
      }
      if (sortFilter === "Lowest Fee") {
        const feeA = parseFloat(a.fee.replace(/,/g, ""));
        const feeB = parseFloat(b.fee.replace(/,/g, ""));
        return feeA - feeB;
      }
      return 0;
    });
  }, [offersList, activeTab, timeFilter, sortFilter, searchQuery]);

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

      {/* Tabs Filter Container */}
      <div className="flex items-center border-[1.24px] border-[#FFFFFF]/8 bg-[#FFFFFF]/[0.02] rounded-[14px] p-[4px] overflow-x-auto no-scrollbar w-full">
        {[
          { label: "Recent Offers", count: 24, tabKey: "Recent" },
          { label: "Sent Offers", count: 9, tabKey: "Sent" },
          { label: "Rejected Offers", count: 6, tabKey: "Rejected" },
          { label: "Shared With Me", count: 12, tabKey: "Shared" }
        ].map((tab) => {
          const isSelected = activeTab === tab.tabKey;
          return (
            <button
              key={tab.tabKey}
              onClick={() => setActiveTab(tab.tabKey as any)}
              className={`flex-1 sm:flex-none flex items-center justify-center h-[46px] sm:h-[62px] px-2 sm:px-7 gap-1.5 sm:gap-2.5 border-b-[2.5px] font-bold text-xs sm:text-sm shrink-0 transition-all cursor-pointer rounded-[10px] ${
                isSelected 
                  ? "border-[#00AEF0] bg-[#00AEF0]/5 text-white" 
                  : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.01]"
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="inline sm:hidden">{tab.tabKey}</span>
              <span 
                className={`text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 rounded-full font-bold transition-all ${
                  isSelected 
                    ? "bg-[#00AEF0] text-black" 
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Filter options row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Time Filter Dropdown */}
          <div className="relative dropdown-trigger flex-1 sm:flex-initial">
            <button 
              onClick={handleToggleTime}
              className="w-full h-10 px-4 rounded-xl border border-zinc-800 bg-[#121214] text-xs text-zinc-300 flex items-center justify-center gap-2 hover:text-white transition-colors cursor-pointer"
            >
              <span>{timeFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
            </button>

            <AnimatePresence>
              {showTimeDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 mt-2 w-40 rounded-xl bg-[#121214] border border-zinc-800 shadow-2xl py-1.5 z-50 overflow-hidden"
                >
                  {(["All Time", "Today", "This Week"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setTimeFilter(opt);
                        setShowTimeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors ${
                        timeFilter === opt 
                          ? "text-[#00AEF0] bg-white/[0.02]" 
                          : "text-zinc-400 hover:text-white hover:bg-white/[0.01]"
                      }`}
                    >
                      <span>{opt}</span>
                      {timeFilter === opt && <Check className="h-3 w-3 text-[#00AEF0]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sort Filter Dropdown */}
          <div className="relative dropdown-trigger flex-1 sm:flex-initial">
            <button 
              onClick={handleToggleSort}
              className="w-full h-10 px-4 rounded-xl border border-zinc-800 bg-[#121214] text-xs text-zinc-300 flex items-center justify-center gap-2 hover:text-white transition-colors cursor-pointer"
            >
              <span>{sortFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
            </button>

            <AnimatePresence>
              {showSortDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-44 rounded-xl bg-[#121214] border border-zinc-800 shadow-2xl py-1.5 z-50 overflow-hidden"
                >
                  {(["Newest", "Oldest", "Highest Fee", "Lowest Fee"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSortFilter(opt);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors ${
                        sortFilter === opt 
                          ? "text-[#00AEF0] bg-white/[0.02]" 
                          : "text-zinc-400 hover:text-white hover:bg-white/[0.01]"
                      }`}
                    >
                      <span>{opt}</span>
                      {sortFilter === opt && <Check className="h-3 w-3 text-[#00AEF0]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button 
          onClick={() => toast.success("Exporting offers data as CSV...")}
          className="h-10 px-4 rounded-xl border border-zinc-800 bg-[#121214] text-xs text-zinc-300 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Download className="h-3.5 w-3.5 text-zinc-500" />
          Export CSV
        </button>
      </div>

      {/* Offers list stack */}
      <div className="space-y-4">
        {filteredOffers.length === 0 ? (
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
                    <button 
                      onClick={() => toast.info("More actions menu opened.")}
                      className="h-9 w-9 rounded-lg bg-[#1a1a1f] border border-zinc-800 hover:bg-zinc-800/40 text-zinc-400 hover:text-white font-bold text-xs flex items-center justify-center cursor-pointer transition-colors shrink-0"
                    >
                      &middot;&middot;&middot;
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
                    <button 
                      onClick={() => toast.info("More actions menu opened.")}
                      className="w-full h-[38px] rounded-[10px] bg-[#1a1a1f] border border-zinc-800 hover:bg-zinc-800/40 text-zinc-400 hover:text-white font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
                    >
                      &middot;&middot;&middot;
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
        onClose={() => setSelectedOffer(null)} 
      />

    </div>
  );
}
