"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Pause, Play } from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { LeadForm } from "./lead-form";

export function InteractiveContactForm() {
  const [completed, setCompleted] = useState(0);
  function progress(event: FormEvent<HTMLDivElement>) {
    const form = event.currentTarget.querySelector("form");
    if (!form) return;
    const fields = [
      ...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        "input[required], textarea[required]",
      ),
    ];
    setCompleted(
      fields.filter((field) => field.value.trim() && field.checkValidity())
        .length,
    );
  }
  return (
    <div className="contact-form-panel" onInput={progress}>
      <div className="contact-form-intro">
        <span className="section-kicker">YOUR PROJECT BRIEF</span>
        <span className="contact-form-optional">No sign-up needed</span>
      </div>
      <h2>What are you thinking?</h2>
      <p className="contact-form-sub">
        A few details. A useful starting point.
      </p>
      <div
        className="contact-brief-progress"
        role="progressbar"
        aria-label="Brief details completed"
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={completed}
      >
        <span style={{ width: `${(completed / 3) * 100}%` }} />
      </div>
      <LeadForm />
    </div>
  );
}

export function StudioLiveClock() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date()),
      );
    update();
    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="studio-time">
      <span className="section-kicker">
        BASED IN INDIA. CONNECTED EVERYWHERE.
      </span>
      <div>
        <span>Local studio time</span>
        <time suppressHydrationWarning>
          {time}
          <span>IST</span>
        </time>
      </div>
    </div>
  );
}

export function ContactStudioMark() {
  const root = useRef<HTMLDivElement>(null);
  const visible = useInView(root);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  return (
    <div
      ref={root}
      className="contact-studio-mark"
      data-mark-playing={visible && !paused && !reduced}
    >
      <div className="contact-mark-art" aria-hidden="true">
        <div className="contact-mark-orbit" />
        <div className="contact-mark-orbit second" />
        <div className="contact-mark-envelope">
          <div className="contact-mark-sheet">
            <i />
            <i />
            <i />
            <span>
              Let’s make
              <br />
              something matter.
            </span>
          </div>
          <div className="contact-mark-fold" />
        </div>
        <span className="contact-mark-dot" />
        <span className="contact-mark-caption">
          IDEAS TRAVEL. GOOD WORK CONNECTS.
        </span>
      </div>
      <button
        type="button"
        className="motion-control"
        onClick={() => setPaused(!paused)}
        aria-pressed={paused}
        aria-label={
          paused ? "Play contact illustration" : "Pause contact illustration"
        }
      >
        {paused ? <Play size={13} /> : <Pause size={13} />}
        <span>{paused ? "Play motion" : "Pause motion"}</span>
      </button>
    </div>
  );
}
