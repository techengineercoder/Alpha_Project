"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Bell,
  FileText,
  Search,
  X
} from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";
import { motion, AnimatePresence } from "framer-motion";
import { LogoLoader } from "@/components/ui/logo-loader";

import { VenueInformation } from "@/components/offers/create/venue-info";
import { FinancialRequirements } from "@/components/offers/create/financial-requirements";
import { PerformanceInformation } from "@/components/offers/create/performance-info";
import { ContactInformation } from "@/components/offers/create/contact-info";
import { AlsoIncluded } from "@/components/offers/create/also-included";
import { ShareWithTeam } from "@/components/offers/create/share-with-team";
import { ShareWithUsers } from "@/components/offers/create/share-with-users";
import { DocumentsSection } from "@/components/offers/create/documents-section";
import { LegalNotice } from "@/components/offers/create/legal-notice";
import { SignatureSection } from "@/components/offers/create/signature-section";
import { CommonHeader } from "@/components/dashboard/page-header";
import { useCreateOfferMutation, useGetOfferByIdQuery, useUpdateOfferMutation } from "@/redux/feature/dashboardApi/offerSlice";
import { jsPDF } from "jspdf";
import { useAllUsersQuery, useMyTeamQuery } from "@/redux/feature/team-managementSlice";
import { useGetInquiryDetailsQuery } from "@/redux/feature/dashboardApi/inquirieSlice";

