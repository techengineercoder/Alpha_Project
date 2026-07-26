"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Trash2, Loader2 } from "lucide-react";

interface DeleteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teamName: string;
  isLoading: boolean;
}

export function DeleteTeamModal({
  isOpen,
  onClose,
  onConfirm,
  teamName,
  isLoading,
}: DeleteTeamModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="absolute inset-0 bg-black backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-[#09090b] border border-white/10 rounded-[28px] shadow-2xl p-8 z-10 space-y-6 text-center"
          >
            {/* Close Button */}
            {!isLoading && (
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            )}

            {/* Warning Icon Banner */}
            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-2">
              <AlertTriangle size={32} />
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-white leading-tight">Delete Team</h3>
              <p className="text-sm text-gray-400 leading-relaxed px-4">
                Are you sure you want to delete <span className="text-red-400 font-semibold">"{teamName}"</span>? All associated members, bookings, and permissions will be removed. This action cannot be undone.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 h-12 bg-white/5 border border-white/10 rounded-2xl text-white font-semibold text-sm hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 select-none flex items-center justify-center"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 h-12 bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-semibold text-sm rounded-2xl transition-all cursor-pointer disabled:opacity-50 select-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete Team</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
