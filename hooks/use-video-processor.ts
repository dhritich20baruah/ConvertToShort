import { useState, useRef, useCallback } from "react";
import type {
  ExportOptions,
  TextOverlay,
  TextSize,
  TextColor,
  TextPosition,
} from "../lib/types";
import type { VideoMeta } from "../lib/types";

export type ProcessorStatus = "idle" | "processing" | "done" | "error";

export type UseVideoProcessorResult = {
  status: ProcessorStatus;
  progress: number;
  outputBlob: Blob | null;
  errorMessage: string | null;
  elapsedTime: string | null;
  start: (meta: VideoMeta, options: ExportOptions) => void;
  cancel: () => void;
  reset: () => void;
};

function buildDrawtextFilter(overlay: TextOverlay): string {
  if (!overlay.enabled || !overlay.text.trim()) return "";

  const sizeMap: Record<TextSize, number> = {
    small: 48,
    medium: 72,
    large: 96,
  };

  const colorMap: Record<TextColor, string> = {
    white: "white",
    black: "black",
    yellow: "yellow",
  };

  const yMap: Record<TextPosition, string> = {
    top: "80",
    center: "(h-text_h)/2",
    bottom: "h-text_h-80",
  };

  const fontSize = sizeMap[overlay.size];
  const fontColor = colorMap[overlay.color];
  const y = yMap[overlay.position];

  const escapedText = overlay.text
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/:/g, "\\:");

  return [
    `drawtext=fontfile='font.ttf'`, // ← reference the loaded font
    `text='${escapedText}'`,
    `fontcolor=${fontColor}`,
    `fontsize=${fontSize}`,
    `x=(w-text_w)/2`,
    `y=${y}`,
    `box=1`,
    `boxcolor=black@0.4`,
    `boxborderw=16`,
    `line_spacing=10`,
  ].join(":");
}

