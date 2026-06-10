"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, Mic2, Handshake, Star, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const roles = [
  {
    id: 'agents',
    title: 'Agents',
    icon: User,
    description: 'Manage your roster, negotiate deals, and track performance. all from one central dashboard.',
    buttonText: 'Join As Agent',
    link: '/register?role=agent',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800',
    color: '#00A5E5'
  },
  {
    id: 'venues',
    title: 'Venues',
    icon: Building2,
    description: 'List your space, manage availability, and book top talent directly through our seamless platform.',
    buttonText: 'Join As Venue',
    link: '/register?role=venue',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    color: '#00A5E5'
  },
  {
    id: 'artists',
    title: 'Artists',
    icon: Mic2,
    description: 'Showcase your talent, manage your bookings, and connect with buyers and venues worldwide.',
    buttonText: 'Join As Artist',
    link: '/register?role=artist',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    color: '#00A5E5'
  },
  {
    id: 'organizer',
    title: 'Organizer',
    icon: Handshake,
    description: 'Plan events, coordinate with multiple artists and venues, and manage your entire lineup effortlessly.',
    buttonText: 'Join As Organizer',
    link: '/register?role=organizer',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
    color: '#00A5E5'
  },
  {
    id: 'talent-buyer',
    title: 'Talent Buyer',
    icon: Star,
    description: 'Discover top-tier talent, negotiate offers securely, and book artists for your next big event.',
    buttonText: 'Join As Talent Buyer',
    link: '/register?role=buyer',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800',
    color: '#00A5E5'
  }
];

export function Roles() {
  const [activeRole, setActiveRole] = useState(roles[0].id);

  const activeData = roles.find(r => r.id === activeRole) || roles[0];

  return (
    <section className="py-24 bg-[#0B0B0F] px-4 md:px-8 lg:px-12 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Which Role Are You Joining As?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#A1A1AA] text-sm md:text-base max-w-2xl mx-auto"
          >
            Define your role and let us customize your dashboard.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Side - Accordion */}
          <div className="flex flex-col">
            {roles.map((role) => {
              const isActive = activeRole === role.id;
              const Icon = role.icon;

              return (
                <div 
                  key={role.id} 
                  className={`border-b border-white/5 last:border-0 overflow-hidden transition-all duration-300 ${isActive ? 'py-2' : 'py-0'}`}
                >
                  <button
                    onClick={() => setActiveRole(role.id)}
                    className="w-full py-5 md:py-6 flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <Icon 
                        className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'text-[#00A5E5]' : 'text-[#A1A1AA] group-hover:text-gray-300'}`} 
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      <span className={`text-lg md:text-xl font-bold transition-colors duration-300 ${isActive ? 'text-[#00A5E5]' : 'text-[#A1A1AA] group-hover:text-gray-300'}`}>
                        {role.title}
                      </span>
                    </div>
                    
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${isActive ? 'bg-white/5' : 'bg-transparent'}`}>
                      {isActive ? (
                        <ChevronUp className="w-4 h-4 text-[#A1A1AA]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="pb-8 pr-4 md:pr-12">
                          <p className="text-[#A1A1AA] text-[15px] leading-relaxed mb-6">
                            {role.description}
                          </p>
                          <Link
                            href={role.link}
                            className="inline-flex items-center justify-center px-6 py-2.5 bg-[#00A5E5] text-white text-sm font-bold rounded-full hover:bg-[#0090C9] transition-colors shadow-lg shadow-[#00A5E5]/20"
                          >
                            {role.buttonText}
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right Side - Image */}
          <div className="relative w-full aspect-[4/3] rounded-[8px] md:rounded-[24px] overflow-hidden order-first lg:order-last shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={activeData.image}
                  alt={activeData.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                {/* Subtle gradient overlay to match the dark aesthetic */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/20 to-transparent" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
