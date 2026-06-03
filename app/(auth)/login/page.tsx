"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useGoogleLoginMutation, useLoginMutation } from "@/redux/feature/authApi";
import { toast } from "sonner";
import { handleError } from "@/lib/handleError";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/feature/authSlice";
import { saveTokens } from "@/service/authService";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";


export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember_me: false,
  });

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const [googleLogin] = useGoogleLoginMutation();

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      // Send to backend
      const response = await googleLogin({
        id_token: credentialResponse.credential,
      }).unwrap();

      // Save to cookies
      await saveTokens(response.access);

      // Save to Redux (and localStorage via slice)
      dispatch(setUser({
        user: response.user,
        access: response.access,
        refresh: response.refresh
      }));

      toast.success("Google login successful!");
      router.push("/");
    } catch (error: unknown) {
      console.error("Google login error:", error);
      handleError(error);
    }
  };

  const handleGoogleError = () => {
    console.log("Google login failed");
    toast.error("Google login failed. Please try again.");
  };

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
        remember_me: true,
      }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await login(formData).unwrap();

      if (res.success) {
        toast.success(res.message || "Login successful!");

        // Handle Remember Me
        if (formData.remember_me) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

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

  return (
    <div>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_API_KEY_CLIENT_ID || ''}>

        <div className="w-full max-w-[440px] mx-auto px-4 py-10">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-white text-2xl font-semibold mb-6 tracking-tight">ArtistBook</h2>
            <h1 className="text-white text-[30px] font-medium mb-4 tracking-tight">Welcome Back</h1>
            <p className="text-[#A1A1AA] text-base font-medium">Sign in to your account to continue</p>
          </div>

          <div className="bg-[#111116] border border-white/5 p-8 md:p-10 rounded-[28px] shadow-2xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Address */}
              <div className="space-y-3">
                <label className="block text-base font-medium text-[#FFFFFF] ml-1">
                  Email Address
                </label>
                <div className="relative flex items-center group">
                  <div className="absolute left-4 text-gray-500 group-focus-within:text-[#7C5CFF] transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full h-[50px] bg-white/[0.04] border border-white/[0.08] rounded-[14px] pl-[48px] pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#7C5CFF] focus:border-[#7C5CFF] transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <label className="block text-base font-medium text-[#FFFFFF] ml-1">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#FF4B4B] hover:text-[#ff6b6b] transition-colors font-semibold"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative flex items-center group">
                  <div className="absolute left-4 text-gray-500 group-focus-within:text-[#7C5CFF] transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full h-[50px] bg-white/[0.04] border border-white/[0.08] rounded-[14px] pl-[48px] pr-[48px] py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#7C5CFF] focus:border-[#7C5CFF] transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center ml-1">
                <div className="relative flex items-center h-5">
                  <input
                    type="checkbox"
                    id="remember_me"
                    name="remember_me"
                    checked={formData.remember_me}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#7C5CFF] focus:ring-[#7C5CFF] focus:ring-offset-0 transition-all cursor-pointer"
                  />
                </div>
                <label htmlFor="remember_me" className="ml-2 text-sm text-gray-400 cursor-pointer select-none">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#7C5CFF] hover:bg-[#6A4BE5] text-white py-3 rounded-[20px] font-medium text-base shadow-lg shadow-[#7C5CFF]/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-medium">
                <span className="bg-[#111116] px-4 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                shape="pill"
                theme="filled_black"
                size="large"
                text="continue_with"
                width="300"
              />
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm font-medium">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-[#7C5CFF] font-bold hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </div>
  );
}
