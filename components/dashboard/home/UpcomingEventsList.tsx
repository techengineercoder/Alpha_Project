"use client";

import React from "react";
import Link from "next/link";

export interface EventItem {
  id: string;
  dateDay: string;
  dateMonth: string;
  title: string;
  venue: string;
  amount: string;
  status: "Confirmed" | "Signed" | "Offer Sent" | "Contract";
}

interface UpcomingEventsListProps {
  events: EventItem[];
}

export function UpcomingEventsList({ events }: UpcomingEventsListProps) {
  const getBadgeStyle = (status: EventItem["status"]) => {
    switch (status) {
      case "Confirmed":
        return "bg-[#10B981]/8 text-[#10B981] border-[#10B981]/20";
      case "Signed":
        return "bg-[#3B82F6]/8 text-[#3B82F6] border-[#3B82F6]/20";
      case "Offer Sent":
        return "bg-[#00A5E5]/8 text-[#00A5E5] border-[#00A5E5]/20";
      case "Contract":
        return "bg-[#7C5CFF]/8 text-[#7C5CFF] border-[#7C5CFF]/20";
    }
  };

  const getDotStyle = (status: EventItem["status"]) => {
    switch (status) {
      case "Confirmed":
        return "bg-[#10B981]";
      case "Signed":
        return "bg-[#3B82F6]";
      case "Offer Sent":
        return "bg-[#00A5E5]";
      case "Contract":
        return "bg-[#7C5CFF]";
    }
  };

  return (
    <div 
      className="border-[1.24px] border-white/[0.05] hover:border-white/10 rounded-[24.71px] p-[24.71px] transition-all flex flex-col justify-between h-[390px] shadow-lg"
      style={{
        background: "rgba(255, 255, 255, 0.04)"
      }}
    >
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-lg font-bold text-white tracking-tight">Upcoming Events</h2>
        <Link href="/artist/bookings" className="text-xs font-semibold text-[#00A5E5] hover:underline">
          View all
        </Link>
      </div>

      <div className="flex-1 flex flex-col gap-5 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between group py-1"
          >
            <div className="flex items-center gap-4.5">
              {/* Date Column (Direct text alignment without background boxes) */}
              <div className="flex flex-col items-center justify-center shrink-0 w-8">
                <span className="text-[18px] font-bold text-white leading-none font-sans">{event.dateDay}</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase mt-1 font-sans">{event.dateMonth}</span>
              </div>

              {/* Text Information */}
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white group-hover:text-[#00A5E5] transition-colors font-sans">
                  {event.title}
                </span>
                <span className="text-xs text-zinc-500 font-semibold font-sans mt-0.5">
                  {event.venue}
                </span>
              </div>
            </div>

            {/* Price & Status Badge */}
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-[14px] font-bold text-white font-sans">{event.amount}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${getBadgeStyle(event.status)}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${getDotStyle(event.status)}`} />
                {event.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
