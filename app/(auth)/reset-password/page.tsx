"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Shield, Eye, Check, Key } from "lucide-react";

export default function ResetPassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isSuccess) {
    return (
      <div className="w-full max-w-[440px] mx-auto px-4">
        <Link
          href="/forgot-password"
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 ml-2 font-medium"
        >
          <ArrowLeft size={18} /> Back
        </Link>

        <div className="bg-[#111116] border border-white/5 p-8 md:p-10 rounded-[28px] shadow-2xl">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 rounded-full bg-green-500/5 animate-ping" />
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="text-green-500" size={32} />
              </div>
            </div>
            <h1 className="text-white text-[30px] font-medium mb-4 tracking-tight">Password Reset Successful!</h1>
            <p className="text-[#A1A1AA] text-base leading-relaxed">
              Your password has been updated successfully.
            </p>
          </div>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-[#111116] px-4">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                  <Lock className="text-gray-500" size={16} />
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/login"
            className="w-full bg-[#00A5E5]  text-white py-3 rounded-[20px] font-medium text-base shadow-lg shadow-[#7C5CFF]/20 active:scale-[0.98] transition-all flex items-center justify-center"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px] mx-auto px-4">
      <Link
        href="/forgot-password"
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 ml-2 font-medium"
      >
        <ArrowLeft size={18} /> Back
      </Link>

      <div className="bg-[#111116] border border-white/5 p-8 md:p-10 rounded-[28px] shadow-2xl">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-6">
            <Shield className="text-white" size={28} />
          </div>
          <h1 className="text-white text-[30px] font-medium mb-4 tracking-tight">Reset Password</h1>
          <p className="text-[#A1A1AA] text-base">
            Choose a new strong password for your account
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsSuccess(true); }}>
          {/* New Password */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#7C5CFF] transition-colors">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full h-[55px] bg-white/[0.04] border border-white/[0.08] rounded-[14px] pl-[48px] pr-12 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#7C5CFF] focus:border-[#7C5CFF] transition-all"
              placeholder="New Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <Eye size={20} />
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#7C5CFF] transition-colors">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full h-[55px] bg-white/[0.04] border border-white/[0.08] rounded-[14px] pl-[48px] pr-12 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#7C5CFF] focus:border-[#7C5CFF] transition-all"
              placeholder="Confirm New Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <Eye size={20} />
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#00A5E5]  text-white py-3 rounded-[20px] font-medium text-base shadow-lg shadow-[#7C5CFF]/20 active:scale-[0.98] transition-all mt-4"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
