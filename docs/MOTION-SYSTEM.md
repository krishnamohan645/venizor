# Shared motion system

The site uses Lenis 1.3.27 for desktop wheel interpolation, GSAP/ScrollTrigger for scroll choreography and Motion for component state transitions. Lenis and ScrollTrigger share GSAP's ticker, with one root instance and cleanup on preference changes. Root scrolling keeps the native document structure, so sticky panels and browser scrollbars remain in place.

- Smooth scrolling runs only for a fine pointer with hover and no reduced-motion preference. Touch stays native. Switching reduced motion on removes the interpolator live.
- Wheel interpolation uses a 0.12 lerp. Anchors and project controls use a shared scroll owner. Pointer-driven scrolling can interrupt programmatic movement. Keyboard page navigation and browser history cancel pending wheel momentum.
- Dialog body locks stop the interpolator; scroll inside dialogs, code samples and native text controls remains native. The ticker callback is detached while the document is hidden.
- Reveals use one transform/opacity animation with a 480ms duration, a 16px travel and a maximum 180ms stagger delay. Their animation is cancelled on unmount or reduced-motion changes. Server-rendered content stays visible without JavaScript.
- The homepage intro and section entrances have shorter travel and timing. Hero pointer movement reuses GSAP quick setters. Showcase text and illustrations crossfade together instead of waiting for separate exit/entry sequences.
- Reading progress uses a frame-coalesced transform update rather than React state and changing width on every scroll. Shared buttons and dialogs use short explicit transitions. Legacy `transition: all` declarations have been replaced with named properties.

Verify actual wheel samples, direction changes, keyboard scrolling, anchors, modal locks, nested scroll, browser history, project controls, reduced-motion switching, touch fallback and route navigation. Browser frame samples demonstrate that interpolation runs; they do not certify a frame rate on real devices.

Sources: [Lenis documentation](https://github.com/darkroomengineering/lenis), [GSAP ticker](https://gsap.com/docs/v3/GSAP/gsap.ticker/), and the documentation shipped with the installed Next.js package.
