import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata("/terms");
export default function TermsPage() {
  return (
    <LegalPage title="Website terms." path="/terms">
      <h2>Using this website</h2>
      <p>
        This website introduces VENIZOR?s services and provides educational
        articles, tools and illustrative concepts. Use it lawfully and do not
        attempt to disrupt the site, bypass access controls or misuse the
        enquiry form.
      </p>
      <h2>Illustrative content</h2>
      <p>
        Concept projects, architecture scenarios, diagrams and simulator outputs
        explain possible approaches. They are not evidence of client
        engagements, production benchmarks, security certification or guaranteed
        business results. Demonstration tools use assumptions and simplified
        models; independently verify any output before using it in a real
        system.
      </p>
      <h2>Project engagements</h2>
      <p>
        An enquiry, scope outline or conversation does not create a service
        agreement. Scope, price, timeline, ownership, confidentiality, support
        and acceptance terms are agreed separately in writing. Any general
        delivery outline on this site is indicative and depends on the project.
      </p>
      <h2>Content and intellectual property</h2>
      <p>
        VENIZOR?s brand and original website content remain the property of
        their respective owners. Third-party names and technologies are used for
        identification. Code examples are educational and require review,
        testing and appropriate licensing checks before reuse.
      </p>
      <h2>Availability and external links</h2>
      <p>
        We work to keep the site useful and available, but do not promise
        uninterrupted access or that every example fits your circumstances.
        External services control their own availability and policies.
        Information may change as products, technologies and our services
        evolve.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about these website terms can be sent to info@venizor.com.
        Contract-specific terms take precedence for an agreed engagement.
      </p>
    </LegalPage>
  );
}
