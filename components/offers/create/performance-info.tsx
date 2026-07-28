"use client";

import React from "react";
import { CustomInput } from "@/components/ui/custom-offer-fields";

interface PerformanceInformationProps {
  doorTimeLength: string;
  setDoorTimeLength: (val: string) => void;
  expectedAttendance: string;
  setExpectedAttendance: (val: string) => void;
  pastPerformers: string;
  setPastPerformers: (val: string) => void;
  socialRequests: string;
  setSocialRequests: (val: string) => void;
  eventFor: string;
  setEventFor: (val: string) => void;
  otherArtists: string;
  setOtherArtists: (val: string) => void;
  subCardStyle: React.CSSProperties;
}

export const PerformanceInformation: React.FC<PerformanceInformationProps> = ({
  doorTimeLength,
  setDoorTimeLength,
  expectedAttendance,
  setExpectedAttendance,
  pastPerformers,
  setPastPerformers,
  socialRequests,
  setSocialRequests,
  eventFor,
  setEventFor,
  otherArtists,
  setOtherArtists,
  subCardStyle
}) => {
  return (
    <div style={subCardStyle} className="space-y-6">
      <h3 className="text-sm font-bold text-white tracking-wide border-b border-zinc-900 pb-3 font-sans">
        Performance Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomInput
          label="Door Time / Event Start / Set Time & Length"
          value={doorTimeLength}
          onChange={(e) => setDoorTimeLength(e.target.value)}
          placeholder="N/A"
          required
        />
        <CustomInput
          label="Expected Attendance"
          value={expectedAttendance}
          onChange={(e) => setExpectedAttendance(e.target.value)}
          placeholder="1000"
          required
        />
        <CustomInput
          label="Past Performers (if any)"
          value={pastPerformers}
          onChange={(e) => setPastPerformers(e.target.value)}
          placeholder="N/A"
        />
        <CustomInput
          label="Public Elements or Social Media Requests"
          value={socialRequests}
          onChange={(e) => setSocialRequests(e.target.value)}
          placeholder="N/A"
        />
        <CustomInput
          label="Who/What is this Event For"
          value={eventFor}
          onChange={(e) => setEventFor(e.target.value)}
          placeholder="Skagit Valley Casino & Resort Ticket Holders"
          required
        />
        <CustomInput
          label="Other Artist(s) on Show (if any)"
          value={otherArtists}
          onChange={(e) => setOtherArtists(e.target.value)}
          placeholder="N/A"
        />
      </div>
    </div>
  );
};
