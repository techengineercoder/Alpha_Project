"use client";

import React, { useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Wedding Planner',
    text: "Booked an incredible DJ for our client's wedding. The process was seamless and the artist exceeded all expectations!",
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80',
    rating: 5,
  },
  {
    name: 'Marcus Chen',
    role: 'Event Director',
    text: "Best platform for finding premium talent. We've used it for 15+ corporate events with perfect results every time.",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
    rating: 5,
  },
  {
    name: 'Emma Rodriguez',
    role: 'Festival Organizer',
    text: "The quality of artists and ease of booking is unmatched. Saved us countless hours in talent coordination.",
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'Club Owner',
    text: "A game-changer for our venue. Booking top-tier acts has never been this efficient and straightforward.",
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80',
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
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isHoveredRef = useRef(false);

  // We duplicate the testimonials multiple times to ensure enough items to fill the screen and loop smoothly
  const allTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  useEffect(() => {
    let animationId: number;
    let scrollPos = 0;
    const speed = 1.2; // Scrolling speed

    const animate = () => {
      if (wrapperRef.current && containerRef.current) {
        if (!isHoveredRef.current) {
          scrollPos += speed;
        }

        // Total width of ONE full set of testimonials (since we duplicated it 4 times, one set is scrollWidth / 4)
        const singleSetWidth = wrapperRef.current.scrollWidth / 4;

        // Loop back when we've scrolled past one full set
        if (scrollPos >= singleSetWidth) {
          scrollPos -= singleSetWidth;
        }

        wrapperRef.current.style.transform = `translateX(-${scrollPos}px)`;

        const screenCenter = window.innerWidth / 2;

        cardsRef.current.forEach((card) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const distance = Math.abs(screenCenter - cardCenter);

          // Max distance before the card goes to its smallest state
          const maxDistance = 600;

          let scale = 0.85;
          let translateY = 0;
          let opacity = 0.4;
          let zIndex = 0;

          if (distance < maxDistance) {
            // progress goes from 0 (at edges) to 1 (at exact center)
            const progress = 1 - distance / maxDistance;
            // Use an easing curve for a smoother "pop" in the center
            const easeProgress = Math.pow(progress, 2);

            scale = 0.85 + (0.2 * easeProgress); // scale from 0.85 to 1.05
            translateY = -40 * easeProgress;     // elevate up to 40px
            opacity = 0.4 + (0.6 * easeProgress); // opacity from 0.4 to 1.0
            zIndex = Math.round(easeProgress * 100);
          }

          card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
          card.style.opacity = opacity.toString();
          card.style.zIndex = zIndex.toString();
        });
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="w-full bg-[#0b0b0f] py-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8  flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-[45px] font-bold text-white mb-4 text-center tracking-tight"
        >
          Real Bookings, Real Success
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[#A1A1AA] text-base md:text-lg text-center"
        >
          See what event organizers are saying
        </motion.p>
      </div>

      {/* Marquee Container */}
      <div
        className="relative w-full h-[450px]"
        ref={containerRef}
        onMouseEnter={() => (isHoveredRef.current = true)}
        onMouseLeave={() => (isHoveredRef.current = false)}
        onTouchStart={() => (isHoveredRef.current = true)}
        onTouchEnd={() => (isHoveredRef.current = false)}
      >

        {/* Gradient fades for the edges to blend smoothly */}
        <div className="pointer-events-none absolute left-0 top-0 z-50 h-full w-24 md:w-64 bg-gradient-to-r from-[#0e0e13] via-[#0e0e13]/80 to-transparent"></div>
        <div className="pointer-events-none absolute right-0 top-0 z-50 h-full w-24 md:w-64 bg-gradient-to-l from-[#0e0e13] via-[#0e0e13]/80 to-transparent"></div>

        <div className="flex w-max absolute top-10" ref={wrapperRef}>
          {allTestimonials.map((testimonial, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              // Removed container gap, added horizontal margin to the card itself to maintain exact width calculations
              className="w-[320px] md:w-[420px] mx-4 bg-[#121218] border border-white/5 p-8 rounded-[24px] flex flex-col justify-between shadow-2xl transition-shadow duration-300 relative"
            >
              <div>
                <div className="flex gap-1.5 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, idx) => (
                    <Star key={idx} className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
                  ))}
                </div>
                <p className="text-[#A1A1AA] text-base md:text-lg leading-relaxed mb-8 font-light">
                  {testimonial.text}
                </p>
              </div>

              <div className="flex items-center gap-4 mt-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h4 className="text-white font-semibold text-base">{testimonial.name}</h4>
                  <p className="text-[#A1A1AA] text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
