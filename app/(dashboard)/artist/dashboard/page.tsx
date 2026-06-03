"use client";

import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Music, 
  MapPin, 
  Activity, 
  ChevronRight,
  Inbox,
  Ticket,
  Calendar
} from "lucide-react";

const stats = [
  { label: "Incoming Offers", value: "10", icon: Inbox, color: "#7C5CFF" },
  { label: "Pending Offers", value: "03", icon: Clock, color: "#3B82F6" },
  { label: "Upcoming Bookings", value: "07", icon: Calendar, color: "#10B981" },
  { label: "Confirmed", value: "06", icon: CheckCircle, color: "#F59E0B" },
];

const incomingOffers = [
  {
    title: "Summer Music Festival",
    location: "Central Park Arena",
    date: "June 15, 2026",
    price: "$5,000",
    id: 1,
  },
  {
    title: "Jazz Night",
    location: "Blue Note Club",
    date: "May 25, 2026",
    price: "$2,500",
    id: 2,
  },
  {
    title: "Corporate Event",
    location: "Grand Hotel Ballroom",
    date: "June 5, 2026",
    price: "$3,800",
    id: 3,
  },
];

const upcomingBookings = [
  { title: "Spring Concert", date: "April 30, 2026", location: "City Theater", status: "Confirmed" },
  { title: "Private Event", date: "May 12, 2026", location: "Riverside Venue", status: "Confirmed" },
];

const recentActivity = [
  { type: "Offer accepted", details: "Spring Concert", time: "2 days ago", color: "#7C5CFF" },
  { type: "Availability updated", details: "June dates blocked", time: "3 days ago", color: "#F59E0B" },
  { type: "Message received", details: "From venue manager", time: "5 days ago", color: "#3B82F6" },
];

export default function ArtistDashboard() {
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
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#7C5CFF]/10 flex items-center justify-center text-[#7C5CFF] border border-[#7C5CFF]/20">
                   <DollarSign size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white">Incoming Offers</h2>
                  <p className="text-xs md:text-sm text-gray-500">3 pending offers</p>
                </div>
              </div>
              <button className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#7C5CFF] text-white text-sm font-semibold hover:bg-[#6A4BE5] transition-all shadow-[0_0_20px_rgba(124,92,255,0.2)] hover:shadow-[0_0_30px_rgba(124,92,255,0.4)] animate-shine animate-pulse-glow">
                View All Offers
              </button>
            </div>
            
            <div className="p-4 space-y-3">
              {incomingOffers.map((offer) => (
                <div 
                  key={offer.id} 
                  className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">{offer.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-500" />
                        {offer.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-500" />
                        {offer.date}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
                    <div className="text-[22px] font-bold text-white">{offer.price}</div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-[#7C5CFF] text-white text-sm font-bold hover:bg-[#6A4BE5] transition-all shadow-[0_0_15px_rgba(124,92,255,0.2)] hover:shadow-[0_0_25px_rgba(124,92,255,0.4)] animate-shine animate-pulse-glow">
                        Accept
                      </button>
                      <button className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-gray-400 text-sm font-bold hover:bg-white/[0.1] hover:text-white transition-all">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
              {upcomingBookings.map((booking) => (
                <div key={booking.title} className="p-5 rounded-[20px] bg-white/[0.03] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white">{booking.title}</h4>
                    <div className="px-2.5 py-1 rounded-lg bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold uppercase tracking-wider border border-[#10B981]/20">
                      {booking.status}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {booking.date} • {booking.location}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#111116] border border-white/5 rounded-[32px] p-8 space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] border border-[#3B82F6]/20">
                  <Activity size={20} />
               </div>
               <h2 className="text-lg font-bold text-white">Recent Activity</h2>
            </div>
            
            <div className="space-y-6">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="relative flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mt-1.5 z-10`} style={{ backgroundColor: activity.color }}></div>
                    {index !== recentActivity.length - 1 && (
                      <div className="w-px h-full bg-white/5 absolute top-3"></div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-200">{activity.type}</h4>
                    <p className="text-xs text-gray-500 font-medium">{activity.details}</p>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest pt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
