"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SignOutModal({ isOpen, onClose, onConfirm }: SignOutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black backdrop-blur-sm"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-sm bg-[#09090b] border border-white/10 rounded-[28px] shadow-2xl p-8 z-10 space-y-6 text-center max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Logout Icon Graphic */}
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500 mx-auto shadow-[0_0_25px_rgba(239,68,68,0.15)] select-none">
              <LogOut size={26} strokeWidth={2.5} />
            </div>

            <div className="space-y-2">
              <h3 className="text-white text-2xl font-bold tracking-tight leading-tight">
                Sign Out
              </h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed px-2">
                Are you sure you want to sign out? You will need to sign back in to access your dashboard.
              </p>
            </div>

            <div className="h-px bg-white/5" />

            {/* Actions Buttons Row */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-1/2 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white font-semibold py-3 rounded-xl text-sm transition-all cursor-pointer select-none"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="w-full sm:w-1/2 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(239,68,68,0.15)] transition-all cursor-pointer select-none"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
