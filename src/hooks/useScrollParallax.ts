import { useEffect, useRef } from "react";

interface UseScrollParallaxOptions {
  /** Text vertical travel (desktop only), in px. */
  maxTranslate?: number;
  /** Below this width the TEXT parallax is disabled (kept subtle on mobile). */
  minWidth?: number;
  /** Media (flag) vertical travel, in px. Active on ALL viewports. */
  mediaTranslate?: number;
  /** Media (flag) tilt, in degrees, driven by scroll. Active on ALL viewports. */
  mediaRotate?: number;
}

/**
 * Scroll-driven parallax for a section.
 *  - `textRef`  → vertical drift, desktop only (layout-safe on mobile).
 *  - `mediaRef` → vertical drift + subtle tilt, on every viewport. Used for the
 *    flag so it visibly reacts to scrolling on phones, not just the idle wave.
 */
export function useScrollParallax<
  S extends HTMLElement = HTMLElement,
  T extends HTMLElement = HTMLElement,
  M extends HTMLElement = HTMLElement,
>({
  maxTranslate = 180,
  minWidth = 1024,
  mediaTranslate = 44,
  mediaRotate = 5,
}: UseScrollParallaxOptions = {}) {
  const sectionRef = useRef<S>(null);
  const textRef = useRef<T>(null);
  const mediaRef = useRef<M>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const text = textRef.current;
    const media = mediaRef.current;
    let raf: number | null = null;

    function update() {
      raf = null;
      const rect = section!.getBoundingClientRect();
      let progress = (window.innerHeight - rect.top) / window.innerHeight;
      progress = Math.max(0, Math.min(1, progress));

      // Flag / media — reacts to scroll on every viewport.
      if (media) {
        const shift = (progress - 0.5) * 2; // -1 .. 1 across the section
        media.style.transform = `translate3d(0, ${shift * mediaTranslate}px, 0) rotate(${shift * mediaRotate}deg)`;
      }

      // Text — desktop-only drift (avoids overlap on tight mobile layouts).
      if (text) {
        if (window.innerWidth < minWidth) text.style.transform = "";
        else text.style.transform = `translate3d(0, ${-progress * maxTranslate}px, 0)`;
      }
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
  }, [maxTranslate, minWidth, mediaTranslate, mediaRotate]);

  return { sectionRef, textRef, mediaRef };
}
