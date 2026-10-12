import type { Metadata } from "next";
import { CTA } from "@/components/home/sections";
import { Compare, Pricing } from "@/components/page/pricing";
import { FAQ } from "@/components/page/common";
import { Reveal } from "@/components/fx/reveal";
import { TextLink } from "@/components/ui/button";
import { Heading } from "@/components/page/blocks";

export const metadata: Metadata = { title: "Pricing", description: "One plan. Every Puku surface." };

export default function PricingPage() {
  return (
    <>
      <Pricing />
      <Compare />
      <section className="container-x pb-[clamp(72px,8.3vw,120px)]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-16">
          <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[620px]">
            <Reveal y={8}>
              <div className="font-mono text-[12px] leading-4 tracking-[0.08em] text-muted">03 — TEAM WORKSPACES</div>
            </Reveal>
            <Heading text="One shared environment." className="leading-[1.125]! font-[570] tracking-[-0.02em]!" />
          </div>
          <Reveal delay={0.2} className="flex grow flex-col gap-1.5 border-t border-line pt-5">
            <span className="text-[17px] leading-6 font-[570] text-fg">Everyone sees the same context.</span>
            <span className="text-[15px] leading-[22px] text-muted">Cross-functional teams work in one shared environment and see the same context — memory, skills and permissions included on Team and Enterprise.</span>
          </Reveal>
        </div>
      </section>
      <section className="border-y border-line bg-sidebar">
        <Reveal className="container-x flex flex-col gap-3 py-10 lg:flex-row lg:items-center lg:justify-between">
          <span className="flex items-center gap-3 text-[15px] leading-[18px] text-fg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" /></svg>
            Pay in USD by card, or in BDT with bKash, Nagad and Rocket.
          </span>
          <span className="font-mono text-[12px] leading-4 text-muted">Visa · Mastercard · Amex · UnionPay · bKash · Nagad · Rocket — verified by SSLCommerz</span>
        </Reveal>
      </section>
      <FAQ
        eyebrow="FAQ"
        title="Billing questions."
        extra={<TextLink href="/privacy" className="text-[15px]">Read the refund policy</TextLink>}
        items={[
          { q: "What counts as an agent request?", a: "One message to an agent in the Editor, CLI or Chat. Completions and next-edit suggestions don't count." },
          { q: "Can I switch plans any time?", a: "Yes. Upgrades apply immediately and are prorated; downgrades take effect at the end of your billing period." },
          { q: "Do you offer student or open-source discounts?", a: "Students get Pro free with a verified .edu email, and maintainers of active open-source projects can apply for a free Team seat." },
          { q: "How do I get an invoice for my company?", a: "Add your company name and VAT/BIN in Settings → Billing. Every payment then generates a downloadable invoice." },
        ]}
      />
      <CTA />
    </>
  );
}
