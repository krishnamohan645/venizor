# VENIZOR light system

This refinement extends the existing brand and replaces the remaining dark utility and article surfaces. All routes use the same system in `src/app/design-system.css`.

- One family: Geist. The legacy mono token aliases Geist, and code, diagrams, headings and labels share the family. Tabular numerals keep counters and examples easy to scan.
- One palette: white and cool pale blue surfaces, blue actions and diagrams, ink text, muted supporting text and fine neutral borders. The homepage footer has the animated navy/blue gradient; every other page uses a light, solid pale-blue footer. No automatic dark-mode variant.
- One scale: shared display, heading, body and label tokens; consistent radii, buttons, spacing and focus treatment. Content remains responsive and can grow beyond one screen.
- One illustration language: original blue/white vector compositions in `section-illustration.tsx`, with distinct architecture, operations, finance, document, commerce and technical subjects. The shared header logo is `public/logo.svg`. No fictional production claims, stock-client logos or invented social proof.
- Preserve the homepage hero's original CSS geometric mosaic and its animation. The section artwork refresh excludes this hero.
- Preserve the product section's original ribbons, connected icon flow and three-ring orb, including their GSAP animation and pause control. The artwork refresh excludes these product cards.
- Preserve the contact page's original envelope, letter, orbit rings and floating/orbiting motion, including pause and reduced-motion support.
- The architecture scenario carousel uses its own interface compositions in `scenario-visual.tsx`: payment events, source-backed answers, a delivery route and a storefront-to-order flow. These are illustrative sample interfaces; changes here do not affect project artwork, the hero or product cards.
- Industry tabs use the original interface illustrations in `industry-art.tsx`, with larger, light cards and the shared blue palette. The eight subjects cover a SaaS workspace, storefront, care workflow, learning journey, property preview, client engagement, delivery route and idea sketch. Keep labels illustrative rather than presenting invented business metrics as results.
- Motion: staggered entrances, softly moving layered product scenes, animated connections, hover/focus affordances and user-controlled project transitions. Continuous motion has a pause control; reduced-motion mode removes animation.

References inspected on 18 October 2026:

- [Instrument contact](https://www.instrument.com/contact/contact-form): prominent opening, simple questions and an obvious direct-email alternative.
- [Linear journal](https://linear.app/now): restrained article hierarchy, topic navigation, controlled thumbnail proportions and legible metadata. Only its structure was studied; VENIZOR keeps a light palette.
- [Work & Co](https://work.co/): project-led presentation and clear design/engineering positioning.

Acceptance: inspect all public routes and interactive tool states; light surfaces with the requested navy footer exception; one rendered font family; coherent blue/neutral artwork; no 320/390/768px overflow; contact, blog and playbook keyboard flows; working motion controls and reduced motion; production build, tests and accessibility checks. Reference screenshots are in `artifacts/refinement/` and do not become public site assets.
