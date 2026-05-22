"use client";

import React from 'react';
import { Search, Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: Search,
    title: 'Search',
    description: 'Browse through our curated list of talented artists and filter by genre, location, and availability'
  },
  {
    icon: Star,
    title: 'Choose',
    description: 'Review artist profiles, watch performance videos, and read reviews from previous clients'
  },
  {
    icon: CheckCircle,
    title: 'Book',
    description: 'Send a booking request with your event details and connect directly with the artist'
  }
];

export function HowItWorks() {
  return (
    <section className="w-full bg-[#0e0e13] py-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4 text-center"
        >
          How It Works
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[#A1A1AA] text-sm md:text-base mb-16 text-center max-w-2xl"
        >
          Three simple steps to book your perfect artist
        </motion.p>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 w-full">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex flex-col items-center text-center"
            >
              {/* Icon Box */}
              <div className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-center mb-6 transition-transform hover:scale-110 hover:bg-white/10 cursor-pointer">
                <step.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-[260px] mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
