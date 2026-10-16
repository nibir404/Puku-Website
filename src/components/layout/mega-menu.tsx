"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Blocks, Book, Cloud, Palette, Phone, Wand } from "@/components/ui/icons";
import { IsoArt } from "@/components/stories/iso-art";
import { POSTS } from "@/lib/posts";
import { PUBLISHED } from "@/lib/stories";

/* Full-width mega menus for the top nav. Panels span the navbar's width (see Nav). */

type Img = { light: string; dark: string; contain?: boolean };

/** Products with a screenshot: the main row of the Product menu. */
export const PRODUCT_CARDS: { href: string; title: string; body: string; img: Img }[] = [
  { href: "/editor", title: "Puku Editor", body: "The desktop editor with agents built in.", img: { light: "/img/story-editor-light.png", dark: "/img/story-editor-dark.jpg" } },
  // TODO: point at Puku Desktop's own page/download once it exists.
  { href: "/download", title: "Puku Desktop", body: "Chat and agents in a desktop app.", img: { light: "/img/chat-computer.png", dark: "/img/chat-computer.png", contain: true } },
  { href: "/cli", title: "Puku CLI", body: "Automation from your terminal.", img: { light: "/img/story-cli-light.png", dark: "/img/story-cli-dark.jpg" } },
  { href: "/chat", title: "Puku Chat", body: "Chat and research in your browser.", img: { light: "/img/story-chat-light.png", dark: "/img/story-chat-dark.jpg" } },
];

const Bot = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="4" y="8" width="16" height="12" rx="3" />
    <path d="M12 8V4M9 14h.01M15 14h.01" />
  </svg>
);
const Shield = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const Clock = ({ size = 18, className }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4l3 2" />
  </svg>
);
const Doc = ({ size = 18, className }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 4h11l5 5v11H4z" />
    <path d="M15 4v5h5" />
  </svg>
);

/** Everything else on the paid plans (mirrors Pricing). Bot and Feluda link to Pricing until they have pages. */
export const PLAN_EXTRAS = [
  { href: "/app", icon: Phone, title: "Puku App", body: "Mobile chat, install coming soon", tag: "PREVIEW" },
  { href: "/pricing", icon: Bot, title: "Puku Bot", body: "@puku in Slack and GitHub", tag: "TEAM" },
  { href: "/pricing", icon: Shield, title: "Feluda", body: "Security review on every PR", tag: "TEAM" },
];
export const SOON = [
  { icon: Wand, title: "Puku Co-Work", img: "/img/cowork.jpg" },
  { icon: Palette, title: "Puku Design" },
  { icon: Cloud, title: "Puku Cloud" },
];

export const RESOURCES = [
  { href: "/blog", icon: Book, title: "Blog", body: "Product notes, guides and engineering" },
  { href: "/stories", icon: Blocks, title: "Stories", body: "Milestones and partnerships" },
  { href: "/changelog", icon: Clock, title: "Changelog", body: "What shipped this week" },
  { href: "https://docs.puku.sh", icon: Doc, title: "Docs ↗", body: "Guides and reference" },
];

const panel = "flex gap-3 rounded-panel border border-line bg-panel p-3 shadow-[0_2px_4px_rgb(40_44_34/0.06),0_12px_32px_rgb(40_44_34/0.1)] dark:shadow-[0_2px_4px_rgb(0_0_0/0.3),0_12px_32px_rgb(0_0_0/0.4)]";
const label = "px-2.5 pt-2.5 pb-1.5 font-mono text-[11px] leading-[14px] tracking-[0.08em] text-muted";
const rise = (i: number) => ({ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.03 * i, duration: 0.22 } });

function Shot({ img, alt }: { img: Img; alt: string }) {
  const fit = img.contain ? "object-contain object-center p-3" : "object-cover object-left-top";
  return (
    <span className="relative block aspect-[16/10] overflow-hidden rounded-[8px] border border-line bg-sidebar">
      <Image src={img.light} alt={alt} fill sizes="(min-width: 1440px) 300px, 22vw" className={`theme-img-light ${fit} transition-transform duration-500 group-hover/card:scale-[1.03]`} />
      <Image src={img.dark} alt="" fill sizes="(min-width: 1440px) 300px, 22vw" className={`theme-img-dark ${fit} transition-transform duration-500 group-hover/card:scale-[1.03]`} />
    </span>
  );
}

