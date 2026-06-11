// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Search,
//   Filter,
//   MessageSquare,
//   MapPin,
//   Calendar,
//   DollarSign,
//   ChevronRight
// } from "lucide-react";
// import { useBookingListQuery } from "@/redux/feature/artistApi/bookingSlice";

// const tabs = ["Pending Offers", "Confirmed Bookings", "Past Events"];

// const bookingsData = {
//   "Pending Offers": [
//     { title: "Summer Music Festival", location: "Central Park Arena", date: "June 15, 2026", price: "$5,000", status: "Pending" },
//     { title: "Jazz Night", location: "Blue Note Club", date: "May 25, 2026", price: "$2,500", status: "Pending" },
//     { title: "Art Exhibition Opening", location: "Downtown Gallery", date: "August 20, 2026", price: "$2,500", status: "Pending" },
//   ],
//   "Confirmed Bookings": [
//     { title: "Corporate Launch Party", location: "Los Angeles, CA", date: "May 2, 2026", price: "$3,500", client: "John Smith", status: "Confirmed" },
//     { title: "Music Festival Main Stage", location: "Los Angeles, CA", date: "May 2, 2026", price: "$9,500", client: "Festival Org", status: "Confirmed" },
//     { title: "Charity Gala", location: "Los Angeles, CA", date: "May 2, 2026", price: "$8,500", client: "Lisa Brown", status: "Confirmed" },
//   ],
//   "Past Events": [
//     { title: "Rock Festival", location: "Central Park Arena", date: "July 15, 2025", price: "$5,000" },
//     { title: "Pop Concert", location: "Madison Square Garden", date: "January 10, 2026", price: "$7,500" },
//   ]
// };

// export default function BookingsPage() {
//   const [activeTab, setActiveTab] = useState("Pending Offers");

//   const { data, isLoading } = useBookingListQuery({
//     scope: "sent"
//   });
//   console.log(data, "data==========");

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div>
//         <h1 className="text-[32px] font-bold text-white mb-2">Bookings</h1>
//         <p className="text-gray-400 font-medium">Manage your offers and bookings</p>
//       </div>

//       {/* Tab Switcher */}
//       <div className="bg-[#111116] border border-white/5 rounded-[24px] p-1.5 flex items-center max-w-2xl">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`flex-1 py-3 px-6 rounded-[20px] text-sm font-bold transition-all relative
//               ${activeTab === tab ? "text-white shadow-lg" : "text-gray-500 hover:text-gray-300"}
//             `}
//           >
//             {activeTab === tab && (
//               <motion.div
//                 layoutId="bookingTab"
//                 className="absolute inset-0 bg-[#00A5E5] rounded-[20px]"
//                 transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
//               />
//             )}
//             <span className="relative z-10">{tab}</span>
//           </button>
//         ))}
//       </div>

//       {/* List Container */}
//       <div className="space-y-4">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={activeTab}
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//             transition={{ duration: 0.3 }}
//             className="space-y-4"
//           >
//             {bookingsData[activeTab as keyof typeof bookingsData].map((item: any, index: number) => (
//               <div
//                 key={index}
//                 className="p-8 rounded-[32px] bg-[#111116] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
//               >
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-3">
//                     <h3 className="text-xl font-bold text-white">{item.title}</h3>
//                     {item.status && (
//                       <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border
//                         ${item.status === 'Confirmed' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-[#00A5E5]/10 text-[#7C5CFF] border-[#7C5CFF]/20'}
//                       `}>
//                         {item.status}
//                       </span>
//                     )}
//                   </div>

//                   <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
//                     <div className="flex items-center gap-2">
//                       <Calendar size={16} className="text-gray-600" />
//                       {item.date}
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <MapPin size={16} className="text-gray-600" />
//                       {item.location}
//                     </div>
//                     {item.price && (
//                       <div className="flex items-center gap-1 font-bold text-gray-300">
//                         {item.price}
//                       </div>
//                     )}
//                   </div>

//                   {item.client && (
//                     <div className="text-xs text-gray-500 font-medium">
//                       Client: <span className="text-gray-400">{item.client}</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex items-center gap-3 w-full md:w-auto">
//                   {activeTab === "Pending Offers" ? (
//                     <>
//                       <button className="flex-1 md:flex-none px-8 py-3 rounded-2xl bg-[#00A5E5] text-white text-sm font-bold  transition-all shadow-lg shadow-[#7C5CFF]/10">
//                         Accept Offer
//                       </button>
//                       <button className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 text-sm font-bold hover:bg-white/[0.08] hover:text-white transition-all">
//                         Reject
//                       </button>
//                     </>
//                   ) : activeTab === "Confirmed Bookings" ? (
//                     <button className="w-full md:w-auto px-8 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-300 text-sm font-bold hover:bg-white/[0.08] hover:text-white transition-all flex items-center justify-center gap-2">
//                       <MessageSquare size={18} />
//                       Message Client
//                     </button>
//                   ) : (
//                     <button className="p-3 rounded-full bg-white/[0.03] border border-white/5 text-gray-500 group-hover:text-[#7C5CFF] group-hover:bg-[#00A5E5]/10 transition-all">
//                       <ChevronRight size={20} />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  MapPin,
  Calendar,
  ChevronRight
} from "lucide-react";
import { useAcceptOfferMutation, useBookingListQuery, useRejectOfferMutation } from "@/redux/feature/artistApi/bookingSlice";
import { toast } from "sonner";

