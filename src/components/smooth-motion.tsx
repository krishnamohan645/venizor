"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { connectSmoothScroll } from "@/lib/smooth-scroll";
import { reportClientError } from "@/lib/report-client-error";

gsap.registerPlugin(ScrollTrigger);

/** One root scroller, one clock. Touch and reduced motion use native scrolling. */
export function SmoothMotion() {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const lenis = new Lenis({
          lerp: 0.12,
          smoothWheel: true,
          syncTouch: false,
          autoRaf: false,
          anchors: { duration: 0.75, lerp: 0 },
          stopInertiaOnNavigate: true,
          // Horizontal article snippets keep vertical wheel input on the page.
          prevent: (node) =>
            node.matches(
              "dialog, textarea, select, [data-native-scroll], .code-pre-box, .studio-nav",
            ),
        });
        const disconnect = connectSmoothScroll(lenis);
        let disposed = false;
        const tick = (time: number) => {
          if (disposed) return;
          try {
            lenis.raf(time * 1000);
          } catch (error) {
            cleanup();
            reportClientError(error, "smooth-scroll-frame");
          }
        };
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.lagSmoothing(0);

        // Existing dialogs lock body overflow. Stop the wheel owner at the same time.
        const updateLock = () => {
          if (["hidden", "clip"].includes(document.body.style.overflow))
            lenis.stop();
          else lenis.start();
        };
        const observer = new MutationObserver(updateLock);
        observer.observe(document.body, {
          attributes: true,
          attributeFilter: ["style"],
        });
        updateLock();
        const cancelMomentum = () => {
          if (lenis.isStopped) return;
          // Cancel interpolation without writing a position over browser restoration.
          lenis.stop();
          lenis.start();
        };
        const keyboard = (event: KeyboardEvent) => {
          if (
            event.defaultPrevented ||
            event.ctrlKey ||
            event.metaKey ||
            event.altKey
          )
            return;
          if (
            (event.target as HTMLElement)?.closest(
              "input, textarea, select, [contenteditable=true], [role=tablist], [role=slider]",
            )
          )
            return;
          if (
            [
              "PageDown",
              "PageUp",
              "Home",
              "End",
              "ArrowDown",
              "ArrowUp",
              " ",
            ].includes(event.key)
          )
            cancelMomentum();
        };
        window.addEventListener("popstate", cancelMomentum);
        window.addEventListener("keydown", keyboard);
        const visibility = () => {
          if (disposed) return;
          gsap.ticker.remove(tick);
          if (!document.hidden) {
            lenis.resize();
            gsap.ticker.add(tick);
          }
        };
        document.addEventListener("visibilitychange", visibility);
        function cleanup() {
          if (disposed) return;
          disposed = true;
          observer.disconnect();
          window.removeEventListener("popstate", cancelMomentum);
          window.removeEventListener("keydown", keyboard);
          document.removeEventListener("visibilitychange", visibility);
          gsap.ticker.remove(tick);
          lenis.off("scroll", ScrollTrigger.update);
          disconnect();
          lenis.destroy();
        }
        gsap.ticker.add(tick);
        return cleanup;
      },
    );
    return () => media.revert();
  }, []);
  return null;
}
