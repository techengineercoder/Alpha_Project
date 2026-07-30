"use client";

import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  Bell,
  FileText,
  Search,
  X
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";

import { VenueInformation } from "@/components/offers/create/venue-info";
import { FinancialRequirements } from "@/components/offers/create/financial-requirements";
import { PerformanceInformation } from "@/components/offers/create/performance-info";
import { ContactInformation } from "@/components/offers/create/contact-info";
import { AlsoIncluded } from "@/components/offers/create/also-included";
import { ShareWithTeam } from "@/components/offers/create/share-with-team";
import { DocumentsSection } from "@/components/offers/create/documents-section";
import { LegalNotice } from "@/components/offers/create/legal-notice";
import { SignatureSection } from "@/components/offers/create/signature-section";
import { CommonHeader } from "@/components/dashboard/page-header";

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

const subCardStyle = {
  backgroundColor: "rgba(18, 18, 24, 0.60)",
  borderWidth: "1px",
  borderColor: "rgba(255, 255, 255, 0.08)",
  borderRadius: "16px",
  paddingTop: "30px",
  paddingBottom: "30px",
  paddingLeft: "32px",
  paddingRight: "32px",
  boxShadow: "0px 25px 50px 0px rgba(0, 0, 0, 0.25)"
};

const shareTeamContainerStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  borderWidth: "1.24px",
  borderColor: "rgba(255, 255, 255, 0.12)",
  borderRadius: "24.71px",
  padding: "29.65px",
  boxShadow: "0px 25px 50px 0px rgba(0, 0, 0, 0.25)"
};


export default function CreateOfferPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Form State Values starting empty so they use placeholders
  const [offerName, setOfferName] = useState("");
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
  const [teams, setTeams] = useState<TeamCard[]>([
    { id: "1", name: "Team A", avatarChar: "NR", avatarBg: "bg-indigo-600", description: "Apex Agency" },
    { id: "2", name: "Team B", avatarChar: "DC", avatarBg: "bg-amber-600", description: "Bluewave Festival" },
    { id: "3", name: "Team C", avatarChar: "RG", avatarBg: "bg-emerald-600", description: "Cap. 8,000" }
  ]);
  const [teamSearch, setTeamSearch] = useState("");

  // Documents
  const [documents, setDocuments] = useState<UploadedFile[]>([
    { id: "1", name: "rider_v2.pdf", size: "240 KB", uploadedAt: "Jun 2" },
    { id: "2", name: "stage_plot.pdf", size: "180 KB", uploadedAt: "Jun 2" },
    { id: "3", name: "contract_draft.pdf", size: "380 KB", uploadedAt: "Jun 3" }
  ]);

  // Legal Notice agreement
  const [legalChecked, setLegalChecked] = useState(false);
  const [showFullLegal, setShowFullLegal] = useState(false);

  // Signature selection: "draw" or "upload"
  const [signatureTab, setSignatureTab] = useState<"draw" | "upload">("draw");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const sigCanvasRef = useRef<SignatureCanvas>(null);

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

  const handleRemoveTeam = (id: string, name: string) => {
    setTeams(teams.filter((t) => t.id !== id));
    toast.success(`Removed "${name}" from team selection.`);
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
      toast.success(`File "${file.name}" uploaded.`);
    }
  };

  const handleRemoveDocument = (id: string, name: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
    toast.success(`Document "${name}" deleted.`);
  };

  const handleNotificationsClick = () => {
    window.dispatchEvent(new CustomEvent("open-notifications"));
  };

  const handleSubmit = (e: React.FormEvent) => {
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
      const dataUrl = sigCanvasRef.current?.getTrimmedCanvas().toDataURL("image/png");
      console.log("Drawn Signature Data URL:", dataUrl);
    }
    toast.success("Offer successfully sent to parties!");
    router.push("/dashboard/offers");
  };

  return (
    <div className="">
      {/* Top Header Row (All devices, responsive matches design system) */}
      <header className="w-full px-4 md:px-8 lg:px-10 pt-4 md:pt-8 lg:pt-10 pb-5 border-b border-zinc-900/60 bg-[#050505] shrink-0">
        <CommonHeader
          title="Create Offer"
          subtitle="Fill in the details to send a booking offer"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </header>

      {/* Back button (Visible on all devices) */}
      <div className="max-w-5xl mx-auto w-full mb-4">
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
          borderRadius: "24.71px",
          boxShadow: "0px 39.54px 98.84px 0px rgba(0, 0, 0, 0.85)"
        }}
        className="max-w-5xl mx-auto p-6 md:p-10 space-y-8"
      >

        {/* Firm Offer Warning notice styled matching Figma */}
        <div
          style={{
            color: "#CFCFCF",
            fontFamily: "var(--font-sans)",
            fontSize: "12.36px",
            fontWeight: 600,
            lineHeight: "18.53px",
            letterSpacing: "1.85px",
            textTransform: "uppercase",
            minHeight: "75px"
          }}
          className="space-y-4 pt-4"
        >
          <p>
            PLEASE TYPE IN THE FOLLOWING FIELDS, PRINT OFFER, SIGN AND RETURN VIA EMAIL TO TROY@SEATTLETALENTBUYING.COM.
          </p>
          <p>
            PLEASE REVIEW YOUR OFFER CAREFULLY BEFORE SENDING BACK. THIS IS A FIRM OFFER THAT IS BINDING IF THE ARTISTS ACCEPTS IT.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          <VenueInformation
            offerName={offerName}
            setOfferName={setOfferName}
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
            subCardStyle={subCardStyle}
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
            subCardStyle={subCardStyle}
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
            subCardStyle={subCardStyle}
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
            subCardStyle={subCardStyle}
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
            subCardStyle={subCardStyle}
          />

          <ShareWithTeam
            teams={teams}
            handleRemoveTeam={handleRemoveTeam}
            teamSearch={teamSearch}
            setTeamSearch={setTeamSearch}
            shareTeamContainerStyle={shareTeamContainerStyle}
          />

          <DocumentsSection
            documents={documents}
            handleRemoveDocument={handleRemoveDocument}
            handleFileUpload={handleFileUpload}
            documentInputRef={documentInputRef}
            shareTeamContainerStyle={shareTeamContainerStyle}
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
          />

          {/* Bottom Cancel & Preview buttons row */}
          <div className="flex flex-row items-center justify-between gap-4 border-t border-zinc-900 pt-8 font-sans w-full">
            <button
              type="button"
              onClick={() => router.push("/dashboard/offers")}
              style={{
                border: "1px solid rgba(255, 255, 255, 0.12)",
                backgroundColor: "transparent",
                borderRadius: "12.36px",
                height: "52px",
                fontSize: "16.06px",
                lineHeight: "24.09px",
                fontWeight: 600
              }}
              className="flex-1 px-4 hover:bg-zinc-900 text-zinc-350 cursor-pointer transition-all text-center flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: "linear-gradient(90deg, #00A5E5 0%, #0077A8 100%)",
                borderRadius: "12.36px",
                height: "52px",
                fontSize: "16.06px",
                lineHeight: "24.09px",
                fontWeight: 600
              }}
              className="flex-1 hover:brightness-110 text-white flex items-center justify-center gap-[7.41px] cursor-pointer transition-all shadow-lg shadow-cyan-500/10"
            >
              <FileText className="h-4.5 w-4.5" />
              Preview Offer
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
