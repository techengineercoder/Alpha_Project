"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    Mic, UserCheck, Building, Handshake,
    Lock, Calendar, Bot, Zap,
    Folder, Users, Globe, RefreshCw,
    CreditCard, BarChart2, Wrench, Smartphone
} from 'lucide-react';
import { Contact } from '@/components/home/Contact';
import { CTA } from '@/components/home/CTA';

const HeroCard = ({ icon: Icon, title, points, index }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 + (0.1 * index) }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col"
    >
        <div className="flex items-center gap-3 mb-6">
            <Icon className="text-white" size={24} />
            <h3 className="text-white font-bold text-lg">{title}</h3>
        </div>
        <ul className="space-y-2 flex-1">
            {points.map((point: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 shrink-0"></span>
                    <span className="text-gray-300 text-sm leading-relaxed">{point}</span>
                </li>
            ))}
        </ul>
    </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description, index }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 * index }}
        className="bg-[#15151A] border border-white/5 rounded-2xl p-6"
    >
        <div className="flex items-center gap-3 mb-4">
            <Icon className="text-[#00A5E5]" size={22} />
            <h3 className="text-[#00A5E5] font-semibold text-base">{title}</h3>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
            {description}
        </p>
    </motion.div>
);

export default function ServicesPage() {
    const heroCards = [
        {
            icon: Mic,
            title: "Artist Services",
            points: [
                "Find and pitch venues with availability filters.",
                "Manage a professional, shareable artist profile.",
                "Review incoming offers + accept/decline with a click.",
                "Track contracts and payments."
            ]
        },
        {
            icon: UserCheck,
            title: "Agent Services",
            points: [
                "Manage multiple artists from a single dashboard.",
                "Pitch and book venues on behalf of clients.",
                "Negotiate offers and contracts seamlessly.",
                "Monitor artist schedules, tours, and payments."
            ]
        },
        {
            icon: Building,
            title: "Venue Services",
            points: [
                "List available dates and manage bookings easily.",
                "Discover and connect with artists/agents that fit your event.",
                "Approve or decline offers with real-time notifications.",
                "Track contracts, rider requirements, and payments."
            ]
        },
        {
            icon: Handshake,
            title: "Talent Buyer Services",
            points: [
                "Search and filter artists by genre, budget, and availability.",
                "Send booking offers directly to artists or agents.",
                "Compare proposals and manage negotiations in one place.",
                "Securely handle contracts and payment transactions."
            ]
        }
    ];

    const defaultFeatureDesc = "All agreements are backed with digital verification, providing security for both artists and venues before any commitment is finalized.";

    const apartFeatures = [
        { icon: Lock, title: "Verified Contracts", description: defaultFeatureDesc },
        { icon: Calendar, title: "Real-Time Availability", description: defaultFeatureDesc },
        { icon: Bot, title: "Smart AI Assistant", description: defaultFeatureDesc },
        { icon: Zap, title: "One-Tap Offer Flow", description: defaultFeatureDesc },
        { icon: Folder, title: "Digital Press Kits", description: defaultFeatureDesc },
        { icon: Users, title: "Multi-Role Accounts", description: defaultFeatureDesc },
        { icon: Globe, title: "Global Discovery Engine", description: defaultFeatureDesc },
        { icon: RefreshCw, title: "Contract Tracking", description: defaultFeatureDesc },
        { icon: CreditCard, title: "Flexible Payment Gateways", description: defaultFeatureDesc },
        { icon: BarChart2, title: "Performance Analytics", description: defaultFeatureDesc },
        { icon: Wrench, title: "Add-On Tools", description: defaultFeatureDesc },
        { icon: Smartphone, title: "Mobile Optimized UX", description: defaultFeatureDesc }
    ];

    return (
        <div>
            <main className="min-h-screen bg-[#0E0E12] text-white">
                {/* Hero Section */}
                <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden min-h-[900px] flex flex-col justify-center">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/service.png"
                            alt="Services Background"
                            fill
                            className="object-cover object-center opacity-40"
                            priority
                        />
                        {/* <div className="absolute inset-0 bg-[#0E0E12]/40 backdrop-blur-[2px]"></div> */}
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
                        {/* Header Content */}
                        <div className="text-center mb-20 max-w-4xl mx-auto">
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-4xl md:text-6xl lg:text-[64px] lg:leading-[76px] font-bold text-white mb-6 tracking-tight"
                            >
                                From Search to Signature,<br className="hidden md:block" /> We're With You
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-lg md:text-xl text-white/90 font-light leading-relaxed max-w-3xl mx-auto"
                            >
                                From search to signed contracts, discover how Getavails connects Artists, Agents, Venues, and Buyers in a single, seamless flow.
                            </motion.p>
                        </div>

                    </div>
                </section>

                {/* Hero Cards Grid - Overlapping the Hero */}
                <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 -mt-24 md:-mt-32 lg:-mt-40">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {heroCards.map((card, index) => (
                            <HeroCard key={index} index={index} {...card} />
                        ))}
                    </div>
                </div>

                {/* What Sets Us Apart Section */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-40 pb-32 bg-[#0E0E12]">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">What Sets GetAvails Apart</h2>
                        <p className="text-gray-400 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
                            Not just another booking platform - every feature is crafted to reduce friction,
                            increase visibility, and drive real results across the live entertainment industry.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {apartFeatures.map((feature, index) => (
                            <FeatureCard key={index} index={index} {...feature} />
                        ))}
                    </div>
                </section>
            </main>
            <Contact />
            <CTA />
        </div>
    );
}
