import React from "react";
import { Briefcase, Heart, Zap, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#0E0E13] text-white pt-32 pb-24 px-4 md:px-8">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto text-center mb-24">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00A5E5]/10 text-[#7C5CFF] mb-6">
          <Briefcase className="w-8 h-8" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Build the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#00E5FF]">Live Events</span>
        </h1>
        <p className="text-[#A1A1AA] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          We're a passionate team working to revolutionize how talent is booked globally. Join us on our mission to democratize the entertainment industry.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="max-w-6xl mx-auto mb-24">
        <h2 className="text-3xl font-bold mb-12 text-center">Why Work With Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#111116] border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-colors">
            <Globe className="w-8 h-8 text-[#7C5CFF] mb-6" />
            <h3 className="text-xl font-semibold mb-3">Work Anywhere</h3>
            <p className="text-[#A1A1AA] text-sm leading-relaxed">
              We are a remote-first company. Work from anywhere in the world, on your own schedule.
            </p>
          </div>
          <div className="bg-[#111116] border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-colors">
            <Heart className="w-8 h-8 text-[#7C5CFF] mb-6" />
            <h3 className="text-xl font-semibold mb-3">Comprehensive Health</h3>
            <p className="text-[#A1A1AA] text-sm leading-relaxed">
              Top-tier medical, dental, and vision coverage for you and your dependents.
            </p>
          </div>
          <div className="bg-[#111116] border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-colors">
            <Zap className="w-8 h-8 text-[#7C5CFF] mb-6" />
            <h3 className="text-xl font-semibold mb-3">Learning Budget</h3>
            <p className="text-[#A1A1AA] text-sm leading-relaxed">
              Generous annual stipend for courses, conferences, books, and professional growth.
            </p>
          </div>
          <div className="bg-[#111116] border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-colors">
            <Briefcase className="w-8 h-8 text-[#7C5CFF] mb-6" />
            <h3 className="text-xl font-semibold mb-3">Unlimited PTO</h3>
            <p className="text-[#A1A1AA] text-sm leading-relaxed">
              Take the time you need to recharge. We value outcomes over hours worked.
            </p>
          </div>
        </div>
      </div>

      {/* Open Roles */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Open Roles</h2>

        <div className="space-y-4">
          <div className="bg-[#111116] border border-white/5 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#7C5CFF]/50 transition-all group cursor-pointer">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#7C5CFF] transition-colors">Senior Full Stack Engineer</h3>
              <p className="text-[#A1A1AA]">Engineering • Remote (US/EU Timezones)</p>
            </div>
            <Link href="#" className="inline-flex items-center gap-2 text-sm font-bold text-[#7C5CFF] bg-[#00A5E5]/10 px-6 py-3 rounded-full hover:bg-[#00A5E5]/20 transition-colors">
              Apply Now <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bg-[#111116] border border-white/5 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#7C5CFF]/50 transition-all group cursor-pointer">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#7C5CFF] transition-colors">Product Designer</h3>
              <p className="text-[#A1A1AA]">Design • Remote (Global)</p>
            </div>
            <Link href="#" className="inline-flex items-center gap-2 text-sm font-bold text-[#7C5CFF] bg-[#00A5E5]/10 px-6 py-3 rounded-full hover:bg-[#00A5E5]/20 transition-colors">
              Apply Now <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bg-[#111116] border border-white/5 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#7C5CFF]/50 transition-all group cursor-pointer">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#7C5CFF] transition-colors">Artist Relations Manager</h3>
              <p className="text-[#A1A1AA]">Operations • Los Angeles / Hybrid</p>
            </div>
            <Link href="#" className="inline-flex items-center gap-2 text-sm font-bold text-[#7C5CFF] bg-[#00A5E5]/10 px-6 py-3 rounded-full hover:bg-[#00A5E5]/20 transition-colors">
              Apply Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center p-8 bg-[#00A5E5]/5 border border-[#7C5CFF]/10 rounded-3xl">
          <h3 className="text-xl font-bold mb-2">Don't see a fit?</h3>
          <p className="text-[#A1A1AA] mb-4">We're always looking for talented people. Send us your resume anyway.</p>
          <a href="mailto:careers@getavails.com" className="text-[#7C5CFF] hover:underline font-medium">careers@getavails.com</a>
        </div>
      </div>
    </div>
  );
}
