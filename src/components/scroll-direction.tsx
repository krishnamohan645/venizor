"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Owns page-level choreography; individual interactive components own their state. */
export function ScrollDirection() {
  const progress = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        progress.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            id: "page-progress",
            start: 0,
            end: "max",
            scrub: true,
          },
        },
      );

      gsap.to(".scroll-word-ink", {
        opacity: 1,
        stagger: 0.16,
        ease: "none",
        scrollTrigger: {
          id: "studio-manifesto",
          trigger: ".studio-about",
          start: "top 75%",
          end: "bottom 42%",
          scrub: 0.6,
        },
      });

      gsap.utils
        .toArray<HTMLElement>(
          ".section-head, .product-section-heading, .industry-section-heading",
        )
        .forEach((heading) => {
          gsap.from(
            heading.querySelectorAll("h2, .section-kicker, .section-count, p"),
            {
              y: 60,
              opacity: 0,
              duration: 0.9,
              stagger: 0.07,
              ease: "power3.out",
              scrollTrigger: { trigger: heading, start: "top 88%", once: true },
            },
          );
        });

      gsap.utils.toArray<HTMLElement>(".service-row").forEach((row, index) => {
        gsap.from(row.querySelector(".service-row-heading"), {
          x: index % 2 ? 55 : -55,
          opacity: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top 95%",
            end: "top 64%",
            scrub: 0.5,
          },
        });
      });

      gsap.from(".product-ribbons > i", {
        y: 180,
        x: 70,
        opacity: 0.25,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          id: "product-assembly",
          trigger: ".product-bento",
          start: "top 90%",
          end: "bottom 65%",
          scrub: 0.8,
        },
      });
      gsap.from(".bento-side > div", {
        y: 100,
        rotation: 3,
        stagger: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: ".product-bento",
          start: "top 90%",
          end: "bottom 72%",
          scrub: 0.7,
        },
      });

      gsap.utils.toArray<HTMLElement>(".timeline-step").forEach((card) => {
        gsap.from(
          card.querySelectorAll(".timeline-step-top, h3, p, .timeline-outcome"),
          {
            y: 38,
            opacity: 0,
            duration: 0.65,
            stagger: 0.075,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
          },
        );
      });

      gsap.from(".perspective-card", {
        y: 65,
        rotation: 2,
        opacity: 0,
        stagger: 0.12,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".perspective-grid",
          start: "top 85%",
          once: true,
        },
      });
      gsap.from(".footer-invitation > *", {
        y: 70,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".studio-footer",
          start: "top 78%",
          once: true,
        },
      });
      gsap.from(".footer-wordmark", {
        yPercent: 65,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          id: "footer-unfold",
          trigger: ".studio-footer",
          start: "top 65%",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });
    });

    media.add(
      "(min-width: 961px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.utils
          .toArray<HTMLElement>(".timeline-step")
          .forEach((card, index, cards) => {
            if (!index) return;
            gsap.to(cards[index - 1], {
              scale: 0.94,
              opacity: 0.45,
              transformOrigin: "50% 0%",
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 70%",
                end: "top 170px",
                scrub: 0.6,
              },
            });
          });
      },
    );

    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    const frame = requestAnimationFrame(refresh);
    return () => {
      cancelAnimationFrame(frame);
      media.revert();
    };
  }, []);

  return (
    <div ref={progress} className="page-scroll-progress" aria-hidden="true" />
  );
}

export function ScrollWords({ lines, id }: { lines: string[]; id?: string }) {
  return (
    <h2 id={id} className="scroll-words">
      {lines.map((line, index) => (
        <span className="scroll-word-line" key={line}>
          {line.split(" ").map((word, wordIndex) => (
            <span className="scroll-word" key={`${word}-${wordIndex}`}>
              {word}
              <span className="scroll-word-ink" aria-hidden="true">
                {word}
              </span>{" "}
            </span>
          ))}
          {index < lines.length - 1 && <br />}
        </span>
      ))}
    </h2>
  );
}
