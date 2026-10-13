"use client";

/* Puku Web-Chat (chat.puku.sh) — interactive replica of "02 · Chat" / "01 · New chat", 1440×900 design size. */

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/components/fx/reveal";
import { sleep, typeInto, useAutoplay } from "./frame";

type Block =
  | { t: "h"; text: string }
  | { t: "h2"; text: string }
  | { t: "p"; text: string; cite?: number }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "code"; lang: string; text: string };

type Thread = { id: string; title: string; file?: string; ask: string; answer: Block[]; sources: string[]; icon: "board" | "bubble" };

const BASELINE: Thread = {
  id: "baseline",
  icon: "board",
  title: "Compare model baselines",
  file: "evaluation-notes",
  ask: "Compare a small baseline with a larger model.",
  sources: ["arxiv.org · Scaling laws for evaluation", "evaluation-notes.txt · line 14", "paperswithcode.com · SST-2"],
  answer: [
    { t: "h", text: "Choosing a practical baseline" },
    { t: "p", text: "A small model provides a repeatable starting point", cite: 1 },
    { t: "h2", text: "Evaluation" },
    { t: "table", head: ["Candidate", "Quality", "Latency"], rows: [["Baseline", "81%", "42 ms"], ["Larger model", "86%", "180 ms"]] },
    { t: "h2", text: "Example" },
    { t: "code", lang: "typescript", text: "const split = { train: 0.8, validation: 0.2 };" },
    { t: "p", text: "Keep the dataset and validation split fixed. Compare accuracy alongside latency and cost.", cite: 2 },
  ],
};
const PLAN: Thread = {
  id: "plan",
  icon: "bubble",
  title: "Plan next week's experiments",
  ask: "Plan three experiments for next week, smallest first.",
  sources: ["PUKU.md · decisions", "linear.app · EVAL-42"],
  answer: [
    { t: "h", text: "Three experiments, smallest first" },
    { t: "p", text: "Start with prompt caching on the baseline — cheapest and fastest to verify.", cite: 1 },
    { t: "table", head: ["#", "Experiment", "Cost"], rows: [["1", "Prompt caching", "Low"], ["2", "Distilled 3B", "Medium"], ["3", "Larger context", "High"]] },
    { t: "p", text: "Each run reuses the fixed validation split from the last thread.", cite: 2 },
  ],
};

const SUGGEST = ["Pick up where we left off", "Untangle a problem", "Make a plan"];

const reply = (q: string): Thread => ({
  id: `t${Date.now()}`,
  icon: "bubble",
  title: q.length > 30 ? `${q.slice(0, 30)}…` : q,
  ask: q,
  sources: ["docs.puku.sh · Research mode", "PUKU.md · project memory", "github.com · aideployed-cms"],
  answer: [
    { t: "h", text: q.toLowerCase().includes("plan") ? "A plan you can hand off" : "Here's what I found" },
    { t: "p", text: "Short version: split it into research, implementation and review, and let each surface do its part", cite: 1 },
    { t: "table", head: ["Step", "Owner", "Surface"], rows: [["Research", "You", "Chat"], ["Implement", "Agent", "CLI"], ["Review", "You", "Editor"]] },
    { t: "p", text: "Every claim above is cited. Send it to the CLI when you're ready.", cite: 2 },
  ],
});

