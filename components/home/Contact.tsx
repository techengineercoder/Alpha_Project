"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Phone, User, Send } from 'lucide-react';

export function Contact() {
  const [activeRole, setActiveRole] = useState('Artist');

  const roles = ['Artist', 'Agent', 'Venue', 'Buyer'];

  return (
    <section className="relative w-full py-24 bg-[#0B0B0F] overflow-hidden flex flex-col">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-20 w-full">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-[44px] font-bold text-white mb-4 tracking-tight leading-tight"
          >
            Have Questions?<br />Let's Chat.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#A1A1AA] text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
          >
            Connecting talent and opportunities across borders -<br className="hidden md:block" />wherever you are, GetAvails is there.
          </motion.p>
        </div>
      </div>

      <div className="relative w-full">
        {/* Map Background */}
        <div
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: "url('/map.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Subtle overlay to ensure readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0B0B0F] via-transparent to-[#0B0B0F] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start py-8 md:py-12">

            {/* Left Column: Contact Cards */}
            <div className="lg:col-span-5 flex flex-col gap-6">

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-[#16161D] border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-white mb-2">General Inquiries</h3>
                <p className="text-[#A1A1AA] text-[15px] mb-8 leading-relaxed max-w-[280px]">
                  For platform questions, partnerships, and media.
                </p>
                <div className="flex items-center gap-3 text-white">
                  <Mail className="w-5 h-5 text-white" />
                  <span className="font-medium">support@getavails.com</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-[#16161D] border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-white mb-2">Support</h3>
                <p className="text-[#A1A1AA] text-[15px] mb-8 leading-relaxed max-w-[280px]">
                  Get instant help from our support specialists.
                </p>
                <div className="flex items-center gap-3 text-white">
                  <MessageCircle className="w-5 h-5 text-white" />
                  <span className="font-medium">Available 9 AM – 9 PM</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-[#16161D] border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-white mb-2">For Business</h3>
                <p className="text-[#A1A1AA] text-[15px] mb-8 leading-relaxed max-w-[280px]">
                  For sponsorships, collaborations, and enterprise bookings.
                </p>
                <div className="flex items-center gap-3 text-white">
                  <Phone className="w-5 h-5 text-white" />
                  <span className="font-medium">Call Us: +1 (XXX) XXX-XXXX</span>
                </div>
              </motion.div>

            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-[#121218] border border-white/5 rounded-[24px] p-6 md:p-10 shadow-2xl"
              >
                <h3 className="text-xl font-bold text-white mb-8">Contact Us</h3>

                {/* Form Content */}
                <div className="space-y-8">

                  {/* Role Selection */}
                  <div>
                    <p className="text-xs text-white font-medium mb-3">My role is:</p>
                    <div className="flex flex-wrap gap-3">
                      {roles.map(role => (
                        <button
                          key={role}
                          onClick={() => setActiveRole(role)}
                          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeRole === role
                              ? 'bg-[#00A5E5] text-white border border-[#00A5E5]'
                              : 'bg-transparent text-[#A1A1AA] border border-white/20 hover:border-white/40'
                            }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div>
                    <p className="text-xs text-white font-medium mb-4">Contact Information</p>

                    <div className="space-y-5">
                      {/* Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-[#A1A1AA] ml-1">Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="w-4 h-4 text-[#A1A1AA]" />
                          </div>
                          <input
                            type="text"
                            placeholder="Kirito Kazuto"
                            className="w-full bg-[#1A1A22] border border-transparent focus:border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-[#71717A] outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Email and Phone */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] text-[#A1A1AA] ml-1">Email</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Mail className="w-4 h-4 text-[#A1A1AA]" />
                            </div>
                            <input
                              type="email"
                              placeholder="kiritothxs@gmail.com"
                              className="w-full bg-[#1A1A22] border border-transparent focus:border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-[#71717A] outline-none transition-all"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] text-[#A1A1AA] ml-1">Phone (Optional)</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Phone className="w-4 h-4 text-[#A1A1AA]" />
                            </div>
                            <input
                              type="tel"
                              placeholder="+123456789"
                              className="w-full bg-[#1A1A22] border border-transparent focus:border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-[#71717A] outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-[#A1A1AA] ml-1">Your message</label>
                        <textarea
                          rows={5}
                          placeholder="write your message..."
                          className="w-full bg-[#1A1A22] border border-transparent focus:border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-[#71717A] outline-none transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button className="w-full py-3.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-white text-sm font-medium transition-colors">
                      Cancel
                    </button>
                    <button className="w-full py-3.5 rounded-xl bg-[#00A5E5] hover:bg-[#0090C9] text-white text-sm font-bold transition-colors shadow-lg shadow-[#00A5E5]/20">
                      Send
                    </button>
                  </div>

                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
