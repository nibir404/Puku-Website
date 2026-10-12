"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useEffect, useRef, useState } from "react";
import { sleep, typeInto, useAutoplay, WindowChrome } from "./frame";

/* ── dummy project ───────────────────────────────────── */
type Node = { name: string; kind: "dir" | "file"; color: string; children?: Node[] };
const C = { brown: "#8B4A18", gray: "#6B6E63", green: "#3E6B45", blue: "var(--accent)", ink: "var(--text)" };
const TREE: Node[] = [
  { name: ".agents", kind: "dir", color: C.brown, children: [{ name: "reviewer.md", kind: "file", color: C.blue }] },
  { name: ".next", kind: "dir", color: C.gray, children: [] },
  { name: "e2e", kind: "dir", color: C.green, children: [{ name: "reminders.spec.ts", kind: "file", color: C.blue }] },
  { name: "integration-snippets", kind: "dir", color: C.gray, children: [] },
  { name: "node_modules", kind: "dir", color: C.green, children: [] },
  { name: "prisma", kind: "dir", color: C.blue, children: [{ name: "schema.prisma", kind: "file", color: C.blue }] },
  { name: "public", kind: "dir", color: C.blue, children: [] },
  { name: "scripts", kind: "dir", color: C.gray, children: [] },
  {
    name: "src",
    kind: "dir",
    color: C.green,
    children: [
      { name: "route.ts", kind: "file", color: C.blue },
      { name: "route.test.ts", kind: "file", color: C.blue },
      { name: "db.ts", kind: "file", color: C.blue },
    ],
  },
  { name: "test-results", kind: "dir", color: C.gray, children: [] },
  { name: ".env", kind: "file", color: C.brown },
  { name: ".env.example", kind: "file", color: C.brown },
  { name: ".gitignore", kind: "file", color: C.brown },
  { name: "AGENTS.md", kind: "file", color: C.blue },
  { name: "PUKU.md", kind: "file", color: C.blue },
  { name: "eslint.config.mjs", kind: "file", color: C.blue },
  { name: "MEMORY.md", kind: "file", color: C.blue },
  { name: "next.config.ts", kind: "file", color: C.ink },
  { name: "package.json", kind: "file", color: C.green },
  { name: "playwright.config.ts", kind: "file", color: C.green },
  { name: "README.md", kind: "file", color: C.blue },
  { name: "tsconfig.json", kind: "file", color: C.blue },
];

const FILES: Record<string, { path: string; start: number; code: string[] }> = {
  "route.ts": {
    path: "src › app › api › reminders › route.ts",
    start: 12,
    code: [
      'import { NextResponse } from "next/server"',
      'import { db } from "@/lib/db"',
      "",
      "export async function PATCH(req: Request, { params }) {",
      "  const item = await db.reminder.findUnique({ where: { id: params.id } })",
      "  return NextResponse.json(item)",
      "}",
      "",
      "export async function DELETE(req: Request, { params }) {",
      "  const item = await db.reminder.delete({ where: { id: params.id } })",
      '  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 })',
      "  return NextResponse.json(item)",
      "}",
    ],
  },
  "route.test.ts": {
    path: "src › app › api › reminders › route.test.ts",
    start: 1,
    code: [
      'import { describe, it, expect } from "vitest"',
      'import { PATCH } from "./route"',
      "",
      'describe("PATCH /reminders/:id", () => {',
      '  it("updates a reminder", async () => {',
      '    const res = await PATCH(req({ title: "Call Rafi" }), { params: { id: "r_1" } })',
      "    expect(res.status).toBe(200)",
      "  })",
      "})",
    ],
  },
  "db.ts": { path: "src › lib › db.ts", start: 1, code: ['import { PrismaClient } from "@prisma/client"', "", "export const db = new PrismaClient()"] },
  "PUKU.md": {
    path: "PUKU.md",
    start: 1,
    code: ["# Project memory", "", "- API errors use { error: string } with a status code", "- Tests live next to the route: route.test.ts", "- Never write to .env — ask first", "- Prefer prisma.findUnique over findFirst for ids"],
  },
  "package.json": {
    path: "package.json",
    start: 1,
    code: ["{", '  "name": "aideployed-cms",', '  "scripts": {', '    "dev": "next dev",', '    "test": "vitest run"', "  }", "}"],
  },
};
const fallback = (name: string) => ({ path: name, start: 1, code: [`// ${name}`, "// Puku indexed this file in the project graph.", "", "export {}"] });

