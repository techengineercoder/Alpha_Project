"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check } from "lucide-react";

interface InviteSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  role: string;
  inviteLink: string;
}

export function InviteSuccessModal({
  isOpen,
  onClose,
  email,
  role,
  inviteLink,
}: InviteSuccessModalProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
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
          {/* Modal Container Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg bg-[#09090b] border border-white/10 rounded-[28px] shadow-2xl p-8 z-10 space-y-6 text-left max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            {/* Title / Close header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-xl text-white leading-tight">Member Invited</h3>
                <p className="text-sm text-gray-500 font-normal mt-0.5">
                  The invitation has been sent.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Description Text fields */}
            <div className="space-y-2.5 text-sm text-gray-400 font-medium leading-relaxed">
              <p>
                We sent an invitation to <span className="text-white font-bold">{email || "invited member"}</span>
              </p>
              <p>
                Once they accept, they will be added to your team as <span className="text-white font-bold">{role || "Talent Buyer"}</span>.
              </p>
            </div>

            {/* Copyable Invite Link container box */}
            <div className="flex items-center justify-between gap-3.5 bg-[#131316] border border-white/10 rounded-2xl p-3 pl-4.5 mt-4">
              <span className="text-gray-500 text-sm truncate flex-1 font-medium select-all">
                {inviteLink || "Generating invite link..."}
              </span>
              <button
                onClick={handleCopyLink}
                className="bg-[#00A5E5] hover:bg-[#00A5E5]/90 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer select-none"
              >
                {isCopied ? (
                  <>
                    <Check size={12} strokeWidth={3} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} strokeWidth={2.5} />
                    <span>Copy Invite Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Solid Close Button */}
            <button
              onClick={onClose}
              className="bg-[#00A5E5] hover:bg-[#00A5E5]/90 text-white font-semibold w-full py-3.5 rounded-full text-sm flex items-center justify-center transition-all cursor-pointer shadow-[0_4px_20px_rgba(0,165,229,0.15)]"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
