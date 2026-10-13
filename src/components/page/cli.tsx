"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE, Reveal, Stagger } from "@/components/fx/reveal";
import { Check, Copy } from "@/components/ui/icons";

function CopyBtn({ text, label = "Copy", className = "" }: { text: string; label?: string; className?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 1500);
      }}
      className={`flex shrink-0 items-center gap-1.5 rounded-control border border-line px-3.5 py-2 text-[13px] leading-4 text-muted transition-colors hover:border-selected hover:text-fg active:scale-95 ${className}`}
    >
      {ok ? <Check className="text-success" /> : <Copy />}
      {ok ? "Copied" : label}
    </button>
  );
}

const INSTALL = {
  Native: "curl -fsSL https://puku-cli.pkgs.puku.sh/install.sh | bash",
  npm: "npm install -g @puku/cli",
};

export function InstallTabs() {
  const [tab, setTab] = useState<keyof typeof INSTALL>("Native");
  return (
    <Reveal className="overflow-hidden rounded-panel border border-line bg-panel">
      <div className="flex gap-1 border-b border-line bg-sidebar p-2">
        {(Object.keys(INSTALL) as (keyof typeof INSTALL)[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`relative flex items-center gap-2 rounded-control px-3.5 py-2 text-[14px] leading-[18px] ${tab === t ? "text-fg" : "text-muted hover:text-fg"}`}>
            {tab === t && <motion.span layoutId="install-tab" className="absolute inset-0 rounded-control bg-selected" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
            <span className="relative">{t}</span>
            {t === "Native" && <span className="relative font-mono text-[11px] tracking-[0.08em] text-success">RECOMMENDED</span>}
          </button>
        ))}
      </div>
      <div className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <AnimatePresence mode="wait">
          <motion.code
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="font-mono text-[clamp(13px,1.25vw,18px)] leading-[26px] break-all text-fg"
          >
            <span className="text-muted">$ </span>
            {INSTALL[tab]}
          </motion.code>
        </AnimatePresence>
        <CopyBtn text={INSTALL[tab]} />
      </div>
    </Reveal>
  );
}

/* request → intent/context/complexity/goal → AI system, with a looping packet */
export function RoutingFlow() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 6), 700);
    return () => clearInterval(t);
  }, []);
  const feats = ["intent", "context", "complexity", "goal"];
  return (
    <Reveal className="flex flex-col gap-10 border-t border-line pt-10 lg:flex-row lg:gap-20">
      <div className="flex w-full shrink-0 flex-col gap-2 lg:w-[400px]">
        <p className="text-[22px] leading-8 text-fg">Model routing.</p>
        <p className="text-[18px] leading-7 text-muted">Every request is read for intent, context, complexity and goal, then sent to the AI system that fits.</p>
      </div>
      <div className="flex flex-wrap items-center gap-4 font-mono">
        <span className={`rounded-control border px-[18px] py-3.5 text-[14px] transition-colors duration-300 ${step === 0 ? "border-accent text-accent" : "border-line bg-panel text-fg"}`}>request</span>
        <Arrow on={step === 0 || step === 1} />
        <div className="flex flex-col gap-2">
          {feats.map((f, i) => (
            <motion.span
              key={f}
              animate={{ x: step >= 1 && step <= 4 && step - 1 === i ? 6 : 0 }}
              className={`rounded-control px-3 py-1.5 text-[13px] transition-colors duration-300 ${step >= 1 && step - 1 >= i && step <= 4 ? "bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] text-accent" : "bg-hover text-fg"}`}
            >
              {f}
            </motion.span>
          ))}
        </div>
        <Arrow on={step === 5} />
        <span
          className={`rounded-control border px-[18px] py-3.5 text-[14px] transition-[background-color,border-color,color,box-shadow] duration-300 ${step === 5 ? "border-accent bg-accent text-accent-ink shadow-[0_0_24px_color-mix(in_oklab,var(--accent)_40%,transparent)]" : "border-fg bg-panel text-fg"}`}
        >
          AI system
        </span>
      </div>
    </Reveal>
  );
}
const Arrow = ({ on }: { on: boolean }) => <span className={`text-[14px] transition-colors ${on ? "text-accent" : "text-muted"}`}>→</span>;

