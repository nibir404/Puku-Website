"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PixelCanvas } from "@/components/fx/pixel-canvas";
import { EASE, Reveal, SplitText, Stagger } from "@/components/fx/reveal";
import { Button } from "@/components/ui/button";
import { Chevron } from "@/components/ui/icons";
import { icon } from "@/lib/icon";

/* ── About ─────────────────────────────────────────────── */
export function Manifesto() {
  return (
    <section className="container-x flex flex-col gap-12 pt-[clamp(112px,10vw,184px)] pb-[clamp(72px,8.3vw,120px)] lg:flex-row lg:items-center lg:justify-between">
      <div className="flex max-w-[760px] flex-col gap-6">
        <Reveal y={8}>
          <div className="eyebrow tracking-[0.08em]">ABOUT PUKU</div>
        </Reveal>
        <SplitText as="h1" immediate delay={0.1} text="Software tools got loud. We're building a calmer place to work." className="text-[clamp(38px,3.89vw,56px)] leading-[1.1] font-[570] tracking-[-0.035em] text-fg" />
        <Reveal delay={0.4}>
          <p className="max-w-[620px] text-[19px] leading-[30px] text-muted">
            Puku is a small team making AI tools that stay out of your way: they ask before acting, remember what matters, and show their work.
          </p>
        </Reveal>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        className="relative aspect-[420/303] w-full max-w-[420px] shrink-0 overflow-hidden rounded-panel border border-line bg-sidebar"
      >
        <div className="absolute -inset-16 opacity-40">
          <PixelCanvas name="shader" mode="wave" fit="cover" align="center" className="size-full" />
        </div>
      </motion.div>
    </section>
  );
}

const PRINCIPLES = [
  { t: "Calm by default", b: "No streaks, no badges, no noise. Notifications only when something needs you." },
  { t: "Ask before acting", b: "Agents propose, people decide. Every write and command is visible and reversible." },
  { t: "One memory", b: "Context belongs to your project, not to a tab. Every surface reads the same notes." },
  { t: "Ship small, often", b: "Weekly releases, public changelog, and a feedback command in every product." },
];

