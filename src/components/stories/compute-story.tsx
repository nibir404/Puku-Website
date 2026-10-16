"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CountUp, EASE, Reveal, SplitText } from "@/components/fx/reveal";
import { IsoArt } from "@/components/stories/iso-art";
import { buttonClass } from "@/components/ui/button";
import { Chapter, ChapterNav } from "@/components/stories/chapter-nav";

/* "Every model starts with compute." Six chapters, in the order of the Paper story artboard. */

const CHAPTERS = [
  { id: "news", title: "The news" },
  { id: "models", title: "The models" },
  { id: "compute", title: "The compute" },
  { id: "ecosystem", title: "The ecosystem" },
  { id: "numbers", title: "By the numbers" },
  { id: "next", title: "What's next" },
];

const MODELS = [
  { id: "puku-ai", cat: "GENERAL PURPOSE", name: "puku-ai-2.9", body: "General-purpose LLM." },
  { id: "feluda", cat: "CYBERSECURITY", name: "feluda-1.0", body: "Security-domain model." },
];

const STEPS = [
  { tag: "DEVELOP", body: "Train and fine-tune new models without rationing GPU hours." },
  { tag: "DEPLOY", body: "Ship models to production infrastructure that scales with use." },
  { tag: "TEST", body: "Run evals and research experiments, then do it again." },
];

const PARTNERS = [
  { id: "lambda", name: "Lambda", perk: "$1,000 cloud credits" },
  { id: "bria", name: "Bria", perk: "$1,200 off AI solution" },
  { id: "nebius", name: "Nebius", perk: "$5,000 + $150K GPU savings" },
  { id: "scaleway", name: "Scaleway", perk: "€40,000 cloud credits" },
];

const STATS = [
  { prefix: "$", to: 100, suffix: "K", label: "AWS credits, incl. GPUs", accent: true },
  { prefix: "$", to: 150, suffix: "K", label: "GPU savings via Nebius" },
  { prefix: "", to: 4, suffix: "", label: "Ecosystem partners" },
  { prefix: "", to: 2, suffix: "", label: "Core models, two domains" },
];

const pad = "py-[clamp(80px,8.3vw,120px)]";
const chapterTag = "eyebrow tracking-[0.08em]";
const h2 = "text-[clamp(36px,3.89vw,56px)] leading-[1.1] font-[570] tracking-[-0.035em] text-fg";

export function ComputeStory() {
  return (
    <>
      <Prologue />
      <ChapterNav chapters={CHAPTERS} />
      <News />
      <Models />
      <Compute />
      <Ecosystem />
      <Numbers />
      <Next />
    </>
  );
}

function Prologue() {
  return (
    <section className="container-x flex items-end justify-between gap-10 pt-[clamp(120px,12.5vw,180px)] pb-[clamp(56px,6.67vw,96px)]">
      <div className="flex max-w-[860px] flex-col gap-7">
        <Reveal y={8}>
          <div className="eyebrow tracking-[0.08em]">MILESTONES · A SHORT STORY IN SIX CHAPTERS</div>
        </Reveal>
        <SplitText as="h1" immediate delay={0.1} text="Every model starts with compute." className="text-[clamp(48px,6.67vw,96px)] leading-[1.04] font-[570] tracking-[-0.04em] text-fg" />
        <Reveal delay={0.45}>
          <p className="max-w-[560px] text-[clamp(17px,1.32vw,19px)] leading-[1.58] text-muted">
            This is how a small team got the compute, the partners and the backing to build its own models. Scroll — it only takes a minute.
          </p>
        </Reveal>
      </div>
      <div aria-hidden className="hidden flex-col items-center gap-3 pb-2 md:flex">
        <span className="flex h-9 w-[22px] justify-center rounded-[12px] border border-line pt-[7px]">
          <motion.span animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} className="block h-2 w-1 rounded-sm bg-accent" />
        </span>
        <span className="font-mono text-[12px] tracking-[0.08em] text-muted">SCROLL</span>
      </div>
    </section>
  );
}

function News() {
  return (
    <Chapter id="news" className={`overflow-hidden bg-sidebar ${pad}`}>
      <div className="container-x flex flex-col items-center gap-10 lg:flex-row lg:gap-6">
        <div className="flex flex-col gap-7 lg:w-[560px] lg:shrink-0">
          <Reveal y={8}>
            <div className={chapterTag}>CHAPTER 01 → THE NEWS</div>
          </Reveal>
          <SplitText text="Puku AI is now part of NVIDIA Inception." className={h2} />
          <Reveal delay={0.2}>
            <p className="max-w-[520px] text-[clamp(17px,1.32vw,19px)] leading-[1.58] text-muted">NVIDIA&apos;s program for AI startups — and the moment our roadmap got a lot more ambitious.</p>
          </Reveal>
        </div>
        <IsoArt name="inception" label="Puku cubes route into a platform where a pixel P stands, linked to an NVIDIA block" className="w-full max-w-[820px] grow" />
      </div>
    </Chapter>
  );
}

