"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { FaFacebookF, FaInstagram } from "react-icons/fa";


const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.25-.97 4.54-2.6 6.09-1.92 1.83-4.7 2.69-7.24 2.25-2.91-.49-5.32-2.73-6-5.59-.65-2.68.04-5.63 1.95-7.53 1.94-1.94 4.88-2.62 7.42-1.96V14.3c-1.3-.39-2.79-.17-3.83.67-1.1.9-1.57 2.44-1.12 3.8.35 1.05 1.25 1.87 2.34 2.11 1.25.27 2.64-.13 3.42-1.09.73-.89.99-2.11.96-3.23.04-5.46.01-10.92.02-16.38z" />
  </svg>
);

export function Footer() {



  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      e.preventDefault();
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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

            {/* Contact Information */}
            <div className="flex flex-col gap-3 mb-8">
              <a href="mailto:Booking@GetAvails.com" className="flex items-center gap-3 text-[#A1A1AA] hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00A5E5]/20 group-hover:text-[#7C5CFF] transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Booking@GetAvails.com</span>
              </a>
              <a href="tel:4255309913" className="flex items-center gap-3 text-[#A1A1AA] hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00A5E5]/20 group-hover:text-[#7C5CFF] transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">(425) 530-9913</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <Link href="https://www.facebook.com/people/GetAvailscom/61585291584796/" target="_blank" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 transition-all shadow-[0_0_15px_rgba(124,92,255,0)] hover:shadow-[0_0_15px_rgba(124,92,255,0.3)] hover:text-[#7C5CFF] hover:border-[#7C5CFF]/30">
                <FaFacebookF className="w-4 h-4" />
              </Link>
              <Link href="https://www.instagram.com/getavails/" target="_blank" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 transition-all shadow-[0_0_15px_rgba(124,92,255,0)] hover:shadow-[0_0_15px_rgba(124,92,255,0.3)] hover:text-[#7C5CFF] hover:border-[#7C5CFF]/30">
                <FaInstagram className="w-4 h-4" />
              </Link>
              <Link href="https://www.tiktok.com/@getavails" target="_blank" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 transition-all shadow-[0_0_15px_rgba(124,92,255,0)] hover:shadow-[0_0_15px_rgba(124,92,255,0.3)] hover:text-[#7C5CFF] hover:border-[#7C5CFF]/30">
                <TikTokIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Links: For Clients */}
          <div className="md:col-span-3 flex flex-col">
            <h4 className="text-white font-semibold mb-6">For Clients</h4>
            <div className="flex flex-col gap-4">
              <Link href="/search" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">Browse Artists</Link>
              <Link href="/how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="text-[#A1A1AA] hover:text-white transition-colors text-sm">How It Works</Link>
              {/* <Link href="#" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">Pricing</Link>
              <Link href="#" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">FAQ</Link> */}
            </div>
          </div>

          {/* Links: Company */}
          <div className="md:col-span-3 flex flex-col">
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <div className="flex flex-col gap-4">
              <Link href="/about" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">About Us</Link>
              <Link href="/careers" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">Careers</Link>
              <Link href="/press" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">Press</Link>
              <Link href="/contact" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">Contact</Link>
              <Link href="/blog" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">Blog</Link>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[#A1A1AA] text-sm text-center md:text-left">
            © {new Date().getFullYear()} www.GetAvails.com. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">Privacy Policy</Link>
            <Link href="/terms" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">Terms of Service</Link>
            <Link href="/cookie-policy" className="text-[#A1A1AA] hover:text-white transition-colors text-sm">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
