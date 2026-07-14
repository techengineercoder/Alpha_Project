"use client";

import React from "react";

interface StatsCardsProps {
  stats: {
    total: number;
    active: number;
    pending: number;
    declined: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statItems = [
    { label: "Total Members", value: stats.total, color: "text-[#00A5E5]" },
    { label: "Active", value: stats.active, color: "text-[#22C55E]" },
    { label: "Pending", value: stats.pending, color: "text-[#F59E0B]" },
    { label: "Declined", value: stats.declined, color: "text-[#EF4444]" },
  ];

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statItems.map((stat) => (
        <div
          key={stat.label}
          className="bg-[#0A0A0C] border border-white/5 rounded-[20px] p-5 md:p-6 transition-all hover:border-white/10 group flex flex-col justify-between min-h-[110px]"
        >
          <span className={`text-3xl md:text-[30px] font-bold tracking-tight ${stat.color}`}>
            {stat.value}
          </span>
          <span className="text-xs md:text-sm text-[#71717A] font-normal mt-2 group-hover:text-gray-400 transition-colors">
            {stat.label}
          </span>
        </div>
      ))}
    </section>
  );
}
