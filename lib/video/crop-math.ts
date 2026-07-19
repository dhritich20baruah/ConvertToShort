import { OUTPUT_WIDTH, OUTPUT_HEIGHT, TARGET_RATIO } from "../constants";
import type { CropRect } from "../types";

// ─── Center crop ──────────────────────────────────────────────────────────────
//
// Computes the crop rect for a simple center crop from a landscape source
// into a 9:16 portrait frame. The crop window is always the full source height,
// and the width is derived from the 9:16 ratio.
//
// Example: 1920×1080 source → crop rect is 608×1080 centered at x=656

export function centerCropRect(
    sourceWidth: number,
    sourceHeight: number
): CropRect {
    const cropWidth = Math.round(sourceHeight * TARGET_RATIO);
    const cropHeight = sourceHeight;
    const x = Math.round((sourceWidth - cropWidth)/2);
    const y = 0;

    return {x, y, width: cropWidth, height: cropHeight};
}

// ─── Custom crop from cropX fraction ─────────────────────────────────────────
//
// Converts the user's drag position (cropX: 0–1 fraction of display width)
// into a crop rect in source pixel space.
//
// cropX is the left edge of the crop window as a fraction of the display width.
// We scale it back up to source pixel space using the source dimensions.

export function customCropRect(
    cropX: number,
    sourceWidth: number,
    sourceHeight: number
): CropRect {
    const cropWidth = Math.round(sourceHeight * TARGET_RATIO);
    const cropHeight = sourceHeight;

    const maxX = sourceWidth - cropWidth;
    const x = Math.round(Math.min(Math.max(cropX * sourceWidth, 0), maxX));
    const y = 0;

    return { x, y, width: cropWidth, height: cropHeight };
}

// ─── Draw frame to canvas: center crop ───────────────────────────────────────
//
// Draws a single decoded VideoFrame onto the output canvas using center crop.
// The source crop rect is drawn to fill the full OUTPUT_WIDTH × OUTPUT_HEIGHT canvas.

export function drawCenterCrop(
  ctx: OffscreenCanvasRenderingContext2D,
  frame: VideoFrame,
  sourceWidth: number,
  sourceHeight: number
): void {
  const rect = centerCropRect(sourceWidth, sourceHeight);

  ctx.drawImage(
    frame,
    rect.x,        // source x
    rect.y,        // source y
    rect.width,    // source width
    rect.height,   // source height
    0,             // dest x
    0,             // dest y
    OUTPUT_WIDTH,  // dest width
    OUTPUT_HEIGHT  // dest height
  );
}

// ─── Draw frame to canvas: custom crop ───────────────────────────────────────
//
// Same as above but uses the user's drag-adjusted cropX position.
export function drawCustomCrop(
  ctx: OffscreenCanvasRenderingContext2D,
  frame: VideoFrame,
  cropX: number,
  sourceWidth: number,
  sourceHeight: number
): void {
  const rect = customCropRect(cropX, sourceWidth, sourceHeight);

  ctx.drawImage(
    frame,
    rect.x,
    rect.y,
    rect.width,
    rect.height,
    0,
    0,
    OUTPUT_WIDTH,
    OUTPUT_HEIGHT
  );
}

// ─── Draw frame to canvas: blur letterbox ────────────────────────────────────
//
// Two-pass draw:
//   Pass 1 — draw the full source frame scaled to fill the output canvas,
//             then apply a blur filter to create the background.
//   Pass 2 — draw the cropped region centered on top, unblurred,
//             at the correct letterboxed height.
//
// The letterboxed inner height is derived by fitting the source aspect ratio
// (16:9) inside the output frame (9:16) width-wise:
//   innerHeight = OUTPUT_WIDTH / sourceRatio

export function drawBlurLetterbox(
  ctx: OffscreenCanvasRenderingContext2D,
  frame: VideoFrame,
  _cropX: number,
  sourceWidth: number,
  sourceHeight: number
): void {
  const sourceRatio = sourceWidth / sourceHeight;

  // ── Pass 1: blurred background ───────────────────────────────────────────
  // Scale source to fill entire OUTPUT canvas (cover), then blur
  const bgScaleW = OUTPUT_WIDTH / sourceWidth;
  const bgScaleH = OUTPUT_HEIGHT / sourceHeight;
  const bgScale = Math.max(bgScaleW, bgScaleH);

  const bgW = Math.round(sourceWidth * bgScale);
  const bgH = Math.round(sourceHeight * bgScale);
  const bgX = Math.round((OUTPUT_WIDTH - bgW) / 2);
  const bgY = Math.round((OUTPUT_HEIGHT - bgH) / 2);

  ctx.save();
  ctx.filter = "blur(24px) brightness(0.55)";
  // Overdraw by 40px on each side to avoid blur edge artifacts
  ctx.drawImage(
    frame,
    bgX - 40,
    bgY - 40,
    bgW + 80,
    bgH + 80
  );
  ctx.restore();

  // ── Pass 2: sharp inner frame ─────────────────────────────────────────────
  // Fit full source frame inside OUTPUT_WIDTH, centered vertically
  // Do NOT crop — show the entire source frame
  const innerWidth = OUTPUT_WIDTH;
  const innerHeight = Math.round(OUTPUT_WIDTH / sourceRatio);
  const innerY = Math.round((OUTPUT_HEIGHT - innerHeight) / 2);

  ctx.drawImage(
    frame,
    0,             // source x — full frame, no crop
    0,             // source y
    sourceWidth,   // full source width
    sourceHeight,  // full source height
    0,             // dest x
    innerY,        // centered vertically
    innerWidth,    // fills output width
    innerHeight    // maintains source aspect ratio
  );
}