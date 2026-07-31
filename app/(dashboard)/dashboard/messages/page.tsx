"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Paperclip,
  Send,
  MoreHorizontal,
  ArrowLeft,
  Users,
  MessageSquare,
  FileText,
  RefreshCw,
  Eye,
  Check,
  XCircle,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CommonHeader } from "@/components/dashboard/page-header";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  flow: "received" | "sent";
}

interface Conversation {
  id: string;
  artistName: string;
  agency: string;
  avatarChar: string;
  avatarBg: string;
  unreadCount: number;
  timeAgo: string;
  lastMessage: string;
  offerId: string;
  role: string;
  subject: string;
  messages: Message[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    artistName: "Sarah Chen",
    agency: "via WME Agency",
    avatarChar: "SC",
    avatarBg: "bg-purple-950/60 text-purple-400 border border-purple-900/30",
    unreadCount: 2,
    timeAgo: "2m",
    lastMessage: "Can we go to $45K flat? No splits.",
    offerId: "OFF-0042",
    role: "Agent",
    subject: "The Midnight",
    messages: [
      {
        id: "m1",
        sender: "Sarah Chen",
        content: "Hi Marcus — reaching out about The Midnight for August 14 at Brooklyn Steel.",
        timestamp: "Jul 10, 2:00 PM",
        flow: "received"
      },
      {
        id: "m2",
        sender: "Me",
        content: "Hey Sarah! Great timing, we've had them on our radar. What's the availability looking like?",
        timestamp: "Jul 10, 2:15 PM",
        flow: "sent"
      },
      {
        id: "m3",
        sender: "Sarah Chen",
        content: "They're open that week. We'd be looking at $48K minimum for that market.",
        timestamp: "Jul 10, 2:22 PM",
        flow: "received"
      },
      {
        id: "m4",
        sender: "Me",
        content: "That's a stretch for our ceiling on a Tuesday. Can we do $42K and look at a door split on the backend?",
        timestamp: "Jul 10, 2:45 PM",
        flow: "sent"
      },
      {
        id: "m5",
        sender: "Sarah Chen",
        content: "Can we go to $45K flat? No splits. They have a conflicting offer in Boston that week and I need to give them an answer by EOD tomorrow.",
        timestamp: "Jul 11, 9:14 AM",
        flow: "received"
      }
    ]
  },
  {
    id: "2",
    artistName: "Alex Torres",
    agency: "via WME Agency",
    avatarChar: "AT",
    avatarBg: "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30",
    unreadCount: 0,
    timeAgo: "1h",
    lastMessage: "Contract is ready for your review.",
    offerId: "OFF-0038",
    role: "Agent",
    subject: "Jungle",
    messages: [
      {
        id: "m1",
        sender: "Alex Torres",
        content: "Hey, just checking in to see if you had a chance to review the contract for Jungle.",
        timestamp: "Jul 10, 11:30 AM",
        flow: "received"
      },
      {
        id: "m2",
        sender: "Me",
        content: "Looking at it now. Will get back to you shortly.",
        timestamp: "Jul 10, 11:45 AM",
        flow: "sent"
      },
      {
        id: "m3",
        sender: "Alex Torres",
        content: "Contract is ready for your review.",
        timestamp: "Jul 10, 12:00 PM",
        flow: "received"
      }
    ]
  },
  {
    id: "3",
    artistName: "Priya Singh + 2",
    agency: "via CAA Agency",
    avatarChar: "PS",
    avatarBg: "bg-amber-950/60 text-amber-400 border border-amber-900/30",
    unreadCount: 1,
    timeAgo: "3h",
    lastMessage: "We need load-in by 4PM at latest.",
    offerId: "OFF-0031",
    role: "Agent",
    subject: "Chappell Roan",
    messages: [
      {
        id: "m1",
        sender: "Priya Singh",
        content: "Hi, wanted to coordinate the schedule for Chappell Roan.",
        timestamp: "Jul 10, 10:00 AM",
        flow: "received"
      },
      {
        id: "m2",
        sender: "Me",
        content: "Sounds good. What times are you thinking?",
        timestamp: "Jul 10, 10:15 AM",
        flow: "sent"
      },
      {
        id: "m3",
        sender: "Priya Singh",
        content: "We need load-in by 4PM at latest.",
        timestamp: "Jul 10, 11:00 AM",
        flow: "received"
      }
    ]
  },
  {
    id: "4",
    artistName: "Marcus Reid",
    agency: "via Red Light Management",
    avatarChar: "MR",
    avatarBg: "bg-rose-950/60 text-rose-400 border border-rose-900/30",
    unreadCount: 0,
    timeAgo: "1d",
    lastMessage: "Looking forward to working together!",
    offerId: "OFF-0028",
    role: "Manager",
    subject: "Waxahatchee",
    messages: [
      {
        id: "m1",
        sender: "Marcus Reid",
        content: "Hey! Let's check details about the show next week. Looking forward to working together!",
        timestamp: "Jul 9, 4:00 PM",
        flow: "received"
      }
    ]
  },
  {
    id: "5",
    artistName: "Jordan Lee",
    agency: "via High Road Touring",
    avatarChar: "JL",
    avatarBg: "bg-cyan-950/60 text-cyan-400 border border-cyan-900/30",
    unreadCount: 0,
    timeAgo: "2d",
    lastMessage: "Stage plot confirmed. See you Friday.",
    offerId: "OFF-0024",
    role: "Agent",
    subject: "Men I Trust",
    messages: [
      {
        id: "m1",
        sender: "Jordan Lee",
        content: "Stage plot confirmed. See you Friday.",
        timestamp: "Jul 8, 2:00 PM",
        flow: "received"
      }
    ]
  }
];

