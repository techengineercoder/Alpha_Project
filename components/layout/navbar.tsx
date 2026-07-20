"use client";

import { Menu, X, Search, Bell, User, Settings, LogOut, ChevronDown, LayoutDashboard, Heart, History } from 'lucide-react';
import { useGetUsersQuery } from '@/redux/feature/userSlice';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/feature/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import baseApi from '@/redux/api/baseApi';
import { Logo } from '../icon/logo';
import { useGetArtistsQuery } from '@/redux/feature/artistApi/artistSlice';
import { useFavoritesByAllQuery } from '@/redux/feature/artistApi/bookingSlice';

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || 'https://backend.getavails.com';
  return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

const NAV_LINKS = [
  { label: 'Browse Artists', href: '/search?type=artists' },
  { label: 'Browse Venue', href: '/search?type=venue' },
  { label: 'Features', href: '/feature' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
];

function MarketingNavbarContent() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: userProfile } = useGetUsersQuery(undefined);
  const user = userProfile?.user;
  const { data: favoritesRes } = useFavoritesByAllQuery(undefined, { skip: !user });
  const favorites = favoritesRes?.results || [];

  /* ── scroll + outside click ── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousedown', onClickOutside);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  /* ── close mobile menu on resize to desktop ── */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    setIsProfileOpen(false);
    window.location.href = '/';
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId?: string) => {
    if (!sectionId) return;
    if (window.location.pathname === '/') {
      e.preventDefault();
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 lg:px-10 py-4">

      {/* ── Pill Nav ── */}
      <nav
        className={`
          relative mx-auto max-w-[1100px] flex items-center justify-between
          bg-white/[0.06] backdrop-blur-2xl
          border border-white/[0.1] rounded-full
          px-3 py-1.5
          shadow-[0_8px_32px_rgba(0,0,0,0.4)]
          transition-all duration-500
          ${isScrolled ? 'bg-black/40 border-white/[0.16] shadow-[0_12px_40px_rgba(0,0,0,0.6)]' : ''}
        `}
      >

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 pl-2">
          <Logo />
        </Link>

        {/* Desktop centre links — absolutely centered so logo/actions never shift them */}
        <div className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map(({ label, href }) => {
            let isActive = false;
            if (href.startsWith('/search?type=')) {
              const linkType = href.split('type=')[1];
              const activeType = searchParams.get('type') || 'artists';
              isActive = pathname === '/search' && linkType === activeType;
            } else {
              isActive = pathname === href || pathname === href.split('#')[0];
            }

            return (
              <Link
                key={href}
                href={href}
                onClick={(e) => scrollToSection(e)}
                className={`text-[13px] font-normal px-3.5 py-2 rounded-full transition-colors duration-200 whitespace-nowrap
                  ${isActive
                    ? 'text-white bg-white/[0.08]'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                  }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {user ? (
            <div className="flex items-center gap-2">

              <div className="relative" ref={dropdownRef}>

                {/* Avatar pill button */}
                <button
                  onClick={() => setIsProfileOpen((p) => !p)}
                  className={`
                  flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full
                  border transition-all duration-200
                  ${isProfileOpen
                      ? 'bg-[#00A5E5]/20 border-[#7C5CFF]/40'
                      : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15]'}
                `}
                >
                  {/* Avatar */}
                  <span className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 block">
                    {user.image ? (
                      <img src={getImageUrl(user.image)} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="w-full h-full bg-gradient-to-br from-[#7C5CFF] to-[#9D7CFF] flex items-center justify-center text-white font-medium text-[11px]">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </span>

                  {/* Name + email */}
                  <span className="flex flex-col items-start text-left min-w-0">
                    <span className="text-[13px] font-medium text-white leading-tight truncate max-w-[120px]">
                      {user.name}
                    </span>
                    <span className="text-[11px] text-white/40 leading-tight truncate max-w-[120px]">
                      {user.email}
                    </span>
                  </span>

                  <ChevronDown
                    size={13}
                    className={`text-white/40 flex-shrink-0 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute right-0 mt-3 w-64 origin-top-right
                               rounded-[20px] bg-[#111116]
                               border border-white/[0.08]
                               shadow-[0_20px_48px_rgba(0,0,0,0.55)]
                               overflow-hidden z-50"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 p-5 border-b border-white/[0.06]">
                        <span className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 block">
                          {user.image ? (
                            <img src={getImageUrl(user.image)} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="w-full h-full bg-gradient-to-br from-[#7C5CFF] to-[#9D7CFF] flex items-center justify-center text-white font-medium text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </span>
                        <span className="flex flex-col min-w-0">
                          <span className="text-[14px] font-medium text-white truncate">{user.name}</span>
                          <span className="text-[12px] text-white/40 truncate">{user.email}</span>
                        </span>
                      </div>

                      {/* Menu items */}
                      <div className="p-2">
                        {/* <Link
                        href="/artist/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-[14px]
                                   text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05]
                                   transition-all duration-150"
                      >
                        <LayoutDashboard size={16} className="text-white/40" />
                        Dashboard
                      </Link>
                      <Link
                        href="/artist/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-[14px]
                                   text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05]
                                   transition-all duration-150"
                      >
                        <Settings size={16} className="text-white/40" />
                        Settings
                      </Link> */}

                        <Link
                          href="/search-history"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-[14px]
                                   text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05]
                                   transition-all duration-150"
                        >
                          <History size={16} className="text-white/40" />
                          Search History
                        </Link>

                        <div className="h-px bg-white/[0.05] mx-2 my-1.5" />

                        <Link
                          href="/favorites"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-[14px]
                                   text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05]
                                   transition-all duration-150"
                        >
                          <Heart size={16} className="text-white/40" />
                          Favorites
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-[14px]
                                   text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05]
                                   transition-all duration-150"
                        >
                          <LayoutDashboard size={16} className="text-white/40" />
                          Dashboard
                        </Link>

                        <div className="h-px bg-white/[0.05] mx-2 my-1.5" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px]
                                   text-[13px] text-red-400/80 hover:text-red-400 hover:bg-red-400/[0.06]
                                   transition-all duration-150"
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          ) : (
            <div className="flex items-center gap-2">

              <Link
                href="/login"
                className="px-5 py-2 rounded-full text-[13px] font-medium text-white
                           bg-[#00A5E5] hover:bg-[#00A5E5]/80 transition-colors duration-200
                           shadow-[0_0_20px_rgba(124,92,255,0.25)]"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-full
                     bg-white/[0.05] border border-white/[0.08] text-white/70
                     hover:bg-white/[0.09] hover:text-white transition-all"
          onClick={() => setIsMobileMenuOpen((p) => !p)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden mt-2 mx-auto max-w-[1100px]
                       bg-[#111116] border border-white/[0.08]
                       rounded-[28px] shadow-[0_20px_48px_rgba(0,0,0,0.5)]
                       overflow-hidden z-40"
          >
            {/* Links */}
            <div className="flex flex-col p-3 gap-0.5">
              {NAV_LINKS.map(({ label, href }) => {
                let isActive = false;
                if (href.startsWith('/search?type=')) {
                  const linkType = href.split('type=')[1];
                  const activeType = searchParams.get('type') || 'artists';
                  isActive = pathname === '/search' && linkType === activeType;
                } else {
                  isActive = pathname === href || pathname === href.split('#')[0];
                }

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={(e) => { setIsMobileMenuOpen(false); scrollToSection(e); }}
                    className={`text-[15px] font-normal px-4 py-3.5 rounded-[14px] transition-all duration-150
                      ${isActive
                        ? 'text-white bg-white/[0.08]'
                        : 'text-white/55 hover:text-white hover:bg-white/[0.05]'
                      }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.06] mx-4" />

            {/* Actions */}
            <div className="p-4 flex flex-col gap-2.5">
              {user ? (
                <>
                  {/* User info row */}
                  <div className="flex items-center gap-3 px-4 py-3
                                  bg-white/[0.03] border border-white/[0.06] rounded-[16px]">
                    <span className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 block">
                      {user.image ? (
                        <img src={getImageUrl(user.image)} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full bg-gradient-to-br from-[#7C5CFF] to-[#9D7CFF] flex items-center justify-center text-white font-medium text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </span>
                    <span className="flex flex-col min-w-0">
                      <span className="text-[14px] font-medium text-white truncate">{user.name}</span>
                      <span className="text-[12px] text-white/40 truncate">{user.email}</span>
                    </span>
                  </div>

                  {/* <Link
                    href="/artist/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-3.5 rounded-[16px] text-[14px] font-medium
                               bg-[#00A5E5] text-white  transition-colors"
                  >
                    Dashboard
                  </Link> */}
                  <Link
                    href="/search-history"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-[14px]
                                   text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05]
                                   transition-all duration-150"
                  >
                    <History size={16} className="text-white/40" />
                    Search History
                  </Link>
                  <Link
                    href="/favorites"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-[14px]
                                   text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05]
                                   transition-all duration-150"
                  >
                    <Heart size={16} className="text-white/40" />
                    Favorites
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-[14px]
                                   text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05]
                                   transition-all duration-150"
                  >
                    <LayoutDashboard size={16} className="text-white/40" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                    className="w-full text-center py-3.5 rounded-[16px] text-[14px] font-medium
                               bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex gap-2.5">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-3.5 rounded-[16px] text-[14px] font-medium
                               bg-[#00A5E5] text-white hover:bg-[#00A5E5]/80 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function MarketingNavbar() {
  return (
    <Suspense fallback={<div className="h-20" />}>
      <MarketingNavbarContent />
    </Suspense>
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
  const [queryParams, setQueryParams] = useState({
    q: "",
    type: "events"
  });

  const { data: artistsData, isLoading: isLoadingArtists, isFetching: isFetchingArtists } = useGetArtistsQuery(queryParams as any);

  const { data } = useGetUsersQuery(undefined)
  const { data: userProfile } = useGetUsersQuery(undefined);
  const user = userProfile?.user;
  const { data: favoritesRes } = useFavoritesByAllQuery(undefined, { skip: !user });
  const favorites = favoritesRes?.results || [];

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
    dispatch(baseApi.util.resetApiState());
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
          {/* ArtistBook */}
          <Logo />
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
                  animate={{ opacity: 1, width: 350 }}
                  exit={{ opacity: 0, width: 0 }}
                  className="relative flex items-center"
                >
                  <Search size={18} className="absolute left-3 text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    value={queryParams.q}
                    onChange={(e) => setQueryParams({ ...queryParams, q: e.target.value })}
                    placeholder="Search artists, events..."
                    className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-[#7C5CFF]/50 transition-all"
                  />
                  <button onClick={() => setIsSearchOpen(false)} className="absolute right-3 p-0.5 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-all">
                    <X size={14} />
                  </button>
                  <AnimatePresence>
                    {queryParams.q && artistsData?.results?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-[120%] left-0 right-0 bg-[#111116] border border-white/10 rounded-2xl shadow-2xl overflow-y-auto overflow-x-hidden max-h-[300px] z-[60]"
                      >
                        {artistsData.results.map((artist: any) => (
                          <Link
                            key={artist.id}
                            href={`/search/${artist.id}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                          >
                            {artist.avatar || artist.image ? (
                              <img src={getImageUrl(artist.avatar || artist.image)} alt={artist.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">{artist.name?.charAt(0)}</div>
                            )}
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-white truncate">{artist.name}</p>
                              <p className="text-xs text-gray-400 truncate">{artist.genre || 'Artist'}</p>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <button className="relative text-gray-400 hover:text-white transition-colors group p-1">
            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00A5E5] rounded-full border border-[#050505]"></span>
          </button>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-4 pl-1.5 pr-5 py-1.5 rounded-full transition-all border animate-pulse-glow
                  ${isProfileOpen
                    ? 'bg-[#00A5E5] shadow-[0_0_25px_rgba(124,92,255,0.4)]'
                    : 'bg-[#00A5E5]/80 border-[#00A5E5]/20 hover:bg-[#00A5E5] hover:shadow-[0_0_20px_rgba(124,92,255,0.3)]'}
                `}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden  shadow-md">
                  {user.image ? (
                    <img src={getImageUrl(user.image)} alt={user.name} className="w-full h-full object-cover" />
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
                      <div className="w-12 h-12 rounded-full overflow-hidden ">
                        {user.image ? <img src={getImageUrl(user.image)} alt={user.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-[#7C5CFF] to-[#9D7CFF] flex items-center justify-center text-white font-bold">{user.name.charAt(0)}</div>}
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
                      <Link href="/favorites" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-[20px] text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                        <Heart size={18} className="text-gray-400" />
                        <span>Favorites</span>
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
            <Link href="/login" className="px-8 py-2.5 rounded-full bg-[#00A5E5] text-white text-sm font-bold  transition-all animate-shine animate-pulse-glow">
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
                  {user.image ? <img src={getImageUrl(user.image)} alt={user.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-[#7C5CFF] to-[#9D7CFF] flex items-center justify-center text-white font-bold">{user.name.charAt(0)}</div>}
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
                <Bell size={20} /><span className="absolute top-4 right-4 w-2 h-2 bg-[#00A5E5] rounded-full border border-[#111116]"></span>
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
              <Link href="/login" className="px-6 py-4 rounded-2xl bg-[#00A5E5] text-white text-center font-bold mt-4">Sign In</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// Backward compatibility or default export if needed
export const Navbar = MarketingNavbar;
