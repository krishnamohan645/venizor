"use client";
import { useState } from "react";
const notes = [
  {
    title: "Discover",
    text: "Start with the work people need to do. Understand the friction, agree the outcome and decide what a useful first release looks like.",
  },
  {
    title: "Build",
    text: "Make decisions visible. Share working increments, review the details together and test the journeys that matter.",
  },
  {
    title: "Learn",
    text: "Release with a clear handover. Observe real use, listen to the people using the product and improve from evidence.",
  },
];
export function TerminalTyping() {
  const [active, setActive] = useState(0);
  return (
    <div className="studio-note">
      <div className="studio-note-top">
        <span className="section-kicker">FROM THE STUDIO NOTEBOOK</span>
        <div className="studio-note-tabs" aria-label="Our working approach">
          {notes.map((item, i) => (
            <button
              type="button"
              key={item.title}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
      <p aria-live="polite">{notes[active].text}</p>
    </div>
  );
}
