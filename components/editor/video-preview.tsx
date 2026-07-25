import React, { useRef, useState, useCallback, useEffect } from 'react';
import type { VideoMeta } from '../../lib/types';

type Props = {
  videoMeta: VideoMeta;
  cropX: number;
  onCropXChange: (x: number) => void;
}

const TARGET_RATIO = 9 / 16;

export default function VideoPreview({ videoMeta, cropX, onCropXChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartCropX = useRef(0);

  useEffect(() => {
    function measure() {
      const container = containerRef.current;
      if (!container) return;
      const containerWidth = container.clientWidth;
      const videoRatio = videoMeta.width / videoMeta.height;
      const displayWidth = containerWidth;
      const displayHeight = displayWidth / videoRatio;
      setDisplaySize({ width: displayWidth, height: displayHeight });

      // Center crop window on first load
      const cropWindowWidth = TARGET_RATIO * displayHeight;
      const maxLeft = displayWidth - cropWindowWidth;
      onCropXChange((maxLeft / 2) / displayWidth);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [videoMeta.width, videoMeta.height]);

  // Crop window dimensions in display pixels
  const cropWindowWidth = TARGET_RATIO * displaySize.height;
  const cropWindowLeft = cropX * displaySize.width;

  // Clamp cropX so window never goes out of bounds
  function clampCropX(raw: number) {
    const maxLeft = displaySize.width - cropWindowWidth;
    return Math.min(Math.max(raw, 0), maxLeft / displaySize.width);
  }

  // Drag handlers
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    dragStartX.current = e.clientX;
    dragStartCropX.current = cropX;
  }, [cropX]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current) return;
      const dx = e.clientX - dragStartX.current;
      const newCropX = dragStartCropX.current + dx / displaySize.width;
      onCropXChange(clampCropX(newCropX));
    }

    function onMouseUp() {
      dragging.current = false;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [displaySize.width, cropWindowWidth])

  // Touch handlers for mobile
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragging.current = true;
    dragStartX.current = e.touches[0].clientX;
    dragStartCropX.current = cropX;
  }, [cropX]);

  useEffect(() => {
    function onTouchMove(e: TouchEvent) {
      if (!dragging.current) return;
      const dx = e.touches[0].clientX - dragStartX.current;
      const newCropX = dragStartCropX.current + dx / displaySize.width;
      onCropXChange(clampCropX(newCropX));
    }

    function onTouchEnd() {
      dragging.current = false;
    }

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [displaySize.width, cropWindowWidth]);

  // Playback controls
  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  function onTimeUpdate() {
    setCurrentTime(videoRef.current?.currentTime ?? 0);
  }

  function onEnded() {
    setIsPlaying(false);
  }

  function onScrub(e: React.ChangeEvent<HTMLInputElement>) {
    const t = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = t;
    setCurrentTime(t);
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

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
        {/* Video */}
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
              style={{
                width: displaySize.width - cropWindowLeft - cropWindowWidth,
              }}
            />

            {/* Crop window border + drag handle */}
            <div
              className="absolute top-0 h-full cursor-ew-resize"
              style={{
                left: cropWindowLeft,
                width: cropWindowWidth,
              }}
              onMouseDown={onMouseDown}
              onTouchStart={onTouchStart}
            >
              {/* Border */}
              <div className="absolute inset-0 border-2 border-accent rounded-sm pointer-events-none" />

              {/* Corner handles */}
              {[
                "top-0 left-0",
                "top-0 right-0",
                "bottom-0 left-0",
                "bottom-0 right-0",
              ].map((pos) => (
                <div
                  key={pos}
                  className={`absolute ${pos} w-3 h-3 bg-accent rounded-sm pointer-events-none`}
                />
              ))}

              {/* Center drag pill */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-accent/90 rounded-pill px-3 py-1.5 flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M5 4L2 7L5 10M9 4L12 7L9 10"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[11px] font-semibold text-white">
                    9:16
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Playback controls */}
      <div
        className="flex flex-col gap-2 px-3 py-2.5 rounded-md bg-canvas-elevated border border-hairline"
      >
        {/* Scrubber */}
        <input
          type="range"
          min={0}
          max={videoMeta.duration}
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
                <path
                  d="M3 2L10 6L3 10V2Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          <span className="text-[12px] font-mono text-mute tabular-nums">
            {formatTime(currentTime)} / {formatTime(videoMeta.duration)}
          </span>

          {/* Resolution badge */}
          <span className="ml-auto text-[11px] text-faint font-mono hidden sm:inline">
            {videoMeta.width}×{videoMeta.height}
          </span>
        </div>
      </div>
    </div>
  )
}
