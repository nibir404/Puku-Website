import type { Metadata } from "next";
import { CTA } from "@/components/home/sections";
import { FAQ, PageHero, Waitlist } from "@/components/page/common";
import { SoonCards } from "@/components/page/soon";

export const metadata: Metadata = { title: "Coming soon", description: "Three more tools, built on the same memory." };

export default function ComingSoon() {
  return (
    <>
      <PageHero eyebrow="IN THE WORKSHOP" medium title="Three more tools, built on the same memory." sub="We're building these in the open. Join the list and we'll invite you as each one opens.">
        <Waitlist cta="Get early access" />
      </PageHero>
      <div className="h-10" />
      <SoonCards />
      <FAQ
        title="Before you sign up."
        items={[
          { q: "When do they launch?", a: "Each opens to the waitlist in small groups first. We'll post dates in the changelog as they firm up." },
          { q: "Will they be included in my plan?", a: "Pro and Team plans get early access at no extra cost during the preview. Final pricing is announced before general availability." },
          { q: "Can my team join together?", a: "Yes. Join with a work email and we'll invite everyone on your Team workspace in the same wave." },
        ]}
      />
      <CTA title="Be first to try what's next." sub="Co-Work, Design and Cloud are on the way." primary={{ label: "Get notified", href: "#top" }} secondary={{ label: "No spam · one email per launch", href: "/changelog" }} />
    </>
  );
}
