"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger scrolled state after 50px of scrolling
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 md:px-8 lg:px-12
        ${isScrolled ? 'py-3' : 'py-6'}
      `}
    >
      <nav
        className={`mx-auto max-w-6xl w-full flex items-center justify-between transition-all duration-500 ease-in-out
          ${isScrolled
            ? 'bg-[#1D1A31]/95 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-full px-6 py-3 border border-white/10'
            : 'bg-[#2A244A]/80 backdrop-blur-md shadow-2xl rounded-full px-8 py-4 border border-white/10'}
        `}
      >
        {/* Logo */}
        <Link href="/" className="text-white font-bold text-xl md:text-2xl tracking-tight">
          GetAvails
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12 absolute left-1/2 -translate-x-1/2">
          <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Browse Artists</Link>
          <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Browse Venue</Link>
          <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">How it works</Link>
        </div>

        {/* Sign In Button (Desktop) */}
        <div className="hidden md:block">
          <Link href="/signin" className="border-white/10 bg-gradient-to-r from-[#7C5CFF] to-[#9D7CFF]  text-white px-8 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-[#7C5CFF]/20">
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden absolute top-full left-4 right-4 mt-2 p-5 rounded-3xl bg-[#1D1A31] border border-white/10 shadow-2xl flex flex-col gap-4 transition-all duration-300 transform origin-top
          ${isMobileMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
        `}
      >
        <Link href="#" className="text-base text-gray-300 hover:text-white transition-colors py-2 border-b border-white/5">Browse Artists</Link>
        <Link href="#" className="text-base text-gray-300 hover:text-white transition-colors py-2 border-b border-white/5">Browse Venue</Link>
        <Link href="#" className="text-base text-gray-300 hover:text-white transition-colors py-2 border-b border-white/5">How it works</Link>
        <Link href="/signin" className="border-white/10 bg-gradient-to-r from-[#7C5CFF] to-[#9D7CFF] hover:bg-[#6A4BE5] text-white text-center px-6 py-3.5 rounded-full text-sm font-medium mt-4 shadow-lg shadow-[#7C5CFF]/20">
          Sign In
        </Link>
      </div>
    </header>
  );
}
