"use client";

import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.1 }
    );

    const observe = () => {
      document.querySelectorAll(".fade-in-up:not(.visible)").forEach((el) => observer.observe(el));
    };

    observe();

    // Re-observe whenever new .fade-in-up elements appear (e.g. after filter/sort)
    const mutation = new MutationObserver(() => observe());
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);
}
