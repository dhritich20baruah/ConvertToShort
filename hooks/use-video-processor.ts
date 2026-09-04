import { useState, useRef, useCallback } from "react";
import type {
  ExportOptions,
  TextOverlay,
  TextSize,
  TextColor,
  TextPosition,
  CaptionSegment,
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

async function buildAssSubtitles(
  segments: CaptionSegment[],
  color: TextColor,
  size: TextSize,
): Promise<string> {
  const colorMap: Record<TextColor, string> = {
    white: "&H00FFFFFF",
    black: "&H00000000",
    yellow: "&H0000FFFF",
  };

  const sizeMap: Record<TextSize, number> = {
    small: 36,
    medium: 42,
    large: 50,
  };

  const assColor = colorMap[color];
  const fontSize = sizeMap[size];

  function toAssTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const cs = Math.round((seconds % 1) * 100);
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  }

const header = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 1
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV
Style: Default,Roboto Bold,${fontSize},${assColor},&H000000FF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,4,2,2,80,80,80

[Events]
Format: Layer, Start, End, Style, Text
`;

  const events = segments
    .map((seg) => {
      const text = seg.text.trim().replace(/\r?\n/g, "\\N");
      return `Dialogue: 0,${toAssTime(seg.start)},${toAssTime(seg.end)},Default,${text}`;
    })
    .join("\n");

  return header + events;
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

      const {
        cropMode,
        cropX,
        quality,
        trimStart,
        trimEnd,
        textOverlay,
        autoCaption,
      } = options;
      // Load font for drawtext filter
      // Load font only when needed
      // Write font only for text overlay
      if (textOverlay.enabled && textOverlay.text.trim()) {
        await ffmpeg.writeFile("font.ttf", await fetchFile("/Roboto-Bold.ttf"));
      }

      // Write ASS subtitle file for auto captions
      if (
        autoCaption.enabled &&
        autoCaption.generated &&
        autoCaption.segments.length > 0
      ) {
        // Create fonts directory and write font there
        try {
          ffmpeg.createDir("/fonts");
        } catch {}

        const fontResponse = await fetch("/Roboto-Bold.ttf");
        const fontBuffer = await fontResponse.arrayBuffer();
        await ffmpeg.writeFile(
          "/fonts/Roboto-Bold.ttf",
          new Uint8Array(fontBuffer),
        );

        const assContent = await buildAssSubtitles(
          autoCaption.segments,
          autoCaption.color,
          autoCaption.size,
        );
        await ffmpeg.writeFile(
          "captions.ass",
          new Uint8Array(new TextEncoder().encode(assContent)),
        );
      }

      if (cancelledRef.current) return;

      const { width: sourceWidth, height: sourceHeight } = meta;

      const cropWidth = Math.round(sourceHeight * (9 / 16));
      const cropHeight = sourceHeight;
      const maxX = sourceWidth - cropWidth;
      const cropXPx = Math.round(
        Math.min(Math.max(cropX * sourceWidth, 0), maxX),
      );
      const crf = quality === "high" ? "23" : "28";
      const outputWidth = quality === "high" ? 1080 : 720;
      const outputHeight = quality === "high" ? 1920 : 1280;
      const drawtextFilter = buildDrawtextFilter(textOverlay);
      const captionFilter =
        autoCaption.enabled &&
        autoCaption.generated &&
        autoCaption.segments.length > 0
          ? "ass=captions.ass:fontsdir=/fonts"
          : "";
      console.log("captionFilter value:", captionFilter);
      let args: string[];

      if (cropMode === "blur-letterbox") {
        const innerHeight = Math.round(1080 / (sourceWidth / sourceHeight));
        const innerY = Math.round((1920 - innerHeight) / 2);

        // Build filter_complex — append drawtext after overlay if present
        const vf =
          drawtextFilter || captionFilter
            ? (() => {
                // Each filter needs its own link in filter_complex
                const allFilters = [drawtextFilter, captionFilter]
                  .filter(Boolean)
                  .join(",");

                return [
                  `[0:v]scale=${outputWidth}:${outputHeight}:force_original_aspect_ratio=increase,crop=${outputWidth}:${outputHeight},boxblur=20:5,setsar=1[bg]`,
                  `[0:v]scale=${outputWidth}:-2,setsar=1[fg]`,
                  `[bg][fg]overlay=0:${innerY},${allFilters}[v]`,
                ].join(";");
              })()
            : [
                `[0:v]scale=${outputWidth}:${outputHeight}:force_original_aspect_ratio=increase,crop=${outputWidth}:${outputHeight},boxblur=20:5,setsar=1[bg]`,
                `[0:v]scale=${outputWidth}:-2,setsar=1[fg]`,
                `[bg][fg]overlay=0:${innerY}[v]`,
              ].join(";");

        console.log("VF filter_complex:", vf);
        console.log("Caption filter:", captionFilter);
        console.log("Number of segments:", autoCaption.segments.length);
        const needsFaststart = !captionFilter;
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
          ...(needsFaststart ? ["-movflags", "+faststart"] : []),
          "-y",
          "output.mp4",
        ];
      } else {
        // Center crop — append drawtext to -vf chain if present
        const vfFilters = [
          `crop=${cropWidth}:${cropHeight}:${cropXPx}:0,scale=${outputWidth}:${outputHeight},setsar=1`,
          drawtextFilter,
          captionFilter,
        ]
          .filter(Boolean)
          .join(",");

        console.log("VF filters:", vfFilters);
        console.log("Caption filter:", captionFilter);
        console.log("Number of segments:", autoCaption.segments.length);
        const needsFaststart = !captionFilter;
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
          ...(needsFaststart ? ["-movflags", "+faststart"] : []),
          "-y",
          "output.mp4",
        ];
      }

      ffmpeg.on("log", ({ message }: { message: string }) => {
        console.log("[ffmpeg]", message);
        // Log errors specifically
        if (
          message.includes("Error") ||
          message.includes("Invalid") ||
          message.includes("No such")
        ) {
          console.error("[ffmpeg error]", message);
        }
      });
      console.log("Full args:", JSON.stringify(args));
      console.log("Running ffmpeg:", args.join(" "));

      try {
        await ffmpeg.exec(args);
      } catch (execErr) {
        // ffmpeg.wasm sometimes throws Aborted() after successful encode
        // when using the ass subtitle filter due to libass memory cleanup.
        // The output file is still valid — attempt to read it anyway.
        console.warn("ffmpeg exec threw (possibly libass cleanup):", execErr);
      }

      if (cancelledRef.current) return;
      setProgress(95);

      // Attempt to read output regardless of exec throw
      let data: Uint8Array | string;
      try {
        data = await ffmpeg.readFile("output.mp4");
      } catch (readErr) {
        // Output file doesn't exist — real failure
        throw new Error("Export failed — video could not be processed.");
      }

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
      if (autoCaption.enabled && autoCaption.generated) {
        try {
          await ffmpeg.deleteFile("captions.ass");
        } catch {}
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

  return {
    status,
    progress,
    outputBlob,
    errorMessage,
    elapsedTime,
    start,
    cancel,
    reset,
  };
}
