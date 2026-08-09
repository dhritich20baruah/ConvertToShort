import { useEffect } from "react";

export function useCanonical(path: string) {
  useEffect(() => {
    const base = "https://converttoshorts.com";
    let tag = document.querySelector<HTMLLinkElement>("link[rel='canonical']");

    if (!tag) {
      tag = document.createElement("link");
      tag.setAttribute("rel", "canonical");
      document.head.appendChild(tag);
    }

    tag.setAttribute("href", `${base}${path}`);

    return () => {
      tag?.setAttribute("href", `${base}/`);
    };
  }, [path]);
}