import PageLayout from "../../components/landing/page-layout";
import { Link } from "react-router-dom";
import { useCanonical } from "../hooks/use-canonical";

export default function About() {
  useCanonical("/about");
  return (
    <PageLayout
      title="About Convert to Shorts"
      description="A free, private, browser-based tool for converting horizontal videos to YouTube Shorts format."
    >
      <div className="flex flex-col gap-10 prose-custom">

        <Section title="What is Convert to Shorts?">
          <p>
            Convert to Shorts is a free browser-based tool that converts horizontal
            videos into the 9:16 vertical format required by YouTube Shorts. It was
            built for creators who want a fast, private, and no-fuss way to reframe
            their existing video content for Shorts without uploading files to a
            third-party server.
          </p>
        </Section>

        <Section title="How it works">
          <p>
            Convert to Shorts runs entirely in your browser using{" "}
            <strong>ffmpeg.wasm</strong> — a WebAssembly port of the industry-standard
            FFmpeg video processing library. When you drop a video into the tool,
            it is processed locally on your device. No data is sent to any server,
            no account is required, and nothing is stored anywhere.
          </p>
          <p>
            The tool gives you two reframing options: a simple center crop that
            keeps the middle portion of your frame, and a blur letterbox style that
            keeps the full original frame visible with a blurred background filling
            the top and bottom — a popular look on short-form video platforms.
          </p>
        </Section>

        <Section title="Why we built it">
          <p>
            Most YouTube Shorts converters require you to upload your video to their
            servers, create an account, and accept file size limits — all before you
            can export without a watermark. We think that's unnecessary for a simple
            crop and resize operation.
          </p>
          <p>
            Convert to Shorts does the same job entirely in your browser, which means
            faster processing, no privacy concerns, no upload wait times, and no
            costs — ever.
          </p>
        </Section>

        <Section title="Privacy commitment">
          <p>
            Your video never leaves your device. We do not collect, store, or
            process any video files. We do not use analytics that track individual
            users. The only data we collect is standard web server access logs
            (IP address, browser type, page visited) which are retained for 30 days
            for security purposes.
          </p>
          <p>
            Read our full{" "}
            <Link to="/privacy-policy" className="text-accent no-underline hover:underline">
              Privacy Policy
            </Link>{" "}
            for more details.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Have a question, suggestion, or found a bug?{" "}
            <Link to="/contact" className="text-accent no-underline hover:underline">
              Get in touch
            </Link>{" "}
            — we read every message.
          </p>
        </Section>

      </div>
    </PageLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[18px] font-bold text-ink tracking-tight">{title}</h2>
      <div className="flex flex-col gap-3 text-[14px] text-body leading-relaxed">
        {children}
      </div>
    </section>
  );
}