export function ProductMenu({ isActive }: { isActive: (href: string) => boolean }) {
  return (
    <div className={panel}>
      <div className="grid flex-1 grid-cols-2 gap-1 lg:grid-cols-4">
        {PRODUCT_CARDS.map((p, i) => (
          <motion.div key={p.title} {...rise(i)}>
            <Link href={p.href} className={`group/card flex h-full flex-col gap-3.5 rounded-[10px] p-2.5 pb-3.5 transition-colors hover:bg-hover ${isActive(p.href) ? "bg-hover" : ""}`}>
              <Shot img={p.img} alt={`${p.title} screenshot`} />
              <span className="flex flex-col gap-1 px-1">
                <span className="text-[15px] leading-5 font-[570] text-fg">{p.title}</span>
                <span className="text-[13px] leading-[18px] text-muted">{p.body}</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="flex w-[300px] shrink-0 flex-col border-l border-line pl-3">
        <div className={label}>ALSO ON YOUR PLAN</div>
        {PLAN_EXTRAS.map((x, i) => (
          <motion.div key={x.title} {...rise(i + 4)}>
            <Link href={x.href} className="group/item flex items-center gap-3 rounded-[8px] p-2.5 transition-colors hover:bg-hover">
              <span className="grid size-8 shrink-0 place-items-center rounded-[8px] border border-line bg-sidebar text-fg transition-colors group-hover/item:text-accent">
                <x.icon size={16} />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="flex items-center gap-2">
                  <span className="text-[14px] leading-[18px] font-[570] text-fg">{x.title}</span>
                  <span className="font-mono text-[11px] leading-[14px] text-accent">{x.tag}</span>
                </span>
                <span className="truncate text-[12px] leading-4 text-muted">{x.body}</span>
              </span>
            </Link>
          </motion.div>
        ))}
        <div className={`${label} pt-4`}>COMING SOON</div>
        {SOON.map((s) => (
          <div key={s.title} className="flex items-center gap-3 px-2.5 py-2 text-muted">
            {s.img ? (
              <span className="relative h-9 w-14 shrink-0 overflow-hidden rounded-[6px] border border-line">
                <Image src={s.img} alt="" fill sizes="56px" className="object-cover object-left-top" />
              </span>
            ) : null}
            <span className={`flex-1 text-[14px] leading-[18px] ${s.img ? "text-fg" : ""}`}>{s.title}</span>
            <span className="rounded-control bg-hover px-2 py-[3px] text-[12px] leading-4">Soon</span>
          </div>
        ))}
        <Link href="/coming-soon" className="group/wl mt-auto flex items-center justify-between border-t border-line px-2.5 pt-3 pb-1">
          <span className="text-[13px] text-fg">Get early access</span>
          <span className="text-[13px] text-accent transition-transform duration-300 group-hover/wl:translate-x-0.5">Join the waitlist →</span>
        </Link>
      </div>
    </div>
  );
}

export function ResourcesMenu({ isActive }: { isActive: (href: string) => boolean }) {
  const story = PUBLISHED[0];
  const posts = POSTS.slice(0, 3);
  return (
    <div className={panel}>
      <div className="flex w-[280px] shrink-0 flex-col border-r border-line pr-3">
        <div className={label}>EXPLORE</div>
        {RESOURCES.map((r, i) => (
          <motion.div key={r.title} {...rise(i)}>
            <Link href={r.href} className={`group/item flex gap-3 rounded-[8px] p-2.5 transition-colors hover:bg-hover ${isActive(r.href) ? "bg-hover" : ""}`}>
              <r.icon size={18} className="mt-px shrink-0 text-fg transition-colors group-hover/item:text-accent" />
              <span className="flex flex-col gap-0.5">
                <span className="text-[14px] leading-[18px] font-[570] text-fg">{r.title}</span>
                <span className="text-[12px] leading-4 text-muted">{r.body}</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
      {story && (
        <motion.div {...rise(2)} className="min-w-0 flex-1">
          <Link href={`/stories/${story.slug}`} className="group/card flex h-full flex-col gap-3.5 rounded-[10px] p-2.5 pb-3.5 transition-colors hover:bg-hover">
            <span className="flex justify-between font-mono text-[11px] leading-[14px] tracking-[0.08em] text-muted">
              <span>LATEST STORY</span>
              <span className="tracking-normal">
                {story.chapters} chapters · {story.minutes} min
              </span>
            </span>
            <span className="flex h-[196px] items-center justify-center overflow-hidden rounded-[8px] border border-line bg-sidebar">
              <IsoArt name={story.art} label={story.title} className="w-[260px]" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-[15px] leading-5 font-[570] text-fg">{story.title}</span>
              <span className="line-clamp-2 text-[13px] leading-[18px] text-muted">{story.dek}</span>
            </span>
          </Link>
        </motion.div>
      )}
      <div className="flex w-[380px] shrink-0 flex-col border-l border-line pl-3">
        <div className="flex items-center justify-between px-2.5 pt-2.5 pb-1.5">
          <span className="font-mono text-[11px] leading-[14px] tracking-[0.08em] text-muted">FROM THE BLOG</span>
          <Link href="/blog" className="text-[12px] text-accent">
            All posts →
          </Link>
        </div>
        {posts.map((p, i) => (
          <motion.div key={p.slug} {...rise(i + 3)}>
            <Link href={`/blog/${p.slug}`} className="group/post flex flex-col gap-1 rounded-[8px] p-2.5 transition-colors hover:bg-hover">
              <span className="flex gap-2 font-mono text-[11px] leading-[14px]">
                <span className="text-accent">{p.cat.toUpperCase()}</span>
                <span className="text-muted">{p.date.toUpperCase()}</span>
              </span>
              <span className="text-[14px] leading-5 font-[570] text-fg transition-colors group-hover/post:text-accent">{p.title}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
