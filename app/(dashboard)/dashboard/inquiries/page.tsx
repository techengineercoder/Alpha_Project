"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  FileText, 
  Search, 
  Bell, 
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

// Interface for Inquiry
interface Inquiry {
  id: string;
  clientName: string;
  companyName: string;
  artistName: string;
  eventDate: string;
  receivedDate: string;
  location: string;
  budget: string;
  note: string;
  avatarChar: string;
  avatarBg: string;
  status: "New" | "Reviewed" | "Accepted" | "Declined";
}

// Initial Mock Data matching screenshots
const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: "INQ-2291",
    clientName: "D. Cho",
    companyName: "Bluewave Festival",
    artistName: "Nova Reyes",
    eventDate: "Aug 14, 2026",
    receivedDate: "Received Jun 2, 10:08 AM",
    location: "Riverside Grounds, Portland",
    budget: "$15,000–$20,000",
    note: "Looking for a headline set for our main stage closing night. 75-min set, production provided.",
    avatarChar: "DC",
    avatarBg: "bg-amber-600",
    status: "New"
  },
  {
    id: "INQ-2290",
    clientName: "Marcus Liu",
    companyName: "Sunset Events Co.",
    artistName: "DJ Kira",
    eventDate: "Sep 3, 2026",
    receivedDate: "Received Jun 1, 4:22 PM",
    location: "Sunset Bay Amphitheater, Los Angeles",
    budget: "$10,000–$12,000",
    note: "Private corporate party and DJ set. Open bar, stage, and full sound system provided.",
    avatarChar: "ML",
    avatarBg: "bg-blue-600",
    status: "Reviewed"
  },
  {
    id: "INQ-2289",
    clientName: "Priya Nair",
    companyName: "Volta Music Group",
    artistName: "Elliot Strand",
    eventDate: "Jul 27, 2026",
    receivedDate: "Received May 31, 11:45 AM",
    location: "Volta Hall, Seattle",
    budget: "$25,000–$30,000",
    note: "Festival showcase for Volta Music Group's annual summit. 60-min set, standard DJ backline.",
    avatarChar: "PN",
    avatarBg: "bg-rose-600",
    status: "Accepted"
  },
  {
    id: "INQ-2288",
    clientName: "James Ortega",
    companyName: "Pacific Sound Fests",
    artistName: "Nova Reyes",
    eventDate: "Oct 5, 2026",
    receivedDate: "Received May 30, 9:00 AM",
    location: "Pacific Arena, San Francisco",
    budget: "$8,000–$10,000",
    note: "Fall festival opener. 45-min set, production and travel support provided.",
    avatarChar: "JO",
    avatarBg: "bg-amber-800",
    status: "Declined"
  }
];

type FilterStatus = "All" | "New" | "Reviewed" | "Accepted" | "Declined";

