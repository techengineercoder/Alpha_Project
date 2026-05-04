// "use client";

// import React, { useState } from 'react';
// import { MapPin, Calendar as CalendarIcon, Music, Search, ChevronDown } from 'lucide-react';
// import { format, addDays } from "date-fns";
// import { type DateRange } from "react-day-picker";
// import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// export function Banner() {
//   const [location, setLocation] = useState('');
//   const [dateRange, setDateRange] = useState<DateRange | undefined>({
//     from: new Date(),
//     to: addDays(new Date(), 7),
//   }); 
//   const [genre, setGenre] = useState('');
//   const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

//   const genres = ['Pop', 'Rock', 'Electronic', 'Hip Hop', 'Jazz', 'Classical', 'Country'];

//   const handleSearch = () => {
//     let dateStr = 'Any';
//     if (dateRange?.from) {
//       if (dateRange.to) {
//         dateStr = `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`;
//       } else {
//         dateStr = format(dateRange.from, "LLL dd, y");
//       }
//     }
//     alert(`Searching for:\nLocation: ${location || 'Any'}\nDate: ${dateStr}\nGenre: ${genre || 'Any'}`);
//   };

//   return (
//     <section 
//       className="relative w-full min-h-[1013px] flex flex-col items-center justify-center px-4 md:px-8 py-20 bg-cover bg-center bg-no-repeat overflow-hidden"
//       style={{ backgroundImage: "url('/image/banner.jpg')" }}
//     >
//       {/* Overlays to match the design's dark atmosphere and gradient specs */}
//       <div className="absolute inset-0 bg-black/40 z-0"></div>
//       <div 
//         className="absolute inset-0 z-0" 
//         style={{
//           background: 'linear-gradient(180deg, rgba(124, 92, 255, 0.15) 0%, rgba(0, 0, 0, 0.7) 100%)'
//         }}
//       ></div>

//       <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto mt-[-100px]">

//         {/* Top Pill Badge */}
//         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
//           <span className="w-2 h-2 rounded-full bg-[#7C5CFF]"></span>
//           <span className="text-sm font-medium text-white/90">Over 10,000+ verified artists available</span>
//         </div>

//         {/* Main Headings */}
//         <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold text-center leading-tight tracking-tight mb-4">
//           <span className="text-white block mb-2">Book world-class artists</span>
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#00E5FF] block pb-2">
//             for your next event
//           </span>
//         </h1>

//         {/* Subheading */}
//         <p className="text-lg md:text-xl text-white/80 text-center max-w-2xl mb-12 font-light">
//           Connect with top performers and make your event unforgettable
//         </p>

//         {/* Search Bar Container */}
//         <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 md:p-3 shadow-2xl">
//           <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0">

//             {/* Location */}
//             <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 md:py-4 rounded-2xl md:rounded-none md:rounded-l-2xl hover:bg-white/5 transition-colors cursor-text group">
//               <MapPin className="w-5 h-5 text-white/50 group-focus-within:text-[#7C5CFF] transition-colors" />
//               <input 
//                 type="text" 
//                 placeholder="Location" 
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/60 focus:ring-0"
//               />
//             </div>

//             {/* Divider (Desktop Only) */}
//             <div className="hidden md:block w-[1px] h-10 bg-white/10"></div>

//             {/* Date Range */}
//             <Popover>
//               <PopoverTrigger asChild>
//                 <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 md:py-4 rounded-2xl md:rounded-none hover:bg-white/5 transition-colors cursor-pointer group">
//                   <CalendarIcon className="w-5 h-5 text-white/50 group-hover:text-[#7C5CFF] transition-colors" />
//                   <span className={`text-left w-full truncate ${dateRange?.from ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
//                     {dateRange?.from ? (
//                       dateRange.to ? (
//                         <>
//                           {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
//                         </>
//                       ) : (
//                         format(dateRange.from, "MMM dd, yyyy")
//                       )
//                     ) : (
//                       <span>Date range</span>
//                     )}
//                   </span>
//                 </div>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0 bg-[#121218] border-white/10" align="center">
//                 <CalendarComponent
//                   initialFocus
//                   mode="range"
//                   defaultMonth={dateRange?.from}
//                   selected={dateRange}
//                   onSelect={setDateRange}
//                   numberOfMonths={2}
//                   disabled={(date) => date < new Date("1900-01-01")}
//                   className="bg-[#121218] text-[#A1A1AA]"
//                   classNames={{
//                     day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-[#A1A1AA] hover:bg-white/10 hover:text-white rounded-md flex items-center justify-center transition-colors",
//                     day_selected: "bg-white/10 backdrop-blur-xl text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white",
//                     day_today: "bg-white/5 text-white",
//                     day_outside: "text-[#A1A1AA]/50 opacity-50",
//                     day_disabled: "text-[#A1A1AA]/30 opacity-50",
//                     day_range_middle: "aria-selected:bg-white/10 aria-selected:backdrop-blur-xl aria-selected:text-white rounded-none",
//                     day_hidden: "invisible",
//                   }}
//                 />
//               </PopoverContent>
//             </Popover>