/* ── tiny highlighter ────────────────────────────────── */
const KW = /\b(import|from|export|async|function|const|return|if|await|describe|it|expect|new)\b/g;
function Code({ line }: { line: string }) {
  if (line.startsWith("#") || line.startsWith("//") || line.startsWith("- ")) return <span className="text-muted">{line}</span>;
  const parts = line.split(/("[^"]*")/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('"') ? (
          <span key={i} className="text-[color-mix(in_oklab,var(--success)_88%,var(--text))]">
            {p}
          </span>
        ) : (
          <Fragment key={i}>
            {p.split(KW).map((t, j) =>
              /^(import|from|export|async|function|const|return|if|await|describe|it|expect|new)$/.test(t) ? (
                <span key={j} className="text-accent">
                  {t}
                </span>
              ) : (
                <span key={j}>{t}</span>
              ),
            )}
          </Fragment>
        ),
      )}
    </>
  );
}

/* ── icons ───────────────────────────────────────────── */
const I = {
  file: <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z M14 3v5h5" />,
  search: <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-4-4" />,
  git: <path d="M6 3v12 M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 9a9 9 0 0 1-9 9" />,
  grid: <path d="M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z" />,
};
const Ico = ({ d, active }: { d: React.ReactNode; active?: boolean }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={active ? "text-fg" : "text-muted"}>
    {d}
  </svg>
);

/* ── agent state ─────────────────────────────────────── */
type Step = { t: string; done: boolean };
type Msg = { role: "user" | "agent"; text: string; steps?: Step[] };
type Diff = "none" | "proposed" | "kept" | "undone";

const SUGGESTIONS = ["PATCH should return 404 like DELETE does.", "Add a test for the 404 case", "Explain route.ts"];

