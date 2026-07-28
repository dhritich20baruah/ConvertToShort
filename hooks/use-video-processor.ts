import { useState, useRef, useCallback } from "react";
import type { ExportOptions } from "../lib/types";
import type { VideoMeta } from "../lib/types";

export type ProcessorStatus = "idle" | "processing" | "done" | "error";

export type UseVideoProcessorResult = {
  status: ProcessorStatus;
  progress: number;
  outputBlob: Blob | null;
  errorMessage: string | null;
  start: (meta: VideoMeta, options: ExportOptions) => void;
  cancel: () => void;
  reset: () => void;
};

export function useVideoProcessor(): UseVideoProcessorResult {
  const [status, setStatus] = useState<ProcessorStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const ffmpegRef = useRef<any>(null);
  const cancelledRef = useRef(false);

  const start = useCallback(async (meta: VideoMeta, options: ExportOptions) => {
    cancelledRef.current = false;
    setStatus("processing");
    setProgress(0);
    setOutputBlob(null);
    setErrorMessage(null);

    try {
      // Dynamically import inside callback to avoid SSR issues
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

      // Load ffmpeg core from public folder
      setProgress(5);
      await ffmpeg.load({
        coreURL: await toBlobURL("/ffmpeg-core.js", "text/javascript"),
        wasmURL: await toBlobURL("/ffmpeg-core.wasm", "application/wasm"),
      });

      if (cancelledRef.current) return;
      setProgress(10);

      // Write input file
      await ffmpeg.writeFile("input.mp4", await fetchFile(meta.file));
      setProgress(15);

      if (cancelledRef.current) return;

      // Build filter
      const { cropMode, cropX, quality, trimStart, trimEnd } = options;
      const { width: sourceWidth, height: sourceHeight } = meta;

      const cropWidth = Math.round(sourceHeight * (9 / 16));
      const cropHeight = sourceHeight;
      const maxX = sourceWidth - cropWidth;
      const cropXPx = Math.round(
        Math.min(Math.max(cropX * sourceWidth, 0), maxX),
      );
      const crf = quality === "high" ? "18" : "23";

      let args: string[];

      if (cropMode === "blur-letterbox") {
        const innerHeight = Math.round(1080 / (sourceWidth / sourceHeight));
        const innerY = Math.round((1920 - innerHeight) / 2);
        const vf = [
          `[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:5,setsar=1[bg]`,
          `[0:v]scale=1080:-2,setsar=1[fg]`,
          `[bg][fg]overlay=0:${innerY}[v]`,
        ].join(";");
        args = [
          "-ss",
          trimStart.toFixed(3), // seek to start — before -i for fast seeking
          "-to",
          trimEnd.toFixed(3), // end point
          "-i",
          "input.mp4",
          "-filter_complex",
          vf,
          "-map",
          "[v]",
          "-map",
          "0:a?",
          "-c:v",
          "libx264",
          "-preset",
          "fast",
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
        const vf = `crop=${cropWidth}:${cropHeight}:${cropXPx}:0,scale=1080:1920,setsar=1`;
        args = [
          "-ss",
          trimStart.toFixed(3),
          "-to",
          trimEnd.toFixed(3),
          "-i",
          "input.mp4",
          "-vf",
          vf,
          "-c:v",
          "libx264",
          "-preset",
          "fast",
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

      if (cancelledRef.current) return;

      setOutputBlob(blob);
      setProgress(100);
      setStatus("done");
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
  }, []);

  return { status, progress, outputBlob, errorMessage, start, cancel, reset };
}
