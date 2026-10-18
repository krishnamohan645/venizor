# VENIZOR — Vision meets execution

## Design direction

The Webflow references take priority. Their editorial scale, confident typography, broad sections, and focused project presentations guide the redesign. VENIZOR's existing blue identity ties the page together. All visuals in the website are supplied branding or native HTML, CSS, SVG, and canvas; generated image assets have been removed.

The primary action is starting a project conversation. The page moves through the studio introduction, eight connected capabilities, a project concept slider, products in development, a four-step process, industries, perspectives, and contact.

## Visual system

- Off-white `#fcfcfa`, charcoal `#151719`, electric blue `#164df4`, muted grey, and pale blue section backgrounds.
- Existing Geist typography with large, tightly spaced editorial headings.
- Full-width geometric hero, aligned section labels, an expanding service list, a vertical project selector, and a generous footer wordmark.
- CSS geometry and browser-rendered interface concepts; no external template assets or code are imported.

## References

Primary Webflow references:

- [Deluix](https://webflow.com/templates/html/deluix-website-template) — large visual fields, numbered navigation, and studio presentation. Live preview inspected.
- [Nexbit Studio](https://webflow.com/templates/html/nexbit-studio-website-template) — oversized typography and direct project navigation. Live preview inspected.
- [Monoform](https://webflow.com/templates/html/monoform-website-template) — portfolio hierarchy, service previews, and motion patterns. Live page content inspected; its preloader obscured the initial screenshot.
- [Nocturns](https://webflow.com/templates/html/nocturns-website-template) — dramatic hierarchy and section rhythm. Live page content inspected; its preloader obscured the initial screenshot.
- [MonoFold](https://webflow.com/templates/html/monofold-website-template) and [Altreex](https://webflow.com/templates/html/altreex-website-template) — marketplace references reviewed.

Framer interaction references:

- [Slider Verticalix](https://www.framer.com/marketplace/components/slider-verticalix/) — project selection and transitions.
- [Premium Preloader](https://www.framer.com/marketplace/components/premium-preloader/) — a brief studio introduction, shown once per session.
- [Expand OnHover List](https://www.framer.com/marketplace/components/expand-onhover-list/) — expanding services with keyboard and touch controls.
- [Scroll Step Timeline](https://www.framer.com/marketplace/components/scroll-step-timeline/) — scroll-linked process progress.
- [Physics Sticker Wall](https://www.framer.com/marketplace/components/physics-sticker-wall/) — bounded industry labels with dragging, gravity, and collisions.
- [Shader Footer](https://www.framer.com/marketplace/components/shader-footer/) — a lightweight original WebGL field behind the footer.
- [Arc Pro Carousel](https://www.framer.com/marketplace/components/arc-pro-carousel/) — carousel controls reviewed; no testimonial section is fabricated.

These are design and behavior references. The implementation uses the existing Next.js stack, GSAP, and Motion.

## Interaction and content

The logo is the supplied VENIZOR asset. Project previews are labeled concept demonstrations. Products are described as in development. The enquiry validates input and prepares a reviewable mailto draft. It does not send or store submissions on a server.

Reduced-motion preferences disable the intro, parallax, physics animation, and continuous shader movement. Continuous footer motion has a pause control. Native dialogs contain keyboard focus and restore it to the original trigger. Sliders support arrow keys, tabs, and explicit previous/next controls.

## Verification

### Scroll choreography

The hero uses masked line entrances and a modular quarter-turn animation. Its pause control stops both ambient movement and scroll parallax. The studio statement fills from muted text to ink as visitors scroll.

On desktop, the work gallery stays at 24px from the top while vertical scrolling moves through four project panels. Tabs, previous/next controls, and keyboard navigation remain available. On mobile it becomes a native horizontal swipe gallery. The current project is preserved across that breakpoint.

Process cards stack using native sticky positioning; the previous card recedes as the next arrives. Product elements assemble while scrolling, and the footer wordmark unfolds into view. Reduced-motion settings remove these spatial effects and pinning while keeping content readable and controls functional.

The introduction marks its session as complete only after it has played. This fixes the React development-mode cleanup that previously caused the animation to be skipped.

`node scripts/verify-motion.mjs` records actual before/after transforms, pinned coordinates, text opacity, mobile behavior, and reduced-motion fallbacks. Results and screenshots are in `artifacts/motion/`.

`npm run build` passes and prerenders the home page. `npx tsc --noEmit` passes. Browser checks cover five viewport widths, navigation, expandable services, project controls, dialogs, enquiry drafts, search, timeline progress, industry interactions, reduced motion, and runtime errors. Screenshots and results are in `artifacts/`.

## Interactive section completion

The service accordion now contains eight complete capabilities, including web and mobile applications, AI, product platforms, marketing, SEO, and AEO. Artwork and capability tags enter as each panel opens. Hover expansion responds to actual pointer movement so scrolling or keyboard focus does not accidentally switch panels.

Project selection changes the supporting description and disciplines as well as the visual. The illustrated interfaces have distinct motion: an architectural zoom, changing chart bars, a floating payment card, and sequential workflow emphasis. Preview motion pauses outside the scene and has a manual pause control. Selected indices are clamped during responsive resizing.

Product artwork has an independent, pausable motion sequence for the ribbons, workflow nodes, and orbital sculpture. The scroll assembly and looping artwork use separate elements to avoid competing transforms.

Process cards now include expandable deliverables. A connected phase indicator and outcome follow the current scroll position in both directions. The industry section has eight stable selectors, tailored solution content, practical examples, an enquiry action, and the existing draggable sticker wall.

A small supplementary cursor ring follows mouse movement and changes scale over controls. It preserves the native cursor, hides for keyboard input, and is disabled on coarse pointers and with reduced motion. All new visuals use HTML, CSS, SVG, and existing icons.
