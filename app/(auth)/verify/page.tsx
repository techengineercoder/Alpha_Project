"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useVerifyEmailMutation, useResendOTPMutation } from "@/redux/feature/authApi";
import { toast } from "sonner";
import { handleError } from "@/lib/handleError";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/feature/authSlice";
import { Logo } from "@/components/icon/logo";

function VerifyCode() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(59);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = code.join("");
    if (otp.length < 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    try {
      const res = await verifyEmail({ email, otp }).unwrap();
      if (res.success) {
        toast.success(res.message || "Email verified successfully!");

        // Save to Redux (and localStorage via slice)
        dispatch(setUser({
          user: res.user,
          access: res.access,
          refresh: res.refresh
        }));

        router.push("/onboarding");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    try {
      const res = await resendOTP({ email }).unwrap();
      if (res.success) {
        toast.success(res.message || "Verification code resent successfully!");
        setCountdown(59);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="w-full max-w-[400px]">
      <Link 
        href="/register"
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
        <h1 className="text-white text-[28px] font-semibold mb-2 tracking-tight">Verification Code</h1>
        <p className="text-gray-400 text-sm font-medium">
          We sent a 6-digit code to <span className="text-white">{email || "your email"}</span>
        </p>
      </div>

      <div className="flex justify-between gap-2 mb-8">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el: HTMLInputElement | null) => { inputs.current[index] = el; }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-[52px] h-[52px] bg-[#1E1E24] border border-transparent rounded-[10px] text-center text-white text-xl font-medium focus:outline-none focus:ring-1 focus:ring-[#00A5E5] focus:border-[#00A5E5] transition-all"
          />
        ))}
      </div>

      <div className="text-center mb-8">
        <p className="text-[13px] text-gray-400 font-medium">
          {countdown > 0 ? (
            <>Resend Code in <span className="text-[#00A5E5]">00:{countdown.toString().padStart(2, "0")}</span></>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-[#00A5E5] hover:underline font-medium"
            >
              {isResending ? "Resending..." : "Resend Code Now"}
            </button>
          )}
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full h-[48px] bg-[#00A5E5] text-white rounded-[10px] font-medium text-sm hover:bg-[#00A5E5]/90 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isVerifying ? "Verifying..." : "Verify Code"}
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-[13px] font-medium leading-relaxed">
          Didn't get the code? Check your spam folder or{" "}
          <Link href="/register" className="text-white hover:underline block mx-auto mt-1">
            try a different email
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyCode />
    </Suspense>
  )
}