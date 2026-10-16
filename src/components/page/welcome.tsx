"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Stagger } from "@/components/fx/reveal";
import { Logo } from "@/components/ui/logo";
import { Apple, Chat, Check, Copy, Terminal } from "@/components/ui/icons";

/* Post-payment onboarding: pick how to use Puku. Rows tick to "done" as they're used (kept in localStorage). */

type Os = "Mac" | "Windows" | "Linux";
type ProductId = "desktop" | "cli" | "chat" | "bot" | "cowork";

const CLI_COMMAND = "curl -fsSL puku.sh/install | sh";
const STORAGE_KEY = "puku-welcome-done";
/** Rows that count toward setup progress (Cowork is early access, not set up yet). */
const COUNTED: ProductId[] = ["desktop", "cli", "chat", "bot"];

const Laptop = (p: { size?: number }) => (
  <svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M2 20h20" />
  </svg>
);
const Bot = (p: { size?: number }) => (
  <svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="4" y="8" width="16" height="12" rx="3" />
    <path d="M12 8V4M9 14h.01M15 14h.01" />
  </svg>
);
const People = (p: { size?: number }) => (
  <svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M3 20a6 6 0 0 1 12 0M15 20a4 4 0 0 1 6-3.5" />
  </svg>
);

function useDone() {
  const [done, setDone] = useState<ProductId[]>([]);
  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
    } catch {}
  }, []);
  const mark = (id: ProductId) =>
    setDone((d) => {
      if (d.includes(id)) return d;
      const next = [...d, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  return { done, mark };
}

export function Welcome({ plan }: { plan: string }) {
  const { done, mark } = useDone();
  const [os, setOs] = useState<Os>("Mac");
  useEffect(() => {
    const ua = navigator.userAgent;
    setOs(/Win/.test(ua) ? "Windows" : /Linux|X11/.test(ua) && !/Android/.test(ua) ? "Linux" : "Mac");
  }, []);
  const count = COUNTED.filter((id) => done.includes(id)).length;

  return (
    <section className="flex min-h-svh justify-center px-4 pt-[clamp(48px,8vw,96px)] pb-16">
      <Stagger immediate stagger={0.07} y={12} className="flex w-full max-w-[640px] flex-col gap-10">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="Puku home">
            <Logo size={24} />
          </Link>
          <div className="flex h-[30px] items-center gap-2 rounded-full border border-line bg-panel pr-3 pl-2">
            <span className="grid size-4 place-items-center rounded-full bg-success">
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                <motion.path d="M2 5.2 4.1 7.2 8 3" stroke="var(--panel)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.4, ease: EASE }} />
              </svg>
            </span>
            <span className="text-[13px] text-fg">{plan} is active</span>
            <span className="hidden font-mono text-[12px] text-muted xs:inline">· receipt sent</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-[clamp(32px,2.78vw,40px)] leading-[1.15] font-[570] tracking-[-0.03em] text-fg">How do you want to use Puku?</h1>
          <p className="text-[17px] leading-[26px] text-muted">Your plan works on every surface, sharing one memory. Set up one now and add the rest any time.</p>
        </div>

        <ul className="flex flex-col overflow-hidden rounded-panel border border-line bg-panel">
          <Row icon={<Laptop />} title="Puku Desktop" tag="RECOMMENDED" body="Editor, agents and memory in one app on your computer." done={done.includes("desktop")}>
            <Link href="/download" onClick={() => mark("desktop")} className="inline-flex h-9 items-center gap-2 rounded-control bg-fg px-3.5 text-[14px] font-[570] text-panel transition-transform active:scale-[0.97]">
              {os === "Mac" && <Apple size={14} />}
              Download for {os}
            </Link>
          </Row>
          <Row icon={<Terminal size={20} />} title="Puku CLI" body="Run agents from your terminal, in any repo." done={done.includes("cli")} stacked>
            <CopyLine onCopy={() => mark("cli")} />
          </Row>
          <Row icon={<Chat size={20} />} title="Puku Chat" body="Chat and research in your browser, nothing to install." done={done.includes("chat")}>
            <ActionLink href="https://chat.puku.sh/new" external onClick={() => mark("chat")} done={done.includes("chat")} doneLabel="Opened" label="Open Chat" />
          </Row>
          <Row icon={<Bot />} title="Puku Bot" body="Mention @puku in Slack or on GitHub issues and PRs." done={done.includes("bot")}>
            <ActionLink href="https://docs.puku.sh" external onClick={() => mark("bot")} done={done.includes("bot")} doneLabel="Connected" label="Connect" />
          </Row>
          <Row icon={<People />} title="Puku Cowork" soon body="Agents that work alongside your whole team." last>
            <ActionLink href="/coming-soon" label="Get early access" />
          </Row>
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3" aria-live="polite">
            <div className="flex gap-1" aria-hidden>
              {COUNTED.map((id, i) => (
                <span key={id} className={`h-1 w-5 rounded-full transition-colors duration-500 ${i < count ? "bg-success" : "bg-[var(--border)]"}`} />
              ))}
            </div>
            <span className="font-mono text-[12px] text-muted">
              {count} of {COUNTED.length} set up
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://docs.puku.sh" className="text-[14px] text-muted transition-colors hover:text-fg">
              Need help? Read the docs
            </a>
            <Link href="/" className="inline-flex h-9 items-center rounded-control border border-line bg-panel px-4 text-[14px] text-fg transition-colors hover:border-selected hover:bg-hover">
              Done
            </Link>
          </div>
        </div>
      </Stagger>
    </section>
  );
}

function Row({
  icon,
  title,
  body,
  tag,
  soon,
  done,
  stacked,
  last,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  tag?: string;
  soon?: boolean;
  done?: boolean;
  stacked?: boolean;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className={`flex gap-4 px-5 py-5 transition-colors hover:bg-[color-mix(in_oklab,var(--hover)_50%,transparent)] sm:pl-6 ${last ? "" : "border-b border-line"} ${stacked ? "items-start" : "flex-wrap items-center sm:flex-nowrap"}`}>
      <span className={`relative grid size-10 shrink-0 place-items-center rounded-[10px] border text-fg ${soon ? "border-dashed border-line text-muted" : "border-line bg-sidebar"}`}>
        {icon}
        <AnimatePresence>
          {done && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 26 }} className="absolute -right-1.5 -bottom-1.5 grid size-[18px] place-items-center rounded-full border-2 border-panel bg-success text-panel">
              <Check size={10} strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <div className={`flex min-w-0 flex-1 flex-col ${stacked ? "gap-2.5" : "gap-[3px]"}`}>
        <div className="flex flex-col gap-[3px]">
          <div className="flex items-center gap-2">
            <span className="text-[16px] leading-5 font-[570] text-fg">{title}</span>
            {tag && <span className="font-mono text-[11px] tracking-[0.06em] text-accent">{tag}</span>}
            {soon && <span className="rounded-control bg-hover px-[7px] py-0.5 text-[12px] text-muted">Soon</span>}
          </div>
          <span className="text-[14px] leading-5 text-muted">{body}</span>
        </div>
        {stacked && children}
      </div>
      {!stacked && <div className="ml-14 shrink-0 sm:ml-0">{children}</div>}
    </li>
  );
}

function ActionLink({ href, label, external, onClick, done, doneLabel }: { href: string; label: string; external?: boolean; onClick?: () => void; done?: boolean; doneLabel?: string }) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  if (done)
    return (
      <span className="flex h-9 items-center gap-3 text-[14px]">
        <span className="flex items-center gap-1.5 text-success">
          <Check size={14} strokeWidth={2.4} />
          {doneLabel}
        </span>
        <a href={href} {...ext} className="text-muted transition-colors hover:text-fg">
          Open again ↗
        </a>
      </span>
    );
  return (
    <a href={href} {...ext} onClick={onClick} className="inline-flex h-9 items-center rounded-control border border-line bg-panel px-3.5 text-[14px] text-fg transition-[background-color,border-color,transform] hover:border-selected hover:bg-hover active:scale-[0.97]">
      {label}
    </a>
  );
}

function CopyLine({ onCopy }: { onCopy: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex h-10 items-center justify-between gap-3 rounded-control border border-line bg-sidebar pr-1.5 pl-3.5">
      <code className="truncate font-mono text-[13px] text-fg">
        <span className="text-muted">$ </span>
        {CLI_COMMAND}
      </code>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(CLI_COMMAND);
          setCopied(true);
          onCopy();
          setTimeout(() => setCopied(false), 1500);
        }}
        aria-label="Copy install command"
        className="flex h-7 shrink-0 items-center gap-1.5 rounded-control border border-line bg-panel px-2.5 text-[13px] text-fg transition-colors hover:bg-hover"
      >
        {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
