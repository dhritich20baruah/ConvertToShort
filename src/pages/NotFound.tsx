import { Link } from "react-router-dom";
import ThemeToggle from "../../components/ui/theme-toggle";
import Footer from "../../components/landing/Footer";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/ui/language-switcher";

export default function NotFound() {
  const { t } = useTranslation();

  useEffect(() => {
    const tag = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (tag) tag.setAttribute("href", "https://converttoshorts.com/");
    let meta = document.querySelector<HTMLMetaElement>("meta[name='robots']");
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");
    return () => {
      const robotsMeta = document.querySelector<HTMLMetaElement>("meta[name='robots']");
      if (robotsMeta) robotsMeta.setAttribute("content", "index, follow");
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <header className="h-14 sticky top-0 z-50 flex items-center justify-between px-6 bg-canvas-elevated border-b border-hairline">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-7 h-7 rounded-sm bg-accent flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="4" y="1" width="6" height="12" rx="1.5" stroke="white" strokeWidth="1.5" />
              <line x1="1" y1="4" x2="3" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="1" y1="7" x2="3" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="1" y1="10" x2="3" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="11" y1="4" x2="13" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="11" y1="7" x2="13" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="11" y1="10" x2="13" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-ink tracking-tight">
            {t("nav.brand")}
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-6 text-center">
        <div
          className="text-[120px] font-bold leading-none tracking-tight"
          style={{ color: "var(--color-hairline)" }}
        >
          404
        </div>
        <div className="flex flex-col gap-2 max-w-[400px]">
          <h1 className="text-[22px] font-bold text-ink tracking-tight">
            {t("pages.notFound.title")}
          </h1>
          <p className="text-[14px] text-body leading-relaxed">
            {t("pages.notFound.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-pill bg-accent text-accent-ink font-semibold text-[14px] no-underline hover:opacity-90 transition-opacity"
          >
            {t("pages.notFound.goHome")}
          </Link>
          <Link
            to="/contact"
            className="text-[14px] text-mute no-underline hover:text-ink transition-colors"
          >
            {t("pages.notFound.contactUs")}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}