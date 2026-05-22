"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, ChevronLeft, ChevronRight, MessageCircle, Calendar as CalendarIcon, Clock, Share2 } from 'lucide-react';
import Image from 'next/image';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday } from 'date-fns';
import { BookingModal } from './BookingModal';
import { useParams } from 'next/navigation';
import { useGetArtistByIdQuery } from '@/redux/feature/artistApi/artistSlice';
import { useAddFavoritesMutation } from '@/redux/feature/artistApi/bookingSlice';
import { toast } from 'sonner';

const gradientClass = "bg-gradient-to-r from-[#7C5CFF] to-[#9D7CFF]";

export function ArtistDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'availability' | 'booked'>('availability');
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  const { data: response, isLoading } = useGetArtistByIdQuery(id as string);

  const [addFavorites, { isLoading: addFavoritesLoading }] = useAddFavoritesMutation();

  // Handle case where API response wraps data inside 'artist' or returns it directly
  const artist = response?.artist || response;

  const handleSave = async () => {
    try {
      // const numericArtistId = parseInt(String(id).replace(/\D/g, ''), 10);
      await addFavorites({ artist_id: String(id) }).unwrap();
      toast.success(artist?.is_favorited ? "Artist removed from favorites" : "Artist saved to favorites!");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to save artist");
    }
  };

  const name = artist?.name || artist?.user?.name || 'Unknown Artist';
  const image = artist?.image || artist?.cover_image || artist?.user?.image || 'https://images.unsplash.com/photo-1600119692885-8b04faa7f329?w=1200&q=80';
  const location = artist?.location || 'Location unknown';
  const tags = artist?.genres && artist.genres.length > 0 ? artist.genres : (artist?.provider_name ? [artist.provider_name] : []);
  const about = artist?.bio || 'No biography available for this artist.';
  const experience = artist?.experience_years ? `${artist.experience_years} years` : 'Not specified';
  const languages = artist?.languages?.length ? artist.languages.join(', ') : 'Not specified';
  const upcomingEvents = artist?.booked_dates || [];

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const isDateAvailable = (date: Date) => {
    if (!artist?.available_ranges) return false;
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    return artist.available_ranges.some((range: any) => {
      if (!range.start || !range.end) return false;
      const start = new Date(range.start + 'T00:00:00').getTime();
      const end = new Date(range.end + 'T00:00:00').getTime();
      return compareDate >= start && compareDate <= end;
    });
  };

  const isDateBooked = (date: Date) => {
    if (!artist?.booked_dates) return false;
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    return artist.booked_dates.some((event: any) => {
      const startDateStr = event.start_date || event.date;
      const endDateStr = event.end_date || event.start_date || event.date;
      if (!startDateStr || !endDateStr) return false;
      const start = new Date(startDateStr + 'T00:00:00').getTime();
      const end = new Date(endDateStr + 'T00:00:00').getTime();
      return compareDate >= start && compareDate <= end;
    });
  };

  if (isLoading || !artist) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] text-white font-sans animate-pulse">
        <div className="relative w-full h-[300px] md:h-[450px] bg-white/5" />
        <div className="max-w-[1200px] mx-auto px-6 -mt-32 relative z-10 pb-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div className="flex-1 w-full">
              <div className="h-6 w-32 bg-white/10 rounded-full mb-6" />
              <div className="h-14 w-3/4 max-w-md bg-white/10 rounded-lg mb-4" />
              <div className="h-6 w-48 bg-white/10 rounded-lg" />
            </div>
            <div className="flex gap-3">
              <div className="w-32 h-14 bg-white/10 rounded-[20px]" />
              <div className="w-40 h-14 bg-white/10 rounded-[20px]" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
            <div className="flex flex-col gap-12">
              <div className="h-10 w-32 bg-white/10 rounded-lg mb-8" />
              <div className="space-y-4">
                <div className="h-6 w-full bg-white/5 rounded" />
                <div className="h-6 w-full bg-white/5 rounded" />
                <div className="h-6 w-3/4 bg-white/5 rounded" />
              </div>
            </div>
            <div className="w-full h-[400px] bg-white/5 rounded-[16px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white font-sans selection:bg-[#7C5CFF]/30">
      {/* Top Image Section */}
      <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-transparent to-[#0b0b0f]/50" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 -mt-32 relative z-10 pb-24">

        {/* Header Profile Content */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <div className="flex gap-2 mb-6">
              {tags.map((tag: string) => (
                <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#A1A1AA] backdrop-blur-md">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-5xl md:text-[56px] font-bold mb-4 tracking-tight leading-[1.1]">{name}</h1>
            <div className="flex items-center gap-3 text-[#A1A1AA]">
              <MapPin className="w-5 h-5 text-[#A1A1AA]" />
              <span className="text-[18px] font-normal text-[#A1A1AA]">{location}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-3"
          >
            <button
              onClick={handleSave}
              disabled={addFavoritesLoading}
              className={`px-10 py-4 flex cursor-pointer border border-white/5 items-center gap-2 rounded-[20px] bg-[rgba(255,255,255,0.07)] backdrop-blur-[8px] text-white text-base font-medium hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group`}
            >
              <Heart className={`w-5 h-5 transition-colors ${artist?.is_favorited ? 'fill-red-500 text-red-500' : 'group-hover:text-red-500'}`} />
              {artist?.is_favorited ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className={`px-10 py-4 rounded-[20px] cursor-pointer ${gradientClass} text-white text-base font-medium hover:scale-[1.02] transition-all shadow-xl shadow-[#7C5CFF]/30 active:scale-95`}
            >
              Book Now
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">

          {/* Left Content */}
          <div className="flex flex-col gap-12">

            {/* About Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-[36px] text-white font-bold mb-8 tracking-tight">About</h2>
              <div className="relative">
                <motion.div
                  animate={{ height: isAboutExpanded ? "auto" : "200px" }}
                  className="overflow-hidden relative transition-all duration-500 ease-in-out"
                >
                  <div className="text-[#A1A1AA] leading-[1.8] text-[18px] font-normal space-y-4">
                    {about.split('\n\n').map((para: string, i: number) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  {!isAboutExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0b0b0f] to-transparent pointer-events-none" />
                  )}
                </motion.div>

                <button
                  onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                  className="mt-6 text-white font-bold text-base border-b-2 border-white/10 hover:border-white transition-all pb-0.5 tracking-wide"
                >
                  {isAboutExpanded ? "Read less" : "Read more"}
                </button>
              </div>
            </motion.section>

            {/* Experience & Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="py-8 px-6 rounded-[16px] bg-[#121218] border border-white/5 hover:border-white/10 transition-all group cursor-default"
              >
                <p className="text-[#A1A1AA] text-base font-normal opacity-60">
                  Experience
                </p>
                <p className="text-[20px] font-normal group-hover:text-[#7C5CFF] transition-colors">
                  {experience}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="py-8 px-6 rounded-[16px] bg-[#121218] border border-white/5 hover:border-white/10 transition-all group cursor-default"
              >
                <p className="text-[#A1A1AA] text-base font-normal opacity-60">
                  Languages</p>
                <p className="text-[20px] font-normal group-hover:text-[#7C5CFF] transition-colors">{languages}</p>
              </motion.div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6 relative">
            <div className="sticky top-28 flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{
                  paddingTop: '25px',
                  paddingRight: '25px',
                  paddingBottom: '25px',
                  paddingLeft: '25px',
                  backgroundColor: '#121218'
                }}
                className="border border-white/[0.08] rounded-[16px] shadow-2xl overflow-hidden"
              >
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#7C5CFF]/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <h3 className="text-[20px] font-bold tracking-tight">Availability</h3>
                </div>

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <button
                    onClick={handlePrevMonth}
                    className="w-10 h-10  flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-base font-medium  tracking-[0.2em] text-white/90">{format(currentMonth, 'MMMM yyyy')}</span>
                  <button
                    onClick={handleNextMonth}
                    className="w-10 h-10  flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 text-center gap-y-3 mb-8 relative z-10">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <span key={day} className="text-[12px] text-[#A1A1AA] font-normal ">{day}</span>
                  ))}
                  {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {calendarDays.map((day, i) => {
                    const isAvailable = isDateAvailable(day);
                    const isBooked = isDateBooked(day);
                    const isSelected = selectedDate && isSameDay(selectedDate, day);

                    return (
                      <div key={i} className="flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => isAvailable && setSelectedDate(day)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-normal  transition-all cursor-pointer relative
                                                      ${isAvailable ? 'bg-[#7C5CFF33] text-[#7C5CFF] border border-[#7C5CFF]/30' : ''}
                                                      ${isBooked ? 'bg-[#FB2C3633] text-[#FF6467] border border-[#EF4444]/30' : ''}
                                                      ${isSelected ? gradientClass + ' text-white border-transparent shadow-xl shadow-[#7C5CFF]/40 ring-4 ring-[#7C5CFF]/20' : ''}
                                                      ${!isAvailable && !isBooked ? 'text-[#A1A1AA] hover:text-white ' : ''}
                                                  `}
                        >
                          {format(day, 'd')}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-5 pb- relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 bg-[#7C5CFF]/30 rounded-[4px] border border-[#7C5CFF]`} />
                    <span className="text-[14px] font-normal tracking-widest text-[#A1A1AA]">Available</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-[#EF4444]/30 rounded-[4px] border border-[#EF4444]" />
                    <span className="text-[14px] font-normal tracking-widest text-[#A1A1AA]">Booked</span>
                  </div>
                </div>
              </motion.div>

              {/* Buttons outside the background box */}
              <div className="flex flex-col gap-4 relative z-10">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className={`w-full py-4 cursor-pointer rounded-[20px] ${gradientClass} text-white font-medium text-base   hover:scale-[1.02]  transition-all`}
                >
                  Book Now
                </button>
                <button className="w-full py-4 cursor-pointer rounded-[20px] bg-[#1c1c24] border border-white/10 text-white font-medium text-base  tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                  <MessageCircle className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Availability Dates Section */}
        <div className="mt-40">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[36px] font-bold tracking-tighter"
            >
              Availability Dates
            </motion.h2>

            <div className="flex items-center gap-8 bg-[#121218] border border-white/10 rounded-2xl px-8 py-4 shadow-2xl backdrop-blur-xl">
              <ChevronLeft
                onClick={handlePrevMonth}
                className="w-6 h-6 text-[#A1A1AA] cursor-pointer hover:text-white transition-all hover:scale-110 active:scale-90"
              />
              <span className="text-base font-medium   text-center    text-white">{format(currentMonth, 'MMMM yyyy')}</span>
              <ChevronRight
                onClick={handleNextMonth}
                className="w-6 h-6 text-[#A1A1AA] cursor-pointer hover:text-white transition-all hover:scale-110 active:scale-90"
              />
            </div>
          </div>

          <div className="mb-20">
            <p className="text-[14px] font-medium text-[#A1A1AA]  mb-4    text-center md:text-left">I&apos;m looking for</p>
            <div className="flex flex-wrap   bg-[#121218] border border-white/10  shadow-inner w-fit mx-auto md:mx-0">
              <button
                onClick={() => setActiveTab('availability')}
                className={`px-10 py-4  text-[18px] font-normal  tracking-widest transition-all ${activeTab === 'availability' ? gradientClass + ' text-white ' : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'}`}
              >
                Upcoming Availability
              </button>
              <button
                onClick={() => setActiveTab('booked')}
                className={`px-10 py-4  text-[18px] font-normal  tracking-widest transition-all ${activeTab === 'booked' ? gradientClass + ' text-white ' : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'}`}
              >
                Upcoming Booked Dates
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'availability' ? (
              <motion.div
                key="availability"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className={calendarDays.filter(day => isDateAvailable(day)).length > 0 ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6" : "flex flex-col gap-6 lg:gap-8"}
              >
                {calendarDays.filter(day => isDateAvailable(day)).length === 0 && (
                  <p className="text-[#A1A1AA]">No available dates found for {format(currentMonth, 'MMMM yyyy')}.</p>
                )}
                {calendarDays.filter(day => isDateAvailable(day)).map((day, i) => {
                  const isDaySelected = selectedDate && isSameDay(selectedDate, day);
                  const isDayToday = isToday(day);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      onClick={() => setSelectedDate(day)}
                      transition={{ duration: 0.3, delay: i * 0.02 }}
                      className={`flex flex-col items-center justify-center py-5 px-4 rounded-[12px] bg-[#121218] border transition-all cursor-pointer group
                        ${isDaySelected ? 'border-[#7C5CFF] bg-[#7C5CFF]/5' : 'border-white/10 hover:border-white/20'}
                      `}
                    >
                      <p className={`text-[14px] mb-1 font-normal transition-colors
                        ${isDaySelected ? 'text-white/60' : 'text-[#A1A1AA]'}
                      `}>
                        {isDayToday ? 'Today' : format(day, 'EEEE')}
                      </p>
                      <p className="text-[16px] font-semibold text-white tracking-tight">
                        {format(day, 'dd')} {format(day, 'MMMM')}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="booked"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-6 lg:gap-8"
              >
                <h3 className="text-[36px] font-bold  tracking-tight">Upcoming Events</h3>
                {upcomingEvents.length === 0 && (
                  <p className="text-[#A1A1AA]">No upcoming events booked currently.</p>
                )}
                {upcomingEvents.map((event: any, i: number) => (
                  <motion.div
                    key={event.event_id || event.id || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="w-full bg-[#121218] border border-white/[0.05] rounded-[12px] p-6 flex flex-col md:flex-row justify-between items-start md:items-center group hover:bg-[#121218]/80 transition-all hover:border-white/10"
                  >
                    <div className="flex flex-col gap-1 mb-4 md:mb-0">
                      <h4 className="text-[18px] font-bold text-white tracking-tight">{event.event_name || event.title || 'Event'}</h4>
                      <div className="flex items-center gap-2 text-[#A1A1AA]">
                        <MapPin className="w-4 h-4" />
                        <span className="text-[14px] font-normal">
                          {event.venue ? `${event.venue}, ${event.city}` : (event.location || 'Location unknown')}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-2 text-[#A1A1AA]">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 opacity-60" />
                        <span className="text-[14px] font-normal">
                          {event.start_date ? format(new Date(event.start_date + 'T00:00:00'), 'MMMM dd, yyyy') : (event.date || 'TBD')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 opacity-60" />
                        <span className="text-[14px] font-normal">{event.time || 'Time TBD'}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        artistName={name}
        artistId={artist?.user?.id || artist?.id || ''}
        initialDate={selectedDate}
      />
    </div>
  );
}
