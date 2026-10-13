import type { Metadata } from "next";
import { CTA } from "@/components/home/sections";
import { Compare, Pricing, TeamProducts } from "@/components/page/pricing";
import { FAQ } from "@/components/page/common";
import { Reveal } from "@/components/fx/reveal";
import { TextLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Pricing", description: "One subscription for Editor, CLI, Chat and App." };

export default function PricingPage() {
  return (
    <>
      <Pricing />
      <TeamProducts />
      <Compare />
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
        title="Questions."
        extra={<TextLink href="/privacy" className="text-[15px]">Read the refund policy</TextLink>}
        items={[
          { q: "What counts as an agent request?", a: "One message to an agent in the Editor, CLI or Chat. Completions and next-edit suggestions don't count." },
          { q: "Can I switch plans any time?", a: "Yes. Upgrades apply immediately and are prorated; downgrades take effect at the end of your billing period." },
          { q: "Do you offer student or open-source discounts?", a: "Students get Pro free with a verified .edu email, and maintainers of active open-source projects can apply for a free Team seat." },
          { q: "How do I get an invoice for my company?", a: "Add your company name and VAT/BIN in Settings → Billing. Every payment then generates a downloadable invoice." },
          { q: "Are Puku Bot, Puku Cloud and Feluda extra?", a: "No. All three are included in every Team and Enterprise seat. Enterprise adds higher Cloud and Feluda limits, custom integrations and self-hosted options." },
          { q: "How do usage limits refresh?", a: "Individual limits reset daily. Team usage is pooled across all seats and resets each billing period, so busy teammates can draw on quieter ones." },
          { q: "Which models are included?", a: "Every plan includes Puku's default models. Pro and above unlock Research and Deep modes, and Team and Enterprise get priority access at peak times." },
          { q: "Is my code used for training?", a: "No. Your code and prompts are never used to train models. Enterprise can also run agents in self-hosted sandboxes so code never leaves your network." },
        ]}
      />
      <CTA />
    </>
  );
}
