"use client";

import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}

function StepIndicator({ number, label, active, completed }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center select-none">
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 border
            ${completed
              ? "bg-[#10B981] border-[#10B981] text-white"
              : active
              ? "bg-[#00A5E5] border-[#00A5E5] text-white shadow-[0_0_15px_rgba(0,165,229,0.35)]"
              : "bg-[#0E0E12] border-white/10 text-gray-500"
            }`}
        >
          {completed ? <Check size={14} strokeWidth={3} /> : number}
        </div>
      </div>
      <span
        className={`text-[11px] font-medium mt-2 transition-colors duration-300
          ${completed ? "text-[#10B981]" : active ? "text-white" : "text-gray-500"}`}
      >
        {label}
      </span>
    </div>
  );
}

interface StepperProps {
  step: number;
  progress: number;
}

export function Stepper({ step, progress }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-8 mb-10 w-full max-w-lg select-none">
      <StepIndicator number={1} label="Which side" active={step === 1} completed={step > 1} />
      <div className={`h-[1px] w-12 md:w-20 transition-colors duration-300 ${step > 1 ? "bg-[#10B981]" : "bg-white/10"}`} />
      <StepIndicator number={2} label="Your Role" active={step === 2} completed={step > 2} />
      <div className={`h-[1px] w-12 md:w-20 transition-colors duration-300 ${step > 2 ? "bg-[#10B981]" : "bg-white/10"}`} />
      <StepIndicator number={3} label="You're in" active={step === 3} completed={step === 3 && progress === 100} />
    </div>
  );
}
