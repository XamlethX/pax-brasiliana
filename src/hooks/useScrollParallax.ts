import { useEffect, useRef } from "react";

interface UseScrollParallaxOptions {
  maxTranslate?: number;
  minWidth?: number;
}

export function useScrollParallax<
  S extends HTMLElement = HTMLElement,
  T extends HTMLElement = HTMLElement,
>({ maxTranslate = 180, minWidth = 1024 }: UseScrollParallaxOptions = {}) {
  const sectionRef = useRef<S>(null);
  const textRef = useRef<T>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    let raf: number | null = null;

    function update() {
      raf = null;

      if (window.innerWidth < minWidth) {
        text!.style.transform = "";
        return;
      }

      const rect = section!.getBoundingClientRect();
      let progress = (window.innerHeight - rect.top) / window.innerHeight;
      progress = Math.max(0, Math.min(1, progress));

      text!.style.transform = `translate3d(0,${-progress * maxTranslate}px,0)`;
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [maxTranslate, minWidth]);

  return { sectionRef, textRef };
}
