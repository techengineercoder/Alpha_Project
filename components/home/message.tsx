
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useChatMutation } from "@/redux/feature/n8n/chatBotApi";
import { Send, X, Minimize2, Maximize2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
    id: number;
    text: string;
    isUser: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function markdownToHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/`([^`]+)`/g, "<code class='chat-code'>$1</code>")
        .replace(/^[-*]\s+(.+)$/gm, "<li>$1</li>")
        .replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>")
        .replace(/(<li>.*<\/li>(\n|$))+/g, (match) => `<ul class='chat-list'>${match}</ul>`)
        .replace(/\n\n/g, "<br/><br/>")
        .replace(/\n/g, "<br/>");
}

// ─── Auth paths ───────────────────────────────────────────────────────────────

const AUTH_PATHS = new Set([
    "/auth/create-pass",
    "/auth/forgot-otp",
    "/auth/forgot-pass",
    "/auth/signup",
    "/auth/login",
    "/auth/verify-email",
]);

// ─── Default suggested questions ─────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
    "How do I book an artist?",
    "What venues are available near me?",
    "How does pricing work?",
    "Can I cancel a booking?",
    "How do I list my venue?",
];

// ─── Initial messages ─────────────────────────────────────────────────────────

const INITIAL_MESSAGES: Message[] = [
    {
        id: 1,
        text: "Hello! I'm your AI assistant. How can I help you today?",
        isUser: false,
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChatWidget() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [newMessage, setNewMessage] = useState("");
    // Track whether user has sent any message yet (to show/hide suggestions)
    const [hasSentMessage, setHasSentMessage] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [askAssistantQuestion, { isLoading: isAsking }] = useChatMutation();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isAsking]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, isMinimized]);

    if (AUTH_PATHS.has(pathname)) return null;

    // ── Handlers ──────────────────────────────────────────────────────────────

    const openChat = useCallback(() => {
        const uid = generateUID();
        setSessionId(uid);
        setMessages(INITIAL_MESSAGES);
        setHasSentMessage(false);
        setIsOpen(true);
        setIsMinimized(false);
    }, []);

    const closeChat = useCallback(() => {
        setIsOpen(false);
        setSessionId(null);
        setMessages(INITIAL_MESSAGES);
        setHasSentMessage(false);
        setNewMessage("");
    }, []);

    const toggleMinimize = useCallback(() => {
        setIsMinimized((prev) => !prev);
    }, []);

    const sendText = useCallback(async (text: string) => {
        if (!text.trim() || isAsking || !sessionId) return;

        setHasSentMessage(true);

        const userMessage: Message = {
            id: Date.now(),
            text: text.trim(),
            isUser: true,
        };

        setMessages((prev) => [...prev, userMessage]);
        setNewMessage("");

        try {
            const response = await askAssistantQuestion({
                action: "sendMessage",
                sessionId,
                chatInput: userMessage.text,
            }).unwrap();

            const botMessage: Message = {
                id: Date.now() + 1,
                text: response.output || response.content || "Sorry, I couldn't process that.",
                isUser: false,
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error: any) {
            const errorText =
                error?.data?.message ||
                error?.message ||
                "Sorry, something went wrong. Please try again.";

            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, text: errorText, isUser: false },
            ]);
        }
    }, [isAsking, sessionId, askAssistantQuestion]);

    const handleSendMessage = useCallback(() => {
        sendText(newMessage);
    }, [newMessage, sendText]);

    const handleSuggestedQuestion = useCallback((question: string) => {
        sendText(question);
    }, [sendText]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        },
        [handleSendMessage]
    );

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <>
            <style>{`
        .chat-list { padding-left: 1.2rem; margin: 0.25rem 0; list-style-type: disc; }
        .chat-list li { margin: 0.2rem 0; }
        .chat-code { background: rgba(255,255,255,0.15); border-radius: 4px; padding: 1px 5px; font-family: monospace; font-size: 0.85em; }
        .chat-shimmer {
          background: linear-gradient(90deg, rgba(124,92,255,0.12) 25%, rgba(124,92,255,0.28) 50%, rgba(124,92,255,0.12) 75%);
          background-size: 200% 100%;
          animation: shimmerSlide 1.5s infinite ease-in-out;
        }
        @keyframes shimmerSlide {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .chat-window-enter { animation: chatWindowIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        @keyframes chatWindowIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .suggestion-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 13px;
          border-radius: 100px;
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          background: rgba(124,92,255,0.1);
          border: 1px solid rgba(124,92,255,0.25);
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          text-align: left;
          line-height: 1.4;
        }
        .suggestion-btn:hover {
          background: rgba(124,92,255,0.22);
          border-color: rgba(124,92,255,0.5);
          color: #fff;
          transform: translateY(-1px);
        }
        .suggestion-btn:active { transform: scale(0.97); }
        .suggestions-enter { animation: suggestIn 0.3s ease forwards; }
        @keyframes suggestIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .suggestions-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          padding: 4px 0 8px;
        }
      `}</style>

            {/* ── FAB ── */}
            {!isOpen && (
                <button
                    onClick={openChat}
                    className="fixed bottom-6 right-6 z-[999] text-white rounded-full transition-all hover:scale-110 cursor-pointer"
                    aria-label="Open AI Assistant"
                >
                    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_d_580_256)">
                            <rect x="15" y="5" width="80" height="80" rx="40" fill="#00A5E5" />
                            <path d="M73.1815 38.6365C73.1815 32.1095 67.8903 26.8184 61.3633 26.8184C57.5763 26.8184 54.2053 28.6044 52.0424 31.3769C61.2671 31.7336 68.6361 39.3245 68.6361 48.6365C68.6361 48.8371 68.6326 49.0369 68.6259 49.2358L69.23 49.3974C70.9869 49.8675 72.5943 48.2601 72.1242 46.5032L71.8926 45.6377C71.7056 44.9385 71.818 44.1998 72.1187 43.5415C72.8012 42.0474 73.1815 40.3864 73.1815 38.6365Z" fill="white" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M65.9088 48.6365C65.9088 56.6698 59.3966 63.182 51.3633 63.182C49.117 63.182 46.9895 62.6728 45.0902 61.7634C44.4373 61.4509 43.6977 61.3412 42.9986 61.5283L40.7694 62.1247C39.0124 62.5948 37.4051 60.9874 37.8752 59.2305L38.4716 57.0013C38.6587 56.3021 38.549 55.5625 38.2364 54.9097C37.3271 53.0104 36.8179 50.8829 36.8179 48.6365C36.8179 40.6033 43.3301 34.0911 51.3633 34.0911C59.3966 34.0911 65.9088 40.6033 65.9088 48.6365ZM44.9997 50.4547C46.0038 50.4547 46.8179 49.6407 46.8179 48.6365C46.8179 47.6324 46.0038 46.8184 44.9997 46.8184C43.9955 46.8184 43.1815 47.6324 43.1815 48.6365C43.1815 49.6407 43.9955 50.4547 44.9997 50.4547ZM51.3633 50.4547C52.3675 50.4547 53.1815 49.6407 53.1815 48.6365C53.1815 47.6324 52.3675 46.8184 51.3633 46.8184C50.3592 46.8184 49.5451 47.6324 49.5451 48.6365C49.5451 49.6407 50.3592 50.4547 51.3633 50.4547ZM57.727 50.4547C58.7311 50.4547 59.5451 49.6407 59.5451 48.6365C59.5451 47.6324 58.7311 46.8184 57.727 46.8184C56.7228 46.8184 55.9088 47.6324 55.9088 48.6365C55.9088 49.6407 56.7228 50.4547 57.727 50.4547Z" fill="white" />
                        </g>
                        <defs>
                            <filter id="filter0_d_580_256" x="-1" y="-11" width="112" height="121" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="10" />
                                <feGaussianBlur stdDeviation="7.5" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.391667 0 0 0 0 0.169396 0 0 0 0 0.0212153 0 0 0 0.18 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_580_256" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_580_256" result="shape" />
                            </filter>
                        </defs>
                    </svg>
                </button>
            )}

            {/* ── Chat Window ── */}
            {isOpen && (
                <div
                    className="fixed bottom-6 right-0 lg:right-6 z-[999] w-full max-w-[400px] rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.45)] bg-[#0F0F17] border border-white/[0.06] flex flex-col chat-window-enter"
                    style={{ height: isMinimized ? "auto" : "580px" }}
                >
                    {/* ── Header ── */}
                    <div className="relative flex items-center justify-between px-4 py-3 bg-[#00A5E5] flex-shrink-0">
                        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

                        <div className="flex items-center gap-3 relative">
                            <div className="relative">
                                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
                                    <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M14 2C7.373 2 2 7.149 2 13.5c0 2.38.72 4.596 1.953 6.43L2.05 24.694A.75.75 0 002.9 25.6l5.317-1.707A12.02 12.02 0 0014 25c6.627 0 12-5.149 12-11.5S20.627 2 14 2z" fill="white" />
                                        <circle cx="9.5" cy="13.5" r="1.5" fill="#8B6BF5" />
                                        <circle cx="14" cy="13.5" r="1.5" fill="#8B6BF5" />
                                        <circle cx="18.5" cy="13.5" r="1.5" fill="#8B6BF5" />
                                    </svg>
                                </div>
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#00A5E5]" />
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm leading-none mb-0.5">AI Assistant</p>
                                <p className="text-white/70 text-[11px] flex items-center gap-1">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    Online · responds instantly
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 relative">
                            <button onClick={toggleMinimize} aria-label={isMinimized ? "Expand" : "Minimize"} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors">
                                {isMinimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
                            </button>
                            <button onClick={closeChat} aria-label="Close chat" className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors">
                                <X size={15} />
                            </button>
                        </div>
                    </div>

                    {/* ── Body ── */}
                    {!isMinimized && (
                        <>
                            {/* {sessionId && (
                                <div className="px-4 py-1.5 bg-[#0F0F17] border-b border-white/[0.04] flex-shrink-0">
                                    <p className="text-[10px] text-white/25 font-mono truncate">Session: {sessionId}</p>
                                </div>
                            )} */}

                            {/* ── Messages ── */}
                            <div
                                className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
                                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(124,92,255,0.3) transparent" }}
                            >
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex gap-2.5 ${msg.isUser ? "justify-end" : "justify-start"}`}>
                                        {!msg.isUser && (
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00A5E5] to-[#9D7CFF] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                                                <svg width="14" height="14" viewBox="0 0 28 28" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M14 2C7.373 2 2 7.149 2 13.5c0 2.38.72 4.596 1.953 6.43L2.05 24.694A.75.75 0 002.9 25.6l5.317-1.707A12.02 12.02 0 0014 25c6.627 0 12-5.149 12-11.5S20.627 2 14 2z" fill="white" />
                                                </svg>
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[78%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl ${msg.isUser
                                                ? "bg-[#2A2A3D] text-white/90 rounded-br-sm border border-white/[0.06]"
                                                : "bg-gradient-to-br from-[#00A5E5] to-[#6644ee] text-white rounded-bl-sm shadow-[0_4px_14px_rgba(124,92,255,0.35)]"
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: markdownToHtml(msg.text) }}
                                        />
                                        {msg.isUser && (
                                            <div className="w-7 h-7 rounded-full bg-[#2A2A3D] border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-white/60 text-[10px] font-semibold">
                                                You
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* ── Suggested questions (shown only before first message) ── */}
                                {!hasSentMessage && !isAsking && (
                                    <div className="suggestions-enter">
                                        <p className="text-[11px] text-white/30 mb-2 px-0.5">Suggested questions</p>
                                        <div className="suggestions-wrap">
                                            {SUGGESTED_QUESTIONS.map((q) => (
                                                <button
                                                    key={q}
                                                    onClick={() => handleSuggestedQuestion(q)}
                                                    className="suggestion-btn"
                                                >
                                                    {q}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Loading shimmer */}
                                {isAsking && (
                                    <div className="flex gap-2.5 justify-start">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00A5E5] to-[#9D7CFF] flex items-center justify-center flex-shrink-0 shadow-md">
                                            <svg width="14" height="14" viewBox="0 0 28 28" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M14 2C7.373 2 2 7.149 2 13.5c0 2.38.72 4.596 1.953 6.43L2.05 24.694A.75.75 0 002.9 25.6l5.317-1.707A12.02 12.02 0 0014 25c6.627 0 12-5.149 12-11.5S20.627 2 14 2z" fill="white" />
                                            </svg>
                                        </div>
                                        <div className="bg-[#1E1E2E] border border-white/[0.06] px-4 py-3 rounded-2xl rounded-bl-sm w-[220px] space-y-2.5">
                                            <div className="h-2.5 rounded-full chat-shimmer w-[85%]" />
                                            <div className="h-2.5 rounded-full chat-shimmer w-[65%]" style={{ animationDelay: "0.15s" }} />
                                            <div className="h-2.5 rounded-full chat-shimmer w-[75%]" style={{ animationDelay: "0.3s" }} />
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* ── Input ── */}
                            <div className="px-4 pb-4 pt-2 bg-[#0F0F17] flex-shrink-0 border-t border-white/[0.05]">
                                <div className="flex items-center gap-2 bg-[#1A1A2E] rounded-2xl px-4 py-2 border border-white/[0.07] focus-within:border-[#00A5E5]/60 transition-colors">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Ask anything…"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        disabled={isAsking}
                                        className="flex-1 bg-transparent text-white/90 text-sm placeholder-white/25 focus:outline-none py-1 disabled:opacity-50"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={isAsking || !newMessage.trim()}
                                        aria-label="Send message"
                                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#00A5E5]  disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all duration-150 shadow-[0_2px_10px_rgba(124,92,255,0.4)]"
                                    >
                                        <Send size={14} className="text-white" />
                                    </button>
                                </div>
                                <p className="text-center text-white/15 text-[10px] mt-2">
                                    Powered by AI · Press Enter to send
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}