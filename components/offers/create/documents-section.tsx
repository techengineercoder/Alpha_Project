"use client";

import React from "react";
import { Download, Eye, FileText, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

interface DocumentsSectionProps {
  documents: UploadedFile[];
  handleRemoveDocument: (id: string, name: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  documentInputRef: React.RefObject<HTMLInputElement | null>;
  shareTeamContainerStyle: React.CSSProperties;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  handleRemoveDocument,
  handleFileUpload,
  documentInputRef,
  shareTeamContainerStyle
}) => {
  return (
    <div style={shareTeamContainerStyle} className="space-y-6">
      <h3 className="text-xs font-bold text-zinc-455 uppercase tracking-widest font-sans">
        Documents
      </h3>

      {/* Drag Area */}
      <div 
        onClick={() => documentInputRef.current?.click()}
        style={{
          border: "1px dashed rgba(255, 255, 255, 0.15)",
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          borderRadius: "16px",
          padding: "32px"
        }}
        className="flex flex-col items-center justify-center text-center cursor-pointer transition-colors font-sans"
      >
        <Upload className="h-7 w-7 text-zinc-500 mb-2.5" />
        <span className="text-sm font-semibold text-zinc-300">
          Drag files here or click to upload
        </span>
        <span className="text-xs text-zinc-500 mt-1">
          PDF, DOC, JPG, PNG accepted
        </span>
        <input 
          type="file" 
          ref={documentInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Document list */}
      <div className="space-y-3 font-sans">
        {documents.map((d) => (
          <div
            key={d.id}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              borderWidth: "1.24px",
              borderColor: "rgba(255, 255, 255, 0.08)",
              borderRadius: "29.65px",
              paddingTop: "14.83px",
              paddingBottom: "14.83px",
              paddingLeft: "19.77px",
              paddingRight: "19.77px",
              height: "66.72px"
            }}
            className="flex items-center justify-between gap-[14.83px] w-full"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-rose-950/25 border border-rose-900/20 flex items-center justify-center text-rose-500 shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-white truncate">
                {d.name}
              </span>
            </div>
            
            <div className="flex items-center gap-6 shrink-0">
              <span className="text-xs text-zinc-550 font-medium font-sans">
                {d.size} &bull; Uploaded {d.uploadedAt}
              </span>
              
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={() => toast.info(`Viewing document: ${d.name}`)}
                  className="p-1.5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  title="View"
                >
                  <Eye className="h-4.5 w-4.5" />
                </button>
                <button 
                  type="button"
                  onClick={() => toast.success(`Downloaded ${d.name}`)}
                  className="p-1.5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  title="Download"
                >
                  <Download className="h-4.5 w-4.5" />
                </button>
                <button 
                  type="button"
                  onClick={() => handleRemoveDocument(d.id, d.name)}
                  className="p-1.5 text-red-500/80 hover:text-red-500 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
