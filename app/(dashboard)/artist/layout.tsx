"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
  { name: "Dashboard", href: "/artist/dashboard" },
  { name: "Booking", href: "/artist/bookings" },
  { name: "Incoming Offers", href: "/artist/offers" },
  // { name: "Availability", href: "/artist/availability" },
  // { name: "Messages", href: "/artist/messages" },
  { name: "Profile Settings", href: "/artist/settings" },
];

export default function ArtistLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-12 relative z-10">
      {/* Sub-Navigation Tabs - Figma Precise Design */}
      <div className="flex items-center gap-2 p-1.5 bg-white/[0.02] border border-white/5 rounded-[20px] w-full md:w-fit max-w-full backdrop-blur-md overflow-x-auto no-scrollbar mx-auto md:mx-0">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`relative h-[40px] md:h-[48px] px-4 md:px-7 flex items-center justify-center text-sm md:text-base font-medium transition-all rounded-[16px] whitespace-nowrap
                ${isActive ? "text-white" : "text-gray-500 hover:text-gray-300"}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-[16px] border border-[#D2C7FF]/18 shadow-[0_4px_30px_rgba(125,102,255,0.37)] animate-pulse-glow overflow-hidden"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7C5CFF]/[0.41] to-[#9D7CFF]/[0.17]" />
                  {/* Subtle inner shine */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/[0.05] to-transparent pointer-events-none" />
                </motion.div>
              )}
              <span className="relative z-10">{tab.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Page Content with Entrance Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
