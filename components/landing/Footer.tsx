import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-hairline bg-canvas-elevated">
      <div className="max-w-[900px] mx-auto px-6 py-10 flex flex-col gap-8">

        {/* Top row */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-sm bg-accent flex items-center justify-center shrink-0">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <rect x="4" y="1" width="6" height="12" rx="1.5" stroke="white" strokeWidth="1.5" />
                  <line x1="1" y1="4" x2="3" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="1" y1="7" x2="3" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="1" y1="10" x2="3" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="11" y1="4" x2="13" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="11" y1="7" x2="13" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="11" y1="10" x2="13" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[14px] font-semibold text-ink tracking-tight">
                {t("nav.brand")}
              </span>
            </div>
            <p className="text-[12px] text-mute max-w-[240px] leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold text-mute uppercase tracking-widest">
                {t("footer.product")}
              </p>
              <div className="flex flex-col gap-1.5">
                <Link
                  to="/"
                  className="text-[13px] text-body hover:text-ink transition-colors no-underline"
                >
                  {t("footer.convert")}
                </Link>
                <Link
                  to="/about"
                  className="text-[13px] text-body hover:text-ink transition-colors no-underline"
                >
                  {t("footer.about")}
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold text-mute uppercase tracking-widest">
                {t("footer.legal")}
              </p>
              <div className="flex flex-col gap-1.5">
                <Link
                  to="/privacy-policy"
                  className="text-[13px] text-body hover:text-ink transition-colors no-underline"
                >
                  {t("footer.privacyPolicy")}
                </Link>
                <Link
                  to="/terms"
                  className="text-[13px] text-body hover:text-ink transition-colors no-underline"
                >
                  {t("footer.terms")}
                </Link>
                <Link
                  to="/contact"
                  className="text-[13px] text-body hover:text-ink transition-colors no-underline"
                >
                  {t("footer.contact")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-hairline" />

        {/* Bottom row */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-faint">
            © {new Date().getFullYear()} ConvertToShorts.com — {t("footer.tagline")}
          </p>
          <p className="text-[12px] text-faint flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-accent">
              <path
                d="M7 1L2 3.5V7C2 9.76 4.24 12.35 7 13C9.76 12.35 12 9.76 12 7V3.5L7 1Z"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
            </svg>
            {t("footer.privacy")}
          </p>
        </div>
      </div>
    </footer>
  );
}