# Cookie and analytics preferences

Use the existing light Geist/blue design system. A compact, non-blocking banner offers **Necessary only**, **Accept all** and **Customize choices** when an optional analytics provider is configured. The two primary choices are adjacent, equal-size controls. Necessary only and Reject optional both turn analytics off. No optional choice is preselected. A keyboard-accessible native dialog presents the available categories and provider names. Cookie settings is always available in the homepage and shared page footer.

Analytics remains disabled by default, as requested. With no optional provider, there is no first-visit consent banner; the settings panel explains that analytics is off and disables its switch. This avoids asking visitors to approve tracking that is not running. The banner activates automatically when an approved Google Analytics ID or Vercel Analytics setting is supplied.

Preferences are versioned, scoped to the configured providers and expire after 180 days. Adding or changing a provider invalidates prior consent. Legacy analytics flags do not grant fresh consent. Choices synchronize across tabs. Expiry, withdrawal and storage clearing revoke event permission. If browser storage is blocked, the choice remains in memory for this tab and the visitor is informed.

Scripts mount only after explicit permission. Google uses a basic opt-in load: denied defaults, analytics permission, then configuration; advertising permissions stay denied. Loaded Google tracking is disabled immediately on withdrawal. Vercel event callbacks check current permission before sending. Accessible first-party Google Analytics cookies and session referral attribution are removed on withdrawal. This cannot remove cookies set by other origins or already transmitted data.

Referral/campaign capture and custom events use the same permission gate. Essential site preferences and user-requested reading bookmarks remain local; no analytics integration is activated by this work. Monitoring and live integrations remain deferred. Review the privacy notice, actual production providers and applicable requirements before launch; the implementation is not a legal certification.

Verification: unit checks for malformed/expired/configuration-mismatched decisions, cross-tab state and blocked storage; browser checks for default-off services, footer access, focus/Escape, saving, mobile layouts, and optional-provider mode with all analytics network calls intercepted locally. No real tracking IDs or secrets are used in tests.

Provider behavior follows [Google's consent documentation](https://developers.google.com/tag-platform/security/guides/consent) and the installed Vercel SDK `beforeSend` contracts.
