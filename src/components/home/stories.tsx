"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { PixelCanvas } from "@/components/fx/pixel-canvas";
import { EASE, Reveal, SplitText, Stagger } from "@/components/fx/reveal";
import { DotGrid } from "@/components/ui/icons";
import { ScaledFrame } from "@/components/mock/frame";
import { EditorMock } from "@/components/mock/editor";
import { TerminalMock } from "@/components/mock/terminal";
import { ChatMock } from "@/components/mock/chat";
import { PhoneMock } from "@/components/mock/phone";

/* ── Stats band ─────────────────────────────────────────── */
const STATS = [
  { label: "SURFACES", icon: "/img/stat-surfaces.svg", w: 30, body: "Editor, CLI, Chat and App on one plan" },
  { label: "MEMORY", icon: "/img/stat-memory.svg", w: 18, body: "PUKU.md, read by every agent" },
  { label: "SILENT WRITES", icon: "/img/stat-writes.svg", w: 30, body: "Every change shown as a diff first" },
];

export function StatsBand() {
  return (
    <section className="container-x">
      <Stagger
        stagger={0.08}
        className="mx-auto grid max-w-[1280px] grid-cols-1 overflow-hidden rounded-panel border border-line bg-panel shadow-[0_1px_2px_rgb(40_44_34/0.04)] sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.1fr]"
        itemClassName="flex"
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            className="group/stat flex w-full flex-col justify-between gap-10 border-b border-line p-7 sm:border-r lg:gap-14 lg:border-b-0"
          >
            <div className="font-mono text-[12px] leading-4 tracking-[0.08em] text-muted">{s.label}</div>
            <div className="flex flex-col gap-2.5">
              <span
                aria-hidden
                className="block h-[42px] bg-fg transition-transform duration-500 ease-[var(--ease-spring)] group-hover/stat:-translate-y-1"
                style={{ width: s.w, mask: `url(${s.icon}) center / 100% 100% no-repeat`, WebkitMask: `url(${s.icon}) center / 100% 100% no-repeat` }}
              />
              <div className="text-[15px] leading-[18px] text-fg">{s.body}</div>
            </div>
          </div>
        ))}
        <div className="flex w-full flex-col justify-between gap-6 p-7">
          <p className="text-[15px] leading-[23px] text-fg">Open a repo. Puku reads it, remembers it, and asks before it touches anything.</p>
          <Link
            href="/download"
            className="group/gs flex h-[42px] w-fit items-center gap-2.5 rounded-[10px] border border-line bg-raised pr-3.5 pl-1 shadow-[0_1px_2px_rgb(40_44_34/0.06)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgb(40_44_34/0.1)]"
          >
            <span className="grid size-[34px] place-items-center rounded-[8px] bg-fg text-main transition-transform duration-500 group-hover/gs:rotate-90">
              <DotGrid />
            </span>
            <span className="text-[14px] leading-[18px] font-[570] text-fg">Get started free</span>
          </Link>
        </div>
      </Stagger>
    </section>
  );
}

/* ── Scenes intro ──────────────────────────────────────── */
export function ScenesIntro() {
  return (
    <section className="container-x flex flex-col items-center gap-4 pt-[clamp(72px,8.3vw,120px)] pb-10 text-center">
      <SplitText text="Give every agent the whole picture." className="max-w-[900px] text-[clamp(34px,3.89vw,56px)] leading-[1.07] tracking-[-0.035em] text-fg" />
      <Reveal delay={0.25}>
        <p className="max-w-[620px] text-[clamp(17px,1.39vw,20px)] leading-[1.5] text-muted">
          The same project memory follows you from the editor to the terminal, to chat, to your phone.
        </p>
      </Reveal>
    </section>
  );
}

/* ── Story sections ─────────────────────────────────────── */
export type Story = {
  step: number;
  lead: string;
  caption: string;
  from: "up" | "left" | "right";
  mock: "editor" | "cli" | "chat" | "phone" | "editor-welcome" | "chat-new";
  border?: boolean;
};