const OFFERS_DATA: Record<string, {
  offerId: string;
  artistName: string;
  avatarChar: string;
  avatarBg: string;
  date: string;
  venue: string;
  stage: string;
  price: string;
  priceType: string;
  status: string;
}> = {
  "1": {
    offerId: "OFF-0042",
    artistName: "The Midnight",
    avatarChar: "T",
    avatarBg: "bg-[#0A1C2A] text-[#00AEF0] border border-[#00AEF0]/15",
    date: "Aug 14, 2026",
    venue: "Brooklyn Steel",
    stage: "Main Stage",
    price: "$45,000",
    priceType: "Flat Fee",
    status: "Negotiating",
  },
  "2": {
    offerId: "OFF-0038",
    artistName: "Jungle",
    avatarChar: "J",
    avatarBg: "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30",
    date: "Aug 22, 2026",
    venue: "Brooklyn Steel",
    stage: "Main Stage",
    price: "$55,000",
    priceType: "Flat Fee",
    status: "Contract Ready",
  },
  "3": {
    offerId: "OFF-0031",
    artistName: "Chappell Roan",
    avatarChar: "C",
    avatarBg: "bg-amber-950/60 text-amber-400 border border-amber-900/30",
    date: "Sep 05, 2026",
    venue: "Brooklyn Steel",
    stage: "Main Stage",
    price: "$60,000",
    priceType: "Flat Fee",
    status: "Negotiating",
  },
  "4": {
    offerId: "OFF-0028",
    artistName: "Waxahatchee",
    avatarChar: "W",
    avatarBg: "bg-rose-950/60 text-rose-400 border border-rose-900/30",
    date: "Sep 12, 2026",
    venue: "Brooklyn Steel",
    stage: "Main Stage",
    price: "$28,000",
    priceType: "Flat Fee",
    status: "Negotiating",
  },
  "5": {
    offerId: "OFF-0024",
    artistName: "Men I Trust",
    avatarChar: "M",
    avatarBg: "bg-cyan-950/60 text-cyan-400 border border-cyan-900/30",
    date: "Sep 18, 2026",
    venue: "Brooklyn Steel",
    stage: "Main Stage",
    price: "$35,000",
    priceType: "Flat Fee",
    status: "Negotiating",
  },
};

