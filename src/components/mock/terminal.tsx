"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { sleep, typeInto, useAutoplay, WindowChrome } from "./frame";

type Line =
  | { k: "prompt"; text: string }
  | { k: "out"; text: string; tone?: "muted" | "ok" | "accent" | "warn" | "fg" }
  | { k: "graph"; files: string[] }
  | { k: "approve"; cmd: string; id: number; answered?: number };

const DEMO = "add rate limiting to the public reminders API, 60 req/min per key";

const HELP: Line[] = [
  { k: "out", text: "Commands", tone: "accent" },
  { k: "out", text: "  /help            show this list", tone: "muted" },
  { k: "out", text: "  /sandbox         permissions for this project", tone: "muted" },
  { k: "out", text: "  /release-notes   what's new in 2.8", tone: "muted" },
  { k: "out", text: "  /memory          read PUKU.md", tone: "muted" },
  { k: "out", text: "  /clear           clear the screen", tone: "muted" },
  { k: "out", text: "  …or just describe a task in plain words.", tone: "muted" },
];

export function TerminalMock({ autoplay = true }: { autoplay?: boolean }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<number | null>(null);
  const [sel, setSel] = useState(0);
  const [hist, setHist] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const resolver = useRef<((n: number) => void) | null>(null);
  const idc = useRef(0);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 1e6, behavior: "smooth" });
  }, [lines]);

  const push = (...l: Line[]) => setLines((x) => [...x, ...l]);

  const ask = (cmd: string) =>
    new Promise<number>((res) => {
      const id = ++idc.current;
      push({ k: "approve", cmd, id });
      setPending(id);
      setSel(0);
      resolver.current = (n) => {
        setLines((x) => x.map((l) => (l.k === "approve" && l.id === id ? { ...l, answered: n } : l)));
        setPending(null);
        resolver.current = null;
        res(n);
      };
    });

  const exec = async (raw: string, auto = false) => {
    const cmd = raw.trim();
    if (!cmd || busy) return;
    setInput("");
    setHist((h) => [cmd, ...h]);
    setHIdx(-1);
    if (cmd === "/clear" || cmd === "clear") return setLines([]);
    push({ k: "prompt", text: cmd });
    setBusy(true);
    await sleep(250);
    if (cmd === "/help" || cmd === "?" || cmd === "help") push(...HELP);
    else if (cmd === "/sandbox" || cmd === "/permissions")
      push(
        { k: "out", text: "Sandbox · ~/aideployed-cms", tone: "accent" },
        { k: "out", text: "  write     ● allow   (src/**, tests/**)", tone: "ok" },
        { k: "out", text: "  shell     ● ask     npm test, prisma *", tone: "warn" },
        { k: "out", text: "  network   ○ off", tone: "muted" },
      );
    else if (cmd === "/release-notes")
      push(
        { k: "out", text: "Puku CLI 1.8.66", tone: "accent" },
        { k: "out", text: "  · Polished /sandbox and /permissions UX", tone: "fg" },
        { k: "out", text: "  · Background tasks with puku run --bg", tone: "fg" },
        { k: "out", text: "  · Clearer install instructions", tone: "fg" },
      );
    else if (cmd === "/memory" || cmd.startsWith("cat PUKU"))
      push(
        { k: "out", text: "PUKU.md · 4 notes", tone: "accent" },
        { k: "out", text: "  - API errors use { error } with a status code", tone: "muted" },
        { k: "out", text: "  - Tests live next to the route", tone: "muted" },
        { k: "out", text: "  - Never write to .env — ask first", tone: "muted" },
        { k: "out", text: "  - Redis client lives in src/lib/redis.ts", tone: "muted" },
      );
    else if (cmd === "ls") push({ k: "out", text: "e2e  prisma  public  scripts  src  PUKU.md  package.json  tsconfig.json", tone: "fg" });
    else if (cmd.startsWith("git status")) push({ k: "out", text: "On branch main · nothing to commit, working tree clean", tone: "muted" });
    else {
      // agent task
      push({ k: "graph", files: ["src/app/api/reminders/route.ts", "src/lib/redis.ts", "middleware.ts", "route.test.ts"] });
      await sleep(900);
      const rate = /rate|limit/i.test(cmd);
      const edits = rate
        ? ["Created src/lib/rate-limit.ts +38", "Edited middleware.ts +9 −1", "Edited route.test.ts +24"]
        : ["Edited src/app/api/reminders/route.ts +6 −2", "Edited route.test.ts +12"];
      for (const e of edits) {
        push({ k: "out", text: `✓ ${e}`, tone: "ok" });
        await sleep(520);
      }
      const choice = auto ? await (async () => {
        const p = ask("npm test -- reminders");
        await sleep(1500);
        resolver.current?.(0);
        return p;
      })() : await ask("npm test -- reminders");
      if (choice === 2) {
        push({ k: "out", text: "Okay — skipped. Tell Puku what to do instead.", tone: "muted" });
      } else {
        if (choice === 1) push({ k: "out", text: "Saved: always allow `npm test` in this project", tone: "accent" });
        push({ k: "out", text: "$ npm test -- reminders", tone: "muted" });
        await sleep(500);
        for (const t of ["  ✓ PATCH returns 404 for missing id", "  ✓ rate limit · 61st request returns 429", "  ✓ DELETE removes reminder"]) {
          push({ k: "out", text: t, tone: "ok" });
          await sleep(300);
        }
        push({ k: "out", text: "  12 passed · 1.4s", tone: "fg" }, { k: "out", text: "Done. 3 files changed · diff ready for review (puku diff)", tone: "accent" });
      }
    }
    setBusy(false);
    inputRef.current?.focus({ preventScroll: true });
  };

  const { ref, takeOver } = useAutoplay(async (alive) => {
    const ok = await typeInto(DEMO, setInput, alive, 26);
    if (ok && alive()) exec(DEMO, true);
  }, autoplay);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (pending !== null) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") (e.preventDefault(), setSel((s) => (s + 1) % 3));
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") (e.preventDefault(), setSel((s) => (s + 2) % 3));
      if (["1", "2", "3"].includes(e.key)) (e.preventDefault(), resolver.current?.(Number(e.key) - 1));
      if (e.key === "Enter") (e.preventDefault(), resolver.current?.(sel));
      return;
    }
    if (e.key === "Enter") exec(input);
    if (e.key === "ArrowUp" && hist.length) {
      e.preventDefault();
      const i = Math.min(hIdx + 1, hist.length - 1);
      setHIdx(i);
      setInput(hist[i]);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = Math.max(hIdx - 1, -1);
      setHIdx(i);
      setInput(i < 0 ? "" : hist[i]);
    }
    if (e.key === "Tab" && input.startsWith("/")) {
      e.preventDefault();
      const m = ["/help", "/sandbox", "/release-notes", "/memory", "/clear"].find((c) => c.startsWith(input));
      if (m) setInput(m);
    }
  };

  const tone = { muted: "text-muted", ok: "text-success", accent: "text-accent", warn: "text-warning", fg: "text-fg" };

  return (
    <div ref={ref} className="size-full" onPointerDown={() => (takeOver(), setTimeout(() => inputRef.current?.focus({ preventScroll: true })))}>
      <WindowChrome title="~/aideployed-cms — puku">
        <div ref={scroller} className="flex min-h-0 flex-1 cursor-text flex-col gap-[7px] overflow-y-auto px-9 pt-7 font-mono text-[15px] leading-[22px]" data-lenis-prevent>
          {/* Welcome box */}
          <div className="flex shrink-0 rounded-[12px] border-[1.5px] border-accent">
            <div className="flex w-[300px] flex-col items-center gap-4 border-r border-line px-6 py-5">
              <span className="self-start font-semibold text-fg">Welcome back, Md. Imtiaz Ahamed</span>
              <Logo size={80} />
              <span className="text-center text-muted">
                Puku-ai 2.8
                <br />
                ~/aideployed-cms
              </span>
            </div>
            <div className="flex flex-col gap-1.5 px-6 py-5">
              <span className="text-accent">Recent activity</span>
              <span className="text-muted">Fix 404 shape · 2h ago</span>
              <span className="text-muted">Rate limiting · yesterday</span>
              <span className="my-2 h-px w-80 bg-success/60" />
              <span className="text-accent">What&apos;s new</span>
              <span className="text-fg">/remote-control live message feed</span>
              <span className="text-fg">Puku mobile app relay session view</span>
              <span className="text-muted italic">/release-notes for more</span>
            </div>
          </div>
          <div className="h-2 shrink-0" />
          {lines.map((l, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="shrink-0 whitespace-pre-wrap">
              {l.k === "prompt" && (
                <span className="text-fg">
                  <span className="text-accent">› </span>
                  {l.text}
                </span>
              )}
              {l.k === "out" && <span className={tone[l.tone ?? "fg"]}>{l.text}</span>}
              {l.k === "graph" && (
                <div className="flex flex-col gap-1 py-1">
                  <span className="text-muted">
                    <span className="mr-2 inline-block size-3 animate-pulse rounded-full bg-muted align-middle" />
                    Puku Graph · {l.files.length} files in context
                  </span>
                  <span className="pl-6 text-muted">{l.files.join(" · ")}</span>
                </div>
              )}
              {l.k === "approve" && (
                <div className="my-1 flex w-[640px] flex-col gap-2 rounded-[12px] border-[1.5px] border-warning/70 bg-[color-mix(in_oklab,var(--warning)_6%,transparent)] px-5 py-3.5">
                  <span className="text-warning">Run command?</span>
                  <span className="text-fg">$ {l.cmd}</span>
                  <div className="flex gap-5">
                    {["1. Yes", "2. Yes, always for npm test", "3. No, tell Puku why"].map((o, n) => {
                      const live = pending === l.id;
                      const picked = l.answered === n;
                      return (
                        <button
                          key={o}
                          disabled={!live}
                          onClick={() => resolver.current?.(n)}
                          className={`transition-colors ${live && sel === n ? "text-fg" : picked ? "text-accent" : "text-muted"} ${live ? "hover:text-fg" : ""} ${l.answered !== undefined && !picked ? "opacity-40" : ""}`}
                        >
                          {live && sel === n ? "› " : picked ? "✓ " : "  "}
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          <div className="h-4 shrink-0" />
        </div>
        <div className="shrink-0 px-9 pb-3">
          <label className={`flex h-[46px] items-center gap-2.5 rounded-[12px] border-[1.5px] px-4 font-mono text-[15px] transition-colors ${busy ? "border-line" : "border-success/70"}`}>
            <span className="text-fg">►</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              disabled={busy && pending === null}
              spellCheck={false}
              aria-label="Puku CLI input"
              placeholder={pending !== null ? "1 · 2 · 3, or ←/→ then ↵" : busy ? "working…" : "type a task, or /help"}
              className="flex-1 bg-transparent text-fg caret-accent outline-none placeholder:text-muted/70"
            />
            {busy && pending === null && <span className="inline-block size-3 animate-spin rounded-full border-2 border-accent border-t-transparent" />}
          </label>
          <div className="mt-2 font-mono text-[13px] text-muted">/ for commands · ? for help · context 23% · ask before edits</div>
        </div>
      </WindowChrome>
    </div>
  );
}
