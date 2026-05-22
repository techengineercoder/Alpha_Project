"use client";

import { motion } from "framer-motion";
import { 
  Inbox, 
  MapPin, 
  Clock, 
  DollarSign, 
  Search, 
  Filter 
} from "lucide-react";

const offers = [
  {
    title: "Summer Music Festival",
    location: "Central Park Arena",
    date: "June 15, 2026",
    price: "$5,000",
    id: 1,
    organizer: "Live Nation",
    category: "Festival",
  },
  {
    title: "Jazz Night",
    location: "Blue Note Club",
    date: "May 25, 2026",
    price: "$2,500",
    id: 2,
    organizer: "Blue Note",
    category: "Club Show",
  },
  {
    title: "Corporate Event",
    location: "Grand Hotel Ballroom",
    date: "June 5, 2026",
    price: "$3,800",
    id: 3,
    organizer: "Google Inc.",
    category: "Corporate",
  },
  {
    title: "Private Birthday Party",
    location: "Beverly Hills",
    date: "July 12, 2026",
    price: "$4,200",
    id: 4,
    organizer: "Private Client",
    category: "Private",
  },
];

export default function IncomingOffersPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[32px] font-bold text-white mb-2">Incoming Offers</h1>
          <p className="text-gray-400 font-medium">Review and respond to booking requests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search offers..." 
              className="pl-12 pr-6 py-3 bg-[#111116] border border-white/5 rounded-2xl text-sm focus:outline-none focus:border-[#7C5CFF]/50 transition-all w-full md:w-64"
            />
          </div>
          <button className="p-3 bg-[#111116] border border-white/5 rounded-2xl text-gray-500 hover:text-white transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 gap-4">
        {offers.map((offer) => (
          <motion.div 
            key={offer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[32px] bg-[#111116] border border-white/5 hover:border-white/10 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-8 group"
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-[20px] bg-[#7C5CFF]/10 flex items-center justify-center text-[#7C5CFF] border border-[#7C5CFF]/20 flex-shrink-0">
                 <Inbox size={32} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-2xl font-bold text-white">{offer.title}</h3>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-white/5">
                    {offer.category}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-600" />
                    {offer.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-600" />
                    {offer.date}
                  </div>
                  <div className="flex items-center gap-2 font-medium text-gray-500">
                    Organizer: <span className="text-gray-300">{offer.organizer}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-10 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 border-white/5">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Offer Amount</p>
                <div className="text-[32px] font-bold text-white tracking-tight">{offer.price}</div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-8 py-3.5 rounded-2xl bg-[#7C5CFF] text-white font-bold hover:bg-[#6A4BE5] transition-all shadow-lg shadow-[#7C5CFF]/20">
                  Accept Offer
                </button>
                <button className="px-8 py-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 font-bold hover:bg-white/[0.08] hover:text-white transition-all">
                  Reject
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
