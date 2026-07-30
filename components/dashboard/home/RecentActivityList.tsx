"use client";

import React from "react";
import { MessageSquare, Check, Mail, DollarSign, FileText, Bell, Clock } from "lucide-react";

export interface ActivityItem {
  id: string;
  text: string;
  time: string;
  type: "chat" | "check" | "inquiry" | "payment" | "signature";
}

interface RecentActivityListProps {
  activities: ActivityItem[];
}

export function RecentActivityList({ activities }: RecentActivityListProps) {
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "chat":
        return (
          <div className="w-5 h-5 flex items-center justify-center text-zinc-400 shrink-0">
            <MessageSquare className="w-4 h-4 fill-zinc-400 stroke-zinc-400" />
          </div>
        );
      case "check":
        return (
          <div className="w-5 h-5 rounded bg-[#10B981] flex items-center justify-center text-white shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        );
      case "inquiry":
        return (
          <div className="w-5 h-5 rounded bg-[#EF4444]/90 flex items-center justify-center text-white shrink-0">
            <Mail className="w-3 h-3 fill-white stroke-none" />
          </div>
        );
      case "payment":
        return (
          <div className="w-5 h-5 flex items-center justify-center text-[#F59E0B] shrink-0">
            <DollarSign className="w-4.5 h-4.5 fill-[#F59E0B]/20" />
          </div>
        );
      case "signature":
        return (
          <div className="w-5 h-5 flex items-center justify-center text-zinc-400 shrink-0">
            <FileText className="w-4.5 h-4.5" />
          </div>
        );
    }
  };

  return (
    <div 
      className="border-[1.24px] border-white/[0.05] hover:border-white/10 rounded-[24.71px] p-4 sm:p-[24.71px] transition-all flex flex-col justify-between h-[360px] sm:h-[450px] lg:h-[500px] shadow-lg"
      style={{
        background: "rgba(255, 255, 255, 0.04)"
      }}
    >
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-lg font-bold text-white tracking-tight">Recent Activity</h2>
        <button className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer">
          <Bell className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-5 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {activities.map((act) => (
          <div key={act.id} className="flex gap-4 items-start group">
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {getActivityIcon(act.type)}
            </div>

            {/* Content info */}
            <div className="flex-1 flex flex-col">
              <p className="text-[13px] text-zinc-300 font-bold leading-normal tracking-wide group-hover:text-white transition-colors">
                {act.text}
              </p>
              <span className="text-[11px] text-zinc-500 font-semibold flex items-center gap-1 mt-1 font-sans">
                <Clock className="w-3.5 h-3.5 opacity-60" />
                <span>{act.time}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
