"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Check,
  Upload,
  FileText,
  Building,
  Mail,
  User,
  ShieldCheck,
  Globe,
  Link as LinkIcon,
  AlertCircle,
  Lock,
  Trash2,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";

export interface ClaimArtistData {
  artistName: string;
  artistEmail: string;
  artistPhone?: string;
  artistGenre?: string;
  artistImage?: string | null;

  // Your Information
  yourName: string;
  companyAgency: string;
  businessEmail: string;
  role: "Agent" | "Manager" | "Artist" | "Authorized Representative";

  // Representation
  representation: "Worldwide" | "U.S./North America" | "International" | "Other";

  // Verify Your Relationship
  verificationMethod?: "roster_url" | "confirmation_email" | "upload_proof" | string;
  rosterUrl?: string;
  confirmationEmail?: string;
  uploadedFileName?: string;
  note?: string;
}

interface ClaimArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitClaim: (claimData: ClaimArtistData) => void;
  globalCatalog: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    genre: string;
    image: string;
  }>;
}

export function ClaimArtistModal({
  isOpen,
  onClose,
  onSubmitClaim,
  globalCatalog,
}: ClaimArtistModalProps) {
  // Form Input States
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [selectedCatalogArtist, setSelectedCatalogArtist] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
    genre: string;
    image: string;
  } | null>(null);

  const [customArtistName, setCustomArtistName] = useState("");
  const [customGenre, setCustomGenre] = useState("");

  // Your Information Inputs
  const [yourName, setYourName] = useState("");
  const [companyAgency, setCompanyAgency] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [role, setRole] = useState<"Agent" | "Manager" | "Artist" | "Authorized Representative">("Agent");

  // Representation Input
  const [representation, setRepresentation] = useState<"Worldwide" | "U.S./North America" | "International" | "Other">("Worldwide");

  // Verify Your Relationship Inputs
  const [rosterUrl, setRosterUrl] = useState("");
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [note, setNote] = useState("");

  const [formError, setFormError] = useState("");

  // Search Results
  const modalSearchResults = useMemo(() => {
    if (!modalSearchQuery.trim()) return [];
    const q = modalSearchQuery.toLowerCase();
    return globalCatalog.filter(
      (a) => a.name.toLowerCase().includes(q) || a.genre.toLowerCase().includes(q)
    );
  }, [modalSearchQuery, globalCatalog]);

  const handleSelectCatalogArtist = (artist: typeof globalCatalog[0]) => {
    setSelectedCatalogArtist(artist);
    setCustomArtistName(artist.name);
    setModalSearchQuery("");
    setFormError("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      toast.success(`Attached document: ${file.name}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const targetArtistName = selectedCatalogArtist ? selectedCatalogArtist.name : customArtistName.trim();

    if (!targetArtistName) {
      setFormError("Please search/select an artist or enter artist name.");
      return;
    }

    if (!yourName.trim()) {
      setFormError("Please enter your Name.");
      return;
    }

    if (!businessEmail.trim() || !businessEmail.includes("@")) {
      setFormError("Please enter a valid Business Email.");
      return;
    }

    if (!rosterUrl.trim() && !confirmationEmail.trim() && !uploadedFile) {
      setFormError("Please fill in at least one verification method (Roster URL, Confirmation Email, or Upload Proof Document).");
      return;
    }

    const claimData: ClaimArtistData = {
      artistName: targetArtistName,
      artistEmail: selectedCatalogArtist ? selectedCatalogArtist.email : "",
      artistPhone: selectedCatalogArtist ? selectedCatalogArtist.phone : "",
      artistGenre: selectedCatalogArtist ? selectedCatalogArtist.genre : (customGenre || "Performance"),
      artistImage: selectedCatalogArtist ? selectedCatalogArtist.image : null,

      yourName: yourName.trim(),
      companyAgency: companyAgency.trim(),
      businessEmail: businessEmail.trim(),
      role,
      representation,

      verificationMethod: uploadedFile ? "upload_proof" : rosterUrl.trim() ? "roster_url" : "confirmation_email",
      rosterUrl: rosterUrl.trim() || undefined,
      confirmationEmail: confirmationEmail.trim() || undefined,
      uploadedFileName: uploadedFile ? uploadedFile.name : undefined,
      note: note.trim(),
    };

    onSubmitClaim(claimData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setModalSearchQuery("");
    setSelectedCatalogArtist(null);
    setCustomArtistName("");
    setCustomGenre("");
    setYourName("");
    setCompanyAgency("");
    setBusinessEmail("");
    setRole("Agent");
    setRepresentation("Worldwide");
    setRosterUrl("");
    setConfirmationEmail("");
    setUploadedFile(null);
    setNote("");
    setFormError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="fixed inset-0 bg-black backdrop-blur-sm z-[-1]"
          />

          {/* Website Design Standard Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-[28px] shadow-2xl p-6 sm:p-8 z-10 space-y-6 font-sans my-6"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-2 border-b border-white/5">
              <div>
                <h3 className="font-bold text-xl text-white leading-tight flex items-center gap-2">
                  <ShieldCheck size={22} className="text-[#00A5E5]" />
                  Claim Artist
                </h3>
                <p className="text-sm text-gray-500 font-normal mt-1">
                  Submit information to claim and verify representation rights for an artist.
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">

              {/* 1. ARTIST */}
              <div className="space-y-3">
                <label className="text-[16.06px] leading-[24.09px] font-semibold text-white tracking-[0px] block select-none">
                  Artist
                </label>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 block">
                    Search/select artist:
                  </label>

                  {selectedCatalogArtist ? (
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#131316] border border-[#00A5E5]/40">
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedCatalogArtist.image}
                          alt={selectedCatalogArtist.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <div className="text-sm font-semibold text-white">{selectedCatalogArtist.name}</div>
                          <div className="text-xs text-gray-400">{selectedCatalogArtist.genre}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCatalogArtist(null);
                          setCustomArtistName("");
                        }}
                        className="text-xs text-red-400 hover:underline cursor-pointer font-medium px-2 py-1"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                          type="text"
                          placeholder="Type to search platform database..."
                          value={modalSearchQuery}
                          onChange={(e) => {
                            setModalSearchQuery(e.target.value);
                            setCustomArtistName(e.target.value);
                          }}
                          className="w-full bg-[#131316] border border-white/10 focus:border-[#00A5E5]/40 transition-all rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none"
                        />
                      </div>

                      {/* Dropdown Suggestions */}
                      {modalSearchQuery.trim() && modalSearchResults.length > 0 && (
                        <div className="border border-white/10 rounded-2xl bg-[#0f0f12] p-2 space-y-1 max-h-36 overflow-y-auto">
                          {modalSearchResults.map((artist) => (
                            <div
                              key={artist.id}
                              onClick={() => handleSelectCatalogArtist(artist)}
                              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.04] cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <img src={artist.image} alt={artist.name} className="w-7 h-7 rounded-full object-cover" />
                                <span className="text-xs font-semibold text-white">{artist.name}</span>
                              </div>
                              <span className="text-[10px] text-gray-400 bg-white/[0.05] px-2 py-0.5 rounded-md">{artist.genre}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-1.5 pt-1">
                        <label className="text-xs font-medium text-gray-400 block">Or enter artist name directly:</label>
                        <input
                          type="text"
                          placeholder="e.g. Charlie Puth"
                          value={customArtistName}
                          onChange={(e) => setCustomArtistName(e.target.value)}
                          className="w-full bg-[#131316] border border-white/10 focus:border-[#00A5E5]/40 transition-all rounded-2xl py-3.5 px-4 text-sm text-white placeholder-gray-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. YOUR INFORMATION */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <label className="text-[16.06px] leading-[24.09px] font-semibold text-white tracking-[0px] block select-none">
                  Your Information
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-300 block">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={yourName}
                      onChange={(e) => setYourName(e.target.value)}
                      className="w-full bg-[#131316] border border-white/10 focus:border-[#00A5E5]/40 transition-all rounded-2xl py-3.5 px-4 text-sm text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>

                  {/* Company/Agency */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-300 block">Company/Agency</label>
                    <input
                      type="text"
                      placeholder="e.g. CAA / WME"
                      value={companyAgency}
                      onChange={(e) => setCompanyAgency(e.target.value)}
                      className="w-full bg-[#131316] border border-white/10 focus:border-[#00A5E5]/40 transition-all rounded-2xl py-3.5 px-4 text-sm text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Business Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-300 block">
                      Business Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="agent@agency.com"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      className="w-full bg-[#131316] border border-white/10 focus:border-[#00A5E5]/40 transition-all rounded-2xl py-3.5 px-4 text-sm text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-300 block">
                      Role <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full bg-[#131316] border border-white/10 focus:border-[#00A5E5]/40 transition-all rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none cursor-pointer"
                    >
                      <option value="Agent">Agent</option>
                      <option value="Manager">Manager</option>
                      <option value="Artist">Artist</option>
                      <option value="Authorized Representative">Authorized Representative</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. REPRESENTATION */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <label className="text-[16.06px] leading-[24.09px] font-semibold text-white tracking-[0px] block select-none">
                  Representation
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(["Worldwide", "U.S./North America", "International", "Other"] as const).map((rep) => {
                    const isSelected = representation === rep;
                    return (
                      <button
                        key={rep}
                        type="button"
                        onClick={() => setRepresentation(rep)}
                        className={`py-3 px-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer select-none text-center ${
                          isSelected
                            ? "bg-[#00A5E5] border-[#00A5E5] text-white shadow-lg"
                            : "bg-[#131316] border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                        }`}
                      >
                        {rep}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. VERIFY YOUR RELATIONSHIP */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <div>
                  <label className="text-[16.06px] leading-[24.09px] font-semibold text-white tracking-[0px] block select-none">
                    Verify Your Relationship
                  </label>
                  <p className="text-xs text-gray-500 font-normal mt-0.5">
                    Choose one or fill in verification options below:
                  </p>
                </div>

                {/* Option 1: Official Roster URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300 block">
                    Official agency/management roster URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://youragency.com/roster/artist-page"
                    value={rosterUrl}
                    onChange={(e) => setRosterUrl(e.target.value)}
                    className="w-full bg-[#131316] border border-white/10 focus:border-[#00A5E5]/40 transition-all rounded-2xl py-3.5 px-4 text-sm text-white placeholder-gray-600 focus:outline-none"
                  />
                </div>

                {/* Option 2: Artist Confirmation Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300 block">
                    Artist confirmation email
                  </label>
                  <input
                    type="email"
                    placeholder="artist-official-email@domain.com"
                    value={confirmationEmail}
                    onChange={(e) => setConfirmationEmail(e.target.value)}
                    className="w-full bg-[#131316] border border-white/10 focus:border-[#00A5E5]/40 transition-all rounded-2xl py-3.5 px-4 text-sm text-white placeholder-gray-600 focus:outline-none"
                  />
                </div>

                {/* Option 3: Upload Proof */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300 block">
                    Upload proof of representation
                  </label>

                  <div className="bg-[#00A5E5]/5 border border-[#00A5E5]/20 rounded-2xl p-3.5 space-y-1">
                    <span className="text-xs font-semibold text-white block">For upload, accept:</span>
                    <ul className="list-disc list-inside text-xs text-gray-400 space-y-0.5 font-normal">
                      <li>Letter of authorization</li>
                      <li>Agency/management agreement or relevant page</li>
                      <li>Other proof of representation</li>
                    </ul>
                  </div>

                  <div className="relative border border-dashed border-white/15 hover:border-[#00A5E5]/40 rounded-2xl p-5 text-center transition-all bg-[#131316] flex flex-col items-center justify-center gap-2 cursor-pointer group">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Upload size={20} className="text-gray-400 group-hover:text-[#00A5E5] transition-colors" />
                    {uploadedFile ? (
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#00A5E5]">
                        <FileText size={15} />
                        <span>{uploadedFile.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedFile(null);
                          }}
                          className="p-1 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs font-medium text-gray-300 block">Click or Drag & Drop proof document</span>
                        <span className="text-[10px] text-gray-500">PDF, DOCX, PNG, JPG (Redacted documents accepted)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Add a Note */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300 block">Add a note:</label>
                  <textarea
                    rows={2}
                    placeholder="Add additional notes..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-[#131316] border border-white/10 focus:border-[#00A5E5]/40 transition-all rounded-2xl p-3.5 text-sm text-white placeholder-gray-600 focus:outline-none resize-none"
                  />
                </div>

                {/* Redaction Notice */}
                <div className="bg-[#00A5E5]/5 border border-[#00A5E5]/20 rounded-2xl p-4 space-y-1">
                  <p className="text-xs text-gray-300 font-normal leading-relaxed">
                    💡 <strong>Redaction Policy:</strong> Confidential information may be redacted. We only need enough information to verify your relationship with the artist.
                  </p>
                </div>
              </div>

              {/* Error Alert */}
              {formError && (
                <div className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/15 p-3.5 rounded-2xl select-none">
                  {formError}
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3.5 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-full border border-white/10 text-white hover:bg-white/[0.05] transition-all text-sm font-semibold cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00A5E5] hover:bg-[#00A5E5]/90 text-white font-semibold rounded-full px-6 py-2.5 text-sm transition-all cursor-pointer shadow-[0_4px_20px_rgba(0,165,229,0.15)] flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={16} />
                  Submit Claim
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
