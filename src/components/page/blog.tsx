"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useState } from "react";
import { PixelCanvas } from "@/components/fx/pixel-canvas";
import { EASE, Reveal, SplitText } from "@/components/fx/reveal";
import { TextLink } from "@/components/ui/button";

import { POSTS, type Cat } from "@/lib/posts";

function Thumb({ cover }: { cover: (typeof POSTS)[number]["cover"] }) {
  return (
    <div className="relative grid h-28 w-full shrink-0 place-items-center overflow-hidden rounded-panel border border-line bg-sidebar transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/post:-translate-y-1 sm:w-50">
      {cover.startsWith("wave") && (
        <div className={`absolute opacity-40 ${cover === "wave" ? "-inset-6" : "-inset-12"}`}>
          <PixelCanvas name="shader" mode="wave" fit="cover" align="center" className="size-full" />
        </div>
      )}
      {cover === "feat" && (
        <>
          <Image src="/img/feat1-light.svg" alt="" width={300} height={125} className="theme-img-light w-[300px] max-w-none" />
          <Image src="/img/feat1-dark.svg" alt="" width={300} height={125} className="theme-img-dark w-[300px] max-w-none" />
        </>
      )}
      {cover === "editor" && (
        <>
          <Image src="/img/story-editor-light.png" alt="" width={400} height={250} className="theme-img-light absolute -top-5 -left-20 w-[400px] max-w-none" />
          <Image src="/img/story-editor-dark.jpg" alt="" width={400} height={250} className="theme-img-dark absolute -top-5 -left-20 w-[400px] max-w-none" />
        </>
      )}
    </div>
  );
}