export const STORIES: Story[] = [
  {
    step: 1,
    lead: "Edit with an agent.",
    caption: "Puku Editor reads your project, proposes the change inline, and runs the tests before you keep it.",
    from: "up",
    mock: "editor",
    border: true,
  },
  {
    step: 2,
    lead: "Run it from the terminal.",
    caption: "Puku CLI plans, shows the diff, and asks before it runs anything. Same memory as the editor.",
    from: "right",
    mock: "cli",
    border: true,
  },
  {
    step: 3,
    lead: "Research in Chat.",
    caption: "Ask with sources, then send the answer straight to the CLI as a task.",
    from: "left",
    mock: "chat",
  },
  {
    step: 4,
    lead: "Check in from your phone.",
    caption: "Approve a command, answer a question, or read the PR from anywhere. Your sessions keep running on your machine.",
    from: "up",
    mock: "phone",
  },
];

export function StorySection({ story }: { story: Story }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const s = useSpring(scrollYProgress, { stiffness: 100, damping: 28, mass: 0.5 });
  // backdrop parallax 0.3x
  const bgY = useTransform(s, [0, 1], [-60, 60]);
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start 0.95", "start 0.3"] });
  const e = useSpring(enter, { stiffness: 120, damping: 26 });
  const dx = story.from === "right" ? 48 : story.from === "left" ? -48 : 0;
  const winX = useTransform(e, [0, 1], [dx, 0]);
  const winY = useTransform(e, [0, 1], [120, 0]);
  const winScale = useTransform(e, [0, 1], [0.94, 1]);
  const glow = useTransform(e, [0.5, 1], [0, 1]);

  return (
    <section className={`relative overflow-hidden ${story.border ? "border-t border-line" : ""}`}>
      <div ref={ref} className="container-x flex flex-col gap-8 pt-10 pb-[clamp(56px,6.1vw,88px)]">
        <div className="relative mx-auto flex aspect-[1120/680] w-full max-w-[1120px] items-end justify-center overflow-hidden rounded-[clamp(14px,1.67vw,24px)] border border-line bg-sidebar max-sm:aspect-auto max-sm:pt-12">
          <motion.div style={{ y: bgY }} className="absolute -inset-y-16 inset-x-0 opacity-[0.42]">
            <PixelCanvas name="shader" mode="wave" fit="cover" align="center" className="size-full" />
          </motion.div>
          <div className="absolute top-4 left-4 z-10 font-mono text-[11px] tracking-[0.1em] text-muted sm:top-6 sm:left-6">
            0{story.step} / 04
          </div>

          {story.mock !== "phone" && (
            <motion.div
              style={{ x: winX, y: winY, scale: winScale, transformOrigin: "50% 100%" }}
              className="relative w-[89.3%] max-sm:w-full"
            >
              <motion.div aria-hidden style={{ opacity: glow }} className="absolute inset-0 rounded-t-[14px] shadow-[0_-10px_80px_4px_color-mix(in_oklab,var(--accent)_10%,transparent)] dark:shadow-[0_-10px_90px_6px_color-mix(in_oklab,var(--accent)_20%,transparent)]" />
              <div className="relative overflow-hidden rounded-t-[14px] border border-b-0 border-line shadow-[var(--shadow-window)]">
                {story.mock === "chat" || story.mock === "chat-new" ? (
                  <ScaledFrame width={1440} height={900}>
                    <ChatMock start={story.mock === "chat-new" ? "new" : "thread"} />
                  </ScaledFrame>
                ) : (
                  <ScaledFrame width={1200} height={750}>
                    {story.mock === "editor" ? <EditorMock start="diff" /> : story.mock === "editor-welcome" ? <EditorMock start="welcome" /> : <TerminalMock />}
                  </ScaledFrame>
                )}
              </div>
            </motion.div>
          )}
          {story.mock === "phone" && <PhoneFrame enterY={winY} />}
        </div>

        <div className="mx-auto w-full max-w-[1120px]">
          <Reveal>
            <p className="max-w-[760px] text-[clamp(18px,1.53vw,22px)] leading-[1.45] text-muted">
              <span className="block text-fg">{story.lead}</span>
              {story.caption}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PhoneFrame({ enterY }: { enterY: MotionValue<number> }) {
  return (
    <motion.div style={{ y: enterY }} className="relative flex h-[min(620px,91%)] w-[330px] max-w-[78%] shrink-0 rounded-t-[44px] bg-fg px-2.5 pt-2.5 max-sm:h-[520px]">
      <PhoneMock />
    </motion.div>
  );
}

export function Stories() {
  return (
    <>
      {STORIES.map((s) => (
        <StorySection key={s.step} story={s} />
      ))}
    </>
  );
}
