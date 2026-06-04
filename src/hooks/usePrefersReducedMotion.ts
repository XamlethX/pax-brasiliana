import { useEffect, useState } from "react";

/**
 * Returns true when the user has requested reduced motion.
 * Used to disable JS-driven animations (WebGL, parallax) that CSS
 * `prefers-reduced-motion` rules can't reach.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
