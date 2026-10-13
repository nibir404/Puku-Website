"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EASE, TiltCard } from "@/components/fx/reveal";
import { Logo } from "@/components/ui/logo";

const draw = (delay = 0, duration = 1.2) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, amount: 0.6 },
  transition: { pathLength: { delay, duration, ease: EASE }, opacity: { delay, duration: 0.2 } },
});
const pop = (delay = 0) => ({
  initial: { scale: 0, opacity: 0 },
  whileInView: { scale: 1, opacity: 1 },
  viewport: { once: true, amount: 0.6 },
  transition: { delay, type: "spring" as const, stiffness: 420, damping: 30 },
});
const rise = (delay = 0, y = 12) => ({
  initial: { y, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, amount: 0.6 },
  transition: { delay, duration: 0.6, ease: EASE },
});

function Card({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <TiltCard max={2.5} className="flex-1 basis-0 rounded-panel">
      <div className="flex h-full flex-col gap-5 rounded-panel border border-line bg-panel px-2.5 pt-2.5 pb-7 transition-[border-color,box-shadow] duration-300 hover:border-selected hover:shadow-[0_18px_40px_-20px_rgb(40_44_34/0.25)]">
        <div className="relative h-[260px] shrink-0 overflow-hidden rounded-panel">{children}</div>
        <div className="flex flex-col gap-2 px-[18px]">
          <h3 className="text-[22px] leading-7 font-[570] text-fg">{title}</h3>
          <p className="text-[15px] leading-[23px] text-muted">{body}</p>
        </div>
      </div>
    </TiltCard>
  );
}

/* Plan before it edits */
export function PlanCard() {
  return (
    <Card title="Plan before it edits" body="Puku proposes steps first. Reorder, cut or approve the plan, then let it run.">
      <div className="dot-grid absolute inset-0" />
      <svg viewBox="0 0 640 260" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <motion.path {...draw(0.4, 0.5)} d="M260 130 H380" fill="none" stroke="var(--border)" strokeDasharray="3 4" />
        <motion.path {...draw(0.4, 0.5)} d="M260 90 V60" fill="none" stroke="var(--border)" strokeDasharray="3 4" />
        <motion.path {...draw(0.1, 1.6)} d="M120 200 V150 Q120 130 140 130 H260 V90 H380 V130 H500" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
        <motion.circle {...pop(0.1)} cx="120" cy="200" r="4" fill="var(--accent)" />
        <motion.circle {...pop(0.6)} cx="260" cy="130" r="4" fill="var(--border)" />
        <motion.circle {...pop(0.95)} cx="380" cy="90" r="4" fill="var(--accent)" />
        <motion.circle {...pop(1.2)} cx="380" cy="130" r="4" fill="var(--border)" />
        <motion.circle {...pop(1.6)} cx="500" cy="130" r="6" fill="var(--accent)" stroke="var(--panel)" strokeWidth="3" />
        <motion.g initial={{ x: 40, y: 40, opacity: 0 }} whileInView={{ x: 0, y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.7, duration: 0.8, ease: EASE }}>
          <path d="M512 140 l10 22 3 -9 9 -3 z" fill="var(--text)" />
        </motion.g>
      </svg>
      <motion.div {...rise(0.3)} className="absolute top-10 left-[62.5%] flex items-center gap-2 rounded-control bg-raised py-1.5 pr-2 pl-3 shadow-[0_2px_8px_rgb(40_44_34/0.08)] max-sm:left-auto max-sm:right-4">
        <span className="text-[13px] leading-4 whitespace-nowrap text-fg">Plan · auth refactor</span>
        <span className="grid size-[18px] place-items-center rounded-full bg-hover text-[12px] text-muted">+</span>
      </motion.div>
      <motion.div {...pop(0.5)} className="absolute top-[108px] left-[36.9%] grid size-12 place-items-center rounded-panel bg-raised shadow-[0_4px_12px_color-mix(in_oklab,var(--accent)_18%,transparent)]">
        <svg width="20" height="20" viewBox="0 0 24 24" className="animate-pulse">
          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
      <div className="absolute bottom-5 left-[23.4%] flex gap-2.5">
        {[0, 1, 2].map((i) => (
          <motion.div key={i} {...rise(0.8 + i * 0.12)} className="grid h-[26px] w-[72px] place-items-center rounded-[8px] bg-raised shadow-[0_2px_6px_rgb(40_44_34/0.06)]">
            <motion.div
              className={`h-0.5 w-9 origin-left ${i === 0 ? "bg-fg" : "bg-line"}`}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1 + i * 0.12, duration: 0.5, ease: EASE }}
            />
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

/* Remembers what matters */
export function MemoryCard() {
  return (
    <Card title="Remembers what matters" body="Decisions land in PUKU.md, so the next agent starts where the last one stopped.">
      <div className="absolute inset-0 flex justify-center bg-sidebar">
        <svg viewBox="0 0 360 230" className="absolute -top-3 left-1/2 w-[360px] -translate-x-1/2">
          <circle cx="180" cy="190" r="170" fill="none" stroke="var(--hover)" strokeWidth="14" />
          <motion.path {...draw(0.2, 1.6)} d="M14 170 A170 170 0 0 1 300 60" fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" />
          <motion.circle
            cx="180"
            cy="190"
            r="110"
            fill="var(--panel)"
            opacity={0.7}
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ transformOrigin: "180px 190px" }}
          />
          <circle cx="180" cy="190" r="70" fill="var(--raised)" />
          {/* orbiting note */}
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "180px 190px" }}>
            <circle cx="180" cy="80" r="3" fill="var(--accent)" />
          </motion.g>
        </svg>
        <motion.div
          {...pop(0.4)}
          className="absolute top-32 left-[calc(50%-30px)] grid size-15 place-items-center rounded-full bg-accent shadow-[0_8px_20px_color-mix(in_oklab,var(--accent)_35%,transparent)]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-ink)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
            <path d="M14 2v5h6" />
          </svg>
        </motion.div>
        <div className="absolute bottom-[18px] flex gap-6 font-mono text-[12px] leading-4">
          <motion.span {...rise(0.9, 8)} className="text-muted">
            ↓ read · 14 notes
          </motion.span>
          <motion.span {...rise(1.05, 8)} className="text-fg">
            ↑ write · PUKU.md
          </motion.span>
        </div>
      </div>
    </Card>
  );
}