export function useVideoProcessor(): UseVideoProcessorResult {
  const [status, setStatus] = useState<ProcessorStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string | null>(null);
  const ffmpegRef = useRef<any>(null);
  const cancelledRef = useRef(false);

  const start = useCallback(async (meta: VideoMeta, options: ExportOptions) => {
    cancelledRef.current = false;
    setStatus("processing");
    setProgress(0);
    setOutputBlob(null);
    setErrorMessage(null);

    const startTime = Date.now();

    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      ffmpeg.on("progress", ({ progress: p }: { progress: number }) => {
        if (cancelledRef.current) return;
        const mapped = 15 + Math.round(p * 80);
        setProgress(Math.min(mapped, 95));
      });

      ffmpeg.on("log", ({ message }: { message: string }) => {
        console.log("[ffmpeg]", message);
      });

      setProgress(5);
      await ffmpeg.load({
        coreURL: await toBlobURL("/ffmpeg-core.js", "text/javascript"),
        wasmURL: await toBlobURL("/ffmpeg-core.wasm", "application/wasm"),
      });

      if (cancelledRef.current) return;
      setProgress(10);

      await ffmpeg.writeFile("input.mp4", await fetchFile(meta.file));
      setProgress(15);

      const { cropMode, cropX, quality, trimStart, trimEnd, textOverlay } =
        options;
      // Load font for drawtext filter
      // Load font only when needed
      if (textOverlay.enabled && textOverlay.text.trim()) {
        await ffmpeg.writeFile("font.ttf", await fetchFile("/Roboto-Bold.ttf"));
      }

      if (cancelledRef.current) return;

      const { width: sourceWidth, height: sourceHeight } = meta;

      const cropWidth = Math.round(sourceHeight * (9 / 16));
      const cropHeight = sourceHeight;
      const maxX = sourceWidth - cropWidth;
      const cropXPx = Math.round(
        Math.min(Math.max(cropX * sourceWidth, 0), maxX),
      );
      const crf = quality === "high" ? "18" : "23";
      const outputWidth = quality === "high" ? 1080 : 720;
      const outputHeight = quality === "high" ? 1920 : 1280;
      const drawtextFilter = buildDrawtextFilter(textOverlay);

      let args: string[];

      if (cropMode === "blur-letterbox") {
        const innerHeight = Math.round(1080 / (sourceWidth / sourceHeight));
        const innerY = Math.round((1920 - innerHeight) / 2);

        // Build filter_complex — append drawtext after overlay if present
        const vf = drawtextFilter
          ? [
              `[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:5,setsar=1[bg]`,
              `[0:v]scale=1080:-2,setsar=1[fg]`,
              `[bg][fg]overlay=0:${innerY}[overlaid]`,
              `[overlaid]${drawtextFilter}[v]`,
            ].join(";")
          : [
              `[0:v]scale=${outputWidth}:${outputHeight}:force_original_aspect_ratio=increase,crop=${outputWidth}:${outputHeight},boxblur=20:5,setsar=1[bg]`,
              `[0:v]scale=${outputWidth}:-2,setsar=1[fg]`,
              `[bg][fg]overlay=0:${innerY}[v]`,
            ].join(";");

        args = [
          "-ss",
          trimStart.toFixed(3),
          "-to",
          trimEnd.toFixed(3),
          "-i",
          "input.mp4",
          "-threads",
          "4",
          "-filter_complex",
          vf,
          "-map",
          "[v]",
          "-map",
          "0:a?",
          "-c:v",
          "libx264",
          "-preset",
          "ultrafast",
          "-tune",
          "fastdecode",
          "-crf",
          crf,
          "-c:a",
          "aac",
          "-b:a",
          "128k",
          "-movflags",
          "+faststart",
          "-y",
          "output.mp4",
        ];
      } else {
        // Center crop — append drawtext to -vf chain if present
        const vfFilters = [
          `crop=${cropWidth}:${cropHeight}:${cropXPx}:0,scale=${outputWidth}:${outputHeight},setsar=1`,
          drawtextFilter,
        ]
          .filter(Boolean)
          .join(",");

        args = [
          "-ss",
          trimStart.toFixed(3),
          "-to",
          trimEnd.toFixed(3),
          "-i",
          "input.mp4",
          "-threads",
          "4",
          "-vf",
          vfFilters,
          "-c:v",
          "libx264",
          "-preset",
          "ultrafast",
          "-tune",
          "fastdecode",
          "-crf",
          crf,
          "-c:a",
          "aac",
          "-b:a",
          "128k",
          "-movflags",
          "+faststart",
          "-y",
          "output.mp4",
        ];
      }

      console.log("Running ffmpeg:", args.join(" "));
      await ffmpeg.exec(args);

      if (cancelledRef.current) return;
      setProgress(95);

      const data = await ffmpeg.readFile("output.mp4");

      let plainBuffer: ArrayBuffer;

      if (typeof data === "string") {
        plainBuffer = new TextEncoder().encode(data).buffer as ArrayBuffer;
      } else {
        plainBuffer = data.buffer.slice(
          data.byteOffset,
          data.byteOffset + data.byteLength,
        ) as ArrayBuffer;
      }

      const blob = new Blob([plainBuffer], { type: "video/mp4" });
      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("output.mp4");
      if (textOverlay.enabled && textOverlay.text.trim()) {
        await ffmpeg.deleteFile("font.ttf");
      }

      if (cancelledRef.current) return;

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`Export completed in ${elapsed}s`);
      setElapsedTime(elapsed);
      setOutputBlob(blob);
      setProgress(100);
      setStatus("done");
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "export_complete", {
          crop_mode: options.cropMode,
          quality: options.quality,
          has_text_overlay: options.textOverlay.enabled,
          clip_duration: (options.trimEnd - options.trimStart).toFixed(1),
        });
      }
    } catch (err) {
      console.error("FFmpeg error:", err);
      if (!cancelledRef.current) {
        setErrorMessage(err instanceof Error ? err.message : String(err));
        setStatus("error");
      }
    }
  }, []);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    ffmpegRef.current = null;
    setElapsedTime(null);
    setStatus("idle");
    setProgress(0);
  }, []);

  const reset = useCallback(() => {
    cancelledRef.current = true;
    ffmpegRef.current = null;
    setStatus("idle");
    setProgress(0);
    setOutputBlob(null);
    setErrorMessage(null);
    setElapsedTime(null);
  }, []);

  return { status, progress, outputBlob, errorMessage, elapsedTime, start, cancel, reset };
}
