"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { EASE, Reveal, SplitText } from "@/components/fx/reveal";
import { ThemeImage } from "@/components/home/hero";

type P = "Editor" | "CLI" | "Chat" | "App";
type Entry = { date: string; product: P; v: string; title: string; body?: string; notes?: string[]; img?: "cli" | "editor" | "chat"; major?: boolean };

const ENTRIES: Entry[] = [
  {
    date: "Oct 9, 2026",
    product: "CLI",
    v: "1.8.66",
    major: true,
    title: "Calmer sandbox and permissions",
    body: "/sandbox and /permissions now show a single readable table of what the agent can touch, with one-key toggles. Install instructions are clearer on every platform.",
    notes: ["+ /sandbox shows paths, network and shell in one view", "+ /permissions supports per-tool allow / ask / deny", "~ Clearer errors when the installer lacks write access"],
    img: "cli",
  },
  {
    date: "Oct 6, 2026",
    product: "Editor",
    v: "2.7.0",
    major: true,
    title: "Agent panel, rebuilt",
    body: "Keep or review every change per file, and see exactly what the agent read before it wrote. puku-ai-2.7 is now the default model.",
    img: "editor",
  },
  { date: "Oct 2, 2026", product: "CLI", v: "1.8.65", title: "Smoother installer and /feedback", notes: ["+ Automatic PKCE session refresh", "+ /feedback sends a report with logs attached", "~ Tighter /tmp write permissions"] },
  { date: "Sep 28, 2026", product: "Chat", v: "0.9.0", major: true, title: "Research mode with receipts", body: "Every claim is cited and anything unverified is flagged. Send any answer to the CLI as a task.", img: "chat" },
  { date: "Sep 24, 2026", product: "CLI", v: "1.8.63", title: "Skills respect user-level config", notes: ["~ Skills-directory permission checks use user-level config", "~ Friendlier install script under non-interactive sudo"] },
];
const OLDER: Entry[] = [
  { date: "Sep 18, 2026", product: "App", v: "0.3.0", title: "TestFlight preview opens", notes: ["+ Chats, attachments and projects on iPhone", "+ Swipe to approve a pending command"] },
  { date: "Sep 12, 2026", product: "Editor", v: "2.6.4", title: "Faster next-edit completion", notes: ["~ 38% lower latency on suggestions", "+ ⇥ accepts, ⎋ dismisses"] },
  { date: "Sep 5, 2026", product: "Chat", v: "0.8.2", title: "Artifacts beside the chat", notes: ["+ Docs, code and slides open in a side panel", "~ Copy keeps formatting"] },
];

export function Changelog() {
  const [f, setF] = useState<"All" | P>("All");
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const list = [...ENTRIES, ...(more ? OLDER : [])].filter((e) => f === "All" || e.product === f);

  return (
    <>
      <section className="container-x flex flex-col gap-6 border-b border-line pt-[clamp(112px,10vw,144px)] pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3">
          <Reveal y={8}>
            <div className="eyebrow tracking-[0.08em]">CHANGELOG</div>
          </Reveal>
          <SplitText as="h1" immediate delay={0.1} text="What's new in Puku" className="text-[clamp(40px,3.89vw,56px)] leading-[1.07] font-[570] tracking-[-0.035em] text-fg" />
          <Reveal delay={0.3}>
            <p className="text-[17px] leading-[22px] text-muted">Every release across Editor, CLI, Chat and App.</p>
          </Reveal>
        </div>
        <Reveal delay={0.35} className="flex flex-col gap-3 lg:items-end">
          <div className="flex w-fit flex-wrap gap-0.5 rounded-control border border-line bg-panel p-1">
            {(["All", "Editor", "CLI", "Chat", "App"] as const).map((t) => (
              <button key={t} onClick={() => setF(t)} className={`relative rounded-control px-3.5 py-1.5 text-[13px] leading-4 ${f === t ? "text-main" : "text-muted hover:text-fg"}`}>
                {f === t && <motion.span layoutId="cl-filter" className="absolute inset-0 rounded-control bg-fg" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
          <span className="font-mono text-[12px] leading-4 text-muted">
            <a href="#" className="hover:text-accent">RSS</a> · <a href="/coming-soon" className="hover:text-accent">subscribe by email</a>
          </span>
        </Reveal>
      </section>

      <section className="container-x pb-[clamp(72px,8.3vw,120px)]">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((e) => (
            <motion.article
              layout
              key={e.v + e.product}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex flex-col gap-4 border-b border-line py-12 md:flex-row md:gap-10"
            >
              <div className="flex w-[200px] shrink-0 flex-row gap-3 md:flex-col md:gap-1.5">
                <span className="font-mono text-[13px] leading-4 text-muted">{e.date}</span>
                <span className="flex items-center gap-2">
                  <span className="rounded-control border border-accent bg-panel px-2 py-0.5 font-mono text-[11px] leading-[14px] text-accent">{e.product}</span>
                  <span className="font-mono text-[13px] leading-4 text-fg">{e.v}</span>
                </span>
              </div>
              <div className="hidden w-[13px] shrink-0 flex-col items-center gap-2 self-stretch pt-1.5 md:flex">
                <span className={`size-[9px] shrink-0 rounded-[5px] ${e.major ? "bg-accent shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_15%,transparent)]" : "border border-line bg-main"}`} />
                <motion.span className="w-px grow origin-top bg-line" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }} />
              </div>
              <div className="flex min-w-0 grow flex-col gap-3.5">
                <h2 className="text-[24px] leading-[30px] font-[570] tracking-[-0.01em] text-fg">{e.title}</h2>
                {e.body && <p className="max-w-[680px] text-[15px] leading-6 text-muted">{e.body}</p>}
                {e.notes && (
                  <ul className="font-mono text-[13px] leading-6 text-fg">
                    {e.notes.map((n) => (
                      <li key={n}>
                        <span className={n.startsWith("+") ? "text-success" : "text-warning"}>{n[0]}</span>
                        {n.slice(1)}
                      </li>
                    ))}
                  </ul>
                )}
                {e.img && (
                  <div className="group/img mt-1 w-full max-w-[760px] overflow-hidden rounded-panel border border-line bg-panel">
                    <ThemeImage
                      light={e.img === "cli" ? "/img/story-cli-light.png" : e.img === "editor" ? "/img/story-editor-light.png" : "/img/story-chat-light.png"}
                      dark={e.img === "cli" ? "/img/story-cli-dark.jpg" : e.img === "editor" ? "/img/story-editor-dark.jpg" : "/img/story-chat-dark.jpg"}
                      alt={e.title}
                      width={2400}
                      height={1500}
                      sizes="(max-width: 800px) 100vw, 760px"
                      className="h-auto w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/img:scale-[1.02]"
                    />
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
        {!list.length && <p className="py-16 text-center text-muted">No {f} releases yet.</p>}
        {!more && (
          <div className="flex justify-center pt-10">
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => (setMore(true), setLoading(false)), 700);
              }}
              className="flex h-[42px] items-center gap-2 rounded-control border border-line px-5 text-[14px] text-fg transition-colors hover:border-selected hover:bg-hover active:scale-[0.98]"
            >
              {loading && <span className="size-3.5 animate-spin rounded-full border-2 border-fg border-t-transparent" />}
              Load older releases
            </button>
          </div>
        )}
      </section>
    </>
  );
}
