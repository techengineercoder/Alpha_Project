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
  shareTeamContainerClassName: string;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  handleRemoveDocument,
  handleFileUpload,
  documentInputRef,
  shareTeamContainerClassName
}) => {
  return (
    <div className={`${shareTeamContainerClassName} space-y-6`}>
      <h3 className="text-xs font-bold text-zinc-455 uppercase tracking-widest font-sans">
        Documents
      </h3>

      {/* Drag Area */}
      <div 
        onClick={() => documentInputRef.current?.click()}
        className="flex flex-col items-center justify-center text-center cursor-pointer transition-colors font-sans border border-dashed border-white/15 bg-[#18181F]/30 hover:bg-[#18181F]/50 rounded-2xl p-6 sm:p-8"
      >
        <Upload className="h-7 w-7 text-zinc-550 mb-2.5" />
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
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-[14.83px] w-full bg-white/[0.04] border border-white/5 rounded-[20px] p-4 sm:py-3 sm:px-5 min-h-[66px]"
          >
            <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-rose-950/25 border border-rose-900/20 flex items-center justify-center text-rose-500 shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-white truncate">
                {d.name}
              </span>
            </div>
            
            <div className="flex flex-row items-center justify-between sm:justify-end gap-4 w-full sm:w-auto shrink-0">
              <span className="text-xs text-zinc-400 font-medium font-sans">
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
