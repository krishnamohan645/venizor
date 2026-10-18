# VENIZOR implementation and activation

The 18 October 2026 guide is implemented in the site code where local changes are possible. Business identities and live service connections are deliberately deferred at the user's request. The site has not been deployed by this work.

## What changed

| Guide area | Implementation | Remaining activation |
| --- | --- | --- |
| Trust and evidence | Removed named fictional client cases, quotes, asserted benchmarks, fake audience counts and unverified jobs. Cases are explicitly illustrative. Homepage concept labels remain visible. | Publish approved client evidence when available. |
| Monitoring | Uncached health endpoint, Sentry server/browser hooks, global error fallback, public-route monitor, gated synthetic provider-acceptance check. | Add DSNs; configure alert destinations; set up 1-minute Better Stack/UptimeRobot checks. GitHub's daily check is supplementary. |
| Contact pipeline | Shared validated form/API, Turnstile verification including hostname/action, honeypot, distributed rate limits, email receipts, durable pending delivery and retry endpoint. CRM failure does not reject an accepted email. | Verify sender domain; add credentials; enable delivery; schedule authenticated retries; test inbox receipt and CRM acceptance. |
| Domain/email | Canonical site URL, www redirect, HSTS and email configuration template. | Confirm domain ownership and Vercel binding; configure DNS/WAF, SPF/DKIM/DMARC. Consider HSTS preload only after checking every subdomain. |
| Security | Common security headers and a report-only CSP. | Review CSP in the browser/hosting logs, configure a reporting collector and enforce only after allowances are verified. |
| Indexing | Unique route metadata/canonicals/OG URLs, generated 1200×630 images, complete sitemap, production-only indexing and search verification settings. | Add Google/Bing verification and submit the sitemap. Check external tools after deployment. |
| Service discovery | Eight service pages with direct answers, deliverables, process, scope notes, examples, FAQs and Service/Breadcrumb schema. Linked from service panels, navigation and footer. | Add approved case evidence as available. |
| Entity/authorship | Accurate Organization/Article/Breadcrumb schema without fake phone numbers or social accounts. Editorial attribution stays an Organization. | Real founder and author names, biographies, photos and approved profile links are deferred. Do not invent Person schema. |
| Lead magnets | Scope and simulator results are visible before contact collection; downloadable reports and optional follow-up; requested report-copy delivery is supported. | Enable email delivery to send requested copies. |
| Scheduling/WhatsApp | Conditional links and conversion click events exist; no dummy number or booking URL. | Add the approved URL and number later. A click is not counted as a completed booking. |
| Analytics | Consent-gated GA4 and Vercel Analytics/Speed Insights; lead and tool events; preference control. | Add IDs and enable services; mark real lead/booking outcomes as key events. Confirm booking completion using the actual scheduler integration. |
| AI discovery | Crawlable server-rendered service content, appropriate schema, production crawler rules and refreshed llms files. | Review Cloudflare bot rules and crawler logs; submit/validate externally. No citation guarantee. |
| Performance/accessibility | Sensible logo sizes and AVIF/WebP negotiation, reduced-motion support, accessible split text, pause controls and keyboard journeys. | Run real-device/real-user performance checks after deployment. No WCAG certification or Core Web Vitals score is claimed. |
| Legal | Real Privacy and Terms routes reflecting manual-email mode, optional delivery, storage and analytics behavior. | Add registered identity when provided; obtain business/legal review before launch. |

## Configure later

Copy `.env.example` to a local environment file or set the values in Vercel settings. Keep separate preview and production values. Public variables are bundled at build time; rebuild when enabling a public feature. Never commit credentials.

1. Keep `NEXT_PUBLIC_CONTACT_ENABLED=false` until sender, recipient, Turnstile and Redis settings have been verified. With no configuration, forms open an explicit email draft and the API returns 503 rather than claiming delivery.
2. Verify the Resend sender domain and SPF/DKIM/DMARC. Set `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` explicitly.
3. Create a Turnstile widget for the real hostnames. Set the public key, secret and `TURNSTILE_ALLOWED_HOSTNAMES`. The required action is `contact`. Test keys belong only in test/preview environments.
4. Configure Upstash Redis. It stores hashed rate-limit identifiers, pending lead payloads and short deduplication receipts. Pending payloads expire after seven days and are removed after delivery completes. Hosting, email and CRM retention are separate.
5. If using CRM, set an HTTPS `CRM_WEBHOOK_URL` and optional bearer token. The receiver must deduplicate the `Idempotency-Key`/`requestId`, since delivery can be retried.
6. Schedule `GET /api/cron/leads` with `Authorization: Bearer <CRON_SECRET>` at a suitable interval, e.g. every five minutes. Use your scheduler or a Vercel cron on a plan that supports the chosen interval. No scheduler has been activated automatically.
7. For synthetic tests, configure a separate `CONTACT_TEST_TO_EMAIL`, secret and optional `CRM_TEST_WEBHOOK_URL`. The test flag never bypasses security without the matching secret. Enable the GitHub monitor only when those destinations are ready.
8. Set DSNs/analytics IDs and configure alerts in the provider dashboards. All are inactive with empty values. Optional analytics waits for visitor permission.
9. Add approved business/profile/phone/booking details when available. Empty values are omitted rather than published as placeholders.

