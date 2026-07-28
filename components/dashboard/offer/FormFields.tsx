import React from "react";
import { ChevronDown } from "lucide-react";

// InputField Component
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, className = "", ...props }) => {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase font-sans">
        {label}
      </label>
      <input
        className={`w-full text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 transition-colors font-sans ${className}`}
        style={{
          height: "51.89px",
          borderRadius: "12.36px",
          borderWidth: "1.24px",
          borderColor: "rgba(255, 255, 255, 0.12)",
          backgroundColor: "rgba(255, 255, 255, 0.07)",
          paddingTop: "12.36px",
          paddingBottom: "12.36px",
          paddingLeft: "14.83px",
          paddingRight: "14.83px"
        }}
        {...props}
      />
    </div>
  );
};

// TextAreaField Component
interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, className = "", ...props }) => {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase font-sans">
        {label}
      </label>
      <textarea
        className={`w-full text-sm text-white placeholder-zinc-650 focus:outline-none focus:border-white/20 transition-colors min-h-[100px] resize-y font-sans ${className}`}
        style={{
          borderRadius: "12.36px",
          borderWidth: "1.24px",
          borderColor: "rgba(255, 255, 255, 0.12)",
          backgroundColor: "rgba(255, 255, 255, 0.07)",
          paddingTop: "12.36px",
          paddingBottom: "12.36px",
          paddingLeft: "14.83px",
          paddingRight: "14.83px"
        }}
        {...props}
      />
    </div>
  );
};

// SelectField Component
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, options, className = "", ...props }) => {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase font-sans">
        {label}
      </label>
      <div className="relative w-full">
        <select
          className={`w-full text-sm text-white focus:outline-none focus:border-white/20 transition-colors appearance-none cursor-pointer font-sans ${className}`}
          style={{
            height: "51.89px",
            borderRadius: "12.36px",
            borderWidth: "1.24px",
            borderColor: "rgba(255, 255, 255, 0.12)",
            backgroundColor: "rgba(255, 255, 255, 0.07)",
            paddingTop: "12.36px",
            paddingBottom: "12.36px",
            paddingLeft: "14.83px",
            paddingRight: "38px"
          }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#121214] text-white font-sans">
              {opt.label}
            </option>
          ))}
        </select>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
          <ChevronDown className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
};
