"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Plus,
  Heart,
  MessageSquare,
  Bookmark,
  MoreHorizontal,
  X,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  Building,
  CheckCircle2,
  Globe,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { LogoLoader } from "@/components/ui/logo-loader";
import { motion, AnimatePresence } from "framer-motion";
import { ClaimArtistModal, ClaimArtistData } from "@/components/dashboard/claim-artist-modal";

export interface ArtistProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  genre: string;
  image: string | null;
  initials: string;
  avatarBg: string;
  isFavorite: boolean;
  isAvails: boolean;
  
  // Verification fields per Troy Wyatt integration specs
  claimStatus?: "Pending Verification" | "Verified Representative" | "Unclaimed";
  yourName?: string;
  companyAgency?: string;
  businessEmail?: string;
  role?: string;
  representation?: string;
  verificationMethod?: string;
  rosterUrl?: string;
  confirmationEmail?: string;
  uploadedFileName?: string;
  note?: string;
}

const INITIAL_MOCK_ARTISTS: ArtistProfile[] = [
  {
    id: "mock-1",
    name: "Billie Eillesh",
    email: "billie@eillesh.com",
    phone: "+1 310 992 4855",
    genre: "Classic Rock",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    initials: "BE",
    avatarBg: "bg-blue-600",
    isFavorite: false,
    isAvails: false,
    claimStatus: "Verified Representative",
    yourName: "Alex Vance",
    companyAgency: "Paradigm Talent Agency",
    businessEmail: "alex@paradigm.com",
    role: "Agent",
    representation: "Worldwide"
  },
  {
    id: "mock-2",
    name: "Flock of Seagulls",
    email: "info@seagulls.co.uk",
    phone: "+44 207 499 8282",
    genre: "80s New Wave",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80",
    initials: "FS",
    avatarBg: "bg-purple-600",
    isFavorite: false,
    isAvails: false,
    claimStatus: "Pending Verification",
    yourName: "Jordan Smith",
    companyAgency: "Seagulls Management",
    businessEmail: "jordan@seagulls.co.uk",
    role: "Manager",
    representation: "International"
  },
  { id: "mock-3", name: "Skrillex", email: "skrillex@owla.com", phone: "+1 213 544 3290", genre: "Dubstep / EDM", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", initials: "SK", avatarBg: "bg-[#00AEF0]", isFavorite: false, isAvails: false, claimStatus: "Verified Representative", companyAgency: "OWSLA Management", role: "Authorized Representative" },
  { id: "mock-4", name: "Post Malone", email: "malone@posty.com", phone: "+1 512 899 3444", genre: "Hip Hop / Pop", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80", initials: "PM", avatarBg: "bg-rose-600", isFavorite: false, isAvails: false, claimStatus: "Pending Verification" },
  { id: "mock-5", name: "Daft Punk", email: "robots@daftpunk.fr", phone: "+33 1 42 27 78 89", genre: "Electronic Duo", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80", initials: "DP", avatarBg: "bg-emerald-600", isFavorite: false, isAvails: false, claimStatus: "Verified Representative" },
  { id: "mock-6", name: "Eminem", email: "marshall@shady.com", phone: "+1 313 782 1290", genre: "Hip Hop", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80", initials: "EM", avatarBg: "bg-zinc-800", isFavorite: false, isAvails: false, claimStatus: "Pending Verification" }
];

const GLOBAL_CATALOG_ARTISTS = [
  { id: "cat-1", name: "Justin Bieber", email: "justin@bieber.com", phone: "+1 310 555 0199", genre: "Pop", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" },
  { id: "cat-2", name: "Dua Lipa", email: "dua@lipa.com", phone: "+44 20 7946 0912", genre: "Pop / Disco", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" },
  { id: "cat-3", name: "Ariana Grande", email: "ariana@grande.com", phone: "+1 212 555 0145", genre: "R&B / Pop", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80" },
  { id: "cat-4", name: "Coldplay", email: "info@coldplay.com", phone: "+44 1632 960812", genre: "Alternative Rock", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80" },
  { id: "cat-5", name: "Drake", email: "drake@octobersveryown.com", phone: "+1 416 555 0188", genre: "Hip Hop", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
  { id: "cat-6", name: "Katy Perry", email: "katy@perry.com", phone: "+1 805 555 0122", genre: "Pop", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" }
];

export default function MyArtistsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Favorites" | "Others">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);

  // Claim Artist Modal State
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  // Artists State
  const [artists, setArtists] = useState<ArtistProfile[]>([]);

  useEffect(() => {
    setMounted(true);
    // Load local storage states or seed defaults
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("local_my_artists_v3");
      if (stored) {
        try {
          setArtists(JSON.parse(stored));
        } catch (e) {
          setArtists(INITIAL_MOCK_ARTISTS);
        }
      } else {
        setArtists(INITIAL_MOCK_ARTISTS);
        localStorage.setItem("local_my_artists_v3", JSON.stringify(INITIAL_MOCK_ARTISTS));
      }
    }
  }, []);

  const saveArtists = (list: ArtistProfile[]) => {
    setArtists(list);
    localStorage.setItem("local_my_artists_v3", JSON.stringify(list));
  };

  // Submit Claim handler matching WhatsApp requirements
  const handleClaimSubmit = (claimData: ClaimArtistData) => {
    const initials = claimData.artistName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const bgColors = ["bg-rose-600", "bg-blue-600", "bg-emerald-600", "bg-purple-600", "bg-[#00AEF0]"];
    const avatarBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    const claimedArtist: ArtistProfile = {
      id: `claimed-${Date.now()}`,
      name: claimData.artistName,
      email: claimData.businessEmail || claimData.artistEmail || `${claimData.artistName.toLowerCase().replace(/\s+/g, "")}@agency.com`,
      phone: claimData.artistPhone || "N/A",
      genre: claimData.artistGenre || "Performance",
      image: claimData.artistImage || null,
      initials,
      avatarBg,
      isFavorite: false,
      isAvails: false,

      // Verification Flow
      claimStatus: "Pending Verification",
      yourName: claimData.yourName,
      companyAgency: claimData.companyAgency,
      businessEmail: claimData.businessEmail,
      role: claimData.role,
      representation: claimData.representation,
      verificationMethod: claimData.verificationMethod,
      rosterUrl: claimData.rosterUrl,
      confirmationEmail: claimData.confirmationEmail,
      uploadedFileName: claimData.uploadedFileName,
      note: claimData.note,
    };

    saveArtists([claimedArtist, ...artists]);
    toast.success(`Claim submitted for ${claimData.artistName}! Status: Pending Verification.`);
  };

  // Toggle Verification status for demo/phase progression
  const handleToggleVerificationStatus = (artistId: string) => {
    const updated = artists.map((a) => {
      if (a.id === artistId) {
        const nextStatus: "Pending Verification" | "Verified Representative" =
          a.claimStatus === "Verified Representative"
            ? "Pending Verification"
            : "Verified Representative";

        toast.success(
          nextStatus === "Verified Representative"
            ? `${a.name} verified as Verified Representative!`
            : `Status changed to Pending Verification for ${a.name}.`
        );
        return { ...a, claimStatus: nextStatus };
      }
      return a;
    });
    saveArtists(updated);
    setActiveDropdownId(null);
  };

  // Filter based on search query and active tab
  const filteredArtists = useMemo(() => {
    return artists.filter((artist) => {
      // Search query match
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          artist.name.toLowerCase().includes(query) ||
          artist.email.toLowerCase().includes(query) ||
          artist.phone.toLowerCase().includes(query) ||
          artist.genre.toLowerCase().includes(query) ||
          (artist.companyAgency && artist.companyAgency.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Tab match
      if (activeTab === "Favorites") {
        return artist.isFavorite;
      }
      if (activeTab === "Others") {
        const g = artist.genre.toLowerCase();
        return g.includes("other") || g.includes("wave") || g.includes("electronic") || g.includes("duo");
      }

      return true;
    });
  }, [artists, searchQuery, activeTab]);

  // Pagination bounds
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredArtists.length / itemsPerPage) || 1;
  const paginatedArtists = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredArtists.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredArtists, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const handleToggleFavorite = (artist: ArtistProfile) => {
    const updated = artists.map((a) => {
      if (a.id === artist.id) {
        const nextState = !a.isFavorite;
        toast.success(nextState ? `Added ${a.name} to Favorites!` : `Removed ${a.name} from Favorites.`);
        return { ...a, isFavorite: nextState };
      }
      return a;
    });
    saveArtists(updated);
  };

  const handleAddToAvails = (artist: ArtistProfile) => {
    const updated = artists.map((a) => {
      if (a.id === artist.id) {
        const nextState = !a.isAvails;
        toast.success(nextState ? `Added ${a.name} to Avails!` : `Removed ${a.name} from Avails.`);
        return { ...a, isAvails: nextState };
      }
      return a;
    });
    saveArtists(updated);
  };

  const handleMessage = (artist: ArtistProfile) => {
    toast.success(`Opening conversation with ${artist.name}...`);
    router.push("/dashboard/messages");
  };

  const handleDelete = (id: string) => {
    saveArtists(artists.filter((a) => a.id !== id));
    toast.success("Artist deleted from roster.");
    setActiveDropdownId(null);
  };

  if (!mounted) {
    return <LogoLoader fullScreen={true} text="Loading agents dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 lg:p-10 w-full space-y-8 pb-32 font-sans relative">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">My Agents</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your claimed artists & representation verification</p>
        </div>

        <button
          onClick={() => setIsClaimModalOpen(true)}
          className="h-11 px-5 rounded-[12px] bg-[#00AEF0] hover:bg-[#009bde] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-cyan-500/10 hover:scale-[1.01] active:scale-[0.99] shrink-0 w-full sm:w-auto"
        >
          <Plus size={16} />
          Claim Artist
        </button>
      </div>

      {/* FILTER ROW: Tabs on the left, Search bar on the right */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 w-full">
        <div className="flex items-center border-[1.24px] border-[#FFFFFF]/8 bg-[#FFFFFF]/[0.02] rounded-[14px] p-[4px] overflow-x-auto no-scrollbar w-full sm:w-auto">
          {[
            { label: "All Artists", tabKey: "All" as const },
            { label: "Favourites", tabKey: "Favorites" as const },
            { label: "Other...", tabKey: "Others" as const }
          ].map((tab) => {
            const isSelected = activeTab === tab.tabKey;
            return (
              <button
                key={tab.tabKey}
                onClick={() => setActiveTab(tab.tabKey)}
                className={`flex-1 sm:flex-none flex items-center justify-center h-10 px-6 gap-2 font-bold text-xs sm:text-sm shrink-0 transition-all cursor-pointer rounded-[10px] ${isSelected
                  ? "bg-[#00AEF0] text-white shadow-md shadow-cyan-500/10"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.01]"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search bar */}
        <div className="relative w-full lg:max-w-xs shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search artists by name, agency..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-[12px] bg-[#FFFFFF]/[0.02] border border-white/5 text-zinc-300 placeholder-zinc-500 text-sm focus:border-[#00AEF0] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* ARTISTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {paginatedArtists.length > 0 ? (
          paginatedArtists.map((artist) => {
            const status = artist.claimStatus || "Verified Representative";
            const isVerified = status === "Verified Representative";
            const isExpanded = expandedDetailsId === artist.id;

            return (
              <div
                key={artist.id}
                className="bg-[#121218] border border-white/5 rounded-2xl p-5 hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between relative group hover:shadow-[0_0_24px_rgba(0,174,240,0.03)]"
              >
                {/* Status Badge Header Row */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        <ShieldCheck size={12} /> Verified Representative
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
                        <Clock size={12} /> Pending Verification
                      </span>
                    )}
                  </div>

                  {artist.companyAgency && (
                    <span className="text-[10px] text-zinc-400 font-semibold truncate max-w-[120px] flex items-center gap-1">
                      <Building size={10} className="text-[#00AEF0]" /> {artist.companyAgency}
                    </span>
                  )}
                </div>

                {/* Card Profile Row */}
                <div className="flex gap-4">
                  {/* Profile Picture */}
                  {artist.image ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 bg-zinc-950 shrink-0">
                      <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 ${artist.avatarBg}`}>
                      {artist.initials}
                    </div>
                  )}

                  {/* Profile Details */}
                  <div className="min-w-0 flex-1 leading-snug">
                    <h3 className="text-base font-bold text-white truncate flex items-center gap-1.5">
                      {artist.name}
                      {isVerified && <CheckCircle2 className="w-4 h-4 text-[#00AEF0] shrink-0" />}
                    </h3>

                    {artist.email ? (
                      <a
                        href={`mailto:${artist.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-zinc-400 hover:text-[#00AEF0] text-xs block mt-1 truncate transition-colors cursor-pointer"
                      >
                        {artist.email}
                      </a>
                    ) : (
                      <span className="text-zinc-600 text-xs block mt-1 truncate">N/A</span>
                    )}

                    {artist.phone && artist.phone !== "N/A" ? (
                      <a
                        href={`tel:${artist.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-zinc-400 hover:text-[#00AEF0] text-xs block mt-0.5 truncate transition-colors cursor-pointer"
                      >
                        {artist.phone}
                      </a>
                    ) : (
                      <span className="text-zinc-600 text-xs block mt-0.5 truncate">N/A</span>
                    )}

                    {artist.genre && (
                      <span className="inline-block mt-2.5 px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-[#00AEF0]">
                        {artist.genre}
                      </span>
                    )}
                  </div>
                </div>

                {/* Display Claimed Representative Info inside card per Troy's spec */}
                {(isVerified || isExpanded) && (artist.yourName || artist.role || artist.representation) && (
                  <div className="mt-3.5 p-3 rounded-xl bg-zinc-950/80 border border-white/5 space-y-1 text-[11px]">
                    <div className="text-zinc-400 font-semibold flex items-center justify-between">
                      <span>Representative Details:</span>
                      {artist.representation && (
                        <span className="text-[10px] text-[#00AEF0] font-bold flex items-center gap-0.5">
                          <Globe size={10} /> {artist.representation}
                        </span>
                      )}
                    </div>
                    {artist.yourName && (
                      <div className="text-zinc-300 truncate">
                        <strong>Name:</strong> {artist.yourName} {artist.role ? `(${artist.role})` : ""}
                      </div>
                    )}
                    {artist.businessEmail && (
                      <div className="text-zinc-400 truncate">
                        <strong>Email:</strong> {artist.businessEmail}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Toolbar Row */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4 select-none">
                  <div className="flex items-center gap-3">
                    {/* Message Action */}
                    <button
                      onClick={() => handleMessage(artist)}
                      className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-800 flex items-center justify-center text-[#00AEF0] transition-colors cursor-pointer"
                      title="Send Message"
                    >
                      <MessageSquare size={14} />
                    </button>

                    {/* Favorite Action */}
                    <button
                      onClick={() => handleToggleFavorite(artist)}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${artist.isFavorite
                        ? "bg-red-500/10 border-red-500/20 text-red-500"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      title={artist.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <Heart size={14} fill={artist.isFavorite ? "currentColor" : "none"} />
                    </button>

                    {/* Add to Avails Action */}
                    <button
                      onClick={() => handleAddToAvails(artist)}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${artist.isAvails
                        ? "bg-[#00AEF0]/10 border-[#00AEF0]/20 text-[#00AEF0]"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      title={artist.isAvails ? "Added to Avails" : "Add to Avails"}
                    >
                      <Bookmark size={14} fill={artist.isAvails ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* More dots dropdown action */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveDropdownId(activeDropdownId === artist.id ? null : artist.id)}
                      className="w-8 h-8 rounded-full hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {/* Dropdown Options */}
                    {activeDropdownId === artist.id && (
                      <div className="absolute right-0 bottom-full mb-1.5 w-48 bg-[#121218] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden py-1">
                        <button
                          onClick={() => handleToggleVerificationStatus(artist.id)}
                          className="w-full text-left px-3.5 py-2 text-xs text-[#00AEF0] hover:bg-zinc-900 transition-colors cursor-pointer flex items-center gap-2 font-medium"
                        >
                          <ShieldCheck size={14} />
                          {isVerified ? "Mark Pending" : "Verify Representation"}
                        </button>
                        <button
                          onClick={() => {
                            setExpandedDetailsId(isExpanded ? null : artist.id);
                            setActiveDropdownId(null);
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer flex items-center gap-2"
                        >
                          <FileText size={14} />
                          {isExpanded ? "Hide Details" : "View Rep Info"}
                        </button>
                        <button
                          onClick={() => handleDelete(artist.id)}
                          className="w-full text-left px-3.5 py-2 text-xs text-red-500 hover:text-red-400 hover:bg-zinc-900 transition-colors cursor-pointer flex items-center gap-2"
                        >
                          Delete Artist
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full border border-dashed border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[300px] text-center bg-[#121218]/10">
            <Users className="h-10 w-10 text-zinc-600 mb-3" />
            <span className="text-white font-bold block mb-1">No Artists Found</span>
            <span className="text-zinc-500 text-xs">There are no artists matching your active filter.</span>
          </div>
        )}
      </div>

      {/* PAGINATION CONTAINER */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-lg border border-zinc-850 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg font-bold text-xs cursor-pointer border ${currentPage === pageNum
                  ? "bg-[#00AEF0] border-[#00AEF0] text-white"
                  : "border-zinc-850 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-lg border border-zinc-850 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* CLAIM ARTIST MODAL */}
      <ClaimArtistModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onSubmitClaim={handleClaimSubmit}
        globalCatalog={GLOBAL_CATALOG_ARTISTS}
      />

    </div>
  );
}
