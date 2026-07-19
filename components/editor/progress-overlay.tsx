import React, { useEffect, useState } from 'react'

type Props = {
  progress: number;
  onCancel: () => void;
}

const STAGES = [
  { until: 15, label: "Reading video..." },
  { until: 40, label: "Decoding frames…" },
  { until: 80, label: "Reframing to 9:16…" },
  { until: 95, label: "Encoding output…" },
  { until: 100, label: "Wrapping up…" },
];

function getStageLabel(progress: number) {
  for (const stage of STAGES) {
    if (progress <= stage.until) return stage.label;
  }
  return "Wrapping up...";
}

export default function ProgressOverlay({ progress, onCancel }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const label = getStageLabel(progress);
  const isDone = progress >= 100;

  return (
    <div
      className={[
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-canvas/80 backdrop-blur-sm",
        "transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0",
      ].join(" ")}
      role="dialog"
      aria-modal="true"
      aria-label="Processing video"
    >
      <div
        className={[
          "flex flex-col items-center gap-6 p-8 rounded-lg",
          "bg-canvas-elevated border border-hairline",
          "w-85 shadow-floating",
          "transition-transform duration-200",
          visible ? "translate-y-0" : "translate-y-2",
        ].join(" ")}
        style={{ boxShadow: "var(--shadow-floating)" }}
      >
        {/* Animated icon */}
        <div className="relative w-14 h-14">
          {/* Track ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 56 56"
            fill="none"
          >
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="var(--color-hairline)"
              strokeWidth="4"
            />
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="var(--color-accent)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
              style={{ transition: "stroke-dashoffset 0.3s ease" }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isDone ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M4 11.5L9 16.5L18 7"
                  stroke="var(--color-accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <span className="text-[13px] font-semibold font-mono text-ink tabular-nums">
                {progress}%
              </span>
            )}
          </div>
        </div>

        {/* Stage label + progress bar */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-medium text-ink">
              {isDone ? "Done" : label}
            </p>
            <p className="text-[12px] font-mono text-mute tabular-nums">
              {progress}%
            </p>
          </div>

          {/* Track */}
          <div className="w-full h-1.5 rounded-pill bg-hairline overflow-hidden">
            {/* Fill */}
            <div
              className="h-full rounded-pill bg-accent"
              style={{
                width: `${progress}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>

          {/* Stage dots */}
          <div className="flex items-center justify-between px-0.5">
            {STAGES.map((stage, i) => {
              const stageProgress = (i / (STAGES.length - 1)) * 100;
              const isReached = progress >= stageProgress;
              return (
                <div
                  key={stage.label}
                  className={[
                    "w-1.5 h-1.5 rounded-full transition-colors duration-300",
                    isReached ? "bg-accent" : "bg-hairline",
                  ].join(" ")}
                />
              );
            })}
          </div>
        </div>

        {/* Current stage description */}
        <div className="w-full flex flex-col gap-2">
          {STAGES.map((stage, i) => {
            const prevUntil = i === 0 ? 0 : STAGES[i - 1].until;
            const isActive = progress > prevUntil && progress <= stage.until;
            const isPast = progress > stage.until;
            return (
              <div
                key={stage.label}
                className={[
                  "flex items-center gap-2.5 transition-opacity duration-200",
                  isActive ? "opacity-100" : isPast ? "opacity-40" : "opacity-20",
                ].join(" ")}
              >
                {/* Step icon */}
                <div
                  className={[
                    "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-200",
                    isPast
                      ? "border-accent bg-accent"
                      : isActive
                        ? "border-accent bg-transparent"
                        : "border-hairline bg-transparent",
                  ].join(" ")}
                >
                  {isPast && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path
                        d="M1.5 4L3 5.5L6.5 2"
                        stroke="white"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  )}
                </div>
                <span
                  className={[
                    "text-[12px]",
                    isActive ? "text-ink font-medium" : "text-mute",
                  ].join(" ")}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Cancel note */}
        {!isDone && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-[11px] text-faint text-center leading-relaxed">
              Processing happens in your browser.
              <br />
              Keep this tab open until it finishes.
            </p>
            <button
              onClick={onCancel}
              className="text-[12px] text-mute bg-transparent border-none cursor-pointer hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}