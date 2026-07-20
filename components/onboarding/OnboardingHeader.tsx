"use client";

import React from "react";

interface OnboardingHeaderProps {
  userName: string;
  userImage?: string | null;
}

const getImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "https://backend.getavails.com";
  return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export function OnboardingHeader({ userName, userImage }: OnboardingHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const avatarSrc = getImageUrl(userImage);

  return (
    <header className="fixed top-0 left-0 right-0 w-full h-[72px] flex items-center justify-between px-6 py-4 md:px-12 border-b border-white/5 bg-[#070709] z-50 select-none">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#00A5E5] flex items-center justify-center text-white font-bold text-base shadow-[0_0_12px_rgba(0,165,229,0.3)]">
          G
        </div>
        <span className="font-bold text-base tracking-tight text-white">GetAvails</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#7C5CFF] to-[#9D7CFF] flex items-center justify-center text-white font-bold text-xs border border-white/10 shrink-0">
          {avatarSrc ? (
            <img src={avatarSrc} alt={userName} className="w-full h-full object-cover" />
          ) : (
            getInitials(userName)
          )}
        </div>
      </div>
    </header>
  );
}
