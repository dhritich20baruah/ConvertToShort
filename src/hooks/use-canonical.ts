import { useEffect } from "react";

export function useCanonical(path: string) {
  useEffect(() => {
    const base = "https://converttoshorts.com";
    const fullUrl = `${base}${path}`;

    let tag = document.querySelector<HTMLLinkElement>("link[rel='canonical']");

    if (!tag) {
      tag = document.createElement("link");
      tag.setAttribute("rel", "canonical");
      document.head.appendChild(tag);
    }

    tag.setAttribute("href", fullUrl);

    // No cleanup — leave canonical in place when navigating
  }, [path]);
}