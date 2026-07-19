import React from 'react';
import type { CropMode, Quality} from "../../lib/types"

type Props = {
  onExport: () => void;
  cropMode: CropMode;
  quality: Quality;
  onCropModeChange: (mode: CropMode) => void;
  onQualityChange: (quality: Quality) => void;
}

export default function ExportPanel({ onExport, cropMode, quality, onCropModeChange, onQualityChange }: Props) {

  return (
    <div className="flex flex-col gap-4 p-4 rounded-md bg-canvas-elevated border border-hairline">
      <div>
        <p className="text-[13px] font-semibold text-ink">Export settings</p>
        <p className="text-[12px] text-mute mt-0.5">Output: 1080 × 1920 · MP4</p>
      </div>
      <Divider/>
      <div className='flex flex-col gap-2'>
        <p className="text-[12px] font-medium text-mute uppercase tracking-widest">
          Style
        </p>
        <div className='flex flex-col gap-2'>
          <OptionCard
            selected={cropMode === "center"}
            onClick={() => onCropModeChange("center")}
            title="Center crop"
            description="Trims the sides, keeps the middle."
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect
                  x="1"
                  y="4"
                  width="18"
                  height="12"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="7"
                  y="4"
                  width="6"
                  height="12"
                  rx="1"
                  fill="currentColor"
                  opacity="0.25"
                />
                <rect
                  x="7.75"
                  y="4.75"
                  width="4.5"
                  height="10.5"
                  rx="0.5"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            }
          />
          <OptionCard
            selected={cropMode === "blur-letterbox"}
            onClick={() => onCropModeChange("blur-letterbox")}
            title="Blur letterbox"
            description="Full frame centered, blurred background fills top and bottom."
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect
                  x="5"
                  y="1"
                  width="10"
                  height="18"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="5"
                  y="1"
                  width="10"
                  height="4.5"
                  rx="1.5"
                  fill="currentColor"
                  opacity="0.15"
                />
                <rect
                  x="5"
                  y="14.5"
                  width="10"
                  height="4.5"
                  rx="1.5"
                  fill="currentColor"
                  opacity="0.15"
                />
                <rect
                  x="5.75"
                  y="6"
                  width="8.5"
                  height="8"
                  rx="0.75"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            }
          />
        </div>
      </div>
      <Divider/>
      {/* Quality */}
      <div className='flex flex-col gap-2'>
         <p className="text-[12px] font-medium text-mute uppercase tracking-widest">
          Quality
        </p>
        <div className="flex gap-2">
          <QualityButton
            selected={quality === "high"}
            onClick={() => onQualityChange("high")}
            label="High"
            sub="~8 Mbps"
          />
          <QualityButton
            selected={quality === "medium"}
            onClick={() => onQualityChange("medium")}
            label="Medium"
            sub="~4 Mbps"
          />
        </div>
          <p className="text-[11px] text-faint leading-relaxed">
          {quality === "high"
            ? "Best for uploading to YouTube directly."
            : "Smaller file size, good for sharing."}
        </p>
      </div>
      <Divider/>
      {/* Output info */}
      <div className="flex flex-col gap-1 5">
        <p className="text-[12px] font-medium text-mute uppercase tracking-widest">
          Output
        </p>
        <div className="flex flex-col gap-1">
          <InfoRow label="Format" value="MP4 (H.264)" />
          <InfoRow label="Resolution" value="1080 × 1920" />
          <InfoRow label="Aspect ratio" value="9:16" />
          <InfoRow
            label="Style"
            value={cropMode === "center" ? "Center crop" : "Blur letterbox"}
          />
          <InfoRow
            label="Bitrate"
            value={quality === "high" ? "~8 Mbps" : "~4 Mbps"}
          />
        </div>
      </div>

      <Divider/>
      {/* Privacy note */}
      <div className="flex items-start gap-2">
         <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="text-mute shrink-0 mt-0.5"
        >
          <path
            d="M7 1L2 3.5V7C2 9.76 4.24 12.35 7 13C9.76 12.35 12 9.76 12 7V3.5L7 1Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <path
            d="M5 7L6.5 8.5L9.5 5.5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-[11px] text-faint leading-relaxed">
          Processed entirely in your browser. Your video is never uploaded or stored anywhere.
        </p>
      </div>
      {/* Export button */}
      <button
        onClick={onExport}
        className="w-full py-2.5 rounded-pill bg-accent text-accent-ink text-[14px] font-semibold cursor-pointer border-none hover:opacity-90 transition-opacity"
      >
        Export Short
      </button>
    </div>
  );
}

// SUB COMPONENETS
function Divider(){
  return <div className="h-px bg-hairline w-full"></div>
}

function InfoRow({label, value}: {label: string; value: string}){
  return(
     <div className="flex items-center justify-between">
      <span className="text-[12px] text-mute">{label}</span>
      <span className="text-[12px] font-medium text-body">{value}</span>
    </div>
  )
}

function OptionCard({
  selected,
  onClick,
  title,
  description,
  icon,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-start gap-3 p-3 rounded-md border text-left cursor-pointer transition-colors duration-150",
        selected
          ? "border-accent bg-accent/5"
          : "border-hairline bg-canvas hover:border-accent/50",
      ].join(" ")}
    >
      {/* Icon */}
      <div
        className={[
          "shrink-0 w-9 h-9 rounded-sm flex items-center justify-center transition-colors duration-150",
          selected ? "bg-accent/10 text-accent" : "bg-hairline-soft text-mute",
        ].join(" ")}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-0.5 pt-0.5">
        <span
          className={[
            "text-[13px] font-semibold",
            selected ? "text-accent" : "text-ink",
          ].join(" ")}
        >
          {title}
        </span>
        <span className="text-[12px] text-mute leading-relaxed">
          {description}
        </span>
      </div>

      {/* Selection dot */}
      <div className="ml-auto shrink-0 mt-0.5">
        <div
          className={[
            "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-150",
            selected ? "border-accent" : "border-hairline",
          ].join(" ")}
        >
          {selected && (
            <div className="w-2 h-2 rounded-full bg-accent" />
          )}
        </div>
      </div>
    </button>
  );
}

function QualityButton({
  selected,
  onClick,
  label,
  sub,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  sub: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-md border cursor-pointer transition-colors duration-150",
        selected
          ? "border-accent bg-accent/5"
          : "border-hairline bg-canvas hover:border-accent/50",
      ].join(" ")}
    >
      <span
        className={[
          "text-[13px] font-semibold",
          selected ? "text-accent" : "text-ink",
        ].join(" ")}
      >
        {label}
      </span>
      <span className="text-[11px] text-mute font-mono">{sub}</span>
    </button>
  );
}