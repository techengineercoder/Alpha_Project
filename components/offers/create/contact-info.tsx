"use client";

import React from "react";
import { CustomInput } from "@/components/ui/custom-offer-fields";

interface ContactInformationProps {
  signatoryName: string;
  setSignatoryName: (val: string) => void;
  signatoryAddress: string;
  setSignatoryAddress: (val: string) => void;
  signatoryPhone: string;
  setSignatoryPhone: (val: string) => void;
  buyerName: string;
  setBuyerName: (val: string) => void;
  buyerAddress: string;
  setBuyerAddress: (val: string) => void;
  buyerPhone: string;
  setBuyerPhone: (val: string) => void;
  prodName: string;
  setProdName: (val: string) => void;
  prodPhone: string;
  setProdPhone: (val: string) => void;
  subCardClassName: string;
}

export const ContactInformation: React.FC<ContactInformationProps> = ({
  signatoryName,
  setSignatoryName,
  signatoryAddress,
  setSignatoryAddress,
  signatoryPhone,
  setSignatoryPhone,
  buyerName,
  setBuyerName,
  buyerAddress,
  setBuyerAddress,
  buyerPhone,
  setBuyerPhone,
  prodName,
  setProdName,
  prodPhone,
  setProdPhone,
  subCardClassName
}) => {
  return (
    <div className={`${subCardClassName} space-y-6`}>
      <h3 className="text-sm font-bold text-white tracking-wide border-b border-zinc-900 pb-3 font-sans">
        Contact Information
      </h3>
      
      {/* Sub-sections with vertical blue border indicators */}
      <div className="space-y-8">
        
        {/* Signatory Box */}
        <div className="pl-4 border-l-4 border-l-[#00A5E5] space-y-4">
          <span className="text-xs font-bold text-[#00A5E5] uppercase tracking-wider block font-sans">
            Contract Signatory
          </span>
          <div className="flex flex-col gap-4">
            <CustomInput
              label="Name"
              value={signatoryName}
              onChange={(e) => setSignatoryName(e.target.value)}
              placeholder="Doreen Maloney"
              required
            />
            <CustomInput
              label="Address / City / State / Zip"
              value={signatoryAddress}
              onChange={(e) => setSignatoryAddress(e.target.value)}
              placeholder="5984 Darrk Ln, Bow, WA 98232"
            />
            <CustomInput
              label="Phone / Mobile / Email"
              value={signatoryPhone}
              onChange={(e) => setSignatoryPhone(e.target.value)}
              placeholder="(877) 275-2448"
            />
          </div>
        </div>

        {/* Buyer Contact Box */}
        <div className="pl-4 border-l-4 border-l-[#00A5E5] space-y-4">
          <span className="text-xs font-bold text-[#00A5E5] uppercase tracking-wider block font-sans">
            Buyer Contact
          </span>
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <CustomInput
                label="Name"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Troy Wyatt"
                required
              />
            </div>
            <div className="w-full md:w-[70%]">
              <CustomInput
                label="Address / City / State / Zip"
                value={buyerAddress}
                onChange={(e) => setBuyerAddress(e.target.value)}
                placeholder="Seattle Entertainment Group 425-530-9913"
              />
            </div>
            <div className="w-full md:w-[70%]">
              <CustomInput
                label="Phone / Mobile / Email"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                placeholder="troy@seattletalentbuying.com"
              />
            </div>
          </div>
        </div>

        {/* Production Contact Box */}
        <div className="pl-4 border-l-4 border-l-[#00A5E5] space-y-4">
          <span className="text-xs font-bold text-[#00A5E5] uppercase tracking-wider block font-sans">
            Production Contact
          </span>
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <CustomInput
                label="Name"
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder="Troy Wyatt"
                required
              />
            </div>
            <div className="w-full md:w-[70%]">
              <CustomInput
                label="Phone / Fax / Cell / Email"
                value={prodPhone}
                onChange={(e) => setProdPhone(e.target.value)}
                placeholder="Seattle Entertainment Group 425-530-9913"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