function Models() {
  const [active, setActive] = useState(MODELS[0].id);
  return (
    <Chapter id="models" className={pad}>
      <div className="container-x flex flex-col items-center gap-12 lg:flex-row lg:justify-between">
        <IsoArt name="models" active={active} label="A stacked tower for puku-ai-2.9 next to the feluda-1.0 block" className="w-full max-w-[640px]" />
        <div className="flex w-full flex-col gap-7 lg:w-[560px] lg:shrink-0">
          <Reveal y={8}>
            <div className={chapterTag}>CHAPTER 02 → WHAT WE&apos;RE BUILDING</div>
          </Reveal>
          <SplitText text="Core models across domains." className={h2} />
          <Reveal delay={0.15}>
            <p className="text-[18px] leading-7 text-muted">Two models, built for different jobs. Tap one to meet it.</p>
          </Reveal>
          <Reveal delay={0.25} className="flex flex-col gap-3 pt-2">
            <div role="tablist" aria-label="Models" className="flex flex-col gap-3">
              {MODELS.map((m, i) => {
                const on = active === m.id;
                return (
                  <motion.button
                    key={m.id}
                    layout
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActive(m.id)}
                    onMouseEnter={() => setActive(m.id)}
                    transition={{ duration: 0.35, ease: EASE }}
                    className={`flex flex-col gap-2.5 rounded-panel border text-left transition-colors ${on ? "border-accent bg-panel p-6" : "border-line px-6 py-5 hover:border-selected"}`}
                  >
                    <span className="flex items-center justify-between font-mono text-[12px] tracking-[0.08em]">
                      <span className={on ? "text-accent" : "text-muted"}>{m.cat}</span>
                      <span className="text-muted">{on ? `0${i + 1} / 02` : "→"}</span>
                    </span>
                    <span className={`font-mono font-[600] text-fg transition-[font-size] ${on ? "text-[30px] leading-[38px]" : "text-[22px] leading-7"}`}>{m.name}</span>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-[16px] leading-6 text-muted">
                          {m.body}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </Chapter>
  );
}

function Compute() {
  const [step, setStep] = useState(0);
  return (
    <Chapter id="compute" className={`relative overflow-hidden bg-sidebar ${pad}`}>
      <div className="container-x relative flex flex-col gap-14">
        <IsoArt name="compute" label="Four GPU racks with blinking lights next to a stack of credit coins" className="pointer-events-none w-full max-w-[640px] self-end lg:absolute lg:-top-6 lg:right-[clamp(16px,2vw,40px)] lg:w-[46%] lg:max-w-[700px]" />
        <div className="flex max-w-[640px] flex-col gap-7">
          <Reveal y={8}>
            <div className={chapterTag}>CHAPTER 03 → WHAT IT UNLOCKS</div>
          </Reveal>
          <SplitText text="GPU credits for model development and research." className={h2} />
        </div>
        <Reveal className="flex flex-wrap items-end gap-x-9 gap-y-3">
          <span className="text-[clamp(96px,13.9vw,200px)] leading-[0.9] font-[570] tracking-[-0.055em] text-accent">
            $<CountUp to={100} duration={1.4} />K
          </span>
          <span className="pb-3 font-mono text-[18px] leading-7 text-fg sm:text-[20px] sm:leading-[30px]">
            in AWS credits,
            <br />
            including GPUs.
          </span>
        </Reveal>
        <div className="relative grid grid-cols-1 border-t border-line md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.tag} delay={i * 0.08}>
              <button
                onMouseEnter={() => setStep(i)}
                onFocus={() => setStep(i)}
                onClick={() => setStep(i)}
                className="relative flex w-full flex-col gap-2.5 py-7 pr-8 text-left"
              >
                {step === i && <motion.span layoutId="step-bar" transition={{ duration: 0.4, ease: EASE }} className="absolute inset-x-0 -top-px h-0.5 bg-accent md:right-8" />}
                <span className={`font-mono text-[12px] tracking-[0.08em] transition-colors ${step === i ? "text-accent" : "text-muted"}`}>
                  0{i + 1} · {s.tag}
                </span>
                <span className={`text-[17px] leading-[26px] transition-colors ${step === i ? "text-fg" : "text-muted"}`}>{s.body}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </Chapter>
  );
}

function Ecosystem() {
  const [active, setActive] = useState<string | undefined>("lambda");
  return (
    <Chapter id="ecosystem" className={pad}>
      <div className="container-x flex flex-col items-center gap-12 lg:flex-row lg:justify-between">
        <div className="flex w-full flex-col gap-7 lg:w-[620px] lg:shrink-0">
          <Reveal y={8}>
            <div className={chapterTag}>CHAPTER 04 → FEATURED BENEFITS</div>
          </Reveal>
          <SplitText text="Compute from across the ecosystem." className={h2} />
          <Reveal delay={0.15}>
            <p className="max-w-[520px] text-[18px] leading-7 text-muted">Inception opened doors to partners across the stack. Hover a partner to see where it plugs in.</p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="overflow-hidden rounded-panel border border-line bg-panel">
              <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="size-2.5 rounded-full bg-[var(--border)]" />
                ))}
                <span className="pl-3 font-mono text-[13px] text-accent">$ puku --benefits</span>
              </div>
              <ul className="flex flex-col p-2" onMouseLeave={() => setActive("lambda")}>
                {PARTNERS.map((p) => {
                  const on = active === p.id;
                  return (
                    <li key={p.id}>
                      <button
                        onMouseEnter={() => setActive(p.id)}
                        onFocus={() => setActive(p.id)}
                        className={`flex w-full flex-wrap justify-between gap-x-4 rounded-control px-3.5 py-3 text-left font-mono text-[15px] transition-colors sm:text-[17px] ${on ? "bg-hover" : ""}`}
                      >
                        <span className="text-fg">{p.name}</span>
                        <span className={on ? "text-accent" : "text-muted"}>{p.perk}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
        <IsoArt name="ecosystem" active={active} label="A Puku hub linked to four partner cubes: Lambda, Bria, Nebius and Scaleway" className="w-full max-w-[620px]" />
      </div>
    </Chapter>
  );
}

function Numbers() {
  return (
    <Chapter id="numbers" className={`bg-sidebar ${pad}`}>
      <div className="container-x flex flex-col gap-14">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="flex max-w-[760px] flex-col gap-6">
            <Reveal y={8}>
              <div className={chapterTag}>CHAPTER 05 → BY THE NUMBERS</div>
            </Reveal>
            <SplitText text="One program. A lot more room to build." className={h2} />
          </div>
          <Reveal delay={0.2}>
            <p className="text-[17px] leading-[26px] text-muted">Everything in this story, on one line.</p>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className={`flex flex-col gap-3 pt-8 pr-6 pb-6 ${i % 2 ? "border-l border-line pl-6" : ""} ${i === 2 ? "lg:border-l lg:pl-6" : ""}`}>
              <span className={`text-[clamp(48px,5vw,72px)] leading-none font-[570] tracking-[-0.05em] ${s.accent ? "text-accent" : "text-fg"}`}>
                {s.prefix}
                <CountUp to={s.to} duration={1.2} />
                {s.suffix}
              </span>
              <span className="font-mono text-[13px] leading-5 text-muted">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </Chapter>
  );
}

function Next() {
  return (
    <Chapter id="next" className={`overflow-hidden ${pad}`}>
      <div className="container-x flex flex-col items-center gap-8 text-center">
        <IsoArt name="next" label="Blocks rising step by step, with dashed future steps ahead" className="w-full max-w-[900px]" />
        <Reveal y={8}>
          <div className={chapterTag}>CHAPTER 06 → WHAT&apos;S NEXT</div>
        </Reveal>
        <SplitText text="More models. More domains. Built faster." className="max-w-[1000px] text-[clamp(44px,5.56vw,80px)] leading-[1.05] font-[570] tracking-[-0.035em] text-fg" />
        <Reveal delay={0.2}>
          <p className="text-[18px] leading-7 text-muted">The story&apos;s still being written. Come build the next chapter with us.</p>
        </Reveal>
        <Reveal delay={0.3} className="flex flex-wrap justify-center gap-3 pt-3">
          <Link href="/download" className={buttonClass("primary", "lg")}>
            Try Puku free
          </Link>
          <Link href="/stories" className={buttonClass("secondary", "lg")}>
            More stories
          </Link>
        </Reveal>
      </div>
    </Chapter>
  );
}
