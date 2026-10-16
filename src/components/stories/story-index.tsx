"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Reveal, SplitText } from "@/components/fx/reveal";
import { IsoArt } from "@/components/stories/iso-art";
import { STORIES, type StoryCat, type StoryMeta } from "@/lib/stories";

const FILTERS: ("All" | StoryCat)[] = ["All", "Milestones", "Models", "Partners"];

export function StoryIndex() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const featured = STORIES.find((s) => s.featured)!;
  const rest = STORIES.filter((s) => s !== featured && (filter === "All" || s.cat === filter));
  const showFeatured = filter === "All" || featured.cat === filter;

  return (
    <>
      <section className="container-x flex flex-col justify-between gap-8 pt-[clamp(120px,12.5vw,180px)] pb-14 lg:flex-row lg:items-end">
        <div className="flex max-w-[760px] flex-col gap-6">
          <Reveal y={8}>
            <div className="eyebrow tracking-[0.08em]">STORIES</div>
          </Reveal>
          <SplitText as="h1" immediate delay={0.1} text="What we've built, and how we got here." className="text-[clamp(40px,3.89vw,56px)] leading-[1.1] font-[570] tracking-[-0.035em] text-fg" />
          <Reveal delay={0.3}>
            <p className="max-w-[600px] text-[clamp(17px,1.32vw,19px)] leading-[1.58] text-muted">Milestones, models and partnerships, each told as a short story you can scroll through.</p>
          </Reveal>
        </div>
        <Reveal delay={0.35} className="flex flex-wrap gap-2" >
          <div role="tablist" aria-label="Filter stories" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`rounded-control border px-3.5 py-2 text-[14px] leading-5 transition-colors active:scale-[0.97] ${
                  filter === f ? "border-fg bg-fg text-main" : "border-line bg-panel text-fg hover:border-accent hover:text-accent"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container-x flex flex-col gap-6 pb-[clamp(72px,8.3vw,120px)]">
        <AnimatePresence initial={false}>
          {showFeatured && (
            <motion.div key="featured" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.5, ease: EASE }}>
              <Featured story={featured} />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {rest.map((s, i) => (
              <motion.div
                key={s.slug}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, delay: i * 0.06 } }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
              >
                <Card story={s} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {rest.length === 0 && !showFeatured && <p className="py-12 text-center text-[15px] text-muted">No stories here yet. Check back soon.</p>}
      </section>
    </>
  );
}

function Featured({ story }: { story: StoryMeta }) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="group/f flex flex-col overflow-hidden rounded-panel border border-line bg-panel transition-colors duration-300 hover:border-accent lg:flex-row"
    >
      <div className="flex flex-col justify-between gap-10 p-8 lg:w-[520px] lg:shrink-0 lg:p-12">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[12px] tracking-[0.08em] text-accent">FEATURED · {story.cat.toUpperCase()}</span>
            <span className="font-mono text-[12px] text-muted">
              {story.chapters} chapters · {story.minutes} min
            </span>
          </div>
          <h2 className="text-[clamp(32px,3.06vw,44px)] leading-[1.09] font-[570] tracking-[-0.035em] text-fg">{story.title}</h2>
          <p className="text-[17px] leading-[26px] text-muted">{story.dek}</p>
        </div>
        <span className="flex items-center gap-2 text-[15px] font-[570] text-accent">
          Read the story <span className="font-mono transition-transform duration-300 group-hover/f:translate-x-1">→</span>
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center border-t border-line bg-sidebar p-6 lg:border-t-0 lg:border-l">
        <IsoArt name={story.art} label="Puku AI joining NVIDIA Inception, drawn as isometric blocks" className="w-full max-w-[640px]" />
      </div>
    </Link>
  );
}

function Card({ story }: { story: StoryMeta }) {
  const body = (
    <>
      <div className="flex h-[240px] items-center justify-center border-b border-line bg-sidebar">
        <IsoArt name={story.art} label={story.title} className="w-[384px] max-w-full" />
      </div>
      <div className="flex flex-col gap-3 p-7">
        <div className="flex justify-between font-mono text-[12px]">
          <span className="tracking-[0.08em] text-accent">{story.cat.toUpperCase()}</span>
          <span className="text-muted">{story.published ? `${story.minutes} min` : "Coming soon"}</span>
        </div>
        <h3 className="text-[24px] leading-[30px] font-[570] tracking-[-0.02em] text-fg">{story.title}</h3>
        <p className="text-[15px] leading-[23px] text-muted">{story.dek}</p>
      </div>
    </>
  );
  const cls = "flex h-full flex-col overflow-hidden rounded-panel border border-line bg-panel transition-[transform,border-color] duration-300";
  return story.published ? (
    <Link href={`/stories/${story.slug}`} className={`${cls} hover:-translate-y-1 hover:border-accent`}>
      {body}
    </Link>
  ) : (
    <div className={cls} aria-disabled>
      {body}
    </div>
  );
}
