"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Star, Globe } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useGetVenueByIdQuery } from '@/redux/feature/artistApi/venuesSlice';

export function VenueDetails() {
  const { id } = useParams();
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  const { data: response, isLoading } = useGetVenueByIdQuery(id as string);

  const venue = response?.venue || response;

  const name = venue?.name || venue?.user?.name || 'Unknown Venue';
  const image = venue?.image || venue?.cover_image || venue?.user?.image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80';
  const location = venue?.city ? `${venue.city}, ${venue.state}` : (venue?.location || venue?.address || 'Location unknown');
  const about = venue?.description || 'No description available for this venue.';
  const capacityDisplay = venue?.capacity ? `${venue.capacity} Capacity` : 'Capacity not specified';
  const score = venue?.score ? `${(venue.score * 100).toFixed(0)}/100` : 'No rating';
  const website = venue?.website || '';

  const fullAddress = [
    venue?.address,
    venue?.city,
    venue?.state,
    venue?.postal_code,
    venue?.country
  ].filter(Boolean).join(', ');

  if (isLoading || !venue) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] text-white font-sans animate-pulse">
        <div className="relative w-full h-[300px] md:h-[450px] bg-white/5" />
        <div className="max-w-[1200px] mx-auto px-6 -mt-32 relative z-10 pb-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div className="flex-1 w-full">
              <div className="h-6 w-32 bg-white/10 rounded-full mb-6" />
              <div className="h-14 w-3/4 max-w-md bg-white/10 rounded-lg mb-4" />
              <div className="h-6 w-48 bg-white/10 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
            <div className="flex flex-col gap-12">
              <div className="h-10 w-32 bg-white/10 rounded-lg mb-8" />
              <div className="space-y-4">
                <div className="h-6 w-full bg-white/5 rounded" />
                <div className="h-6 w-full bg-white/5 rounded" />
                <div className="h-6 w-3/4 bg-white/5 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white  font-sans selection:bg-[#00A5E5]/30">
      {/* Top Image Section */}
      <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-transparent to-[#0b0b0f]/50" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 -mt-32 relative z-10 pb-24">
        {/* Header Profile Content */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <h1 className="text-5xl md:text-[56px] font-bold mb-4 tracking-tight leading-[1.1]">{name}</h1>
            <div className="flex items-center gap-6 text-[#A1A1AA] flex-wrap">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#A1A1AA]" />
                <span className="text-[18px] font-normal">{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#A1A1AA]" />
                <span className="text-[18px] font-normal">{capacityDisplay}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col gap-12">
            {/* About Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-[36px] text-white font-bold mb-8 tracking-tight">About Venue</h2>
              <div className="relative">
                <motion.div
                  animate={{ height: isAboutExpanded ? "auto" : "200px" }}
                  className="overflow-hidden relative transition-all duration-500 ease-in-out"
                >
                  <div className="text-[#A1A1AA] leading-[1.8] text-[18px] font-normal space-y-4">
                    {about.split('\n\n').map((para: string, i: number) => (
                      <p key={i}>{para}</p>
                    ))}

                    {fullAddress && (
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <h3 className="text-white font-medium mb-2">Location</h3>
                        <p className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-[#7C5CFF]" />
                          <span>{fullAddress}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {!isAboutExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0b0b0f] to-transparent pointer-events-none" />
                  )}
                </motion.div>

                <button
                  onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                  className="mt-6 text-white font-bold text-base border-b-2 border-white/10 hover:border-white transition-all pb-0.5 tracking-wide"
                >
                  {isAboutExpanded ? "Read less" : "Read more"}
                </button>
              </div>
            </motion.section>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="py-8 px-6 rounded-[16px] bg-[#121218] border border-white/5 hover:border-white/10 transition-all group cursor-default"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-5 h-5 text-[#A1A1AA] group-hover:text-[#7C5CFF] transition-colors" />
                  <p className="text-[#A1A1AA] text-base font-normal opacity-60">Venue Rating</p>
                </div>
                <p className="text-[20px] font-normal group-hover:text-[#7C5CFF] transition-colors">
                  {score}
                </p>
              </motion.div>

              {website && (
                <motion.a
                  href={website.startsWith('http') ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="py-8 px-6 rounded-[16px] bg-[#121218] border border-white/5 hover:border-white/10 transition-all group cursor-pointer block"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-5 h-5 text-[#A1A1AA] group-hover:text-[#7C5CFF] transition-colors" />
                    <p className="text-[#A1A1AA] text-base font-normal opacity-60">Website</p>
                  </div>
                  <p className="text-[20px] font-normal group-hover:text-[#7C5CFF] transition-colors truncate">
                    Visit Website
                  </p>
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
