"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

// Import small sub-components
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { Stepper } from "@/components/onboarding/Stepper";
import { StepOne } from "@/components/onboarding/StepOne";
import { StepTwo } from "@/components/onboarding/StepTwo";
import { StepThree } from "@/components/onboarding/StepThree";
import { useGetUsersQuery } from "@/redux/feature/userSlice";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [side, setSide] = useState<"Artist Side" | "Venue Side" | null>(null);
  const [role, setRole] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");
  const [userName, setUserName] = useState<string>("Jamie");
  const [userEmail, setUserEmail] = useState<string>("jamie@getavails.com");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const { data: userData } = useGetUsersQuery(undefined);
  console.log("User data from API:", userData);

  // Helper for formatting image URLs
  const formatImageUrl = (imagePath?: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "https://backend.getavails.com";
    return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  // Sync API user details to state & localStorage
  useEffect(() => {
    const userObj = userData?.user || userData?.data || userData;
    if (userObj && typeof userObj === "object") {
      if (userObj.name) setUserName(userObj.name);
      if (userObj.email) setUserEmail(userObj.email);
      
      const fullImgUrl = userObj.image !== undefined ? formatImageUrl(userObj.image) : userImage;
      if (userObj.image !== undefined) {
        setUserImage(fullImgUrl);
      }

      if (typeof window !== "undefined") {
        const updatedUser = {
          ...userObj,
          image: fullImgUrl,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }
  }, [userData]);

  // Fetch logged in user's details on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.name) setUserName(parsed.name);
          if (parsed.email) setUserEmail(parsed.email);
          if (parsed.image) setUserImage(parsed.image);
        } catch (e) {
          console.error("Error parsing user from localStorage:", e);
        }
      }
    }
  }, []);

  // Simulate loader progress in step 3
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 3) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 4;
        });
      }, 80);
    }
    return () => clearInterval(timer);
  }, [step]);

  // General Skip Onboarding helper
  const handleSkip = () => {
    localStorage.setItem("onboarding_completed", "true");
    toast.info("Onboarding skipped. You can browse the platform, but dashboard access requires setting up a team.");
    router.push("/");
  };

  // Complete onboarding helper
  const completeOnboarding = (
    finalSide: "Artist Side" | "Venue Side",
    finalRole: string,
    finalTeamName: string,
    isSkipped: boolean
  ) => {
    try {
      const teamId = "team-" + Date.now();
      const newTeam = {
        id: teamId,
        name: finalTeamName,
        type: "Team" as const,
        avatarBg: finalSide === "Artist Side" ? "bg-sky-500" : "bg-[#F59E0B]",
        avatarChar: finalTeamName.charAt(0).toUpperCase(),
      };



      if (isSkipped) {
        toast.info("Skipped onboarding. Default team created!");
      } else {
        toast.success("Welcome aboard! Dashboard set up successfully.");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error setting up onboarding details:", error);
      toast.error("Failed to complete onboarding. Please try again.");
    }
  };

  const handleContinueToStep3 = () => {
    if (!role || !teamName.trim()) return;
    setStep(3);
  };

  const handleFinishOnboarding = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans overflow-x-hidden antialiased pt-[72px]">
      {/* Top Header */}
      <OnboardingHeader userName={userName} userImage={userImage} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 md:py-6">

        {/* Stepper Progress */}
        <Stepper step={step} progress={progress} />

        {/* Central Card */}
        <div className="w-full max-w-[741.31px] bg-white/5 border-[1.24px] border-white/12 rounded-[29.65px] p-6 md:p-10 shadow-2xl relative">

          {/* Card Top Actions (Back & Skip) */}
          <div className="flex items-center justify-between mb-8">
            {step > 1 ? (
              <button
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 && (
              <button
                onClick={handleSkip}
                className="text-xs text-[#00A5E5] hover:text-[#00A5E5]/80 hover:underline transition-colors font-medium cursor-pointer"
              >
                Skip onboarding
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <StepOne
                  side={side}
                  setSide={(newSide) => {
                    setSide(newSide);
                    if (newSide !== side) {
                      setRole("");
                    }
                  }}
                  onContinue={() => setStep(2)}
                />
              </motion.div>
            )}

            {step === 2 && side && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <StepTwo
                  side={side}
                  role={role}
                  setRole={setRole}
                  teamName={teamName}
                  setTeamName={setTeamName}
                  onContinue={handleContinueToStep3}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StepThree
                  userName={userName}
                  side={side}
                  role={role}
                  teamName={teamName}
                  progress={progress}
                  onFinish={handleFinishOnboarding}
                />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
