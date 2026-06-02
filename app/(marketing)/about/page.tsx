import React from "react";
import { Music, Globe, Star } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#0E0E13] text-white pt-32 pb-24 px-4 md:px-8">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Connecting the World Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#00E5FF]">Live Music</span>
        </h1>
        <p className="text-[#A1A1AA] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          GetAvails is the premier marketplace bridging the gap between world-class artists and exceptional events. We're on a mission to democratize talent booking globally.
        </p>
      </div>

      {/* Grid Features */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <div className="bg-[#111116] border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-colors">
          <div className="w-12 h-12 rounded-full bg-[#7C5CFF]/10 flex items-center justify-center mb-6">
            <Globe className="w-6 h-6 text-[#7C5CFF]" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">Global Reach</h3>
          <p className="text-[#A1A1AA] leading-relaxed">
            Access thousands of artists and venues worldwide. We remove geographical barriers to bring the best talent to your stage, wherever it may be.
          </p>
        </div>
        
        <div className="bg-[#111116] border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-colors">
          <div className="w-12 h-12 rounded-full bg-[#7C5CFF]/10 flex items-center justify-center mb-6">
            <ShieldIcon className="w-6 h-6 text-[#7C5CFF]" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">Secure Bookings</h3>
          <p className="text-[#A1A1AA] leading-relaxed">
            Our platform ensures secure payments, verified contracts, and peace of mind for both artists and organizers. Trust is our foundation.
          </p>
        </div>

        <div className="bg-[#111116] border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-colors">
          <div className="w-12 h-12 rounded-full bg-[#7C5CFF]/10 flex items-center justify-center mb-6">
            <Star className="w-6 h-6 text-[#7C5CFF]" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">Premium Quality</h3>
          <p className="text-[#A1A1AA] leading-relaxed">
            Every artist on our platform is vetted for quality and professionalism. We guarantee an unforgettable experience for your audience.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-6xl mx-auto bg-[#111116] border border-white/5 rounded-3xl overflow-hidden mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-10 md:p-16 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-[#A1A1AA] leading-relaxed">
              <p>
                Founded in 2024, GetAvails was born out of a simple frustration: booking great talent was too complicated, opaque, and outdated.
              </p>
              <p>
                Our founders, veterans of both the tech and music industries, envisioned a platform where booking a Grammy-winning artist could be as seamless as booking a flight. 
              </p>
              <p>
                Today, GetAvails powers thousands of events annually, from intimate corporate gatherings to massive international festivals, fundamentally changing how the live entertainment industry operates.
              </p>
            </div>
          </div>
          <div className="relative min-h-[400px] lg:min-h-full bg-[#1A1A22]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7C5CFF]/20 to-transparent mix-blend-overlay z-10" />
            <div className="absolute inset-0 flex items-center justify-center text-white/5">
              <Music className="w-64 h-64" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-4xl font-bold text-white mb-2">10k+</div>
          <div className="text-[#A1A1AA] text-sm">Artists Worldwide</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-white mb-2">50k+</div>
          <div className="text-[#A1A1AA] text-sm">Events Powered</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-white mb-2">$100M+</div>
          <div className="text-[#A1A1AA] text-sm">Artist Payouts</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-white mb-2">99%</div>
          <div className="text-[#A1A1AA] text-sm">Satisfaction Rate</div>
        </div>
      </div>
    </div>
  );
}

// Temporary inline icon for the missing Shield import
function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
