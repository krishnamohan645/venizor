"use client";
import {
ArrowDownLeft,
ArrowUpRight,
Check,
CircleCheck,
FileText,
Layers2,
Search,
ShieldCheck,
Sparkles,
} from "lucide-react";
import {
motion,
useInView,
useMotionValue,
useReducedMotion,
useSpring,
} from "motion/react";
import { useRef,type PointerEvent } from "react";

export type SceneKind = "payments" | "retrieval" | "operations" | "commerce";
const sceneContent = {
  payments: {
    label: "Payment workspace",
    title: "Every detail, connected.",
    note: "A clear path from payment to order.",
    items: ["Payment received", "Order matched", "Ready for review"],
    tag: "Reconciled",
    icon: CircleCheck,
  },
  retrieval: {
    label: "Knowledge workspace",
    title: "Find the useful answer.",
    note: "Source context stays one click away.",
    items: [
      "Search your documents",
      "Review source passages",
      "Check the answer",
    ],
    tag: "Source included",
    icon: Sparkles,
  },
  operations: {
    label: "Operations workspace",
    title: "See what happens next.",
    note: "A shared picture of work in progress.",
    items: ["Assignment received", "Progress updated", "Team notified"],
    tag: "Work in view",
    icon: Layers2,
  },
  commerce: {
    label: "Commerce workspace",
    title: "A thoughtful buying journey.",
    note: "From the first look to the final step.",
    items: [
      "Discover a collection",
      "Review your selection",
      "Continue to checkout",
    ],
    tag: "Order journey",
    icon: ArrowUpRight,
  },
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
  const pointerX = useMotionValue(0),
    pointerY = useMotionValue(0);
  const rotateY = useSpring(pointerX, { stiffness: 110, damping: 26 });
  const rotateX = useSpring(pointerY, { stiffness: 110, damping: 26 });
  const content = sceneContent[kind];
  function move(event: PointerEvent<HTMLDivElement>) {
    if (reduced || paused || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 7);
    pointerY.set(-((event.clientY - bounds.top) / bounds.height - 0.5) * 5);
  }
  return (
    <div
      ref={root}
      className={`studio-visual scene-${kind} ${className}`}
      aria-hidden="true"
      data-scene-playing={visible && !paused && !reduced}
      onPointerMove={move}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <div className="scene-guide scene-guide-one" />
      <div className="scene-guide scene-guide-two" />
      <span className="scene-coordinate">V / {kind.toUpperCase()}</span>
      <motion.div className="scene-perspective" style={{ rotateX, rotateY }}>
        <div className="scene-app-window">
          <div className="scene-window-bar">
            <span className="scene-window-brand">
              <i />
              VENIZOR
            </span>
            <span>CONCEPT WORKSPACE</span>
            <span className="scene-window-menu">•••</span>
          </div>
          <div className="scene-workspace">
            <div className="scene-sidebar">
              <Layers2 size={17} />
              <Search size={17} />
              <FileText size={17} />
              <ShieldCheck size={17} />
              <span />
            </div>
            <div className="scene-app-content">
              <div className="scene-app-topline">
                <span>{content.label}</span>
                <ArrowUpRight size={15} />
              </div>
              <h3>{content.title}</h3>
              <div className="scene-graph">
                <svg viewBox="0 0 400 125" fill="none">
                  <path
                    className="scene-graph-grid"
                    d="M0 25H400M0 65H400M0 105H400M70 0V125M160 0V125M250 0V125M340 0V125"
                  />
                  <path
                    className="scene-graph-area"
                    d="M0 111C50 105 50 60 100 72S160 100 200 49S270 70 310 30S370 35 400 12V125H0Z"
                  />
                  <path
                    className="scene-graph-line art-route"
                    d="M0 111C50 105 50 60 100 72S160 100 200 49S270 70 310 30S370 35 400 12"
                  />
                </svg>
                <span>Illustrative activity</span>
              </div>
              <div className="scene-task-list">
                {content.items.map((item, i) => (
                  <div key={item}>
                    <span className="scene-task-icon">
                      {i === 2 ? (
                        <ArrowUpRight size={13} />
                      ) : (
                        <Check size={13} />
                      )}
                    </span>
                    <span>{item}</span>
                    <i />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="scene-floating-note">
          <span className="scene-note-icon">
            <content.icon size={19} />
          </span>
          <div>
            <strong>{content.tag}</strong>
            <span>{content.note}</span>
          </div>
        </div>
        <div className="scene-floating-token">
          <ArrowDownLeft size={16} />
          <span>Clarity, by design.</span>
        </div>
      </motion.div>
      <span className="scene-disclaimer">ILLUSTRATIVE PRODUCT INTERFACE</span>
    </div>
  );
}
