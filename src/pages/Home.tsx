import { useState, useEffect } from "react";
import ThemeToggle from "../../components/ui/theme-toggle";
import UploadDropzone from "../../components/editor/upload-dropzone";
import VideoPreview from "../../components/editor/video-preview";
import ExportPanel from "../../components/editor/export-panel";
import ProgressOverlay from "../../components/editor/progress-overlay";
import { useVideoProcessor } from "../../hooks/use-video-processor";
import type { CropMode, Quality, TextOverlay } from "../../lib/types";
import type { VideoMeta } from "../../lib/types";
import SeoContent from "../../components/landing/seo-content";
import Footer from "../../components/landing/Footer";

export type AppStage = "upload" | "crop" | "processing" | "done" | "error";

export default function Home() {
  const [stage, setStage] = useState<AppStage>("upload");
  const [videoMeta, setVideoMeta] = useState<VideoMeta | null>(null);
  // ── Lifted export options ──────────────────────────────────────────────────
  const [cropX, setCropX] = useState(0.5);
  const [cropMode, setCropMode] = useState<CropMode>("center");
  const [quality, setQuality] = useState<Quality>("high");
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  // ── Output URL derived from blob ───────────────────────────────────────────
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [textOverlay, setTextOverlay] = useState<TextOverlay>({
    enabled: false,
    text: "",
    position: "bottom",
    color: "white",
    size: "medium",
  });

  // ── Processor hook ─────────────────────────────────────────────────────────
  const {
    status,
    progress,
    outputBlob,
    errorMessage,
    start,
    cancel,
    reset: resetProcessor,
  } = useVideoProcessor();

  // ── Sync processor status → app stage ─────────────────────────────────────
  useEffect(() => {
    if (status === "processing") {
      setStage("processing");
    } else if (status === "done") {
      setStage("done");
    } else if (status === "error") {
      setStage("error");
    }
  }, [status]);

  // ── Create object URL from output blob ─────────────────────────────────────
  useEffect(() => {
    if (!outputBlob) return;
    const url = URL.createObjectURL(outputBlob);
    setOutputUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [outputBlob]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleFileAccepted(meta: VideoMeta) {
    setVideoMeta(meta);
    setTrimStart(0);
    setTrimEnd(meta.duration); // ← initialize to full duration
    setStage("crop");
  }

  function handleExport() {
    if (!videoMeta) return;
    start(videoMeta, {
      cropMode,
      quality,
      cropX,
      trimStart,
      trimEnd,
      textOverlay,
    });
  }

  function handleCancel() {
    cancel();
    setStage("crop");
  }

  function handleReset() {
    if (videoMeta?.url) URL.revokeObjectURL(videoMeta.url);
    setVideoMeta(null);
    setOutputUrl(null);
    setCropX(0.5);
    setCropMode("center");
    setQuality("high");
    setTrimStart(0);
    setTrimEnd(0);
    resetProcessor();
    setStage("upload");
    setTextOverlay({
      enabled: false,
      text: "",
      position: "bottom",
      color: "white",
      size: "medium",
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <header className="h-14 sticky top-0 z-50 flex items-center justify-between px-6 bg-canvas-elevated border-b border-hairline">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-sm bg-accent flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="4" y="1" width="6" height="12" rx="1.5" stroke="white" strokeWidth="1.5" />
              <line x1="1" y1="4" x2="3" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="1" y1="7" x2="3" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="1" y1="10" x2="3" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="11" y1="4" x2="13" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="11" y1="7" x2="13" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="11" y1="10" x2="13" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-ink tracking-tight">
            Convert to Shorts
          </span>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-3">
          {stage !== "upload" && (
            <button
              onClick={handleReset}
              className="text-[13px] font-medium text-mute bg-transparent border-none cursor-pointer px-2 py-1 rounded-sm hover:text-ink transition-colors"
            >
              Start over
            </button>
          )}
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center px-6 py-10 gap-8 relative">
        {stage === "upload" && (
          <>
            <div className="text-center max-w-120">
              <h1 className="text-[28px] font-bold text-ink tracking-tight leading-tight mb-2.5">
                Reframe video for YouTube Shorts
              </h1>
              <p className="text-[15px] text-body leading-relaxed">
                Crop horizontal video into 9:16 format right in your browser.
                Nothing is uploaded — your video never leaves your device.
              </p>
            </div>
            <UploadDropzone onFileAccepted={handleFileAccepted} />
            <p className="text-xs text-faint text-center">
              MP4 or MOV · Max 10 minutes · Up to 1080p
            </p>
          </>
        )}

        {/* Crop stage */}
        {stage === "crop" && videoMeta && (
          <div className="w-full max-w-225 flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_300px] lg:items-start">
            <VideoPreview
              videoMeta={videoMeta}
              cropX={cropX}
              onCropXChange={setCropX}
              trimStart={trimStart}
              trimEnd={trimEnd}
              onTrimChange={(start, end) => {
                setTrimStart(start);
                setTrimEnd(end);
              }}
            />
            <ExportPanel
              onExport={handleExport}
              cropMode={cropMode}
              quality={quality}
              onCropModeChange={setCropMode}
              onQualityChange={setQuality}
              trimStart={trimStart}
              trimEnd={trimEnd}
              textOverlay={textOverlay}
              onTextOverlayChange={setTextOverlay}
            />
          </div>
        )}

        {/* Done stage */}
        {stage === "done" && outputUrl && (
          <div className="flex flex-col items-center gap-5 max-w-100 text-center">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M4 11.5L9 16.5L18 7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-[22px] font-bold text-ink tracking-tight mb-1.5">
                Your Short is ready
              </h2>
              <p className="text-sm text-body">
                Download and upload directly to YouTube Shorts.
              </p>
            </div>
            <a href={outputUrl}
              download="short.mp4"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-pill bg-accent text-accent-ink font-semibold text-sm no-underline">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M7.5 2v8M7.5 10L4.5 7M7.5 10L10.5 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12h11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Download MP4
            </a>
            <button
              onClick={handleReset}
              className="text-[13px] text-mute bg-transparent border-none cursor-pointer"
            >
              Convert another video
            </button>
          </div>
        )}

        {/* Error stage */}
        {stage === "error" && (
          <div className="flex flex-col items-center gap-5 max-w-100 text-center">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="9" stroke="var(--color-error)" strokeWidth="1.5" />
                <line x1="11" y1="7" x2="11" y2="11.5" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="11" cy="15" r="1" fill="var(--color-error)" />
              </svg>
            </div>
            <div>
              <h2 className="text-[22px] font-bold text-ink tracking-tight mb-1.5">
                Something went wrong
              </h2>
              <p className="text-sm text-body leading-relaxed">
                {errorMessage ?? "An unexpected error occurred during processing."}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-pill bg-accent text-accent-ink font-semibold text-sm border-none cursor-pointer hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
          </div>
        )}

        {/* Processing overlay */}
        {stage === "processing" && (
          <ProgressOverlay
            progress={progress}
            onCancel={handleCancel}
          />
        )}
      </main>
      <SeoContent />
      <Footer />
    </div>
  )
}