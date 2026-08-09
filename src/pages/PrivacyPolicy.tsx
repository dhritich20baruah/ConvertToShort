import PageLayout from "../../components/landing/page-layout";
import { useCanonical } from "../hooks/use-canonical";

export default function PrivacyPolicy() {
useCanonical("/privacy-policy");
  return (
    <PageLayout
      title="Privacy Policy"
      description="Last updated: January 2025"
    >
      <div className="flex flex-col gap-10">

        <Section title="Overview">
          <p>
            Convert to Shorts ("we", "us", "our") is committed to protecting your
            privacy. This Privacy Policy explains what information we collect, how
            we use it, and what rights you have in relation to it.
          </p>
          <p>
            The short version: <strong>we never see your videos</strong>. All video
            processing happens locally in your browser. Your video files are never
            uploaded to our servers or any third-party server.
          </p>
        </Section>

        <Section title="Information we do not collect">
          <ul>
            <li>Your video files — these never leave your device</li>
            <li>Your name, email address, or any personal identifiers</li>
            <li>Account information — no accounts exist on this platform</li>
            <li>Payment information — the tool is free</li>
            <li>Cookies used for tracking or advertising</li>
          </ul>
        </Section>

        <Section title="Information we may collect">
          <p>
            When you visit converttoshorts.com, our web server automatically records
            standard access log information including:
          </p>
          <ul>
            <li>Your IP address</li>
            <li>Browser type and version</li>
            <li>Pages visited and time of visit</li>
            <li>Referring URL</li>
          </ul>
          <p>
            This information is used solely for security monitoring and
            diagnosing technical issues. It is retained for 30 days and then
            deleted. It is never sold or shared with third parties.
          </p>
        </Section>

        <Section title="How your video is processed">
          <p>
            When you drop a video into Convert to Shorts, the file is processed
            entirely within your browser using WebAssembly (ffmpeg.wasm). The
            processing happens on your device's CPU. The video data never passes
            through our servers at any point.
          </p>
          <p>
            The converted output file is generated in your browser's memory and
            downloaded directly to your device. We never have access to the input
            or output video.
          </p>
        </Section>

        <Section title="Third-party services">
          <p>
            Convert to Shorts uses the following third-party services:
          </p>
          <ul>
            <li>
              <strong>Google Fonts</strong> — to serve the Geist typeface. Google
              may log your IP address when fonts are requested. See{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent no-underline hover:underline"
              >
                Google's Privacy Policy
              </a>
              .
            </li>
          </ul>
        </Section>

        <Section title="Your rights">
          <p>
            Since we do not collect personal data beyond standard server logs,
            there is no personal profile to access, correct, or delete. If you
            have concerns about the server log data associated with your IP
            address, please contact us and we will assist you.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated date at the top. Continued use of
            the service after changes constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            If you have questions about this Privacy Policy, please use our{" "}
            <a href="/contact" className="text-accent no-underline hover:underline">
              contact form
            </a>
            .
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
      <div className="flex flex-col gap-3 text-[14px] text-body leading-relaxed [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:text-body">
        {children}
      </div>
    </section>
  );
}