/* ── icons (Lucide-style, 1.6 stroke) ─────────────────── */
const ic = (d: React.ReactNode, s = 16) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);
const Ico = {
  panel: ic(<><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /></>, 18),
  search: ic(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>, 15),
  plus: ic(<path d="M12 5v14M5 12h14" />, 17),
  folder: ic(<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />, 15),
  chevron: ic(<path d="m6 9 6 6 6-6" />, 14),
  drive: ic(<><path d="M22 12H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /><path d="M6 16h.01M10 16h.01" /></>, 16),
  board: ic(<><rect x="2" y="4" width="20" height="14" rx="2" /><path d="M2 8h20M6 4v4M10 4v4M14 4v4M18 4v4" /></>, 18),
  bubble: ic(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />, 18),
  sort: ic(<path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4" />, 14),
  sliders: ic(<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" />, 15),
  download: ic(<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />, 16),
  archive: ic(<><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4" /></>, 16),
  help: ic(<><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" /></>, 16),
  clock: ic(<><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>, 15),
  check: ic(<path d="M20 6 9 17l-5-5" />, 14),
  right: ic(<path d="m9 18 6-6-6-6" />, 14),
  copy: ic(<><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></>, 15),
  pen: ic(<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />, 15),
  file: ic(<><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" /></>, 18),
  brain: ic(<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Zm0 0a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />, 16),
  mic: ic(<><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" /></>, 17),
  up: ic(<path d="m5 12 7-7 7 7M12 19V5" />, 16),
};

export function ChatMock({ autoplay = true, start = "thread" }: { autoplay?: boolean; start?: "thread" | "new" }) {
  const [threads, setThreads] = useState<Thread[]>([BASELINE, PLAN]);
  const [activeId, setActiveId] = useState<string | null>(start === "new" ? null : "baseline");
  const [shown, setShown] = useState<Record<string, number>>({ baseline: start === "new" ? 99 : 0, plan: 99 });
  const [thinking, setThinking] = useState(false);
  const [openThought, setOpenThought] = useState(false);
  const [input, setInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [think, setThink] = useState(false);
  const [model, setModel] = useState<"Fast" | "Deep">("Fast");
  const [modelMenu, setModelMenu] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const t = threads.find((x) => x.id === activeId);
  const n = activeId ? shown[activeId] ?? 99 : 0;

  useEffect(() => {
    if (thinking || n < 99) scroller.current?.scrollTo({ top: 1e6, behavior: "smooth" });
  }, [n, thinking]);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2200);
  };

  const reveal = async (id: string, count: number, alive: () => boolean = () => true) => {
    setThinking(true);
    await sleep(think ? 1700 : 1000);
    setThinking(false);
    for (let i = 1; i <= count; i++) {
      if (!alive()) break;
      setShown((s) => ({ ...s, [id]: i }));
      await sleep(480);
    }
    setShown((s) => ({ ...s, [id]: 99 }));
  };

  const send = async (q: string) => {
    if (!q.trim() || thinking) return;
    setInput("");
    const nt = reply(q.trim());
    setThreads((x) => [nt, ...x]);
    setActiveId(nt.id);
    setShown((s) => ({ ...s, [nt.id]: 0 }));
    await reveal(nt.id, nt.answer.length);
  };

  const { ref, takeOver } = useAutoplay(async (alive) => {
    if (start === "new") {
      const ok = await typeInto("Compare a small baseline with a larger model.", setInput, alive, 32);
      if (!ok || !alive()) return;
      await sleep(400);
      setInput("");
      setActiveId("baseline");
      setShown((s) => ({ ...s, baseline: 0 }));
      await reveal("baseline", BASELINE.answer.length, alive);
    } else {
      await reveal("baseline", BASELINE.answer.length, alive);
    }
  }, autoplay);

  const composer = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send(input);
      }}
      className="relative rounded-[12px] border border-line bg-panel transition-[border-color,box-shadow] focus-within:border-selected focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_8%,transparent)]"
    >
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey || !e.shiftKey)) {
            e.preventDefault();
            send(input);
          }
        }}
        rows={2}
        placeholder="A question, a thought, a wild idea…"
        className="block w-full resize-none bg-transparent px-4 pt-3.5 text-[15px] leading-[22px] text-fg outline-none placeholder:text-muted"
      />
      <div className="flex items-center gap-1 px-2.5 pt-2 pb-2.5">
        <button type="button" onClick={() => flash("Attach · files, images, PUKU.md")} className="grid size-8 place-items-center rounded-[8px] text-muted hover:bg-hover hover:text-fg">
          {Ico.plus}
        </button>
        <div className="relative">
          <button type="button" onClick={() => setModelMenu((m) => !m)} className="flex h-8 items-center gap-1.5 rounded-[8px] px-2 text-[13px] text-fg hover:bg-hover">
            Puku-ai 2.8 <span className="text-muted">{model}</span> <span className="text-muted">{Ico.chevron}</span>
          </button>
          <AnimatePresence>
            {modelMenu && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="absolute bottom-10 left-0 z-20 w-56 rounded-[10px] border border-line bg-panel p-1 shadow-xl">
                {(["Fast", "Deep"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => (setModel(m), setModelMenu(false))}
                    className={`flex w-full items-center justify-between rounded-[7px] px-2.5 py-2 text-left text-[13px] hover:bg-hover ${model === m ? "text-fg" : "text-muted"}`}
                  >
                    <span>
                      Puku-ai 2.8 {m}
                      <span className="block text-[11px] text-muted">{m === "Fast" ? "Quick answers" : "Longer reasoning, best for research"}</span>
                    </span>
                    {model === m && <span className="text-accent">{Ico.check}</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={() => setThink((v) => !v)}
          className={`flex h-8 items-center gap-1.5 rounded-[8px] px-2 text-[14px] transition-colors ${think ? "bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-accent" : "text-fg hover:bg-hover"}`}
        >
          {Ico.brain} Think
        </button>
        <button type="button" onClick={() => flash("Voice · listening (demo)")} className="ml-auto grid size-8 place-items-center rounded-[8px] text-muted hover:bg-hover hover:text-fg">
          {Ico.mic}
        </button>
        <button
          type="submit"
          disabled={!input.trim() || thinking}
          className="grid size-8 place-items-center rounded-[8px] bg-accent text-accent-ink transition-[opacity,transform] active:scale-95 disabled:bg-hover disabled:text-muted"
        >
          {Ico.up}
        </button>
      </div>
    </form>
  );

  return (
    <div ref={ref} onPointerDown={takeOver} onKeyDown={takeOver} className="relative flex size-full overflow-hidden bg-main font-sans text-fg">
      {/* Sidebar */}
      <aside className="flex w-[240px] shrink-0 flex-col border-r border-line bg-sidebar px-4 pt-[18px] pb-4">
        <div className="flex items-center justify-between pr-1 pl-1">
          <span className="flex items-center gap-[7px]">
            <Image src="/img/chat-logo.png" alt="" width={20} height={22} />
            <span className="text-[27px] leading-7 font-[570] tracking-[-0.04em]">puku</span>
          </span>
          <span className="text-muted">{Ico.panel}</span>
        </div>
        <div className="mt-[22px] flex gap-1.5">
          <div className="flex h-9 flex-1 items-center gap-2 rounded-[8px] border border-line bg-panel px-2.5 text-[12px] text-muted">
            {Ico.search} Search <span className="ml-auto text-[11px]">⌘K</span>
          </div>
          <button onClick={() => setActiveId(null)} className="grid size-9 place-items-center rounded-[8px] border border-line bg-panel text-fg transition-colors hover:bg-hover" aria-label="New chat">
            {Ico.plus}
          </button>
        </div>
        <div className="mt-1.5 flex gap-1.5">
          <div className="flex h-9 flex-1 items-center gap-2 rounded-[8px] border border-line bg-panel px-3 text-[12px] text-fg">
            {Ico.folder} All projects <span className="ml-auto text-muted">{Ico.chevron}</span>
          </div>
          <button onClick={() => flash("Artifacts · 6 saved")} className="grid size-9 place-items-center rounded-[8px] border border-line bg-panel transition-colors hover:bg-hover">
            {Ico.drive}
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-0.5 overflow-hidden">
          {threads.slice(0, 1).map((x) => (
            <ThreadRow key={x.id} x={x} active={x.id === activeId} onClick={() => setActiveId(x.id)} />
          ))}
          <div className="mt-4 mb-1 flex items-center justify-between px-2 text-[12px] text-muted">
            Recent <span>{Ico.sort}</span>
          </div>
          {threads.slice(1, 7).map((x) => (
            <ThreadRow key={x.id} x={x} active={x.id === activeId} onClick={() => setActiveId(x.id)} />
          ))}
        </div>
        <div className="mt-auto flex items-center gap-[18px] px-1.5 pb-3 text-fg">
          <span className="flex items-center gap-1.5 text-[12px]">{Ico.sliders} Customize</span>
          {Ico.download}
          {Ico.archive}
          {Ico.help}
        </div>
        <div className="flex flex-col gap-2 border-t border-line px-1.5 pt-3">
          <span className="flex items-center gap-2.5 text-[14px]">
            <span className="grid size-[18px] place-items-center rounded-full bg-[#E8D9A8] text-[9px]">ᵔᴥᵔ</span>Alex Morgan
          </span>
          <span className="flex items-center gap-3 text-[12px] font-[570]">
            Pro
            <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-hover">
              <motion.span className="block h-full bg-accent" animate={{ width: `${40 + Math.min(threads.length - 2, 6) * 6}%` }} />
            </span>
          </span>
        </div>
      </aside>

      {/* Main */}
      <section className="relative flex min-w-0 flex-1 flex-col">
        <AnimatePresence mode="wait">
          {!t ? (
            <motion.div key="new" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto w-[732px] pt-[31px]">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-[48px] leading-[53px] tracking-[-0.055em]">
                    Where will your
                    <br />
                    curiosity take you?
                  </h3>
                  <div className="mt-[33px] flex gap-3">
                    {SUGGEST.map((s) => (
                      <button key={s} onClick={() => send(s)} className="h-8 rounded-[6px] border border-line bg-panel px-2 text-[13px] transition-colors hover:border-selected hover:bg-hover">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}>
                  <Image src="/img/chat-computer.png" alt="" width={268} height={250} className="-mt-px" />
                </motion.div>
              </div>
              <div className="mt-8">{composer}</div>
              <div className="mt-2.5 text-right text-[10px] text-muted">⌘ / Ctrl + Enter to send</div>
            </motion.div>
          ) : (
            <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-0 flex-1 flex-col">
              <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto" data-lenis-prevent>
                <div className="mx-auto w-[732px] pt-[31px] pb-10">
                  <h3 className="text-[40px] leading-[46px] tracking-[-0.05em]">{t.title}</h3>
                  <div className="mt-[22px] flex gap-[34px] pl-[13px] text-[14px]">
                    {["Rename", "Share", "Archive", "Delete", "New project", "Preview streaming"].map((a) => (
                      <button
                        key={a}
                        onClick={() => (a === "Preview streaming" ? (setShown((s) => ({ ...s, [t.id]: 0 })), reveal(t.id, t.answer.length)) : flash(`${a} · demo`))}
                        className="transition-colors hover:text-accent"
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                  <div className="mt-[34px] rounded-[12px] bg-panel px-[26px] pt-2.5 pb-3.5">
                    {t.file && (
                      <div className="mb-3 w-[120px] rounded-[10px] border border-line p-1 text-[11px] leading-[17px]">
                        <div className="grid h-[72px] place-items-center rounded-[6px] bg-hover text-muted">{Ico.file}</div>
                        <div className="pt-1">{t.file}</div>
                        <div>TXT</div>
                      </div>
                    )}
                    <p className="text-[14px]">{t.ask}</p>
                  </div>
                  <div className="mt-3 flex justify-end gap-3.5 pr-1.5 text-muted">
                    <button onClick={() => flash("Copied message")} className="hover:text-fg">
                      {Ico.copy}
                    </button>
                    <button onClick={() => setInput(t.ask)} className="hover:text-fg">
                      {Ico.pen}
                    </button>
                  </div>

                  <button onClick={() => setOpenThought((o) => !o)} className="mt-[40px] flex items-center gap-2 text-[14px] text-muted hover:text-fg">
                    {Ico.clock} Thought process {!thinking ? <span className="text-success">{Ico.check}</span> : <span className="size-3 animate-spin rounded-full border border-accent border-t-transparent" />}
                    <span className={`transition-transform ${openThought ? "rotate-90" : ""}`}>{Ico.right}</span>
                  </button>
                  <AnimatePresence>
                    {(openThought || thinking) && (
                      <motion.ol initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 ml-[7px] overflow-hidden border-l border-line pl-4 text-[12.5px] leading-[22px] text-muted">
                        <li>Read attachment · 2 KB</li>
                        <li>{think || model === "Deep" ? "Reasoned through 4 options" : "Searched 3 sources · 0.8s"}</li>
                        <li>Checked PUKU.md for prior decisions</li>
                      </motion.ol>
                    )}
                  </AnimatePresence>

                  <div className="mt-4 flex flex-col">
                    {t.answer.slice(0, n).map((b, i) => (
                      <motion.div key={`${t.id}${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                        {b.t === "h" && (
                          <div className="flex items-center gap-3 text-[24px] leading-8 font-[570] tracking-[-0.02em]">
                            <Image src="/img/chat-logo.png" alt="" width={15} height={17} /> {b.text}
                          </div>
                        )}
                        {b.t === "h2" && <div className="mt-[30px] pl-[26px] text-[20px] font-[570] tracking-[-0.01em]">{b.text}</div>}
                        {b.t === "p" && (
                          <p className="mt-3 pl-[26px] text-[15px] leading-6">
                            {b.text}{" "}
                            {b.cite && (
                              <button
                                onClick={() => flash(`Source ${b.cite}: ${t.sources[(b.cite ?? 1) - 1]}`)}
                                className="rounded-[5px] bg-hover px-[7px] py-px text-[11px] text-muted transition-colors hover:bg-accent hover:text-accent-ink"
                              >
                                {b.cite}
                              </button>
                            )}
                            .
                          </p>
                        )}
                        {b.t === "table" && (
                          <table className="mt-[22px] ml-[26px] w-[706px] border-collapse text-[13px]">
                            <thead>
                              <tr className="bg-selected text-left font-[570]">
                                {b.head.map((h) => (
                                  <th key={h} className="border-2 border-line px-2.5 py-2">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {b.rows.map((r, ri) => (
                                <tr key={ri} className="transition-colors hover:bg-hover">
                                  {r.map((c, ci) => (
                                    <td key={ci} className="border-2 border-line px-2.5 py-2">
                                      {c}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                        {b.t === "code" && (
                          <div className="mt-4 ml-[26px] overflow-hidden rounded-[12px] bg-[#1C1C2A] text-[#E6E6F0]">
                            <div className="flex items-center justify-between border-b border-white/10 px-3 py-3 text-[11px] text-[#9A9AB8]">
                              {b.lang}
                              <button
                                onClick={() => {
                                  navigator.clipboard?.writeText(b.text);
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 1400);
                                }}
                                className="flex items-center gap-2 pr-4 text-[15px] hover:text-white"
                              >
                                {Ico.copy} {copied ? "Copied" : "Copy"}
                              </button>
                            </div>
                            <pre className="px-4 py-4 font-mono text-[13px]">
                              <span className="text-[#C4A7FF]">const</span> split = {"{"} train: <span className="text-[#9FD8A8]">0.8</span>, validation: <span className="text-[#9FD8A8]">0.2</span> {"}"};
                            </pre>
                          </div>
                        )}
                      </motion.div>
                    ))}
                    {n >= t.answer.length && !thinking && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 flex flex-wrap items-center gap-2 pl-[26px]">
                        {t.sources.map((s, i) => (
                          <span key={s} className="rounded-full border border-line bg-panel px-2.5 py-1 text-[11px] text-muted">
                            {i + 1} · {s}
                          </span>
                        ))}
                        <button onClick={() => flash("Sent to Puku CLI · task #318 queued")} className="ml-auto rounded-control bg-fg px-3 py-1.5 text-[12px] text-main transition-transform hover:-translate-y-0.5 active:scale-95">
                          Send to CLI →
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mx-auto w-[732px] pb-5">{composer}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-5 right-5 z-30 rounded-[10px] border border-line bg-panel px-3.5 py-2.5 text-[13px] shadow-lg">
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

function ThreadRow({ x, active, onClick }: { x: Thread; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className={`flex items-center gap-3 rounded-[4px] px-3 py-[9px] text-left text-[14px] transition-colors ${active ? "bg-selected" : "hover:bg-hover"}`}
    >
      <span className="shrink-0">{x.icon === "board" ? Ico.board : Ico.bubble}</span>
      <span className="truncate">{x.title}</span>
    </motion.button>
  );
}