export function Principles() {
  return (
    <section className="container-x pb-[clamp(72px,8.3vw,120px)]">
      <Reveal y={8}>
        <div className="pb-6 font-mono text-[12px] leading-4 tracking-[0.08em] text-muted">HOW WE BUILD</div>
      </Reveal>
      <div className="border-b border-line">
        {PRINCIPLES.map((p, i) => (
          <motion.div
            key={p.t}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
            className="group/pr relative flex flex-col gap-2 overflow-hidden border-t border-line py-8 md:flex-row md:gap-10"
          >
            <span className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-sidebar transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/pr:scale-y-100" />
            <span className="w-20 shrink-0 font-mono text-[13px] leading-4 text-accent md:pt-2.5">0{i + 1}</span>
            <span className="w-full shrink-0 text-[26px] leading-8 font-[570] tracking-[-0.015em] text-fg transition-transform duration-500 group-hover/pr:translate-x-2 md:w-[360px]">{p.t}</span>
            <span className="grow text-[16px] leading-[25px] text-muted md:pt-1">{p.b}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function JoinCards() {
  const [copied, setCopied] = useState(false);
  return (
    <section className="container-x pb-[clamp(72px,8.3vw,120px)]">
      <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3" itemClassName="flex" y={20}>
        <div className="flex w-full flex-col gap-4 rounded-panel border border-line bg-panel p-8">
          <span className="text-[22px] leading-7 font-[570] text-fg">Careers</span>
          <span className="text-[15px] leading-[23px] text-muted">We&apos;re not hiring openly yet. Leave your email and a link to something you made.</span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText("careers@puku.sh");
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="mt-auto w-fit font-mono text-[13px] leading-4 text-accent hover:underline"
          >
            {copied ? "✓ copied to clipboard" : "careers@puku.sh"}
          </button>
        </div>
        <a href="/img/logo.svg" download="puku-logo.svg" className="group/bk flex w-full flex-col gap-4 rounded-panel border border-line bg-panel p-8 transition-colors hover:border-accent">
          <span className="text-[22px] leading-7 font-[570] text-fg">Brand</span>
          <span className="text-[15px] leading-[23px] text-muted">Logos, colors and usage guidelines for press and partners.</span>
          <span className="mt-auto font-mono text-[13px] leading-4 text-accent">
            Download brand kit <span className="inline-block transition-transform group-hover/bk:translate-x-1">→</span>
          </span>
        </a>
        <a href="https://discord.gg/puku" target="_blank" rel="noreferrer" className="group/dc flex w-full flex-col gap-4 rounded-panel border border-line bg-panel p-8 transition-colors hover:border-accent">
          <span className="text-[22px] leading-7 font-[570] text-fg">Community</span>
          <span className="text-[15px] leading-[23px] text-muted">Questions, previews and early builds happen on Discord first.</span>
          <span className="mt-auto font-mono text-[13px] leading-4 text-accent">
            Join Discord <span className="inline-block transition-transform group-hover/dc:translate-x-0.5 group-hover/dc:-translate-y-0.5">↗</span>
          </span>
        </a>
      </Stagger>
    </section>
  );
}

/* ── Contact ───────────────────────────────────────────── */
const TOPICS = ["Support", "Billing", "Team plan", "Press", "Other"];
const PRODUCTS = ["Puku Editor", "Puku CLI", "Puku Chat", "Puku App", "Not sure"];

export function Contact() {
  const [topic, setTopic] = useState("Support");
  const [product, setProduct] = useState("Puku CLI");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!form.name.trim()) er.name = "Add your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = "Enter a valid work email";
    if (form.msg.trim().length < 10) er.msg = "A few more words, please";
    setErr(er);
    if (Object.keys(er).length) return;
    setState("sending");
    setTimeout(() => setState("sent"), 1100);
  };
  const field = "h-11 w-full rounded-control border bg-raised px-3.5 text-[14px] text-fg outline-none transition-[border-color,box-shadow] placeholder:text-muted focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_14%,transparent)]";

  const rows = [
    { i: icon(<><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></>, 18), t: "Support", s: "support@puku.sh", href: "mailto:support@puku.sh" },
    { i: icon(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>, 18), t: "Team & Enterprise", s: "sales@puku.sh", href: "mailto:sales@puku.sh" },
    { i: icon(<><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" /><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" /></>, 18), t: "Community", s: "discord.gg/puku", href: "https://discord.gg/puku" },
  ];

  return (
    <section className="container-x flex flex-col gap-14 pt-[clamp(112px,10vw,184px)] pb-[clamp(72px,8.3vw,120px)] lg:flex-row lg:gap-20">
      <div className="flex w-full shrink-0 flex-col gap-8 lg:w-[480px]">
        <div className="flex flex-col gap-3.5">
          <Reveal y={8}>
            <div className="eyebrow tracking-[0.08em]">CONTACT</div>
          </Reveal>
          <SplitText as="h1" immediate delay={0.1} text="Talk to a person." className="text-[clamp(40px,3.61vw,52px)] leading-[1.12] font-[570] tracking-[-0.04em] text-fg" />
          <Reveal delay={0.3}>
            <p className="text-[17px] leading-[26px] text-muted">We reply within one working day. For bugs, /feedback in any Puku product is faster: it attaches logs for you.</p>
          </Reveal>
        </div>
        <Stagger className="flex flex-col border-t border-line" stagger={0.06} y={10} immediate delay={0.4}>
          {rows.map((r) => (
            <a key={r.t} href={r.href} className="group/ct flex items-center gap-4 border-b border-line py-[18px]">
              <span className="text-fg transition-colors group-hover/ct:text-accent">{r.i}</span>
              <span className="flex grow flex-col">
                <span className="text-[15px] leading-[18px] text-fg">{r.t}</span>
                <span className="font-mono text-[12px] leading-4 text-muted">{r.s}</span>
              </span>
              <span className="text-muted opacity-0 transition-[opacity,translate] group-hover/ct:translate-x-1 group-hover/ct:opacity-100">→</span>
            </a>
          ))}
          <div className="flex items-center gap-4 border-b border-line py-[18px]">
            <span className="flex w-[18px] justify-center">
              <span className="relative size-2 rounded-[4px] bg-success">
                <span className="absolute inset-0 animate-ping rounded-[4px] bg-success opacity-60" />
              </span>
            </span>
            <span className="flex flex-col">
              <span className="text-[15px] leading-[18px] text-fg">All systems normal</span>
              <span className="font-mono text-[12px] leading-4 text-muted">status.puku.sh</span>
            </span>
          </div>
        </Stagger>
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: EASE }} className="relative grow">
        <AnimatePresence mode="wait">
          {state === "sent" ? (
            <motion.div key="sent" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full min-h-[480px] flex-col items-center justify-center gap-4 rounded-panel border border-line bg-panel p-9 text-center">
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="grid size-14 place-items-center rounded-full bg-success text-[24px] text-main">
                ✓
              </motion.span>
              <h2 className="text-[28px] leading-9 font-[570] tracking-[-0.02em] text-fg">Thanks, {form.name.split(" ")[0]}.</h2>
              <p className="max-w-[360px] text-[15px] leading-[23px] text-muted">
                Your {topic.toLowerCase()} message about {product} is in. We&apos;ll reply to <b className="text-fg">{form.email}</b> within one working day.
              </p>
              <button onClick={() => (setState("idle"), setForm({ name: "", email: "", msg: "" }))} className="mt-2 text-[14px] text-accent hover:underline">
                Send another
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} noValidate className="flex flex-col gap-5 rounded-panel border border-line bg-panel p-6 sm:p-9">
              <div className="flex flex-col gap-4 sm:flex-row">
                {(["name", "email"] as const).map((k) => (
                  <label key={k} className="flex grow basis-0 flex-col gap-2">
                    <span className="text-[13px] leading-4 text-fg">{k === "name" ? "Name" : "Work email"}</span>
                    <input
                      type={k === "email" ? "email" : "text"}
                      value={form[k]}
                      onChange={(e) => (setForm({ ...form, [k]: e.target.value }), setErr({ ...err, [k]: "" }))}
                      placeholder={k === "name" ? "Your name" : "you@company.com"}
                      className={`${field} ${err[k] ? "border-danger" : "border-line"}`}
                    />
                    <AnimatePresence>{err[k] && <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[12px] text-danger">{err[k]}</motion.span>}</AnimatePresence>
                  </label>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[13px] leading-4 text-fg">What&apos;s this about?</span>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((t) => (
                    <button type="button" key={t} onClick={() => setTopic(t)} className={`relative rounded-control border px-3.5 py-2 text-[13px] leading-4 transition-colors ${topic === t ? "border-line text-fg" : "border-line text-fg hover:bg-hover"}`}>
                      {topic === t && <motion.span layoutId="topic" className="absolute inset-0 rounded-control bg-selected" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
                      <span className="relative">{t}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative flex flex-col gap-2">
                <span className="text-[13px] leading-4 text-fg">Product</span>
                <button type="button" onClick={() => setOpen((o) => !o)} className={`${field} flex items-center justify-between border-line text-left`}>
                  {product}
                  <Chevron className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.ul initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full z-20 mt-1 w-full rounded-control border border-line bg-panel p-1 shadow-xl">
                      {PRODUCTS.map((p) => (
                        <li key={p}>
                          <button type="button" onClick={() => (setProduct(p), setOpen(false))} className={`flex w-full justify-between rounded-[4px] px-3 py-2 text-left text-[14px] hover:bg-hover ${p === product ? "text-fg" : "text-muted"}`}>
                            {p} {p === product && <span className="text-accent">✓</span>}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
              <label className="flex flex-col gap-2">
                <span className="flex justify-between text-[13px] leading-4 text-fg">
                  Message <span className="text-muted">{form.msg.length}/1000</span>
                </span>
                <textarea
                  value={form.msg}
                  maxLength={1000}
                  onChange={(e) => (setForm({ ...form, msg: e.target.value }), setErr({ ...err, msg: "" }))}
                  placeholder="What happened, and what did you expect?"
                  className={`${field} h-40 resize-none py-3 ${err.msg ? "border-danger" : "border-line"}`}
                />
                {err.msg && <span className="text-[12px] text-danger">{err.msg}</span>}
              </label>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[13px] leading-4 text-muted">
                  We&apos;ll only use this to reply.{" "}
                  <Link href="/privacy" className="underline-offset-2 hover:text-accent hover:underline">
                    Privacy policy.
                  </Link>
                </span>
                <Button type="submit" size="md" className="h-11 px-5 font-[570]" magnetic={false}>
                  {state === "sending" && <span className="size-3.5 animate-spin rounded-full border-2 border-panel border-t-transparent" />}
                  {state === "sending" ? "Sending…" : "Send message"}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* ── Legal ─────────────────────────────────────────────── */
const DOCS: Record<string, { title: string; short: string[]; sections: [string, string][] }> = {
  "Terms & conditions": {
    title: "Terms & conditions",
    short: ["You own your code and content", "Fair use limits apply per plan", "Cancel any time from Settings"],
    sections: [["1. Using Puku", "By creating an account you agree to use Puku in line with these terms and the acceptable use policy."], ["2. Your content", "You keep all rights to the code, prompts and files you bring to Puku."], ["3. Plans and billing", "Paid plans renew automatically until cancelled. Prices may change with 30 days' notice."]],
  },
  "Privacy policy": {
    title: "Privacy policy",
    short: ["Your code and chats are not used to train models", "You can export or delete your data any time", "We only share data with the processors listed here", "Payments are handled by SSLCommerz, not stored by us"],
    sections: [["1. What we collect", "Account details, usage metrics needed to enforce plan limits, and the content you send to agents while a session is active."], ["2. How we use it", "To run the product, keep it secure, and answer support requests. Never to train models."], ["3. Your choices", "Export everything from Settings → Data, or delete a single chat or your whole account at any time."]],
  },
  "Refund policy": {
    title: "Refund policy",
    short: ["Full refund within 14 days of a first payment", "Pro-rated refunds when you downgrade a Team", "BDT payments refunded to the original wallet"],
    sections: [["1. Eligibility", "First-time payments on Pro and Team are fully refundable within 14 days."], ["2. How to request", "Write to billing@puku.sh from your account email with the invoice number."], ["3. Timing", "Card refunds take 5–10 working days; bKash, Nagad and Rocket refunds take up to 3."]],
  },
  "Cookie policy": { title: "Cookie policy", short: ["Essential cookies only by default", "No third-party ad trackers"], sections: [["1. Essential cookies", "Used to keep you signed in and remember your theme."], ["2. Analytics", "Privacy-friendly, cookieless page counts. Opt out any time."]] },
  "Acceptable use": { title: "Acceptable use", short: ["No malware, abuse or spam", "Respect rate limits and other users"], sections: [["1. Prohibited use", "Don't use Puku to build malware, attack systems you don't own, or harass people."], ["2. Enforcement", "We may suspend accounts that put other users or infrastructure at risk."]] },
  Subprocessors: { title: "Subprocessors", short: ["Hosting, payments and email providers only"], sections: [["1. Current list", "Cloud hosting (Singapore, Frankfurt) · SSLCommerz (payments) · Postmark (email)."], ["2. Changes", "We announce new subprocessors 30 days in advance on the changelog."]] },
};

export function Legal() {
  const [doc, setDoc] = useState("Privacy policy");
  const d = DOCS[doc];
  return (
    <section className="container-x flex flex-col gap-10 pt-[clamp(112px,10vw,184px)] pb-[clamp(72px,8.3vw,120px)] lg:flex-row lg:gap-20">
      <nav className="flex w-full shrink-0 gap-0.5 overflow-x-auto pb-2 lg:sticky lg:top-28 lg:w-60 lg:flex-col lg:self-start lg:overflow-visible lg:pb-0" data-lenis-prevent>
        <span className="hidden px-2.5 pb-2.5 font-mono text-[11px] leading-[14px] tracking-[0.08em] text-muted lg:block">LEGAL</span>
        {Object.keys(DOCS).map((k) => (
          <button key={k} onClick={() => setDoc(k)} className={`relative shrink-0 rounded-control px-2.5 py-2 text-left text-[14px] leading-[18px] transition-colors ${doc === k ? "text-fg" : "text-muted hover:text-fg"}`}>
            {doc === k && <motion.span layoutId="legal" className="absolute inset-0 rounded-control bg-hover" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
            <span className="relative">{k}</span>
          </button>
        ))}
      </nav>
      <AnimatePresence mode="wait">
        <motion.div key={doc} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }} className="flex w-full max-w-[720px] flex-col gap-6">
          <h1 className="text-[clamp(40px,3.89vw,56px)] leading-[1.07] font-[570] tracking-[-0.04em] text-fg">{d.title}</h1>
          <div className="flex flex-wrap gap-4 font-mono text-[12px] leading-4">
            <span className="text-muted">Effective Oct 1, 2026</span>
            <Link href="/changelog" className="text-accent hover:underline">Compare with previous version →</Link>
          </div>
          <div className="flex flex-col gap-2.5 rounded-panel border border-line bg-panel p-6">
            <span className="text-[15px] leading-[18px] font-[570] text-fg">The short version</span>
            <ul className="font-mono text-[13px] leading-6 text-fg">
              {d.short.map((s, i) => (
                <motion.li key={s} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                  <span className="text-success">✓</span> {s}
                </motion.li>
              ))}
            </ul>
          </div>
          {d.sections.map(([h, b]) => (
            <div key={h} id={h.toLowerCase().replace(/[^a-z]+/g, "-")} className="group/sec flex scroll-mt-28 flex-col gap-3 pt-4">
              <h2 className="flex items-center gap-2 text-[24px] leading-[30px] font-[570] text-fg">
                {h}
                <a href={`#${h.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="text-[16px] text-muted opacity-0 transition-opacity group-hover/sec:opacity-100">#</a>
              </h2>
              <p className="text-[16px] leading-[27px] text-muted">{b}</p>
            </div>
          ))}
          <p className="border-t border-line pt-6 text-[14px] leading-[18px] text-muted">
            Questions about this policy: <a href="mailto:privacy@puku.sh" className="text-fg hover:text-accent">privacy@puku.sh</a>
          </p>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

/* ── 404 ───────────────────────────────────────────────── */
export function NotFoundView() {
  return (
    <section className="relative flex flex-col items-center gap-4 overflow-hidden px-4 pt-[clamp(140px,12vw,184px)] text-center">
      <Reveal y={8}>
        <div className="eyebrow tracking-[0.08em]">ERROR 404</div>
      </Reveal>
      <SplitText as="h1" immediate delay={0.1} text="This page took a different branch." className="max-w-[900px] text-[clamp(40px,4.44vw,64px)] leading-[1.03] tracking-[-0.04em] text-fg" />
      <Reveal delay={0.3}>
        <p className="max-w-[560px] text-[clamp(17px,1.39vw,20px)] leading-[1.5] text-muted">The link may be old, or the page moved. Everything else is right where you left it.</p>
      </Reveal>
      <Reveal delay={0.45} className="flex flex-wrap justify-center gap-2.5 pt-4">
        <Button href="/" size="md" className="h-11 px-5 text-[15px]">
          Back to home
        </Button>
        <Button href="/changelog" variant="secondary" size="md" className="h-11 px-5 font-mono text-[13px]">
          $ git checkout main
        </Button>
      </Reveal>
      <div className="relative -mt-10 h-[clamp(360px,38.9vw,560px)] w-full max-w-[1280px]">
        <div className="absolute inset-0 opacity-45">
          <PixelCanvas name="ascii-hero" mode="field" fit="cover" align="center" className="size-full" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: "linear-gradient(to bottom, transparent, var(--main))" }} />
      </div>
    </section>
  );
}
