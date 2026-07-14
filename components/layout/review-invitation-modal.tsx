"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";

interface ReviewInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: "details" | "success";
  loadingProgress: number;
  onAccept: () => void;
}

export function ReviewInvitationModal({
  isOpen,
  onClose,
  step,
  loadingProgress,
  onAccept,
}: ReviewInvitationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={step === "details" ? onClose : undefined}
            className="absolute inset-0 bg-black backdrop-blur-sm"
          />

          {step === "details" ? (
            /* DETAILS STEP PANEL */
            <motion.div
              key="details"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-lg bg-[#09090b] border border-white/10 rounded-[28px] shadow-2xl p-8 md:p-10 z-10 space-y-6 text-center max-h-[95vh] overflow-y-auto no-scrollbar"
            >
              {/* Close Icon Button */}
              <button
                onClick={onClose}
                className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Agency Logo visual */}
              <div className="pt-4 flex flex-col items-center">
                <div className="w-[72px] h-[72px] rounded-2xl bg-[#162742] border border-[#00A5E5]/20 flex items-center justify-center text-white font-bold text-3xl select-none">
                  A
                </div>
                <p className="text-sm text-gray-400 font-medium mt-1.5">
                  Apex Agency
                </p>
              </div>

              <div className="h-px bg-white/5" />

              {/* Scope title header */}
              <div className="space-y-1.5">
                <p className="text-gray-400 text-sm font-medium">
                  You've been invited to join
                </p>
                <h3 className="text-white text-[28px] font-bold tracking-tight leading-tight mt-1.5">
                  Apex Agency
                </h3>
                <div className="flex flex-col items-center pt-3.5">
                  <span className="text-gray-500 text-sm font-medium select-none">
                    Your role:
                  </span>
                  <span className="px-5 py-1.5 rounded-full text-sm font-bold text-[#00A5E5] bg-[#00A5E5]/5 border border-[#00A5E5]/20 mt-1 select-none">
                    Talent Buyer
                  </span>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* Info grid detail parameters box */}
              <div className="bg-[#131316] border border-white/10 rounded-2xl p-5 text-left space-y-3.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Invited by</span>
                  <span className="text-white font-bold">Name Example</span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Team</span>
                  <span className="text-white font-bold">Apex Agency</span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Role assigned</span>
                  <span className="text-white font-bold">Talent Buyer</span>
                </div>
              </div>

              {/* Permissions Checklist */}
              <div className="text-left space-y-3">
                <p className="text-gray-400 text-sm font-medium tracking-tight">
                  As a Talent Buyer, you'll be able to:
                </p>
                <div className="space-y-3 pl-1">
                  {[
                    "Search and discover artists",
                    "Send and manage booking offers",
                    "Access contracts and negotiations",
                    "View your bookings calendar",
                  ].map((perm) => (
                    <div key={perm} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                      <Check size={16} className="text-[#00A5E5] shrink-0" strokeWidth={2.5} />
                      <span>{perm}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* Buttons Actions */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={onAccept}
                  className="w-full bg-[#00A5E5] hover:bg-[#00A5E5]/90 text-white font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(0,165,229,0.15)] transition-all cursor-pointer select-none"
                >
                  <Check size={16} strokeWidth={2.5} />
                  <span>Accept Invitation</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full border border-[#EF4444]/30 hover:border-[#EF4444]/50 text-[#EF4444] hover:bg-[#EF4444]/5 font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center transition-all cursor-pointer select-none"
                >
                  <span>Decline</span>
                </button>
              </div>

              <p className="text-gray-500 text-xs font-normal leading-relaxed mt-2 block">
                You can leave the team at any time from your settings.
              </p>
            </motion.div>
          ) : (
            /* SUCCESS LOADER PANEL */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-[#09090b] border border-white/10 rounded-[28px] shadow-2xl p-8 z-10 text-center space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="w-16 h-16 rounded-full bg-[#10B981]/15 border border-[#10B981]/25 flex items-center justify-center text-[#10B981] mx-auto shadow-[0_0_25px_rgba(16,185,129,0.15)] select-none">
                <Check size={28} strokeWidth={3} />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-white text-2xl font-bold tracking-tight leading-tight">
                  You're in!
                </h3>
                <p className="text-gray-400 text-sm font-semibold">
                  Welcome to Apex Agency
                </p>
              </div>

              <div className="flex flex-col items-center py-1 select-none">
                <span className="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-1.5">
                  You've joined as
                </span>
                <span className="px-4 py-1.5 rounded-full text-xs font-bold text-[#00A5E5] bg-[#00A5E5]/10 border border-[#00A5E5]/20 uppercase tracking-wider">
                  Talent Buyer
                </span>
              </div>

              {/* Progress Horizontal Loading Track */}
              <div className="space-y-2 pt-2">
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-[#00A5E5] rounded-full transition-all duration-100 ease-out shadow-[0_0_10px_rgba(0,165,229,0.5)]"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <p className="text-gray-500 text-xs font-semibold animate-pulse">
                  Setting up your dashboard...
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
