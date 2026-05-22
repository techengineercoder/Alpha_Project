"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useRegisterMutation } from "@/redux/feature/authApi";
import { toast } from "sonner";
import { handleError } from "@/lib/handleError";

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
            {/* Social Login Button */}
            <button
              type="button"
              className="w-full bg-[#1A1A22] border border-white/5 hover:bg-white/5 text-white py-3.5 rounded-[14px] font-medium text-base flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7C5CFF] hover:bg-[#6A4BE5] text-white py-3 rounded-[20px] font-medium text-base shadow-lg shadow-[#7C5CFF]/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>

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
  );
}
