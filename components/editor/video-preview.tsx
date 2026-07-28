import { useRef, useState, useCallback, useEffect } from "react";
import type { VideoMeta } from "../../lib/types";

type Props = {
  videoMeta: VideoMeta;
  cropX: number;
  onCropXChange: (x: number) => void;
  trimStart: number;
  trimEnd: number;
  onTrimChange: (start: number, end: number) => void;
};

const TARGET_RATIO = 9 / 16;

export default function VideoPreview({
  videoMeta,
  cropX,
  onCropXChange,
  trimStart,
  trimEnd,
  onTrimChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Crop drag state
  const cropDragging = useRef(false);
  const cropDragStartX = useRef(0);
  const cropDragStartCropX = useRef(0);

  // Trim drag state
  type TrimHandle = "start" | "end" | null;
  const trimDragging = useRef<TrimHandle>(null);

  const duration = videoMeta.duration;

  // Measure container
  useEffect(() => {
    function measure() {
      const container = containerRef.current;
      if (!container) return;
      const containerWidth = container.clientWidth;
      const videoRatio = videoMeta.width / videoMeta.height;
      const displayWidth = containerWidth;
      const displayHeight = displayWidth / videoRatio;
      setDisplaySize({ width: displayWidth, height: displayHeight });

      const cropWindowWidth = TARGET_RATIO * displayHeight;
      const maxLeft = displayWidth - cropWindowWidth;
      onCropXChange((maxLeft / 2) / displayWidth);
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [videoMeta.width, videoMeta.height]);

  // Crop window dimensions
  const cropWindowWidth = TARGET_RATIO * displaySize.height;
  const cropWindowLeft = cropX * displaySize.width;

  function clampCropX(raw: number) {
    const maxLeft = displaySize.width - cropWindowWidth;
    return Math.min(Math.max(raw, 0), maxLeft / displaySize.width);
  }

  // ── Crop drag handlers ────────────────────────────────────────────────────

  const onCropMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    cropDragging.current = true;
    cropDragStartX.current = e.clientX;
    cropDragStartCropX.current = cropX;
  }, [cropX]);

  const onCropTouchStart = useCallback((e: React.TouchEvent) => {
    cropDragging.current = true;
    cropDragStartX.current = e.touches[0].clientX;
    cropDragStartCropX.current = cropX;
  }, [cropX]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!cropDragging.current) return;
      const dx = e.clientX - cropDragStartX.current;
      onCropXChange(clampCropX(cropDragStartCropX.current + dx / displaySize.width));
    }
    function onMouseUp() { cropDragging.current = false; }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [displaySize.width, cropWindowWidth]);

  useEffect(() => {
    function onTouchMove(e: TouchEvent) {
      if (!cropDragging.current) return;
      const dx = e.touches[0].clientX - cropDragStartX.current;
      onCropXChange(clampCropX(cropDragStartCropX.current + dx / displaySize.width));
    }
    function onTouchEnd() { cropDragging.current = false; }
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [displaySize.width, cropWindowWidth]);

  // ── Trim drag handlers ────────────────────────────────────────────────────

  function onTrimHandleMouseDown(e: React.MouseEvent, handle: TrimHandle) {
    e.preventDefault();
    e.stopPropagation();
    trimDragging.current = handle;
  }

  function onTrimHandleTouchStart(e: React.TouchEvent, handle: TrimHandle) {
    e.stopPropagation();
    trimDragging.current = handle;
  }

  useEffect(() => {
    function getBarX(e: MouseEvent | TouchEvent): number {
      const bar = document.getElementById("trim-bar");
      if (!bar) return 0;
      const rect = bar.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      return Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    }

    function onMove(e: MouseEvent | TouchEvent) {
      if (!trimDragging.current) return;
      const fraction = getBarX(e);
      const t = fraction * duration;

      if (trimDragging.current === "start") {
        const newStart = Math.min(t, trimEnd - 0.5);
        onTrimChange(Math.max(newStart, 0), trimEnd);
        if (videoRef.current) videoRef.current.currentTime = Math.max(newStart, 0);
      } else {
        const newEnd = Math.max(t, trimStart + 0.5);
        onTrimChange(trimStart, Math.min(newEnd, duration));
        if (videoRef.current) videoRef.current.currentTime = Math.min(newEnd, duration);
      }
    }

    function onUp() { trimDragging.current = null; }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [trimStart, trimEnd, duration]);

  // ── Playback ──────────────────────────────────────────────────────────────

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      // If playhead is outside trim range, reset to trimStart
      if (video.currentTime < trimStart || video.currentTime >= trimEnd) {
        video.currentTime = trimStart;
      }
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  function onTimeUpdate() {
    const video = videoRef.current;
    if (!video) return;
    const t = video.currentTime;
    setCurrentTime(t);
    // Stop at trim end
    if (t >= trimEnd) {
      video.pause();
      video.currentTime = trimEnd;
      setIsPlaying(false);
    }
  }

  function onEnded() { setIsPlaying(false); }

  function onScrub(e: React.ChangeEvent<HTMLInputElement>) {
    const t = parseFloat(e.target.value);
    const clamped = Math.min(Math.max(t, trimStart), trimEnd);
    if (videoRef.current) videoRef.current.currentTime = clamped;
    setCurrentTime(clamped);
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  const clipDuration = trimEnd - trimStart;
  const startFraction = trimStart / duration;
  const endFraction = trimEnd / duration;
  const playFraction = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="flex flex-col gap-3">

      {/* Label */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-mute uppercase tracking-widest">
          Crop window
        </p>
        <p className="text-[13px] text-mute">
          Drag the highlighted area to reposition
        </p>
      </div>

      {/* Video + crop overlay */}
      <div
        ref={containerRef}
        className="relative w-full rounded-md overflow-hidden bg-black select-none"
        style={{ height: displaySize.height || "auto" }}
      >
        <video
          ref={videoRef}
          src={videoMeta.url}
          className="w-full h-full object-cover pointer-events-none"
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          playsInline
        />

        {displaySize.width > 0 && (
          <>
            {/* Left dark mask */}
            <div
              className="absolute top-0 left-0 h-full bg-black/60 pointer-events-none"
              style={{ width: cropWindowLeft }}
            />
            {/* Right dark mask */}
            <div
              className="absolute top-0 right-0 h-full bg-black/60 pointer-events-none"
              style={{ width: displaySize.width - cropWindowLeft - cropWindowWidth }}
            />
            {/* Crop window */}
            <div
              className="absolute top-0 h-full cursor-ew-resize"
              style={{ left: cropWindowLeft, width: cropWindowWidth }}
              onMouseDown={onCropMouseDown}
              onTouchStart={onCropTouchStart}
            >
              <div className="absolute inset-0 border-2 border-accent rounded-sm pointer-events-none" />
              {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos) => (
                <div key={pos} className={`absolute ${pos} w-3 h-3 bg-accent rounded-sm pointer-events-none`} />
              ))}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-accent/90 rounded-pill px-3 py-1.5 flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 4L2 7L5 10M9 4L12 7L9 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[11px] font-semibold text-white">9:16</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Playback + trim controls */}
      <div className="flex flex-col gap-3 px-3 py-3 rounded-md bg-canvas-elevated border border-hairline">

        {/* Trim bar */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[11px] font-medium text-mute uppercase tracking-widest">
              Trim clip
            </p>
            <p className="text-[11px] text-faint font-mono">
              {formatTime(trimStart)} — {formatTime(trimEnd)}
              <span className="ml-2 text-accent">({clipDuration.toFixed(1)}s)</span>
            </p>
          </div>

          {/* Trim track */}
          <div
            id="trim-bar"
            className="relative w-full h-8 rounded-sm bg-canvas select-none"
            style={{ border: "1px solid var(--color-hairline)" }}
          >
            {/* Full track background */}
            <div className="absolute inset-0 rounded-sm overflow-hidden">
              {/* Dimmed region before start */}
              <div
                className="absolute top-0 left-0 h-full bg-black/30"
                style={{ width: `${startFraction * 100}%` }}
              />
              {/* Selected region */}
              <div
                className="absolute top-0 h-full bg-accent/20 border-y-2 border-accent"
                style={{
                  left: `${startFraction * 100}%`,
                  width: `${(endFraction - startFraction) * 100}%`,
                }}
              />
              {/* Dimmed region after end */}
              <div
                className="absolute top-0 right-0 h-full bg-black/30"
                style={{ width: `${(1 - endFraction) * 100}%` }}
              />
              {/* Playhead */}
              <div
                className="absolute top-0 h-full w-0.5 bg-white/80 pointer-events-none"
                style={{ left: `${playFraction * 100}%` }}
              />
            </div>

            {/* Start handle */}
            <div
              className="absolute top-0 h-full w-4 flex items-center justify-center cursor-ew-resize z-10 group"
              style={{
                left: `calc(${startFraction * 100}% - 8px)`,
              }}
              onMouseDown={(e) => onTrimHandleMouseDown(e, "start")}
              onTouchStart={(e) => onTrimHandleTouchStart(e, "start")}
            >
              <div className="w-3 h-full rounded-l-sm bg-accent flex items-center justify-center">
                <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                  <line x1="2" y1="2" x2="2" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="4" y1="2" x2="4" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* End handle */}
            <div
              className="absolute top-0 h-full w-4 flex items-center justify-center cursor-ew-resize z-10"
              style={{
                left: `calc(${endFraction * 100}% - 8px)`,
              }}
              onMouseDown={(e) => onTrimHandleMouseDown(e, "end")}
              onTouchStart={(e) => onTrimHandleTouchStart(e, "end")}
            >
              <div className="w-3 h-full rounded-r-sm bg-accent flex items-center justify-center">
                <svg width="6" height="12" viewBox="0 0 6 12" fill="none">
                  <line x1="2" y1="2" x2="2" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="4" y1="2" x2="4" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Playback scrubber */}
        <input
          type="range"
          min={0}
          max={duration}
          step={0.01}
          value={currentTime}
          onChange={onScrub}
          className="w-full h-1 accent-accent cursor-pointer"
        />

        {/* Play + time */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-7 h-7 rounded-sm bg-canvas border border-hairline flex items-center justify-center text-ink cursor-pointer hover:border-accent hover:text-accent transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="2" y="1" width="3" height="10" rx="1" fill="currentColor" />
                <rect x="7" y="1" width="3" height="10" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 2L10 6L3 10V2Z" fill="currentColor" />
              </svg>
            )}
          </button>

          <span className="text-[12px] font-mono text-mute tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <span className="ml-auto text-[11px] text-faint font-mono hidden sm:inline">
            {videoMeta.width}×{videoMeta.height}
          </span>
        </div>
      </div>
    </div>
  );
}