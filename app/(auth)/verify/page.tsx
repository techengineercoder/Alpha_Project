"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Smartphone } from "lucide-react";
import { useVerifyEmailMutation, useResendOTPMutation } from "@/redux/feature/authApi";
import { toast } from "sonner";
import { handleError } from "@/lib/handleError";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/feature/authSlice";

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

        router.push("/");
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
    <div className="w-full max-w-[440px] mx-auto px-4 py-10">
      <Link
        href="/register"
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 ml-2 font-medium"
      >
        <ArrowLeft size={18} /> Back
      </Link>

      <div className="bg-[#111116] border border-white/5 p-8 md:p-10 rounded-[28px] shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-6">
            <Smartphone className="text-white" size={28} />
          </div>
          <h1 className="text-white text-[30px] font-medium mb-4 tracking-tight text-center">Verification Code</h1>
          <p className="text-[#A1A1AA] text-base text-center max-w-[280px]">
            We sent a 6-digit code to <span className="text-white">{email || "your email"}</span>
          </p>
        </div>

        <div className="flex justify-between gap-2 mb-4">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el: HTMLInputElement | null) => { inputs.current[index] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-[50px] h-[60px] bg-white/[0.04] border border-white/[0.08] rounded-[14px] text-center text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/50 focus:border-[#7C5CFF] transition-all"
            />
          ))}
        </div>

        <div className="text-center mb-10">
          <p className="text-xs text-gray-500 font-medium">
            {countdown > 0 ? (
              <>Resend Code in <span className="text-white">00:{countdown.toString().padStart(2, "0")}</span></>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-[#7C5CFF] hover:underline font-bold"
              >
                {isResending ? "Resending..." : "Resend Code Now"}
              </button>
            )}
          </p>
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full bg-[#7C5CFF] hover:bg-[#6A4BE5] text-white py-3 rounded-[20px] font-medium text-base shadow-lg shadow-[#7C5CFF]/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isVerifying ? "Verifying..." : "Verify Code"}
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            Didn't get the code? Check your spam folder or{" "}
            <Link href="/register" className="text-[#7C5CFF] font-bold hover:underline block mx-auto mt-1">
              try a different email
            </Link>
          </p>
        </div>
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