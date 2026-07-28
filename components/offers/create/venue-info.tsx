"use client";

import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { CustomInput } from "@/components/ui/custom-offer-fields";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface VenueInformationProps {
  offerName: string;
  setOfferName: (val: string) => void;
  artistName: string;
  setArtistName: (val: string) => void;
  eventDate: Date | undefined;
  setEventDate: (date: Date | undefined) => void;
  venueType: string;
  setVenueType: (val: string) => void;
  venueAddress: string;
  setVenueAddress: (val: string) => void;
  cityStateZip: string;
  setCityStateZip: (val: string) => void;
  venuePhone: string;
  setVenuePhone: (val: string) => void;
  subCardStyle: React.CSSProperties;
}

export const VenueInformation: React.FC<VenueInformationProps> = ({
  offerName,
  setOfferName,
  artistName,
  setArtistName,
  eventDate,
  setEventDate,
  venueType,
  setVenueType,
  venueAddress,
  setVenueAddress,
  cityStateZip,
  setCityStateZip,
  venuePhone,
  setVenuePhone,
  subCardStyle
}) => {
  return (
    <>
      {/* Offer Name Input field */}
      <div className="space-y-2">
        <label 
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "20px",
            letterSpacing: "0px",
            color: "rgba(255, 255, 255, 0.80)"
          }}
          className="block"
        >
          Offer Name
        </label>
        <input
          type="text"
          value={offerName}
          onChange={(e) => setOfferName(e.target.value)}
          placeholder="e.g. Nova Reyes @ Bluewave Festival"
          style={{
            backgroundColor: "#18181F",
            borderWidth: "1px",
            borderColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            height: "50px"
          }}
          className="w-full text-sm text-white placeholder-zinc-650 px-4 focus:outline-none focus:border-[#00A5E5]/50 transition-colors font-sans"
        />
      </div>

      {/* Event Details section */}
      <div style={subCardStyle} className="space-y-6">
        <h3 className="text-sm font-bold text-white tracking-wide border-b border-zinc-900 pb-3 font-sans">
          Event Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            label="Artist Name"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            placeholder="Queensryche"
            required
          />
          <div className="flex flex-col space-y-2 w-full font-sans">
            <label 
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                letterSpacing: "0px",
                color: "rgba(255, 255, 255, 0.80)"
              }}
              className="block"
            >
              Date (Month / Day / Year) <span className="text-[#00A5E5]">*</span>
            </label>
            <Popover>
              <PopoverTrigger>
                <div
                  style={{
                    backgroundColor: "#18181F",
                    borderWidth: "1px",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    height: "50px"
                  }}
                  className="w-full text-sm text-left px-4 focus:outline-none focus:border-[#00A5E5]/50 transition-colors flex items-center justify-between cursor-pointer font-sans"
                >
                  <span className={eventDate ? "text-white" : "text-zinc-650"}>
                    {eventDate ? format(eventDate, "PPP") : "Select event date..."}
                  </span>
                  <CalendarIcon className="h-4.5 w-4.5 text-zinc-500" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#0F0F12] border border-white/10 rounded-2xl shadow-2xl" align="start">
                <Calendar
                  mode="single"
                  selected={eventDate}
                  onSelect={setEventDate}
                  initialFocus
                  className="bg-[#0F0F12] text-white p-3 rounded-2xl"
                />
              </PopoverContent>
            </Popover>
          </div>
          <CustomInput
            label="Venue (Indoor/Outdoor)"
            value={venueType}
            onChange={(e) => setVenueType(e.target.value)}
            placeholder="Skagit Valley Casino and Resort"
            required
          />
          <CustomInput
            label="Venue Address"
            value={venueAddress}
            onChange={(e) => setVenueAddress(e.target.value)}
            placeholder="5984 Darrk Ln"
            required
          />
          <CustomInput
            label="City / State / Country / Zip Code"
            value={cityStateZip}
            onChange={(e) => setCityStateZip(e.target.value)}
            placeholder="Bow, WA 98232"
            required
          />
          <CustomInput
            label="Venue Phone Number"
            value={venuePhone}
            onChange={(e) => setVenuePhone(e.target.value)}
            placeholder="(877) 275-2448"
            required
          />
        </div>
      </div>
    </>
  );
};
