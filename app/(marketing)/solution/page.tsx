"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageSquare, Calendar, RefreshCw, FileText, CreditCard, LayoutDashboard } from 'lucide-react';
import { Contact } from '@/components/home/Contact';
import { CTA } from '@/components/home/CTA';

const PossibilityCard = ({ title, description, isActive, index }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 * index }}
        className={`rounded-2xl p-6 md:p-8 border flex flex-col items-center text-center transition-all ${isActive
            ? 'bg-[#00A5E5]/[0.03] border-[#00A5E5]/20 shadow-[0_0_30px_rgba(0,165,229,0.05)]'
            : 'bg-[#18181C] border-white/5'
            }`}
    >
        <h3 className="text-white font-bold text-lg mb-4">{title}</h3>
        <p className={`text-sm leading-relaxed ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>
            {description}
        </p>
    </motion.div>
);

const SuperpowerCard = ({ icon: Icon, title, description, index }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 * index }}
        className="bg-[#18181C] rounded-2xl p-6 border border-white/5"
    >
        <div className="flex items-center gap-3 mb-3">
            <Icon className="text-[#00A5E5]" size={20} />
            <h3 className="text-[#00A5E5] font-bold text-sm md:text-base">{title}</h3>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
            {description}
        </p>
    </motion.div>
);

export default function SolutionPage() {
    const possibilityCards = [
        {
            title: "Discover & Book the Right Talent Fast",
            description: "Easily browse artist profiles, availability, and past performance data. Send offers, manage contracts, and track responses - all in one place. With Getavails, securing talent is no longer a waiting game.",
            isActive: true
        },
        {
            title: "Get Seen. Get Booked. Get Paid.",
            description: "Premium members gain access to intelligent booking tools that analyze performance data, availability, and location to auto-generate optimized offers. This dramatically streamlines negotiations and reduces",
            isActive: false
        },
        {
            title: "Fill Your Calendar With Acts That Fit",
            description: "Premium members gain access to intelligent booking tools that analyze performance data, availability, and location to auto-generate optimized offers. This dramatically streamlines negotiations and reduces",
            isActive: false
        },
        {
            title: "Control the Career, Not the Chaos",
            description: "Premium members gain access to intelligent booking tools that analyze performance data, availability, and location to auto-generate optimized offers. This dramatically streamlines negotiations and reduces",
            isActive: false
        }
    ];

    const superpowerCards = [
        {
            icon: MessageSquare,
            title: "Centralized Messaging",
            description: "Keep all your conversations in one place, across roles, gigs, and timelines - clear, fast, and searchable."
        },
        {
            icon: Calendar,
            title: "Smart Availability Search",
            description: "Keep all your conversations in one place, across roles, gigs, and timelines - clear, fast, and searchable."
        },
        {
            icon: RefreshCw,
            title: "Calendar Sync",
            description: "Keep all your conversations in one place, across roles, gigs, and timelines - clear, fast, and searchable."
        },
        {
            icon: FileText,
            title: "In-app Offers & Contracts",
            description: "Keep all your conversations in one place, across roles, gigs, and timelines - clear, fast, and searchable."
        },
        {
            icon: CreditCard,
            title: "Secure Payment Flows",
            description: "Keep all your conversations in one place, across roles, gigs, and timelines - clear, fast, and searchable."
        },
        {
            icon: LayoutDashboard,
            title: "Role-Specific Dashboards",
            description: "Keep all your conversations in one place, across roles, gigs, and timelines - clear, fast, and searchable."
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
                            src="/soulation.jpg"
                            alt="Solutions Background"
                            fill
                            className="object-cover object-top opacity-30"
                            priority
                        />
                        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0E0E12]/60 to-[#0E0E12]"></div> */}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center flex flex-col items-center">
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
                            Solutions for Every Role in the Live Entertainment Ecosystem
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg  text-white/80 text-center max-w-4xl mb-12 font-light leading-relaxed"
                        >
                            Getavails isn't just a booking tool, it's a tailored ecosystem that adapts to your workflow. We understand that each role in the entertainment chain faces unique challenges. That's why we've designed Getavails to meet your specific needs, streamline your operations, and amplify your impact, no matter your role.
                        </motion.p>
                    </div>
                </section>

                {/* Possibilities Section */}
                <section className="relative z-10 mt-16 max-w-7xl mx-auto px-4 md:px-8 pb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">One Platform. Multiple Possibilities.</h2>
                        <p className="text-gray-400 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
                            Whether you're booking talent, managing tours, or hosting sold-out shows, Getavails simplifies your operations and expands your opportunities, all from one powerful platform.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {possibilityCards.map((card, index) => (
                            <PossibilityCard key={index} index={index} {...card} />
                        ))}
                    </div>
                </section>

                {/* Superpowers Section */}
                <section className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pb-40">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">One Core Platform. Shared Superpowers.</h2>
                        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                            No matter your role, Getavails equips you with robust tools to get the job done - faster, smarter, and stress-free.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {superpowerCards.map((card, index) => (
                            <SuperpowerCard key={index} index={index} {...card} />
                        ))}
                    </div>
                </section>
            </main>
            <Contact />
            <CTA />
        </div>
    );
}
