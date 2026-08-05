"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Search,
  Share2,
  Plus,
  MoreHorizontal,
  MapPin,
  X,
  ExternalLink,
  Edit,
  Trash2,
  Calendar,
  User,
  BadgeAlert
} from "lucide-react";
import { toast } from "sonner";

interface Artist {
  id: string;
  name: string;
  genre: string;
  status: string; // number of open dates
  isNational: boolean;
  location: string;
  image: string;
  availableDates: {
    [month: string]: number[];
  };
}

export default function AvailsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddArtistOpen, setIsAddArtistOpen] = useState(false);

  // Get dynamic title based on ID, defaulting to "East Coast Summer"
  const availTitle = useMemo(() => {
    if (id.startsWith("rec-1")) return "East Coast Summer";
    if (id.startsWith("rec-2")) return "Festival Season 2026";
    if (id.startsWith("rec-3")) return "Available This Weekend";
    if (id.startsWith("rec-4")) return "Rock Artists";
    if (id.startsWith("rec-5")) return "Classic Rock Legends";
    if (id.startsWith("rec-6")) return "Tribute Acts";
    if (id.startsWith("rec-7")) return "Southwest Routing";
    if (id.startsWith("rec-8")) return "Fall Bookings";
    return "East Coast Summer"; // Default fallback
  }, [id]);

  // Roster of artists state
  const [artists, setArtists] = useState<Artist[]>([]);

  // Card action menu dropdown state
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Add Artist Form State
  const [newName, setNewName] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newOpenDatesCount, setNewOpenDatesCount] = useState("10");

  useEffect(() => {
    setMounted(true);

    // Initial artist listings matching Eillesh and Seagulls from image
    const initialArtists: Artist[] = [
      {
        id: "art-1",
        name: "Billie Eillesh",
        genre: "Classic Rock",
        status: "21",
        isNational: true,
        location: "Los Angeles, CA",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
        availableDates: {
          Jul: [18, 19, 20],
          Aug: [1, 2, 8, 15],
          Sep: [5, 11, 12, 18],
          Oct: [3, 24, 31],
          Nov: [6, 7, 14]
        }
      },
      {
        id: "art-2",
        name: "Flock of Seagulls",
        genre: "80s New Wave",
        status: "18",
        isNational: true,
        location: "London, UK",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80",
        availableDates: {
          Jul: [17, 18],
          Aug: [1, 8, 22],
          Sep: [5, 6, 12, 26],
          Oct: [17, 23, 24],
          Nov: [20, 21]
        }
      },
      // Generate remaining mock artists to total 16
      ...Array.from({ length: 14 }, (_, i) => {
        const names = [
          "The Midnight", "Jungle", "Chappell Roan", "Glass Animals", "Fred Again..", 
          "Rufus Du Sol", "Phoenix", "LCD Soundsystem", "Disclosure", "Empire of the Sun",
          "Kavinsky", "Lorde", "Justice", "Daft Punk Tribute"
        ];
        const genres = ["Synthwave", "Neo-Soul", "Pop/Indie", "Indie Pop", "Electronic", "House", "Indie Rock", "Dance/Punk", "Garage", "Indie Dance", "Outrun", "Art Pop", "French House", "Electronic Tribute"];
        const locations = ["Los Angeles, CA", "London, UK", "Austin, TX", "Oxford, UK", "London, UK", "Sydney, AU", "Versailles, FR", "Brooklyn, NY", "Surrey, UK", "Sydney, AU", "Paris, FR", "Auckland, NZ", "Paris, FR", "Chicago, IL"];
        
        return {
          id: `art-extra-${i}`,
          name: names[i % names.length],
          genre: genres[i % genres.length],
          status: String(12 + (i % 15)),
          isNational: i % 3 !== 0,
          location: locations[i % locations.length],
          image: `https://images.unsplash.com/photo-${1500000000000 + (i * 100000)}?w=400&q=80`,
          availableDates: {
            Jul: [4, 12, 25],
            Aug: [2, 16, 29],
            Sep: [9, 10, 22],
            Oct: [8, 19, 30]
          }
        };
      })
    ];

    setArtists(initialArtists);
  }, []);

  // Filter artists based on search
  const filteredArtists = useMemo(() => {
    return artists.filter((art) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        art.name.toLowerCase().includes(q) ||
        art.genre.toLowerCase().includes(q) ||
        art.location.toLowerCase().includes(q)
      );
    });
  }, [artists, searchQuery]);

  // Share link copy action
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Details page link copied to clipboard!");
  };

  // Add artist to state
  const handleAddArtist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Please enter an artist name");
      return;
    }

    const newArtItem: Artist = {
      id: `art-custom-${Date.now()}`,
      name: newName.trim(),
      genre: newGenre.trim() || "Electronic",
      status: newOpenDatesCount || "12",
      isNational: true,
      location: newLocation.trim() || "Los Angeles, CA",
      image: newImage.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
      availableDates: {
        Jul: [10, 11, 20],
        Aug: [4, 18, 25],
        Sep: [2, 15, 28]
      }
    };

    setArtists([newArtItem, ...artists]);
    setIsAddArtistOpen(false);
    toast.success(`${newName} added to list!`);

    // Reset Form
    setNewName("");
    setNewGenre("");
    setNewLocation("");
    setNewImage("");
    setNewOpenDatesCount("10");
  };

  // Delete artist
  const handleDeleteArtist = (id: string) => {
    setArtists(artists.filter((a) => a.id !== id));
    setActiveDropdownId(null);
    toast.success("Artist removed from this list");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] p-4 sm:p-6 md:p-8 lg:p-10 w-full space-y-6 sm:space-y-8 pb-20 font-sans text-white">
      
      {/* Back Button Link */}
      <div>
        <button
          onClick={() => router.push("/dashboard/avails")}
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-xs sm:text-sm font-semibold cursor-pointer"
        >
          <ChevronLeft size={16} />
          Back to Avails Lists
        </button>
      </div>

      {/* 1. Header Section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {availTitle}
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base">
          Here are current avails for our artists. Feel free to reach out with any interest.
        </p>
      </div>

      {/* 2. Action & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        
        {/* Left: Search input */}
        <div className="relative group w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-zinc-400 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121214] border border-zinc-800/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#00A5E5]/50 focus:ring-1 focus:ring-[#00A5E5]/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleShare}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 border border-zinc-800 hover:border-zinc-700 bg-[#121214]/65 hover:bg-zinc-800 text-zinc-300 font-semibold py-2.5 px-4 rounded-xl text-sm transition-all cursor-pointer"
          >
            <Share2 size={15} />
            Share Avails
          </button>
          
          <button
            onClick={() => setIsAddArtistOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#00A5E5] hover:bg-[#0092CB] active:scale-95 transition-all text-white font-semibold py-2.5 px-4 rounded-xl text-sm shadow-[0_0_20px_rgba(0,165,229,0.2)] cursor-pointer"
          >
            <Plus size={16} className="stroke-[2.5]" />
            Add Artist
          </button>
        </div>
      </div>

      {/* 3. Badge Counter label */}
      <div className="flex items-center gap-2.5 pt-2 select-none">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Artists</span>
        <span className="bg-[#00A5E5]/15 text-[#00A5E5] px-2 py-0.5 rounded-full text-xs font-bold font-mono">
          {artists.length}
        </span>
      </div>

      {/* 4. Roster Artist Cards List */}
      <div className="space-y-6">
        {filteredArtists.length > 0 ? (
          filteredArtists.map((artist) => (
            <div
              key={artist.id}
              className="w-full lg:h-[284.79px] rounded-[19.77px] border-[1.24px] border-white/[0.04] border-t-white/[0.08] bg-white/[0.03] backdrop-blur lg:py-0 lg:pl-[28.42px] lg:pr-[28.42px] p-6 hover:border-zinc-700/80 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-0 relative group"
            >
              
              {/* Left Column: Avatar & Basic Details */}
              <div className="flex items-center gap-[24px] lg:w-[35%] py-0">
                {/* Artist Photo */}
                <div className="w-[169px] h-[199px] rounded-[8px] overflow-hidden shrink-0 bg-zinc-800 border border-white/5 shadow-md">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
                
                {/* Meta details */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-white text-lg sm:text-xl line-clamp-1 tracking-wide">
                    {artist.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium">
                    {artist.genre}
                  </p>
                  
                  {artist.isNational && (
                    <span className="inline-block bg-[#00A5E5]/[0.08] border border-[#00A5E5]/20 text-[#00A5E5] px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mt-1 select-none">
                      National
                    </span>
                  )}
                  
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] sm:text-xs pt-1">
                    <MapPin size={13} className="shrink-0 text-zinc-650" />
                    <span>{artist.location}</span>
                  </div>
                </div>
              </div>

              {/* Vertical Separator 1 */}
              <div className="hidden lg:block w-px bg-white/[0.05] h-[199px] self-center" />

              {/* Middle Column: Available Dates Grid */}
              <div className="flex-1 lg:px-8 border-t lg:border-t-0 border-white/5 pt-6 lg:pt-0">
                <div className="text-[12.36px] leading-[18.53px] font-semibold text-[#71717A] tracking-[0.99px] uppercase mb-4 select-none">
                  Available Dates
                </div>

                <div className="flex flex-col gap-3">
                  {Object.entries(artist.availableDates).map(([month, dates]) => (
                    <div key={month} className="flex items-center gap-4">
                      {/* Month column prefix */}
                      <span className="text-xs font-bold text-zinc-400 uppercase inline-block w-8 tracking-wider shrink-0 select-none">
                        {month}
                      </span>
                      
                      {/* Grid lists of date badges */}
                      <div className="flex flex-wrap gap-x-[6px] gap-y-[8px]">
                        {dates.map((date) => (
                          <div
                            key={date}
                            className="h-[32.12px] min-w-[41.71px] pt-[3.71px] pb-[3.71px] pl-[11.12px] pr-[11.12px] gap-[3.71px] rounded-[7.41px] bg-white/[0.06] border-[1.24px] border-white/5 border-t-white/[0.10] hover:bg-white/10 hover:border-zinc-700/60 flex items-center justify-center text-xs text-[#E5E5EA] font-semibold transition-all cursor-pointer select-none"
                          >
                            {date}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vertical Separator 2 */}
              <div className="hidden lg:block w-px bg-white/[0.05] h-[199px] self-center" />

              {/* Right Column: Status Summary */}
              <div className="lg:w-[22%] lg:pl-8 flex flex-col justify-center border-t lg:border-t-0 border-white/5 pt-6 lg:pt-0 min-h-[100px] lg:min-h-0 relative">
                
                <div className="space-y-1">
                  <div className="text-[12.36px] leading-[18.53px] font-semibold text-[#71717A] tracking-[0.99px] uppercase select-none">
                    Status
                  </div>
                  <div
                    className="text-[29.65px] leading-[29.65px] font-bold text-white tracking-[0px]"
                    style={{ fontFamily: "Cousine, monospace" }}
                  >
                    {artist.status}
                  </div>
                  <div className="text-[13.59px] leading-[20.39px] font-normal text-[#71717A] tracking-[0px] lowercase">
                    open dates
                  </div>
                </div>

                {/* Dot Actions Menu on Card top-right */}
                <div className="absolute top-0 right-0">
                  <button
                    onClick={() => {
                      setActiveDropdownId(activeDropdownId === artist.id ? null : artist.id);
                    }}
                    className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-zinc-450 hover:text-white transition-all active:scale-95 cursor-pointer"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {/* Dropdown menu */}
                  {activeDropdownId === artist.id && (
                    <div className="absolute right-0 mt-1.5 w-40 bg-[#161619] border border-zinc-800/80 rounded-xl shadow-2xl py-1 z-35 text-left backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-150">
                      <button
                        onClick={() => {
                          toast.info("Edit dates interface coming soon!");
                          setActiveDropdownId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:text-white hover:bg-white/[0.04] text-xs font-semibold transition-colors text-left"
                      >
                        <Edit size={12} className="text-zinc-500" />
                        Edit Dates
                      </button>
                      <button
                        onClick={() => handleDeleteArtist(artist.id)}
                        className="w-full flex items-center gap-2 px-3.5 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.04] text-xs font-semibold transition-colors text-left"
                      >
                        <Trash2 size={12} className="text-rose-500" />
                        Remove Artist
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white/[0.02] border border-white/5 rounded-[20px] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <Search size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-zinc-200">No artists found</h3>
              <p className="text-zinc-500 text-xs sm:text-sm">
                Try searching for another name or category.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 5. MODAL: Add Artist to Roster */}
      {isAddArtistOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-zinc-800 rounded-[24px] max-w-md w-full overflow-hidden shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Add Artist to Avail List</h3>
              <button
                onClick={() => setIsAddArtistOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleAddArtist} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Artist Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Billie Eilish"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#1A1A1E] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-[#00A5E5] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Genre / Sub-category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Synth-pop / Indie Rock"
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className="w-full bg-[#1A1A1E] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-[#00A5E5] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Los Angeles, CA"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-[#1A1A1E] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-[#00A5E5] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  placeholder="Leave empty for default portrait"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full bg-[#1A1A1E] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-[#00A5E5] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Open Dates Count
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={newOpenDatesCount}
                  onChange={(e) => setNewOpenDatesCount(e.target.value)}
                  className="w-full bg-[#1A1A1E] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-[#00A5E5] transition-all"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddArtistOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-850 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00A5E5] hover:bg-[#0092CB] text-sm font-bold text-white transition-all shadow-lg cursor-pointer"
                >
                  Add Artist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
