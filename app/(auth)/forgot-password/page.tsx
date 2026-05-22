"use client";

import Link from "next/link";
import { Mail, ArrowRight, Lock } from "lucide-react";

export default function ForgotPassword() {
  return (
    <div className="w-full max-w-[440px] mx-auto px-4">
      <div className="bg-[#111116] border border-white/5 p-8 md:p-10 rounded-[28px] shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-6">
            <Lock className="text-white" size={28} />
          </div>
          <h1 className="text-white text-[30px] font-medium mb-3 tracking-tight">Reset Password</h1>
          <p className="text-[#A1A1AA] text-base text-center">
            Enter your email to receive a reset link
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-3">
            <label className="block text-base font-medium text-[#FFFFFF] ml-1">
              Email
            </label>
            <div className="relative flex items-center group">
              <div className="absolute left-4 text-gray-500 group-focus-within:text-[#7C5CFF] transition-colors">
                <Mail size={20} />
              </div>
              <input
                type="email"
                className="w-full h-[50px] bg-white/[0.04] border border-white/[0.08] rounded-[14px] pl-[48px] pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#7C5CFF] focus:border-[#7C5CFF] transition-all"
                placeholder="admin@getavails.com"
              />
            </div>
          </div>

          <button
            type="submit"
            onClick={() => window.location.href = '/verify'}
            className="w-full bg-[#7C5CFF] hover:bg-[#6A4BE5] text-white py-3 rounded-[20px] font-medium text-base shadow-lg shadow-[#7C5CFF]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Send Reset Link <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="text-gray-400 text-sm font-semibold hover:text-white transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
