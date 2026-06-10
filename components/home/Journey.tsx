"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { User, Search, Handshake, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const cards = [
  {
    title: "Set Up Your Profile",
    icon: User,
    description: "Quickly onboard and set up a role-based profile to start using Getavails.",
    color: "#00A5E5",
    buttonText: "Start Now",
    buttonLink: "/register",
    features: [
      "Role-based onboarding (Agent, Artist, Venue, Buyer)",
      "Profile verification & approval",
      "Team & multi-user access",
      "Role-specific dashboards",
      "Custom profile fields (Genres, Availability, Location)"
    ]
  },
  {
    title: "Discover Talent & Venues",
    icon: Search,
    description: "Browse and filter through artists, venues, and available events with smart search.",
    color: "#D8B65E",
    buttonText: "Explore Listings",
    buttonLink: "/search",
    features: [
      "Role-based onboarding (Agent, Artist, Venue, Buyer)",
      "Profile verification & approval",
      "Team & multi-user access",
      "Role-specific dashboards",
      "Custom profile fields (Genres, Availability, Location)"
    ]
  },
  {
    title: "Make Offers & Inquiries",
    icon: Handshake,
    description: "Send offers, submit inquiries, and manage negotiations - all inside the platform.",
    color: "#C1292E",
    buttonText: "See How It Works",
    buttonLink: "/#how-it-works",
    features: [
      "Role-based onboarding (Agent, Artist, Venue, Buyer)",
      "Profile verification & approval",
      "Team & multi-user access",
      "Role-specific dashboards",
      "Custom profile fields (Genres, Availability, Location)"
    ]
  }
];

export function Journey() {
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
            Your Talent Booking Journey, Simplified
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#A1A1AA] text-sm md:text-base max-w-2xl mx-auto"
          >
            Everything you need to onboard, discover talent, and make offers in one flow.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#121218] border border-white/5 rounded-[24px] p-8 flex flex-col h-full hover:border-white/10 transition-colors shadow-lg"
              >
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-[22px] font-bold" style={{ color: card.color }}>
                    {card.title}
                  </h3>
                  <Icon className="w-6 h-6 shrink-0" style={{ color: card.color }} strokeWidth={1.5} />
                </div>
                
                <p className="text-[#A1A1AA] text-[15px] mb-8 leading-relaxed">
                  {card.description}
                </p>

                <div className="mb-10 flex-1">
                  <h4 className="text-[13px] font-semibold text-gray-500 mb-4">Top Features:</h4>
                  <ul className="space-y-3">
                    {card.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[13px] text-[#A1A1AA]">
                        <span className="w-1 h-1 rounded-full bg-gray-500 mt-2 shrink-0" />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={card.buttonLink}
                  style={{ backgroundColor: card.color }}
                  className="w-full py-3.5 rounded-full flex items-center justify-center gap-2 text-white font-bold text-sm hover:brightness-110 transition-all mt-auto"
                >
                  {card.buttonText} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
