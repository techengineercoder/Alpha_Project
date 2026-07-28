"use client";

import React from "react";
import { CustomInput } from "@/components/ui/custom-offer-fields";

interface FinancialRequirementsProps {
  offerAmount: string;
  setOfferAmount: (val: string) => void;
  airfare: string;
  setAirfare: (val: string) => void;
  backline: string;
  setBackline: (val: string) => void;
  hotelTransport: string;
  setHotelTransport: (val: string) => void;
  catering: string;
  setCatering: (val: string) => void;
  productionSoundLights: string;
  setProductionSoundLights: (val: string) => void;
  subCardStyle: React.CSSProperties;
}

export const FinancialRequirements: React.FC<FinancialRequirementsProps> = ({
  offerAmount,
  setOfferAmount,
  airfare,
  setAirfare,
  backline,
  setBackline,
  hotelTransport,
  setHotelTransport,
  catering,
  setCatering,
  productionSoundLights,
  setProductionSoundLights,
  subCardStyle
}) => {
  return (
    <div style={subCardStyle} className="space-y-6">
      <h3 className="text-sm font-bold text-white tracking-wide border-b border-zinc-900 pb-3 font-sans">
        Financial & Production Requirements
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomInput
          label="Offer Amount"
          value={offerAmount}
          onChange={(e) => setOfferAmount(e.target.value)}
          placeholder="$32,500"
          required
        />
        <CustomInput
          label="Airfare (provided or buyout on top or N/A)"
          value={airfare}
          onChange={(e) => setAirfare(e.target.value)}
          placeholder="N/A"
          required
        />
        <CustomInput
          label="Backline (provided or buyout on top or N/A)"
          value={backline}
          onChange={(e) => setBackline(e.target.value)}
          placeholder="Per rider"
          required
        />
        <CustomInput
          label="Hotel + Ground Transportation * (provided or buyout on top or N/A)"
          value={hotelTransport}
          onChange={(e) => setHotelTransport(e.target.value)}
          placeholder="Per rider"
        />
        <CustomInput
          label="Catering (provided or buyout on top or N/A)"
          value={catering}
          onChange={(e) => setCatering(e.target.value)}
          placeholder="Hotel/casino food accommodations"
          required
        />
        <CustomInput
          label="First Class Sound & Lights and Production (Required)"
          value={productionSoundLights}
          onChange={(e) => setProductionSoundLights(e.target.value)}
          placeholder="Venue Provides"
          required
        />
      </div>
    </div>
  );
};
