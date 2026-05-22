"use client";

import { motion } from "framer-motion";
import {
  Lock,
  Bell,
  Camera,
  Settings as SettingsIcon,
  MapPin,
  Mail,
  Music,
  Save,
  ShieldCheck
} from "lucide-react";

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6  pb-20">
      {/* Page Header - Matching image exactly */}
      <div className="mb-8 px-4 md:px-0">
        <h1 className="text-[32px] font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-gray-400 font-medium">Manage your personal information and account security</p>
      </div>

      <div className="space-y-6">
        {/* Section 1: General Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111116] border border-white/5 rounded-[24px] p-8 shadow-2xl relative"
        >
          {/* Top Right Action */}
          <button className="absolute top-8 right-8 p-3 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all">
            <SettingsIcon size={20} />
          </button>

          {/* Profile Identity */}
          <div className="flex flex-col md:flex-row items-start gap-8 mb-10">
            <div className="relative">
              <div className="w-24 h-24 rounded-[28px] overflow-hidden border-2 border-[#7C5CFF]/30">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 p-2 bg-[#7C5CFF] text-white rounded-lg border-2 border-[#111116]">
                <Camera size={14} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Justin Bieber</h3>
              <p className="text-gray-400 font-medium">Electronic / House DJ</p>
              <p className="text-sm text-gray-500 max-w-lg leading-relaxed">
                Professional DJ with 10+ years of experience performing at clubs, festivals, and private events.
              </p>
            </div>
          </div>

          {/* Input Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Artist Name</label>
              <input
                type="text"
                defaultValue="Jordan Rivers"
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-medium focus:outline-none focus:border-[#7C5CFF]/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Genre</label>
              <input
                type="text"
                defaultValue="Electronic / House DJ"
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-medium focus:outline-none focus:border-[#7C5CFF]/50 transition-all"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Bio</label>
              <textarea
                rows={4}
                defaultValue="Bio"
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-medium focus:outline-none focus:border-[#7C5CFF]/50 transition-all resize-none"
              ></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Location</label>
              <input
                type="text"
                defaultValue="Los Angeles, CA"
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-medium focus:outline-none focus:border-[#7C5CFF]/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
              <input
                type="email"
                defaultValue="jordan@example.com"
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-medium focus:outline-none focus:border-[#7C5CFF]/50 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button className="px-10 py-3 rounded-2xl bg-[#7C5CFF] text-white font-bold hover:bg-[#6A4BE5] transition-all shadow-[0_0_20px_rgba(124,92,255,0.2)] animate-shine animate-pulse-glow">
              Save Changes
            </button>
          </div>
        </motion.div>

        {/* Section 2: Change Password Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:w-2/3 bg-[#111116] border border-white/5 rounded-[24px] p-8 shadow-2xl space-y-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#7C5CFF]/10 flex items-center justify-center text-[#7C5CFF] border border-[#7C5CFF]/20">
              <Lock size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Change Password</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
              <input
                type="password"
                placeholder="********"
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-medium focus:outline-none focus:border-[#7C5CFF]/50 transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-medium focus:outline-none focus:border-[#7C5CFF]/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-medium focus:outline-none focus:border-[#7C5CFF]/50 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2.5 px-8 py-3 rounded-2xl bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 text-[#7C5CFF] font-bold hover:bg-[#7C5CFF] hover:text-white transition-all animate-shine">
              <ShieldCheck size={18} />
              Update Password
            </button>
          </div>
        </motion.div>

        {/* Section 3: Notifications Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:w-2/3 bg-[#111116] border border-white/5 rounded-[24px] p-8 shadow-2xl space-y-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
              <Bell size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Notifications</h2>
          </div>

          <div className="space-y-3">
            {[
              { title: "New Booking Requests", desc: "Get notified when a new booking request arrives" },
              { title: "Offer Responses", desc: "Get notified when an artist responds to an offer" },
              { title: "Email Delivery Updates", desc: "Get notified about email delivery status" },
            ].map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-200">{item.title}</h4>
                  <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={idx !== 2} />
                  <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C5CFF]"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2.5 px-8 py-3 rounded-2xl bg-[#7C5CFF] text-white font-bold hover:bg-[#6A4BE5] transition-all">
              <Save size={18} />
              Save Preferences
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
