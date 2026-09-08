import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n/index";
import App from "./App";

// Apply saved theme before first paint to avoid flash
(function () {
  try {
    const stored = localStorage.getItem("theme");
    const theme =
      stored ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    if (theme === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);