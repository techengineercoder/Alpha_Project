"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { CustomCheckbox } from "@/components/ui/custom-offer-fields";
import { CustomTextarea } from "@/components/ui/custom-offer-fields";
import { toast } from "sonner";

interface AlsoIncludedProps {
  soundSystem: boolean;
  setSoundSystem: (val: boolean) => void;
  lightening: boolean;
  setLightening: (val: boolean) => void;
  staging: boolean;
  setStaging: (val: boolean) => void;
  groundTransport: boolean;
  setGroundTransport: (val: boolean) => void;
  hospitality: boolean;
  setHospitality: (val: boolean) => void;
  tags: string[];
  handleRemoveTag: (tag: string) => void;
  showTagForm: boolean;
  setShowTagForm: (val: boolean) => void;
  newTagInput: string;
  setNewTagInput: (val: string) => void;
  handleAddTag: () => void;
  noteText: string;
  setNoteText: (val: string) => void;
  subCardClassName: string;
}

export const AlsoIncluded: React.FC<AlsoIncludedProps> = ({
  soundSystem,
  setSoundSystem,
  lightening,
  setLightening,
  staging,
  setStaging,
  groundTransport,
  setGroundTransport,
  hospitality,
  setHospitality,
  tags,
  handleRemoveTag,
  showTagForm,
  setShowTagForm,
  newTagInput,
  setNewTagInput,
  handleAddTag,
  noteText,
  setNoteText,
  subCardClassName
}) => {
  return (
    <>
      {/* Additional Notes or Requests section */}
      <div className={`${subCardClassName} space-y-6`}>
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3 font-sans">
          <h3 className="text-sm font-bold text-white tracking-wide">
            Additional Notes or Requests
          </h3>
          <button
            type="button"
            onClick={() => toast.info("Add Note functionality triggered.")}
            className="text-xs font-bold text-[#00A5E5] hover:text-[#00A5E5]/90 flex items-center gap-1 cursor-pointer transition-colors"
          >
            Add Note +
          </button>
        </div>
        
        <CustomTextarea
          label="Your Note"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Artist to include M+G and short photo op for 30 VIPs"
        />
      </div>

      {/* ALSO INCLUDED checkboxes & custom tags inputs */}
      <div className={`${subCardClassName} space-y-6`}>
        <h3 className="text-xs font-bold text-zinc-450 uppercase tracking-widest font-sans">
          Also Included
        </h3>

        {/* Checkbox matrix */}
        <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-zinc-300">
          <CustomCheckbox
            checked={soundSystem}
            onChange={setSoundSystem}
            label={<span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Sound System</span>}
          />
          <CustomCheckbox
            checked={lightening}
            onChange={setLightening}
            label={<span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Lightening</span>}
          />
          <CustomCheckbox
            checked={staging}
            onChange={setStaging}
            label={<span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Staging</span>}
          />
          <CustomCheckbox
            checked={groundTransport}
            onChange={setGroundTransport}
            label={<span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Ground Transportation</span>}
          />
          <CustomCheckbox
            checked={hospitality}
            onChange={setHospitality}
            label={<span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Hospitality</span>}
          />
        </div>

        {/* Custom tags list & addition form */}
        <div className="space-y-4 pt-2 font-sans">
          <div className="flex flex-wrap gap-2.5">
            {tags.map((tag) => (
              <span 
                key={tag}
                style={{
                  borderColor: "#00A5E5",
                  backgroundColor: "transparent"
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border text-zinc-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-zinc-500 hover:text-white cursor-pointer ml-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Tag Add Action row */}
          <div className="flex items-center gap-3">
            {showTagForm ? (
              <div className="flex items-center gap-2.5 w-full max-w-2xl font-sans">
                <input
                  type="text"
                  placeholder="e.g. Catering, Security..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  style={{
                    backgroundColor: "#18181F",
                    border: "1px solid #00A5E5",
                    borderRadius: "12px",
                    height: "44px"
                  }}
                  className="flex-1 px-4 text-xs text-white placeholder-zinc-650 focus:outline-none focus:ring-0"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="h-11 w-11 flex items-center justify-center rounded-xl bg-[#00A5E5] hover:bg-[#009bde] text-white cursor-pointer transition-colors shrink-0"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewTagInput("");
                    setShowTagForm(false);
                  }}
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    backgroundColor: "#18181F"
                  }}
                  className="h-11 w-11 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white cursor-pointer transition-colors shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowTagForm(true)}
                style={{
                  border: "1px dashed rgba(255, 255, 255, 0.15)",
                  borderRadius: "12px",
                  height: "40px"
                }}
                className="inline-flex items-center justify-center px-5 text-xs font-bold text-[#00A5E5] hover:text-cyan-400 transition-colors cursor-pointer bg-transparent"
              >
                + Add Another
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
