"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  MoreHorizontal,
  ChevronRight,
  X,
  Globe,
  Lock,
  EyeOff,
  Check,
  Trash2,
  Edit2,
  Share2,
  User,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  LayoutGrid,
  Sparkles,
  Palette
} from "lucide-react";
import { toast } from "sonner";
import { CommonHeader } from "@/components/dashboard/page-header";
import { useRouter } from "next/navigation";

// Type definitions
interface ArtistPreview {
  initials: string;
  color: string;
}

interface AvailList {
  id: string;
  title: string;
  updatedAt: string;
  artistsCount: number;
  artists: ArtistPreview[];
  status?: "Unlisted" | "Private" | "Public";
  tab: "recent" | "sent" | "shared";
}

// Pre-defined premium color palette for quadrant backgrounds
const PREMIUM_COLORS = [
  { name: "Cyan", hex: "#00A5E5" },
  { name: "Purple", hex: "#8A5CF5" },
  { name: "Green", hex: "#22C55E" },
  { name: "Teal/Emerald", hex: "#10B981" },
  { name: "Amber/Gold", hex: "#F59E0B" },
  { name: "Rose/Pink", hex: "#F43F5E" },
  { name: "Indigo", hex: "#6366F1" },
  { name: "Lime", hex: "#84CC16" },
  { name: "Coral/Red", hex: "#EF4444" },
  { name: "Hot Pink", hex: "#EC4899" },
  { name: "Orange", hex: "#F97316" }
];

