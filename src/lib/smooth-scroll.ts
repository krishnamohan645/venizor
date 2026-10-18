import type Lenis from "lenis";

let activeScroller: Lenis | null = null;

/** Share one scroll owner with project controls and in-page navigation. */
export function connectSmoothScroll(scroller: Lenis) {
  activeScroller = scroller;
  return () => {
    if (activeScroller === scroller) activeScroller = null;
  };
}

export function scrollPageTo(
  target: number | HTMLElement,
  options: { immediate?: boolean; duration?: number } = {},
) {
  const immediate =
    options.immediate || matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (activeScroller) {
    activeScroller.scrollTo(target, {
      immediate,
      duration: options.duration ?? 0.75,
      lerp: 0,
    });
    return;
  }
  if (typeof target === "number")
    window.scrollTo({
      top: target,
      behavior: immediate ? "instant" : "smooth",
    });
  else
    target.scrollIntoView({
      block: "start",
      behavior: immediate ? "instant" : "smooth",
    });
}
