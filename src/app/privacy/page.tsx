import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata("/privacy");
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy notice." path="/privacy">
      <h2>Project enquiries</h2>
      <p>
        When you contact VENIZOR, we use the information you provide to respond,
        understand your project and discuss a possible engagement. Please do not
        send passwords, payment details or sensitive personal information
        through a project brief.
      </p>
      <p>
        While online delivery is disabled, the form opens an email draft in your
        own email application. Nothing is submitted by that form to a VENIZOR
        server. You choose whether to send the email, and your email provider
        handles that action.
      </p>
      <p>
        When online delivery is enabled, the form sends your name, email,
        project type, message and available referral or campaign information to
        our server. The delivery pipeline uses Resend for email, Upstash for
        rate limiting and pending delivery records, and a CRM webhook if
        configured. Pending records and deduplication receipts expire after
        seven days; the pending record is removed when delivery completes.
        Copies delivered to email or a CRM are retained according to the
        business relationship and applicable recordkeeping needs.
      </p>
      <h2>Spam protection and reliability</h2>
      <p>
        If enabled, Cloudflare Turnstile processes a security challenge before
        an online submission. The server may send your IP address to Cloudflare
        for that check; rate-limit keys use a hash rather than a plain IP
        address. Optional Sentry error reporting is configured to avoid sending
        form bodies and default personal information. Hosting providers may
        maintain operational request logs.
      </p>
      <h2>Local browser storage</h2>
      <p>
        The site saves your privacy choice in browser storage for up to six
        months. Reading preferences and bookmarks are saved when you request
        them. With analytics permission, a session-only referral record can
        retain your landing path, referring origin and selected campaign
        parameters so that an enquiry can be attributed. Declining analytics
        removes this referral record. Browser-based developer tools process
        inputs locally unless a feature explicitly describes otherwise. Avoid
        entering secrets into any demonstration tool.
      </p>
      <h2>Optional analytics</h2>
      <p>
        When configured, Google Analytics and Vercel Analytics or Speed Insights
        load only after you allow analytics. Necessary only and Reject optional
        both leave optional analytics off. You may change or withdraw your
        choice through Cookie settings in the footer. Withdrawing permission
        stops optional tracking and removes accessible first-party Google
        Analytics cookies. A consent banner appears when optional analytics is
        enabled on this site; when it is off, Cookie settings remains available.
        We do not load advertising integrations by default. Service providers
        may process information outside your country.
      </p>
      <h2>Your choices and requests</h2>
      <p>
        Contact info@venizor.com to ask about information you have sent, request
        a correction or deletion, or withdraw consent for further optional
        communications. We may need to verify the request and retain records
        where required for an agreement or legal obligation. Clear your browser
        storage to remove local preferences.
      </p>
      <h2>External services and changes</h2>
      <p>
        Booking, WhatsApp and other external links are shown only when
        configured. Following them takes you to the relevant provider, whose
        privacy terms apply. This notice will be updated when the site’s
        collection or integrations change.
      </p>
    </LegalPage>
  );
}
