import { Link } from "react-router-dom";
import ThemeToggle from "../ui/theme-toggle";
import Footer from "./Footer";

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function PageLayout({ title, description, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">

      {/* Navbar */}
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
            Convert to Shorts
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Page header */}
      <div className="border-b border-hairline bg-canvas-elevated">
        <div className="max-w-215 mx-auto px-6 py-10">
          <h1 className="text-[28px] font-bold text-ink tracking-tight leading-tight mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-[15px] text-body leading-relaxed max-w-140">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-215 mx-auto px-6 py-12">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}