"use client";

import React from "react";
import { Pencil, Upload } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "sonner";

interface SignatureSectionProps {
  signatureTab: "draw" | "upload";
  setSignatureTab: (val: "draw" | "upload") => void;
  sigCanvasRef: React.RefObject<SignatureCanvas | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  clearSignature: () => void;
  onSignatureFileChange?: (file: File | null) => void;
}

export const SignatureSection: React.FC<SignatureSectionProps> = ({
  signatureTab,
  setSignatureTab,
  sigCanvasRef,
  fileInputRef,
  clearSignature,
  onSignatureFileChange
}) => {
  return (
    <div className="space-y-4 font-sans">
      <h3 className="text-xs font-bold text-zinc-455 uppercase tracking-widest">
        Signature
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Draw Signature Card */}
        <div 
          onClick={() => setSignatureTab("draw")}
          className={`cursor-pointer transition-all flex flex-col space-y-4 rounded-2xl p-4 sm:p-5 bg-[#0C0C0E] border-2 ${
            signatureTab === "draw" ? "border-[#00A5E5]" : "border-white/5"
          }`}
        >
          <div className="flex items-center gap-2">
            <Pencil className="h-4.5 w-4.5 text-[#00A5E5]" />
            <span className="text-sm font-bold text-white">
              Draw Signature
            </span>
          </div>
          
          {/* Inner signature draw pad placeholder */}
          <div 
            className="flex flex-col items-center justify-center flex-1 min-h-[140px] overflow-hidden border border-dashed border-white/10 bg-white/[0.01] rounded-xl relative"
          >
            <SignatureCanvas
              ref={sigCanvasRef}
              penColor="white"
              canvasProps={{
                style: { width: "100%", height: "100%", minHeight: "140px" },
                className: "cursor-crosshair"
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearSignature();
              }}
              className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[10px] font-bold uppercase transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Upload Signature Card */}
        <div 
          onClick={() => {
            setSignatureTab("upload");
            fileInputRef.current?.click();
          }}
          className={`cursor-pointer transition-all flex flex-col space-y-4 rounded-2xl p-4 sm:p-5 bg-[#0C0C0E] border-2 ${
            signatureTab === "upload" ? "border-[#00A5E5]" : "border-white/5"
          }`}
        >
          <div className="flex items-center gap-2">
            <Upload className="h-4.5 w-4.5 text-[#00A5E5]" />
            <span className="text-sm font-bold text-white">
              Upload Signature
            </span>
          </div>
          
          {/* Inner upload zone placeholder */}
          <div 
            className="flex flex-col items-center justify-center py-6 space-y-1.5 flex-1 min-h-[120px] border border-dashed border-white/10 bg-white/[0.01] rounded-xl"
          >
            <Upload className="h-5 w-5 text-zinc-550" />
            <span className="text-xs text-zinc-450 font-semibold text-center">
              Click to upload or drag & drop
            </span>
            <span className="text-[10px] text-zinc-650 font-medium">
              PNG, JPG, SVG
            </span>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                toast.success(`Uploaded signature: ${file.name}`);
                if (onSignatureFileChange) {
                  onSignatureFileChange(file);
                }
              }
            }}
            className="hidden" 
          />
        </div>
      </div>
    </div>
  );
};
