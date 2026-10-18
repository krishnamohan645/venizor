import { BreadcrumbJsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata("/case-studies");
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd path="/case-studies" />
      {children}
    </>
  );
}
