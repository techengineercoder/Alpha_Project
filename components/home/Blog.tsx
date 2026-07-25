"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useGetAllBlogQuery } from '@/redux/feature/blogApi/blogSlice';

export function Blog() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const { data, isLoading, error } = useGetAllBlogQuery({ limit: 10, offset: 0 });
  const blogs = data?.results || [];

  // Auto-scroll carousel every 4 seconds unless hovered
  useEffect(() => {
    if (isHovered || blogs.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % blogs.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, blogs.length]);

  const getImageUrl = (imagePath?: string | null) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=800";
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "https://backend.getavails.com";
    return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  const getExcerpt = (content: string) => {
    if (!content) return "";
    const text = content.replace(/<[^>]*>/g, '');
    if (text.length <= 120) return text;
    return text.substring(0, 120).trim() + "...";
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-[#0B0B0F] relative overflow-hidden animate-pulse">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="h-10 w-64 bg-white/10 rounded mb-4" />
            <div className="h-5 w-48 bg-white/10 rounded" />
          </div>
          <div className="relative h-[550px] w-full flex items-center justify-center mb-16">
            <div className="absolute w-[85%] md:w-full max-w-[340px] md:max-w-[420px] h-[480px] md:h-[520px] rounded-[24px] bg-white/5 border border-white/10" />
          </div>
        </div>
      </section>
    );
  }

  if (error || blogs.length === 0) {
    return null;
  }

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
          {blogs.map((post, index) => {
            // Calculate distance from active index
            let diff = index - activeIndex;

            // Handle wrap around perfectly for endless loop
            const halfLength = Math.floor(blogs.length / 2);
            if (diff < -halfLength) diff += blogs.length;
            if (diff > halfLength) diff -= blogs.length;

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
                className={`absolute w-[85%] md:w-full max-w-[340px] md:max-w-[420px] h-[480px] md:h-[520px] rounded-[24px] overflow-hidden ${isCenter ? 'cursor-default' : 'cursor-pointer'} shadow-2xl ${isCenter ? 'border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : ''
                  }`}
              >
                {/* Image Container with Brightness Filter */}
                <div className="absolute inset-0 transition-all duration-700" style={{ filter: isCenter ? 'brightness(1)' : 'brightness(0.3)' }}>
                  <img
                    src={getImageUrl(post.image)}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/80 to-transparent pointer-events-none" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end h-[50%] md:h-[45%] transition-all duration-700">
                  <h3 className={`font-bold mb-3 transition-colors duration-700 ${isCenter ? 'text-white text-xl md:text-[22px] leading-tight' : 'text-[#A1A1AA] text-lg md:text-xl'}`}>
                    {post.title}
                  </h3>
                  <p className={`mb-6 transition-colors duration-700 ${isCenter ? 'text-[#A1A1AA] text-[15px]' : 'text-[#71717A] text-sm'}`}>
                    {getExcerpt(post.content)}
                  </p>

                  <div className="mt-auto">
                    {isCenter ? (
                      <Link href={`/blog/${post.slug}`} onClick={(e) => e.stopPropagation()}>
                        <button className="w-full cursor-pointer py-3 md:py-3.5 bg-[#00A5E5] text-white text-sm font-bold rounded-full hover:bg-[#0090C9] transition-colors">
                          Read More
                        </button>
                      </Link>
                    ) : (
                      <button className="w-full cursor-pointer py-3 md:py-3.5 border border-white/20 border-dashed text-[#71717A] text-sm font-bold rounded-full transition-colors">
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
            <button className="px-10 cursor-pointer py-3.5 bg-[#00A5E5] text-white text-sm font-bold rounded-full hover:bg-[#0090C9] transition-colors shadow-lg shadow-[#00A5E5]/20">
              View All Blog Posts
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
