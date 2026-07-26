"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { Eye, EyeOff, Check, ChevronDown } from "lucide-react";
import { Logo } from "@/components/icon/logo";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/redux/feature/authApi";
import { toast } from "sonner";

function ResetPasswordContent() {
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";
  const resetToken = searchParams.get("reset_token") || searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      // Send reset password request with backend expected reset_token and new_password keys
      await resetPassword({
        reset_token: resetToken,
        new_password: password,
        password: password,
        confirm_password: confirmPassword,
        password_confirm: confirmPassword,
        email,
        otp,
      }).unwrap();

      toast.success("Password reset successful!");
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Reset password error:", err);
      // Try to read details from the API error
      const details = err?.data?.error?.details;
      const errorMsg =
        details?.non_field_errors?.[0] ||
        details?.new_password?.[0] ||
        details?.reset_token?.[0] ||
        (Array.isArray(details) ? details[0] : null) ||
        err?.data?.error?.message ||
        err?.data?.message ||
        err?.data?.detail ||
        err?.message ||
        "Failed to reset password. Please try again.";
      toast.error(errorMsg);
    }
  };

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
            Your password has been updated successfully. Redirecting you to login...
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
        href={`/verify-otp?email=${encodeURIComponent(email)}`}
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

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* New Password */}
        <div className="space-y-2">
          <label className="block text-[13px] font-medium text-gray-200">
            New Password
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-[48px] bg-[#1E1E24] border border-transparent rounded-[10px] pl-4 pr-[48px] py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00A5E5] focus:border-[#00A5E5] transition-all text-sm"
              placeholder="New Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-gray-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full h-[48px] bg-[#1E1E24] border border-transparent rounded-[10px] pl-4 pr-[48px] py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00A5E5] focus:border-[#00A5E5] transition-all text-sm"
              placeholder="Confirm New Password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 text-gray-500 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[48px] bg-[#00A5E5] text-white rounded-[10px] font-medium text-sm hover:bg-[#00A5E5]/90 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

