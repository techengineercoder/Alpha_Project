"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Zap, Target, Aperture, Wifi } from 'lucide-react';
import { Contact } from '@/components/home/Contact';
import { CTA } from '@/components/home/CTA';

const StepCard = ({ number, icon: Icon, title, description, index }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 * index }}
        className="flex flex-col items-center text-center relative"
    >
        {/* Circle with Icon */}
        <div className="w-24 h-24 bg-[#1E1E24] rounded-full flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(0,165,229,0.05)] border border-white/5">
            <Icon className="text-[#00A5E5]" size={36} />

            {/* Number Badge */}
            <div className="absolute -top-1 -left-1 w-6 h-6 bg-[#00A5E5] rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-[#0E0E12]">
                {number}
            </div>
        </div>

        {/* Text Content */}
        <h3 className="text-[#00A5E5] font-bold text-lg mt-6 mb-3">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed max-w-[240px]">
            {description}
        </p>
    </motion.div>
);

export default function HowItWorksPage() {
    const steps = [
        {
            number: 1,
            icon: Zap,
            title: "Ask Your Assistant",
            description: "Type your request — find talent, book a venue, or send a contract, all in seconds."
        },
        {
            number: 2,
            icon: Target,
            title: "Smart Matching",
            description: "AI suggests the best artists, venues, agents, or managers based on your needs."
        },
        {
            number: 3,
            icon: Aperture,
            title: "Real-Time Availability",
            description: "Instantly check who's free, compare options, and avoid endless back-and-forth."
        },
        {
            number: 4,
            icon: Wifi,
            title: "Book & Go Live",
            description: "Confirm, sign, and manage everything in one place — faster, smoother, smarter."
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
                            src="/how-it-works.jpg"
                            alt="How it works background"
                            fill
                            className="object-cover object-center opacity-40"
                            priority
                        />
                        {/* <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E12]/50 via-[#0E0E12]/70 to-[#0E0E12]"></div> */}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/5 backdrop-blur-sm mb-8"
                        >
                            <div className="w-2 h-2 rounded-full bg-[#7C5CFF]"></div>
                            <span className="text-sm font-medium text-gray-200">Over 10,000+ verified artists available</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-6xl lg:text-[70px] lg:leading-[85px] tracking-[0px] font-bold text-center text-white mb-6"
                        >
                            Your Booking Journey, Simplified
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-white/80 text-center max-w-3xl mb-12 font-light leading-relaxed"
                        >
                            From search to signed contracts, discover how Getavails connects Artists, Agents, Venues, and Buyers in a single, seamless flow.
                        </motion.p>
                    </div>
                </section>

                {/* Steps Section */}
                <section className="relative z-10 max-w-7xl mt-16 mx-auto px-4 md:px-8 pb-40 -mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-24"
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold mb-4 text-white">Plan Smarter, Book Faster with AI</h2>
                        <p className="text-gray-400 text-base max-w-2xl mx-auto">
                            Simple steps. Smarter planning. Seamless booking.
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Connecting Dashed Line (Desktop only) */}
                        <div className="hidden md:block absolute top-[48px] left-[12%] right-[12%] h-[2px] border-t-2 border-dashed border-[#00A5E5]/30 z-0"></div>

                        {/* Steps Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4">
                            {steps.map((step, index) => (
                                <StepCard key={index} index={index} {...step} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Contact />
            <CTA />
        </div>
    );
}
