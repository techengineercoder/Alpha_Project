"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus
} from "lucide-react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const calendarData = [
  { day: 1, status: "available" },
  { day: 2, status: "available" },
  { day: 3, status: "available" },
  { day: 4, status: "available" },
  { day: 5, status: "booked", title: "Sunset Music Festival" },
  { day: 6, status: "available" },
  { day: 7, status: "hold", title: "Tech Summit After Party" },
  { day: 8, status: "available" },
  { day: 9, status: "available" },
  { day: 10, status: "available" },
  { day: 11, status: "available" },
  { day: 12, status: "booked", title: "Spring Concert" },
  { day: 13, status: "available" },
  { day: 14, status: "hold", title: "Private Event" },
  { day: 15, status: "available" },
  { day: 16, status: "available" },
  { day: 17, status: "available" },
  { day: 18, status: "available" },
  { day: 19, status: "booked" },
  { day: 20, status: "available" },
  { day: 21, status: "hold" },
  { day: 22, status: "available" },
  { day: 23, status: "available" },
  { day: 24, status: "available" },
  { day: 25, status: "available" },
  { day: 26, status: "booked" },
  { day: 27, status: "available" },
  { day: 28, status: "hold" },
  { day: 29, status: "available" },
  { day: 30, status: "available" },
  { day: 31, status: "available" },
];

const upcomingEvents = [
  { title: "Sunset Music Festival", date: "May 5", time: "8:00 PM", location: "Red Rocks", color: "#EF4444" },
  { title: "Tech Summit After Party", date: "May 7", time: "9:00 PM", location: "The Ivy", color: "#F59E0B" },
  { title: "Spring Concert", date: "May 12", time: "7:00 PM", location: "Central Park", color: "#EF4444" },
  { title: "Private Event", date: "May 14", time: "6:00 PM", location: "Grand Hotel", color: "#F59E0B" },
];

export default function AvailabilityPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-[32px] font-bold text-white mb-2">Availability</h1>
          <p className="text-sm md:text-base text-gray-400 font-medium">Manage your calendar and availability</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#00A5E5] text-white font-bold  transition-all shadow-lg shadow-[#7C5CFF]/20 w-full md:w-auto">
          <Plus size={20} />
          <span>Add Block Date</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Calendar Section */}
        <div className="xl:col-span-2 bg-[#111116] border border-white/5 rounded-[24px] md:rounded-[32px] p-5 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-10 gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">May 2026</h2>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center bg-white/5 rounded-xl border border-white/5 p-1">
                <button className="p-1.5 md:p-2 text-gray-400 hover:text-white transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-1.5 md:p-2 text-gray-400 hover:text-white transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
              <button className="px-4 md:px-5 py-2 md:py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs md:text-sm font-bold text-white hover:bg-white/10 transition-all">
                Today
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {days.map((day) => (
              <div key={day} className="text-center text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-widest pb-2 md:pb-4">
                {day}
              </div>
            ))}

            {/* Empty slots for month start (assuming May 2026 starts on Friday based on image) */}
            <div className="h-[50px] sm:h-[60px] md:h-[100px]"></div>
            <div className="h-[50px] sm:h-[60px] md:h-[100px]"></div>
            <div className="h-[50px] sm:h-[60px] md:h-[100px]"></div>
            <div className="h-[50px] sm:h-[60px] md:h-[100px]"></div>
            <div className="h-[50px] sm:h-[60px] md:h-[100px]"></div>

            {calendarData.map((data) => (
              <div
                key={data.day}
                className={`relative h-[50px] sm:h-[60px] md:h-[100px] rounded-xl md:rounded-2xl border transition-all flex items-center justify-center cursor-pointer group
                  ${data.status === 'available' ? 'bg-[#10B981]/5 border-white/5 hover:border-[#10B981]/30' :
                    data.status === 'booked' ? 'bg-[#EF4444]/10 border-[#EF4444]/20' :
                      'bg-[#F59E0B]/10 border-[#F59E0B]/20'}
                `}
              >
                <span className={`text-sm md:text-lg font-bold
                  ${data.status === 'available' ? 'text-gray-500 group-hover:text-[#10B981]' :
                    data.status === 'booked' ? 'text-[#EF4444]' :
                      'text-[#F59E0B]'}
                `}>
                  {data.day}
                </span>

                {data.status !== 'available' && (
                  <div className={`absolute bottom-3 w-1.5 h-1.5 rounded-full
                    ${data.status === 'booked' ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'}
                  `}></div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-8 pt-8 border-t border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded bg-[#10B981]/20 border border-[#10B981]/40"></div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Available</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded bg-[#F59E0B]/20 border border-[#F59E0B]/40"></div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Soft Hold</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded bg-[#EF4444]/20 border border-[#EF4444]/40"></div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Booked</span>
            </div>
          </div>
        </div>

        {/* Side List Section */}
        <div className="bg-[#111116] border border-white/5 rounded-[32px] p-8 space-y-8">
          <h2 className="text-xl font-bold text-white">Upcoming Events</h2>

          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="p-6 rounded-[24px] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px]" style={{ color: event.color }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: event.color }}></div>
                      {event.date}
                    </div>
                    <h4 className="font-bold text-white">{event.title}</h4>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-600" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-600" />
                    {event.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
