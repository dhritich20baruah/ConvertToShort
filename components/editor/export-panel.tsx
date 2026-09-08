import React from "react";
import { useTranslation } from "react-i18next";
import type {
  CropMode,
  Quality,
  TextOverlay,
  TextColor,
  TextPosition,
  TextSize,
  AutoCaption,
} from "../../lib/types";
import type { WhisperStatus } from '../../src/hooks/use-whisper';

type Props = {
  onExport: () => void;
  cropMode: CropMode;
  quality: Quality;
  onCropModeChange: (mode: CropMode) => void;
  onQualityChange: (quality: Quality) => void;
  trimStart: number;
  trimEnd: number;
  textOverlay: TextOverlay;
  onTextOverlayChange: (overlay: TextOverlay) => void;
  autoCaption: AutoCaption;
  onAutoCaptionChange: (caption: AutoCaption) => void;
  whisperStatus: WhisperStatus;
  whisperModelProgress: number;
  whisperTranscribeProgress: number;
  whisperError: string | null;
  onGenerateCaptions: () => void;
};

export default function ExportPanel({
  onExport,
  cropMode,
  quality,
  onCropModeChange,
  onQualityChange,
  trimStart,
  trimEnd,
  textOverlay,
  onTextOverlayChange,
  autoCaption,
  onAutoCaptionChange,
  whisperStatus,
  whisperModelProgress,
  whisperTranscribeProgress,
  whisperError,
  onGenerateCaptions,
}: Props) {
  const { t } = useTranslation();

  function updateOverlay<K extends keyof TextOverlay>(
    key: K,
    value: TextOverlay[K]
  ) {
    onTextOverlayChange({ ...textOverlay, [key]: value });
  }

  function updateCaption<K extends keyof AutoCaption>(
    key: K,
    value: AutoCaption[K]
  ) {
    onAutoCaptionChange({ ...autoCaption, [key]: value });
  }

  const clipDuration = trimEnd - trimStart;

  return (
    <div className="flex flex-col gap-4 p-4 rounded-md bg-canvas-elevated border border-hairline">

      {/* Header */}
      <div>
        <p className="text-[13px] font-semibold text-ink">{t("exportPanel.title")}</p>
        <p className="text-[12px] text-mute mt-0.5">{t("exportPanel.output")}</p>
      </div>

      <Divider />

      {/* Style */}
      <div className="flex flex-col gap-2">
        <p className="text-[12px] font-medium text-mute uppercase tracking-widest">
          {t("exportPanel.style")}
        </p>
        <div className="flex flex-col gap-2">
          <OptionCard
            selected={cropMode === "center"}
            onClick={() => onCropModeChange("center")}
            title={t("exportPanel.centerCrop")}
            description={t("exportPanel.centerCropDesc")}
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="1" y="4" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="7" y="4" width="6" height="12" rx="1" fill="currentColor" opacity="0.25" />
                <rect x="7.75" y="4.75" width="4.5" height="10.5" rx="0.5" stroke="currentColor" strokeWidth="1" />
              </svg>
            }
          />
          <OptionCard
            selected={cropMode === "blur-letterbox"}
            onClick={() => onCropModeChange("blur-letterbox")}
            title={t("exportPanel.blurLetterbox")}
            description={t("exportPanel.blurLetterboxDesc")}
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="5" y="1" width="10" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="5" y="1" width="10" height="4.5" rx="1.5" fill="currentColor" opacity="0.15" />
                <rect x="5" y="14.5" width="10" height="4.5" rx="1.5" fill="currentColor" opacity="0.15" />
                <rect x="5.75" y="6" width="8.5" height="8" rx="0.75" stroke="currentColor" strokeWidth="1" />
              </svg>
            }
          />
        </div>
      </div>

      <Divider />

      {/* Quality */}
      <div className="flex flex-col gap-2">
        <p className="text-[12px] font-medium text-mute uppercase tracking-widest">
          {t("exportPanel.quality")}
        </p>
        <div className="flex gap-2">
          <QualityButton
            selected={quality === "high"}
            onClick={() => onQualityChange("high")}
            label={t("exportPanel.high")}
            sub="~8 Mbps"
          />
          <QualityButton
            selected={quality === "medium"}
            onClick={() => onQualityChange("medium")}
            label={t("exportPanel.medium")}
            sub="~4 Mbps"
          />
        </div>
        <p className="text-[11px] text-faint leading-relaxed">
          {quality === "high" ? t("exportPanel.highDesc") : t("exportPanel.mediumDesc")}
        </p>
      </div>

      <Divider />

      {/* Text overlay */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="text-[12px] font-medium text-mute uppercase tracking-widest">
              {t("exportPanel.textOverlay")}
            </p>
            {autoCaption.enabled && (
              <p className="text-[10px] text-faint">
                {t("exportPanel.textOverlayDisabled")}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              if (autoCaption.enabled) return;
              updateOverlay("enabled", !textOverlay.enabled);
            }}
            className={[
              "w-10 h-5 rounded-pill border transition-colors duration-150 relative shrink-0",
              autoCaption.enabled ? "opacity-40 cursor-not-allowed" : "",
              textOverlay.enabled && !autoCaption.enabled
                ? "bg-accent border-accent"
                : "bg-canvas border-hairline",
            ].join(" ")}
            aria-label={t("exportPanel.textOverlay")}
          >
            <div
              className={[
                "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-150",
                textOverlay.enabled && !autoCaption.enabled
                  ? "translate-x-5"
                  : "translate-x-0.5",
              ].join(" ")}
            />
          </button>
        </div>

        {textOverlay.enabled && (
          <div className="flex flex-col gap-3">
            <textarea
              rows={2}
              value={textOverlay.text}
              onChange={(e) => updateOverlay("text", e.target.value)}
              placeholder={t("exportPanel.textPlaceholder")}
              maxLength={100}
              className="w-full px-3 py-2 rounded-sm border border-hairline bg-canvas text-ink text-[13px] placeholder:text-faint focus:outline-none focus:border-accent transition-colors resize-none"
            />

            {/* Position */}
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] font-medium text-mute uppercase tracking-widest">
                {t("exportPanel.position")}
              </p>
              <div className="flex gap-2">
                {(["top", "center", "bottom"] as TextPosition[]).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => updateOverlay("position", pos)}
                    className={[
                      "flex-1 py-1.5 rounded-sm border text-[12px] font-medium cursor-pointer transition-colors capitalize",
                      textOverlay.position === pos
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-hairline bg-canvas text-mute hover:border-accent/50",
                    ].join(" ")}
                  >
                    {t(`exportPanel.${pos}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] font-medium text-mute uppercase tracking-widest">
                {t("exportPanel.color")}
              </p>
              <div className="flex gap-2">
                {([
                  { value: "white", bg: "#ffffff", border: "#e0e0e0" },
                  { value: "black", bg: "#000000", border: "#000000" },
                  { value: "yellow", bg: "#facc15", border: "#facc15" },
                ] as { value: TextColor; bg: string; border: string }[]).map(
                  ({ value, bg, border }) => (
                    <button
                      key={value}
                      onClick={() => updateOverlay("color", value)}
                      aria-label={value}
                      className={[
                        "w-8 h-8 rounded-sm border-2 cursor-pointer transition-all",
                        textOverlay.color === value
                          ? "border-accent scale-110"
                          : "border-transparent hover:border-hairline",
                      ].join(" ")}
                      style={{ backgroundColor: bg, outline: `1px solid ${border}` }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Size */}
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] font-medium text-mute uppercase tracking-widest">
                {t("exportPanel.size")}
              </p>
              <div className="flex gap-2">
                {(["small", "medium", "large"] as TextSize[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateOverlay("size", s)}
                    className={[
                      "flex-1 py-1.5 rounded-sm border text-[12px] font-medium cursor-pointer transition-colors capitalize",
                      textOverlay.size === s
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-hairline bg-canvas text-mute hover:border-accent/50",
                    ].join(" ")}
                  >
                    {t(`exportPanel.${s}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Divider />

      {/* Auto captions */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-medium text-mute uppercase tracking-widest">
            {t("exportPanel.autoCaptions")}
          </p>
          <button
            onClick={() => {
              const next = !autoCaption.enabled;
              onAutoCaptionChange({ ...autoCaption, enabled: next });
              if (next && textOverlay.enabled) {
                onTextOverlayChange({ ...textOverlay, enabled: false });
              }
            }}
            className={[
              "w-10 h-5 rounded-pill border transition-colors duration-150 relative",
              autoCaption.enabled
                ? "bg-accent border-accent"
                : "bg-canvas border-hairline",
            ].join(" ")}
            aria-label={t("exportPanel.autoCaptions")}
          >
            <div
              className={[
                "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-150",
                autoCaption.enabled ? "translate-x-5" : "translate-x-0.5",
              ].join(" ")}
            />
          </button>
        </div>

        {autoCaption.enabled && (
          <div className="flex flex-col gap-3">

            {/* Privacy note */}
            <div className="flex items-start gap-2 p-3 rounded-sm bg-accent/5 border border-accent/20">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-accent shrink-0 mt-0.5">
                <path
                  d="M7 1L2 3.5V7C2 9.76 4.24 12.35 7 13C9.76 12.35 12 9.76 12 7V3.5L7 1Z"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-[11px] text-accent leading-relaxed">
                {t("exportPanel.autoCaptionsPrivacy")}
              </p>
            </div>

            {/* Whisper status */}
            {whisperStatus === "idle" || whisperStatus === "error" ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={onGenerateCaptions}
                  className="w-full py-2.5 rounded-sm border border-accent bg-accent/5 text-accent text-[13px] font-semibold cursor-pointer hover:bg-accent hover:text-accent-ink transition-colors"
                >
                  {t("exportPanel.generateCaptions")}
                </button>
                {whisperError && (
                  <p className="text-[11px] text-error leading-relaxed">
                    {whisperError}
                  </p>
                )}
              </div>
            ) : whisperStatus === "loading-model" ? (
              <WhisperProgress
                label={t("whisper.downloadingModel")}
                sub={t("whisper.downloadingModelSub")}
                progress={whisperModelProgress}
              />
            ) : whisperStatus === "extracting-audio" ? (
              <WhisperProgress
                label={t("whisper.extractingAudio")}
                sub={t("whisper.extractingAudioSub")}
                progress={100}
                indeterminate
              />
            ) : whisperStatus === "transcribing" ? (
              <WhisperProgress
                label={t("whisper.transcribing")}
                sub={t("whisper.transcribingSub")}
                progress={whisperTranscribeProgress}
              />
            ) : whisperStatus === "done" && autoCaption.generated ? (
              <div className="flex flex-col gap-3">

                {/* Success */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5L4 7L8 3"
                        stroke="var(--color-accent)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-[12px] text-ink font-medium">
                    {t("exportPanel.captionSegments", { count: autoCaption.segments.length })}
                  </p>
                  <button
                    onClick={onGenerateCaptions}
                    className="ml-auto text-[11px] text-mute hover:text-ink transition-colors bg-transparent border-none cursor-pointer"
                  >
                    {t("exportPanel.regenerate")}
                  </button>
                </div>

                {/* Caption preview */}
                <div className="flex flex-col gap-1 max-h-32 overflow-y-auto rounded-sm border border-hairline bg-canvas p-2">
                  {autoCaption.segments.map((seg, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[10px] font-mono text-faint shrink-0 mt-0.5">
                        {formatTime(seg.start)}
                      </span>
                      <span className="text-[11px] text-body leading-relaxed">
                        {seg.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Caption color */}
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] font-medium text-mute uppercase tracking-widest">
                    {t("exportPanel.captionColor")}
                  </p>
                  <div className="flex gap-2">
                    {([
                      { value: "white", bg: "#ffffff", border: "#e0e0e0" },
                      { value: "black", bg: "#000000", border: "#000000" },
                      { value: "yellow", bg: "#facc15", border: "#facc15" },
                    ] as { value: TextColor; bg: string; border: string }[]).map(
                      ({ value, bg, border }) => (
                        <button
                          key={value}
                          onClick={() => updateCaption("color", value)}
                          aria-label={value}
                          className={[
                            "w-8 h-8 rounded-sm border-2 cursor-pointer transition-all",
                            autoCaption.color === value
                              ? "border-accent scale-110"
                              : "border-transparent hover:border-hairline",
                          ].join(" ")}
                          style={{
                            backgroundColor: bg,
                            outline: `1px solid ${border}`,
                          }}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Caption size */}
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] font-medium text-mute uppercase tracking-widest">
                    {t("exportPanel.captionSize")}
                  </p>
                  <div className="flex gap-2">
                    {(["small", "medium", "large"] as TextSize[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateCaption("size", s)}
                        className={[
                          "flex-1 py-1.5 rounded-sm border text-[12px] font-medium cursor-pointer transition-colors capitalize",
                          autoCaption.size === s
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-hairline bg-canvas text-mute hover:border-accent/50",
                        ].join(" ")}
                      >
                        {t(`exportPanel.${s}`)}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            ) : null}

          </div>
        )}
      </div>

      <Divider />

      {/* Output info */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[12px] font-medium text-mute uppercase tracking-widest">
          {t("exportPanel.outputSection")}
        </p>
        <div className="flex flex-col gap-1">
          <InfoRow label={t("exportPanel.format")} value="MP4 (H.264)" />
          <InfoRow label={t("exportPanel.resolution")} value="1080 × 1920" />
          <InfoRow label={t("exportPanel.aspectRatio")} value="9:16" />
          <InfoRow
            label={t("exportPanel.style")}
            value={cropMode === "center"
              ? t("exportPanel.centerCrop")
              : t("exportPanel.blurLetterbox")}
          />
          <InfoRow
            label={t("exportPanel.bitrate")}
            value={quality === "high" ? "~8 Mbps" : "~4 Mbps"}
          />
          <InfoRow
            label={t("exportPanel.clipDuration")}
            value={`${clipDuration.toFixed(1)}s`}
          />
          {textOverlay.enabled && textOverlay.text.trim() && (
            <InfoRow
              label={t("exportPanel.text")}
              value={`"${textOverlay.text.slice(0, 20)}${textOverlay.text.length > 20 ? "…" : ""}"`}
            />
          )}
          {autoCaption.enabled && autoCaption.generated && (
            <InfoRow
              label={t("exportPanel.captions")}
              value={t("exportPanel.segments", { count: autoCaption.segments.length })}
            />
          )}
        </div>
      </div>

      <Divider />

      {/* Privacy note */}
      <div className="flex items-start gap-2">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="text-mute shrink-0 mt-0.5"
        >
          <path
            d="M7 1L2 3.5V7C2 9.76 4.24 12.35 7 13C9.76 12.35 12 9.76 12 7V3.5L7 1Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <path
            d="M5 7L6.5 8.5L9.5 5.5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-[11px] text-faint leading-relaxed">
          {t("exportPanel.privacyNote")}
        </p>
      </div>

      {/* Export button */}
      <button
        onClick={onExport}
        className="w-full py-2.5 rounded-pill bg-accent text-accent-ink text-[14px] font-semibold cursor-pointer border-none hover:opacity-90 transition-opacity"
      >
        {t("exportPanel.exportButton")}
      </button>

    </div>
  );
}

// ── Sub components ─────────────────────────────────────────────────────────────

function Divider() {
  return <div className="h-px bg-hairline w-full" />;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-mute">{label}</span>
      <span className="text-[12px] font-medium text-body">{value}</span>
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  title,
  description,
  icon,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-start gap-3 p-3 rounded-md border text-left cursor-pointer transition-colors duration-150",
        selected
          ? "border-accent bg-accent/5"
          : "border-hairline bg-canvas hover:border-accent/50",
      ].join(" ")}
    >
      <div
        className={[
          "shrink-0 w-9 h-9 rounded-sm flex items-center justify-center transition-colors duration-150",
          selected ? "bg-accent/10 text-accent" : "bg-hairline-soft text-mute",
        ].join(" ")}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 pt-0.5">
        <span className={["text-[13px] font-semibold", selected ? "text-accent" : "text-ink"].join(" ")}>
          {title}
        </span>
        <span className="text-[12px] text-mute leading-relaxed break-words">
          {description}
        </span>
      </div>
      <div className="ml-auto shrink-0 mt-0.5">
        <div
          className={[
            "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-150",
            selected ? "border-accent" : "border-hairline",
          ].join(" ")}
        >
          {selected && <div className="w-2 h-2 rounded-full bg-accent" />}
        </div>
      </div>
    </button>
  );
}

function QualityButton({
  selected,
  onClick,
  label,
  sub,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  sub: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-md border cursor-pointer transition-colors duration-150",
        selected
          ? "border-accent bg-accent/5"
          : "border-hairline bg-canvas hover:border-accent/50",
      ].join(" ")}
    >
      <span className={["text-[13px] font-semibold", selected ? "text-accent" : "text-ink"].join(" ")}>
        {label}
      </span>
      <span className="text-[11px] text-mute font-mono">{sub}</span>
    </button>
  );
}

function WhisperProgress({
  label,
  sub,
  progress,
  indeterminate = false,
}: {
  label: string;
  sub: string;
  progress: number;
  indeterminate?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium text-ink">{label}</p>
        {!indeterminate && (
          <p className="text-[11px] font-mono text-mute">{progress}%</p>
        )}
      </div>
      <div className="w-full h-1.5 rounded-pill bg-hairline overflow-hidden">
        {indeterminate ? (
          <div className="h-full w-1/3 rounded-pill bg-accent animate-pulse" />
        ) : (
          <div
            className="h-full rounded-pill bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        )}
      </div>
      <p className="text-[11px] text-faint">{sub}</p>
    </div>
  );
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}