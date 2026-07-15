"use client";

import React from "react";
import { motion } from "framer-motion";

interface LogoLoaderProps {
  fullScreen?: boolean;
  text?: string;
}

export function LogoLoader({ fullScreen = false, text = "Loading GetAvails..." }: LogoLoaderProps) {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Animated Ring and Pulsing Logo Wrapper */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Glowing dashed progress ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-[#00A5E5]/30 border-t-[#00A5E5] shadow-[0_0_15px_rgba(0,165,229,0.15)]"
        />

        {/* Outer glowing pulsing ring */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-2 rounded-full border border-[#7C5CFF]/20 shadow-[0_0_20px_rgba(124,92,255,0.1)]"
        />

        {/* Pulsing White Logo */}
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="relative z-10 flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]"
        >
          <svg width="44" height="38" viewBox="0 0 37 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M33.3049 26.1478L9.16267 26.3806L18.2056 9.56264L23.1901 18.2399L15.4541 18.0862L13.05 22.6026L31.3047 22.6654L18.2867 0L0 31.6981L36.4528 31.6286L33.3049 26.1478Z"
              fill="#FEFEFE"
            />
          </svg>
        </motion.div>
      </div>

      {/* Loading message */}
      {text && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="text-gray-400 text-xs md:text-sm font-semibold tracking-widest uppercase select-none"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 min-h-screen bg-[#050505] flex items-center justify-center z-[9999]">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {loaderContent}
    </div>
  );
}
