"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { EASE, Reveal, SplitText, Stagger } from "@/components/fx/reveal";
import { PixelCanvas } from "@/components/fx/pixel-canvas";
import { Button, CopyCommand, TextLink } from "@/components/ui/button";
import { Apple, DotGrid } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { ThemeImage } from "./hero";
import { ChatCard, MemoryCard, PermissionsCard, PlanCard } from "./agent-cards";

export function SectionHead({
  eyebrow,
  title,
  aside,
  className = "",
  size = "lg",
}: {
  eyebrow: string;
  title: string;
  aside?: React.ReactNode;
  className?: string;
  size?: "lg" | "md";
}) {
  return (
    <div className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between ${className}`}>
      <div className="flex flex-col gap-3">
        <Reveal y={8}>
          <div className="eyebrow">{eyebrow}</div>
        </Reveal>
        <SplitText
          text={title}
          className={`max-w-[640px] tracking-[-0.03em] text-fg ${
            size === "lg" ? "text-[clamp(34px,3.33vw,48px)] leading-[1.083]" : "text-[clamp(32px,3.06vw,44px)] leading-[1.136] font-[570]"
          }`}
        />
      </div>
      {aside && <Reveal delay={0.2}>{aside}</Reveal>}
    </div>
  );
}

/* ── Products ─────────────────────────────────────────── */
const PRODUCTS = [
  { tag: "EDITOR", name: "Puku Editor", body: "An AI-native development environment. Write and change code with an agent that knows your project.", cta: "Download for macOS", href: "/editor" },
  { tag: "CLI", name: "Puku CLI", body: "Run automation, infrastructure operations and execution workflows from your terminal.", cta: "Install the CLI", href: "/cli" },
  { tag: "CHAT", name: "Puku Chat", body: "Chat, work with files, and explore projects and research in your browser.", cta: "Open Puku Chat", href: "/chat" },
  { tag: "PREVIEW", name: "Puku App", body: "A mobile preview for chats, attachments, projects, and dictated prompts.", cta: "Learn about Puku App", href: "/app", warn: true },
];

export function Products() {
  return (
    <section className="container-x pt-[clamp(72px,8.3vw,120px)] pb-10">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-10">
        <SectionHead
          eyebrow="02 — PRODUCTS"
          title="Products that work as one system."
          aside={<p className="max-w-[360px] text-[18px] leading-[27px] text-muted">Work in the editor, from the terminal, or in your browser.</p>}
        />
        <Stagger className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4" itemClassName="flex" y={16}>
          {PRODUCTS.map((p) => (
            <Link
              key={p.name}
              href={p.href}
              className="group/pc flex w-full flex-col gap-2.5 rounded-panel border border-line bg-panel p-6 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_14px_30px_-18px_color-mix(in_oklab,var(--accent)_45%,transparent)]"
            >
              <span className={`font-mono text-[12px] leading-4 ${p.warn ? "text-warning" : "text-muted"}`}>{p.tag}</span>
              <span className="text-[20px] leading-6 text-fg">{p.name}</span>
              <span className="text-[15px] leading-[22px] text-muted lg:h-[88px]">{p.body}</span>
              <span className="mt-auto text-[14px] leading-[18px] text-accent">
                {p.cta} <span className="inline-block transition-transform duration-300 group-hover/pc:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </Stagger>
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-panel border border-dashed border-line px-6 py-[18px]">
            <span className="font-mono text-[12px] leading-4 tracking-[0.1em] text-muted">COMING SOON</span>
            {["Puku Co-Work", "Puku Design", "Puku Cloud"].map((n, i) => (
              <span key={n} className="flex items-center gap-5 text-[16px] leading-5 text-fg">
                {i > 0 && <span className="text-line">·</span>}
                {n}
              </span>
            ))}
            <span className="grow" />
            <TextLink href="/coming-soon" className="text-[14px] leading-[18px]">
              Get notified
            </TextLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── PUKU.md hub ──────────────────────────────────────── */
export function HubIntro() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-[clamp(16px,5.56vw,80px)] py-20 lg:h-[580px] lg:flex-row lg:items-center lg:justify-between lg:py-0">
        <div className="flex w-full max-w-[480px] shrink-0 flex-col justify-between gap-10 lg:h-[340px]">
          <SplitText
            text="Introducing PUKU.md. A memory every agent can read."
            className="text-[clamp(32px,3.06vw,44px)] leading-[1.136] font-[570] tracking-[-0.025em] text-fg"
          />
          <Reveal delay={0.2} className="flex w-full max-w-[320px] flex-col gap-5">
            <p className="text-[16px] leading-[25px] text-muted">Plans, decisions and conventions, kept in plain markdown and versioned with your code.</p>
            <Link
              href="https://docs.puku.sh"
              className="group/gs flex h-[42px] w-fit items-center gap-2.5 rounded-[10px] border border-line bg-raised pr-3.5 pl-1 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgb(40_44_34/0.1)]"
            >
              <span className="grid size-[34px] place-items-center rounded-[8px] bg-fg text-main transition-transform duration-500 group-hover/gs:rotate-90">
                <DotGrid />
              </span>
              <span className="text-[14px] leading-[18px] font-[570] text-fg">Read the docs</span>
            </Link>
          </Reveal>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative w-full max-w-[720px] lg:mt-10"
        >
          <ThemeImage light="/img/hub-light.png" dark="/img/hub-dark.png" alt="Editor, CLI, Chat and App connected through PUKU.md to Diff, PR and Deploy" width={1440} height={386} className="h-auto w-full" />
          {/* packets travelling along the hub lines */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {[
              { top: "18%", dir: 1, d: 0 },
              { top: "80%", dir: 1, d: 1.2 },
              { top: "18%", dir: -1, d: 0.6 },
              { top: "80%", dir: -1, d: 1.8 },
            ].map((p, i) => (
              <motion.span
                key={i}
                className="absolute size-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]"
                style={{ top: p.top, left: p.dir === 1 ? "4%" : "96%" }}
                animate={{ left: p.dir === 1 ? ["4%", "36%"] : ["96%", "64%"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: p.d, ease: "easeInOut", repeatDelay: 0.6 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Puku Graph ───────────────────────────────────────── */
export function Graph() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const rotateX = useTransform(p, [0, 1], [22, 0]);
  const scale = useTransform(p, [0, 1], [0.9, 1]);
  const y = useTransform(p, [0, 1], [80, 0]);
  const spread = useTransform(p, [0.4, 1], [0.6, 1]);
  return (
    <section className="bg-main py-[clamp(64px,6.67vw,96px)]">
      <div className="container-x flex flex-col items-center gap-10">
        <div className="w-full max-w-[1120px]">
          <div className="flex flex-col gap-4">
            <Reveal y={8}>
              <div className="eyebrow tracking-[0.08em]">PUKU GRAPH · CODEBASE CONTEXT</div>
            </Reveal>
            <SplitText
              text={"The right code.\nBefore the first edit."}
              className="max-w-[620px] text-[clamp(34px,3.33vw,48px)] leading-[1.083] font-[570] tracking-[-0.03em] text-fg"
            />
          </div>
        </div>
        <div ref={ref} className="w-full max-w-[1120px] [perspective:1400px]">
          <motion.div style={{ rotateX, scale, y, transformOrigin: "50% 100%" }} className="overflow-hidden rounded-[clamp(14px,1.67vw,24px)]">
            <motion.div style={{ scaleY: spread }} className="origin-center">
              <ThemeImage
                light="/img/graph-light.svg"
                dark="/img/graph-dark.svg"
                alt="Exploded stack: memory, context, graph and change layers"
                width={1120}
                height={560}
                className="h-auto w-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Agents that ask first ────────────────────────────── */
export function AgentsAskFirst() {
  return (
    <section className="border-t border-line py-[clamp(64px,6.67vw,96px)]">
      <div className="container-x mx-auto flex max-w-[1440px] flex-col gap-12">
        <SectionHead
          size="md"
          eyebrow="02 — YOU STAY IN CONTROL"
          title="Agents that ask first."
          aside={<p className="max-w-[420px] text-[17px] leading-[26px] text-muted">Every write, command and network call goes through permissions you set once per project.</p>}
        />
        <Stagger className="flex flex-col gap-4 md:flex-row" itemClassName="flex flex-1 basis-0" y={24} stagger={0.09}>
          <PlanCard />
          <MemoryCard />
        </Stagger>
        <Stagger className="-mt-8 flex flex-col gap-4 md:flex-row" itemClassName="flex flex-1 basis-0" y={24} stagger={0.09}>
          <PermissionsCard />
          <ChatCard />
        </Stagger>
      </div>
    </section>
  );
}

/* ── Feature grid ─────────────────────────────────────── */
const FEATURES = [
  { n: 1, title: "One memory, every surface.", body: "Decisions written in the Editor are waiting in the CLI before you switch windows.", chip: "PUKU.md sync" },
  { n: 2, title: "Never lose a session.", body: "Every run, diff and question is searchable, even the one from last quarter.", chip: "Session history" },
  { n: 3, title: "Agents in parallel.", body: "Fan out review, tests and docs at once. See who is running, queued or done.", chip: "Subagents" },
  { n: 4, title: "Rewind any checkpoint.", body: "Every edit is a checkpoint. Step back before the change that broke the build.", chip: "Checkpoints" },
];

export function FeatureGrid() {
  return (
    <section className="container-x pt-10 pb-[clamp(72px,8.3vw,120px)]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4">
        <div className="flex flex-col gap-3 pb-6">
          <Reveal y={8}>
            <div className="eyebrow">03 — BUILT FOR FLOW</div>
          </Reveal>
          <SplitText text="Less context switching." className="text-[clamp(34px,3.33vw,48px)] leading-[1.083] tracking-[-0.03em] text-fg" />
        </div>
        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2" itemClassName="flex" y={24} stagger={0.09}>
          {FEATURES.map((f) => (
            <article
              key={f.n}
              className="group/fc flex w-full flex-col gap-5 rounded-panel border border-line bg-panel px-4 pt-4 pb-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-selected hover:shadow-[0_18px_40px_-24px_rgb(40_44_34/0.3)]"
            >
              <div className="overflow-hidden rounded-[8px]">
                <ThemeImage
                  light={`/img/feat${f.n}-light.svg`}
                  dark={`/img/feat${f.n}-dark.svg`}
                  alt=""
                  width={600}
                  height={250}
                  className="h-auto w-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/fc:scale-[1.025]"
                />
              </div>
              <div className="flex flex-col gap-2 px-3">
                <h3 className="text-[20px] leading-[26px] font-[570] text-fg">{f.title}</h3>
                <p className="text-[clamp(16px,1.25vw,18px)] leading-[1.5] text-muted">{f.body}</p>
                <span className="mt-1 flex h-[26px] w-fit items-center gap-2 rounded-control bg-hover px-2.5">
                  <span className="size-2 rounded-[2px] bg-accent transition-transform duration-500 group-hover/fc:rotate-45" />
                  <span className="font-mono text-[12px] leading-4 text-fg">{f.chip}</span>
                </span>
              </div>
            </article>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ── Releases ─────────────────────────────────────────── */
export const RELEASES = [
  { v: "1.8.66", p: "CLI", t: "Polished /sandbox and /permissions UX, clearer install instructions", d: "Oct 9" },
  { v: "2.7.0", p: "Editor", t: "Agent panel with keep / review per file, puku-ai-2.7 as default model", d: "Oct 6" },
  { v: "1.8.65", p: "CLI", t: "Smoother installer, automatic PKCE refresh, new /feedback command", d: "Oct 2" },
  { v: "0.9.0", p: "CHAT", t: "Research mode with cited sources and Send to CLI", d: "Sep 28" },
];

export function Releases({ eyebrow = "03 — SHIPPING WEEKLY", border = true }: { eyebrow?: string; border?: boolean } = {}) {
  return (
    <section className={`${border ? "border-t border-line" : ""} py-[clamp(64px,6.67vw,96px)]`}>
      <div className="container-x mx-auto flex flex-col gap-10 lg:flex-row lg:gap-20">
        <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[360px]">
          <Reveal y={8}>
            <div className="eyebrow tracking-[0.08em]">{eyebrow}</div>
          </Reveal>
          <SplitText text="Small releases, often." className="text-[clamp(32px,3.06vw,44px)] leading-[1.136] font-[570] tracking-[-0.025em] text-fg" />
          <Reveal delay={0.2} className="pt-2">
            <TextLink href="/changelog" className="text-[15px] leading-[18px]">
              Full changelog
            </TextLink>
          </Reveal>
        </div>
        <div className="flex grow flex-col border-t border-line">
          {RELEASES.map((r, i) => (
            <motion.div
              key={r.v}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6, delay: i * 0.04, ease: EASE }}
            >
              <Link
                href="/changelog"
                className="group/rel relative flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-line py-5 transition-colors sm:flex-nowrap"
              >
                <span className="absolute inset-y-0 -inset-x-3 -z-0 origin-left scale-x-0 rounded-[8px] bg-hover transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/rel:scale-x-100" />
                <span className="relative w-20 shrink-0 font-mono text-[13px] leading-4 text-fg">{r.v}</span>
                <span className="relative w-15 shrink-0 font-mono text-[12px] leading-4 text-muted">{r.p}</span>
                <span className="relative order-last w-full text-[15px] leading-[18px] text-fg sm:order-none sm:w-auto sm:grow">{r.t}</span>
                <span className="relative ml-auto font-mono text-[12px] leading-4 text-muted sm:ml-0">{r.d}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing teaser ───────────────────────────────────── */
export const PLANS = [
  { name: "Free", price: "$0", unit: "forever", body: "Editor, CLI and Chat with daily limits. Good for trying Puku on a side project.", cta: "Download", href: "/download" },
  { name: "Pro", price: "$20", unit: "/ month · ৳2,400", body: "Higher limits on every surface, research mode, background runs.", cta: "Start Pro", href: "/pricing", featured: true },
  { name: "Team", price: "$40", unit: "/ seat / month", body: "Shared memory and skills, org permissions, SSO, audit log.", cta: "Contact sales", href: "/contact" },
];

export function PricingTeaser() {
  return (
    <section className="border-t border-line py-[clamp(64px,6.67vw,96px)]">
      <div className="container-x flex flex-col gap-12">
        <SectionHead
          size="md"
          eyebrow="04 — PRICING"
          title="One plan covers every surface."
          aside={
            <TextLink href="/pricing" className="text-[15px] leading-[18px]">
              Compare plans
            </TextLink>
          }
        />
        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3" itemClassName="flex" y={24}>
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`group/plan relative flex w-full flex-col gap-5 overflow-hidden rounded-panel border bg-panel p-7 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 ${
                p.featured ? "border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] shadow-[0_20px_50px_-30px_color-mix(in_oklab,var(--accent)_60%,transparent)]" : "border-line hover:border-selected"
              }`}
            >
              {p.featured && (
                <span aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-accent opacity-[0.07] blur-3xl transition-opacity duration-500 group-hover/plan:opacity-[0.14]" />
              )}
              <div className="flex justify-between">
                <span className="text-[15px] leading-[18px] font-[570] text-fg">{p.name}</span>
                {p.featured && <span className="font-mono text-[11px] leading-[14px] text-accent">MOST CHOSEN</span>}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[40px] leading-12 font-[570] tracking-[-0.02em] text-fg">{p.price}</span>
                <span className="text-[14px] leading-[18px] text-muted">{p.unit}</span>
              </div>
              <p className="text-[14px] leading-[21px] text-muted">{p.body}</p>
              <Button href={p.href} variant={p.featured ? "primary" : "secondary"} size="md" className="w-fit">
                {p.cta}
              </Button>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ── CTA ──────────────────────────────────────────────── */
export function CTA({
  title = "Bring Puku into your next commit.",
  sub = "Free to start. Works with the repo you already have.",
  primary = { label: "Download for Mac", href: "/download", apple: true },
  secondary = "copy",
}: {
  title?: string;
  sub?: string;
  primary?: { label: string; href: string; apple?: boolean };
  secondary?: "copy" | { label: string; href: string };
} = {}) {
  return (
    <section className="bg-main pt-10 pb-[clamp(72px,8.3vw,120px)]">
      <div className="container-wide">
        <div className="relative isolate flex flex-col items-center gap-[22px] overflow-hidden rounded-[clamp(20px,1.94vw,28px)] border border-line bg-sidebar px-4 py-[clamp(64px,6.67vw,96px)] text-center">
          <div className="absolute inset-x-0 top-0 -z-10 h-[560px] opacity-[0.28] dark:opacity-[0.34]">
            <PixelCanvas name="cta" mode="gather" fit="cover" align="top" className="size-full" />
          </div>
          <motion.div
            initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.2 }}
          >
            <Logo size={44} />
          </motion.div>
          <SplitText
            text={title}
            className="max-w-[820px] text-[clamp(38px,4.44vw,64px)] leading-[1.03] tracking-[-0.04em] text-fg"
          />
          <Reveal delay={0.3}>
            <p className="text-[clamp(17px,1.32vw,19px)] leading-7 text-muted">{sub}</p>
          </Reveal>
          <Reveal delay={0.4} className="flex w-full flex-col items-center justify-center gap-2.5 pt-1.5 sm:w-auto sm:flex-row">
            <Button href={primary.href} size="lg" className="w-full sm:w-auto" wrapClassName="w-full sm:w-auto">
              {primary.apple && <Apple size={15} className="-mt-0.5" />} {primary.label}
            </Button>
            {secondary === "copy" ? (
              <CopyCommand className="max-sm:w-full max-sm:justify-center" />
            ) : (
              <Button href={secondary.href} variant="secondary" size="lg" className="w-full sm:w-auto" wrapClassName="w-full sm:w-auto">
                {secondary.label}
              </Button>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
