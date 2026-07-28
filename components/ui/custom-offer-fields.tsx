"use client";

import React from "react";

// Custom Input Field Props
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

export const CustomInput: React.FC<InputProps> = ({ label, required = false, className = "", ...props }) => {
  return (
    <div className="flex flex-col space-y-2 w-full font-sans">
      <label 
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 500,
          fontSize: "14px",
          lineHeight: "20px",
          letterSpacing: "0px",
          color: "rgba(255, 255, 255, 0.80)"
        }}
        className="block"
      >
        {label} {required && <span className="text-[#00A5E5]">*</span>}
      </label>
      <input
        style={{
          backgroundColor: "#18181F",
          borderWidth: "1px",
          borderColor: "rgba(255, 255, 255, 0.08)",
          borderRadius: "12px",
          height: "50px"
        }}
        className={`w-full text-sm text-white placeholder-zinc-600 px-4 focus:outline-none focus:border-[#00A5E5]/50 transition-colors ${className}`}
        {...props}
      />
    </div>
  );
};

// Custom Textarea Props
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
}

export const CustomTextarea: React.FC<TextareaProps> = ({ label, required = false, className = "", ...props }) => {
  return (
    <div className="flex flex-col space-y-2 w-full font-sans">
      <label 
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 500,
          fontSize: "14px",
          lineHeight: "20px",
          letterSpacing: "0px",
          color: "rgba(255, 255, 255, 0.80)"
        }}
        className="block"
      >
        {label} {required && <span className="text-[#00A5E5]">*</span>}
      </label>
      <textarea
        style={{
          backgroundColor: "#18181F",
          borderWidth: "1px",
          borderColor: "rgba(255, 255, 255, 0.08)",
          borderRadius: "12px"
        }}
        className={`w-full text-sm text-white placeholder-zinc-650 px-4 py-3 min-h-[90px] resize-y focus:outline-none focus:border-[#00A5E5]/50 transition-colors ${className}`}
        {...props}
      />
    </div>
  );
};

// Custom Checkbox Props
export interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange, label }) => {
  return (
    <div 
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 cursor-pointer select-none font-sans group"
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "6px",
          border: checked ? "1px solid #00A5E5" : "1.5px solid rgba(255, 255, 255, 0.2)",
          backgroundColor: checked ? "#00A5E5" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s ease",
        }}
        className="shrink-0"
      >
        {checked && (
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {label}
    </div>
  );
};
