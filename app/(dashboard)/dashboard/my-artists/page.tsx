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
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { LogoLoader } from "@/components/ui/logo-loader";
import { motion, AnimatePresence } from "framer-motion";

interface ArtistProfile {
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
}

const INITIAL_MOCK_ARTISTS: ArtistProfile[] = [
  { id: "mock-1", name: "Billie Eillesh", email: "billie@eillesh.com", phone: "+1 310 992 4855", genre: "Classic Rock", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80", initials: "BE", avatarBg: "bg-blue-600", isFavorite: false, isAvails: false },
  { id: "mock-2", name: "Flock of Seagulls", email: "info@seagulls.co.uk", phone: "+44 207 499 8282", genre: "80s New Wave", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80", initials: "FS", avatarBg: "bg-purple-600", isFavorite: false, isAvails: false },
  { id: "mock-3", name: "Skrillex", email: "skrillex@owla.com", phone: "+1 213 544 3290", genre: "Dubstep / EDM", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", initials: "SK", avatarBg: "bg-[#00AEF0]", isFavorite: false, isAvails: false },
  { id: "mock-4", name: "Post Malone", email: "malone@posty.com", phone: "+1 512 899 3444", genre: "Hip Hop / Pop", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80", initials: "PM", avatarBg: "bg-rose-600", isFavorite: false, isAvails: false },
  { id: "mock-5", name: "Daft Punk", email: "robots@daftpunk.fr", phone: "+33 1 42 27 78 89", genre: "Electronic Duo", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80", initials: "DP", avatarBg: "bg-emerald-600", isFavorite: false, isAvails: false },
  { id: "mock-6", name: "Eminem", email: "marshall@shady.com", phone: "+1 313 782 1290", genre: "Hip Hop", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80", initials: "EM", avatarBg: "bg-zinc-800", isFavorite: false, isAvails: false }
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
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [showManualForm, setShowManualForm] = useState(false);
  
  // Add Artist Form States
  const [newArtistName, setNewArtistName] = useState("");
  const [newArtistEmail, setNewArtistEmail] = useState("");
  const [newArtistPhone, setNewArtistPhone] = useState("");
  const [newArtistGenre, setNewArtistGenre] = useState("");
  const [newArtistImage, setNewArtistImage] = useState("");

  // Artists State
  const [artists, setArtists] = useState<ArtistProfile[]>([]);

  // Search filter for database catalog
  const modalSearchResults = useMemo(() => {
    if (!modalSearchQuery.trim()) return [];
    const query = modalSearchQuery.toLowerCase();
    return GLOBAL_CATALOG_ARTISTS.filter(
      (a) => a.name.toLowerCase().includes(query) || a.genre.toLowerCase().includes(query)
    );
  }, [modalSearchQuery]);

  const handleClaimCatalogArtist = (catArtist: typeof GLOBAL_CATALOG_ARTISTS[0]) => {
    const initials = catArtist.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
    const bgColors = ["bg-rose-600", "bg-blue-600", "bg-emerald-600", "bg-purple-600", "bg-[#00AEF0]"];
    const avatarBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    const claimedArtist: ArtistProfile = {
      id: `claimed-${catArtist.id}-${Date.now()}`,
      name: catArtist.name,
      email: catArtist.email,
      phone: catArtist.phone,
      genre: catArtist.genre,
      image: catArtist.image,
      initials,
      avatarBg,
      isFavorite: false,
      isAvails: false
    };

    saveArtists([claimedArtist, ...artists]);
    setIsAddModalOpen(false);
    setModalSearchQuery("");
    setShowManualForm(false);
    toast.success(`Successfully claimed ${catArtist.name}!`);
  };

  useEffect(() => {
    setMounted(true);
    // Load local storage states or seed defaults
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("local_my_artists_v2");
      if (stored) {
        try {
          setArtists(JSON.parse(stored));
        } catch (e) {
          setArtists(INITIAL_MOCK_ARTISTS);
        }
      } else {
        setArtists(INITIAL_MOCK_ARTISTS);
        localStorage.setItem("local_my_artists_v2", JSON.stringify(INITIAL_MOCK_ARTISTS));
      }
    }
  }, []);

  const saveArtists = (list: ArtistProfile[]) => {
    setArtists(list);
    localStorage.setItem("local_my_artists_v2", JSON.stringify(list));
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
          artist.genre.toLowerCase().includes(query);
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
    // Reset page if filters change
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Toggles Favorite status
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

  // Toggles Add to Avails
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

  const handleAddArtistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtistName.trim() || !newArtistEmail.trim()) {
      toast.error("Please enter Name and Email.");
      return;
    }

    const initials = newArtistName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
    const bgColors = ["bg-rose-600", "bg-blue-600", "bg-emerald-600", "bg-purple-600", "bg-[#00AEF0]"];
    const avatarBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    const newArtist: ArtistProfile = {
      id: `local-${Date.now()}`,
      name: newArtistName.trim(),
      email: newArtistEmail.trim(),
      phone: newArtistPhone.trim() || "N/A",
      genre: newArtistGenre.trim() || "Performance",
      image: newArtistImage.trim() || null,
      initials,
      avatarBg,
      isFavorite: false,
      isAvails: false
    };

    saveArtists([newArtist, ...artists]);
    setIsAddModalOpen(false);
    toast.success(`${newArtistName} added successfully to your roster!`);

    // Reset inputs
    setNewArtistName("");
    setNewArtistEmail("");
    setNewArtistPhone("");
    setNewArtistGenre("");
    setNewArtistImage("");
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

      {/* Header section (title and subtitle matches wireframe image) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">My Agents</h1>
          <p className="text-zinc-550 text-sm mt-1">Manage your artists</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="h-11 px-5 rounded-[12px] bg-[#00AEF0] hover:bg-[#009bde] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-cyan-500/10 hover:scale-[1.01] active:scale-[0.99] shrink-0 w-full sm:w-auto"
        >
          <Plus size={16} />
          Claim Artist
        </button>
      </div>

      {/* FILTER ROW: Tabs on the left, Search bar on the right */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 w-full">
        {/* Tabs filters matches wireframe */}
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

        {/* Search bar matches wireframe */}
        <div className="relative w-full lg:max-w-xs shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search artists by name, genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-[12px] bg-[#FFFFFF]/[0.02] border border-white/5 text-zinc-300 placeholder-zinc-550 text-sm focus:border-[#00AEF0] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* ARTISTS GRID WITH PREMIUM CARD DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {paginatedArtists.length > 0 ? (
          paginatedArtists.map((artist) => (
            <div
              key={artist.id}
              className="bg-[#121218] border border-white/5 rounded-2xl p-5 hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between relative group hover:shadow-[0_0_24px_rgba(0,174,240,0.03)]"
            >
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

                {/* Profile details */}
                <div className="min-w-0 flex-1 leading-snug">
                  <h3 className="text-base font-bold text-white truncate">{artist.name}</h3>
                  {artist.email ? (
                    <a
                      href={`mailto:${artist.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-zinc-550 hover:text-[#00AEF0] text-xs block mt-1 truncate transition-colors cursor-pointer"
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
                      className="text-zinc-550 hover:text-[#00AEF0] text-xs block mt-0.5 truncate transition-colors cursor-pointer"
                    >
                      {artist.phone}
                    </a>
                  ) : (
                    <span className="text-zinc-650 text-xs block mt-0.5 truncate">N/A</span>
                  )}
                  {artist.genre && (
                    <span className="inline-block mt-2.5 px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-[#00AEF0]">
                      {artist.genre}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Toolbar Row matches wireframe layout */}
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
                    <div className="absolute right-0 bottom-full mb-1.5 w-32 bg-[#121218] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden py-1">
                      <button
                        onClick={() => {
                          toast.info(`Editing profile is a mock feature.`);
                          setActiveDropdownId(null);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={() => handleDelete(artist.id)}
                        className="w-full text-left px-3.5 py-2 text-xs text-red-500 hover:text-red-400 hover:bg-zinc-900 transition-colors cursor-pointer"
                      >
                        Delete Artist
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full border border-dashed border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[300px] text-center bg-[#121218]/10">
            <Users className="h-10 w-10 text-zinc-650 mb-3" />
            <span className="text-white font-bold block mb-1">No Artists Found</span>
            <span className="text-zinc-550 text-xs">There are no artists matching your active filter.</span>
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
                    : "border-zinc-850 text-zinc-450 hover:bg-zinc-900 hover:text-white"
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

      {/* ADD ARTIST MODAL POPUP */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000]"
            />

            {/* Modal Box */}
            <div className="fixed inset-0 z-[2001] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md bg-[#121218] border border-white/10 rounded-[24px] p-6 shadow-2xl flex flex-col font-sans"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Plus className="text-[#00AEF0] h-5 w-5" /> Claim New Artist
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setModalSearchQuery("");
                      setShowManualForm(false);
                    }}
                    className="p-1 text-zinc-550 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-zinc-900"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Search Input for Catalog */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Search Database</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Search catalog by name, e.g. Justin, Dua..."
                        value={modalSearchQuery}
                        onChange={(e) => {
                          setModalSearchQuery(e.target.value);
                          if (showManualForm) setShowManualForm(false);
                        }}
                        className="w-full h-11 pl-9 pr-4 rounded-[12px] bg-zinc-950 border border-zinc-800 focus:border-[#00AEF0] focus:outline-none text-zinc-300 placeholder-zinc-650 text-sm transition-colors"
                      />
                    </div>
                  </div>

                  {/* Search Results */}
                  {modalSearchQuery.trim().length > 0 && (
                    <div className="space-y-2 max-h-[160px] overflow-y-auto no-scrollbar">
                      {modalSearchResults.length > 0 ? (
                        modalSearchResults.map((catArtist) => {
                          const alreadyClaimed = artists.some(a => a.name.toLowerCase() === catArtist.name.toLowerCase());
                          return (
                            <div key={catArtist.id} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-white/5">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img src={catArtist.image} alt={catArtist.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/10" />
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-white truncate">{catArtist.name}</div>
                                  <div className="text-[10px] text-zinc-550 truncate">{catArtist.genre}</div>
                                </div>
                              </div>
                              <button
                                type="button"
                                disabled={alreadyClaimed}
                                onClick={() => handleClaimCatalogArtist(catArtist)}
                                className={`h-8 px-3.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  alreadyClaimed 
                                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                                    : "bg-[#00AEF0] hover:bg-[#009bde] text-white"
                                }`}
                              >
                                {alreadyClaimed ? "Claimed" : "Claim"}
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-xs text-zinc-500 italic py-1">No matching artist found in database. Fill out the form below to claim manually.</div>
                      )}
                    </div>
                  )}

                  {/* Divider or Manual Section trigger */}
                  {(!modalSearchQuery.trim() || modalSearchResults.length === 0) && (
                    <form onSubmit={handleAddArtistSubmit} className="space-y-4 pt-2 border-t border-white/5">
                      <div className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Claim Manually</div>
                      
                      {/* Name field */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Artist Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Charlie Puth"
                          value={newArtistName}
                          onChange={(e) => setNewArtistName(e.target.value)}
                          className="w-full h-11 px-4 rounded-[12px] bg-zinc-950 border border-zinc-800 focus:border-[#00AEF0] focus:outline-none text-zinc-350 placeholder-zinc-650 text-sm transition-colors"
                        />
                      </div>

                      {/* Email field */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. charlie@puth.com"
                          value={newArtistEmail}
                          onChange={(e) => setNewArtistEmail(e.target.value)}
                          className="w-full h-11 px-4 rounded-[12px] bg-zinc-950 border border-zinc-800 focus:border-[#00AEF0] focus:outline-none text-zinc-350 placeholder-zinc-650 text-sm transition-colors"
                        />
                      </div>

                      {/* Phone field */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Phone Number</label>
                        <input
                          type="text"
                          placeholder="e.g. +1 555 123 4567"
                          value={newArtistPhone}
                          onChange={(e) => setNewArtistPhone(e.target.value)}
                          className="w-full h-11 px-4 rounded-[12px] bg-zinc-950 border border-zinc-800 focus:border-[#00AEF0] focus:outline-none text-zinc-350 placeholder-zinc-650 text-sm transition-colors"
                        />
                      </div>

                      <div className="flex gap-4 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddModalOpen(false);
                            setModalSearchQuery("");
                          }}
                          className="flex-1 py-3.5 rounded-[12px] bg-zinc-900 border border-zinc-800 text-white text-sm font-medium hover:bg-zinc-850 hover:border-zinc-700 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3.5 rounded-[12px] bg-[#00AEF0] hover:bg-[#009bde] text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
                        >
                          Claim Artist
                        </button>
                      </div>
                    </form>
                  )}

                  {/* If search matched something, we can still have a button to show manual form if they prefer */}
                  {modalSearchQuery.trim().length > 0 && modalSearchResults.length > 0 && !showManualForm && (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setShowManualForm(true)}
                        className="text-xs text-zinc-450 hover:text-[#00AEF0] transition-colors underline cursor-pointer"
                      >
                        Not found? Claim manually instead
                      </button>
                    </div>
                  )}

                  {showManualForm && modalSearchQuery.trim().length > 0 && modalSearchResults.length > 0 && (
                    <form onSubmit={handleAddArtistSubmit} className="space-y-4 pt-4 border-t border-white/5">
                      <div className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Claim Manually</div>
                      
                      {/* Name field */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Artist Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Charlie Puth"
                          value={newArtistName}
                          onChange={(e) => setNewArtistName(e.target.value)}
                          className="w-full h-11 px-4 rounded-[12px] bg-zinc-950 border border-zinc-800 focus:border-[#00AEF0] focus:outline-none text-zinc-350 placeholder-zinc-650 text-sm transition-colors"
                        />
                      </div>

                      {/* Email field */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. charlie@puth.com"
                          value={newArtistEmail}
                          onChange={(e) => setNewArtistEmail(e.target.value)}
                          className="w-full h-11 px-4 rounded-[12px] bg-zinc-950 border border-zinc-800 focus:border-[#00AEF0] focus:outline-none text-zinc-350 placeholder-zinc-650 text-sm transition-colors"
                        />
                      </div>

                      {/* Phone field */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Phone Number</label>
                        <input
                          type="text"
                          placeholder="e.g. +1 555 123 4567"
                          value={newArtistPhone}
                          onChange={(e) => setNewArtistPhone(e.target.value)}
                          className="w-full h-11 px-4 rounded-[12px] bg-zinc-950 border border-zinc-800 focus:border-[#00AEF0] focus:outline-none text-zinc-350 placeholder-zinc-650 text-sm transition-colors"
                        />
                      </div>

                      <div className="flex gap-4 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowManualForm(false);
                          }}
                          className="flex-1 py-3.5 rounded-[12px] bg-zinc-900 border border-zinc-800 text-white text-sm font-medium hover:bg-zinc-850 hover:border-zinc-700 transition-all cursor-pointer"
                        >
                          Back to Search
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3.5 rounded-[12px] bg-[#00AEF0] hover:bg-[#009bde] text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
                        >
                          Claim Artist
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
