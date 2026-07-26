"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Logo } from "@/components/icon/logo";
import { useForgotPasswordMutation } from "@/redux/feature/authApi";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(res?.message || "OTP has been sent to your email!");

      // Redirect to Verify OTP page, passing email in query params
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      console.error("Forgot password error:", err);
      const errorMessage =
        err?.data?.error?.message ||
        err?.data?.error?.details?.detail ||
        err?.data?.message ||
        err?.data?.detail ||
        (typeof err?.data?.error === "string" ? err?.data?.error : null) ||
        err?.message ||
        "Failed to send reset code. Please try again.";
      toast.error(errorMessage);
    }
  };

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
        <p className="text-gray-400 text-sm font-medium">Enter your email to receive an OTP code</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="block text-[13px] font-medium text-gray-200">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-[48px] bg-[#1E1E24] border border-transparent rounded-[10px] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00A5E5] focus:border-[#00A5E5] transition-all text-sm"
            placeholder="admin@getavails.com"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[48px] bg-[#00A5E5] text-white rounded-[10px] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#00A5E5]/90 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send OTP"} <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

