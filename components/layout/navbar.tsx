"use client";

import { Menu, X, Search, Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useGetUsersQuery } from '@/redux/feature/userSlice';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/feature/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * Marketing Navbar - For Landing Page
 */
export function MarketingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const { data: userProfile } = useGetUsersQuery(undefined);
  const user = userProfile?.user;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 lg:px-12 py-6">
      <nav
        className={`mx-auto max-w-[1200px] w-full flex items-center justify-between transition-all duration-500 ease-in-out bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-full px-8 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)]
          ${isScrolled ? 'scale-[0.98] border-white/10' : 'scale-100'}
        `}
      >
        {/* Logo */}
        <Link href="/" className="text-white font-bold text-xl md:text-[22px] tracking-tight">
          GetAvails
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 lg:gap-14 absolute left-1/2 -translate-x-1/2">
          <Link href="/#browse-artists" onClick={(e) => scrollToSection(e, 'browse-artists')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Browse Artists</Link>
          <Link href="/search" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Browse Venue</Link>
          <Link href="/#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">How it works</Link>
          <Link href="/blog" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Blog</Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-4 pl-1.5 pr-5 py-1.5 rounded-full transition-all border animate-pulse-glow
                  ${isProfileOpen
                    ? 'bg-[#7C5CFF] border-[#7C5CFF] shadow-[0_0_25px_rgba(124,92,255,0.4)]'
                    : 'bg-[#7C5CFF]/80 border-[#7C5CFF]/20 hover:bg-[#7C5CFF] hover:shadow-[0_0_20px_rgba(124,92,255,0.3)]'}
                `}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shadow-md">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-bold text-white leading-tight">{user.name}</span>
                  <span className="text-[11px] text-white/70 font-medium">{user.email}</span>
                </div>
                <ChevronDown size={14} className={`text-white transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-4 w-72 origin-top-right rounded-[28px] bg-[#111116] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden z-50"
                  >
                    <div className="p-6 border-b border-white/5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-[#7C5CFF]/30">
                        {user.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-[#7C5CFF] to-[#9D7CFF] flex items-center justify-center text-white font-bold">{user.name.charAt(0)}</div>}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-base font-bold text-white truncate">{user.name}</span>
                        <span className="text-xs text-gray-400 truncate">{user.email}</span>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <Link href="/artist/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-[20px] text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                        <User size={18} className="text-gray-400" />
                        <span>Dashboard</span>
                      </Link>
                      <Link href="/artist/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-[20px] text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                        <Settings size={18} className="text-gray-400" />
                        <span>Settings</span>
                      </Link>
                      <div className="h-px bg-white/5 my-1.5 mx-2"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[20px] text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all">
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login" className="px-10 py-2.5 rounded-full bg-[#7C5CFF] text-white text-sm font-bold hover:bg-[#6A4BE5] transition-all shadow-[0_0_20px_rgba(124,92,255,0.3)] animate-shine animate-pulse-glow">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 bg-white/5 border border-white/5 rounded-full"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="md:hidden absolute top-[calc(100%-10px)] left-4 right-4 p-8 rounded-[32px] bg-[#111116] border border-white/10 shadow-2xl flex flex-col gap-6 z-50"
          >
            <div className="space-y-4">
              <Link href="/#browse-artists" onClick={(e) => { setIsMobileMenuOpen(false); scrollToSection(e, 'browse-artists'); }} className="block text-lg font-bold text-gray-400 hover:text-white py-2">Browse Artists</Link>
              <Link href="/search" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold text-gray-400 hover:text-white py-2">Browse Venue</Link>
              <Link href="/#how-it-works" onClick={(e) => { setIsMobileMenuOpen(false); scrollToSection(e, 'how-it-works'); }} className="block text-lg font-bold text-gray-400 hover:text-white py-2">How it works</Link>
              <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold text-gray-400 hover:text-white py-2">Blog</Link>
            </div>
            {user ? (
              <Link href="/dashboard" className="px-6 py-4 rounded-2xl bg-[#7C5CFF] text-white text-center font-bold">Dashboard</Link>
            ) : (
              <Link href="/login" className="px-6 py-4 rounded-2xl bg-[#7C5CFF] text-white text-center font-bold">Sign In</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/**
 * Dashboard Navbar - For User Portal
 */
export function DashboardNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const { data: userProfile } = useGetUsersQuery(undefined);
  const user = userProfile?.user;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 lg:px-12 py-6">
      <nav
        className={`mx-auto max-w-[1400px] w-full flex items-center justify-between transition-all duration-500 ease-in-out bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-full px-8 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)]
          ${isScrolled ? 'scale-[0.98] border-white/10' : 'scale-100'}
        `}
      >
        {/* Logo */}
        <Link href="/" className="text-white font-bold text-xl md:text-[22px] tracking-tight">
          ArtistBook
        </Link>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {/* Search Section */}
          <div className="relative flex items-center" ref={searchRef}>
            <AnimatePresence mode="wait">
              {!isSearchOpen ? (
                <motion.button
                  key="search-btn"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors group"
                >
                  <Search size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Search</span>
                </motion.button>
              ) : (
                <motion.div
                  key="search-input"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 240 }}
                  exit={{ opacity: 0, width: 0 }}
                  className="relative flex items-center"
                >
                  <Search size={18} className="absolute left-3 text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search artists, events..."
                    className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-[#7C5CFF]/50 transition-all"
                  />
                  <button onClick={() => setIsSearchOpen(false)} className="absolute right-3 p-0.5 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-all">
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <button className="relative text-gray-400 hover:text-white transition-colors group p-1">
            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7C5CFF] rounded-full border border-[#050505]"></span>
          </button>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-4 pl-1.5 pr-5 py-1.5 rounded-full transition-all border animate-pulse-glow
                  ${isProfileOpen
                    ? 'bg-[#7C5CFF] border-[#7C5CFF] shadow-[0_0_25px_rgba(124,92,255,0.4)]'
                    : 'bg-[#7C5CFF]/80 border-[#7C5CFF]/20 hover:bg-[#7C5CFF] hover:shadow-[0_0_20px_rgba(124,92,255,0.3)]'}
                `}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shadow-md">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-bold text-white leading-tight">{user.name}</span>
                  <span className="text-[11px] text-white/70 font-medium">{user.email}</span>
                </div>
                <ChevronDown size={14} className={`text-white transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-4 w-72 origin-top-right rounded-[28px] bg-[#111116] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden z-50"
                  >
                    <div className="p-6 border-b border-white/5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-[#7C5CFF]/30">
                        {user.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-[#7C5CFF] to-[#9D7CFF] flex items-center justify-center text-white font-bold">{user.name.charAt(0)}</div>}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-base font-bold text-white truncate">{user.name}</span>
                        <span className="text-xs text-gray-400 truncate">{user.email}</span>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <Link href="/artist/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-[20px] text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                        <User size={18} className="text-gray-400" />
                        <span>Dashboard</span>
                      </Link>
                      <Link href="/artist/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-[20px] text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                        <Settings size={18} className="text-gray-400" />
                        <span>Settings</span>
                      </Link>
                      <div className="h-px bg-white/5 my-1.5 mx-2"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[20px] text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all">
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login" className="px-8 py-2.5 rounded-full bg-[#7C5CFF] text-white text-sm font-bold hover:bg-[#6A4BE5] transition-all animate-shine animate-pulse-glow">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white p-2 bg-white/5 border border-white/5 rounded-full" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="md:hidden absolute top-[calc(100%-10px)] left-4 right-4 p-8 rounded-[32px] bg-[#111116] border border-white/10 shadow-2xl flex flex-col gap-6 z-50"
          >
            {user && (
              <div className="flex items-center gap-4 p-5 bg-white/5 rounded-[24px] border border-white/5">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#7C5CFF]/30">
                  {user.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-[#7C5CFF] to-[#9D7CFF] flex items-center justify-center text-white font-bold">{user.name.charAt(0)}</div>}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-base font-bold text-white truncate">{user.name}</span>
                  <span className="text-xs text-gray-400 truncate">{user.email}</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/5 text-gray-300">
                <Search size={20} /><span className="text-sm font-bold">Search</span>
              </button>
              <button className="relative p-4 rounded-2xl bg-white/5 border border-white/5 text-gray-300">
                <Bell size={20} /><span className="absolute top-4 right-4 w-2 h-2 bg-[#7C5CFF] rounded-full border border-[#111116]"></span>
              </button>
            </div>
            <div className="space-y-2">
              <Link href="/artist/dashboard" className="block text-lg font-bold text-gray-400 hover:text-white py-2">Dashboard</Link>
              <Link href="/artist/bookings" className="block text-lg font-bold text-gray-400 hover:text-white py-2">Bookings</Link>
              <Link href="/artist/availability" className="block text-lg font-bold text-gray-400 hover:text-white py-2">Availability</Link>
            </div>
            {user ? (
              <button onClick={handleLogout} className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-red-400/5 border border-red-400/20 text-red-400 font-bold mt-4">
                <LogOut size={20} /><span>Sign Out</span>
              </button>
            ) : (
              <Link href="/login" className="px-6 py-4 rounded-2xl bg-[#7C5CFF] text-white text-center font-bold mt-4">Sign In</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// Backward compatibility or default export if needed
export const Navbar = MarketingNavbar;