/* Four jobs with prompts that type themselves on hover */
export function Jobs({ items }: { items: { title: string; body: string; prompt: string }[] }) {
  return (
    <Stagger className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2" itemClassName="flex" stagger={0.09} y={16}>
      {items.map((j) => (
        <JobItem key={j.title} {...j} />
      ))}
    </Stagger>
  );
}
function JobItem({ title, body, prompt }: { title: string; body: string; prompt: string }) {
  const [n, setN] = useState(prompt.length);
  const [run, setRun] = useState(false);
  useEffect(() => {
    if (!run) return;
    if (n >= prompt.length) return setRun(false);
    const t = setTimeout(() => setN((x) => x + 1), 28);
    return () => clearTimeout(t);
  }, [run, n, prompt.length]);
  return (
    <div onMouseEnter={() => (setN(0), setRun(true))} className="group/job flex w-full flex-col gap-3 border-t border-line pt-6">
      <span className="text-[22px] leading-8 font-[570] tracking-[-0.02em] text-fg">{title}</span>
      <span className="max-w-[520px] text-[17px] leading-[26px] text-muted">{body}</span>
      <span className="w-fit max-w-full rounded-control border border-line bg-sidebar px-2.5 py-1.5 font-mono text-[13px] leading-4 text-fg transition-colors group-hover/job:border-accent/60">
        <span className="text-accent">› </span>
        {prompt.slice(2, Math.max(2, n))}
        <span className={`ml-px inline-block h-3.5 w-[6px] translate-y-[2px] bg-accent ${run ? "" : "animate-[blink_1s_steps(1)_infinite] opacity-0 group-hover/job:opacity-100"}`} />
      </span>
    </div>
  );
}

/* Slash commands + config */
const SLASH = [
  ["/sandbox", "what the agent can touch"],
  ["/permissions", "allow, ask or deny per tool"],
  ["/plan", "think first, edit later"],
  ["/memory", "read or edit PUKU.md"],
  ["/skills", "list and run saved skills"],
  ["/feedback", "send a report with logs"],
  ["/release-notes", "what changed in this version"],
];
const CONFIG = `model = "puku-ai-2.7"

[sandbox]
enabled = true
network = "ask"

[permissions]
write = { allow = ["src/**", "tests/**"] }
shell = { allow = ["pnpm test", "pnpm lint"] }

[memory]
file = "PUKU.md"`;

export function DevPanels() {
  const [q, setQ] = useState("");
  const list = SLASH.filter(([c, d]) => (c + d).includes(q.replace(/^\//, "")));
  return (
    <Stagger className="flex flex-col gap-4 lg:flex-row" itemClassName="flex flex-1 basis-0" y={24}>
      <div className="flex w-full flex-col gap-5 rounded-panel border border-line bg-panel p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[12px] tracking-[0.08em] text-muted">SLASH COMMANDS</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="/ filter"
            className="w-28 rounded-control border border-line bg-main px-2 py-1 font-mono text-[12px] text-fg outline-none placeholder:text-muted focus:border-accent"
          />
        </div>
        <div className="flex flex-col font-mono text-[14px] leading-[30px]">
          <AnimatePresence initial={false}>
            {list.map(([c, d]) => (
              <motion.div
                layout
                key={c}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="group/sc -mx-2 flex gap-4 rounded-control px-2 transition-colors hover:bg-hover"
              >
                <span className="w-[136px] shrink-0 text-fg group-hover/sc:text-accent">{c}</span>
                <span className="truncate text-muted">{d}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {!list.length && <span className="text-muted">No command matches — try /help</span>}
        </div>
      </div>
      <div className="flex w-full flex-col gap-5 rounded-panel border border-line bg-panel p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[12px] tracking-[0.08em] text-muted">.puku/config.toml</span>
          <CopyBtn text={CONFIG} className="border-transparent px-2 py-1 text-[12px]" />
        </div>
        <pre className="overflow-x-auto font-mono text-[14px] leading-6" data-lenis-prevent>
          {CONFIG.split("\n").map((l, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.035, ease: EASE }}>
              {l.startsWith("[") ? (
                <span className="text-accent">{l}</span>
              ) : l.includes("=") ? (
                <>
                  <span className="text-fg">{l.split("=")[0]}</span>
                  <span className="text-muted">=</span>
                  <span className="text-[color-mix(in_oklab,var(--success)_85%,var(--text))]">{l.split("=").slice(1).join("=")}</span>
                </>
              ) : (
                l || " "
              )}
            </motion.div>
          ))}
        </pre>
      </div>
    </Stagger>
  );
}
