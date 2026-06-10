"use client";

import React from 'react';
import Image from 'next/image';
import { User, Search, Sparkles, Handshake, Plane, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Contact } from '@/components/home/Contact';
import { CTA } from '@/components/home/CTA';

const FeatureCard = ({ icon: Icon, title, description, features, index }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 * index }}
        className="bg-[#242428] rounded-2xl p-6 border border-white/5 flex flex-col gap-4"
    >
        <div className="w-10 h-10 rounded-lg bg-[#00A5E5]/10 flex items-center justify-center mb-2">
            <Icon className="text-[#00A5E5]" size={24} />
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        <div className="mt-4">
            <p className="text-gray-500 text-xs font-semibold mb-3 uppercase tracking-wider">Features:</p>
            <ul className="space-y-2">
                {features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                        <span className="w-1 h-1 rounded-full bg-gray-500 mt-2 shrink-0"></span>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    </motion.div>
);

export default function FeaturesPage() {
    const defaultFeatures = [
        "Personalized onboarding by role (Agent, Artist, Venue, Buyer)",
        "Artist claiming and management by agents",
        "Venue profiles with dynamic availability calendar",
        "Buyer profiles with saved preferences and inquiry management"
    ];

    const cards = [
        {
            icon: User,
            title: "Profiles",
            description: "Build a tailored profile experience for your role. Whether managing artists, listing venues, or booking talent, Getavails makes it seamless to create and maintain detailed profiles.",
            features: defaultFeatures
        },
        {
            icon: Search,
            title: "Search",
            description: "Find the perfect match with advanced search tools. Instantly explore artists and venues using smart filters, availability insights, and data-driven recommendations tailored to your needs.",
            features: defaultFeatures
        },
        {
            icon: Sparkles,
            title: "AI Recommendations",
            description: "Plan smarter with AI-powered suggestions. Get automated recommendations for artist bookings, venue pairings, tour routing, and more, driven by real-time industry data and trends.",
            features: defaultFeatures
        },
        {
            icon: Handshake,
            title: "Booking",
            description: "Streamline your booking process by managing offers, tracking status, and confirming deals - all within a unified platform built to optimize efficiency and transparency.",
            features: defaultFeatures
        },
        {
            icon: Plane,
            title: "Logistics",
            description: "Simplify event logistics with integrated travel and hotel planning. Manage itineraries, book accommodations, and coordinate travel details directly through your Getavails dashboard.",
            features: defaultFeatures
        },
        {
            icon: MessageSquare,
            title: "Messaging",
            description: "Enhance collaboration with built-in messaging and AI chat support. Communicate seamlessly with agents, venues, and artists to keep deals moving and events on track.",
            features: defaultFeatures
        }
    ];

    return (
        <div>
            <main className="min-h-screen bg-[#0E0E12] text-white">
                {/* Hero Section */}
                <section className="relative pt-32 pb-40 md:pt-48 md:pb-56 overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/feature.jpg"
                            alt="Features Background"
                            fill
                            className="object-cover object-top opacity-30"
                            priority
                        />
                        {/* Gradient Overlay for blending into the bottom section */}
                        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0E0E12]/80 to-[#0E0E12]"></div> */}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-5xl  mx-auto px-4 md:px-8 text-center flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/5 backdrop-blur-sm mb-8"
                        >
                            <div className="w-2 h-2 rounded-full bg-[#00A5E5]"></div>
                            <span className="text-sm font-medium text-gray-200">Over 10,000+ verified artists available</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-6xl lg:text-[50px] lg:leading-[60px] tracking-[0px] font-bold text-center text-white mb-4"
                        >
                            Powerful Features Built for Artists, Agents, Venues & Buyers
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg  text-white/80 text-center max-w-4xl mb-12 font-light leading-relaxed"
                        >
                            Whether you're booking talent or managing your own gigs, Getavails has everything you need. Search Availability With the Free plan, users can initiate basic availability searches for artists or venues once per day, ideal for casual browsing or early-stage planning. Premium users unlock unlimited searches, empowering faster booking cycles and broader discovery potential.
                        </motion.p>
                    </div>
                </section>

                {/* Features Grid Section */}
                <section className="relative z-10 max-w-7xl mt-16 mx-auto px-4 md:px-8 pb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Book,<br className="hidden sm:block" /> Manage, and Grow</h2>
                        <p className="text-gray-400 text-lg">A clear path to connect with artists, agents, and venues — all in just a few clicks.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cards.map((card, index) => (
                            <FeatureCard key={index} index={index} {...card} />
                        ))}
                    </div>
                </section>
            </main>
            <Contact />
            <CTA />
        </div>
    );
}
