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

export type ExportOptions = {
  cropMode: CropMode;
  quality: Quality;
  cropX: number;
  trimStart: number; // seconds
  trimEnd: number;   // seconds
  textOverlay: TextOverlay;
};