export function BlogIndex() {
  const [cat, setCat] = useState<"All" | Cat>("All");
  const list = POSTS.filter((p) => cat === "All" || p.cat === cat);
  return (
    <>
      <section className="container-x flex flex-col items-center gap-4 pt-[clamp(112px,10vw,184px)] pb-16 text-center">
        <Reveal y={8}>
          <div className="eyebrow tracking-[0.08em]">BLOG</div>
        </Reveal>
        <SplitText as="h1" immediate delay={0.1} text="Notes from the workbench." className="max-w-[900px] text-[clamp(40px,4.44vw,64px)] leading-[1.03] tracking-[-0.04em] text-fg" />
        <Reveal delay={0.3}>
          <p className="max-w-[620px] text-[clamp(17px,1.39vw,20px)] leading-[1.5] text-muted">How we build Puku, what we learned shipping it, and guides for working with agents.</p>
        </Reveal>
        <Reveal delay={0.4} className="flex flex-wrap justify-center gap-2 pt-4">
          {(["All", "Product", "Engineering", "Guides"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`relative rounded-control border px-3 py-[7px] text-[14px] leading-[18px] transition-colors ${cat === c ? "border-transparent text-fg" : "border-line text-muted hover:border-selected hover:text-fg"}`}
            >
              {cat === c && <motion.span layoutId="blog-cat" className="absolute inset-0 rounded-control bg-selected" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
              <span className="relative">{c}</span>
            </button>
          ))}
        </Reveal>
      </section>

      {(cat === "All" || cat === "Product") && (
        <section className="container-x pb-24">
          <Link href="/blog/designing-a-readable-sandbox" className="group/feat flex flex-col gap-7">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative h-[clamp(260px,33.3vw,480px)] overflow-hidden rounded-panel border border-line bg-sidebar transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/feat:-translate-y-1"
            >
              <div className="absolute inset-x-[5.5%] -top-10 bottom-0 opacity-[0.35]">
                <PixelCanvas name="shader" mode="wave" fit="cover" align="top" className="size-full" />
              </div>
            </motion.div>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-20">
              <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[640px]">
                <span className="font-mono text-[12px] leading-4 tracking-[0.08em] text-muted">PRODUCT · OCT 9 · 6 MIN</span>
                <h2 className="text-[clamp(32px,3.06vw,44px)] leading-[1.136] tracking-[-0.035em] text-fg transition-colors group-hover/feat:text-accent">Designing a sandbox you can actually read</h2>
              </div>
              <div className="flex flex-col gap-5 lg:pt-7">
                <p className="text-[17px] leading-[26px] text-muted">How we turned four config files and a wall of flags into one table, and why the agent now explains every permission it asks for.</p>
                <span className="text-[15px] leading-[18px] text-accent">
                  Read post <span className="inline-block transition-transform group-hover/feat:translate-x-1">→</span>
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      <section className="border-t border-line pt-24 pb-[clamp(72px,8.3vw,120px)]">
        <div className="container-x flex flex-col gap-10 lg:flex-row lg:gap-20">
          <Reveal className="flex w-full shrink-0 flex-col gap-3 lg:w-[360px]">
            <div className="eyebrow tracking-[0.08em]">ALL POSTS</div>
            <h2 className="text-[clamp(32px,3.06vw,44px)] leading-[1.136] tracking-[-0.035em] text-fg">Recently written.</h2>
            <p className="text-[15px] leading-[22px] text-muted">One post every couple of weeks. RSS available.</p>
          </Reveal>
          <div className="flex grow flex-col border-t border-line">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((p, i) => (
                <motion.div layout key={p.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.06, ease: EASE }}>
                  <Link href={`/blog/${p.slug}`} className="group/post flex flex-col gap-4 border-b border-line py-6 sm:flex-row sm:items-center sm:gap-7">
                    <Thumb cover={p.cover} />
                    <div className="flex grow flex-col gap-1.5">
                      <span className="text-[20px] leading-[27px] tracking-[-0.01em] text-fg transition-colors group-hover/post:text-accent">{p.title}</span>
                      <span className="text-[15px] leading-[22px] text-muted">{p.dek}</span>
                    </div>
                    <span className="w-30 shrink-0 font-mono text-[12px] leading-4 whitespace-pre-line text-muted sm:text-right">
                      {p.cat.toUpperCase()}
                      {"\n"}
                      {p.date.toUpperCase()}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Post ─────────────────────────────────────────────── */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return <motion.div style={{ scaleX: x }} className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent" />;
}

const SANDBOX = [
  "› /sandbox",
  "",
  "  read     ./**                       allow",
  "  write    ./src/** ./tests/**        allow",
  "  write    everything else            ask",
  "  network  *.npmjs.org                allow",
  "  network  everything else            ask",
  "  shell    pnpm test, pnpm lint       allow",
];

export function Post({ title, dek, cat, date }: { title: string; dek: string; cat: string; date: string }) {
  return (
    <article>
      <ReadingProgress />
      <header className="mx-auto flex max-w-[752px] flex-col gap-5 px-4 pt-[clamp(112px,10vw,144px)] pb-10">
        <Reveal y={8}>
          <Link href="/blog" className="font-mono text-[12px] leading-4 text-muted transition-colors hover:text-accent">
            ← Blog · {cat.toUpperCase()} · {date} · 6 MIN READ
          </Link>
        </Reveal>
        <SplitText as="h1" immediate delay={0.1} text={title} className="text-[clamp(38px,3.61vw,52px)] leading-[1.12] font-[570] tracking-[-0.04em] text-fg" />
        <Reveal delay={0.3}>
          <p className="text-[20px] leading-[30px] text-muted">{dek}</p>
        </Reveal>
        <Reveal delay={0.4} className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-hover text-[12px] text-fg">P</span>
          <span className="flex flex-col">
            <span className="text-[14px] leading-[18px] text-fg">Puku team</span>
            <span className="text-[13px] leading-4 text-muted">Engineering</span>
          </span>
        </Reveal>
      </header>
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="relative mx-auto h-[clamp(240px,33.3vw,480px)] max-w-[1120px] overflow-hidden rounded-panel border border-line bg-sidebar"
        >
          <div className="absolute inset-0 opacity-40">
            <PixelCanvas name="shader" mode="wave" fit="cover" align="center" className="size-full" />
          </div>
        </motion.div>
      </div>
      <div className="mx-auto flex max-w-[752px] flex-col gap-6 px-4 pt-[72px] pb-24 text-[18px] leading-[31px] text-fg">
        <Reveal>
          <p>
            The first version of the Puku sandbox was safe, but nobody could tell what it allowed. Paths lived in one file, network rules in another, and shell allowlists in a third. When the agent asked for permission, people said yes without knowing what they were agreeing to.
          </p>
        </Reveal>
        <Reveal>
          <h2 className="pt-4 text-[28px] leading-[34px] font-[570] tracking-[-0.02em]">One table, three questions</h2>
        </Reveal>
        <Reveal>
          <p>We reduced every rule to three questions: what can it read, what can it write, and what can it run. /sandbox now answers all three at once.</p>
        </Reveal>
        <div className="overflow-x-auto rounded-panel border border-line bg-panel px-6 py-5" data-lenis-prevent>
          <pre className="font-mono text-[13px] leading-[22px]">
            {SANDBOX.map((l, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, ease: EASE }}>
                {l.endsWith("allow") ? (
                  <>
                    {l.slice(0, -5)}
                    <span className="text-success">allow</span>
                  </>
                ) : l.endsWith("ask") ? (
                  <>
                    {l.slice(0, -3)}
                    <span className="text-warning">ask</span>
                  </>
                ) : (
                  l || " "
                )}
              </motion.div>
            ))}
          </pre>
        </div>
        <Reveal>
          <blockquote className="border-l-2 border-accent py-2 pl-6 text-[24px] leading-[34px] tracking-[-0.02em]">
            If a person can&apos;t explain a permission back to you, it isn&apos;t a permission. It&apos;s a hope.
          </blockquote>
        </Reveal>
        <Reveal>
          <p>The agent now says why it needs each permission, in one line, before it asks. You approve less on autopilot, and roll back less afterwards.</p>
        </Reveal>
      </div>
      <section className="border-t border-line py-24">
        <div className="container-x flex flex-col gap-10 lg:flex-row lg:justify-between">
          <Reveal className="flex w-[280px] shrink-0 flex-col gap-3">
            <div className="eyebrow tracking-[0.08em]">KEEP READING</div>
            <h2 className="text-[clamp(32px,2.5vw,36px)] leading-[1.17] font-[570] tracking-[-0.02em] text-fg">More from the blog.</h2>
            <TextLink href="/blog" className="text-[15px]">All posts</TextLink>
          </Reveal>
          <div className="flex w-full flex-col border-t border-line lg:w-[760px]">
            {POSTS.slice(0, 3).map((p, i) => (
              <motion.div key={p.slug} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link href={`/blog/${p.slug}`} className="group/rp flex flex-wrap items-center gap-x-6 gap-y-1 border-b border-line py-5">
                  <span className="w-[120px] shrink-0 font-mono text-[12px] leading-4 text-muted">{p.cat.toUpperCase()}</span>
                  <span className="grow text-[18px] leading-[22px] text-fg transition-[color,transform] duration-300 group-hover/rp:translate-x-1 group-hover/rp:text-accent">{p.title}</span>
                  <span className="font-mono text-[12px] leading-4 text-muted">{p.date}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
