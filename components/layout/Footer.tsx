import React from 'react';
import Link from 'next/link';
// import { Facebook, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-[#0E0E13] pt-16 pb-8 px-4 md:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* Brand & Description */}
          <div className="md:col-span-6 flex flex-col">
            <h3 className="text-white text-2xl font-bold mb-4">GetAvails</h3>
            <p className="text-[#A1A1AA] text-sm md:text-base leading-relaxed max-w-sm mb-8">
              The premium marketplace connecting world-class artists with unforgettable events.
            </p>

            {/* Social Icons */}
            {/* <div className="flex items-center gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-105 transition-all">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-105 transition-all">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-105 transition-all">
                <Instagram className="w-5 h-5" />
              </Link>
            </div> */}
          </div>

          {/* Links: For Clients */}
          <div className="md:col-span-3 flex flex-col">
            <h4 className="text-white font-semibold mb-6">For Clients</h4>
            <div className="flex flex-col gap-4">
              <Link href="#" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">Browse Artists</Link>
              <Link href="#" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">How It Works</Link>
              <Link href="#" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">Pricing</Link>
              <Link href="#" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">FAQ</Link>
            </div>
          </div>

          {/* Links: Company */}
          <div className="md:col-span-3 flex flex-col">
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <div className="flex flex-col gap-4">
              <Link href="#" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">About Us</Link>
              <Link href="#" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">Careers</Link>
              <Link href="#" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">Press</Link>
              <Link href="#" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">Contact</Link>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[#A1A1AA] text-sm text-center md:text-left">
            © 2026 ArtistBook. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">Privacy Policy</Link>
            <Link href="#" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">Terms of Service</Link>
            <Link href="#" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
