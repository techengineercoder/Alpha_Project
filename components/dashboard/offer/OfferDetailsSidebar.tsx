"use client";

import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface OfferItem {
  id: string;
  offerId: string;
  artistName: string;
  genre: string;
  agency: string;
  eventDate: string;
  eventTime: string;
  setLength: string;
  stage: string;
  capacity: string;
  fee: string;
  status: "Pending" | "Accepted" | "Rejected";
  flow: "Received" | "Sent";
  timeAgo: string;
  avatarChar: string;
  avatarBg: string;
  type?: string;
}

interface OfferDetailsSidebarProps {
  selectedOffer: OfferItem | null;
  onClose: () => void;
}

export const OfferDetailsSidebar: React.FC<OfferDetailsSidebarProps> = ({
  selectedOffer,
  onClose
}) => {
  return (
    <AnimatePresence>
      {selectedOffer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 cursor-pointer backdrop-blur-sm"
          />

          {/* Sidebar Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[460px] bg-[#050505] border-l border-zinc-900 z-50 overflow-y-auto flex flex-col justify-between font-sans shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-900 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg shrink-0 bg-[#3f2038] border border-[#522d4a]">
                    {selectedOffer.avatarChar}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-lg text-white block truncate leading-tight">{selectedOffer.artistName}</span>
                    <span className="text-xs text-zinc-550 block mt-1 leading-none">{selectedOffer.genre}</span>
                    <span className="text-xs text-zinc-500 block italic mt-1 leading-none">{selectedOffer.agency}</span>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1.5 text-zinc-555 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-zinc-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {selectedOffer.status === "Pending" && (
                  <span 
                    style={{
                      height: "26px",
                      borderRadius: "9999px",
                      borderWidth: "1px",
                      borderColor: "rgba(245, 158, 11, 0.4)",
                      backgroundColor: "rgba(245, 158, 11, 0.15)",
                      paddingTop: "2px",
                      paddingBottom: "2px",
                      paddingLeft: "10px",
                      paddingRight: "10px"
                    }}
                    className="text-[#F59E0B] text-[10px] font-bold flex items-center gap-1 font-sans"
                  >
                    <span>⏳ Pending</span>
                  </span>
                )}
                {selectedOffer.status === "Accepted" && (
                  <span 
                    style={{
                      height: "26px",
                      borderRadius: "9999px",
                      borderWidth: "1px",
                      borderColor: "rgba(16, 185, 129, 0.4)",
                      backgroundColor: "rgba(16, 185, 129, 0.15)",
                      paddingTop: "2px",
                      paddingBottom: "2px",
                      paddingLeft: "10px",
                      paddingRight: "10px"
                    }}
                    className="text-[#10B981] text-[10px] font-bold flex items-center gap-1 font-sans"
                  >
                    <span>✓ Accepted</span>
                  </span>
                )}
                {selectedOffer.status === "Rejected" && (
                  <span 
                    style={{
                      height: "26px",
                      borderRadius: "9999px",
                      borderWidth: "1px",
                      borderColor: "rgba(239, 68, 68, 0.4)",
                      backgroundColor: "rgba(239, 68, 68, 0.15)",
                      paddingTop: "2px",
                      paddingBottom: "2px",
                      paddingLeft: "10px",
                      paddingRight: "10px"
                    }}
                    className="text-[#ef4444] text-[10px] font-bold flex items-center gap-1 font-sans"
                  >
                    <span>✕ Rejected</span>
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500 font-mono tracking-wider font-semibold">
                  {selectedOffer.offerId}
                </span>
              </div>
            </div>

            {/* Scrollable details contents */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
              {/* OFFER TERMS CARD */}
              <div 
                style={{
                  borderRadius: "19.81px",
                  borderWidth: "1.24px",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  padding: "19.81px"
                }}
                className="space-y-4"
              >
                <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider font-sans block">
                  OFFER TERMS
                </span>
                <div className="text-3xl font-bold text-[#00A5E5] font-sans pb-2">
                  ${parseFloat(selectedOffer.fee.replace(/,/g, "")).toLocaleString()}
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium font-sans">Offer Type</span>
                    <span className="text-white font-semibold font-sans">{selectedOffer.type || "Flat Fee"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium font-sans">Event Date</span>
                    <span className="text-white font-semibold font-sans">{selectedOffer.eventDate}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium font-sans">Event Time</span>
                    <span className="text-white font-semibold font-sans">{selectedOffer.eventTime}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium font-sans">Set Length</span>
                    <span className="text-white font-semibold font-sans">{selectedOffer.setLength} set</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium font-sans">Stage</span>
                    <span className="text-white font-semibold font-sans">{selectedOffer.stage}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium font-sans">Capacity</span>
                    <span className="text-white font-semibold font-sans">{selectedOffer.capacity}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-550 font-medium font-sans">Ticket Scaling</span>
                    <span className="text-white font-semibold font-sans">$45.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-550 font-medium font-sans">Ticket Price</span>
                    <span className="text-white font-semibold font-sans">$65.00</span>
                  </div>
                </div>
              </div>

              {/* VENUE INFO CARD */}
              <div 
                style={{
                  borderRadius: "19.81px",
                  borderWidth: "1.24px",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  padding: "19.81px"
                }}
                className="space-y-4"
              >
                <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider font-sans block">
                  VENUE INFO
                </span>
                
                <div className="space-y-3 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-medium font-sans">Venue Name</span>
                    <span className="text-white font-semibold font-sans">Riverside Grounds</span>
                  </div>
                  <div className="flex justify-between items-start text-xs">
                    <span className="text-zinc-500 font-medium font-sans shrink-0">Address</span>
                    <span className="text-white font-semibold font-sans text-right max-w-[200px]">1200 Riverside Blvd, Miami FL</span>
                  </div>
                  <div className="flex justify-between items-start text-xs">
                    <span className="text-zinc-500 font-medium font-sans shrink-0">Requirements</span>
                    <span className="text-white font-semibold font-sans text-right max-w-[200px]">Artist requires full backline</span>
                  </div>
                </div>
              </div>

              {/* ADDITIONAL INCLUDES CARD */}
              <div 
                style={{
                  borderRadius: "19.81px",
                  borderWidth: "1.24px",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  padding: "19.81px"
                }}
                className="space-y-4"
              >
                <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider font-sans block">
                  ADDITIONAL INCLUDES
                </span>
                
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {["Sound System", "Lighting", "Hospitality"].map((inc) => (
                    <span 
                      key={inc}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold border border-cyan-500/20 bg-cyan-500/5 text-[#00A5E5] font-sans"
                    >
                      {inc}
                    </span>
                  ))}
                </div>
              </div>

              {/* DOCUMENTS CARD */}
              <div 
                style={{
                  borderRadius: "19.81px",
                  borderWidth: "1.24px",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  padding: "19.81px"
                }}
                className="space-y-4"
              >
                <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider font-sans block">
                  DOCUMENTS
                </span>
                
                <div className="space-y-3.5 pt-1">
                  {[
                    { name: "rider_v2.pdf", size: "240KB" },
                    { name: "stage_plot.pdf", size: "180KB" }
                  ].map((doc) => (
                    <div key={doc.name} className="flex justify-between items-center gap-3">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">{doc.name}</span>
                        <span className="text-[10px] text-zinc-500 block truncate mt-0.5">{doc.size}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button 
                          onClick={() => toast.info(`Viewing ${doc.name}...`)}
                          className="h-8 px-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-[10px] font-semibold text-zinc-300 transition-colors cursor-pointer"
                        >
                          Preview
                        </button>
                        <button 
                          onClick={() => toast.success(`Downloading ${doc.name}...`)}
                          className="h-8 px-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-[10px] font-semibold text-zinc-300 transition-colors cursor-pointer"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="p-4 border-t border-zinc-900 bg-[#050505] grid grid-cols-3 gap-3 sticky bottom-0 z-50">
              <button 
                onClick={() => {
                  toast.success("Offer Rejected");
                  onClose();
                }}
                className="h-11 rounded-xl border border-red-950 bg-[#160c0e] hover:bg-[#201013] text-red-500 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
              >
                Reject
              </button>
              <button 
                onClick={() => {
                  toast.info("Counter offer initiated.");
                  onClose();
                }}
                className="h-11 rounded-xl border border-zinc-800 bg-[#121214] hover:bg-zinc-900 text-zinc-300 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
              >
                Counter
              </button>
              <button 
                onClick={() => {
                  toast.success("Offer Accepted successfully!");
                  onClose();
                }}
                className="h-11 rounded-xl bg-[#00A5E5] hover:bg-[#009bde] text-white font-bold text-xs flex items-center justify-center transition-colors cursor-pointer shadow-md shadow-cyan-500/10"
              >
                Accept
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
