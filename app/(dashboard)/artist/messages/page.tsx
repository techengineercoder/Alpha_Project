"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MoreVertical,
  Image as ImageIcon,
  Paperclip,
  Send,
  Plus
} from "lucide-react";

const conversations = [
  {
    id: 1,
    name: "Taylor Swift",
    lastMessage: "Sounds great! Looking forward to it",
    time: "2:30 PM",
    unread: 0,
    online: true,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Sarah Vocal",
    lastMessage: "Thank you for booking! Let me know if",
    time: "Yesterday",
    unread: 2,
    online: false,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "The Soundwav",
    lastMessage: "I can definitely work with that budget",
    time: "Monday",
    unread: 0,
    online: false,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
];

const messages = [
  { id: 1, text: "Hi! Thanks for reaching out. I'd love to discuss your event", time: "2:15 PM", sender: "other" },
  { id: 2, text: "Great! We're planning a corporate event for June 15th", time: "2:18 PM", sender: "me" },
  { id: 3, text: "Perfect, I'm available that date. What's the expected guest count?", time: "2:20 PM", sender: "other" },
  { id: 4, text: "Around 300 people. It's a product launch event", time: "2:25 PM", sender: "me" },
  { id: 5, text: "Sounds great! Looking forward to it", time: "2:30 PM", sender: "other" },
];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState(1);
  const [inputText, setInputText] = useState("");

  const activeConv = conversations.find(c => c.id === activeTab);

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[600px] gap-8">
      {/* Header Info */}
      <div className="flex-shrink-0">
        <h1 className="text-[32px] font-bold text-white mb-2">Messages</h1>
        <p className="text-gray-400 font-medium">Chat with venue managers and organizers</p>
      </div>

      <div className="flex flex-1 gap-8 overflow-hidden">
        {/* Sidebar - Figma Precise Width 302px */}
        <div className="hidden md:flex w-[302px] flex-col bg-[#111116] border border-white/5 rounded-[32px] overflow-hidden flex-shrink-0">
          <div className="p-8 space-y-8">
            <h2 className="text-2xl font-bold text-white">Messages</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-12 pr-6 py-3.5 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white focus:outline-none focus:border-[#7C5CFF]/50 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveTab(conv.id)}
                className={`w-full flex items-start gap-4 p-5 rounded-[24px] transition-all relative group
                  ${activeTab === conv.id ? "bg-[#00A5E5]/10" : "hover:bg-white/[0.02]"}
                `}
              >
                {activeTab === conv.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#00A5E5] rounded-r-full" />
                )}

                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#7C5CFF]/30 transition-all">
                    <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
                  </div>
                  {conv.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] rounded-full border-2 border-[#111116]" />
                  )}
                </div>

                <div className="flex-1 text-left space-y-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-base truncate">{conv.name}</span>
                    <span className="text-[11px] text-gray-500 font-medium">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-gray-500 truncate font-medium">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 bg-[#00A5E5] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(124,92,255,0.3)]">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="hidden md:flex flex-1 flex-col bg-[#111116] border border-white/5 rounded-[32px] overflow-hidden relative">
          {/* Chat Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10">
                  <img src={activeConv?.avatar} alt={activeConv?.name} className="w-full h-full object-cover" />
                </div>
                {activeConv?.online && (
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#10B981] rounded-full border-2 border-[#111116]" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{activeConv?.name}</h3>
                <span className="text-xs text-[#10B981] font-bold uppercase tracking-wider">Online</span>
              </div>
            </div>
            <button className="p-2.5 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all">
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} max-w-[80%] ${msg.sender === 'me' ? 'ml-auto' : 'mr-auto'}`}
              >
                <div className={`p-5 rounded-[24px] text-sm font-medium leading-relaxed
                  ${msg.sender === 'me'
                    ? 'bg-[#00A5E5] text-white rounded-tr-none shadow-[0_0_20px_rgba(124,92,255,0.1)]'
                    : 'bg-white/[0.03] text-gray-200 rounded-tl-none border border-white/5'}
                `}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2 px-1">
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* Chat Footer */}
          <div className="p-8 border-t border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button className="p-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                  <ImageIcon size={20} />
                </button>
                <button className="p-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                  <Paperclip size={20} />
                </button>
              </div>

              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full pl-6 pr-14 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white focus:outline-none focus:border-[#7C5CFF]/50 transition-all placeholder:text-gray-600"
                />
                <button className="absolute right-2 p-3 rounded-xl bg-[#00A5E5] text-white  transition-all shadow-[0_0_15px_rgba(124,92,255,0.2)]">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
