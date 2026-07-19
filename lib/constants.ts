// ─── Input constraints ────────────────────────────────────────────────────────

export const MAX_DURATION = 90;        // seconds
export const MAX_WIDTH = 1920;
export const MAX_HEIGHT = 1080;

// ─── Output dimensions ────────────────────────────────────────────────────────

export const OUTPUT_WIDTH = 1080;
export const OUTPUT_HEIGHT = 1920;
export const TARGET_RATIO = OUTPUT_WIDTH / OUTPUT_HEIGHT; // 9:16 = 0.5625

// ─── Bitrates ─────────────────────────────────────────────────────────────────

export const BITRATE: Record<"high" | "medium", number> = {
  high: 8_000_000,    // 8 Mbps
  medium: 4_000_000,  // 4 Mbps
};

// ─── Audio ────────────────────────────────────────────────────────────────────

export const AUDIO_BITRATE = 128_000;  // 128 kbps
export const AUDIO_SAMPLE_RATE = 44100;
export const AUDIO_CHANNELS = 2;

// ─── Encoder ─────────────────────────────────────────────────────────────────

export const VIDEO_CODEC = "avc1.640028"; // H.264 High Profile Level 4.0
export const AUDIO_CODEC = "mp4a.40.2";  // AAC-LC

// ─── Demuxer ─────────────────────────────────────────────────────────────────

export const SAMPLES_PER_CHUNK = 100; // how many samples mp4box extracts at a time

// ─── Progress thresholds (0–100) ─────────────────────────────────────────────

export const PROGRESS = {
  DEMUX_START: 0,
  DEMUX_DONE: 15,
  DECODE_START: 15,
  DECODE_DONE: 40,
  REFRAME_START: 40,
  REFRAME_DONE: 80,
  ENCODE_START: 80,
  ENCODE_DONE: 95,
  MUX_DONE: 100,
} as const;