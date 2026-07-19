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
};