"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useGoogleLoginMutation, useLoginMutation } from "@/redux/feature/authApi";
import { toast } from "sonner";
import { handleError } from "@/lib/handleError";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/feature/authSlice";
import { Logo } from "@/components/icon/logo";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember_me: false,
  });

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const [googleLoginMutation] = useGoogleLoginMutation();

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      // Send to backend
      const response = await googleLoginMutation({
        id_token: credentialResponse.credential,
      }).unwrap();

      // Save to cookies securely on the client side
      document.cookie = `token=${response.access}; path=/; max-age=31536000; SameSite=Lax`;

      // Save to Redux (and localStorage via slice)
      dispatch(setUser({
        user: response.user,
        access: response.access,
        refresh: response.refresh
      }));

      toast.success("Google login successful!");
      router.push(nextParam);
    } catch (error: unknown) {
      console.error("Google login error:", error);
      handleError(error);
    }
  };

  const handleGoogleError = () => {
    console.log("Google login failed");
    toast.error("Google login failed. Please try again.");
  };

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

  const toggleRememberMe = () => {
    setFormData(prev => ({ ...prev, remember_me: !prev.remember_me }));
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

        if (formData.remember_me) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        dispatch(setUser({
          user: res.user,
          access: res.access,
          refresh: res.refresh
        }));

        router.push(nextParam);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_API_KEY_CLIENT_ID || ''}>
      <div className="w-full max-w-[400px]">
        <div className="mb-10">
          <div className="mb-8">
            <Logo />
          </div>
          <h1 className="text-white text-[28px] font-semibold mb-2 tracking-tight">Welcome Back!</h1>
          <p className="text-gray-400 text-sm font-medium">Log in to connect, book, and manage with ease</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-gray-200">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full h-[48px] bg-[#1E1E24] border border-transparent rounded-[10px] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00A5E5] focus:border-[#00A5E5] transition-all text-sm"
              placeholder="Enter Your email"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-gray-200">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full h-[48px] bg-[#1E1E24] border border-transparent rounded-[10px] pl-4 pr-[48px] py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00A5E5] focus:border-[#00A5E5] transition-all text-sm"
                placeholder="Enter password"
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

          <div className="flex items-center justify-between pt-1 pb-2">
            <div className="flex items-center gap-3 cursor-pointer" onClick={toggleRememberMe}>
              <div className={`w-[36px] h-[20px] rounded-full p-0.5 transition-colors duration-200 ease-in-out ${formData.remember_me ? 'bg-white' : 'bg-[#1E1E24] border border-white/10'}`}>
                <div className={`w-[16px] h-[16px] rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${formData.remember_me ? 'translate-x-[16px] bg-[#00A5E5]' : 'translate-x-0 bg-gray-400'}`} />
              </div>
              <span className="text-[13px] text-gray-300 select-none">Remember me</span>
            </div>
            <Link
              href="/forgot-password"
              className="text-[13px] text-[#FF4B4B] hover:text-[#ff6b6b] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[48px] bg-[#00A5E5] text-white rounded-[10px] font-medium text-sm hover:bg-[#00A5E5]/90 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-8">
          <div className="w-full border-t border-white/10"></div>
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
          <p className="text-gray-400 text-[13px]">
            Don't have an account?{" "}
            <Link
              href={nextParam !== "/" ? `/register?next=${encodeURIComponent(nextParam)}` : "/register"}
              className="text-white font-medium hover:underline ml-1"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="text-center text-gray-500 py-10">Loading login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
