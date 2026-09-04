import { useState, useRef, useCallback } from "react";
import type { CaptionSegment } from "../../lib/types";

export type WhisperStatus =
  | "idle"
  | "loading-model"
  | "extracting-audio"
  | "transcribing"
  | "done"
  | "error";

export type UseWhisperResult = {
  status: WhisperStatus;
  modelProgress: number; // 0-100 model download progress
  transcribeProgress: number; // 0-100 transcription progress
  segments: CaptionSegment[];
  errorMessage: string | null;
  transcribe: (file: File, trimStart: number, trimEnd: number) => Promise<void>;
  reset: () => void;
};

export function useWhisper(): UseWhisperResult {
  const [status, setStatus] = useState<WhisperStatus>("idle");
  const [modelProgress, setModelProgress] = useState(0);
  const [transcribeProgress, setTranscribeProgress] = useState(0);
  const [segments, setSegments] = useState<CaptionSegment[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pipelineRef = useRef<any>(null);

  const transcribe = useCallback(
    async (file: File, trimStart: number, trimEnd: number) => {
      setStatus("idle");
      setErrorMessage(null);
      setSegments([]);
      setModelProgress(0);
      setTranscribeProgress(0);

      try {
        //load whisper model
        setStatus("loading-model");

        const { pipeline, env } = await import(
          /* @vite-ignore */
          "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js"
        );
        //use local cache - mode downloads and is cached
        env.allowLocalModels = false;
        env.useBrowserCache = true;

        if (!pipelineRef.current) {
          pipelineRef.current = await pipeline(
            "automatic-speech-recognition",
            "Xenova/whisper-tiny",
            {
              progress_callback: (p: any) => {
                if (p.status === "downloading") {
                  const percent = Math.round((p.loaded / p.total) * 100);
                  setModelProgress(isNaN(percent) ? 0 : percent);
                }
                if (p.status === "ready") {
                  setModelProgress(100);
                }
              },
            },
          );
        } else {
          setModelProgress(100);
        }
        // ── Step 2: Extract audio from video ──────────────────────────────────
        setStatus("extracting-audio");

        const audioBuffer = await extractAudio(file, trimStart, trimEnd);
        // ── Step 3: Transcribe ─────────────────────────────────────────────────
        setStatus("transcribing");

        const result = await pipelineRef.current(audioBuffer, {
          return_timestamps: true,
          chunk_length_s: 30,
          stride_length_s: 5,
          callback_function: (beams: any[]) => {
            // Progress approximation based on processed chunks
            if (beams?.[0]?.output_token_ids) {
              setTranscribeProgress((prev) => Math.min(prev + 10, 90));
            }
          },
        });
        // ── Step 4: Parse segments ─────────────────────────────────────────────
        const rawSegments = result.chunks as Array<{
          text: string;
          timestamp: [number, number];
        }>;

        if (!rawSegments || rawSegments.length === 0) {
          throw new Error(
            "No speech detected in the selected clip. Make sure the video has clear speech.",
          );
        }

        // Offset timestamps by trimStart so they align with the trimmed clip
        const parsed: CaptionSegment[] = rawSegments
          .filter((s) => s.text.trim().length > 0)
          .map((s) => ({
            start: Math.max(0, s.timestamp[0] ?? 0),
            end: Math.max(0, s.timestamp[1] ?? s.timestamp[0] + 2),
            text: s.text.trim(),
          }));

        setSegments(parsed);
        setTranscribeProgress(100);
        setStatus("done");
      } catch (err) {
        console.error("Whisper error:", err);
        setErrorMessage(
          err instanceof Error ? err.message : "Transcription failed.",
        );
        setStatus("error");
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setModelProgress(0);
    setTranscribeProgress(0);
    setSegments([]);
    setErrorMessage(null);
  }, []);

  return {
    status,
    modelProgress,
    transcribeProgress,
    segments,
    errorMessage,
    transcribe,
    reset,
  };
}

// ── Audio extraction ──────────────────────────────────────────────────────────
//
// Uses the Web Audio API to decode the video file and extract raw PCM audio
// as a Float32Array which is what Whisper expects as input.
// We only extract the trimmed portion to avoid transcribing unused audio.

async function extractAudio(
  file: File,
  trimStart: number,
  trimEnd: number,
): Promise<Float32Array> {
  const arrayBuffer = await file.arrayBuffer();

  const audioContext = new AudioContext({ sampleRate: 16000 });

  let audioBuffer: AudioBuffer;
  try {
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch {
    throw new Error(
      "Could not extract audio from this video. Make sure the video has an audio track.",
    );
  }
  const sampleRate = audioContext.sampleRate;
  const startSample = Math.floor(trimStart * sampleRate);
  const endSample = Math.floor(trimEnd * sampleRate);
  const length = endSample - startSample;

  if (length <= 0) {
    throw new Error("Invalid trim range for audio extraction.");
  }

  // Mix down to mono (Whisper expects mono 16kHz audio)
  const channelData = audioBuffer.getChannelData(0);
  const trimmed = channelData.slice(startSample, endSample);

  await audioContext.close();

  return trimmed;
}
