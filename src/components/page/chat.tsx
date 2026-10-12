"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Reveal, Stagger } from "@/components/fx/reveal";

const MODES = [
  {
    name: "Quick",
    tag: "~2s",
    body: "Fast answers for syntax, errors and everyday questions.",
    icon: <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />,
    ms: 1200,
  },
  {
    name: "Research",
    tag: "DEFAULT",
    body: "Searches the web and your project, cites every claim, flags what it couldn't verify.",
    icon: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
      </>
    ),
    ms: 2600,
  },
  {
    name: "Deep",
    tag: "minutes",
    body: "Long investigations. Leaves a written report and a task list for the CLI.",
    icon: <path d="M12 18V5M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5M17.997 5.125a4 4 0 0 1 2.526 5.77M18 18a4 4 0 0 0 2-7.464M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517M6 18a4 4 0 0 1-2-7.464M6.003 5.125a4 4 0 0 0-2.526 5.77" />,
    ms: 4200,
  },
];

export function Modes() {
  const [sel, setSel] = useState(1);
  const [run, setRun] = useState(0);
  return (
    <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3" itemClassName="flex" y={24}>
      {MODES.map((m, i) => (
        <button
          key={m.name}
          onClick={() => (setSel(i), setRun((r) => r + 1))}
          className={`group/mode relative flex w-full flex-col gap-6 overflow-hidden rounded-panel border bg-panel p-8 text-left transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 ${
            sel === i ? "border-fg shadow-[0_18px_40px_-28px_rgb(40_44_34/0.5)]" : "border-line hover:border-selected"
          }`}
        >
          <span className="flex items-center justify-between">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-fg transition-transform duration-500 group-hover/mode:scale-110">
              {m.icon}
            </svg>
            <span className={`font-mono text-[11px] leading-[14px] ${m.tag === "DEFAULT" ? "text-accent" : "text-muted"}`}>{m.tag}</span>
          </span>
          <span className="flex flex-col gap-1.5">
            <span className="text-[20px] leading-6 font-[570] text-fg">{m.name}</span>
            <span className="text-[15px] leading-[22px] text-muted">{m.body}</span>
          </span>
          {sel === i && (
            <span className="absolute inset-x-0 bottom-0 h-[3px] bg-hover">
              <motion.span key={run} className="block h-full bg-accent" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: m.ms / 1000, ease: "easeInOut" }} />
            </span>
          )}
        </button>
      ))}
    </Stagger>
  );
}

const FLOW = [
  { n: "01", t: "Research", s: "Cited sources" },
  { n: "02", t: "Design", s: "Artifacts & specs" },
  { n: "03", t: "Development", s: "Send to CLI" },
  { n: "04", t: "Deployment", s: "Ship the PR" },
];

export function Handoff() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % FLOW.length), 1400);
    return () => clearInterval(t);
  }, [paused]);
  return (
    <section className="container-x pb-[clamp(72px,8.3vw,120px)]">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-20">
        <Reveal className="flex w-full shrink-0 flex-col gap-3 lg:w-[420px]">
          <div className="eyebrow tracking-[0.08em]">CONNECTED WORKFLOWS</div>
          <h2 className="text-[clamp(30px,2.5vw,36px)] leading-[1.17] font-[570] tracking-[-0.02em] text-fg">From answer to pull request.</h2>
          <p className="text-[16px] leading-6 text-muted">Send to CLI turns the conversation into a task with the context attached. Nothing to copy, nothing to re-explain.</p>
        </Reveal>
        <div className="relative grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4" onMouseLeave={() => setPaused(false)}>
          {FLOW.map((f, i) => (
            <motion.button
              key={f.n}
              onMouseEnter={() => (setPaused(true), setStep(i))}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative flex flex-col gap-2.5 rounded-panel border bg-panel p-5 text-left transition-colors duration-300 ${i === step ? "border-fg" : i < step ? "border-selected" : "border-line"}`}
            >
              <span className={`font-mono text-[12px] leading-4 transition-colors ${i <= step ? "text-accent" : "text-muted"}`}>{i < step ? "✓" : f.n}</span>
              <span className="text-[18px] leading-[22px] text-fg">{f.t}</span>
              <span className="text-[14px] leading-5 text-muted">{f.s}</span>
              {i === step && <motion.span layoutId="flow-dot" className="absolute top-4 right-4 size-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

const ic = (d: React.ReactNode) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

export function PrivacyRow() {
  const items = [
    { i: ic(<><rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>), t: "Not used for training", b: "Your chats and code stay yours." },
    { i: ic(<path d="M10 11v6M14 11v6M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />), t: "Delete any time", b: "One chat or your whole history." },
    { i: ic(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>), t: "Shared projects", b: "Invite your team to a project's chats on Team plans." },
  ];
  return (
    <section className="grid grid-cols-1 gap-px border-y border-line bg-line md:grid-cols-3">
      {items.map((x, k) => (
        <Reveal key={x.t} delay={k * 0.08} className="group/pv flex flex-col gap-2 bg-main p-10 transition-colors hover:bg-sidebar">
          <span className="text-fg transition-transform duration-500 group-hover/pv:-translate-y-0.5 group-hover/pv:text-accent">{x.i}</span>
          <span className="text-[16px] leading-5 font-[570] text-fg">{x.t}</span>
          <span className="text-[14px] leading-[21px] text-muted">{x.b}</span>
        </Reveal>
      ))}
    </section>
  );
}