/* Permissions you can read */
export function PermissionsCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const rows = [
    { k: "write", v: "● ALLOW", c: "text-success" },
    { k: "shell", v: "● ASK", c: "text-warning" },
    { k: "network", v: "○ OFF", c: "text-muted" },
  ];
  return (
    <Card title="Permissions you can read" body="Allow, ask or deny per tool and per project. /sandbox shows it all in one view.">
      <div ref={ref} className="absolute inset-0 bg-sidebar">
        <motion.div {...rise(0.1)} className="absolute top-[22px] left-5 flex items-center gap-3.5 rounded-[10px] bg-raised px-3 py-2 shadow-[0_2px_8px_rgb(40_44_34/0.06)]">
          <span className="text-[13px] leading-4 text-fg">Last approval</span>
          <span className="text-[13px] leading-4 text-muted">2m ago</span>
        </motion.div>
        <motion.div {...rise(0.25)} className="absolute top-[78px] left-5 flex flex-col gap-2 rounded-[10px] bg-raised p-3 shadow-[0_2px_8px_rgb(40_44_34/0.06)]">
          {rows.map((r, i) => (
            <motion.div key={r.k} {...rise(0.4 + i * 0.1, 6)} className="flex justify-between gap-8">
              <span className="font-mono text-[12px] leading-4 text-fg">{r.k}</span>
              <span className={`rounded-control bg-hover px-2 py-px font-mono text-[11px] leading-[14px] ${r.c}`}>{r.v}</span>
            </motion.div>
          ))}
        </motion.div>
        <svg viewBox="0 0 610 260" preserveAspectRatio="xMaxYMid meet" className="absolute inset-y-0 right-0 h-full max-sm:opacity-40">
          <path d="M328.0 232.0 A92 92 0 0 1 512.0 232.0" fill="none" stroke="var(--hover)" strokeWidth="28" />
          <motion.path {...draw(0.3, 0.5)} d="M328 232 A92 92 0 0 1 385.5 146.7" fill="none" stroke="var(--selected)" strokeWidth="28" />
          <motion.path {...draw(0.75, 0.5)} d="M388.5 145.5 A92 92 0 0 1 451.5 145.5" fill="none" stroke="var(--accent)" strokeWidth="28" />
          <motion.path {...draw(1.2, 0.4)} d="M454.5 146.7 A92 92 0 0 1 490.5 172.9" fill="none" stroke="var(--accent-soft)" strokeWidth="28" />
          <motion.g
            initial={{ rotate: -144 }}
            animate={inView ? { rotate: [-144, 6, -4, 0] } : {}}
            transition={{ delay: 0.5, duration: 1.8, ease: EASE, times: [0, 0.6, 0.8, 1] }}
            style={{ transformOrigin: "420px 232px" }}
          >
            <path d="M420 232 L465.8 168.9" fill="none" stroke="var(--text)" strokeWidth="3" strokeLinecap="round" />
          </motion.g>
          <circle cx="420" cy="232" r="9" fill="var(--text)" stroke="var(--sidebar)" strokeWidth="3" />
        </svg>
      </div>
    </Card>
  );
}

