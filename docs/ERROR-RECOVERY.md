# Runtime failure isolation

- `src/app/error.tsx` handles page and nested-layout rendering failures while preserving the root layout. Blog and services have their own segment boundaries using the same independent recovery UI.
- The recovery screen has retry, home, field notes, contact and services navigation. It uses the installed Next.js `retry()` API, which refreshes server contents as well as resetting the boundary. Client navigation clears the failed route state. Raw exception messages and user input are never rendered in the fallback.
- `src/app/global-error.tsx` is the last resort for root-layout failures. It supplies its own document, inline light styling and ordinary links, so it does not depend on the failed page shell or its CSS.
- Framework-aware `catchError` boundaries isolate optional smooth scrolling, analytics and footer artwork. A decorative footer failure leaves footer content and navigation intact. Framework redirects and not-found signals retain their normal behavior.
- Smooth-scroll frame failures have explicit cleanup because animation callbacks run outside React's error boundaries. The interpolator is destroyed and native scrolling remains available.
- Error reporting loads asynchronously and catches its own failure. Monitoring configuration remains deferred; recovery works without it.

This isolates runtime rendering/lifecycle failures. Expected request/validation failures still need explicit handling (as in the existing lead form). Event handlers and arbitrary asynchronous callbacks are not automatically caught by React boundaries. Syntax errors, missing modules, failed builds, process crashes and hosting outages cannot be fixed by a page boundary.

Verification injects faults in browser APIs used by actual client components, exercises retry/navigation/optional-feature failures and checks healthy routes independently. No public crash endpoint or production fault flag is added.
