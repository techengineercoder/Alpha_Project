import React from "react";
import { Newspaper, Download, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PressPage() {
  return (
    <div className="min-h-screen bg-[#0E0E13] text-white pt-32 pb-24 px-4 md:px-8">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center mb-24">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00A5E5]/10 text-[#7C5CFF] mb-6">
          <Newspaper className="w-8 h-8" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Press & Media
        </h1>
        <p className="text-[#A1A1AA] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          The latest news, announcements, and media resources from GetAvails. For media inquiries, please reach out to our press team.
        </p>
        <div className="mt-8">
          <a href="mailto:press@getavails.com" className="inline-flex items-center gap-2 px-8 py-4 bg-[#00A5E5] text-white font-bold rounded-full  transition-colors shadow-[0_0_20px_rgba(124,92,255,0.3)]">
            <Mail size={18} />
            Contact Press Team
          </a>
        </div>
      </div>

      {/* Brand Assets */}
      <div className="max-w-5xl mx-auto mb-24">
        <h2 className="text-3xl font-bold mb-8">Brand Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111116] border border-white/5 p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Logos & Guidelines</h3>
              <p className="text-[#A1A1AA] mb-6">
                Download official GetAvails logos, wordmarks, and our brand guideline document for proper usage.
              </p>
            </div>
            <button className="self-start inline-flex items-center gap-2 text-sm font-bold text-white bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition-colors">
              <Download size={16} /> Download Brand Kit (ZIP)
            </button>
          </div>
          <div className="bg-[#111116] border border-white/5 p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Media Library</h3>
              <p className="text-[#A1A1AA] mb-6">
                High-resolution product screenshots, lifestyle images, and photos of our leadership team.
              </p>
            </div>
            <button className="self-start inline-flex items-center gap-2 text-sm font-bold text-white bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition-colors">
              <Download size={16} /> Download Images (ZIP)
            </button>
          </div>
        </div>
      </div>

      {/* Recent Press Releases */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="group bg-[#111116] border border-white/5 p-8 rounded-3xl hover:border-[#7C5CFF]/30 transition-colors cursor-pointer flex flex-col h-full">
            <span className="text-[#7C5CFF] text-sm font-bold mb-4 tracking-wider uppercase">Press Release</span>
            <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">GetAvails Announces $15M Series A Funding</h3>
            <p className="text-[#A1A1AA] mb-8 flex-grow">
              The new capital will be used to expand our artist roster globally and introduce new enterprise features for large-scale festival organizers.
            </p>
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
              <span className="text-[#A1A1AA] text-sm">March 12, 2026</span>
              <span className="text-[#7C5CFF] group-hover:translate-x-1 transition-transform">
                <ArrowRight size={20} />
              </span>
            </div>
          </div>

          <div className="group bg-[#111116] border border-white/5 p-8 rounded-3xl hover:border-[#7C5CFF]/30 transition-colors cursor-pointer flex flex-col h-full">
            <span className="text-[#7C5CFF] text-sm font-bold mb-4 tracking-wider uppercase">Company News</span>
            <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">New 'Instant Book' Feature Revolutionizes Talent Acquisition</h3>
            <p className="text-[#A1A1AA] mb-8 flex-grow">
              GetAvails introduces a seamless, one-click booking experience for verified artists and pre-approved enterprise clients.
            </p>
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
              <span className="text-[#A1A1AA] text-sm">January 28, 2026</span>
              <span className="text-[#7C5CFF] group-hover:translate-x-1 transition-transform">
                <ArrowRight size={20} />
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