export function EditorMock({ start = "welcome", autoplay = true }: { start?: "welcome" | "diff"; autoplay?: boolean }) {
  const [open, setOpen] = useState<Record<string, boolean>>({ src: start === "diff" });
  const [tabs, setTabs] = useState<string[]>(start === "diff" ? ["route.ts"] : ["Welcome"]);
  const [active, setActive] = useState(start === "diff" ? "route.ts" : "Welcome");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [diff, setDiff] = useState<Diff>("none");
  const [title, setTitle] = useState("New Agent");
  const [toast, setToast] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 1e6, behavior: "smooth" });
  }, [msgs]);

  const openFile = (name: string) => {
    setTabs((t) => (t.includes(name) ? t : [...t, name]));
    setActive(name);
  };
  const closeTab = (name: string) => {
    setTabs((t) => {
      const next = t.filter((x) => x !== name);
      if (active === name) setActive(next[next.length - 1] ?? "");
      return next;
    });
  };
  const flash = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 1800);
  };

  const run = async (prompt: string, alive: () => boolean = () => true) => {
    if (busy || !prompt.trim()) return;
    setBusy(true);
    setInput("");
    setTitle(prompt.toLowerCase().includes("test") ? "Add 404 test" : prompt.toLowerCase().includes("explain") ? "Explain route.ts" : "Fix 404 shape");
    setMsgs((m) => [...m, { role: "user", text: prompt }]);
    await sleep(500);
    const explain = prompt.toLowerCase().includes("explain");
    const steps: Step[] = explain
      ? [{ t: "Read route.ts", done: false }, { t: "Read PUKU.md · 4 notes", done: false }]
      : [
          { t: "Read route.ts, route.test.ts", done: false },
          { t: "Edited route.ts +4 −1", done: false },
          { t: "Ran npm test  12 passed", done: false },
        ];
    setMsgs((m) => [...m, { role: "agent", text: "", steps: [] }]);
    for (let i = 0; i < steps.length; i++) {
      if (!alive()) break;
      setMsgs((m) => {
        const c = [...m];
        c[c.length - 1] = { ...c[c.length - 1], steps: steps.slice(0, i + 1).map((s, j) => ({ ...s, done: j < i })) };
        return c;
      });
      if (i === 0) openFile("route.ts");
      if (i === 1 && !explain) {
        setDiff("proposed");
        setActive("route.ts");
      }
      await sleep(900);
    }
    setMsgs((m) => {
      const c = [...m];
      c[c.length - 1] = { ...c[c.length - 1], steps: steps.map((s) => ({ ...s, done: true })) };
      return c;
    });
    const reply = explain
      ? "route.ts exposes PATCH and DELETE for /api/reminders/:id. DELETE returns { error: \"not_found\" } with a 404; PATCH currently returns null instead."
      : "Found it in route.ts. DELETE already returns not_found with a 404, so I matched that shape and added a test.";
    await typeInto(reply, (s) => setMsgs((m) => {
      const c = [...m];
      c[c.length - 1] = { ...c[c.length - 1], text: s };
      return c;
    }), () => true, 8);
    setBusy(false);
  };

  const { ref, takeOver } = useAutoplay(async (alive) => {
    if (start === "welcome") {
      await sleep(400);
      if (!alive()) return;
      setOpen((o) => ({ ...o, src: true }));
      await sleep(700);
      if (!alive()) return;
      openFile("route.ts");
      await sleep(900);
    }
    if (!alive()) return;
    const ok = await typeInto(SUGGESTIONS[0], setInput, alive, 32);
    if (!ok) return;
    await sleep(300);
    if (alive()) run(SUGGESTIONS[0], alive);
  }, autoplay);

  const file = FILES[active] ?? fallback(active);
  const isRoute = active === "route.ts";

  return (
    <div ref={ref} onPointerDown={takeOver} onKeyDown={takeOver} className="size-full">
      <WindowChrome title="Aideployed-CMS">
        <div className="relative flex min-h-0 flex-1">
          {/* Sidebar */}
          <aside className="flex w-[209px] shrink-0 flex-col border-r border-line bg-sidebar">
            <div className="flex h-[37px] items-center gap-4 px-3.5">
              <Ico d={I.file} active />
              <Ico d={I.search} />
              <Ico d={I.git} />
              <Ico d={I.grid} />
            </div>
            <div className="px-2.5 pt-2 pb-1 font-mono text-[11px] tracking-[0.12em] text-fg">AIDEPLOYED-CMS</div>
            <div className="flex-1 overflow-y-auto pb-2" data-lenis-prevent>
              {TREE.map((n) => (
                <TreeRow key={n.name} node={n} depth={0} open={open} setOpen={setOpen} active={active} onOpen={openFile} />
              ))}
            </div>
            <div className="border-t border-line px-2.5 py-1.5 font-mono text-[11px] tracking-[0.1em] text-muted">OUTLINE</div>
            <div className="px-2.5 pb-2 font-mono text-[11px] tracking-[0.1em] text-muted">TIMELINE</div>
          </aside>

          {/* Editor */}
          <section className="flex min-w-0 flex-1 flex-col">
            <div className="flex h-[37px] shrink-0 border-b border-line bg-sidebar">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setActive(t)}
                  className={`group/tab flex items-center gap-2 border-r border-line px-3.5 text-[13px] transition-colors ${active === t ? "bg-main text-fg" : "text-muted hover:text-fg"}`}
                >
                  <span className="size-2.5 rounded-[2px] bg-accent" />
                  {t}
                  <span
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(t);
                    }}
                    className="ml-1 grid size-4 place-items-center rounded text-[11px] text-muted opacity-60 hover:bg-hover hover:opacity-100"
                  >
                    ×
                  </span>
                </button>
              ))}
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden" data-lenis-prevent>
              <AnimatePresence mode="wait">
                {active === "Welcome" ? (
                  <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col px-[64px] pt-[120px]">
                    <div className="text-[34px] leading-10 tracking-[-0.02em] text-fg">Puku</div>
                    <div className="text-[17px] text-muted">Editing evolved</div>
                    <div className="mt-8 grid grid-cols-2 gap-8">
                      <div className="flex flex-col gap-3">
                        <div className="text-[16px] text-fg">Start</div>
                        {["New File...", "Open...", "Clone Git Repository...", "Connect to...", "Generate New Workspace..."].map((s, i) => (
                          <button
                            key={s}
                            onClick={() => (i === 0 ? openFile("untitled.ts") : i === 1 ? setOpen((o) => ({ ...o, src: true })) : flash(`${s.replace("...", "")} · demo`))}
                            className="w-fit text-left text-[14px] text-accent hover:underline"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="text-[16px] text-fg">Recent</div>
                        <button onClick={() => openFile("route.ts")} className="w-fit text-left text-[14px] text-accent hover:underline">
                          portfolio-CMO-main <span className="text-muted">~/Downloads</span>
                        </button>
                      </div>
                    </div>
                    <label className="mt-auto mb-4 flex items-center justify-center gap-2 text-[12px] text-muted">
                      <span className="size-3 rounded-[3px] bg-accent" /> Show welcome page on startup
                    </label>
                  </motion.div>
                ) : active ? (
                  <motion.div key={active} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto pt-3 font-mono text-[13px] leading-[21px]">
                    <div className="mb-2 px-5 font-sans text-[12px] text-muted">{file.path}</div>
                    {isRoute ? <RouteBody diff={diff} setDiff={setDiff} flash={flash} start={file.start} code={file.code} /> : <Lines start={file.start} code={file.code} />}
                  </motion.div>
                ) : (
                  <div className="grid h-full place-items-center text-[13px] text-muted">Open a file from the explorer</div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {toast && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-4 bottom-4 rounded-[8px] border border-line bg-panel px-3 py-2 text-[12px] text-fg shadow-lg">
                    {toast}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Agent */}
          <aside className="flex w-[300px] shrink-0 flex-col border-l border-line bg-sidebar">
            <div className="flex h-[37px] shrink-0 items-center justify-between border-b border-line px-3.5">
              <span className="flex items-center gap-2 text-[13px] text-fg">
                <span className="size-2.5 rounded-[2px] bg-accent" />
                {title}
              </span>
              <button
                onClick={() => {
                  setMsgs([]);
                  setDiff("none");
                  setTitle("New Agent");
                }}
                className="text-[16px] text-muted hover:text-fg"
                aria-label="New agent"
              >
                +
              </button>
            </div>
            <div ref={scroller} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pt-3" data-lenis-prevent>
              {msgs.length === 0 && (
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="px-1 font-mono text-[10px] tracking-[0.1em] text-muted">TRY</span>
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => run(s)} className="rounded-[8px] border border-line bg-panel px-2.5 py-2 text-left text-[12px] text-fg transition-colors hover:border-accent">
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {msgs.map((m, i) =>
                m.role === "user" ? (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="ml-8 self-end rounded-[10px] bg-hover px-3 py-2 text-[13px] leading-[19px] text-fg">
                    {m.text}
                  </motion.div>
                ) : (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
                    {m.text && <p className="text-[13px] leading-[19px] text-fg">{m.text}</p>}
                    <div className="flex flex-col gap-1.5">
                      {m.steps?.map((s) => (
                        <motion.div key={s.t} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 font-mono text-[11.5px] text-muted">
                          {s.done ? <span className="text-success">✓</span> : <span className="inline-block size-2.5 animate-spin rounded-full border border-accent border-t-transparent" />}
                          {s.t}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ),
              )}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(input);
              }}
              className="m-2.5 flex flex-col rounded-[12px] border border-line bg-panel p-2.5 focus-within:border-accent/60"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    run(input);
                  }
                }}
                rows={3}
                placeholder={msgs.length ? "Ask a follow-up..." : "Describe what to build — / for commands, @ for context"}
                className="resize-none bg-transparent text-[13px] leading-[18px] text-fg outline-none placeholder:text-muted"
              />
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-control bg-hover px-2 py-1 text-[12px] text-fg">Agent ⌄</span>
                <span className="text-[12px] text-fg">Puku-ai 2.8 ⌄</span>
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="ml-auto rounded-control bg-accent px-2.5 py-1 text-[12px] text-accent-ink transition-opacity disabled:opacity-50"
                >
                  {busy ? "Working…" : "Send ↵"}
                </button>
              </div>
            </form>
          </aside>
        </div>
        <div className="flex h-[22px] shrink-0 items-center gap-4 border-t border-line bg-sidebar px-3 font-mono text-[11px] text-muted">
          <span>⑂ main</span>
          <span>⊗ 0 ⚠ 0</span>
          {busy && <span className="text-accent">● agent running</span>}
          {diff === "kept" && <span className="text-success">✓ 1 change kept</span>}
        </div>
      </WindowChrome>
    </div>
  );
}

function TreeRow({
  node,
  depth,
  open,
  setOpen,
  active,
  onOpen,
}: {
  node: Node;
  depth: number;
  open: Record<string, boolean>;
  setOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  active: string;
  onOpen: (n: string) => void;
}) {
  const isOpen = open[node.name];
  return (
    <>
      <button
        onClick={() => (node.kind === "dir" ? setOpen((o) => ({ ...o, [node.name]: !o[node.name] })) : onOpen(node.name))}
        className={`flex h-[23px] w-full items-center gap-1.5 pr-2 text-left text-[13.5px] transition-colors hover:bg-hover ${active === node.name ? "bg-hover text-fg" : "text-fg"}`}
        style={{ paddingLeft: 8 + depth * 14 }}
      >
        <span className={`w-2 text-[10px] text-muted transition-transform ${node.kind === "dir" ? "" : "opacity-0"} ${isOpen ? "rotate-90" : ""}`}>›</span>
        {node.kind === "dir" ? (
          <span className="h-[9px] w-[13px] rounded-[2px]" style={{ background: node.color }} />
        ) : (
          <span className="size-[10px] rounded-[2.5px] border-[1.5px]" style={{ borderColor: node.color }} />
        )}
        <span className="truncate">{node.name}</span>
      </button>
      <AnimatePresence initial={false}>
        {node.kind === "dir" && isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {node.children?.length ? (
              node.children.map((c) => <TreeRow key={c.name} node={c} depth={depth + 1} open={open} setOpen={setOpen} active={active} onOpen={onOpen} />)
            ) : (
              <div className="h-[23px] text-[12px] text-muted" style={{ paddingLeft: 30 + depth * 14 }}>
                empty
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Lines({ start, code }: { start: number; code: string[] }) {
  return (
    <>
      {code.map((l, i) => (
        <div key={i} className="flex px-5 whitespace-pre hover:bg-hover/50">
          <span className="w-9 shrink-0 text-muted">{start + i}</span>
          <span className="w-4 shrink-0" />
          <span className="text-fg">
            <Code line={l} />
          </span>
        </div>
      ))}
    </>
  );
}

function RouteBody({ diff, setDiff, flash, start, code }: { diff: Diff; setDiff: (d: Diff) => void; flash: (t: string) => void; start: number; code: string[] }) {
  const before = code.slice(0, 5);
  const after = code.slice(6);
  const added = ["  if (!item) {", '    return NextResponse.json({ error: "not_found" }, { status: 404 })', "  }", "  return NextResponse.json(item)"];
  const row = (n: number | string, sign: string, l: string, cls = "", key?: string) => (
    <motion.div
      key={key}
      layout
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex px-5 whitespace-pre ${cls}`}
    >
      <span className="w-9 shrink-0 text-muted">{n}</span>
      <span className="w-4 shrink-0 text-muted">{sign}</span>
      <span className="text-fg">
        <Code line={l} />
      </span>
    </motion.div>
  );
  return (
    <>
      {before.map((l, i) => row(start + i, "", l, "", `b${i}`))}
      {diff === "proposed" && (
        <>
          {row(17, "−", code[5], "bg-[color-mix(in_oklab,var(--danger)_11%,transparent)] [&_span]:!text-danger", "del")}
          {added.map((l, i) => row(17 + i, "+", l, "bg-[color-mix(in_oklab,var(--success)_11%,transparent)]", `a${i}`))}
          <div className="flex gap-2 py-2 pl-[80px] font-sans">
            <button
              onClick={() => {
                setDiff("kept");
                flash("Kept · route.ts saved");
              }}
              className="rounded-control bg-accent px-2.5 py-1 text-[12px] text-accent-ink transition-transform active:scale-95"
            >
              Keep ⌘↵
            </button>
            <button
              onClick={() => {
                setDiff("undone");
                flash("Undone · change discarded");
              }}
              className="rounded-control bg-hover px-2.5 py-1 text-[12px] text-fg transition-transform active:scale-95"
            >
              Undo ⌘⌫
            </button>
          </div>
        </>
      )}
      {diff === "kept" && added.map((l, i) => row(17 + i, "", l, "animate-[keep_1.2s_ease-out]", `k${i}`))}
      {(diff === "none" || diff === "undone") && row(17, "", code[5], "", "orig")}
      {after.map((l, i) => row((diff === "kept" || diff === "proposed" ? 21 : 18) + i, "", l, "", `c${i}`))}
    </>
  );
}
