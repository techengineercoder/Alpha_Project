"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { useRegisterMutation, useGoogleLoginMutation } from "@/redux/feature/authApi";
import { toast } from "sonner";
import { handleError } from "@/lib/handleError";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/feature/authSlice";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/icon/logo";

const roles = [
  {
    id: "agent",
    label: "Agents",
    icon: <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 3.75C17.7625 3.75 20 5.9875 20 8.75C20 11.5125 17.7625 13.75 15 13.75C12.2375 13.75 10 11.5125 10 8.75C10 5.9875 12.2375 3.75 15 3.75ZM20 16.925C20 18.25 19.65 21.3375 17.2625 24.7875L16.25 18.75L17.425 16.4C16.65 16.3125 15.8375 16.25 15 16.25C14.1625 16.25 13.35 16.3125 12.575 16.4L13.75 18.75L12.7375 24.7875C10.35 21.3375 10 18.25 10 16.925C7.0125 17.8 5 19.375 5 21.25V26.25H25V21.25C25 19.375 23 17.8 20 16.925Z" fill="#A1A1AA" />
    </svg>

    ,
    description: "Manage your roster, negotiate deals, and track performance, all from one central dashboard."
  },
  {
    id: "venue",
    label: "Venues",
    icon: <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.6 16H18.9V18.6667H21.6M21.6 10.6667H18.9V13.3333H21.6M24.3 21.3333H13.5V18.6667H16.2V16H13.5V13.3333H16.2V10.6667H13.5V8H24.3M10.8 5.33333H8.1V2.66667H10.8M10.8 10.6667H8.1V8H10.8M10.8 16H8.1V13.3333H10.8M10.8 21.3333H8.1V18.6667H10.8M5.4 5.33333H2.7V2.66667H5.4M5.4 10.6667H2.7V8H5.4M5.4 16H2.7V13.3333H5.4M5.4 21.3333H2.7V18.6667H5.4M13.5 5.33333V0H0V24H27V5.33333H13.5Z" fill="#A1A1AA" />
    </svg>,
    description: "List your space, manage bookings seamlessly, and attract top-tier performers."
  },
  {
    id: "artist",
    label: "Artists",
    icon: <svg width="21" height="28" viewBox="0 0 21 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.5 0C11.6935 0 12.8381 0.465788 13.682 1.2949C14.5259 2.124 15 3.24852 15 4.42105V13.2632C15 14.4357 14.5259 15.5602 13.682 16.3893C12.8381 17.2184 11.6935 17.6842 10.5 17.6842C9.30653 17.6842 8.16193 17.2184 7.31802 16.3893C6.47411 15.5602 6 14.4357 6 13.2632V4.42105C6 3.24852 6.47411 2.124 7.31802 1.2949C8.16193 0.465788 9.30653 0 10.5 0ZM21 13.2632C21 18.4653 17.085 22.7537 12 23.4758V28H9V23.4758C3.915 22.7537 0 18.4653 0 13.2632H3C3 15.2174 3.79018 17.0916 5.1967 18.4734C6.60322 19.8553 8.51088 20.6316 10.5 20.6316C12.4891 20.6316 14.3968 19.8553 15.8033 18.4734C17.2098 17.0916 18 15.2174 18 13.2632H21Z" fill="#A1A1AA" />
    </svg>
    ,
    description: "Showcase your talent, manage availability, and get booked for gigs easily."
  },
  {
    id: "organizer",
    label: "Organizer",
    icon: <svg width="31" height="24" viewBox="0 0 31 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.472 2.84936L8.1967 9.79067C7.94913 10.0638 7.9599 10.4869 8.22361 10.7494C9.8651 12.3829 12.5292 12.3829 14.1707 10.7494L15.8821 9.04619C16.1082 8.82124 16.3934 8.69806 16.684 8.67663C17.05 8.6445 17.4267 8.76768 17.7066 9.04619L27.2111 18.4245L31 15.4251V0L24.9722 3.42781L23.6913 2.57621C22.8414 2.01366 21.8434 1.71366 20.8227 1.7139H17.0339C16.9747 1.7139 16.9101 1.7139 16.8509 1.71926C15.9413 1.76746 15.0856 2.17451 14.472 2.84936ZM6.27535 8.07141L12.0233 1.7139H9.89201C8.51962 1.7139 7.20642 2.25485 6.23767 3.21892L6.02778 3.42781L0 0V15.4251L8.41736 22.4039C9.65521 23.4323 11.216 23.9946 12.8252 23.9946H13.6701L13.2934 23.6197C12.7875 23.1163 12.7875 22.3022 13.2934 21.8041C13.7993 21.306 14.6174 21.3006 15.1179 21.8041L17.3245 24H17.8089C18.8368 24 19.8432 23.7697 20.7582 23.3412L19.3212 21.9058C18.8153 21.4024 18.8153 20.5883 19.3212 20.0902C19.8271 19.5921 20.6451 19.5867 21.1457 20.0902L22.8679 21.8041L23.8097 20.8668C24.2887 20.3901 24.4286 19.6992 24.2188 19.094L16.797 11.767L15.9951 12.5651C13.3418 15.2055 9.04705 15.2055 6.39375 12.5651C5.1559 11.3332 5.10747 9.35684 6.27535 8.06606V8.07141Z" fill="#A1A1AA" />
    </svg>
    ,
    description: "Plan events, coordinate with multiple artists and venues for smooth execution."
  },
];

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") || "/";
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("agent");
  const [expandedRole, setExpandedRole] = useState<string>("agent");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();

  const [googleLoginMutation] = useGoogleLoginMutation();

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      const response = await googleLoginMutation({
        id_token: credentialResponse.credential,
      }).unwrap();

      document.cookie = `token=${response.access}; path=/; max-age=31536000; SameSite=Lax`;

      dispatch(setUser({
        user: response.user,
        access: response.access,
        refresh: response.refresh
      }));

      toast.success("Google signup successful!");
      router.push("/onboarding");
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
        router.push(`/verify?email=${encodeURIComponent(formData.email)}&next=${encodeURIComponent(nextParam)}`);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const toggleRoleExpand = (roleId: string) => {
    setExpandedRole(expandedRole === roleId ? "" : roleId);
  };

  const proceedToForm = (roleId: string) => {
    setSelectedRole(roleId);
    setStep(2);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_API_KEY_CLIENT_ID || ''}>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10 text-center">
                  <div className="mb-8 flex justify-center">
                    <Logo />
                  </div>
                  <h1 className="text-white text-[28px] font-semibold mb-2 tracking-tight">Which Role Are You Joining As?</h1>
                  <p className="text-gray-400 text-sm font-medium">Define your role and let us customize your dashboard</p>
                </div>

                <div className="space-y-3">
                  {roles.map((role) => {
                    const isExpanded = expandedRole === role.id;
                    return (
                      <div
                        key={role.id}
                        className={`   transition-all cursor-pointer duration-200 overflow-hidden ${isExpanded
                          ? ''
                          : 'bg-transparent border-b border-white/5 hover:border-white/10'
                          }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleRoleExpand(role.id)}
                          className="w-full px-5 py-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{role.icon}</span>
                            <span className={`text-lg font-medium transition-colors ${isExpanded ? 'text-[#00A5E5]' : 'text-gray-300'}`}>
                              {role.label}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp size={20} className="text-[#00A5E5]" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-500" />
                          )}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="px-5 pb-5 pt-0">
                                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                  {role.description}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => proceedToForm(role.id)}
                                  className="py-2.5 px-6 rounded-[10px] bg-[#00A5E5] text-white text-sm font-medium transition-all hover:bg-[#00A5E5]/90 active:scale-95"
                                >
                                  Join as {role.label.replace(/s$/, '')}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 text-center">
                  <p className="text-gray-400 text-[13px]">
                    Already have an account?{" "}
                    <Link
                      href={nextParam !== "/" ? `/login?next=${encodeURIComponent(nextParam)}` : "/login"}
                      className="text-white font-medium hover:underline ml-1"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => setStep(1)}
                  className="mb-8 flex items-center text-[13px] font-medium text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronDown size={16} className="rotate-90 mr-1" />
                  Back to roles
                </button>

                <div className="mb-10">
                  <div className="mb-8">
                    <Logo />
                  </div>
                  <h1 className="text-white text-[28px] font-semibold mb-2 tracking-tight">Create Account</h1>
                  <p className="text-gray-400 text-sm font-medium">
                    Joining as <span className="text-[#00A5E5] font-semibold">{roles.find(r => r.id === selectedRole)?.label}</span>
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="block text-[13px] font-medium text-gray-200">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full h-[48px] bg-[#1E1E24] border border-transparent rounded-[10px] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00A5E5] focus:border-[#00A5E5] transition-all text-sm"
                      placeholder="Enter your name"
                    />
                  </div>

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
                      placeholder="Enter your email"
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

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-[48px] bg-[#00A5E5] text-white rounded-[10px] font-medium text-sm hover:bg-[#00A5E5]/90 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                  </div>
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
                    Already have an account?{" "}
                    <Link
                      href={nextParam !== "/" ? `/login?next=${encodeURIComponent(nextParam)}` : "/login"}
                      className="text-white font-medium hover:underline ml-1"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div className="text-center text-gray-500 py-10">Loading registration...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
