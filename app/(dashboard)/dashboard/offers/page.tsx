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

  // Filtering offers based on tab and search query
  const filteredOffers = useMemo(() => {
    return offersList.filter(offer => {
      // Tab matching logic
      if (activeTab === "Sent" && offer.flow !== "Sent") return false;
      if (activeTab === "Rejected" && offer.status !== "Rejected") return false;
      if (activeTab === "Shared" && offer.id === "4") return false; // simple filter simulation

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
  }, [offersList, activeTab, searchQuery]);

  const handleNotificationsClick = () => {
    window.dispatchEvent(new CustomEvent("open-notifications"));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 lg:p-10 w-full space-y-8 pb-32 font-sans relative">
      
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
            Offers
          </h1>
          <p className="text-sm text-zinc-400 font-sans mt-1.5">
            Manage all incoming and outgoing offers for your venue
          </p>
        </div>

        {/* Top Bar Right: Search, Notifications & Create Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-full bg-[#121214] border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-colors"
            />
          </div>
          
          <button 
            onClick={handleNotificationsClick}
            className="w-10 h-10 rounded-full border border-zinc-800 bg-[#121214] flex items-center justify-center relative hover:bg-zinc-800/60 hover:border-zinc-700 transition-all cursor-pointer group"
          >
            <Bell className="h-[18px] w-[18px] text-zinc-300 group-hover:text-white transition-colors" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ef4444] rounded-full ring-2 ring-[#121214]" />
          </button>

          <button 
            onClick={() => router.push("/dashboard/offers/create")}
            className="h-10 px-5 rounded-xl bg-[#00A5E5] hover:bg-[#009bde] text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
          >
            <Plus className="h-4.5 w-4.5" />
            New Offer
          </button>
        </div>
      </div>

      {/* Tabs Filter Container */}
      <div 
        style={{
          borderRadius: "14px",
          borderWidth: "1.24px",
          borderColor: "rgba(255, 255, 255, 0.08)",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          padding: "4px"
        }}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar"
      >
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
              className="flex items-center transition-all cursor-pointer font-bold text-sm shrink-0"
              style={{
                height: "61.9px",
                borderRadius: "9.9px",
                paddingTop: "9.9px",
                paddingBottom: "9.9px",
                paddingLeft: "29.71px",
                paddingRight: "29.71px",
                gap: "9.9px",
                borderBottomWidth: "2.48px",
                borderBottomColor: isSelected ? "#00A5E5" : "transparent",
                backgroundColor: isSelected ? "rgba(0, 165, 229, 0.08)" : "transparent",
                color: isSelected ? "#ffffff" : "#71717a"
              }}
            >
              <span>{tab.label}</span>
              <span 
                className="text-[11px] px-2.5 py-0.5 rounded-full font-bold transition-colors"
                style={{
                  backgroundColor: isSelected ? "rgba(0, 165, 229, 0.15)" : "#1c1c21",
                  color: isSelected ? "#00A5E5" : "#52525b"
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Filter options row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="h-10 px-4 rounded-xl border border-zinc-800 bg-[#121214] text-xs text-zinc-300 flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              Today
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
            </button>
          </div>
          <div className="relative">
            <button className="h-10 px-4 rounded-xl border border-zinc-800 bg-[#121214] text-xs text-zinc-300 flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              Newest
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
            </button>
          </div>
        </div>

        <button 
          onClick={() => toast.success("Exporting offers data as CSV...")}
          className="h-10 px-4 rounded-xl border border-zinc-800 bg-[#121214] text-xs text-zinc-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
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
                  borderRadius: "19.81px",
                  borderWidth: "1.24px",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  paddingTop: "24.76px",
                  paddingBottom: "24.76px",
                  paddingLeft: "29.71px",
                  paddingRight: "29.71px"
                }}
                className="hover:border-zinc-700 transition-all"
              >
                <div 
                  className="grid grid-cols-1 md:grid-cols-12 items-start"
                  style={{ gap: "19.81px" }}
                >
                  
                  {/* 1. Artist Details */}
                  <div className="md:col-span-3 flex items-start gap-4 min-w-0">
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
                  <div className="md:col-span-3 space-y-1">
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
                  <div className="md:col-span-2 space-y-1.5">
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
                  <div className="md:col-span-2 space-y-3">
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
