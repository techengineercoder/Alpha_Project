"use client";

import { useGetDashboardQuery } from "@/redux/feature/artistApi/bookingSlice";
import { motion } from "framer-motion";
import {
  DollarSign,
  CheckCircle,
  Clock,
  MapPin,
  Inbox,
  Calendar,
  Ticket,
  ActivityIcon
} from "lucide-react";

export default function ArtistDashboard() {

  const { data, isLoading } = useGetDashboardQuery(undefined);
  console.log(data?.incoming_offers, '====================>');
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }
  // "stats": {
  //   "incoming_offers": 6,
  //     "pending_offers": 3,
  //       "upcoming_bookings": 2,
  //         "confirmed": 3,
  //           "total_earnings_cents": 1320000
  // },
  const stats = [
    { label: "Incoming Offers", value: data?.stats.incoming_offers, icon: Inbox, color: "#7C5CFF" },
    { label: "Confirmed Bookings", value: data?.stats.confirmed, icon: Clock, color: "#3B82F6" },
    { label: "Upcoming Bookings", value: data?.stats.upcoming_bookings, icon: Calendar, color: "#10B981" },
    { label: "Confirmed", value: data?.stats.confirmed, icon: CheckCircle, color: "#F59E0B" },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl md:text-[32px] font-bold text-white mb-2 tracking-tight">Welcome Back to Dashboard</h1>
        <p className="text-sm md:text-base text-gray-400 font-medium">Here's what's happening with your bookings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#111116] border border-white/5 rounded-[24px] p-6 group hover:border-white/10 transition-all shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={64} />
            </div>
            <div className="text-[36px] font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Incoming Offers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111116] border border-white/5 rounded-[32px] overflow-hidden">
            <div className="p-5 md:p-8 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#00A5E5]/10 flex items-center justify-center text-[#7C5CFF] border border-[#7C5CFF]/20">
                  <DollarSign size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white">Incoming Offers</h2>
                  <p className="text-xs md:text-sm text-gray-500">3 pending offers</p>
                </div>
              </div>
              <button className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#00A5E5] text-white text-sm font-semibold  transition-all shadow-[0_0_20px_rgba(124,92,255,0.2)] hover:shadow-[0_0_30px_rgba(124,92,255,0.4)] animate-shine animate-pulse-glow">
                View All Offers
              </button>
            </div>

            <div className="p-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <p className="text-gray-400">Loading...</p>
                </div>
              ) : data?.incoming_offers?.length > 0 ? (
                <div className="space-y-3">
                  {data.incoming_offers.map((offer: any) => (
                    <div
                      key={offer.id}
                      className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white">
                          {offer.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-gray-500" />
                            {offer.venue_name || "No venue specified"}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-gray-500" />
                            {offer.event_date
                              ? new Date(offer.event_date).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                              : "No date"}
                          </div>
                        </div>

                        <div className="text-sm text-gray-500">
                          Requested by: {offer.requester?.name}
                        </div>

                        <div className="text-xs">
                          <span
                            className={`px-2 py-1 rounded-full ${offer.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : offer.status === "accepted"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                              }`}
                          >
                            {offer.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
                        <div className="text-[22px] font-bold text-white">
                          {(offer.amount_cents / 100).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            // onClick={() => }
                            className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-[#00A5E5] text-white text-sm font-bold  transition-all"
                          >
                            Accept
                          </button>

                          <button
                            // onClick={() => handleRejectOffer?.(offer.id)}
                            className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-gray-400 text-sm font-bold hover:bg-white/[0.1] hover:text-white transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <p className="text-xl font-semibold text-gray-400">
                    Data not found
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    No incoming offers available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming & Activity */}
        <div className="space-y-8">
          {/* Upcoming Bookings */}
          <div className="bg-[#111116] border border-white/5 rounded-[32px] p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981] border border-[#10B981]/20">
                <Ticket size={20} />
              </div>
              <h2 className="text-lg font-bold text-white">Upcoming Bookings</h2>
            </div>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <p className="text-gray-400">Loading...</p>
                </div>
              ) : data?.upcoming_bookings?.length > 0 ? (
                data.upcoming_bookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="p-5 rounded-[20px] bg-white/[0.03] border border-white/5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white">
                        {booking?.title}
                      </h4>

                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${booking?.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : booking?.status === "accepted"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                          }`}
                      >
                        {booking?.status}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500 font-medium">
                      {booking?.event_date
                        ? new Date(booking.event_date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                        : "No Date"}{" "}
                      • {booking?.venue_name || "No Venue"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <p className="text-lg font-semibold text-gray-400">
                    Data not found
                  </p>
                  <p className="text-sm text-gray-500">
                    No upcoming bookings available.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#111116] border border-white/5 rounded-[32px] p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] border border-[#3B82F6]/20">
                {/* <Activity /> */}
                <ActivityIcon size={24} />
              </div>
              <h2 className="text-lg font-bold text-white">Recent Activity</h2>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <p className="text-gray-400">Loading...</p>
                </div>
              ) : data?.recent_activities?.length > 0 ? (
                data.recent_activities.map((activity: any, index: number) => (
                  <div key={activity.id} className="flex gap-4 group">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full mt-1.5 z-10 ${activity.verb === "offer_accepted"
                          ? "bg-green-500"
                          : activity.verb === "offer_received"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                          }`}
                      />

                      {index !== data.recent_activities.length - 1 && (
                        <div className="w-px h-full bg-white/5 absolute top-3" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-gray-200">
                        {activity.summary}
                      </h4>

                      <p className="text-xs text-gray-500 font-medium">
                        {activity.detail}
                      </p>

                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest pt-1">
                        {new Date(activity.created_at).toLocaleString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <p className="text-lg font-semibold text-gray-400">
                    Data not found
                  </p>
                  <p className="text-sm text-gray-500">
                    No recent activities available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
