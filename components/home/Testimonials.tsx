"use client";

import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonialsRow1 = [
  {
    name: 'Maria Lopez',
    role: 'Event Organizer',
    text: "GetAvails made finding the right acts effortless, we booked our festival lineup in record time.",
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80',
    rating: 5,
  },
  {
    name: 'Darren Fields',
    role: 'Indie Artist',
    text: "The platform connects me with venues I never thought I'd have access to.",
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80',
    rating: 5,
    highlight: true,
  },
  {
    name: 'Rachel Kim',
    role: 'Talent Manager',
    text: "Finally, one dashboard to manage all my bookings, contracts, and payments - it's a lifesaver.",
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80',
    rating: 5,
  },
  {
    name: 'David Chen',
    role: 'Club Owner',
    text: "A game-changer for our venue. Booking top-tier acts has never been this efficient and straightforward.",
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80',
    rating: 5,
  }
];

const testimonialsRow2 = [
  {
    name: 'Sophie Turner',
    role: 'Venue Owner',
    text: "GetAvails bridges the gap between talent and opportunities, and it works flawlessly.",
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&q=80',
    rating: 5,
  },
  {
    name: 'Ethan Brooks',
    role: 'Artist',
    text: "I used to juggle multiple apps. Now I just log in to GetAvails and everything's in one place.",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
    rating: 5,
  },
  {
    name: 'Liam Harris',
    role: 'Concert Promoter',
    text: "The matchmaking between artists and venues is incredible. It feels like the platform truly understands our needs.",
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&q=80',
    rating: 5,
  },
  {
    name: 'Jessica Taylor',
    role: 'Private Host',
    text: "Found the perfect acoustic duo for my birthday party. The communication was excellent and the performance was magical.",
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80',
    rating: 5,
  }
];

export function Testimonials() {
  const renderCard = (testimonial: any, key: string) => (
    <div
      key={key}
      className={`w-[320px] md:w-[400px] shrink-0 bg-[#121218] rounded-[24px] p-6 shadow-xl transition-all duration-300
        ${testimonial.highlight ? 'border border-[#00A5E5] shadow-[0_0_30px_rgba(0,165,229,0.15)] -translate-y-1' : 'border border-white/5 hover:border-white/10 hover:-translate-y-1'}
      `}
    >
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="text-white font-bold text-sm md:text-[15px]">{testimonial.name}</h4>
            <p className="text-[#A1A1AA] text-xs">{testimonial.role}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-[14px] h-[14px] md:w-4 md:h-4 fill-[#FFB800] text-[#FFB800]" />
          ))}
        </div>
      </div>
      
      <div className="w-full h-px bg-white/5 mb-5" />
      
      <p className="text-[#A1A1AA] text-[15px] leading-relaxed">
        {testimonial.text}
      </p>
    </div>
  );

  return (
    <section className="w-full bg-[#0b0b0f] py-24 overflow-hidden relative">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col items-center mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-center max-w-3xl leading-tight tracking-tight"
        >
          Trusted By Top Artists, Venues & Agents Worldwide
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[#A1A1AA] text-sm md:text-[17px] text-center max-w-2xl leading-relaxed"
        >
          From stadium-filling performers to intimate venues, our network spans every corner of the entertainment industry.
        </motion.p>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-16 md:gap-32 mt-16"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl md:text-[40px] font-bold text-white tracking-tight">1,200+</span>
            <span className="text-[#A1A1AA] text-sm md:text-[15px] font-medium">Venues</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl md:text-[40px] font-bold text-white tracking-tight">4,500+</span>
            <span className="text-[#A1A1AA] text-sm md:text-[15px] font-medium">Artists</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl md:text-[40px] font-bold text-white tracking-tight">30K+</span>
            <span className="text-[#A1A1AA] text-sm md:text-[15px] font-medium">Bookings Facilitated</span>
          </div>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full flex flex-col gap-6 py-4">
        
        {/* Gradients for smooth fade at edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 md:w-64 bg-gradient-to-r from-[#0b0b0f] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 md:w-64 bg-gradient-to-l from-[#0b0b0f] to-transparent" />

        {/* Row 1 (Right to Left) */}
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          <div className="flex gap-6 pr-6">
            {testimonialsRow1.map((testimonial, i) => renderCard(testimonial, `1a-${i}`))}
          </div>
          <div className="flex gap-6 pr-6">
            {testimonialsRow1.map((testimonial, i) => renderCard(testimonial, `1b-${i}`))}
          </div>
        </div>

        {/* Row 2 (Left to Right) */}
        <div className="flex w-max animate-marquee-reverse hover:[animation-play-state:paused] -ml-[200px] md:-ml-[400px]">
          <div className="flex gap-6 pr-6">
            {testimonialsRow2.map((testimonial, i) => renderCard(testimonial, `2a-${i}`))}
          </div>
          <div className="flex gap-6 pr-6">
            {testimonialsRow2.map((testimonial, i) => renderCard(testimonial, `2b-${i}`))}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 50s linear infinite;
        }
      `}} />
    </section>
  );
}
