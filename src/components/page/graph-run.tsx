"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE, Reveal } from "@/components/fx/reveal";

/*
 * Puku Graph, live: three stage cards run left → right on a loop.
 * Each stage takes STAGE ticks (rows land one per tick, then it reports done),
 * then the finished state holds before restarting. Pauses whenever off-screen.
 */

const TICK = 320; // ms
const STAGE = 7; // ticks per stage
const HOLD = 9; // ticks to hold the finished state
const LOOP = STAGE * 3 + HOLD;

type Row = { tag?: string; main: string; side?: string; score?: number };

const STAGES: { title: string; body: string; time: string; running: string; rows: Row[]; foot: [string, string] }[] = [
  {
    title: "Seed search",
    body: "Symbols, stack traces and file hints pick the starting points.",
    time: "180ms",
    running: "searching…",
    rows: [
      { tag: "SYMBOL", main: "SESSION_TTL", side: "config/ttl.ts" },
      { tag: "TRACE", main: "refreshSession()", side: "session.ts:42" },
      { tag: "FILE", main: "auth/middleware.ts", side: "open tab" },
    ],
    foot: ["3 seeds", "from 1,284 files"],
  },
  {
    title: "Dependency graph",
    body: "Imports, calls and inheritance map how the code connects.",
    time: "420ms",
    running: "mapping…",
    rows: [
      { tag: "IMPORTS", main: "session.ts → ttl.ts" },
      { tag: "CALLS", main: "middleware → refreshSession" },
      { tag: "READS", main: "session.ts → redis.client.ts" },
    ],
    foot: ["14 nodes · 21 edges", "depth 2"],
  },
  {
    title: "Focused context",
    body: "Ranking and summaries keep only what the fix needs.",
    time: "610ms",
    running: "ranking…",
    rows: [
      { main: "config/ttl.ts", score: 0.94 },
      { main: "session.ts", score: 0.91 },
      { main: "auth/middleware.ts", score: 0.78 },
    ],
    foot: ["6 files kept", ""],
  },
];

const STATUS = ["Searching for seeds…", "Mapping dependencies…", "Ranking context…"];

export function GraphRun() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setT((v) => (v + 1) % LOOP), TICK);
    return () => clearInterval(id);
  }, [inView, reduce]);

  // Reduced motion: show the finished run, no loop.
  const tick = reduce ? LOOP - 1 : t;
  const stage = Math.min(Math.floor(tick / STAGE), 3); // 3 = all done
  const local = tick % STAGE;
  const done = stage === 3;

  return (
    <Reveal>
      <div ref={ref} className="overflow-hidden rounded-panel border border-line bg-sidebar">
        <div className="flex flex-col gap-3 border-b border-line bg-panel px-5 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
          <span className="shrink-0 font-mono text-[11px] leading-[14px] tracking-[0.08em] text-muted">TASK</span>
          <span className="grow text-[15px] leading-[22px] text-fg">Sessions expire after 5 minutes instead of 24 hours.</span>
          <span className="flex shrink-0 items-center gap-2 self-start rounded-control bg-hover px-2.5 py-1 font-mono text-[12px] leading-4 text-fg sm:self-auto">
            <Dot tone={done ? "success" : "accent"} pulse={!done} />
            {done ? "Context ready · 1.2s" : STATUS[stage]}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 p-3 sm:p-4 lg:grid-cols-3">
          {STAGES.map((s, i) => {
            const state = i < stage ? "done" : i === stage ? "running" : "queued";
            // How many rows are on screen: all once done, one per tick while running.
            const shown = state === "done" ? s.rows.length : state === "running" ? Math.min(local, s.rows.length) : 0;
            const active = state === "running";
            return (
              <div
                key={s.title}
                className={`flex flex-col rounded-[10px] border bg-panel transition-[border-color,box-shadow] duration-300 ${
                  active ? "border-accent shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_14%,transparent)]" : "border-line"
                }`}
              >
                <div className="flex items-center gap-2.5 px-[18px] pt-4 pb-1.5">
                  <span className={`font-mono text-[12px] leading-4 transition-colors ${active ? "text-accent" : "text-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="grow text-[16px] leading-[22px] font-[570] text-fg">{s.title}</span>
                  <span
                    className={`flex items-center gap-1.5 font-mono text-[11px] leading-[14px] transition-colors ${
                      state === "done" ? "text-success" : active ? "text-accent" : "text-muted"
                    }`}
                  >
                    <Dot tone={state === "done" ? "success" : active ? "accent" : "muted"} pulse={active} />
                    {state === "done" ? `done · ${s.time}` : active ? s.running : "queued"}
                  </span>
                </div>
                <p className="px-[18px] pb-3.5 text-[13px] leading-[19px] text-muted">{s.body}</p>

                <div className="flex grow flex-col border-t border-line">
                  {s.rows.map((r, ri) => {
                    const on = ri < shown;
                    return (
                      <div key={r.main} className="flex h-10 items-center gap-2.5 border-b border-line px-[18px]">
                        <motion.div
                          className="flex min-w-0 grow items-center gap-2.5"
                          initial={false}
                          animate={{ opacity: on ? 1 : 0, x: on ? 0 : -6 }}
                          transition={{ duration: 0.3, ease: EASE }}
                        >
                          {r.tag && (
                            <span className={`w-[58px] shrink-0 font-mono text-[10px] leading-[14px] tracking-[0.06em] ${i === 0 ? "text-accent" : "text-muted"}`}>{r.tag}</span>
                          )}
                          <span className="min-w-0 grow truncate font-mono text-[12px] leading-4 text-fg">{r.main}</span>
                          {r.side && <span className="w-[100px] shrink-0 text-right font-mono text-[11px] leading-[14px] whitespace-nowrap text-muted">{r.side}</span>}
                          {r.score !== undefined && (
                            <>
                              <span className="h-1 w-16 shrink-0 overflow-hidden rounded-full bg-hover">
                                <motion.span
                                  className="block h-full rounded-full bg-accent"
                                  initial={false}
                                  animate={{ width: on ? `${r.score * 100}%` : "0%" }}
                                  transition={{ duration: 0.6, ease: EASE }}
                                />
                              </span>
                              <span className="w-7 shrink-0 text-right font-mono text-[11px] leading-[14px] text-fg">{String(r.score).slice(1)}</span>
                            </>
                          )}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2.5 px-[18px] py-3 font-mono text-[11px] leading-[14px] text-muted">
                  <span className="grow">{state === "queued" ? "—" : s.foot[0]}</span>
                  {i === 2 ? (
                    <>
                      <span className="h-1 w-14 overflow-hidden rounded-full bg-hover">
                        <motion.span
                          className="block h-full rounded-full bg-success"
                          initial={false}
                          animate={{ width: `${(shown / 3) * 30}%` }}
                          transition={{ duration: 0.5, ease: EASE }}
                        />
                      </span>
                      <span className="text-fg">{shown ? `${(shown * 0.8).toFixed(1)}k / 8k tok` : "0 / 8k tok"}</span>
                    </>
                  ) : (
                    <span>{state === "queued" ? "" : s.foot[1]}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}

function Dot({ tone, pulse }: { tone: "accent" | "success" | "muted"; pulse?: boolean }) {
  const bg = tone === "accent" ? "bg-accent" : tone === "success" ? "bg-success" : "bg-selected";
  return (
    <span className="relative grid size-1.5 shrink-0 place-items-center">
      {pulse && <span className={`absolute size-1.5 animate-ping rounded-full opacity-60 ${bg}`} />}
      <span className={`relative size-1.5 rounded-full ${bg}`} />
    </span>
  );
}
