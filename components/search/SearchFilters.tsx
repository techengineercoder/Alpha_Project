"use client";

import React, { useState } from 'react';
import { SlidersHorizontal, Search, MapPin, ChevronDown, Check, LocateFixed } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { type DateRange } from "react-day-picker";
import { GoogleLocationInput } from "@/components/ui/google-location-input";
import { useGetGenresQuery } from "@/redux/feature/artistApi/genresSlice";

export type SearchFiltersState = {
  q: string;
  genres: string;
  radius_miles: string;
  latitude: string;
  longitude: string;
  available_start: string;
  available_end: string;
  favorites_only: boolean;
  locationText: string;
  type?: string;
};

export function SearchFilters({
  filters,
  onChange,
  onApply,
  onReset
}: {
  filters: SearchFiltersState;
  onChange: (updates: Partial<SearchFiltersState>) => void;
  onApply: () => void;
  onReset: () => void;
}) {
  const lookingFor = filters.type || 'artists';
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

  const { data: genresData, isLoading: isLoadingGenres } = useGetGenresQuery(undefined);
  const genres = genresData?.results || [];

  const selectedGenreObj = genres.find((g: any) => g.slug === filters.genres);

  React.useEffect(() => {
    if (!filters.locationText?.trim() && (filters.latitude || filters.longitude)) {
      onChange({ latitude: '', longitude: '' });
    }
  }, [filters.locationText, filters.latitude, filters.longitude, onChange]);

  // Request location when component mounts (user enters website)
  React.useEffect(() => {
    if (!filters.locationText && !filters.latitude && !filters.longitude) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            onChange({
              locationText: "Current Location",
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString(),
            });
          },
          (error) => {
            console.error("Automatic location access denied/failed:", error);
          }
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onChange({
            locationText: "Current Location",
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
            // Ensure radius has a default if empty, so the user sees results based on radius
            radius_miles: filters.radius_miles || '50'
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 bg-[#121218] border border-white/5 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <SlidersHorizontal className="w-5 h-5" />
          <h2 className="text-lg font-bold">Filters</h2>
        </div>
        <button
          onClick={onReset}
          className="text-[#A1A1AA] text-xs hover:text-white underline decoration-white/20 underline-offset-4 transition-colors">
          Reset Filter
        </button>
      </div>

      {/* I'm looking for */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-[#A1A1AA]">I&apos;m looking for</label>
        <div className="flex  p-1 gap-2  ">
          <button
            onClick={() => onChange({ type: 'artists' })}
            className={`flex-1 py-2.5 text-sm font-medium rounded  border border-white/10 cursor-pointer transition-all ${lookingFor === 'artists' ? 'border-[#00A5E5]/10 bg-[#00A5E5] text-white shadow-lg shadow-[#00A5E5]/20' : 'text-[#A1A1AA] hover:text-white'
              }`}
          >
            Find Artists
          </button>
          <button
            onClick={() => onChange({ type: 'venue' })}
            className={`flex-1 py-2.5 text-sm font-medium rounded transition-all ${lookingFor === 'venue' ? 'border-[#00A5E5]/10 bg-[#00A5E5] text-white shadow-lg shadow-[#00A5E5]/20' : 'text-[#A1A1AA] hover:text-white'
              }`}
          >
            Find Venue
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
        <input
          type="text"
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Search Artist..."
          className="w-full bg-[#121218] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-[#A1A1AA]/50 focus:outline-none focus:border-[#9D7CFF]/50 transition-colors"
        />
      </div>

      {/* Location Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#A1A1AA]">Location</label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
          <GoogleLocationInput
            value={filters.locationText}
            onChange={(val) => onChange({ locationText: val })}
            onPlaceSelected={(lat, lng, address) => {
              onChange({
                locationText: address,
                latitude: lat.toString(),
                longitude: lng.toString()
              });
            }}
            placeholder="e.g. New York, NY"
            className="w-full bg-[#121218] border border-white/5 rounded-xl py-3 pl-11 pr-10 text-sm text-white placeholder:text-[#A1A1AA]/50 focus:outline-none focus:border-[#9D7CFF]/50 transition-colors"
          />
          <button
            onClick={handleGetCurrentLocation}
            title="Use Current Location"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#A1A1AA] hover:text-[#7C5CFF] transition-colors"
          >
            <LocateFixed className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Radius */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#A1A1AA]">Radius</label>
        <div className="flex gap-2">
          {['50', '100', '200', '400'].map((val) => (
            <button
              key={val}
              onClick={() => {
                if (!filters.latitude && !filters.longitude) {
                  if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        onChange({
                          radius_miles: val,
                          locationText: "Current Location",
                          latitude: position.coords.latitude.toString(),
                          longitude: position.coords.longitude.toString(),
                        });
                      },
                      (error) => {
                        onChange({ radius_miles: val });
                      }
                    );
                  } else {
                    onChange({ radius_miles: val });
                  }
                } else {
                  onChange({ radius_miles: val });
                }
              }}
              className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${filters.radius_miles === val
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-[#121218] border-white/5 text-[#A1A1AA] hover:border-white/20 hover:text-white'
                }`}
            >
              {val} mi
            </button>
          ))}
        </div>
      </div>

      {/* Genres */}
      {lookingFor === 'artists' && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#A1A1AA]">Genres</label>
          <div className="relative w-full">
            <div
              className="w-full flex items-center justify-between bg-[#121218] border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#9D7CFF]/50 cursor-pointer transition-colors group"
              onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
            >
              <span className={filters.genres ? 'text-white' : 'text-[#A1A1AA]/50'}>
                {isLoadingGenres ? 'Loading...' : (selectedGenreObj?.name || 'All Genres')}
              </span>
              <ChevronDown className={`w-4 h-4 text-[#A1A1AA] group-hover:text-white transition-transform ${isGenreDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isGenreDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full max-h-[280px] overflow-y-auto custom-scrollbar bg-[#121218] border border-white/10 rounded-xl shadow-2xl z-50 flex flex-col p-1.5 gap-1">
                <div
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-between ${!filters.genres
                    ? 'bg-gradient-to-r from-[#7C5CFF]/20 to-[#9D7CFF]/20 text-white border border-[#7C5CFF]/30 shadow-inner'
                    : 'text-[#A1A1AA] hover:bg-white/10 hover:text-white border border-transparent'
                    }`}
                  onClick={() => {
                    onChange({ genres: '' });
                    setIsGenreDropdownOpen(false);
                  }}
                >
                  All Genres
                  {!filters.genres && <Check className="w-4 h-4 text-[#7C5CFF]" />}
                </div>

                {genres.map((g: any) => {
                  const isSelected = filters.genres === g.slug;
                  return (
                    <div
                      key={g.id}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-between ${isSelected
                        ? 'bg-gradient-to-r from-[#7C5CFF]/20 to-[#9D7CFF]/20 text-white border border-[#7C5CFF]/30 shadow-inner'
                        : 'text-[#A1A1AA] hover:bg-white/10 hover:text-white border border-transparent'
                        }`}
                      onClick={() => {
                        onChange({ genres: g.slug });
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
      )}

      {/* Favorites Checkbox */}
      {lookingFor === 'artists' && (
        <label className="flex items-center gap-3 cursor-pointer group mt-2">
          <div
            className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${filters.favorites_only ? 'bg-[#9D7CFF] border-[#9D7CFF]' : 'bg-[#121218] border-white/10 group-hover:border-white/30'
              }`}
            onClick={() => onChange({ favorites_only: !filters.favorites_only })}
          >
            {filters.favorites_only && <Check className="w-3.5 h-3.5 text-white" />}
          </div>
          <span className="text-sm font-medium text-[#A1A1AA] group-hover:text-white transition-colors">Show only favorites</span>
        </label>
      )}

      {/* Divider */}
      <div className="h-px w-full bg-white/5 my-2"></div>

      {/* Availability Filter */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#A1A1AA]">Filter</span>
          <button
            onClick={() => onChange({ available_start: '', available_end: '' })}
            className="text-[#A1A1AA] text-xs hover:text-white transition-colors">Reset</button>
        </div>

        <button
          className="flex items-center gap-2 text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} />
          Select Specific Date
        </button>

        {isCalendarOpen && (
          <div className="bg-[#121218] border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
            <h4 className="text-white font-bold text-base">Availability</h4>
            <div className="flex justify-center w-full">
              <CalendarComponent
                mode="range"
                selected={{
                  from: filters.available_start ? new Date(filters.available_start + 'T00:00:00') : undefined,
                  to: filters.available_end ? new Date(filters.available_end + 'T00:00:00') : undefined
                }}
                onSelect={(range: DateRange | undefined) => {
                  if (!range) {
                    onChange({ available_start: '', available_end: '' });
                    return;
                  }
                  const formatDate = (date?: Date) => {
                    if (!date) return '';
                    const y = date.getFullYear();
                    const m = String(date.getMonth() + 1).padStart(2, '0');
                    const d = String(date.getDate()).padStart(2, '0');
                    return `${y}-${m}-${d}`;
                  };
                  onChange({
                    available_start: formatDate(range.from),
                    available_end: formatDate(range.to)
                  });
                }}
                className="bg-transparent text-white mx-auto"
                classNames={{
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-[#A1A1AA] hover:bg-white/10 hover:text-white flex items-center justify-center transition-colors text-xs mx-auto",
                  day_selected: "bg-white/10 text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white",
                  day_today: "bg-white/5 text-white",
                  day_outside: "text-[#A1A1AA]/30 opacity-50",
                  day_disabled: "text-[#A1A1AA]/30 opacity-50",
                  day_range_start: "bg-[#9D7CFF] text-white hover:bg-[#9D7CFF] rounded-l-full",
                  day_range_end: "bg-[#9D7CFF] text-white hover:bg-[#9D7CFF] rounded-r-full",
                  day_range_middle: "aria-selected:bg-white/10 aria-selected:text-white rounded-none",
                  day_hidden: "invisible",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        onClick={onApply}
        className="w-full border-[#00A5E5]/10 bg-[#00A5E5] text-white py-3.5 rounded-full text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#9D7CFF]/20 mt-2">
        Search
      </button>

    </div>
  );
}