## Delivery semantics and limits

The form reports success only after Resend returns an email ID. That confirms provider acceptance, not inbox delivery. Verify SPF/DKIM/DMARC, monitor bounce events and connect an inbox-receipt check before claiming end-to-end delivery monitoring. The bundled synthetic script intentionally reports this distinction.

Retries use a durable Redis record and Resend idempotency keys. Ambiguous primary-email retries stop before the provider's 24-hour idempotency window and require manual review. Failed CRM delivery stays queued. Alert on queue age, failed jobs and missing cron invocations; the retry mechanism depends on the configured scheduler and Redis availability. No system can promise that messages are never lost.

Requested report copies and CRM pushes run after the primary response through Next.js `after`, with the durable retry queue as recovery. Pending record retention stays anchored to creation time rather than extending on each retry.

## Validation

Cookie preference behavior is documented in `docs/COOKIE-PREFERENCES.md`. Analytics is still disabled by default. New provider configuration requires fresh permission; referral storage and events share that permission gate. Tests cover default-off behavior and a fake-provider build with locally intercepted requests.

Runtime isolation is documented in `docs/ERROR-RECOVERY.md`. The design suite includes fault-injection checks for page recovery, retry, healthy-route navigation, footer effects and native scrolling after an animation failure. Build/compilation failures remain deployment blockers.

```
npm run lint
npm test
npm run build
npm run verify:design
```

The verification runner starts the production build on port 3100 and expects live integrations disabled. On Windows it uses installed Chrome; elsewhere install Playwright Chromium. It writes screenshots and accessibility findings to `artifacts/production/` and `artifacts/refinement/`. The latest run passed 29 production browser checks and audited 33 public routes across 106 page/state/viewport scans, with 12 accessibility scans. Automated accessibility checks supplement a keyboard and real-device review; they do not establish conformance.

The shared light theme, typography, artwork and motion rules are documented in `docs/DESIGN-SYSTEM.md` and implemented in `src/app/design-system.css`. Live integrations and business profiles remain deferred.

`docs/MOTION-SYSTEM.md` documents the shared Lenis/GSAP scroll controller, transition timings and native input fallbacks. `npm run verify:smooth-motion` checks actual wheel frames, interruption, anchors, keyboard/history navigation, modal locks, reduced-motion switching and native touch. These checks also run in the complete design suite.

`npm audit --omit=dev` reports no runtime dependency advisories at verification time. The full audit reports five related development-tool advisories through ESLint's `braces` dependency; the registry currently offers no patched `braces` release. No forced framework downgrade was applied. Review this dependency chain as fixes become available.

## Launch and monthly operations

- Before launch: review real business details and legal content; validate schema and social previews; test actual inbox/CRM delivery and booking/WhatsApp on mobile; check mobile PageSpeed and security headers; verify production indexing and preview exclusion.
- Monitor `/`, `/contact`, `/blog` and `/api/health` every minute through the chosen uptime provider. Configure failure alerts and a delivery mailbox check.
- Monthly: review Search Console/Bing indexing, real-user performance, Sentry errors, lead delivery and source attribution. Review the pending delivery queue and privacy configuration.
- Publish or refresh approximately two evidence-backed articles a month. Add original code, screenshots, measured examples or lessons only when available. Update visible modified dates when content changes.
- Record 10–15 repeatable buyer questions across the chosen AI engines in `docs/citation-baseline.csv`, and review actual referral traffic. No baseline results are fabricated.
- Complete approved off-site company profiles later. Keep business name, description and URL consistent. Add only genuine reviews and verifiable project work.
- Add a real project write-up quarterly when there is approved work to publish. Log the date and evidence in `CHANGELOG.md`.

## Source references

Integration behavior follows the providers' documentation, including [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys), [Turnstile server verification](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) and [Vercel Speed Insights setup](https://vercel.com/docs/speed-insights/quickstart). Framework implementation uses the documentation shipped with the installed Next.js package. Sentry privacy settings follow the installed v11 SDK types rather than obsolete example options.
