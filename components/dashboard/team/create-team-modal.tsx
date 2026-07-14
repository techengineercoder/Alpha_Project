"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (name: string) => void;
}

export function CreateTeamModal({
  isOpen,
  onClose,
  onCreateTeam,
}: CreateTeamModalProps) {
  const [newTeamName, setNewTeamName] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    onCreateTeam(newTeamName);
    setNewTeamName("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black backdrop-blur-sm"
          />
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-[#09090b] border border-white/10 rounded-[28px] shadow-2xl p-8 z-10 space-y-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-xl text-white leading-tight">New Team</h3>
                <p className="text-sm text-gray-500 font-normal mt-1">
                  Teams have their own members, roles, and permissions.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[16.06px] leading-[24.09px] font-semibold text-white tracking-[0px] mb-2.5 block">
                  Team Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Agency, Bluewave Booking..."
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full bg-[#131316] border border-white/10 focus:border-[#00A5E5]/30 transition-all rounded-2xl py-3.5 px-4 text-sm text-white placeholder-[#71717A] focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00A5E5] hover:bg-[#00A5E5]/90 text-white font-semibold rounded-full px-6 py-2.5 text-sm shadow-[0_4px_16px_rgba(0,165,229,0.15)] transition-all cursor-pointer"
                >
                  Create Team
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
