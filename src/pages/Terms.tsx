import PageLayout from "../../components/landing/page-layout";

export default function Terms() {
  return (
    <PageLayout
      title="Terms of Service"
      description="Last updated: January 2025"
    >
      <div className="flex flex-col gap-10">

        <Section title="Acceptance of terms">
          <p>
            By using Convert to Shorts ("the Service"), you agree to these Terms
            of Service. If you do not agree, please do not use the Service.
          </p>
        </Section>

        <Section title="Description of service">
          <p>
            Convert to Shorts is a free, browser-based tool that converts horizontal
            video files to the 9:16 vertical format used by YouTube Shorts. All
            processing occurs locally in your browser. No video files are uploaded
            to our servers.
          </p>
        </Section>

        <Section title="Acceptable use">
          <p>You agree to use the Service only for lawful purposes. You must not use the Service to process or distribute:</p>
          <ul>
            <li>Content that infringes on any third party's intellectual property rights</li>
            <li>Content that is illegal in your jurisdiction</li>
            <li>Content that contains malware or malicious code</li>
            <li>Content that violates YouTube's Terms of Service or Community Guidelines</li>
          </ul>
          <p>
            You are solely responsible for the content you process using this tool
            and any subsequent use of the output files.
          </p>
        </Section>

        <Section title="Intellectual property">
          <p>
            Convert to Shorts does not claim any ownership over videos you process
            using the Service. You retain all rights to your original content and
            the converted output files.
          </p>
          <p>
            The Convert to Shorts website, interface, and codebase are owned by
            ConvertToShorts.com. You may not copy, reproduce, or redistribute any
            part of the Service without permission.
          </p>
        </Section>

        <Section title="Disclaimer of warranties">
          <p>
            The Service is provided "as is" without warranties of any kind, express
            or implied. We do not guarantee that the Service will be available at
            all times, error-free, or that converted videos will meet your specific
            requirements or be accepted by YouTube.
          </p>
        </Section>

        <Section title="Limitation of liability">
          <p>
            To the fullest extent permitted by law, ConvertToShorts.com shall not
            be liable for any indirect, incidental, special, consequential, or
            punitive damages arising from your use of the Service, including but
            not limited to loss of data, loss of profits, or any other damages.
          </p>
        </Section>

        <Section title="Changes to the service">
          <p>
            We reserve the right to modify, suspend, or discontinue the Service
            at any time without notice. We are not liable to you or any third
            party for any modification, suspension, or discontinuation of the Service.
          </p>
        </Section>

        <Section title="Changes to these terms">
          <p>
            We may update these Terms of Service at any time. Changes will be
            posted on this page with an updated date. Continued use of the Service
            after changes constitutes acceptance of the updated terms.
          </p>
        </Section>

        <Section title="Governing law">
          <p>
            These Terms are governed by and construed in accordance with applicable
            law. Any disputes arising from these Terms or your use of the Service
            shall be resolved through good faith negotiation before any legal
            proceedings are initiated.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these Terms of Service? Please use our{" "}
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