const tabs = [
  { label: "Pending Offers", status: "pending" },
  { label: "Confirmed Bookings", status: "confirmed" },
  { label: "Past Events", status: "past" },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatAmount(cents: number) {
  return `$${(cents / 100).toLocaleString()}`;
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("pending");

  const { data, isLoading } = useBookingListQuery({
    scope: "sent",
    status: activeTab,
  });

  const allResults = data?.results ?? [];

  const [acceptOffer, { isLoading: acceptLoading }] = useAcceptOfferMutation();
  const [rejectOffer, { isLoading: rejectLoading }] = useRejectOfferMutation();

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(null);

  const handleAcceptOffer = async (id: string) => {
    setProcessingId(id);
    setActionType("accept");
    try {
      await acceptOffer(id).unwrap();
      toast.success("Offer accepted successfully");
    } catch (error: any) {
      toast.error(error?.data?.error?.message || "Failed to accept offer");
    } finally {
      setProcessingId(null);
      setActionType(null);
    }
  };

  const handleRejectOffer = async (id: string) => {
    setProcessingId(id);
    setActionType("reject");
    try {
      await rejectOffer(id).unwrap();
      toast.success("Offer rejected successfully");
    } catch (error: any) {
      console.log(error?.data?.error?.message)
      toast.error(error?.data?.error?.message || 'Failed to reject offer');
    } finally {
      setProcessingId(null);
      setActionType(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold text-white mb-2">Bookings</h1>
        <p className="text-gray-400 font-medium">Manage your offers and bookings</p>
      </div>

      {/* Tab Switcher */}
      <div className="bg-[#111116] border border-white/5 rounded-[24px] p-1.5 flex items-center max-w-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.status}
            onClick={() => setActiveTab(tab.status)}
            className={`flex-1 py-3 px-6 rounded-[20px] text-sm font-bold transition-all relative
              ${activeTab === tab.status ? "text-white shadow-lg" : "text-gray-500 hover:text-gray-300"}
            `}
          >
            {activeTab === tab.status && (
              <motion.div
                layoutId="bookingTab"
                className="absolute inset-0 bg-[#00A5E5] rounded-[20px]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {allResults?.length === 0 ? (
                <p className="text-gray-500 text-sm">No bookings found.</p>
              ) : (
                allResults?.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-8 rounded-[32px] bg-[#111116] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border
                          ${item.status === "confirmed"
                            ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                            : item.status === "pending"
                              ? "bg-[#00A5E5]/10 text-[#7C5CFF] border-[#7C5CFF]/20"
                              : "bg-white/5 text-gray-400 border-white/10"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-600" />
                          {formatDate(item.event_date)}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-600" />
                          {item.venue_name}
                        </div>
                        <div className="font-bold text-gray-300">
                          {formatAmount(item.amount_cents)}
                        </div>
                      </div>

                      {item.contact_name && (
                        <div className="text-xs text-gray-500 font-medium">
                          Contact: <span className="text-gray-400">{item.contact_name}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      {activeTab === "pending" ? (
                        <>
                          <button
                            onClick={() => handleAcceptOffer(item.id)}
                            disabled={processingId === item.id || acceptLoading}
                            className="flex-1 md:flex-none px-8 py-3 rounded-2xl bg-[#00A5E5] text-white text-sm font-bold  transition-all shadow-lg shadow-[#7C5CFF]/10 disabled:opacity-50"
                          >
                            {processingId === item.id && actionType === "accept" ? "Accepting..." : "Accept Offer"}
                          </button>
                          <button
                            onClick={() => handleRejectOffer(item.id)}
                            disabled={processingId === item.id || rejectLoading}
                            className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 text-sm font-bold hover:bg-white/[0.08] hover:text-white transition-all disabled:opacity-50"
                          >
                            {processingId === item.id && actionType === "reject" ? "Rejecting..." : "Reject"}
                          </button>
                        </>
                      ) : activeTab === "confirmed" ? (
                        <button className="w-full md:w-auto px-8 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-300 text-sm font-bold hover:bg-white/[0.08] hover:text-white transition-all flex items-center justify-center gap-2">
                          <MessageSquare size={18} />
                          Message Client
                        </button>
                      ) : (
                        <button className="p-3 rounded-full bg-white/[0.03] border border-white/5 text-gray-500 group-hover:text-[#7C5CFF] group-hover:bg-[#00A5E5]/10 transition-all">
                          <ChevronRight size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}