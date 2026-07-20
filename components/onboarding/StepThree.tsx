"use client";

import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { useCreateTeamMutation, useGetTeamRolesQuery } from "@/redux/feature/team-managementSlice";
import { toast } from "sonner";

interface StepThreeProps {
  userName: string;
  side: "Artist Side" | "Venue Side" | null;
  role: string;
  teamName: string;
  progress: number;
  onFinish: () => void;
}

interface TeamRole {
  role: string;
  label: string;
  rank?: number;
}

export function StepThree({ userName, side, role, teamName, progress, onFinish }: StepThreeProps) {
  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();
  const { data: rolesData } = useGetTeamRolesQuery(undefined);

  // Look up human-readable label from the query data
  const activeRoles: TeamRole[] = (rolesData?.domains?.[side === "Artist Side" ? "artist" : "venue"] as TeamRole[]) || [];
  const selectedRoleObj = activeRoles.find((r) => r.role === role);
  const displayRoleLabel = selectedRoleObj ? selectedRoleObj.label : role;

  const handleContinue = async () => {
    try {
      const domain = side === "Artist Side" ? "artist" : "venue";

      const payload = {
        domain,
        name: teamName,
        role: role, // Directly pass the raw role string, e.g. "artist", "ceo_gm"
      };

      const result = await createTeam(payload).unwrap();

      if (result.success || result.id || result.data?.id) {
        const teamId = result.id || result.data?.id || "team-" + Date.now();

        toast.success("Team created and onboarding completed successfully!");
        onFinish();
      } else {
        toast.error("Failed to create team. Please try again.");
      }
    } catch (err: any) {
      console.error("Error creating team:", err);
      const errorMessage = err?.data?.error?.message || err?.data?.message || err?.message || "Failed to create team. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6 flex flex-col items-center w-full">
      {/* Header aligned with Step 2 style */}
      <div className="text-center space-y-4 w-full">
        {side && (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#00A5E5]/10 text-[#00A5E5] border border-[#00A5E5]/20 select-none">
            {side}
          </div>
        )}
        <div className="space-y-2">
          <h2 className="text-2xl md:text-[32px] font-bold text-white tracking-tight leading-tight">
            What's your role?
          </h2>
          <p className="text-sm text-gray-400 font-medium">
            Choose the role that best describes what you do.
          </p>
        </div>
      </div>

      {/* Recap Inner Card (600px wide, border-white/12, padding-48px) */}
      <div className="w-full max-w-[600px] bg-white/5 border border-white/12 rounded-[24px] p-6 md:p-[48px] flex flex-col gap-6 text-center shadow-lg">
        {/* Green checkmark indicator */}
        <div className="flex justify-center">
          <div className="w-[64px] h-[64px] rounded-full border-[2px] border-[#10B981] flex items-center justify-center text-[#10B981] bg-transparent">
            <Check size={28} strokeWidth={3} />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            You're all set!
          </h3>
          <p className="text-sm text-gray-400 font-medium">
            Welcome to GetAvails, {userName}
          </p>
        </div>

        {/* Confirmation recap list */}
        <div className="w-full bg-[#0E0E12]/80 border border-white/5 rounded-2xl p-5 text-left space-y-3.5">
          <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
            <span className="text-gray-400 font-medium">Side</span>
            {side && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#00A5E5]/10 text-[#00A5E5] border border-[#00A5E5]/15 select-none">
                {side}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
            <span className="text-gray-400 font-medium">Role</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white select-none">
              {displayRoleLabel}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-gray-400 font-medium">Team</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-normal">Team Name</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 select-none">
                {teamName}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar loader */}
        <div className="w-full space-y-2.5 pt-2">
          <div className="flex justify-between items-center text-xs text-gray-500 select-none font-medium">
            <span>Setting up your dashboard...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00A5E5] transition-all duration-100 ease-out shadow-[0_0_8px_rgba(0,165,229,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Final Dashboard Continue button (Outside of the inner card) */}
      <div className="w-full max-w-[600px] pt-4">
        <button
          disabled={progress < 100 || isCreating}
          onClick={handleContinue}
          className={`w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer
            ${progress === 100 && !isCreating
              ? "bg-[#00A5E5] hover:bg-[#00A5E5]/90 text-white shadow-[0_4px_20px_rgba(0,165,229,0.25)] active:scale-[0.98]"
              : "bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed"
            }`}
        >
          <span>{isCreating ? "Creating Team..." : "Continue"}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
