"use client";

import Link from "next/link";
import { Check, Zap } from "lucide-react";

export default function RegisterSuccess() {
  return (
    <div className="w-full max-w-[480px] mx-auto px-4">
      <div className="bg-[#111116] border border-white/5 p-10 md:p-12 rounded-[28px] shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-[22px] bg-[#00A5E5] flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(124,92,255,0.3)]">
            <Zap className="text-white fill-white" size={36} />
          </div>

          <h1 className="text-white text-[30px] font-medium mb-5 tracking-tight">You're all set!</h1>

          <p className="text-[#A1A1AA] text-lg leading-relaxed mb-12 max-w-[280px]">
            Your profile is active. Ready to start booking artists.
          </p>

          <Link
            href="/"
            className="w-full bg-[#00A5E5]  text-white py-3 rounded-[20px] font-medium text-lg shadow-lg shadow-[#7C5CFF]/20 active:scale-[0.98] transition-all flex items-center justify-center"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}
