"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: "How Agents Can Streamline Their Artist Booking Workflow",
    excerpt: "Learn how Getavails helps agents manage multiple artists, track offers, and close more bookings with less back-and-forth.",
    image: "https://images.unsplash.com/photo-1540039155732-68473678c96e?q=80&w=800&auto=format&fit=crop", // Concert stage / crowd
    link: "/blog/streamline-workflow"
  },
  {
    id: 2,
    title: "How Agents Can Streamline Their Artist Booking Workflow",
    excerpt: "Learn how Getavails helps agents manage multiple artists, track offers, and close more bookings with less back-and-forth.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop", // Studio / Headphones
    link: "/blog/streamline-workflow"
  },
  {
    id: 3,
    title: "How Agents Can Streamline Their Artist Booking Workflow",
    excerpt: "Learn how Getavails helps agents manage multiple artists, track offers, and close more bookings with less back-and-forth.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop", // Guitarist
    link: "/blog/streamline-workflow"
  },
  {
    id: 4,
    title: "Why Event Organizers are Switching to GetAvails",
    excerpt: "See how moving away from emails and spreadsheets into a centralized dashboard changes the game for festivals.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
    link: "/blog/organizers-switching"
  },
  {
    id: 5,
    title: "Maximizing Your Artist Profile Visibility",
    excerpt: "Learn the top 5 strategies to make your artist profile stand out to talent buyers and top-tier venues.",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=800&auto=format&fit=crop",
    link: "/blog/maximize-visibility"
  }
];

export function Blog() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll carousel every 4 seconds unless hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % blogPosts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section className="py-24 bg-[#0B0B0F] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            Insights from the Stage & Studio
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#A1A1AA] text-base md:text-[17px]"
          >
            Artists, Agents & Insights — All in One Place.
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative h-[550px] w-full flex items-center justify-center mb-16 overflow-hidden md:overflow-visible"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {blogPosts.map((post, index) => {
            // Calculate distance from active index
            let diff = index - activeIndex;
            
            // Handle wrap around perfectly for endless loop
            const halfLength = Math.floor(blogPosts.length / 2);
            if (diff < -halfLength) diff += blogPosts.length;
            if (diff > halfLength) diff -= blogPosts.length;

            const isCenter = diff === 0;
            
            // Render only items that are visible or adjacent
            const isVisible = Math.abs(diff) <= 2;
            if (!isVisible) return null;

            return (
              <motion.div
                key={post.id}
                animate={{ 
                  opacity: isCenter ? 1 : Math.abs(diff) === 1 ? 0.6 : 0,
                  x: isCenter ? '0%' : diff === -1 ? '-105%' : diff === 1 ? '105%' : diff < -1 ? '-200%' : '200%',
                  scale: isCenter ? 1 : 0.9,
                  zIndex: isCenter ? 30 : Math.abs(diff) === 1 ? 10 : 0,
                }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                onClick={() => {
                  if (Math.abs(diff) === 1) setActiveIndex(index);
                }}
                className={`absolute w-[85%] md:w-full max-w-[340px] md:max-w-[420px] h-[480px] md:h-[520px] rounded-[24px] overflow-hidden ${isCenter ? 'cursor-default' : 'cursor-pointer'} shadow-2xl ${
                  isCenter ? 'border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : ''
                }`}
              >
                {/* Image Container with Brightness Filter */}
                <div className="absolute inset-0 transition-all duration-700" style={{ filter: isCenter ? 'brightness(1)' : 'brightness(0.3)' }}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                    priority={isCenter}
                  />
                </div>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/80 to-transparent pointer-events-none" />
                
                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end h-[50%] md:h-[45%] transition-all duration-700">
                  <h3 className={`font-bold mb-3 transition-colors duration-700 ${isCenter ? 'text-white text-xl md:text-[22px] leading-tight' : 'text-[#A1A1AA] text-lg md:text-xl'}`}>
                    {post.title}
                  </h3>
                  <p className={`mb-6 line-clamp-2 md:line-clamp-3 transition-colors duration-700 ${isCenter ? 'text-[#A1A1AA] text-[15px]' : 'text-[#71717A] text-sm'}`}>
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto">
                    {isCenter ? (
                      <Link href={post.link} onClick={(e) => e.stopPropagation()}>
                        <button className="w-full py-3 md:py-3.5 bg-[#00A5E5] text-white text-sm font-bold rounded-full hover:bg-[#0090C9] transition-colors">
                          Read More
                        </button>
                      </Link>
                    ) : (
                      <button className="w-full py-3 md:py-3.5 border border-white/20 border-dashed text-[#71717A] text-sm font-bold rounded-full transition-colors">
                        Read More
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-4">
          <Link href="/blog">
            <button className="px-10 py-3.5 bg-[#00A5E5] text-white text-sm font-bold rounded-full hover:bg-[#0090C9] transition-colors shadow-lg shadow-[#00A5E5]/20">
              View All Blog Posts
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
