export default function SeoContent() {
  return (
    <div className="w-full max-w-215 mx-auto px-6 py-16 flex flex-col gap-16">

      {/* How it works */}
      <section>
        <h2 className="text-[22px] font-bold text-ink tracking-tight mb-6">
          How to convert video to YouTube Shorts
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Drop your video",
              body: "Upload any MP4 or MOV file up to 90 seconds. Your video is never sent to a server — everything stays on your device.",
            },
            {
              step: "2",
              title: "Adjust the crop",
              body: "Drag the 9:16 crop window left or right to frame the most important part of your video. Preview it before exporting.",
            },
            {
              step: "3",
              title: "Download your Short",
              body: "Click Export Short and download a clean 1080×1920 MP4 ready to upload directly to YouTube Shorts.",
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

      {/* USPs */}
      <section>
        <h2 className="text-[22px] font-bold text-ink tracking-tight mb-6">
          Why use Convert to Shorts?
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
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
              body: "Convert to Shorts is free with no hidden costs. No watermarks are added to your video, no export limits, no premium tier. Every feature is available to everyone at no cost.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
              title: "Instant — no upload wait time",
              body: "Because your video never leaves your device, there's no upload time. Large files start processing immediately. Most videos convert in under a minute depending on your device.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 3v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              ),
            },
            {
              title: "No file size restrictions",
              body: "Server-based converters limit file sizes on free plans. Since we process everything locally, your only limit is your device's memory — which is typically much more generous.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="3" y="3" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9 6v6M6 9h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
              a: "YouTube Shorts are vertical videos in a 9:16 aspect ratio (1080×1920 pixels) under 60 seconds long. To create one from an existing horizontal video, use Convert to Shorts — upload your video, drag the crop window to frame your content, and download the converted file. Then upload it directly to YouTube and it will automatically be recognized as a Short.",
            },
            {
              q: "How to create YouTube Shorts from existing video?",
              a: "Upload your existing video to Convert to Shorts, drag the 9:16 crop window to select the part of the frame you want to keep, choose your style (center crop or blur letterbox), and click Export Short. Your video will be converted to 1080×1920 format and downloaded as an MP4 ready for YouTube Shorts upload. The whole process happens in your browser — no account needed.",
            },
            {
              q: "How to create YouTube Shorts from existing videos for free?",
              a: "Convert to Shorts is completely free with no watermarks, no export limits, and no account required. Just visit converttoshorts.com, drop your video, adjust the crop, and download. There are no hidden costs and no premium tier — every feature is free for everyone.",
            },
            {
              q: "Is my video uploaded to any server?",
              a: "No. Your video never leaves your device. Convert to Shorts processes everything locally in your browser using WebAssembly (ffmpeg.wasm). This means complete privacy, no upload wait times, and no file size restrictions imposed by server limits.",
            },
            {
              q: "What is the best aspect ratio for YouTube Shorts?",
              a: "YouTube Shorts require a 9:16 vertical aspect ratio. The optimal resolution is 1080×1920 pixels. Convert to Shorts automatically outputs your video at exactly 1080×1920, which is the recommended resolution for the best quality on YouTube Shorts.",
            },
            {
              q: "What video formats does Convert to Shorts support?",
              a: "Convert to Shorts supports MP4 and MOV video files. The output is always an MP4 file in H.264 format at 1080×1920 resolution, which is directly compatible with YouTube Shorts upload requirements.",
            },
            {
              q: "Does the converted video have a watermark?",
              a: "No. Convert to Shorts never adds a watermark to your video. The exported MP4 is clean, high quality, and ready to upload directly to YouTube Shorts.",
            },
            {
              q: "What is the difference between center crop and blur letterbox?",
              a: "Center crop trims the left and right sides of your horizontal video to fit a 9:16 frame, keeping only the middle portion. Blur letterbox keeps your full video visible in the center, with a blurred and darkened version of the same video filling the top and bottom. Blur letterbox is popular on TikTok and Reels when you don't want to lose any of the original frame.",
            },
            {
              q: "Do I need to create an account to use Convert to Shorts?",
              a: "No account, no registration, no email required. Just open converttoshorts.com and start converting. We don't collect any personal information.",
            },
            {
              q: "How long can my video be?",
              a: "Convert to Shorts supports videos up to 90 seconds long and up to 1080p resolution. YouTube Shorts themselves support videos up to 3 minutes, but the most effective Shorts are typically under 60 seconds.",
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
        <p className="text-[14px] text-body max-w-120 leading-relaxed">
          Free, instant, and completely private. No upload, no account, no watermark.
          Just drop your video and download your Short.
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

// ── FAQ accordion item ─────────────────────────────────────────────────────────

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