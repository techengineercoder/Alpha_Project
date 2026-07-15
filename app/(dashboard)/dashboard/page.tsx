"use client";

import React, { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/home/DashboardHeader";
import { StatCard } from "@/components/dashboard/home/StatCard";
import { BookingSpendChart } from "@/components/dashboard/home/BookingSpendChart";
import { UpcomingEventsList } from "@/components/dashboard/home/UpcomingEventsList";
import { RecentActivityList } from "@/components/dashboard/home/RecentActivityList";
import { RecommendedArtists } from "@/components/dashboard/home/RecommendedArtists";
import { OfferPipeline } from "@/components/dashboard/home/OfferPipeline";
import { LogoLoader } from "@/components/ui/logo-loader";

import dashboardData from "@/data/dashboard-mock-data.json";

export default function CentralDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LogoLoader fullScreen={true} text="Loading Dashboard..." />;
  }

  // Cast mock data structures
  const stats = dashboardData.stats as any[];
  const upcomingEvents = dashboardData.upcomingEvents as any[];
  const recentActivities = dashboardData.recentActivities as any[];
  const recommendedArtists = dashboardData.recommendedArtists as any[];
  const pipelineOffers = dashboardData.pipelineOffers as any[];
  const pipelineCounts = dashboardData.pipelineCounts as Record<string, number>;

  return (
    <div className="min-h-screen  p-4 md:p-8 lg:p-10 w-full space-y-8 pb-20 font-sans">
      {/* 1. Header */}
      <DashboardHeader />

      {/* 2. Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend as "up" | "down"}
            color={stat.color}
            iconBg={stat.iconBg}
            iconName={stat.iconName}
          />
        ))}
      </section>

      {/* 3. Middle Section: Booking Spend & Upcoming Events */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <BookingSpendChart />
        </div>
        <div className="lg:col-span-1">
          <UpcomingEventsList events={upcomingEvents} />
        </div>
      </section>

      {/* 4. Third Section: Recent Activity & Recommended Artists */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <RecentActivityList activities={recentActivities} />
        </div>
        <div className="lg:col-span-2">
          <RecommendedArtists artists={recommendedArtists} />
        </div>
      </section>

      {/* 5. Bottom Section: Offer Pipeline */}
      <section className="pt-2">
        <OfferPipeline offers={pipelineOffers} counts={pipelineCounts} />
      </section>
    </div>
  );
}
