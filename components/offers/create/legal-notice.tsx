"use client";

import React from "react";
import { CustomCheckbox } from "@/components/ui/custom-offer-fields";

interface LegalNoticeProps {
  legalChecked: boolean;
  setLegalChecked: (val: boolean) => void;
  showFullLegal: boolean;
  setShowFullLegal: (val: boolean) => void;
}

export const LegalNotice: React.FC<LegalNoticeProps> = ({
  legalChecked,
  setLegalChecked,
  showFullLegal,
  setShowFullLegal
}) => {
  return (
    <div className="space-y-6 font-sans">
      <div className="text-base font-normal leading-[150%] text-[#A1A1AA] space-y-6">
        <p>
          LEGAL NOTICE: Upon approval and acceptance by artist's management, your offer represents a binding agreement. If your offer has been approved by management, you are legally responsible to pay the full negotiated price whether or not you have returned contracts or paid a deposit. If the artist accepts the offer and you cancel for any reason, you will be liable for payment of the full agreed upon compensation.{" "}
          {!showFullLegal && (
            <button
              type="button"
              onClick={() => setShowFullLegal(true)}
              className="text-[#A1A1AA] underline font-normal cursor-pointer focus:outline-none"
            >
              View more
            </button>
          )}
        </p>

        {showFullLegal && (
          <div className="space-y-6">
            <p>
              1) UPON APPROVAL AND ACCEPTANCE BY ARTIST'S MANAGEMENT, YOUR OFFER REPRESENTS A NON-BINDING AGREEMENT IF YOUR OFFER HAS BEEN APPROVED BY MANAGEMENT, YOU ARE LEGALLY RESPONSIBLE TO PAY THE FULL NEGOTIATED PRICE WHETHER OR NOT YOU HAVE RETURNED CONTRACTS OR PAID A DEPOSIT.
            </p>

            <div className="space-y-4">
              <span className="block font-bold text-zinc-300">
                2) OUR EXPECTATIONS:
              </span>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-[#A1A1AA] mt-1.5 font-bold text-[10px] shrink-0">&bull;</span>
                  <span>We expect contracts and riders to be signed and returned in an expedient fashion.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A1A1AA] mt-1.5 font-bold text-[10px] shrink-0">&bull;</span>
                  <span>Unless noted otherwise, deposits are to be paid via wire transfer, certified check, or money order and are due on or before the due date listed on the deal sheet and SEG contract.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A1A1AA] mt-1.5 font-bold text-[10px] shrink-0">&bull;</span>
                  <span>Unless otherwise stated on the SEG contract, the balance of guarantee is to be paid to Artist day of show, prior to performance, via certified check made payable to Artist’s Corporation name. The ONLY exception is if SEG has received and processed the FULL Artist Guarantee at least two (2) weeks prior to Artist's performance OR as stated on SEG contract.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A1A1AA] mt-1.5 font-bold text-[10px] shrink-0">&bull;</span>
                  <span>We expect professionalism and utmost diligence in carrying out ALL requirements specified in the contracts and riders.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A1A1AA] mt-1.5 font-bold text-[10px] shrink-0">&bull;</span>
                  <span>Purchaser to notify us immediately of any and all conflicts or problems with your date, i.e. weather. The Artist will make reasonable efforts to accommodate such conflict. In the event Artist cannot, you will remain liable to Artist for the agreed upon terms.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A1A1AA] mt-1.5 font-bold text-[10px] shrink-0">&bull;</span>
                  <span>We expect the Artist to be treated with respect and not to be put in any circumstance i.e. song requests, taping of performance, changes to show time or meet & greets etc., that was not previously agreed to in writing with Artist's agent and manager.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A1A1AA] mt-1.5 font-bold text-[10px] shrink-0">&bull;</span>
                  <span>All terms are strictly confidential - no details of Artists fee, expenses, or Artist's rider are to be made public at any time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A1A1AA] mt-1.5 font-bold text-[10px] shrink-0">&bull;</span>
                  <span>Note: If your event is a charity function or fundraiser, you hereby warrant that the Artist's fee is under written or sponsored and is NOT dependent on ticket sales.</span>
                </li>
              </ul>
            </div>

            <p>
              If this offer is accepted by or on behalf of the Artist, SEG will prepare more formal material for this terms offer together with the balance of the Artist's requirements; however, until such time, such formal Documentation is prepared; this offer, if accepted by or on behalf of Artist, shall be a binding contract. It is expressly agreed that IF the undersigned entity is not the buyer itself, the undersigned shall be jointly and severally liable to the Artist to fulfill the terms outlined in this offer, namely the payment obligations. Please sign below, indicating acknowledgment and return to SEG.
            </p>

            <button
              type="button"
              onClick={() => setShowFullLegal(false)}
              className="text-[#A1A1AA] underline font-normal cursor-pointer focus:outline-none block mt-4"
            >
              View less
            </button>
          </div>
        )}
      </div>
      <CustomCheckbox
        checked={legalChecked}
        onChange={setLegalChecked}
        label={
          <span className="text-base font-semibold text-zinc-300 group-hover:text-white transition-colors">
            I agree with the <span className="text-[#00A5E5] underline">LEGAL NOTICE</span>
          </span>
        }
      />
    </div>
  );
};
