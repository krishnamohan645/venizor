# Website changes

## 18 October 2026

- Rebuilt shared search from page, service and article records; fixed homepage section links from inner pages, added ranked topic matching, loading/retry states and verified all 40 destinations.
- Added footer Cookie settings, a consent banner for configured analytics, necessary-only/reject/custom choices, expiry, cross-tab updates and consent-gated referral capture. Tracking remains off by default; browser tests intercept fake providers locally.
- Limited the animated gradient footer to the homepage; other pages use a single solid navy background.
- Added route-level recovery with retry/navigation, isolated optional effects and analytics, and a standalone root fallback. Fault-injection checks cover broken pages, retry, healthy-route navigation and animation failure recovery.
- Added Lenis scrolling synchronized with GSAP, with native touch, live reduced-motion support, dialog locks and momentum cancellation for keyboard/history navigation.
- Smoothed shared reveals and showcase transitions, optimized article progress updates and reused hero pointer tweens.
- Redesigned the playbook as a guided six-layer workspace with presets, a live blueprint, contextual review questions and a copyable brief. Replaced fixed readiness scores with explicit architecture planning.
- Restored the original animated navy-and-blue footer at the user's request; other page surfaces stay light.
- Unified all public routes under one light palette, Geist typography and shared design tokens, including tools and article diagrams.
- Rebuilt contact, blog and project showcases with coordinated artwork, responsive layouts, motion and pause controls.
- Verified 33 public routes across 106 page/state/viewport scans, 12 accessibility scans and 29 production browser checks.
- Implemented the local changes from the VENIZOR implementation guide.
- Replaced dark landing surfaces with light, viewport-sized engineering chapters and a light footer.
- Redesigned field notes as an editorial reading room with topic illustrations and motion controls.
- Removed unverified client, testimonial, benchmark, audience-count and job claims.
- Added eight service pages, complete metadata/social images, accurate schema, legal pages and preview indexing controls.
- Added disabled-by-default lead delivery, anti-spam, retry, requested report-copy and optional monitoring/analytics code.
- Business profiles and live integrations remain deferred at the user's request. See IMPLEMENTATION.md for activation and validation.
