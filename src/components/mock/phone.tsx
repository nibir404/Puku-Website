"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Req = { id: number; title: string; cmd: string };
const QUEUE: Req[] = [
  { id: 1, title: "Run migrations on staging?", cmd: "$ npx prisma migrate deploy" },
  { id: 2, title: "Push fix/node-engines?", cmd: "$ git push -u origin fix/node-engines" },
  { id: 3, title: "Install zod@3.23?", cmd: "$ npm install zod@3.23" },
];

type Session = { title: string; status: "running" | "done" | "denied"; sub: string; started: number };

/** Puku App preview — approvals, live sessions, all interactive with looping dummy data. */
export function PhoneMock() {
  const [qi, setQi] = useState(0);
  const [req, setReq] = useState<Req | null>(QUEUE[0]);
  const [now, setNow] = useState(0);
  const [sessions, setSessions] = useState<Session[]>([
    { title: "Flask reminder API", status: "running", sub: "3 subagents", started: -14 },
    { title: "Build mobile navigation", status: "done", sub: "+214 −38 · PR #82 opened", started: -900 },
  ]);
  const [swipe, setSwipe] = useState<"approve" | "deny" | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // next approval arrives a few seconds after the last one is handled
  useEffect(() => {
    if (req) return;
    const t = setTimeout(() => {
      const next = (qi + 1) % QUEUE.length;
      setQi(next);
      setReq({ ...QUEUE[next], id: Date.now() });
      setSwipe(null);
    }, 5200);
    return () => clearTimeout(t);
  }, [req, qi]);

  const decide = (ok: boolean) => {
    if (!req) return;
    setSwipe(ok ? "approve" : "deny");
    const r = req;
    setTimeout(() => {
      setReq(null);
      setSessions((s) => [
        { title: r.title.replace("?", ""), status: ok ? "running" : "denied", sub: ok ? r.cmd.replace("$ ", "") : "Denied · agent will ask again", started: now },
        ...s.slice(0, 2),
      ]);
      if (ok) setTimeout(() => setSessions((s) => s.map((x, i) => (i === 0 && x.status === "running" ? { ...x, status: "done", sub: "Finished · exit 0" } : x))), 3200);
    }, 450);
  };

  const ago = (s: Session) => {
    const d = now - s.started;
    return d > 300 ? "12m ago" : `started ${d}s ago`;
  };
  const pending = req ? 1 : 0;

  return (
    <div className="flex h-full w-full flex-col gap-3.5 overflow-hidden rounded-t-[36px] bg-main px-[18px] pt-[18px] select-none">
      <div className="flex justify-between px-2 text-[13px] leading-4 text-fg">
        <span>9:41</span>
        <span>●●●</span>
      </div>
      <div className="flex items-center justify-between pt-2">
        <span className="text-[26px] leading-8 tracking-[-0.02em] text-fg">Sessions</span>
        <motion.span
          key={pending}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className={`flex h-[26px] items-center rounded-control border border-line bg-panel px-2.5 font-mono text-[11px] leading-[14px] ${pending ? "text-warning" : "text-success"}`}
        >
          {pending ? "1 needs you" : "all clear"}
        </motion.span>
      </div>

      <AnimatePresence mode="popLayout">
        {req && (
          <motion.div
            key={req.id}
            layout
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1, x: swipe === "approve" ? 260 : swipe === "deny" ? -260 : 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: -14 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, i) => (i.offset.x > 90 ? decide(true) : i.offset.x < -90 ? decide(false) : null)}
            className="flex cursor-grab flex-col gap-2.5 rounded-panel border border-line bg-panel p-3.5 active:cursor-grabbing"
          >
            <span className="flex items-center justify-between font-mono text-[11px] leading-[14px] tracking-[0.08em] text-warning">
              NEEDS APPROVAL <span className="tracking-normal text-muted">swipe →</span>
            </span>
            <span className="text-[15px] leading-[21px] text-fg">{req.title}</span>
            <span className="truncate font-mono text-[12px] leading-4 text-muted">{req.cmd}</span>
            <div className="flex gap-2">
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => decide(true)}
                className="flex h-[34px] grow items-center justify-center rounded-control bg-accent text-[14px] text-accent-ink [animation:pulse-ring_1.6s_ease-out_0.6s_2] active:scale-95"
              >
                Approve
              </button>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => decide(false)}
                className="flex h-[34px] w-20 shrink-0 items-center justify-center rounded-control bg-hover text-[14px] text-fg active:scale-95"
              >
                Deny
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {sessions.map((s, i) => (
          <motion.div
            key={s.title + s.started}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
            className="flex flex-col gap-0.5 rounded-panel border border-line bg-panel px-3.5 py-3"
          >
            <div className="flex justify-between gap-2">
              <span className="truncate text-[14px] leading-[18px] text-fg">{s.title}</span>
              <span
                className={`shrink-0 font-mono text-[11px] leading-[14px] ${
                  s.status === "running" ? "animate-pulse text-success" : s.status === "denied" ? "text-danger" : "text-muted"
                }`}
              >
                {s.status === "running" ? "● running" : s.status}
              </span>
            </div>
            <span className="truncate text-[13px] leading-4 text-muted">
              {s.sub}
              {s.status === "running" && ` · ${ago(s)}`}
            </span>
            {s.status === "running" && (
              <span className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-hover">
                <motion.span className="block h-full bg-success" initial={{ width: "8%" }} animate={{ width: "92%" }} transition={{ duration: 3.2, ease: "easeInOut" }} />
              </span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