interface TeamCard {
  id: string;
  name: string;
  avatarChar: string;
  avatarBg: string;
  description: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

const subCardClassName = "bg-[#121218]/60 border border-white/5 rounded-2xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-8 shadow-2xl shadow-black/25";

const shareTeamContainerClassName = "bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl shadow-black/25";


export default function CreateOfferPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: myTeamData, isLoading: myTeamLoading } = useMyTeamQuery(undefined);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    if (myTeamData?.results) {
      const activeTeamId = typeof window !== "undefined" ? localStorage.getItem("active_team_id") : null;
      const activeTeam = myTeamData.results.find((t: any) => String(t.id) === String(activeTeamId));
      
      if (activeTeam && activeTeam.domain !== "venue") {
        toast.error("Access denied. Only venues can create or edit offers.");
        router.push("/dashboard/offers");
      } else {
        setCheckingAccess(false);
      }
    } else if (!myTeamLoading && myTeamData) {
      setCheckingAccess(false);
    }
  }, [myTeamData, myTeamLoading, router]);

  // http://localhost:3000/dashboard/offers/create?inquiryId=1

  const params = useSearchParams();
  const inquiryId = params.get("inquiryId");
  const editId = params.get("editId");
  console.log(inquiryId, editId);

  const [createOffer, { isLoading: createOfferLoading }] = useCreateOfferMutation();
  const [updateOffer, { isLoading: updateOfferLoading }] = useUpdateOfferMutation();

  // Fetch offer details if in edit mode
  const { data: editOfferData } = useGetOfferByIdQuery(
    editId ? Number(editId) : undefined,
    { skip: !editId }
  );

  // Inquiry state values
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null);

  // Fetch inquiry details if query params has it
  const { data: inquiryDetailsData } = useGetInquiryDetailsQuery(
    inquiryId ? Number(inquiryId) : undefined,
    { skip: !inquiryId }
  );

  // Populate fields when an inquiry is selected
  const populateInquiryFields = (inq: any) => {
    if (!inq) {
      setSelectedInquiryId(null);
      setArtistName("");
      setEventDate(undefined);
      setVenueType("");
      setVenueAddress("");
      setCityStateZip("");
      setVenuePhone("");
      setOfferAmount("");
      setAirfare("");
      setBackline("");
      setHotelTransport("");
      setCatering("");
      setProductionSoundLights("");
      setDoorTimeLength("");
      setExpectedAttendance("");
      setPastPerformers("");
      setSocialRequests("");
      setEventFor("");
      setOtherArtists("");
      setSignatoryName("");
      setSignatoryAddress("");
      setSignatoryPhone("");
      setBuyerName("");
      setBuyerAddress("");
      setBuyerPhone("");
      setProdName("");
      setProdPhone("");
      setNoteText("");
      return;
    }

    setSelectedInquiryId(inq.id);
    setArtistName(inq.artist_name || inq.event_title || "");
    if (inq.date) {
      try {
        setEventDate(new Date(inq.date));
      } catch (e) {
        console.error(e);
      }
    }
    setVenueType(inq.venue || "");
    setVenueAddress(inq.venue_address || "");
    setCityStateZip(inq.city_state_country_zip || "");
    setVenuePhone(inq.venue_phone || "");
    
    // Financials
    setOfferAmount(inq.offer_amount || "");
    setAirfare(inq.airfare || "");
    setBackline(inq.backline || "");
    setHotelTransport(inq.hotel_ground_transportation || "");
    setCatering(inq.catering || "");
    setProductionSoundLights(inq.first_class_sound_and_lighting || "");
    
    // Performance
    setDoorTimeLength(inq.door_time || "");
    setExpectedAttendance(inq.expected_attendance ? String(inq.expected_attendance) : "");
    setPastPerformers(inq.past_performers || "");
    setSocialRequests(inq.social_media_request || "");
    setEventFor(inq.what_is_event_for || "");
    setOtherArtists(inq.other_artists || "");
    
    // Contacts
    setSignatoryName(inq.contact_signatory_name || "");
    setSignatoryAddress(inq.contact_signatory_address || "");
    setSignatoryPhone(inq.contact_signatory_contact_info || "");
    
    setBuyerName(inq.contact_buyer_name || "");
    setBuyerAddress(inq.contact_buyer_address || "");
    setBuyerPhone(inq.contact_buyer_contact_info || "");
    
    setProdName(inq.contact_production_name || "");
    setProdPhone(inq.contact_production_contact_info || "");
    
    setNoteText(inq.additional_notes || "");
  };

  // Auto-populate when inquiryDetailsData changes (from URL params)
  useEffect(() => {
    if (inquiryDetailsData?.inquiry) {
      populateInquiryFields(inquiryDetailsData.inquiry);
    }
  }, [inquiryDetailsData]);

  const [artistName, setArtistName] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [venueType, setVenueType] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [cityStateZip, setCityStateZip] = useState("");
  const [venuePhone, setVenuePhone] = useState("");

  // Financial values
  const [offerAmount, setOfferAmount] = useState("");
  const [airfare, setAirfare] = useState("");
  const [backline, setBackline] = useState("");
  const [hotelTransport, setHotelTransport] = useState("");
  const [catering, setCatering] = useState("");
  const [productionSoundLights, setProductionSoundLights] = useState("");

  // Performance info
  const [doorTimeLength, setDoorTimeLength] = useState("");
  const [expectedAttendance, setExpectedAttendance] = useState("");
  const [pastPerformers, setPastPerformers] = useState("");
  const [socialRequests, setSocialRequests] = useState("");
  const [eventFor, setEventFor] = useState("");
  const [otherArtists, setOtherArtists] = useState("");

  // Contacts
  const [signatoryName, setSignatoryName] = useState("");
  const [signatoryAddress, setSignatoryAddress] = useState("");
  const [signatoryPhone, setSignatoryPhone] = useState("");

  const [buyerName, setBuyerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");

  const [prodName, setProdName] = useState("");
  const [prodPhone, setProdPhone] = useState("");

  // Notes
  const [noteText, setNoteText] = useState("");

  // Also Included checkboxes
  const [soundSystem, setSoundSystem] = useState(true);
  const [lightening, setLightening] = useState(true);
  const [staging, setStaging] = useState(false);
  const [groundTransport, setGroundTransport] = useState(false);
  const [hospitality, setHospitality] = useState(false);

  // Tags list
  const [tags, setTags] = useState<string[]>(["Catering", "Green Room"]);
  const [newTagInput, setNewTagInput] = useState("");
  const [showTagForm, setShowTagForm] = useState(false);

  // Team Selection
  const [teamSearch, setTeamSearch] = useState("");
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);

  const { data: team, isLoading: teamLoading } = useMyTeamQuery(teamSearch || undefined);
  console.log(team, "teams=========");

  // User Selection
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [sharingTab, setSharingTab] = useState<"team" | "user">("team");

  const { data: allUsers, isLoading: usersLoading } = useAllUsersQuery(userSearch || undefined);
  console.log(allUsers, "all users =========");

  // Memoized filter to show only 3 users when search is empty, ensuring selected user stays visible
  const displayedUsers = useMemo(() => {
    const list = allUsers?.results || [];
    if (userSearch) return list;

    const defaultList = [...list.slice(0, 3)];
    if (selectedUserId) {
      const selectedUserObj = list.find((u: any) => u.id === selectedUserId);
      if (selectedUserObj && !defaultList.some((u: any) => u.id === selectedUserId)) {
        defaultList.push(selectedUserObj);
      }
    }
    return defaultList;
  }, [allUsers, userSearch, selectedUserId]);

  // Documents
  const [documents, setDocuments] = useState<UploadedFile[]>([]);

  // Actual uploaded files to be sent
  const [actualFiles, setActualFiles] = useState<File[]>([]);
  const [uploadedSignatureFile, setUploadedSignatureFile] = useState<File | null>(null);

  // Legal Notice agreement
  const [legalChecked, setLegalChecked] = useState(false);
  const [showFullLegal, setShowFullLegal] = useState(false);

  // Signature selection: "draw" or "upload"
  const [signatureTab, setSignatureTab] = useState<"draw" | "upload">("draw");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  // Populate form fields with existing offer data for editing
  useEffect(() => {
    if (editOfferData?.offer) {
      const offer = editOfferData.offer;
      setArtistName(offer.artist_name || "");
      if (offer.date) {
        setEventDate(new Date(offer.date));
      }
      setVenueType(offer.venue || "");
      setVenueAddress(offer.venue_address || "");
      setCityStateZip(offer.city_state_country_zip || "");
      setVenuePhone(offer.venue_phone || "");
      setOfferAmount(offer.offer_amount || "");
      setAirfare(offer.airfare || "");
      setBackline(offer.backline || "");
      setHotelTransport(offer.hotel_ground_transportation || "");
      setCatering(offer.catering || "");
      setProductionSoundLights(offer.first_class_sound_and_lighting || "");
      setDoorTimeLength(offer.door_time || "");
      setExpectedAttendance(offer.expected_attendance ? String(offer.expected_attendance) : "");
      setPastPerformers(offer.past_performers || "");
      setSocialRequests(offer.social_media_request || "");
      setEventFor(offer.what_is_event_for || "");
      setOtherArtists(offer.other_artists || "");
      setSignatoryName(offer.contact_signatory_name || "");
      setSignatoryAddress(offer.contact_signatory_address || "");
      setSignatoryPhone(offer.contact_signatory_contact_info || "");
      setBuyerName(offer.contact_buyer_name || "");
      setBuyerAddress(offer.contact_buyer_address || "");
      setBuyerPhone(offer.contact_buyer_contact_info || "");
      setProdName(offer.contact_production_name || "");
      setProdPhone(offer.contact_production_contact_info || "");
      setNoteText(offer.additional_notes || "");

      if (offer.team_shares) {
        setSelectedTeamIds(offer.team_shares.map((ts: any) => ts.team?.id).filter(Boolean));
      }
      if (offer.user_shares && offer.user_shares.length > 0) {
        setSelectedUserId(offer.user_shares[0].user?.id || null);
      }
      if (offer.included_facilities) {
        const facs = offer.included_facilities || [];
        setSoundSystem(facs.includes("Sound System"));
        setLightening(facs.includes("Lighting"));
        setStaging(facs.includes("Staging"));
        setGroundTransport(facs.includes("Ground Transportation"));
        setHospitality(facs.includes("Hospitality"));
      }
    }
  }, [editOfferData]);

  const clearSignature = () => {
    sigCanvasRef.current?.clear();
  };

  // Helper functionality
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    if (!tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
    }
    setNewTagInput("");
    setShowTagForm(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const toggleTeamSelection = (id: number) => {
    setSelectedTeamIds((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    );
  };

  const toggleUserSelection = (id: number) => {
    setSelectedUserId((prev) => (prev === id ? null : id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDoc: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        uploadedAt: "Today"
      };
      setDocuments([...documents, newDoc]);
      setActualFiles([...actualFiles, file]);
      toast.success(`File "${file.name}" uploaded.`);
    }
  };

  const handleRemoveDocument = (id: string, name: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
    setActualFiles(actualFiles.filter((f) => f.name !== name));
    toast.success(`Document "${name}" deleted.`);
  };

  const handleNotificationsClick = () => {
    window.dispatchEvent(new CustomEvent("open-notifications"));
  };

  // Function to generate the contract PDF dynamically
  const generatePDF = async (): Promise<Blob> => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 165, 229); // #00A5E5
    doc.text("Booking Offer", 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 27);

    doc.setDrawColor(220, 220, 220);
    doc.line(20, 31, 190, 31);

    let y = 40;
    const addField = (label: string, val: string) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(`${label}:`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(90, 90, 90);
      doc.text(val || "N/A", 75, y);
      y += 7;
    };

    const addSection = (title: string) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      y += 3;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(0, 119, 168); // #0077A8
      doc.text(title, 20, y);
      y += 5;
      doc.line(20, y, 190, y);
      y += 7;
    };

    // 1. Event Details
    addSection("Event Details");
    addField("Associated Inquiry ID", selectedInquiryId ? String(selectedInquiryId) : "None");
    addField("Artist Name", artistName);
    addField("Event Date", eventDate ? eventDate.toLocaleDateString() : "N/A");
    addField("Venue Type (Indoor/Outdoor)", venueType);
    addField("Venue Address", venueAddress);
    addField("City / State / Zip", cityStateZip);
    addField("Venue Phone", venuePhone);

    // 2. Financial Requirements
    addSection("Financial & Production Requirements");
    addField("Offer Amount", offerAmount);
    addField("Airfare", airfare);
    addField("Backline", backline);
    addField("Hotel & Ground Transport", hotelTransport);
    addField("Catering", catering);
    addField("First Class Sound & Lights", productionSoundLights);

    // 3. Performance Information
    addSection("Performance Information");
    addField("Door Time / Set Length", doorTimeLength);
    addField("Expected Attendance", expectedAttendance);
    addField("Past Performers", pastPerformers);
    addField("Social Media Requests", socialRequests);
    addField("Who/What Event For", eventFor);
    addField("Other Artists", otherArtists);

    // 4. Contact Information
    addSection("Contact Information");
    addField("Signatory Name", signatoryName);
    addField("Signatory Address", signatoryAddress);
    addField("Signatory Contact", signatoryPhone);
    addField("Buyer Name", buyerName);
    addField("Buyer Address", buyerAddress);
    addField("Buyer Contact", buyerPhone);
    addField("Production Name", prodName);
    addField("Production Contact", prodPhone);

    // 5. Additional Notes
    if (noteText) {
      addSection("Additional Notes");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(90, 90, 90);
      const splitText = doc.splitTextToSize(noteText, 165);
      doc.text(splitText, 20, y);
      y += (splitText.length * 5) + 3;
    }

    // 6. Included Items & Tags
    addSection("Also Included");
    const inclusions = [];
    if (soundSystem) inclusions.push("Sound System");
    if (lightening) inclusions.push("Lightening");
    if (staging) inclusions.push("Staging");
    if (groundTransport) inclusions.push("Ground Transportation");
    if (hospitality) inclusions.push("Hospitality");
    addField("Included Systems", inclusions.join(", ") || "None");
    if (tags.length > 0) {
      addField("Tags", tags.join(", "));
    }

    // 7. Signature
    addSection("Signature & Authorization");
    if (signatureTab === "draw" && sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      const dataUrl = sigCanvasRef.current.getTrimmedCanvas().toDataURL("image/png");
      if (y > 230) {
        doc.addPage();
        y = 20;
      }
      doc.text("Authorized Signature:", 20, y);
      doc.addImage(dataUrl, "PNG", 20, y + 3, 70, 25);
      y += 32;
    } else if (signatureTab === "upload" && uploadedSignatureFile) {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(uploadedSignatureFile);
      });
      if (y > 230) {
        doc.addPage();
        y = 20;
      }
      doc.text("Authorized Signature (Uploaded):", 20, y);
      doc.addImage(dataUrl, "PNG", 20, y + 3, 70, 25);
      y += 32;
    } else {
      doc.text("No Signature Provided.", 20, y);
      y += 8;
    }

    return doc.output("blob");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDate) {
      toast.error("Please select an event date.");
      return;
    }
    if (!legalChecked) {
      toast.error("Please agree to the LEGAL NOTICE before sending the offer.");
      return;
    }
    if (signatureTab === "draw") {
      if (sigCanvasRef.current?.isEmpty()) {
        toast.error("Please draw your signature before sending the offer.");
        return;
      }
    } else if (signatureTab === "upload" && !uploadedSignatureFile) {
      toast.error("Please upload your signature before sending the offer.");
      return;
    }

    try {
      const formData = new FormData();

      // Clean numeric inputs
      const cleanNumber = (val: string) => {
        const cleaned = val.replace(/[^0-9.]/g, "");
        return cleaned && !isNaN(Number(cleaned)) ? cleaned : "0";
      };

      // Format time to hh:mm:ss
      const formatTime = (val: string) => {
        const timeRegex = /(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?/i;
        const match = val.match(timeRegex);
        if (match) {
          let hours = parseInt(match[1]);
          const minutes = match[2];
          const seconds = match[3] || "00";
          const ampm = match[4];

          if (ampm) {
            if (ampm.toLowerCase() === "pm" && hours < 12) {
              hours += 12;
            }
            if (ampm.toLowerCase() === "am" && hours === 12) {
              hours = 0;
            }
          }
          const formattedHours = String(hours).padStart(2, "0");
          return `${formattedHours}:${minutes}:${seconds}`;
        }
        return "00:00:00"; // Fallback required by backend format
      };

      // Append text / generic fields
      formData.append("artist_name", artistName);
      formData.append("date", eventDate.toISOString().split("T")[0]);
      formData.append("venue", venueType);
      formData.append("venue_address", venueAddress);
      formData.append("city_state_country_zip", cityStateZip);
      formData.append("venue_phone", venuePhone);

      // Financial values (cleaned to valid numbers)
      formData.append("offer_amount", cleanNumber(offerAmount));
      formData.append("airfare", cleanNumber(airfare));
      formData.append("backline", cleanNumber(backline));
      formData.append("hotel_ground_transportation", cleanNumber(hotelTransport));
      formData.append("catering", cleanNumber(catering));
      formData.append("first_class_sound_and_lighting", cleanNumber(productionSoundLights));

      // Performance info
      formData.append("door_time", formatTime(doorTimeLength));
      formData.append("expected_attendance", String(expectedAttendance ? parseInt(expectedAttendance) || 0 : 0));
      formData.append("past_performers", pastPerformers);
      formData.append("social_media_request", socialRequests);
      formData.append("what_is_event_for", eventFor);
      formData.append("other_artists", otherArtists);

      // Contacts
      formData.append("contact_signatory_name", signatoryName);
      formData.append("contact_signatory_address", signatoryAddress);
      formData.append("contact_signatory_contact_info", signatoryPhone);
      formData.append("contact_buyer_name", buyerName);
      formData.append("contact_buyer_address", buyerAddress);
      formData.append("contact_buyer_contact_info", buyerPhone);
      formData.append("contact_production_name", prodName);
      formData.append("contact_production_contact_info", prodPhone);
      formData.append("additional_notes", noteText);

      // IDs (URL Inquiry ID or fallback)
      if (inquiryId) {
        formData.append("inquiry_id", inquiryId);
      }
      formData.append("receiver_id", "1"); // Receiver placeholder

      // Append selected team IDs
      selectedTeamIds.forEach((id) => {
        formData.append("team_ids", String(id));
      });

      // Append selected user ID (only one allowed)
      if (selectedUserId) {
        formData.append("user_ids", String(selectedUserId));
      }

      // Append included facilities as array of strings
      const facilities: string[] = [];
      if (soundSystem) facilities.push("Sound System");
      if (lightening) facilities.push("Lighting");
      if (staging) facilities.push("Staging");
      if (groundTransport) facilities.push("Ground Transportation");
      if (hospitality) facilities.push("Hospitality");

      formData.append("included_facilities", JSON.stringify(facilities));

      // 1. Append Signature
      if (signatureTab === "draw" && sigCanvasRef.current) {
        const canvas = sigCanvasRef.current.getTrimmedCanvas();
        const signatureBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((blob) => resolve(blob), "image/png");
        });
        if (signatureBlob) {
          formData.append("signature", signatureBlob, "signature.png");
        }
      } else if (signatureTab === "upload" && uploadedSignatureFile) {
        formData.append("signature", uploadedSignatureFile);
      }

      // 2. Append User-uploaded documents
      actualFiles.forEach((file) => {
        formData.append("files", file);
      });

      // 3. Generate & Append PDF Document
      const pdfBlob = await generatePDF();
      const pdfFilename = `${(artistName || "booking_offer").replace(/\s+/g, "_")}.pdf`;
      formData.append("files", pdfBlob, pdfFilename);

      if (editId) {
        toast.loading("Updating offer...", { id: "create-offer" });
        await updateOffer({ id: editId, data: formData }).unwrap();
        toast.success("Offer successfully updated!", { id: "create-offer" });
      } else {
        toast.loading("Sending offer...", { id: "create-offer" });
        await createOffer(formData).unwrap();
        toast.success("Offer successfully sent to parties!", { id: "create-offer" });
      }
      router.push("/dashboard/offers");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to send the offer. Please try again.", { id: "create-offer" });
    }
  };

  if (checkingAccess) {
    return <LogoLoader fullScreen={true} text="Verifying permissions..." />;
  }

  return (
    <div className="">
      {/* Top Header Row (All devices, responsive matches design system) */}
      <header className="w-full px-4 md:px-8 lg:px-10 pt-4 md:pt-8 lg:pt-10 pb-5 border-b border-zinc-900/60 bg-[#050505] shrink-0">
        <CommonHeader
          title={editId ? "Update Offer" : "Create Offer"}
          subtitle={editId ? "Update details of the booking offer" : "Fill in the details to send a booking offer"}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </header>

      {/* Back button (Visible on all devices) */}
      <div className="max-w-5xl mx-auto w-full mt-4 mb-4 px-4 sm:px-6 lg:px-0">
        <button
          type="button"
          onClick={() => router.push("/dashboard/offers")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Offers
        </button>
      </div>


      {/* Main sheet wrapper */}
      <div
        style={{
          backgroundColor: "#0F0F0F",
          borderWidth: "1.24px",
          borderColor: "rgba(255, 255, 255, 0.12)",
          boxShadow: "0px 39.54px 98.84px 0px rgba(0, 0, 0, 0.85)"
        }}
        className="max-w-5xl mx-auto p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 rounded-none sm:rounded-[24.71px]"
      >

        {/* Firm Offer Warning notice styled matching Figma */}
        {/* <div
          className="text-zinc-300 font-sans text-[10px] sm:text-xs font-semibold tracking-wider uppercase space-y-3 pt-2"
        >
          <p>
            PLEASE TYPE IN THE FOLLOWING FIELDS, PRINT OFFER, SIGN AND RETURN VIA EMAIL TO TROY@SEATTLETALENTBUYING.COM.
          </p>
          <p>
            PLEASE REVIEW YOUR OFFER CAREFULLY BEFORE SENDING BACK. THIS IS A FIRM OFFER THAT IS BINDING IF THE ARTISTS ACCEPTS IT.
          </p>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

          <VenueInformation
            artistName={artistName}
            setArtistName={setArtistName}
            eventDate={eventDate}
            setEventDate={setEventDate}
            venueType={venueType}
            setVenueType={setVenueType}
            venueAddress={venueAddress}
            setVenueAddress={setVenueAddress}
            cityStateZip={cityStateZip}
            setCityStateZip={setCityStateZip}
            venuePhone={venuePhone}
            setVenuePhone={setVenuePhone}
            subCardClassName={subCardClassName}
          />

          <FinancialRequirements
            offerAmount={offerAmount}
            setOfferAmount={setOfferAmount}
            airfare={airfare}
            setAirfare={setAirfare}
            backline={backline}
            setBackline={setBackline}
            hotelTransport={hotelTransport}
            setHotelTransport={setHotelTransport}
            catering={catering}
            setCatering={setCatering}
            productionSoundLights={productionSoundLights}
            setProductionSoundLights={setProductionSoundLights}
            subCardClassName={subCardClassName}
          />

          <PerformanceInformation
            doorTimeLength={doorTimeLength}
            setDoorTimeLength={setDoorTimeLength}
            expectedAttendance={expectedAttendance}
            setExpectedAttendance={setExpectedAttendance}
            pastPerformers={pastPerformers}
            setPastPerformers={setPastPerformers}
            socialRequests={socialRequests}
            setSocialRequests={setSocialRequests}
            eventFor={eventFor}
            setEventFor={setEventFor}
            otherArtists={otherArtists}
            setOtherArtists={setOtherArtists}
            subCardClassName={subCardClassName}
          />

          <ContactInformation
            signatoryName={signatoryName}
            setSignatoryName={setSignatoryName}
            signatoryAddress={signatoryAddress}
            setSignatoryAddress={setSignatoryAddress}
            signatoryPhone={signatoryPhone}
            setSignatoryPhone={setSignatoryPhone}
            buyerName={buyerName}
            setBuyerName={setBuyerName}
            buyerAddress={buyerAddress}
            setBuyerAddress={setBuyerAddress}
            buyerPhone={buyerPhone}
            setBuyerPhone={setBuyerPhone}
            prodName={prodName}
            setProdName={setProdName}
            prodPhone={prodPhone}
            setProdPhone={setProdPhone}
            subCardClassName={subCardClassName}
          />

          <AlsoIncluded
            soundSystem={soundSystem}
            setSoundSystem={setSoundSystem}
            lightening={lightening}
            setLightening={setLightening}
            staging={staging}
            setStaging={setStaging}
            groundTransport={groundTransport}
            setGroundTransport={setGroundTransport}
            hospitality={hospitality}
            setHospitality={setHospitality}
            tags={tags}
            handleRemoveTag={handleRemoveTag}
            showTagForm={showTagForm}
            setShowTagForm={setShowTagForm}
            newTagInput={newTagInput}
            setNewTagInput={setNewTagInput}
            handleAddTag={handleAddTag}
            noteText={noteText}
            setNoteText={setNoteText}
            subCardClassName={subCardClassName}
          />

          {/* Share Section with Tabs */}
          <div className={`${shareTeamContainerClassName} space-y-6`}>
            {/* Tabs Header */}
            <div className="flex border-b border-white/10 pb-1">
              <button
                type="button"
                onClick={() => setSharingTab("team")}
                className={`pb-4 px-6 text-sm font-bold tracking-wider uppercase transition-colors relative cursor-pointer ${
                  sharingTab === "team" ? "text-[#00A5E5]" : "text-zinc-400 hover:text-white"
                }`}
              >
                Share With Team
                {sharingTab === "team" && (
                  <motion.div 
                    layoutId="sharingActiveTabLine"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00A5E5]"
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => setSharingTab("user")}
                className={`pb-4 px-6 text-sm font-bold tracking-wider uppercase transition-colors relative cursor-pointer ${
                  sharingTab === "user" ? "text-[#00A5E5]" : "text-zinc-400 hover:text-white"
                }`}
              >
                Share With Users
                {sharingTab === "user" && (
                  <motion.div 
                    layoutId="sharingActiveTabLine"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00A5E5]"
                  />
                )}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              <AnimatePresence mode="wait">
                {sharingTab === "team" ? (
                  <motion.div
                    key="team-tab"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ShareWithTeam
                      allTeams={team?.results || []}
                      selectedTeamIds={selectedTeamIds}
                      toggleTeamSelection={toggleTeamSelection}
                      teamSearch={teamSearch}
                      setTeamSearch={setTeamSearch}
                      shareTeamContainerClassName="bg-transparent border-0 p-0 shadow-none"
                      isLoading={teamLoading}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="user-tab"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ShareWithUsers
                      allUsers={displayedUsers}
                      selectedUserIds={selectedUserId ? [selectedUserId] : []}
                      toggleUserSelection={toggleUserSelection}
                      userSearch={userSearch}
                      setUserSearch={setUserSearch}
                      shareTeamContainerClassName="bg-transparent border-0 p-0 shadow-none"
                      isLoading={usersLoading}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <DocumentsSection
            documents={documents}
            handleRemoveDocument={handleRemoveDocument}
            handleFileUpload={handleFileUpload}
            documentInputRef={documentInputRef}
            shareTeamContainerClassName={shareTeamContainerClassName}
          />

          <LegalNotice
            legalChecked={legalChecked}
            setLegalChecked={setLegalChecked}
            showFullLegal={showFullLegal}
            setShowFullLegal={setShowFullLegal}
          />

          <SignatureSection
            signatureTab={signatureTab}
            setSignatureTab={setSignatureTab}
            sigCanvasRef={sigCanvasRef}
            fileInputRef={fileInputRef}
            clearSignature={clearSignature}
            onSignatureFileChange={setUploadedSignatureFile}
          />

          {/* Bottom Cancel & Send buttons row */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-zinc-900 pt-8 font-sans w-full">
            <button
              type="button"
              disabled={createOfferLoading}
              onClick={() => router.push("/dashboard/offers")}
              style={{
                border: "1px solid rgba(255, 255, 255, 0.12)",
                backgroundColor: "transparent",
                borderRadius: "12.36px",
                height: "52px",
                fontSize: "15px",
                fontWeight: 600
              }}
              className="w-full sm:flex-1 px-4 hover:bg-zinc-900 text-zinc-300 cursor-pointer transition-all text-center flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createOfferLoading || updateOfferLoading}
              style={{
                background: "linear-gradient(90deg, #00A5E5 0%, #0077A8 100%)",
                borderRadius: "12.36px",
                height: "52px",
                fontSize: "15px",
                fontWeight: 600,
                opacity: (createOfferLoading || updateOfferLoading) ? 0.6 : 1
              }}
              className="w-full sm:flex-1 hover:brightness-110 text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-cyan-500/10 disabled:cursor-not-allowed"
            >
              {(createOfferLoading || updateOfferLoading) ? (
                <span>{editId ? "Updating..." : "Sending..."}</span>
              ) : (
                <>
                  <FileText className="h-4.5 w-4.5" />
                  {editId ? "Update Offer" : "Send Offer"}
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
