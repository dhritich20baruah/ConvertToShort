export default function SeoContent() {
  return (
    <div className="w-full max-w-215 mx-auto px-6 py-16 flex flex-col gap-16">

      {/* How it works */}
      <section>
        <h2 className="text-[22px] font-bold text-ink tracking-tight mb-6">
          How to convert video to YouTube Shorts
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {[
            {
              step: "1",
              title: "Drop your video",
              body: "Upload any MP4 or MOV file up to 10 minutes long. Your video never leaves your device — everything stays local.",
            },
            {
              step: "2",
              title: "Trim your clip",
              body: "Drag the start and end handles on the trim bar to select exactly the portion you want to keep.",
            },
            {
              step: "3",
              title: "Adjust the crop",
              body: "Drag the 9:16 crop window to frame the most important part of your video. Choose center crop or blur letterbox style.",
            },
            {
              step: "4",
              title: "Add captions or text and export",
              body: "Generate automatic captions powered by Whisper AI, add a text overlay, then click Export Short to download a clean 1080×1920 MP4.",
            },
          ].map(({ step, title, body }) => (
            <div
              key={step}
              className="flex flex-col gap-3 p-5 rounded-md border border-hairline bg-canvas-elevated"
            >
              <div className="w-8 h-8 rounded-sm bg-accent/10 text-accent flex items-center justify-center text-[13px] font-bold">
                {step}
              </div>
              <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
              <p className="text-[13px] text-body leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-[22px] font-bold text-ink tracking-tight mb-6">
          Everything you need to create YouTube Shorts
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            {
              title: "Auto captions powered by Whisper AI",
              body: "Generate accurate captions automatically from your video's speech. Whisper AI runs entirely in your browser — your audio never leaves your device. The model downloads once (~75MB) and is cached for instant use afterwards. Captions are timed and burned directly into the exported Short.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2a4 4 0 0 1 4 4v3a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 9a6 6 0 0 0 12 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="9" y1="15" x2="9" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="6" y1="17" x2="12" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              title: "Trim clips from longer videos",
              body: "Upload videos up to 10 minutes long and use the dual-handle trim bar to select exactly the clip you want. The selected duration is shown in real time so you can nail the perfect cut.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 9h14M6 5v8M12 5v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              title: "Crop to 9:16 with draggable window",
              body: "Drag the 9:16 crop window left or right to choose exactly which part of the frame to keep. Preview the crop on the actual video before exporting.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="6" y="4" width="6" height="10" rx="1" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" />
                </svg>
              ),
            },
            {
              title: "Blur letterbox style",
              body: "Keep your full original frame visible in the center with a blurred and darkened version of the same video filling the top and bottom — the most popular look on short-form video platforms.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="5" y="1" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="5" y="1" width="8" height="4" rx="1.5" fill="currentColor" opacity="0.2" />
                  <rect x="5" y="13" width="8" height="4" rx="1.5" fill="currentColor" opacity="0.2" />
                </svg>
              ),
            },
            {
              title: "Text overlays",
              body: "Add text directly to your Short. Choose position (top, center, or bottom), color (white, black, or yellow), and font size. The text is burned into the exported video — no extra editing needed.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 4h12M9 4v10M6 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              title: "100% private — video never leaves your device",
              body: "Unlike other YouTube Shorts converters, your video is never uploaded to any server. All processing happens locally in your browser using WebAssembly. No one can see, store, or access your content.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1L2 4.5V9C2 12.76 5.24 15.85 9 17C12.76 15.85 16 12.76 16 9V4.5L9 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M6 9L8 11L12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              title: "Completely free — no watermark, no limits",
              body: "Convert to Shorts is free with no hidden costs. No watermarks, no export limits, no premium tier. Every feature including trimming and text overlays is available to everyone at no cost.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              title: "No account or registration required",
              body: "Just open the website and start converting. No sign-up, no email, no password. We don't collect any personal information because we don't need to.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 16c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              title: "Works offline after first load",
              body: "Once the page has loaded, Convert to Shorts works without an internet connection. No other web-based Shorts converter can do this — it's only possible because everything runs locally.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9a6 6 0 1 1 12 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M1 7l2 2 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              ),
            },
          ].map(({ title, body, icon }) => (
            <div
              key={title}
              className="flex gap-4 p-5 rounded-md border border-hairline bg-canvas-elevated"
            >
              <div className="w-9 h-9 rounded-sm bg-accent/10 text-accent flex items-center justify-center shrink-0">
                {icon}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[14px] font-semibold text-ink">{title}</h3>
                <p className="text-[13px] text-body leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-[22px] font-bold text-ink tracking-tight mb-6">
          Frequently asked questions
        </h2>
        <div className="flex flex-col gap-px border border-hairline rounded-md overflow-hidden">
          {[
            {
              q: "How to create YouTube Shorts?",
              a: "YouTube Shorts are vertical videos in a 9:16 aspect ratio (1080×1920 pixels) under 60 seconds long. To create one from an existing horizontal video, use Convert to Shorts — upload your video, trim it to the right length, drag the crop window to frame your content, optionally add a text overlay, and download the converted file. Then upload it directly to YouTube and it will automatically be recognized as a Short.",
            },
            {
              q: "How to create YouTube Shorts from existing video?",
              a: "Upload your existing video to Convert to Shorts, use the trim bar to select the clip you want, drag the 9:16 crop window to frame your content, choose your style (center crop or blur letterbox), add text if needed, and click Export Short. Your video will be converted to 1080×1920 format and downloaded as an MP4 ready for YouTube Shorts upload. The whole process happens in your browser — no account needed.",
            },
            {
              q: "How to create YouTube Shorts from existing videos for free?",
              a: "Convert to Shorts is completely free with no watermarks, no export limits, and no account required. Every feature — including trimming, text overlays, and blur letterbox — is free for everyone. Just visit converttoshorts.com, drop your video, and download your Short.",
            },
            {
              q: "How do I trim a video for YouTube Shorts?",
              a: "After uploading your video, you will see a trim bar below the video preview. Drag the left handle to set the start point and the right handle to set the end point of your clip. The selected duration is shown in real time. Only the trimmed portion will be exported. You can use source videos up to 10 minutes long.",
            },
            {
              q: "Can I add text to my YouTube Short?",
              a: "Yes. In the export panel, toggle on the Text overlay option. Type your text, choose the position (top, center, or bottom of the video), pick a color (white, black, or yellow), and select a font size (small, medium, or large). The text is burned directly into the exported video by ffmpeg so it appears on the final Short without needing any additional editing.",
            },
            {
              q: "What is the difference between center crop and blur letterbox?",
              a: "Center crop trims the left and right sides of your horizontal video to fit a 9:16 frame, keeping only the portion inside the draggable crop window. Blur letterbox keeps your full video visible in the center, with a blurred and darkened version of the same video filling the top and bottom. Blur letterbox is popular when you don't want to lose any of the original frame.",
            },
            {
              q: "Is my video uploaded to any server?",
              a: "No. Your video never leaves your device. Convert to Shorts processes everything locally in your browser using WebAssembly (ffmpeg.wasm). This means complete privacy, no upload wait times, and no file size restrictions imposed by server limits.",
            },
            {
              q: "What video formats does Convert to Shorts support?",
              a: "Convert to Shorts supports MP4 and MOV video files up to 10 minutes long and up to 1080p resolution. The output is always an MP4 file in H.264 format at 1080×1920 resolution, which is directly compatible with YouTube Shorts upload requirements.",
            },
            {
              q: "What is the best aspect ratio for YouTube Shorts?",
              a: "YouTube Shorts require a 9:16 vertical aspect ratio. The optimal resolution is 1080×1920 pixels. Convert to Shorts automatically outputs your video at exactly 1080×1920, which is the recommended resolution for the best quality on YouTube Shorts.",
            },
            {
              q: "Does the converted video have a watermark?",
              a: "No. Convert to Shorts never adds a watermark to your video. The exported MP4 is clean, high quality, and ready to upload directly to YouTube Shorts.",
            },
            {
              q: "Do I need to create an account to use Convert to Shorts?",
              a: "No account, no registration, no email required. Just open converttoshorts.com and start converting. We don't collect any personal information.",
            },
            {
              q: "How long can my source video be?",
              a: "Convert to Shorts accepts source videos up to 10 minutes long and up to 1080p resolution. Use the trim bar to select the clip you want to export as a Short. YouTube Shorts themselves support videos up to 3 minutes, but the most effective Shorts are typically under 60 seconds.",
            },
            {
              q: "Can Convert to Shorts automatically add captions to my YouTube Short?",
              a: "Yes. Enable Auto Captions in the export panel and click Generate Captions. The tool uses Whisper AI running locally in your browser to transcribe your video's speech and generate timed captions. No audio is sent to any server. The captions are automatically timed and burned into the exported Short — no extra editing needed.",
            },
            {
              q: "Is the auto caption feature free?",
              a: "Yes, completely free. Whisper AI runs locally in your browser via WebAssembly so there are no API calls or per-transcription costs. The Whisper model (~75MB) downloads once on first use and is cached by your browser — subsequent uses are instant with no download needed.",
            },
          ].map(({ q, a }, i) => (
            <FaqItem key={i} question={q} answer={a} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="flex flex-col items-center gap-4 text-center py-8 border-t border-hairline">
        <h2 className="text-[22px] font-bold text-ink tracking-tight">
          Ready to convert your video to a Short?
        </h2>
        <p className="text-[14px] text-body max-w-[480px] leading-relaxed">
          Auto captions, trim, crop, add text, and export — free, instant, and completely private.
          No upload, no account, no watermark.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="px-6 py-2.5 rounded-pill bg-accent text-accent-ink font-semibold text-sm border-none cursor-pointer hover:opacity-90 transition-opacity"
        >
          Convert a video now
        </button>
      </section>

    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-canvas-elevated border-b border-hairline last:border-b-0">
      <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none">
        <span className="text-[14px] font-semibold text-ink">{question}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="shrink-0 text-mute transition-transform duration-200 group-open:rotate-180"
        >
          <path
            d="M3 6l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <p className="px-5 pb-4 text-[13px] text-body leading-relaxed">
        {answer}
      </p>
    </details>
  );
}