import type { Metadata } from "next";
import Link from "next/link";
import { CTA } from "@/components/home/sections";
import { JoinCards, Manifesto, Principles } from "@/components/page/misc";
import { FeatureRow, Heading } from "@/components/page/blocks";
import { Reveal } from "@/components/fx/reveal";

export const metadata: Metadata = { title: "About", description: "Software tools got loud. We're building a calmer place to work." };

export default function AboutPage() {
  return (
    <>
      <Manifesto />
      <Principles />
      <section className="container-x pb-[clamp(72px,8.3vw,120px)]">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <Reveal y={8}>
              <div className="font-mono text-[12px] leading-4 tracking-[0.08em] text-muted">02 — PLATFORM</div>
            </Reveal>
            <Heading text="Built for modern AI operations." className="font-[570] tracking-[-0.02em]!" />
            <Reveal delay={0.2}>
              <p className="text-[17px] leading-[26px] text-muted">Trusted by universities, enterprises and global teams.</p>
            </Reveal>
          </div>
          <FeatureRow
            items={[
              { title: "Connected workflows", body: "Editor, CLI, Chat and App hand work to each other." },
              { title: "Shared context", body: "One memory per project, read by every surface." },
              { title: "Model routing", body: "The right model for each task, automatically." },
              { title: "Team workspaces", body: "Cross-functional teams in one shared environment." },
            ]}
          />
          <Reveal className="flex flex-wrap items-center gap-4 pt-2">
            <span className="font-mono text-[12px] leading-4 tracking-[0.08em] text-muted">COMING SOON</span>
            {["Puku Co-Work", "Puku Design", "Puku Cloud"].map((n) => (
              <Link key={n} href="/coming-soon" className="rounded-control border border-line bg-panel px-3 py-1.5 text-[14px] leading-5 text-fg transition-colors hover:border-accent hover:text-accent">
                {n}
              </Link>
            ))}
          </Reveal>
        </div>
      </section>
      <JoinCards />
      <CTA title="Build with us." primary={{ label: "See open roles", href: "/contact" }} />
    </>
  );
}
