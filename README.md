# VENIZOR

A responsive technology studio website designed from the supplied Webflow and Framer references, using VENIZOR's existing branding. Built with Next.js, React, TypeScript, Motion, GSAP, and Lucide icons. Site visuals use native code and supplied branding; no generated images are included.

## Run locally

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run verify:design
```

The verification runner starts and stops a production preview on port 3100. It uses Google Chrome on Windows and Playwright Chromium in CI. Checks cover public routes, responsive layouts, navigation, tools, dialogs, contact flows, search, motion, recovery and accessibility. Screenshots and results are saved in `artifacts/`.

## Edit

- `src/app/page.tsx`: section content, services, industries, and project concepts.
- `src/components/experience.tsx`: native dialogs, enquiry flow, section reveals, and interface concept previews.
- `src/components/studio-experience.tsx`: navigation, intro, expanding services, project slider, scroll timeline, industry interactions, and shader footer.
- `src/components/scroll-direction.tsx`: page scroll progress, text reveals, product assembly, and footer choreography.
- `src/components/scroll-project-gallery.tsx`: desktop horizontal scroll story and mobile swipe gallery.
- `src/components/motion-details.tsx`: product motion controls and rotating hero words.
- `src/app/motion.css`: pinned scene, stacked process cards, and responsive motion styles.
- `src/app/concepts.css`: interface preview and dialog styles.
- `src/app/globals.css`: visual system, artwork, and responsive styles.
- `src/app/layout.tsx`: fonts and metadata.
- `DESIGN.md`: design direction, references, integration boundaries, and verification notes.

The project cards are clearly identified as concept demonstrations. The shared enquiry form supports validated server delivery, spam protection and durable retry once configured. Until enabled, it explicitly opens an email draft for the visitor to review and send. Confirm legal text, product availability, and contact details before publication.

`node scripts/verify-motion.mjs` measures actual animation changes, verifies project pinning and horizontal movement, checks stacked process cards, and captures motion screenshots in `artifacts/motion/`.

`node scripts/verify-enhancements.mjs` checks the cursor position, pointer-reactive hero, eight service panels, animated project previews and pause controls, rotating product artwork, process deliverables, and all eight industry solution states. It also checks mobile overflow and reduced-motion hydration. Results and section screenshots are saved in `artifacts/enhancements/`.



## Production implementation

The shared logo is [public/logo.svg](./public/logo.svg). Section artwork lives in `src/components/section-illustration.tsx`, with distinct compositions for each subject; `src/app/section-art.css` controls framing and motion. Inner-page footers are light, and the homepage keeps its animated gradient. Developer Tools uses browser cryptography and manually entered pricing rates. Run `npm run typecheck` for clean-checkout Next.js type generation and TypeScript validation, and `npm run verify:polish` after building for the new tools, artwork, logo, footer and responsive checks.

Site search loads a compact index from `/api/search`, derived from the same page, service and article records used by the sitemap. Add content to those records to include it automatically. Homepage sections use absolute `/#section` links from every page. After a build, `npm run verify:search` checks all destinations, section scrolling, keyboard and mobile navigation, accessibility, loading and retry states; it is also part of `npm run verify:design`.

Cookie settings is available in every regular page footer. Optional analytics stays off until consent; the initial banner appears when an analytics provider is configured. See [docs/COOKIE-PREFERENCES.md](./docs/COOKIE-PREFERENCES.md) for the storage policy and test modes. `npm run verify:cookies` checks the current build; CI also builds a fake-provider scenario and intercepts all provider requests locally.

Runtime page failures have route-level recovery screens and optional features have independent boundaries. See [docs/ERROR-RECOVERY.md](./docs/ERROR-RECOVERY.md). Run `npm run verify:error-recovery` after a build to inject browser faults and verify recovery without adding public test routes.

The shared motion controller is in `src/components/smooth-motion.tsx`. It synchronizes Lenis desktop scrolling with GSAP and preserves native touch and reduced-motion behavior. See [docs/MOTION-SYSTEM.md](./docs/MOTION-SYSTEM.md). After a production build, `npm run verify:smooth-motion` checks wheel interpolation, navigation, dialogs, project controls, live preferences and touch input; the same checks are included in `npm run verify:design`.

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for the guide coverage, deferred integrations, environment setup, monitoring and launch checks. The shared light visual system is in `src/app/design-system.css`; its references and rules are in [docs/DESIGN-SYSTEM.md](./docs/DESIGN-SYSTEM.md). Run `npm run lint`, `npm test`, `npm run build` and `npm run verify:design` for the current verification suite. The production runner checks all 33 public routes, responsive layouts, theme consistency, keyboard interactions, motion controls and accessibility, and saves evidence in `artifacts/production/` and `artifacts/refinement/`. Older screenshot scripts describe earlier layouts.