export default function MessagesDashboardPage() {
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string>("1");
  const [conversationsSearchQuery, setConversationsSearchQuery] = useState("");
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [offerExpanded, setOfferExpanded] = useState(false);

  // Collapse offer card by default when switching conversations
  useEffect(() => {
    setOfferExpanded(false);
  }, [selectedId]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active conversation details
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedId) || null;
  }, [conversations, selectedId]);

  // Mark selected conversation as read
  useEffect(() => {
    if (selectedId) {
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedId ? { ...c, unreadCount: 0 } : c))
      );
    }
  }, [selectedId]);

  // Scroll to bottom of message list on updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, showMobileChat]);

  // Search filtering logic for left conversation pane
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const query = conversationsSearchQuery.toLowerCase();
      return (
        c.artistName.toLowerCase().includes(query) ||
        c.agency.toLowerCase().includes(query) ||
        c.subject.toLowerCase().includes(query) ||
        c.lastMessage.toLowerCase().includes(query)
      );
    });
  }, [conversations, conversationsSearchQuery]);

  const handleNotificationsClick = () => {
    window.dispatchEvent(new CustomEvent("open-notifications"));
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !activeConversation) return;

    const newMessage: Message = {
      id: `m-new-${Date.now()}`,
      sender: "Me",
      content: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      flow: "sent"
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            lastMessage: newMessage.content,
            timeAgo: "Just now",
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );

    setInputMessage("");
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`Attached file: ${file.name}`);
    }
  };

  return (
    <div className="h-[calc(100vh-68px)] lg:h-screen flex flex-col bg-[#050505] text-white overflow-hidden font-sans relative">

      {/* Top Header Row (All devices, responsive matches design system) */}
      <header className="w-full px-4 md:px-8 lg:px-10 pt-4 md:pt-8 lg:pt-10 pb-5 border-b border-zinc-900/60 bg-[#050505] shrink-0">
        <CommonHeader
          title="Messages"
          subtitle="Chat and coordinate booking details with artists and managers"
          searchQuery={globalSearchQuery}
          onSearchChange={setGlobalSearchQuery}
        // actionButton={
        //   <button
        //     onClick={() => router.push("/dashboard/offers/create")}
        //     className="h-11 px-5 rounded-[12px] bg-[#00AEF0] hover:bg-[#009bde] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-cyan-500/10 hover:scale-[1.01] active:scale-[0.99] shrink-0 w-full sm:w-auto"
        //   >
        //     Update Availability
        //   </button>
        // }
        />
      </header>

      {/* Main Messaging Area */}
      <div className="flex-1 flex overflow-hidden w-full relative">

        {/* Left Side: Conversation List */}
        <div className={`
          ${showMobileChat ? "hidden" : "flex"} 
          lg:flex flex-col w-full lg:w-[380px] xl:w-[400px] border-r border-zinc-900 bg-[#050505] shrink-0
        `}>



          {/* Conversations Search */}
          <div className="p-4 border-b border-zinc-900/60">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={conversationsSearchQuery}
                onChange={(e) => setConversationsSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-full bg-[#121214] border border-zinc-800 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-zinc-700 transition-colors font-sans"
              />
            </div>
          </div>

          {/* List Wrapper */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-zinc-500 text-sm mt-10">
                <p>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isActive = c.id === selectedId;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedId(c.id);
                      setShowMobileChat(true);
                    }}
                    className={`
                      p-4 flex gap-3 border-b border-zinc-950/60 cursor-pointer select-none transition-all duration-150
                      ${isActive ? "bg-white/[0.03] border-l-2 border-l-[#00A5E5]" : "hover:bg-white/[0.01] border-l-2 border-l-transparent"}
                    `}
                  >
                    {/* Avatar Group */}
                    <div className="relative shrink-0">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm ${c.avatarBg}`}>
                        {c.avatarChar}
                      </div>
                      {c.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00A5E5] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-[#050505]">
                          {c.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Metadata & Message Preview */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="font-bold text-sm text-white truncate leading-snug">
                          {c.artistName}
                        </span>
                        <span className="text-[10px] text-zinc-500 shrink-0 font-mono">
                          {c.timeAgo}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-450 truncate mt-0.5 leading-snug">
                        {c.lastMessage}
                      </p>

                      <div className="text-[10px] text-[#00A5E5]/90 font-medium font-mono mt-1 flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-sky-950/30 border border-sky-900/20">
                          {c.offerId}
                        </span>
                        <span>•</span>
                        <span className="truncate">{c.subject}</span>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Side: Active Chat Window */}
        <div className={`
          ${showMobileChat ? "flex" : "hidden"} 
          lg:flex flex-col flex-1 bg-[#050505] overflow-hidden relative
        `}>
          {activeConversation ? (
            <>
              {/* Active Conversation Header */}
              <div className="h-16 border-b border-zinc-900/60 px-6 flex items-center justify-between shrink-0 bg-[#050505]/95 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="p-1 text-zinc-400 hover:text-white lg:hidden transition-colors cursor-pointer mr-1"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${activeConversation.avatarBg}`}>
                    {activeConversation.avatarChar}
                  </div>

                  <div className="min-w-0">
                    <span className="font-bold text-sm text-white block truncate leading-none">
                      {activeConversation.artistName}
                    </span>
                    <span className="text-[10px] text-zinc-500 block mt-1 leading-none truncate">
                      {activeConversation.role} · {activeConversation.agency.replace("via ", "")} · {activeConversation.offerId} · {activeConversation.subject}
                    </span>
                  </div>
                </div>

                <div>
                  <button className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-zinc-900 cursor-pointer">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Stream */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-[#050505]">
                {activeConversation.messages.map((m) => {
                  const isMe = m.flow === "sent";
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col max-w-[80%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
                    >
                      {/* Name Label for received messages */}
                      {!isMe && (
                        <span className="text-[10px] text-[#B084F4] font-bold font-sans mb-1.5 pl-1">
                          {m.sender}
                        </span>
                      )}

                      {/* Bubble */}
                      <div
                        className={`
                          px-4 py-3 rounded-[16px] text-sm leading-relaxed font-sans
                          ${isMe
                            ? "bg-[#00A5E5] text-white rounded-tr-none shadow-md shadow-cyan-950/20"
                            : "bg-white/[0.04] border border-white/5 text-white rounded-tl-none"
                          }
                        `}
                      >
                        {m.content}
                      </div>

                      {/* Timestamp */}
                      <span className="text-[9px] text-zinc-550 font-mono mt-1.5 px-1">
                        {m.timestamp}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Attached Offer Card */}
              {OFFERS_DATA[activeConversation.id] && (
                <div className="bg-[#00A5E5]/[0.05] border-[1.24px] border-[#00A5E5]/[0.18] mx-6 mb-4 p-4 rounded-[20px] flex flex-col gap-3 relative shrink-0">
                  {/* Banner Row */}
                  <div
                    onClick={() => setOfferExpanded(!offerExpanded)}
                    className={`flex justify-between items-center cursor-pointer select-none transition-all hover:bg-white/[0.01] -m-4 p-4 rounded-[20px] ${offerExpanded ? "border-b border-white/[0.06] rounded-b-none pb-3" : ""
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#00AEF0]" />
                      <span className="text-[10px] font-bold text-[#00AEF0] tracking-wider uppercase">Offer Attached</span>
                      <span className="text-[10px] font-mono text-zinc-500 bg-white/[0.04] px-2 py-0.5 rounded-full">{OFFERS_DATA[activeConversation.id].offerId}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#A855F7]/10 text-[#C084FC] border border-[#C084FC]/15 flex items-center gap-1">
                        <RefreshCw className="h-3 w-3 animate-spin-slow" />
                        {OFFERS_DATA[activeConversation.id].status}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${offerExpanded ? "rotate-180" : ""
                          }`}
                      />
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {offerExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden flex flex-col gap-3"
                        transition={{ duration: 0.15, ease: "easeInOut" }}
                      >
                        {/* Content Row */}
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#0C1E2B] border border-[#00AEF0]/15 flex items-center justify-center font-bold text-sm text-[#00AEF0] shrink-0">
                              {OFFERS_DATA[activeConversation.id].avatarChar}
                            </div>
                            <div>
                              <span className="font-bold text-sm text-white block">{OFFERS_DATA[activeConversation.id].artistName}</span>
                              <span className="text-[11px] text-zinc-400 block mt-0.5">{OFFERS_DATA[activeConversation.id].date} · {OFFERS_DATA[activeConversation.id].venue} · {OFFERS_DATA[activeConversation.id].stage}</span>
                            </div>
                          </div>

                          <div className="xs:text-right shrink-0">
                            <span className="font-bold text-base text-white block">{OFFERS_DATA[activeConversation.id].price}</span>
                            <span className="text-[10px] text-zinc-500 block mt-0.5">{OFFERS_DATA[activeConversation.id].priceType}</span>
                          </div>
                        </div>

                        {/* Buttons Row */}
                        <div className="flex flex-wrap items-center gap-2 w-full mt-1">
                          <button className="h-9 px-4 rounded-xl bg-[#121214] border border-zinc-800 hover:bg-zinc-800/60 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 flex-1 xs:flex-initial">
                            <Eye className="h-3.5 w-3.5" />
                            <span>Preview</span>
                          </button>
                          <button className="h-9 px-4 rounded-xl bg-[#0F291E] border border-[#22C55E]/15 hover:bg-[#153e2a] text-xs font-semibold text-[#4ADE80] hover:text-green-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5 flex-1 xs:flex-initial">
                            <Check className="h-3.5 w-3.5" />
                            <span>Accept Offer</span>
                          </button>
                          <button className="h-9 px-4 rounded-xl bg-[#2A1215] border border-[#EF4444]/15 hover:bg-[#3d1a1e] text-xs font-semibold text-[#F87171] hover:text-red-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5 flex-1 xs:flex-initial">
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}


              {/* Chat Bottom Input Container */}
              <div className="p-4 border-t border-zinc-900/60 bg-[#050505]">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-3 bg-[#0c0c0e] border border-zinc-800/80 rounded-2xl p-2 pl-3 pr-2 focus-within:border-zinc-700 transition-colors"
                >
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Attachment Button */}
                  <button
                    type="button"
                    onClick={handleAttachmentClick}
                    className="p-1.5 text-zinc-500 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/[0.03]"
                  >
                    <Paperclip className="h-4.5 w-4.5" />
                  </button>

                  {/* Create Offer Button */}
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/offers/create")}
                    className="h-9 px-3 sm:px-4 rounded-[10px] bg-[#00AEF0] hover:bg-[#009bde] text-white font-bold text-[10px] sm:text-xs shrink-0 cursor-pointer transition-all shadow-sm shadow-cyan-500/10 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Create Offer
                  </button>

                  {/* Message input field */}
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-0 text-sm text-white placeholder-zinc-550 focus:outline-none focus:ring-0 px-2 min-w-0"
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className={`
                      w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer
                      ${inputMessage.trim()
                        ? "bg-[#00AEF0] text-white shadow-sm"
                        : "bg-zinc-900 text-zinc-600 border border-zinc-850"
                      }
                    `}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-8">
              <MessageSquare className="h-12 w-12 text-zinc-700 mb-3" />
              <p className="text-sm">Select a conversation to start messaging</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
