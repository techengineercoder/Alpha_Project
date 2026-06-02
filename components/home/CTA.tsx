"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function CTA() {
  return (
    <section
      className="relative w-full py-32 px-4 md:px-8 flex flex-col items-center justify-center text-center overflow-hidden bg-[#0e0e13]"
    >
      {/* Background Image Container */}
      <div
        className="absolute inset-0 z-0 opacity-100"
        style={{
          backgroundImage: "url('/image/background.png')",
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      {/* Dark gradient overlay to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#0e0e13]/50 to-[#0e0e13]"></div>

      {/* Content */}
      <div className="relative z-10  mx-auto flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-[35px] md:text-[40px] lg:text-[60px] font-bold text-white mb-6 tracking-tight text-center"
        >
          Find your perfect artist today
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[#A1A1AA] text-base md:text-[25px] font-normal mb-10 max-w-4xl leading-relaxed text-center"
        >
          Join thousands of satisfied clients who&apos;ve brought their events to life with premium talent
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/search"
            className="px-8 py-3.5 rounded-2xl bg-white/5 border border-white/20 text-white font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-white/5 active:scale-95 inline-block"
          >
            Start Browsing
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
