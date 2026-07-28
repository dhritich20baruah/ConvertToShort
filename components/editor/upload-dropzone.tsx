import type { VideoMeta } from '../../lib/types';
import React from 'react'
import { useRef, useState, useCallback } from 'react';

const MAX_DURATION = 600;
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const ACCEPTED_TYPES = ["video/mp4", "video/quicktime"];

type Props = {
  onFileAccepted: (meta: VideoMeta) => void;
};

type DropState = "idle" | "dragging" | "error";

export default function UploadDropzone({ onFileAccepted }: Props) {
  const [dropState, setDropState] = useState<DropState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function clearError() {
    setErrorMessage(null);
    setDropState("idle")
  }

  const processFile = useCallback(
    (file: File) => {
      clearError();

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setDropState("error");
        setErrorMessage("Only MP4 and MOV files are supported");
        return;
      }

      setLoading(true);

      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = url;

      video.onloadedmetadata = () => {
        const { duration, videoWidth: width, videoHeight: height } = video;

        if (duration > MAX_DURATION) {
          URL.revokeObjectURL(url);
          setLoading(false);
          setDropState("error");
          setErrorMessage(
            `Video is ${Math.round(duration)}s — max allowed is 10 minutes.`
          );
          return;
        }

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          URL.revokeObjectURL(url);
          setLoading(false);
          setDropState("error");
          setErrorMessage(
            `Resolution ${width}×${height} exceeds the 1920×1080 limit.`
          );
          return;
        }

        setLoading(false);
        onFileAccepted({ file, url, duration, width, height });
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        setLoading(false);
        setDropState("error");
        setErrorMessage("Could not read this file. Try a different video.");
      };
    },
    [onFileAccepted]
  );

  // Drag handlers
  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDropState("dragging");
  }

  function onDragLeave(e: React.DragEvent) {
    // Only reset if leaving the dropzone entirely, not a child element
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropState("idle");
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDropState("idle");
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so same file can be re-selected after an error
    e.target.value = "";
  }

  const isDragging = dropState === "dragging";
  const isError = dropState === "error";

  return (
    <div className="w-full max-w-130 flex flex-col items-center gap-3">
      {/* Drop zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !loading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        aria-label="Upload video file"
        className={[
          "w-full rounded-md border-2 border-dashed transition-colors duration-150 cursor-pointer",
          "flex flex-col items-center justify-center gap-4 px-8 py-14 text-center",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          isDragging
            ? "border-accent bg-accent/5"
            : isError
              ? "border-error bg-error/5"
              : "border-hairline bg-canvas-elevated hover:border-accent hover:bg-accent/5",
        ].join(" ")}
      >
        {/* Icon */}
        <div
          className={[
            "w-14 h-14 rounded-md flex items-center justify-center transition-colors duration-150",
            isDragging
              ? "bg-accent/10 text-accent"
              : isError
                ? "bg-error/10 text-error"
                : "bg-hairline-soft text-mute",
          ].join(" ")}
        >
          {loading ? (
            // Spinner
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="animate-spin"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="40"
                strokeDashoffset="10"
                strokeLinecap="round"
              />
            </svg>
          ) : isError ? (
            // Error icon
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
          ) : (
            // Upload icon
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 16V8M12 8L9 11M12 8L15 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 16.5C4 18.43 5.57 20 7.5 20h9c1.93 0 3.5-1.57 3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1">
          {loading ? (
            <p className="text-[15px] font-medium text-body">
              Reading video…
            </p>
          ) : isError ? (
            <>
              <p className="text-[15px] font-medium text-error">
                {errorMessage}
              </p>
              <p className="text-[13px] text-mute">
                Click to try a different file
              </p>
            </>
          ) : isDragging ? (
            <p className="text-[15px] font-medium text-accent">
              Drop to load video
            </p>
          ) : (
            <>
              <p className="text-[15px] font-medium text-ink">
                Drop your video here
              </p>
              <p className="text-[13px] text-mute">
                or{" "}
                <span className="text-accent underline underline-offset-2">
                  browse files
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  )
}