//             {/* Divider (Desktop Only) */}
//             <div className="hidden md:block w-[1px] h-10 bg-white/10"></div>

//             {/* Genre */}
//             <div className="relative flex-1 w-full">
//               <div 
//                 className="flex items-center justify-between px-4 py-3 md:py-4 rounded-2xl md:rounded-none hover:bg-white/5 transition-colors cursor-pointer group"
//                 onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
//               >
//                 <div className="flex items-center gap-3">
//                   <Music className="w-5 h-5 text-white/50 group-hover:text-[#7C5CFF] transition-colors" />
//                   <span className={`transition-colors ${genre ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
//                     {genre || 'Genre'}
//                   </span>
//                 </div>
//                 <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isGenreDropdownOpen ? 'rotate-180' : ''}`} />
//               </div>

//               {/* Dropdown Menu */}
//               {isGenreDropdownOpen && (
//                 <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-[#18182B] border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50">
//                   {genres.map(g => (
//                     <div 
//                       key={g} 
//                       className="px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
//                       onClick={() => {
//                         setGenre(g);
//                         setIsGenreDropdownOpen(false);
//                       }}
//                     >
//                       {g}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Search Button */}
//             <button 
//               onClick={handleSearch}
//               className="w-full md:w-auto mt-2 md:mt-0 ml-0 md:ml-2 bg-[#7C5CFF] hover:bg-[#6A4BE5] text-white px-8 py-4 rounded-2xl md:rounded-[20px] font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#7C5CFF]/25"
//             >
//               <Search className="w-5 h-5" />
//               <span>Search</span>
//             </button>

//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import React, { useState } from 'react';
import { MapPin, Calendar as CalendarIcon, Music, Search, ChevronDown } from 'lucide-react';
import { format, addDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function Banner() {
  const [location, setLocation] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [genre, setGenre] = useState('');
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

  const genres = ['Pop', 'Rock', 'Electronic', 'Hip Hop', 'Jazz', 'Classical', 'Country'];

  const handleSearch = () => {
    let dateStr = 'Any';
    if (dateRange?.from) {
      if (dateRange.to) {
        dateStr = `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`;
      } else {
        dateStr = format(dateRange.from, "LLL dd, y");
      }
    }
    alert(`Searching for:\nLocation: ${location || 'Any'}\nDate: ${dateStr}\nGenre: ${genre || 'Any'}`);
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-[#7C5CFF]"></span>
          <span className="text-sm font-medium text-white/90">Over 10,000+ verified artists available</span>
        </div>

        {/* Main Headings */}
        <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold text-center leading-tight tracking-tight mb-4">
          <span className="text-white block mb-2">Book world-class artists</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#00E5FF] block pb-2">
            for your next event
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-white/80 text-center max-w-2xl mb-12 font-light">
          Connect with top performers and make your event unforgettable
        </p>

        {/* Search Bar Container */}
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 md:p-3 shadow-2xl">
          <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-2">

            {/* ── Inputs Grid ── */}
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* ── Location ── */}
              <div
                className="w-full flex items-center gap-3 px-4 py-3 md:py-4 rounded-2xl cursor-text group transition-colors hover:brightness-110"
                style={{
                  background: 'rgba(24, 24, 31, 0.35)',
                  border: '1.26px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                }}
              >
                <MapPin className="w-5 h-5 text-white/50 group-focus-within:text-[#7C5CFF] transition-colors flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/60 focus:ring-0"
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
                      {genre || 'Genre'}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isGenreDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {isGenreDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-[#18182B] border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50">
                    {genres.map(g => (
                      <div
                        key={g}
                        className="px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
                        onClick={() => {
                          setGenre(g);
                          setIsGenreDropdownOpen(false);
                        }}
                      >
                        {g}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Search Button ── */}
            <button
              onClick={handleSearch}
              className="w-full md:w-auto h-full min-h-[54px] md:min-h-[58px] border-white  border bg-gradient-to-r from-[#7C5CFF] to-[#9D7CFF] hover:bg-[#6A4BE5] text-white px-8 rounded-2xl md:rounded-[20px] font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#7C5CFF]/25"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}