export default function AvailsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Active tab filter: 'recent' | 'sent' | 'shared'
  const [activeTab, setActiveTab] = useState<"recent" | "sent" | "shared">("recent");

  // Search query
  const [searchQuery, setSearchQuery] = useState("");

  // Manage all avail lists in dynamic local state so edits update live
  const [avails, setAvails] = useState<AvailList[]>([]);

  // Modals & Panels UI State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedAvail, setSelectedAvail] = useState<AvailList | null>(null);

  // Dropdown menu state
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form states for creating a new avail
  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState<"Public" | "Unlisted" | "Private">("Public");
  const [newArtistCount, setNewArtistCount] = useState<number>(10);
  const [newQuadrants, setNewQuadrants] = useState<ArtistPreview[]>([
    { initials: "AF", color: "#00A5E5" },
    { initials: "DS", color: "#8A5CF5" },
    { initials: "FO", color: "#22C55E" },
    { initials: "HS", color: "#10B981" }
  ]);

  // Form states for editing/renaming an avail
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameTitle, setRenameTitle] = useState("");
  const [renameId, setRenameId] = useState("");

  // Populate mock data on mount
  useEffect(() => {
    setMounted(true);

    // Initial 45 records matching the exact counts (24, 9, 12)
    const initialAvails: AvailList[] = [
      // ----- RECENT ADDED (24 total, first 8 match images exactly) -----
      {
        id: "rec-1",
        title: "East Coast Summer",
        updatedAt: "Updated today",
        artistsCount: 16,
        artists: [
          { initials: "Af", color: "#00A5E5" },
          { initials: "DS", color: "#8A5CF5" },
          { initials: "Fo", color: "#22C55E" },
          { initials: "HS", color: "#10B981" }
        ],
        tab: "recent"
      },
      {
        id: "rec-2",
        title: "Festival Season 2026",
        updatedAt: "Updated 3d ago",
        artistsCount: 8,
        artists: [
          { initials: "Fo", color: "#22C55E" },
          { initials: "F", color: "#F59E0B" },
          { initials: "GR", color: "#10B981" },
          { initials: "S", color: "#F43F5E" }
        ],
        tab: "recent"
      },
      {
        id: "rec-3",
        title: "Available This Weekend",
        updatedAt: "Updated 1d ago",
        artistsCount: 5,
        artists: [
          { initials: "Af", color: "#00A5E5" },
          { initials: "GP", color: "#EF4444" },
          { initials: "DN", color: "#22C55E" },
          { initials: "", color: "#1A1A1E" } // Dark placeholder
        ],
        tab: "recent"
      },
      {
        id: "rec-4",
        title: "Rock Artists",
        updatedAt: "Updated 5d ago",
        artistsCount: 11,
        artists: [
          { initials: "F", color: "#F59E0B" },
          { initials: "GR", color: "#00A5E5" },
          { initials: "HS", color: "#22C55E" },
          { initials: "LG", color: "#6366F1" }
        ],
        status: "Unlisted",
        tab: "recent"
      },
      {
        id: "rec-5",
        title: "Classic Rock Legends",
        updatedAt: "Updated 1d ago",
        artistsCount: 9,
        artists: [
          { initials: "Af", color: "#00A5E5" },
          { initials: "F", color: "#F59E0B" },
          { initials: "GR", color: "#00A5E5" },
          { initials: "O", color: "#84CC16" }
        ],
        tab: "recent"
      },
      {
        id: "rec-6",
        title: "Tribute Acts",
        updatedAt: "Updated 1d ago",
        artistsCount: 6,
        artists: [
          { initials: "TA", color: "#00A5E5" },
          { initials: "AA", color: "#EC4899" },
          { initials: "DN", color: "#22C55E" },
          { initials: "Bi", color: "#F59E0B" }
        ],
        tab: "recent"
      },
      {
        id: "rec-7",
        title: "Southwest Routing",
        updatedAt: "Updated 1d ago",
        artistsCount: 7,
        artists: [
          { initials: "GP", color: "#EF4444" },
          { initials: "HH", color: "#EC4899" },
          { initials: "Ho", color: "#F97316" },
          { initials: "", color: "#1A1A1E" } // Dark placeholder
        ],
        tab: "recent"
      },
      {
        id: "rec-8",
        title: "Fall Bookings",
        updatedAt: "Updated today",
        artistsCount: 13,
        artists: [
          { initials: "HS", color: "#10B981" },
          { initials: "LG", color: "#6366F1" },
          { initials: "SA", color: "#10B981" },
          { initials: "S", color: "#F43F5E" }
        ],
        status: "Private",
        tab: "recent"
      },
      // Rest of the 24 items in recent to match count
      ...Array.from({ length: 16 }, (_, i) => ({
        id: `rec-extra-${i}`,
        title: `Roster Plan ${String.fromCharCode(65 + i)} 2026`,
        updatedAt: `Updated ${i + 2}d ago`,
        artistsCount: 4 + (i % 8),
        artists: [
          { initials: "Af", color: "#00A5E5" },
          { initials: "DN", color: "#22C55E" },
          { initials: "Fo", color: "#6366F1" },
          { initials: "GR", color: "#EC4899" }
        ],
        status: i % 5 === 0 ? ("Private" as const) : i % 3 === 0 ? ("Unlisted" as const) : undefined,
        tab: "recent" as const
      })),

      // ----- SENT AVAILS (9 items) -----
      ...Array.from({ length: 9 }, (_, i) => ({
        id: `sent-${i}`,
        title: `Sent Pitch List ${i + 1}`,
        updatedAt: `Updated ${i + 1}d ago`,
        artistsCount: 3 + i,
        artists: [
          { initials: "SP", color: "#EF4444" },
          { initials: "GR", color: "#00A5E5" },
          { initials: "FO", color: "#F59E0B" },
          { initials: "", color: "#1A1A1E" }
        ],
        status: i % 2 === 0 ? ("Unlisted" as const) : undefined,
        tab: "sent" as const
      })),

      // ----- SHARED WITH ME (12 items) -----
      ...Array.from({ length: 12 }, (_, i) => ({
        id: `shared-${i}`,
        title: `Shared Availability ${String.fromCharCode(88 + (i % 3))}-${100 + i}`,
        updatedAt: `Updated ${i + 4}h ago`,
        artistsCount: 6 + (i * 2),
        artists: [
          { initials: "SH", color: "#8A5CF5" },
          { initials: "X", color: "#F43F5E" },
          { initials: "YZ", color: "#10B981" },
          { initials: "Z", color: "#84CC16" }
        ],
        tab: "shared" as const
      }))
    ];

    setAvails(initialAvails);
  }, []);

  // Handle outside clicks to close dropdown menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute dynamic counts based on the actual avails state array
  const tabCounts = useMemo(() => {
    return {
      recent: avails.filter((a) => a.tab === "recent").length,
      sent: avails.filter((a) => a.tab === "sent").length,
      shared: avails.filter((a) => a.tab === "shared").length
    };
  }, [avails]);

  // Filter avails matching active tab and search query
  const filteredAvails = useMemo(() => {
    return avails.filter((item) => {
      if (item.tab !== activeTab) return false;
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchInitials = item.artists.some((a) => a.initials.toLowerCase().includes(query));

      return matchTitle || matchInitials;
    });
  }, [avails, activeTab, searchQuery]);

  // Create new Avail
  const handleCreateAvail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const newObj: AvailList = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      updatedAt: "Updated today",
      artistsCount: newArtistCount,
      artists: newQuadrants,
      status: newStatus === "Public" ? undefined : newStatus,
      tab: activeTab // Create directly inside currently active tab filter
    };

    setAvails([newObj, ...avails]);
    setIsCreateModalOpen(false);
    toast.success("New Avail list created successfully!");

    // Reset Form
    setNewTitle("");
    setNewStatus("Public");
    setNewArtistCount(10);
    setNewQuadrants([
      { initials: "AF", color: "#00A5E5" },
      { initials: "DS", color: "#8A5CF5" },
      { initials: "FO", color: "#22C55E" },
      { initials: "HS", color: "#10B981" }
    ]);
  };

  // Delete Avail
  const handleDeleteAvail = (id: string) => {
    setAvails(avails.filter((a) => a.id !== id));
    setActiveDropdownId(null);
    toast.success("Avail list deleted successfully");
  };

  // Rename Avail form trigger
  const triggerRename = (id: string, currentTitle: string) => {
    setRenameId(id);
    setRenameTitle(currentTitle);
    setIsRenameModalOpen(true);
    setActiveDropdownId(null);
  };

  // Save renamed Title
  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    setAvails(
      avails.map((a) => (a.id === renameId ? { ...a, title: renameTitle.trim(), updatedAt: "Updated today" } : a))
    );
    setIsRenameModalOpen(false);
    toast.success("Avail list renamed successfully");
  };

  // Change Avail Status
  const handleChangeStatus = (id: string, status: "Public" | "Unlisted" | "Private") => {
    setAvails(
      avails.map((a) =>
        a.id === id ? { ...a, status: status === "Public" ? undefined : status, updatedAt: "Updated today" } : a
      )
    );
    setActiveDropdownId(null);
    toast.success(`Availability list set to ${status}`);
  };

  // Edit quadrant details during new creation
  const updateNewQuadrant = (index: number, key: keyof ArtistPreview, value: string) => {
    const updated = [...newQuadrants];
    updated[index] = { ...updated[index], [key]: value };
    setNewQuadrants(updated);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] p-4 sm:p-6 md:p-8 lg:p-10 w-full space-y-6 sm:space-y-8 pb-20 font-sans text-white">

      {/* 1. Header Section */}
      <CommonHeader
        title="Avails"
        subtitle="Organize and share your artist availability lists"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search lists or initials..."
        actionButton={
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-[#00A5E5] hover:bg-[#0092CB] active:scale-95 transition-all text-white font-semibold py-2.5 px-4 rounded-xl shadow-[0_0_20px_rgba(0,165,229,0.2)] cursor-pointer w-full sm:w-auto"
          >
            <Plus size={16} className="stroke-[2.5]" />
            <span className="text-sm">New Avail</span>
          </button>
        }
      />

      {/* 2. Filter Tab Controls (Badge Counts align with Mock Counts) */}
      <div className="inline-flex p-1.5 bg-[#121214]/60 backdrop-blur rounded-[14px] border border-zinc-800/60 max-w-full overflow-x-auto no-scrollbar gap-1.5">
        {[
          { key: "recent", label: "Recent Added", count: tabCounts.recent },
          { key: "sent", label: "Sent Avails", count: tabCounts.sent },
          { key: "shared", label: "Shared With Me", count: tabCounts.shared }
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as any);
                setSearchQuery("");
              }}
              className={`h-[61.9px] pt-[9.9px] pb-[9.9px] pl-[29.71px] pr-[29.71px] gap-[9.9px] rounded-[9.9px] flex items-center justify-center shrink-0 border-b-[2.48px] transition-all cursor-pointer select-none
                ${isActive
                  ? "bg-[#00A5E5]/[0.08] border-b-[#00A5E5] text-white font-bold"
                  : "bg-transparent border-b-transparent text-zinc-500 hover:text-zinc-350 hover:bg-white/[0.01] font-semibold"
                }
              `}
            >
              <span className="text-sm tracking-wide">{tab.label}</span>
              <span
                className={`px-[8px] py-[2px] rounded-full text-xs font-bold transition-all
                  ${isActive
                    ? "bg-[#00A5E5]/15 text-[#00A5E5]"
                    : "bg-zinc-800/60 text-zinc-500"
                  }
                `}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Card Grid Section */}
      <AnimatePresence mode="popLayout">
        {filteredAvails.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredAvails.map((avail) => (
              <motion.div
                layout
                key={avail.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-[#121214] border border-zinc-800/50 rounded-[20px] overflow-hidden flex flex-col hover:border-zinc-700/60 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] transition-all duration-300 group cursor-pointer"
                onClick={() => {
                  router.push(`/dashboard/avails/${avail.id}`);
                }}
              >

                {/* 2x2 Image Preview Block */}
                <div className="h-[200px] w-full grid grid-cols-2 grid-rows-2 relative overflow-hidden bg-[#1A1A1E]">
                  {avail.artists.map((artist, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-center font-bold text-lg select-none relative transition-all duration-300"
                      style={{ backgroundColor: artist.color || "#1A1A1E" }}
                    >
                      <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] tracking-wider">
                        {artist.initials}
                      </span>
                    </div>
                  ))}

                  {/* Dot Menu Button */}
                  <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setActiveDropdownId(activeDropdownId === avail.id ? null : avail.id);
                      }}
                      className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white backdrop-blur-sm transition-all border border-white/5 active:scale-95 shadow-md"
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {/* Context Action Menu Dropdown */}
                    {activeDropdownId === avail.id && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 w-48 bg-[#18181B] border border-zinc-800 rounded-xl shadow-2xl py-1.5 z-50 text-left backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150"
                      >
                        <button
                          onClick={() => triggerRename(avail.id, avail.title)}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-white/[0.04] text-xs font-semibold transition-colors text-left"
                        >
                          <Edit2 size={13} className="text-zinc-500" />
                          Rename List
                        </button>

                        <div className="h-px bg-zinc-800/80 my-1" />

                        <div className="px-4 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          Set Privacy
                        </div>
                        <button
                          onClick={() => handleChangeStatus(avail.id, "Public")}
                          className="w-full flex items-center justify-between px-4 py-2 text-zinc-300 hover:text-white hover:bg-white/[0.04] text-xs font-semibold transition-colors text-left"
                        >
                          <span className="flex items-center gap-2">
                            <Globe size={13} className="text-zinc-500" />
                            Public
                          </span>
                          {!avail.status && <Check size={12} className="text-[#00A5E5]" />}
                        </button>
                        <button
                          onClick={() => handleChangeStatus(avail.id, "Unlisted")}
                          className="w-full flex items-center justify-between px-4 py-2 text-zinc-300 hover:text-white hover:bg-white/[0.04] text-xs font-semibold transition-colors text-left"
                        >
                          <span className="flex items-center gap-2">
                            <EyeOff size={13} className="text-zinc-500" />
                            Unlisted
                          </span>
                          {avail.status === "Unlisted" && <Check size={12} className="text-[#00A5E5]" />}
                        </button>
                        <button
                          onClick={() => handleChangeStatus(avail.id, "Private")}
                          className="w-full flex items-center justify-between px-4 py-2 text-zinc-300 hover:text-white hover:bg-white/[0.04] text-xs font-semibold transition-colors text-left"
                        >
                          <span className="flex items-center gap-2">
                            <Lock size={13} className="text-zinc-500" />
                            Private
                          </span>
                          {avail.status === "Private" && <Check size={12} className="text-[#00A5E5]" />}
                        </button>

                        <div className="h-px bg-zinc-800/80 my-1" />

                        <button
                          onClick={() => handleDeleteAvail(avail.id)}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.04] text-xs font-semibold transition-colors text-left"
                        >
                          <Trash2 size={13} className="text-rose-500" />
                          Delete List
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Artists Count overlay badge */}
                  <div className="absolute bottom-3 right-3 select-none">
                    <div className="bg-black/75 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-md border border-white/5 tracking-wide">
                      {avail.artistsCount} artists
                    </div>
                  </div>
                </div>

                {/* Content Section Padding (Top: 17.3px, Right/Bottom/Left: 19.77px) */}
                <div className="pt-[17.3px] pr-[19.77px] pb-[19.77px] pl-[19.77px] flex flex-col flex-1 justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-zinc-100 text-sm sm:text-base group-hover:text-white transition-colors line-clamp-1">
                      {avail.title}
                    </h3>

                    <div className="flex items-center gap-2 text-[11px] sm:text-xs">
                      {/* Privacy badges based on state */}
                      {avail.status === "Unlisted" && (
                        <span className="text-[#F59E0B] font-semibold flex items-center gap-1">
                          Unlisted
                        </span>
                      )}
                      {avail.status === "Private" && (
                        <span className="text-zinc-400 font-semibold flex items-center gap-1">
                          Private
                        </span>
                      )}
                      {avail.status && <span className="text-zinc-600 font-light">•</span>}
                      <span className="text-zinc-500 font-medium">{avail.updatedAt}</span>
                    </div>
                  </div>

                  {/* Action Link: View Full Avails */}
                  <div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#00A5E5] hover:text-[#0092CB] transition-colors">
                      {avail.artistsCount > 9 ? "View Full Avails" : "View full list"}
                      <ChevronRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>

                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 bg-[#121214] border border-zinc-800/60 rounded-[20px] text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <Search size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-zinc-200">No avail lists found</h3>
              <p className="text-zinc-500 text-xs sm:text-sm">
                Try searching for something else or create a new avail roster list.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. MODAL: Create New Avail */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#121214] border border-zinc-800 rounded-[24px] max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Create New Avail List</h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleCreateAvail} className="p-6 space-y-5 overflow-y-auto no-scrollbar flex-1">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Avail List Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. West Coast Tour 2026"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#1A1A1E] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-[#00A5E5]/50 focus:ring-1 focus:ring-[#00A5E5]/30 transition-all"
                  />
                </div>

                {/* Status Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Privacy Setting
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { key: "Public", desc: "Visible to anyone", icon: Globe },
                      { key: "Unlisted", desc: "Link-only access", icon: EyeOff },
                      { key: "Private", desc: "Team-only access", icon: Lock }
                    ].map((opt) => {
                      const Icon = opt.icon;
                      const selected = newStatus === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setNewStatus(opt.key as any)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all cursor-pointer
                            ${selected
                              ? "bg-[#00A5E5]/10 border-[#00A5E5] text-white"
                              : "bg-[#1A1A1E] border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
                            }
                          `}
                        >
                          <Icon size={16} className={selected ? "text-[#00A5E5]" : "text-zinc-500"} />
                          <span className="text-xs font-bold">{opt.key}</span>
                          <span className="text-[9px] text-zinc-500 font-medium block leading-tight">{opt.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Total Artist Count */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Total Artist Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newArtistCount}
                    onChange={(e) => setNewArtistCount(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#1A1A1E] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-[#00A5E5]/50 focus:ring-1 focus:ring-[#00A5E5]/30 transition-all"
                  />
                </div>

                {/* Quadrants Config Redesigned */}
                <div className="space-y-4 pt-3 border-t border-white/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d0d12]/60 p-3.5 rounded-2xl border border-white/5">
                    <div>
                      <label className="text-xs font-black text-[#00A5E5] uppercase tracking-wider flex items-center gap-2">
                        <LayoutGrid size={15} />
                        Quadrant Grid Preview Setup
                      </label>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Customize up to 4 preview initials & background colors
                      </p>
                    </div>

                    {/* Live 2x2 Mini Preview Box */}
                    <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                      <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Live Preview:</span>
                      <div className="w-14 h-14 rounded-xl border border-white/10 overflow-hidden grid grid-cols-2 grid-rows-2 shadow-lg shrink-0">
                        {newQuadrants.map((quad, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-center font-bold text-[10px] text-white select-none transition-all duration-200"
                            style={{ backgroundColor: quad.color || "#1A1A1E" }}
                          >
                            <span className="drop-shadow-sm">{quad.initials || "--"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 4-Quadrant Inputs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {newQuadrants.map((quad, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-[#141418]/80 border border-white/10 rounded-2xl space-y-2.5 hover:border-[#00A5E5]/40 transition-all duration-200 group"
                      >
                        <div className="flex justify-between items-center text-[10px] font-extrabold tracking-wider">
                          <span className="text-zinc-400 group-hover:text-[#00A5E5] transition-colors flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00A5E5]" />
                            QUADRANT {idx + 1}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                              style={{ backgroundColor: quad.color }}
                            />
                            <span className="text-zinc-500 font-medium">
                              {PREMIUM_COLORS.find((c) => c.hex === quad.color)?.name || "Color"}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                          <div className="col-span-2 space-y-1">
                            <label className="text-[9px] font-bold text-zinc-500 uppercase block">Initials</label>
                            <input
                              type="text"
                              maxLength={2}
                              placeholder="AF"
                              value={quad.initials}
                              onChange={(e) => updateNewQuadrant(idx, "initials", e.target.value.toUpperCase())}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-center font-black text-white uppercase focus:outline-none focus:border-[#00A5E5] focus:ring-1 focus:ring-[#00A5E5]/30 transition-all"
                            />
                          </div>

                          <div className="col-span-3 space-y-1">
                            <label className="text-[9px] font-bold text-zinc-500 uppercase block">Theme Color</label>
                            <select
                              value={quad.color}
                              onChange={(e) => updateNewQuadrant(idx, "color", e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-[#00A5E5] focus:ring-1 focus:ring-[#00A5E5]/30 transition-all cursor-pointer"
                            >
                              {PREMIUM_COLORS.map((col) => (
                                <option key={col.hex} value={col.hex} className="bg-zinc-900 text-white">
                                  {col.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer inside form */}
                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-800 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-850 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#00A5E5] hover:bg-[#0092CB] text-sm font-bold text-white transition-all shadow-lg cursor-pointer"
                  >
                    Create List
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. MODAL: Rename Avail List */}
      <AnimatePresence>
        {isRenameModalOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121214] border border-zinc-800 rounded-[20px] max-w-sm w-full overflow-hidden shadow-2xl p-6 space-y-4"
            >
              <h3 className="text-base font-bold text-white">Rename Roster List</h3>

              <form onSubmit={handleSaveRename} className="space-y-4">
                <input
                  type="text"
                  required
                  value={renameTitle}
                  onChange={(e) => setRenameTitle(e.target.value)}
                  className="w-full bg-[#1A1A1E] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-[#00A5E5]/50 focus:ring-1 focus:ring-[#00A5E5]/30 transition-all"
                />

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRenameModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#00A5E5] hover:bg-[#0092CB] text-xs font-bold text-white transition-all shadow-md cursor-pointer"
                  >
                    Rename
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. SIDE PANEL DRAWER: Avails Detail Drawer */}
      <AnimatePresence>
        {isDetailDrawerOpen && selectedAvail && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailDrawerOpen(false)}
              className="absolute inset-0 bg-black backdrop-blur-sm cursor-pointer"
            />

            <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="w-full bg-[#121214] border-l border-zinc-800/80 shadow-2xl flex flex-col h-full overflow-hidden text-zinc-150"
              >
                {/* Drawer Header */}
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white line-clamp-1">{selectedAvail.title}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      {selectedAvail.status ? (
                        <span className="text-[#F59E0B] font-semibold">{selectedAvail.status}</span>
                      ) : (
                        <span className="text-[#00A5E5] font-semibold">Public</span>
                      )}
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400">{selectedAvail.updatedAt}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDetailDrawerOpen(false)}
                    className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Drawer Contents */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">

                  {/* Shareable Link Box */}
                  <div className="p-4 bg-[#1A1A1E] border border-zinc-800/80 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-wide">
                      <span>Roster Shareable Link</span>
                      <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-semibold normal-case">
                        <CheckCircle size={10} /> Active
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`https://getavails.com/share/avails/${selectedAvail.id}`}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-400 flex-1 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://getavails.com/share/avails/${selectedAvail.id}`);
                          toast.success("Roster link copied to clipboard!");
                        }}
                        className="p-2 bg-[#00A5E5]/10 hover:bg-[#00A5E5]/20 text-[#00A5E5] border border-[#00A5E5]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* 2x2 Grid block inside detail drawer */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                      Grid Icon Preview
                    </span>
                    <div className="w-24 h-24 grid grid-cols-2 grid-rows-2 rounded-xl overflow-hidden border border-zinc-800 bg-[#1A1A1E]">
                      {selectedAvail.artists.map((artist, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-center font-bold text-[10px] uppercase text-white"
                          style={{ backgroundColor: artist.color || "#1A1A1E" }}
                        >
                          {artist.initials}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Artists list in Roster */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        Roster List ({selectedAvail.artistsCount} Artists)
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {/* Generating detailed visual mock list of artists within the drawer */}
                      {Array.from({ length: selectedAvail.artistsCount }).map((_, index) => {
                        const colors = ["#00A5E5", "#8A5CF5", "#22C55E", "#F59E0B", "#F43F5E", "#6366F1"];
                        const artistColor = colors[index % colors.length];
                        const artistInitials = selectedAvail.artists[index % selectedAvail.artists.length]?.initials || "AA";

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3.5 bg-[#1A1A1E]/80 border border-zinc-850 rounded-xl hover:border-zinc-800 hover:bg-zinc-900/50 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs uppercase text-white"
                                style={{ backgroundColor: artistColor }}
                              >
                                {artistInitials}
                              </div>
                              <div>
                                <h4 className="font-bold text-white text-sm">Artist Profile #{index + 1}</h4>
                                <p className="text-[11px] text-zinc-500">Premium Talent • Electro/House</p>
                              </div>
                            </div>

                            <a
                              href={`/search/${index + 1}`}
                              className="w-7 h-7 rounded-full bg-zinc-900 hover:bg-zinc-850 flex items-center justify-center text-zinc-400 hover:text-[#00A5E5] transition-all border border-zinc-800 cursor-pointer"
                            >
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Drawer Footer */}
                <div className="p-6 border-t border-zinc-800 bg-[#1A1A1E]/40 flex items-center justify-between gap-4">
                  <button
                    onClick={() => {
                      setIsDetailDrawerOpen(false);
                      triggerRename(selectedAvail.id, selectedAvail.title);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-zinc-300 font-semibold py-2 px-4 rounded-xl text-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Edit2 size={13} /> Edit List
                  </button>
                  <button
                    onClick={() => {
                      setIsDetailDrawerOpen(false);
                      handleDeleteAvail(selectedAvail.id);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 border border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/[0.04] text-rose-400 font-semibold py-2 px-4 rounded-xl text-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Trash2 size={13} /> Delete List
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
