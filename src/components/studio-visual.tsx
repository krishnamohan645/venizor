"use client";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useRef, type PointerEvent } from "react";
import { SectionIllustration } from "./section-illustration";

export type SceneKind =
  "architecture" | "payments" | "retrieval" | "operations" | "commerce";
const labels: Record<SceneKind, string> = {
  architecture: "FORM & FIELD / SPACES WITH INTENTION",
  payments: "EVERYDAY / FINANCE IN FOCUS",
  operations: "ORBIT / A CONNECTED PERSPECTIVE",
  retrieval: "FLOWSTATE / CONTEXT TO CLARITY",
  commerce: "COLLECTION / A CONSIDERED JOURNEY",
};
export function StudioVisual({
  kind = "payments",
  paused = false,
  className = "",
}: {
  kind?: SceneKind;
  paused?: boolean;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const visible = useInView(root, { margin: "80px" });
  const reduced = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateY = useSpring(x, { stiffness: 110, damping: 26 }),
    rotateX = useSpring(y, { stiffness: 110, damping: 26 });
  function move(event: PointerEvent<HTMLDivElement>) {
    if (reduced || paused || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 5);
    y.set(-((event.clientY - bounds.top) / bounds.height - 0.5) * 4);
  }
  return (
    <div
      ref={root}
      className={`studio-visual scene-${kind} original-scene ${className}`}
      aria-hidden="true"
      data-scene-playing={visible && !paused && !reduced}
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <span className="scene-coordinate">{labels[kind]}</span>
      <motion.div className="scene-artwork" style={{ rotateX, rotateY }}>
        <SectionIllustration kind={kind} />
      </motion.div>
      <span className="scene-disclaimer">ORIGINAL CONCEPT / VENIZOR</span>
    </div>
  );
}