export default function InquiriesPage() {
  const [mounted, setMounted] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [activeTab, setActiveTab] = useState<FilterStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter and Search logic
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesTab = activeTab === "All" || inq.status === activeTab;
      const matchesSearch = 
        inq.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [inquiries, activeTab, searchQuery]);

  if (!mounted) {
    return <LogoLoader fullScreen={true} text="Loading Inquiries..." />;
  }

  // Handle Accept
  const handleAccept = (id: string, clientName: string) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: "Accepted" } : inq))
    );
    toast.success(`Inquiry from ${clientName} accepted successfully!`);
    
    // Update active selected inquiry in drawer if open
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => prev ? { ...prev, status: "Accepted" } : null);
    }
  };

  // Handle Reject
  const handleReject = (id: string, clientName: string) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: "Declined" } : inq))
    );
    toast.error(`Inquiry from ${clientName} declined.`);
    
    // Update active selected inquiry in drawer if open
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => prev ? { ...prev, status: "Declined" } : null);
    }
  };

  // Open Preview Drawer
  const handlePreview = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsDrawerOpen(true);
  };

  // Close Drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Open global notifications sidebar via CustomEvent handled in layout.tsx
  const handleNotificationsClick = () => {
    window.dispatchEvent(new CustomEvent("open-notifications"));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 lg:p-10 w-full space-y-8 pb-20 font-sans relative overflow-x-hidden">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Incoming Inquiries</h1>
          <p className="text-zinc-400 text-sm">
            Manage and respond to booking requests
          </p>
        </div>

        {/* SEARCH AND NOTIFICATIONS */}
        <div className="flex items-center gap-3">
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
            title="Notifications"
          >
            <Bell className="h-[18px] w-[18px] text-zinc-300 group-hover:text-white transition-colors" />
            {/* Red Notification Badge */}
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ef4444] rounded-full ring-2 ring-[#121214]" />
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex overflow-x-auto no-scrollbar py-1">
        <div className="inline-flex p-1 bg-[#121214] border border-zinc-800 rounded-full gap-1">
          {(["All", "New", "Reviewed", "Accepted", "Declined"] as FilterStatus[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive 
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
        <AnimatePresence mode="popLayout">
          {filteredInquiries.length > 0 ? (
            filteredInquiries.map((inq) => (
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
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {/* Circle Avatar */}
                  <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-bold text-white text-base shadow-inner ${inq.avatarBg}`}>
                    {inq.avatarChar}
                  </div>

                  {/* Details */}
                  <div className="flex flex-col space-y-1 w-full min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-zinc-500 text-xs font-mono font-medium tracking-wide">
                        {inq.id}
                      </span>
                      {/* Status Badge */}
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                        inq.status === "New" 
                          ? "bg-zinc-800/80 border-zinc-700/50 text-zinc-300"
                          : inq.status === "Reviewed"
                          ? "bg-yellow-950/40 border-yellow-800/30 text-yellow-500"
                          : inq.status === "Accepted"
                          ? "bg-emerald-950/40 border-emerald-800/30 text-emerald-500"
                          : "bg-red-950/40 border-red-800/30 text-red-500"
                      }`}>
                        {inq.status}
                      </span>
                    </div>

                    <h2 className="text-sm text-zinc-400 truncate">
                      <strong className="font-semibold text-white text-base mr-1">
                        {inq.clientName}
                      </strong>
                      · {inq.companyName}
                    </h2>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-zinc-500 mt-1">
                      <span className="flex items-center gap-1.5">
                        <Mic className="h-3.5 w-3.5 text-zinc-500" />
                        {inq.artistName}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                        {inq.eventDate}
                      </span>
                      <span>
                        {inq.receivedDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Section: Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end sm:justify-start">
                  <button
                    onClick={() => handlePreview(inq)}
                    className="h-10 px-4 rounded-xl border border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-300 font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>
                  
                  {/* Only show Accept button if it's NOT Accepted or Declined, OR if on 'All' tab (to match screenshot exactly) */}
                  {(activeTab === "All" || (inq.status !== "Accepted" && inq.status !== "Declined")) && (
                    <button
                      onClick={() => handleAccept(inq.id, inq.clientName)}
                      className="h-10 px-5 rounded-xl bg-[#00aef0] hover:bg-[#009bde] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-cyan-500/10"
                    >
                      <Check className="h-4 w-4" />
                      Accept
                    </button>
                  )}
                </div>
              </motion.div>
            ))
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
      </div>

      {/* INQUIRY DETAILS DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && selectedInquiry && (
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
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[460px] bg-[#09090b] border-l border-zinc-800 z-[100] flex flex-col justify-between shadow-2xl h-screen"
            >
              {/* Drawer Header */}
              <div className="p-6 md:p-8 pb-5 border-b border-zinc-800 relative shrink-0">
                <button
                  onClick={handleCloseDrawer}
                  className="absolute top-7 right-6 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors cursor-pointer"
                  aria-label="Close details"
                >
                  <X className="h-5 w-5" />
                </button>
                
                <span className="text-zinc-500 text-xs font-mono font-medium tracking-wide">
                  {selectedInquiry.id}
                </span>
                <h2 className="font-bold text-[24.71px] leading-[37.07px] tracking-normal text-white mt-1">
                  Inquiry Details
                </h2>
              </div>

              {/* Drawer Content Area (Scrollable) */}
              <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6 no-scrollbar">
                
                {/* FROM BOX */}
                <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-5 flex flex-col space-y-3">
                  <span className="text-[11px] font-semibold text-zinc-500 tracking-wider uppercase block">
                    FROM
                  </span>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shadow-inner shrink-0 ${selectedInquiry.avatarBg}`}>
                      {selectedInquiry.avatarChar}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-base truncate">
                        {selectedInquiry.clientName}
                      </h4>
                      <p className="text-zinc-400 text-sm truncate">
                        {selectedInquiry.companyName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* DETAILS LIST CONTAINER */}
                <div className="space-y-4 px-1">
                  {/* Artist */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#0a1b26] border border-cyan-955/20 flex items-center justify-center text-[#00aef0] shrink-0">
                      <Mic className="h-4 w-4" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-[11px] text-zinc-500 font-medium block">
                        Artist
                      </span>
                      <span className="text-white text-[15px] font-semibold block mt-0.5">
                        {selectedInquiry.artistName}
                      </span>
                    </div>
                  </div>

                  {/* Event Date */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#0a1b26] border border-cyan-955/20 flex items-center justify-center text-[#00aef0] shrink-0">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-[11px] text-zinc-500 font-medium block">
                        Event Date
                      </span>
                      <span className="text-white text-[15px] font-semibold block mt-0.5">
                        {selectedInquiry.eventDate}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#0a1b26] border border-cyan-955/20 flex items-center justify-center text-[#00aef0] shrink-0">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-[11px] text-zinc-500 font-medium block">
                        Location
                      </span>
                      <span className="text-white text-[15px] font-semibold block mt-0.5">
                        {selectedInquiry.location}
                      </span>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#0a1b26] border border-cyan-955/20 flex items-center justify-center text-[#00aef0] shrink-0">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div className="leading-tight">
                      <span className="text-[11px] text-zinc-500 font-medium block">
                        Budget
                      </span>
                      <span className="text-white text-[15px] font-semibold block mt-0.5">
                        {selectedInquiry.budget}
                      </span>
                    </div>
                  </div>
                </div>

                {/* NOTE BOX */}
                <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-5 flex flex-col space-y-3">
                  <span className="text-[11px] font-semibold text-zinc-500 tracking-wider uppercase block">
                    NOTE
                  </span>
                  <div className="text-zinc-300 text-sm leading-relaxed font-normal">
                    {selectedInquiry.note}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-zinc-800 bg-[#09090b] flex flex-col gap-3 shrink-0">
                {selectedInquiry.status !== "Accepted" ? (
                  <button
                    onClick={() => {
                      handleAccept(selectedInquiry.id, selectedInquiry.clientName);
                      handleCloseDrawer();
                    }}
                    className="w-full py-3.5 rounded-xl bg-[#00aef0] hover:bg-[#009bde] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
                  >
                    Generate Offer &rarr;
                  </button>
                ) : (
                  <div className="w-full py-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 font-semibold text-sm flex items-center justify-center gap-2">
                    <Check className="h-4 w-4" />
                    Offer Generated / Accepted
                  </div>
                )}

                {selectedInquiry.status !== "Declined" && (
                  <button
                    onClick={() => {
                      handleReject(selectedInquiry.id, selectedInquiry.clientName);
                      handleCloseDrawer();
                    }}
                    className="w-full py-3.5 rounded-xl bg-[#ff3b30] hover:bg-red-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    Reject Inquiry
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
