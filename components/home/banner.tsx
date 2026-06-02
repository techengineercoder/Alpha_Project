
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar as CalendarIcon, Music, Search, ChevronDown, Check } from 'lucide-react';
import { format, addDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GoogleLocationInput } from "@/components/ui/google-location-input";

import { motion } from "framer-motion";
import { useGetGenresQuery } from '@/redux/feature/artistApi/genresSlice';
export function Banner() {
  const [locationText, setLocationText] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [genre, setGenre] = useState('');
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

  const { data: genresData, isLoading: isLoadingGenres } = useGetGenresQuery(undefined);
  const genres = genresData?.results || [];

  const selectedGenreObj = genres.find((g: any) => g.slug === genre);

  console.log(selectedGenreObj);

  const router = useRouter();

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (latitude) query.set('latitude', latitude);
    if (longitude) query.set('longitude', longitude);
    if (locationText) query.set('locationText', locationText);

    if (genre) query.set('genres', genre);

    if (dateRange?.from) {
      const fromFormatted = format(dateRange.from, 'yyyy-MM-dd');

      if (dateRange.to) {
        const toFormatted = format(dateRange.to, 'yyyy-MM-dd');
        if (fromFormatted === toFormatted) {
          query.set('available_on', fromFormatted);
        } else {
          query.set('available_from', fromFormatted);
          query.set('available_to', toFormatted);
        }
      } else {
        query.set('available_on', fromFormatted);
      }
    }

    router.push(`/search?${query.toString()}`);
  };

  return (
    <section
      className="relative w-full min-h-[1013px] flex flex-col items-center justify-center px-4 md:px-8 py-20 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/image/banner.jpg')" }}
    >
      {/* Overlays */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, rgba(124, 92, 255, 0.15) 0%, rgba(0, 0, 0, 0.7) 100%)'
        }}
      ></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto mt-[-100px]">

        {/* Top Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#7C5CFF]"></span>
          <span className="text-sm font-medium text-white/90">Countless verified artists available</span>
        </motion.div>

        {/* Main Headings */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-[80px] font-bold text-center leading-tight tracking-tight mb-4"
        >
          <span className="text-white block mb-2">Book world-class artists</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#00E5FF] block pb-2">
            for your next event
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/80 text-center max-w-2xl mb-12 font-light"
        >
          Connect with top performers and make your event unforgettable
        </motion.p>

        {/* Search Bar Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-6xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 md:p-3 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-2">

            {/* ── Inputs Grid ── */}
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* ── Location ── */}
              <div
                className="relative w-full rounded-2xl group transition-colors hover:brightness-110"
                style={{
                  background: 'rgba(24, 24, 31, 0.35)',
                  border: '1.26px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                }}
              >
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-[#7C5CFF] transition-colors pointer-events-none" />
                <GoogleLocationInput
                  placeholder="Location"
                  value={locationText}
                  onChange={(val) => {
                    setLocationText(val);
                    if (!val) { setLatitude(''); setLongitude(''); }
                  }}
                  onPlaceSelected={(lat, lng, address) => {
                    setLocationText(address);
                    setLatitude(lat.toString());
                    setLongitude(lng.toString());
                  }}
                  className="w-full py-3 md:py-4 pl-[48px] pr-4 bg-transparent border-none outline-none text-white placeholder:text-white/60 focus:ring-0 rounded-2xl"
                />
              </div>

              {/* ── Date Range ── */}
              <Popover>
                <PopoverTrigger>
                  <div
                    className="w-full flex items-center gap-3 px-4 py-3 md:py-4 rounded-2xl cursor-pointer group transition-colors hover:brightness-110"
                    style={{
                      background: 'rgba(24, 24, 31, 0.35)',
                      border: '1.26px solid rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                    }}
                  >
                    <CalendarIcon className="w-5 h-5 text-white/50 group-hover:text-[#7C5CFF] transition-colors flex-shrink-0" />
                    <span className={`text-left w-full truncate ${dateRange?.from ? 'text-white' : 'text-white/60'}`}>
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>{format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}</>
                        ) : (
                          format(dateRange.from, "MMM dd, yyyy")
                        )
                      ) : (
                        <span>Date range</span>
                      )}
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#121218] border-white/10" align="center">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date("1900-01-01")}
                    className="bg-[#121218] text-[#A1A1AA]"
                    classNames={{
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-[#A1A1AA] hover:bg-white/10 hover:text-white rounded-md flex items-center justify-center transition-colors",
                      day_selected: "bg-white/10 backdrop-blur-xl text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white",
                      day_today: "bg-white/5 text-white",
                      day_outside: "text-[#A1A1AA]/50 opacity-50",
                      day_disabled: "text-[#A1A1AA]/30 opacity-50",
                      day_range_middle: "aria-selected:bg-white/10 aria-selected:backdrop-blur-xl aria-selected:text-white rounded-none",
                      day_hidden: "invisible",
                    }}
                  />
                </PopoverContent>
              </Popover>

              {/* ── Genre ── */}
              <div className="relative w-full">
                <div
                  className="flex h-full items-center justify-between px-4 py-3 md:py-4 rounded-2xl cursor-pointer group transition-colors hover:brightness-110"
                  style={{
                    background: 'rgba(24, 24, 31, 0.35)',
                    border: '1.26px solid rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                  }}
                  onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                >
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-white/50 group-hover:text-[#7C5CFF] transition-colors" />
                    <span className={`transition-colors ${genre ? 'text-white' : 'text-white/60'}`}>
                      {isLoadingGenres ? 'Loading...' : (selectedGenreObj?.name || 'Genre')}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isGenreDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {isGenreDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] max-h-[280px] overflow-y-auto custom-scrollbar bg-[rgba(24,24,31,0.85)] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col p-1.5 gap-1">
                    {genres.map((g: any) => {
                      const isSelected = genre === g.slug;
                      return (
                        <div
                          key={g.id}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-between ${isSelected
                              ? 'bg-gradient-to-r from-[#7C5CFF]/20 to-[#9D7CFF]/20 text-white border border-[#7C5CFF]/30 shadow-inner'
                              : 'text-white/70 hover:bg-white/10 hover:text-white border border-transparent'
                            }`}
                          onClick={() => {
                            setGenre(g.slug);
                            setIsGenreDropdownOpen(false);
                          }}
                        >
                          {g.name}
                          {isSelected && <Check className="w-4 h-4 text-[#7C5CFF]" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ── Search Button ── */}
            <button
              onClick={handleSearch}
              className="w-full md:w-auto h-full cursor-pointer min-h-[54px] md:min-h-[58px] border-white  border bg-gradient-to-r from-[#7C5CFF] to-[#9D7CFF] hover:bg-[#6A4BE5] text-white px-8 rounded-2xl md:rounded-[20px] font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#7C5CFF]/25"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>

          </div>
        </motion.div>
      </div>
    </section>
  );
}