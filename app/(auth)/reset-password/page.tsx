"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Check, ChevronDown } from "lucide-react";
import { Logo } from "@/components/icon/logo";

export default function ResetPassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isSuccess) {
    return (
      <div className="w-full max-w-[400px]">
        <div className="mb-10 text-center">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>
          
          <div className="w-20 h-20 rounded-full bg-[#00A5E5]/10 flex items-center justify-center mb-8 mx-auto relative">
            <div className="absolute inset-0 rounded-full bg-[#00A5E5]/5 animate-ping" />
            <div className="w-16 h-16 rounded-full bg-[#00A5E5]/20 flex items-center justify-center">
              <Check className="text-[#00A5E5]" size={32} />
            </div>
          </div>
          
          <h1 className="text-white text-[28px] font-semibold mb-2 tracking-tight">Password Reset Successful!</h1>
          <p className="text-gray-400 text-sm font-medium leading-relaxed">
            Your password has been updated successfully.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/login"
            className="w-full h-[48px] bg-[#00A5E5] text-white rounded-[10px] font-medium text-sm flex items-center justify-center hover:bg-[#00A5E5]/90 active:scale-[0.99] transition-all"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px]">
      <Link 
        href="/forgot-password"
        className="mb-8 flex items-center text-[13px] font-medium text-gray-400 hover:text-white transition-colors"
      >
        <ChevronDown size={16} className="rotate-90 mr-1" />
        Back
      </Link>
      
      {/* Header Section */}
      <div className="mb-10 text-center">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-white text-[28px] font-semibold mb-2 tracking-tight">Reset Password</h1>
        <p className="text-gray-400 text-sm font-medium">Choose a new strong password for your account</p>
      </div>

      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsSuccess(true); }}>
        {/* New Password */}
        <div className="space-y-2">
          <label className="block text-[13px] font-medium text-gray-200">
            New Password
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full h-[48px] bg-[#1E1E24] border border-transparent rounded-[10px] pl-4 pr-[48px] py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00A5E5] focus:border-[#00A5E5] transition-all text-sm"
              placeholder="New Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-gray-500 hover:text-white transition-colors"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="block text-[13px] font-medium text-gray-200">
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full h-[48px] bg-[#1E1E24] border border-transparent rounded-[10px] pl-4 pr-[48px] py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00A5E5] focus:border-[#00A5E5] transition-all text-sm"
              placeholder="Confirm New Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-gray-500 hover:text-white transition-colors"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-[48px] bg-[#00A5E5] text-white rounded-[10px] font-medium text-sm hover:bg-[#00A5E5]/90 active:scale-[0.99] transition-all"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
}
