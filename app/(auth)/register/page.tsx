"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useRegisterMutation, useGoogleLoginMutation } from "@/redux/feature/authApi";
import { toast } from "sonner";
import { handleError } from "@/lib/handleError";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/feature/authSlice";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const roles = [
  { id: "artist", label: "Artist", icon: "🎤" },
  { id: "agent", label: "Agent", icon: "💼" },
  { id: "talent-buyer", label: "Talent Buyer", icon: "🎯" },
  { id: "venue", label: "Venue", icon: "🏛️" },
  { id: "organizer", label: "Organizer", icon: "📋" },
];

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("artist");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const [googleLogin] = useGoogleLoginMutation();

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      // Send to backend (including selected role if the backend uses it during registration)
      const response = await googleLogin({
        id_token: credentialResponse.credential,
        // role: selectedRole,
      }).unwrap();

      // Save to cookies securely on the client side
      document.cookie = `token=${response.access}; path=/; max-age=31536000; SameSite=Lax`;

      // Save to Redux (and localStorage via slice)
      dispatch(setUser({
        user: response.user,
        access: response.access,
        refresh: response.refresh
      }));

      toast.success("Google signup successful!");
      router.push("/");
    } catch (error: unknown) {
      console.error("Google signup error:", error);
      handleError(error);
    }
  };

  const handleGoogleError = () => {
    console.log("Google signup failed");
    toast.error("Google signup failed. Please try again.");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const payload = {
        ...formData,
        role: selectedRole,
      };

      const res = await register(payload).unwrap();

      if (res.success) {
        toast.success(res.message || "Account created successfully. Please verify your email.");
        router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_API_KEY_CLIENT_ID || ''}>
        <div className="w-full max-w-[500px] mx-auto px-4 py-10">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-white text-2xl font-semibold mb-6 tracking-tight">ArtistBook</h2>
            <h1 className="text-white text-[30px] font-medium mb-4 tracking-tight">Create Account</h1>
            <p className="text-[#A1A1AA] text-base font-medium">Join the GetAvails community</p>
          </div>

          <div className="bg-[#111116] border border-white/5 p-8 md:p-10 rounded-[28px] shadow-2xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="space-y-3">
                <label className="block text-base font-medium text-[#FFFFFF] ml-1">
                  Full Name
                </label>
                <div className="relative flex items-center group">
                  <div className="absolute left-4 text-gray-500 group-focus-within:text-[#7C5CFF] transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full h-[50px] bg-white/[0.04] border border-white/[0.08] rounded-[14px] pl-[48px] pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#7C5CFF] focus:border-[#7C5CFF] transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="block text-base font-medium text-[#FFFFFF] ml-1">
                  Email
                </label>
                <div className="relative flex items-center group">
                  <div className="absolute left-4 text-gray-500 group-focus-within:text-[#7C5CFF] transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full h-[50px] bg-white/[0.04] border border-white/[0.08] rounded-[14px] pl-[48px] pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#7C5CFF] focus:border-[#7C5CFF] transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <label className="block text-base font-medium text-[#FFFFFF] ml-1">
                  Password
                </label>
                <div className="relative flex items-center group">
                  <div className="absolute left-4 text-gray-500 group-focus-within:text-[#7C5CFF] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full h-[50px] bg-white/[0.04] border border-white/[0.08] rounded-[14px] pl-[48px] pr-[48px] py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#7C5CFF] focus:border-[#7C5CFF] transition-all"
                    placeholder="Create a password"
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

              {/* Role Selection */}
              <div className="space-y-4 pt-2">
                <label className="block text-base font-medium text-[#FFFFFF] ml-1">
                  Select Your Role *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {roles.map((role) => {
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className={`flex flex-col items-start gap-2 p-4 rounded-[16px] border transition-all ${selectedRole === role.id
                          ? "bg-[#1A1A22] border-[#7C5CFF] text-white shadow-[0_0_20px_rgba(124,92,255,0.15)]"
                          : "bg-[#1A1A22] border-white/5 text-gray-400 hover:border-white/10"
                          }`}
                      >
                        <span className="text-2xl mb-1">{role.icon}</span>
                        <span className="text-sm font-bold tracking-tight">{role.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 pt-4">


                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#7C5CFF] hover:bg-[#6A4BE5] text-white py-3 rounded-[20px] font-medium text-base shadow-lg shadow-[#7C5CFF]/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
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

            {/* Social Login Button */}
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
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#7C5CFF] font-bold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </div>
  );
}
