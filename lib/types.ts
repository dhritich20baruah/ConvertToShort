export type VideoMeta = {
  file: File;
  url: string;
  duration: number;
  width: number;
  height: number;
};

export type CropMode = "center" | "blur-letterbox";

export type CropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Quality = "high" | "medium";

export type TextPosition = "top" | "center" | "bottom";
export type TextColor = "white" | "black" | "yellow";
export type TextSize = "small" | "medium" | "large";

export type TextOverlay = {
  enabled: boolean;
  text: string;
  position: TextPosition;
  color: TextColor;
  size: TextSize;
};

// ── Auto captions ─────────────────────────────────────────────────────────────

export type CaptionSegment = {
  start: number;   // seconds from start of original video
  end: number;     // seconds from start of original video
  text: string;    // caption text for this segment
};

export type AutoCaption = {
  enabled: boolean;          // user has toggled captions on
  generated: boolean;        // transcription has completed
  segments: CaptionSegment[]; // whisper output
  color: TextColor;
  size: TextSize;
};

// ── Export options ────────────────────────────────────────────────────────────

export type ExportOptions = {
  cropMode: CropMode;
  quality: Quality;
  cropX: number;
  trimStart: number;
  trimEnd: number;
  textOverlay: TextOverlay;
  autoCaption: AutoCaption;
};