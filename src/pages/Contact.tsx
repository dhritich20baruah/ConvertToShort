import { useState } from "react";
import PageLayout from "../../components/landing/page-layout";

type FormState = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("sending");

    try {
      // Replace with your form endpoint (Formspree, Web3Forms, etc.)
      const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setFormState("sent");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  }

  return (
    <PageLayout
      title="Contact Us"
      description="Have a question, suggestion, or found a bug? We'd love to hear from you."
    >
      <div className="max-w-140 flex flex-col gap-8">

        {/* Contact form */}
        <div className="flex flex-col gap-5 p-6 rounded-md border border-hairline bg-canvas-elevated">
          {formState === "sent" ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path
                    d="M4 11.5L9 16.5L18 7"
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-[16px] font-semibold text-ink">Message sent</h3>
              <p className="text-[13px] text-body">
                Thanks for reaching out — we'll get back to you as soon as possible.
              </p>
              <button
                onClick={() => setFormState("idle")}
                className="text-[13px] text-accent bg-transparent border-none cursor-pointer hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-mute uppercase tracking-widest">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2.5 rounded-sm border border-hairline bg-canvas text-ink text-[14px] placeholder:text-faint focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-mute uppercase tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 rounded-sm border border-hairline bg-canvas text-ink text-[14px] placeholder:text-faint focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-mute uppercase tracking-widest">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full px-3 py-2.5 rounded-sm border border-hairline bg-canvas text-ink text-[14px] placeholder:text-faint focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>

              {formState === "error" && (
                <p className="text-[13px] text-error">
                  Something went wrong — please try again or email us directly.
                </p>
              )}

              <button
                type="submit"
                disabled={formState === "sending"}
                className="w-full py-2.5 rounded-pill bg-accent text-accent-ink text-[14px] font-semibold border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {formState === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>

        {/* Alternative contact */}
        <div className="flex flex-col gap-2">
          <p className="text-[13px] text-mute">
            Prefer email? Reach us at{" "}
            <a
              href="mailto:hello@converttoshorts.com"
              className="text-accent no-underline hover:underline"
            >
              hello@converttoshorts.com
            </a>
          </p>
          <p className="text-[13px] text-mute">
            We typically respond within 1–2 business days.
          </p>
        </div>

      </div>
    </PageLayout>
  );
}