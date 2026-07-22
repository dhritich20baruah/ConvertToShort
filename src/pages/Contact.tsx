import PageLayout from "../../components/landing/page-layout";

const CONTACT = {
  email: "dhriticodes20@gmail.com",
  github: "https://github.com/dhritich20baruah",
  x: "https://x.com/DhritiBaruah20",
};

export default function Contact() {
  return (
    <PageLayout
      title="Contact"
      description="Have a question, suggestion, or found a bug? Reach out through any of the channels below."
    >
      <div className="flex flex-col gap-4 max-w-120">

        {/* Email */}
        <ContactCard
          href={`mailto:${CONTACT.email}`}
          label="Email"
          value={CONTACT.email}
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M2 6.5l7 4.5 7-4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          }
        />

        {/* GitHub */}
        <ContactCard
          href={CONTACT.github}
          label="GitHub"
          value={CONTACT.github.replace("https://", "")}
          external
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9c0 3.315 2.151 6.129 5.136 7.122.375.069.513-.162.513-.36 0-.177-.006-.645-.009-1.266-2.085.453-2.526-.999-2.526-.999-.34-.867-.831-1.098-.831-1.098-.681-.465.051-.456.051-.456.753.054 1.149.774 1.149.774.669 1.146 1.755.815 2.184.624.066-.486.261-.816.474-1.003-1.664-.189-3.414-.832-3.414-3.702 0-.819.291-1.488.768-2.013-.075-.189-.333-.954.075-1.989 0 0 .627-.201 2.052.765A7.14 7.14 0 019 5.889a7.14 7.14 0 011.872.252c1.422-.966 2.049-.765 2.049-.765.408 1.035.15 1.8.075 1.989.48.525.768 1.194.768 2.013 0 2.877-1.752 3.51-3.42 3.696.27.231.51.69.51 1.389 0 1.002-.009 1.812-.009 2.058 0 .201.135.435.516.36C15.352 15.126 16.5 12.315 16.5 9c0-4.14-3.36-7.5-7.5-7.5z"
                fill="currentColor"
              />
            </svg>
          }
        />

        {/* X / Twitter */}
        <ContactCard
          href={CONTACT.x}
          label="X (Twitter)"
          value={CONTACT.x.replace("https://", "")}
          external
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M13.5 2.25h2.25L10.5 8.25 16.5 15.75h-4.5l-3.75-4.875L4.5 15.75H2.25l5.625-6.375L2.25 2.25h4.5l3.375 4.5 3.375-4.5z"
                fill="currentColor"
              />
            </svg>
          }
        />

      </div>
    </PageLayout>
  );
}

function ContactCard({
  href,
  label,
  value,
  icon,
  external = false,
}: {
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center gap-4 p-4 rounded-md border border-hairline bg-canvas-elevated hover:border-accent transition-colors no-underline group"
    >
      <div className="w-10 h-10 rounded-sm bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-accent-ink transition-colors">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[12px] font-medium text-mute uppercase tracking-widest">
          {label}
        </span>
        <span className="text-[14px] font-medium text-ink group-hover:text-accent transition-colors">
          {value}
        </span>
      </div>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="ml-auto text-faint group-hover:text-accent transition-colors shrink-0"
      >
        <path
          d="M2.5 7h9M7.5 3l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}