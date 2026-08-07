"use client";

import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import SignatureCanvas from "react-signature-canvas";
import { useMyTeamQuery, useAllUsersQuery } from "@/redux/feature/team-managementSlice";

interface OfferItem {
  id: string;
  offerId: string;
  artistName: string;
  genre: string;
  agency: string;
  eventDate: string;
  eventTime: string;
  setLength: string;
  stage: string;
  capacity: string;
  fee: string;
  status: "Pending" | "Accepted" | "Rejected";
  flow: "Received" | "Sent";
  timeAgo: string;
  avatarChar: string;
  avatarBg: string;
  type?: string;
}

interface OfferDetailsSidebarProps {
  selectedOffer: OfferItem | null;
  onClose: () => void;
  offerDetails?: any;
  isLoading?: boolean;
  onAccept?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  onSign?: (id: string, body: FormData) => Promise<void>;
  onShare?: (id: string, data: any) => Promise<void>;
  onUnshare?: (id: string, data: any) => Promise<void>;
  acceptLoading?: boolean;
  rejectLoading?: boolean;
  signLoading?: boolean;
}

export const OfferDetailsSidebar: React.FC<OfferDetailsSidebarProps> = ({
  selectedOffer,
  onClose,
  offerDetails,
  isLoading,
  onAccept,
  onReject,
  onSign,
  onShare,
  onUnshare,
  acceptLoading = false,
  rejectLoading = false,
  signLoading = false
}) => {
  const [confirmAction, setConfirmAction] = useState<"accept" | "reject" | null>(null);
  const [showSignPad, setShowSignPad] = useState(false);
  const [signatureTab, setSignatureTab] = useState<"draw" | "upload">("draw");
  const [uploadedSignature, setUploadedSignature] = useState<File | null>(null);
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  // Sharing states & queries
  const [sidebarShareTab, setSidebarShareTab] = useState<"team" | "user">("team");
  const { data: teamData, isLoading: teamLoading } = useMyTeamQuery(undefined, { skip: !selectedOffer });
  const { data: userData, isLoading: usersLoading } = useAllUsersQuery(undefined, { skip: !selectedOffer });

  const allTeamsList = teamData?.results || [];
  const allUsersList = userData?.results || [];

  // Get active team ID from localStorage
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveTeamId(localStorage.getItem("active_team_id"));
    }
  }, [selectedOffer]);

  const activeTeam = React.useMemo(() => {
    if (!teamData?.results || !activeTeamId) return null;
    return teamData.results.find((t: any) => String(t.id) === String(activeTeamId));
  }, [teamData, activeTeamId]);

  return (
    <AnimatePresence>
      {selectedOffer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 cursor-pointer backdrop-blur-sm"
          />

          {/* Sidebar Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[460px] bg-[#050505] border-l border-zinc-900 z-50 overflow-y-auto flex flex-col justify-between font-sans shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-900 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg shrink-0 bg-[#3f2038] border border-[#522d4a]">
                    {selectedOffer.avatarChar}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-lg text-white block truncate leading-tight">{selectedOffer.artistName}</span>
                    <span className="text-xs text-zinc-550 block mt-1 leading-none">{selectedOffer.genre}</span>
                    <span className="text-xs text-zinc-500 block italic mt-1 leading-none">{selectedOffer.agency}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-zinc-555 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-zinc-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {selectedOffer.status === "Pending" && (
                  <span
                    style={{
                      height: "26px",
                      borderRadius: "9999px",
                      borderWidth: "1px",
                      borderColor: "rgba(245, 158, 11, 0.4)",
                      backgroundColor: "rgba(245, 158, 11, 0.15)",
                      paddingTop: "2px",
                      paddingBottom: "2px",
                      paddingLeft: "10px",
                      paddingRight: "10px"
                    }}
                    className="text-[#F59E0B] text-[10px] font-bold flex items-center gap-1 font-sans"
                  >
                    <span>⏳ Pending</span>
                  </span>
                )}
                {selectedOffer.status === "Accepted" && (
                  <span
                    style={{
                      height: "26px",
                      borderRadius: "9999px",
                      borderWidth: "1px",
                      borderColor: "rgba(16, 185, 129, 0.4)",
                      backgroundColor: "rgba(16, 185, 129, 0.15)",
                      paddingTop: "2px",
                      paddingBottom: "2px",
                      paddingLeft: "10px",
                      paddingRight: "10px"
                    }}
                    className="text-[#10B981] text-[10px] font-bold flex items-center gap-1 font-sans"
                  >
                    <span>✓ Accepted</span>
                  </span>
                )}
                {selectedOffer.status === "Rejected" && (
                  <span
                    style={{
                      height: "26px",
                      borderRadius: "9999px",
                      borderWidth: "1px",
                      borderColor: "rgba(239, 68, 68, 0.4)",
                      backgroundColor: "rgba(239, 68, 68, 0.15)",
                      paddingTop: "2px",
                      paddingBottom: "2px",
                      paddingLeft: "10px",
                      paddingRight: "10px"
                    }}
                    className="text-[#ef4444] text-[10px] font-bold flex items-center gap-1 font-sans"
                  >
                    <span>✕ Rejected</span>
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500 font-mono tracking-wider font-semibold">
                  {selectedOffer.offerId}
                </span>
              </div>
            </div>
            {/* Scrollable details contents */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 text-zinc-500 text-sm gap-2">
                  <div className="h-6 w-6 border-2 border-[#00A5E5] border-t-transparent rounded-full animate-spin" />
                  <span>Loading offer details...</span>
                </div>
              ) : (
                <>
                  {/* OFFER TERMS CARD */}
                  <div
                    style={{
                      borderRadius: "19.81px",
                      borderWidth: "1.24px",
                      borderColor: "rgba(255, 255, 255, 0.08)",
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      padding: "19.81px"
                    }}
                    className="space-y-4"
                  >
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider font-sans block">
                      OFFER TERMS
                    </span>
                    <div className="text-3xl font-bold text-[#00A5E5] font-sans pb-2">
                      ${offerDetails?.offer?.offer_amount
                        ? parseFloat(offerDetails.offer.offer_amount).toLocaleString()
                        : parseFloat(selectedOffer.fee.replace(/,/g, "")).toLocaleString()}
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-medium font-sans">Offer Type</span>
                        <span className="text-white font-semibold font-sans">{selectedOffer.type || "Flat Fee"}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-medium font-sans">Event Date</span>
                        <span className="text-white font-semibold font-sans">{selectedOffer.eventDate}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-medium font-sans">Event Time</span>
                        <span className="text-white font-semibold font-sans">{selectedOffer.eventTime}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-medium font-sans">Set Length</span>
                        <span className="text-white font-semibold font-sans">{selectedOffer.setLength}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-medium font-sans">Stage</span>
                        <span className="text-white font-semibold font-sans">{selectedOffer.stage}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-medium font-sans">Capacity</span>
                        <span className="text-white font-semibold font-sans">{selectedOffer.capacity}</span>
                      </div>
                    </div>
                  </div>

                  {/* VENUE INFO CARD */}
                  <div
                    style={{
                      borderRadius: "19.81px",
                      borderWidth: "1.24px",
                      borderColor: "rgba(255, 255, 255, 0.08)",
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      padding: "19.81px"
                    }}
                    className="space-y-4"
                  >
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider font-sans block">
                      VENUE INFO
                    </span>

                    <div className="space-y-3 pt-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 font-medium font-sans">Venue Name</span>
                        <span className="text-white font-semibold font-sans">{offerDetails?.offer?.venue || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-start text-xs">
                        <span className="text-zinc-500 font-medium font-sans shrink-0">Address</span>
                        <span className="text-white font-semibold font-sans text-right max-w-[200px]">
                          {offerDetails?.offer?.venue_address
                            ? `${offerDetails.offer.venue_address}, ${offerDetails.offer.city_state_country_zip || ""}`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-start text-xs">
                        <span className="text-zinc-500 font-medium font-sans shrink-0">Requirements</span>
                        <span className="text-white font-semibold font-sans text-right max-w-[200px]">
                          {offerDetails?.offer?.additional_notes || "None"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SHARE SETTINGS CARD (Only visible for Pending offers) */}
                  {selectedOffer.status === "Pending" && (
                    <div
                      style={{
                        borderRadius: "19.81px",
                        borderWidth: "1.24px",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        padding: "19.81px"
                      }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider font-sans block">
                          SHARE SETTINGS
                        </span>
                        <div className="flex gap-2 bg-[#121214] p-0.5 rounded-lg border border-white/5">
                          <button
                            type="button"
                            onClick={() => setSidebarShareTab("team")}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${sidebarShareTab === "team" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-white"
                              }`}
                          >
                            Teams
                          </button>
                          <button
                            type="button"
                            onClick={() => setSidebarShareTab("user")}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${sidebarShareTab === "user" ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-white"
                              }`}
                          >
                            Users
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1 max-h-[160px] overflow-y-auto no-scrollbar">
                        {sidebarShareTab === "team" ? (
                          teamLoading ? (
                            <div className="text-[10px] text-zinc-500 italic py-2">Loading teams...</div>
                          ) : allTeamsList.length > 0 ? (
                            allTeamsList.map((teamItem: any) => {
                              const isShared = offerDetails?.offer?.shared_with_teams?.some(
                                (t: any) => t.id === teamItem.id
                              );
                              return (
                                <div key={teamItem.id} className="flex justify-between items-center gap-3 py-1">
                                  <div className="min-w-0">
                                    <span className="text-xs font-bold text-white block truncate">{teamItem.name}</span>
                                    <span className="text-[10px] text-zinc-550 block truncate mt-0.5">{teamItem.description || "No description"}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      if (isShared) {
                                        if (onUnshare) await onUnshare(selectedOffer.id, { team_id: teamItem.id, team_ids: [teamItem.id] });
                                      } else {
                                        if (onShare) await onShare(selectedOffer.id, { team_id: teamItem.id, team_ids: [teamItem.id] });
                                      }
                                    }}
                                    className={`h-7 px-3 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${isShared
                                        ? "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20"
                                        : "bg-cyan-500/10 border border-cyan-500/20 text-[#00A5E5] hover:bg-cyan-500/20"
                                      }`}
                                  >
                                    {isShared ? "Unshare" : "Share"}
                                  </button>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-[10px] text-zinc-500 italic py-2">No teams available.</div>
                          )
                        ) : (
                          usersLoading ? (
                            <div className="text-[10px] text-zinc-500 italic py-2">Loading users...</div>
                          ) : allUsersList.length > 0 ? (
                            allUsersList.map((userItem: any) => {
                              const isShared = offerDetails?.offer?.shared_with_users?.some(
                                (u: any) => u.id === userItem.id
                              );
                              return (
                                <div key={userItem.id} className="flex justify-between items-center gap-3 py-1">
                                  <div className="min-w-0">
                                    <span className="text-xs font-bold text-white block truncate">{userItem.name}</span>
                                    <span className="text-[10px] text-zinc-550 block truncate mt-0.5">{userItem.email}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      if (isShared) {
                                        if (onUnshare) await onUnshare(selectedOffer.id, { user_id: userItem.id, user_ids: [userItem.id] });
                                      } else {
                                        if (onShare) await onShare(selectedOffer.id, { user_id: userItem.id, user_ids: [userItem.id] });
                                      }
                                    }}
                                    className={`h-7 px-3 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${isShared
                                        ? "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20"
                                        : "bg-cyan-500/10 border border-cyan-500/20 text-[#00A5E5] hover:bg-cyan-500/20"
                                      }`}
                                  >
                                    {isShared ? "Unshare" : "Share"}
                                  </button>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-[10px] text-zinc-500 italic py-2">No users available.</div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* ADDITIONAL INCLUDES CARD */}
                  <div
                    style={{
                      borderRadius: "19.81px",
                      borderWidth: "1.24px",
                      borderColor: "rgba(255, 255, 255, 0.08)",
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      padding: "19.81px"
                    }}
                    className="space-y-4"
                  >
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider font-sans block">
                      ADDITIONAL INCLUDES
                    </span>

                    <div className="flex flex-wrap gap-2 pt-1.5">
                      {((offerDetails?.offer?.included_facilities && offerDetails.offer.included_facilities.length > 0)
                        ? offerDetails.offer.included_facilities
                        : ["Standard Requirements Only"]
                      ).map((inc: string) => (
                        <span
                          key={inc}
                          className="px-3.5 py-1.5 rounded-full text-xs font-semibold border border-cyan-500/20 bg-cyan-500/5 text-[#00A5E5] font-sans"
                        >
                          {inc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* DOCUMENTS CARD */}
                  <div
                    style={{
                      borderRadius: "19.81px",
                      borderWidth: "1.24px",
                      borderColor: "rgba(255, 255, 255, 0.08)",
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      padding: "19.81px"
                    }}
                    className="space-y-4"
                  >
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider font-sans block">
                      DOCUMENTS
                    </span>

                    <div className="space-y-3.5 pt-1">
                      {offerDetails?.offer?.documents && offerDetails.offer.documents.length > 0 ? (
                        offerDetails.offer.documents.map((doc: any) => {
                          const docName = doc.document.split("/").pop() || `document_${doc.id}.pdf`;
                          const docUrl = doc.document.startsWith("http")
                            ? doc.document
                            : `https://backend.getavails.com${doc.document}`;

                          return (
                            <div key={doc.id} className="flex justify-between items-center gap-3">
                              <div className="min-w-0 flex-1">
                                <span className="text-xs font-bold text-white block truncate">{docName}</span>
                                <span className="text-[10px] text-zinc-550 block truncate mt-0.5">Uploaded Offer Attachment</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <a
                                  href={docUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="h-8 px-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-[10px] font-semibold text-zinc-300 transition-colors cursor-pointer flex items-center justify-center"
                                >
                                  Preview
                                </a>
                                <a
                                  href={docUrl}
                                  download
                                  className="h-8 px-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-[10px] font-semibold text-zinc-300 transition-colors cursor-pointer flex items-center justify-center"
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-xs text-zinc-500 italic py-1">No documents uploaded.</div>
                      )}
                    </div>
                  </div>

                  {/* SIGNATURES CARD */}
                  <div
                    style={{
                      borderRadius: "19.81px",
                      borderWidth: "1.24px",
                      borderColor: "rgba(255, 255, 255, 0.08)",
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      padding: "19.81px"
                    }}
                    className="space-y-4"
                  >
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider font-sans block">
                      AUTHORIZED SIGNATURES
                    </span>

                    <div className="space-y-4 pt-1">
                      {offerDetails?.offer?.signatures && offerDetails.offer.signatures.length > 0 ? (
                        offerDetails.offer.signatures.map((sig: any) => {
                          const sigUrl = sig.signature.startsWith("http")
                            ? sig.signature
                            : `https://backend.getavails.com${sig.signature}`;

                          return (
                            <div key={sig.id} className="space-y-2.5 border-b border-white/5 pb-2.5 last:border-b-0 last:pb-0">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500">Signer</span>
                                <span className="text-white font-semibold">{sig.signer?.name || "Unknown"}</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500">Role</span>
                                <span className="text-white font-semibold capitalize">{sig.signer?.role || "User"}</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500">Signed At</span>
                                <span className="text-white font-semibold">
                                  {sig.signed_at ? new Date(sig.signed_at).toLocaleDateString() : "N/A"}
                                </span>
                              </div>
                              <div className="mt-2 bg-[#121214] border border-white/5 rounded-xl p-2.5 flex items-center justify-center min-h-[70px]">
                                <img
                                  src={sigUrl}
                                  alt="Signature"
                                  style={{ filter: "brightness(0) invert(1)" }}
                                  className="max-h-[60px] object-contain"
                                />
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-xs text-zinc-500 italic py-1">No signatures recorded.</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Sticky Action Bar */}
            {selectedOffer.status === "Pending" ? (
              <div className="p-4 border-t border-zinc-900 bg-[#050505] flex flex-col gap-2.5 sticky bottom-0 z-50">
                <div className={`grid gap-2.5 ${activeTeam?.domain === "artist" ? "grid-cols-3" : "grid-cols-1"}`}>
                  {activeTeam?.domain === "artist" && (
                    <button
                      type="button"
                      onClick={() => setConfirmAction("reject")}
                      className="h-11 rounded-xl border border-red-950 bg-[#160c0e] hover:bg-[#201013] text-red-500 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowSignPad(true)}
                    className="h-11 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-500 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                  >
                    ✍ Sign
                  </button>

                  {activeTeam?.domain === "artist" && (
                    <button
                      type="button"
                      onClick={() => setConfirmAction("accept")}
                      className="h-11 rounded-xl bg-[#00A5E5] hover:bg-[#009bde] text-white font-bold text-xs flex items-center justify-center transition-colors cursor-pointer shadow-md shadow-cyan-500/10"
                    >
                      Accept
                    </button>
                  )}
                </div>

                {activeTeam?.domain === "venue" && (
                  <a
                    href={`/dashboard/offers/create?editId=${selectedOffer.id}`}
                    className="h-11 rounded-xl border border-zinc-800 bg-[#121214] hover:bg-zinc-900 text-zinc-300 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer text-center w-full"
                  >
                    Edit Offer Details
                  </a>
                )}
              </div>
            ) : (
              <div className="p-4 border-t border-zinc-900 bg-[#050505] text-center text-xs text-zinc-500 italic sticky bottom-0 z-50">
                This offer has been resolved ({selectedOffer.status}).
              </div>
            )}

          </motion.div>

          {/* Confirmation dialog modal overlays */}
          {confirmAction && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                onClick={() => setConfirmAction(null)}
                className="fixed inset-0 bg-black/85 z-[60] backdrop-blur-[1px] cursor-pointer"
              />

              {/* Confirmation Dialog container */}
              <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="w-full max-w-[380px] bg-[#0A0A0C] border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl pointer-events-auto font-sans text-center relative overflow-hidden"
                >
                  {/* Glowing ambient line indicator */}
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r ${confirmAction === "accept" ? "from-emerald-500 to-cyan-500" : "from-red-500 to-amber-500"
                    } blur-sm opacity-50`} />

                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white tracking-wide">
                      {confirmAction === "accept" ? "Accept Offer" : "Reject Offer"}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {confirmAction === "accept"
                        ? `Are you sure you want to accept the offer for "${selectedOffer.artistName}"? This action is binding.`
                        : `Are you sure you want to reject the offer for "${selectedOffer.artistName}"? This action cannot be undone.`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setConfirmAction(null)}
                      className="h-10 rounded-xl border border-zinc-800 bg-[#121214] text-zinc-300 font-bold text-xs hover:bg-zinc-900 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={acceptLoading || rejectLoading}
                      onClick={async () => {
                        try {
                          if (confirmAction === "accept" && onAccept) {
                            await onAccept(selectedOffer.id);
                          } else if (confirmAction === "reject" && onReject) {
                            await onReject(selectedOffer.id);
                          }
                        } catch (err) {
                          console.error(err);
                        } finally {
                          setConfirmAction(null);
                        }
                      }}
                      className={`h-10 rounded-xl font-bold text-xs text-white transition-colors cursor-pointer flex items-center justify-center ${confirmAction === "accept"
                        ? "bg-[#10B981] hover:bg-[#0d9468]"
                        : "bg-[#ef4444] hover:bg-[#dc2626]"
                        }`}
                    >
                      {acceptLoading || rejectLoading ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Confirm"
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}

          {/* Signature Modal */}
          {showSignPad && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSignPad(false)}
                className="fixed inset-0 bg-black/85 z-[60] backdrop-blur-[1px] cursor-pointer"
              />

              {/* Signature Dialog */}
              <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="w-full max-w-[420px] bg-[#0A0A0C] border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl pointer-events-auto font-sans relative overflow-hidden"
                >
                  {/* Top glowing bar */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 blur-sm opacity-50" />

                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-white tracking-wide">
                      Add Authorized Signature
                    </h3>
                    <button
                      onClick={() => setShowSignPad(false)}
                      className="p-1 text-zinc-500 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Tabs: Draw vs Upload */}
                  <div className="flex border-b border-white/5 pb-1">
                    <button
                      type="button"
                      onClick={() => setSignatureTab("draw")}
                      className={`pb-2.5 px-4 text-xs font-bold transition-colors relative cursor-pointer ${signatureTab === "draw" ? "text-amber-500" : "text-zinc-500 hover:text-white"
                        }`}
                    >
                      Draw
                      {signatureTab === "draw" && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignatureTab("upload")}
                      className={`pb-2.5 px-4 text-xs font-bold transition-colors relative cursor-pointer ${signatureTab === "upload" ? "text-amber-500" : "text-zinc-500 hover:text-white"
                        }`}
                    >
                      Upload
                      {signatureTab === "upload" && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500" />
                      )}
                    </button>
                  </div>

                  {/* Tab Body */}
                  <div className="pt-2">
                    {signatureTab === "draw" ? (
                      <div className="space-y-4">
                        <div className="border border-white/5 rounded-xl overflow-hidden bg-[#121214] flex flex-col min-h-[140px] relative">
                          <SignatureCanvas
                            ref={sigCanvasRef}
                            penColor="white"
                            canvasProps={{
                              style: { width: "100%", height: "100%", minHeight: "140px" },
                              className: "cursor-crosshair flex-1"
                            }}
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => sigCanvasRef.current?.clear()}
                            className="text-xs text-zinc-550 hover:text-white underline cursor-pointer"
                          >
                            Clear Pad
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center bg-[#121214] text-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            id="sig-upload-sidebar"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setUploadedSignature(file);
                            }}
                          />
                          <label
                            htmlFor="sig-upload-sidebar"
                            className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
                          >
                            Choose File
                          </label>
                          <span className="text-[10px] text-zinc-550">
                            {uploadedSignature ? uploadedSignature.name : "PNG or JPG format supported"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSignPad(false)}
                      className="h-10 rounded-xl border border-zinc-800 bg-[#121214] text-zinc-300 font-bold text-xs hover:bg-zinc-900 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={signLoading}
                      onClick={async () => {
                        try {
                          let signatureBlob: Blob | null = null;
                          if (signatureTab === "draw" && sigCanvasRef.current) {
                            const canvas = sigCanvasRef.current.getTrimmedCanvas();
                            signatureBlob = await new Promise<Blob | null>((resolve) => {
                              canvas.toBlob((blob: any) => resolve(blob), "image/png");
                            });
                          } else if (signatureTab === "upload" && uploadedSignature) {
                            signatureBlob = uploadedSignature;
                          }

                          if (!signatureBlob) {
                            toast.error("Please provide a signature first.");
                            return;
                          }

                          const formData = new FormData();
                          formData.append("signature", signatureBlob, "signature.png");

                          if (onSign) {
                            await onSign(selectedOffer.id, formData);
                          }
                          setShowSignPad(false);
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="h-10 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-xs text-white transition-colors cursor-pointer flex items-center justify-center"
                    >
                      {signLoading ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Confirm Signature"
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </>
      )}
    </AnimatePresence>
  );
};
