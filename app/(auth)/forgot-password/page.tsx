"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Logo } from "@/components/icon/logo";

export default function ForgotPassword() {
  return (
    <div className="w-full max-w-[400px]">
      <Link 
        href="/login"
        className="mb-8 flex items-center text-[13px] font-medium text-gray-400 hover:text-white transition-colors"
      >
        <ChevronDown size={16} className="rotate-90 mr-1" />
        Back to Login
      </Link>
      
      {/* Header Section */}
      <div className="mb-10 text-center">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-white text-[28px] font-semibold mb-2 tracking-tight">Reset Password</h1>
        <p className="text-gray-400 text-sm font-medium">Enter your email to receive a reset link</p>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label className="block text-[13px] font-medium text-gray-200">
            Email Address
          </label>
          <input
            type="email"
            className="w-full h-[48px] bg-[#1E1E24] border border-transparent rounded-[10px] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00A5E5] focus:border-[#00A5E5] transition-all text-sm"
            placeholder="admin@getavails.com"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            onClick={() => window.location.href = '/verify'}
            className="w-full h-[48px] bg-[#00A5E5] text-white rounded-[10px] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#00A5E5]/90 active:scale-[0.99] transition-all"
          >
            Send Reset Link <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
