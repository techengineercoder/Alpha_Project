"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Star, Globe, MessageCircle, ChevronLeft, ChevronRight, CalendarIcon, Clock } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useGetVenueByIdQuery } from '@/redux/feature/artistApi/venuesSlice';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday } from 'date-fns';
import { VenueInquiryModal } from './VenueInquiryModal';
const gradientClass = "bg-[#00A5E5]";


export function VenueDetails() {
  const { id } = useParams();
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  const { data: response, isLoading } = useGetVenueByIdQuery(id as string);

  const venue = response?.venue || response;

  const name = venue?.name || venue?.user?.name || 'Unknown Venue';
  const image = venue?.image || venue?.cover_image || venue?.user?.image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80';
  const location = venue?.city ? `${venue.city}, ${venue.state}` : (venue?.location || venue?.address || 'Location unknown');
  const about = venue?.description || 'No description available for this venue.';
  const capacityDisplay = venue?.capacity ? `${venue.capacity} Capacity` : 'Capacity not specified';
  const score = venue?.score ? `${(venue.score * 100).toFixed(0)}/100` : 'No rating';
  const website = venue?.website || '';

  // Google Map Api 
  const googlemap = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
  console.log('googlemap', googlemap);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'availability' | 'booked'>('availability');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [hasSetInitialMonth, setHasSetInitialMonth] = useState(false);

  const upcomingEvents = venue?.booked_dates || [];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const isDateAvailable = (date: Date) => {
    if (!venue?.available_ranges) return false;
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    return venue.available_ranges.some((range: any) => {
      if (!range.start || !range.end) return false;
      const start = new Date(range.start + 'T00:00:00').getTime();
      const end = new Date(range.end + 'T00:00:00').getTime();
      return compareDate >= start && compareDate <= end;
    });
  };

  const isDateBooked = (date: Date) => {
    if (!venue?.booked_dates) return false;
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    return venue.booked_dates.some((event: any) => {
      const startDateStr = event.start_date || event.date;
      const endDateStr = event.end_date || event.start_date || event.date;
      if (!startDateStr || !endDateStr) return false;
      const start = new Date(startDateStr + 'T00:00:00').getTime();
      const end = new Date(endDateStr + 'T00:00:00').getTime();
      return compareDate >= start && compareDate <= end;
    });
  };

  React.useEffect(() => {
    if (venue?.available_ranges?.length > 0 && !hasSetInitialMonth) {
      const sortedRanges = [...venue.available_ranges].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
      if (sortedRanges[0]?.start) {
        setCurrentMonth(new Date(sortedRanges[0].start + 'T00:00:00'));
        setHasSetInitialMonth(true);
      }
    }
  }, [venue?.available_ranges, hasSetInitialMonth]);

  const fullAddress = [
    venue?.address,
    venue?.city,
    venue?.state,
    venue?.postal_code,
    venue?.country
  ].filter(Boolean).join(', ');

  if (isLoading || !venue) {
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white  font-sans selection:bg-[#00A5E5]/30">
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
            <h1 className="text-5xl md:text-[56px] font-bold mb-4 tracking-tight leading-[1.1]">{name}</h1>
            <div className="flex items-center gap-6 text-[#A1A1AA] flex-wrap">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#A1A1AA]" />
                <span className="text-[18px] font-normal">{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#A1A1AA]" />
                <span className="text-[18px] font-normal">{capacityDisplay}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col gap-12">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* <h2 className="text-[36px] text-white font-bold mb-8 tracking-tight">About Venue</h2> */}
              {/* <div className="relative">
                <motion.div
                  animate={{ height: isAboutExpanded ? "auto" : "200px" }}
                  className="overflow-hidden relative transition-all duration-500 ease-in-out"
                >
                  <div className="text-[#A1A1AA] leading-[1.8] text-[18px] font-normal space-y-4">
                    {about.split('\n\n').map((para: string, i: number) => (
                      <p key={i}>{para}</p>
                    ))}

                    {fullAddress && (
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <h3 className="text-white font-medium mb-2">Location</h3>
                        <p className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-[#7C5CFF]" />
                          <span>{fullAddress}</span>
                        </p>
                      </div>
                    )}
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
              </div> */}
            </motion.section>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="py-8 px-6 rounded-[16px] bg-[#121218] border border-white/5 hover:border-white/10 transition-all group cursor-default"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-5 h-5 text-[#A1A1AA] group-hover:text-[#7C5CFF] transition-colors" />
                  <p className="text-[#A1A1AA] text-base font-normal opacity-60">Venue Rating</p>
                </div>
                <p className="text-[20px] font-normal group-hover:text-[#7C5CFF] transition-colors">
                  {score}
                </p>
              </motion.div>

              {website && (
                <motion.a
                  href={website.startsWith('http') ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="py-8 px-6 rounded-[16px] bg-[#121218] border border-white/5 hover:border-white/10 transition-all group cursor-pointer block"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-5 h-5 text-[#A1A1AA] group-hover:text-[#7C5CFF] transition-colors" />
                    <p className="text-[#A1A1AA] text-base font-normal opacity-60">Website</p>
                  </div>
                  <p className="text-[20px] font-normal group-hover:text-[#7C5CFF] transition-colors truncate">
                    Visit Website
                  </p>
                </motion.a>
              )}
            </div>
            {/* Map Section */}
            {/* {googlemap && (venue?.latitude || fullAddress) && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-4"
              >
                <h2 className="text-[36px] text-white font-bold mb-8 tracking-tight">Location Map</h2>
                <div className="w-full h-[300px] md:h-[400px] rounded-[16px] overflow-hidden border border-white/5 hover:border-white/10 transition-all shadow-2xl relative bg-[#121218]">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${googlemap}&q=${encodeURIComponent(venue?.latitude ? `${venue.latitude},${venue.longitude}` : fullAddress)}`}
                  ></iframe>
                </div>
              </motion.section>
            )} */}
          </div>
          <div className="flex flex-col gap-6 relative w-full max-w-full">
            <div className="lg:sticky lg:top-28 flex flex-col gap-6 w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="border border-white/[0.08] rounded-[16px] shadow-2xl overflow-hidden p-4 sm:p-5 md:p-[25px] bg-[#121218] w-full"
              >
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00A5E5]/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <h3 className="text-[20px] font-bold tracking-tight">Availability</h3>
                </div>

                <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10 w-full">
                  <button
                    onClick={handlePrevMonth}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer hover:bg-white/5 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <span className="text-[13px] sm:text-sm md:text-base font-medium tracking-wider md:tracking-[0.2em] text-white/90 text-center px-2 truncate">
                    {format(currentMonth, 'MMMM yyyy')}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer hover:bg-white/5 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 text-center gap-x-1 gap-y-2 sm:gap-y-3 mb-6 sm:mb-8 relative z-10 w-full">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <span key={day} className="text-[10px] sm:text-[12px] text-[#A1A1AA] font-medium truncate">{day}</span>
                  ))}
                  {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {calendarDays.map((day, i) => {
                    const isAvailable = isDateAvailable(day);
                    const isBooked = isDateBooked(day);
                    const isSelected = selectedDate && isSameDay(selectedDate, day);

                    let dayClass = 'text-[#A1A1AA] hover:text-white';
                    if (isSelected) {
                      dayClass = 'bg-[#00A5E5] text-white border-transparent shadow-md sm:shadow-xl shadow-[#00A5E5]/40 ring-2 sm:ring-4 ring-[#00A5E5]/20';
                    } else if (isBooked) {
                      dayClass = 'bg-[#FB2C3633] text-[#FF6467] border border-[#EF4444]/30';
                    } else if (isAvailable) {
                      dayClass = 'bg-[#7C5CFF33] text-[#7C5CFF] border border-[#7C5CFF]/30';
                    }

                    return (
                      <div key={i} className="flex items-center justify-center w-full">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => isAvailable && setSelectedDate(day)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[12px] sm:text-[14px] font-normal transition-all cursor-pointer relative ${dayClass}`}
                        >
                          {format(day, 'd')}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 pb-2 relative z-10 w-full">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 bg-[#00A5E5]/30 rounded-[4px] border border-[#7C5CFF]`} />
                    <span className="text-[12px] sm:text-[14px] font-normal tracking-wide sm:tracking-widest text-[#A1A1AA]">Available</span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#EF4444]/30 rounded-[4px] border border-[#EF4444]" />
                    <span className="text-[12px] sm:text-[14px] font-normal tracking-wide sm:tracking-widest text-[#A1A1AA]">Booked</span>
                  </div>
                </div>
              </motion.div>

              {/* Buttons outside the background box */}
              <div className="flex flex-col gap-4 relative z-10">
                <button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className={`w-full py-4 cursor-pointer rounded-[20px] ${gradientClass} text-white font-medium text-base   hover:scale-[1.02]  transition-all`}
                >
                  Inquire
                </button>
                <button className="w-full py-4 cursor-pointer rounded-[20px] bg-[#1c1c24] border border-white/10 text-white font-medium text-base tracking-wide md:tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                  <MessageCircle className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-40">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 md:gap-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[28px] md:text-[36px] font-bold tracking-tighter"
            >
              Availability Dates
            </motion.h2>

            <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-8 bg-[#121218] border border-white/10 rounded-2xl px-4 md:px-8 py-4 shadow-2xl backdrop-blur-xl">
              <ChevronLeft
                onClick={handlePrevMonth}
                className="w-6 h-6 text-[#A1A1AA] cursor-pointer hover:text-white transition-all hover:scale-110 active:scale-90"
              />
              <span className="text-sm md:text-base font-medium text-center text-white min-w-[120px]">{format(currentMonth, 'MMMM yyyy')}</span>
              <ChevronRight
                onClick={handleNextMonth}
                className="w-6 h-6 text-[#A1A1AA] cursor-pointer hover:text-white transition-all hover:scale-110 active:scale-90"
              />
            </div>
          </div>

          <div className="mb-12 md:mb-20">
            <p className="text-[14px] font-medium text-[#A1A1AA] mb-4 text-center md:text-left">I&apos;m looking for</p>
            <div className="flex flex-col sm:flex-row bg-[#121218] border border-white/10 shadow-inner w-full md:w-fit mx-auto md:mx-0 rounded-[12px] overflow-hidden">
              <button
                onClick={() => setActiveTab('availability')}
                className={`flex-1 sm:flex-none px-6 md:px-10 py-4 text-[16px] md:text-[18px] font-normal tracking-wide md:tracking-widest transition-all ${activeTab === 'availability' ? gradientClass + ' text-white ' : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'}`}
              >
                Upcoming Availability
              </button>
              <button
                onClick={() => setActiveTab('booked')}
                className={`flex-1 sm:flex-none px-6 md:px-10 py-4 text-[16px] md:text-[18px] font-normal tracking-wide md:tracking-widest transition-all border-t sm:border-t-0 sm:border-l border-white/5 ${activeTab === 'booked' ? gradientClass + ' text-white ' : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'}`}
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
                      onClick={() => {
                        setSelectedDate(day);
                        setIsInquiryModalOpen(true);
                      }}
                      transition={{ duration: 0.3, delay: i * 0.02 }}
                      className={`flex flex-col items-center justify-center py-5 px-4 rounded-[12px] bg-[#121218] border transition-all cursor-pointer group
                                ${isDaySelected ? 'border-[#7C5CFF] bg-[#00A5E5]/5' : 'border-white/10 hover:border-white/20'}
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
                    onClick={() => window.open(event.url, '_blank')}
                    className="w-full bg-[#121218] border border-white/[0.05] rounded-[12px] p-6 flex flex-col md:flex-row justify-between items-start md:items-center group hover:bg-[#121218]/80 transition-all cursor-pointer hover:border-white/10"
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

      {/* Venue Inquiry Modal */}
      <VenueInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => {
          setIsInquiryModalOpen(false);
          setSelectedDate(null);
        }}
        venueName={name}
        venueId={venue?.id || ''}
        initialDate={selectedDate}
        receiverEmail={venue?.email || venue?.user?.email || ''}
      />
    </div>
  );
}