/* From question to pull request */
export function ChatCard() {
  return (
    <Card title="From question to pull request" body="Ask in Chat, hand it to the CLI, review the PR. Context travels with it.">
      <div className="absolute inset-0 flex flex-col gap-3 bg-sidebar px-5 pt-7 sm:px-10">
        <motion.div {...rise(0.1)} className="flex items-center gap-2.5 self-start rounded-t-panel rounded-br-panel rounded-bl-[4px] border border-line bg-panel px-3.5 py-2.5">
          <span className="text-[11px] leading-[14px] text-muted">You</span>
          <span className="text-[13px] leading-4 text-fg">Tests fail on CI but pass locally. Why?</span>
        </motion.div>
        <div className="relative self-end">
          <motion.div
            initial={{ opacity: 1 }}
            whileInView={{ opacity: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 1.1, duration: 0.2 }}
            className="absolute right-0 flex gap-1 rounded-panel border border-line bg-panel px-3 py-3"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="size-1.5 rounded-full bg-muted"
                animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15 }}
              />
            ))}
          </motion.div>
          <motion.div
            {...rise(1.2)}
            className="flex w-[320px] max-w-full items-start gap-2.5 rounded-t-panel rounded-br-[4px] rounded-bl-panel border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-panel px-3.5 py-2.5 shadow-[0_8px_24px_color-mix(in_oklab,var(--accent)_7%,transparent)]"
          >
            <span className="grid size-[22px] shrink-0 place-items-center rounded-control bg-fg">
              <span className="invert dark:invert-0">
                <Logo size={12} />
              </span>
            </span>
            <span className="text-[13px] leading-[18px] text-fg">CI uses Node 20. Your lockfile pins a Node 22 API. Want me to fix it?</span>
          </motion.div>
        </div>
        <motion.div {...rise(1.8)} className="flex items-center gap-2.5 self-start rounded-t-panel rounded-br-panel rounded-bl-[4px] border border-line bg-panel px-3.5 py-2.5">
          <span className="text-[11px] leading-[14px] text-muted">You</span>
          <span className="text-[13px] leading-4 text-fg">Yes. Open a PR.</span>
        </motion.div>
        <motion.div
          {...pop(2.4)}
          className="flex items-center gap-2 self-end rounded-[8px] border border-[color-mix(in_oklab,var(--success)_25%,transparent)] bg-[color-mix(in_oklab,var(--success)_8%,transparent)] px-3 py-2 text-[12px] leading-4 text-success"
        >
          ↗ PR #214 opened · fix/node-engines
        </motion.div>
      </div>
    </Card>
  );
}
