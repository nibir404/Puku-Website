"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { PixelCanvas } from "@/components/fx/pixel-canvas";
import { EASE, SplitText } from "@/components/fx/reveal";
import { Button, CopyCommand } from "@/components/ui/button";
import { Apple } from "@/components/ui/icons";
import { ScaledFrame } from "@/components/mock/frame";
import { EditorMock } from "@/components/mock/editor";

export function ThemeImage({
  light,
  dark,
  alt,
  width,
  height,
  className = "",
  priority,
  sizes,
}: {
  light: string;
  dark: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <>
      <Image src={light} alt={alt} width={width} height={height} priority={priority} sizes={sizes} className={`theme-img-light ${className}`} />
      <Image src={dark} alt={alt} width={width} height={height} priority={priority} sizes={sizes} className={`theme-img-dark ${className}`} />
    </>
  );
}

type Cta = { label: string; href: string; apple?: boolean };
export type HeroProps = {
  chipTag?: string;
  chipText?: string;
  chipHref?: string;
  title?: string;
  sub?: string;
  primary?: Cta;
  secondary?: "copy" | Cta;
  note?: string;
  product?: React.ReactNode;
  stage?: "field" | "wave";
};

export function Hero({
  chipTag = "NEW",
  chipText = "Puku 2.8 · subagents in parallel",
  chipHref = "/changelog",
  title = "A calm workbench for\nshipping software.",
  sub = "Editor, CLI, Chat and App share one memory of your project. Works with the repo you already have.",
  primary = { label: "Download for Mac", href: "/download", apple: true },
  secondary = "copy",
  note = "Version 2.8 for Apple Silicon · Windows and Linux in beta",
  product,
  stage = "field",
}: HeroProps = {}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Hero product · scroll: rise 120px, tilt 14° → 0°
  const productRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: productRef, offset: ["start end", "start 0.25"] });
  const sp = useSpring(p, { stiffness: 120, damping: 30, mass: 0.4 });
  const rotateX = useTransform(sp, [0, 1], [14, 0]);
  const y = useTransform(sp, [0, 1], [120, 0]);
  const scale = useTransform(sp, [0, 1], [0.94, 1]);
  const glow = useTransform(sp, [0.3, 1], [0, 1]);
  const copyY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={ref} className="relative pt-16">
      {/* Stage */}
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative h-[clamp(760px,69.4vw,1000px)] overflow-hidden rounded-[clamp(20px,1.94vw,28px)] border border-line bg-sidebar"
        >
          <div className="absolute inset-x-0 top-40 h-full opacity-[0.28] dark:opacity-[0.34]">
            {stage === "field" ? (
              <PixelCanvas name="ascii-hero" mode="field" fit="cover" align="top" className="size-full" />
            ) : (
              <PixelCanvas name="shader" mode="wave" fit="cover" align="top" className="size-full" />
            )}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
            style={{ background: "linear-gradient(to bottom, transparent, var(--sidebar))" }}
          />
        </motion.div>
      </div>

      {/* Copy */}
      <motion.div style={{ y: copyY, opacity: copyOpacity }} className="absolute inset-x-0 top-16 z-10 flex justify-center px-4 pt-[clamp(72px,7.6vw,110px)]">
        <div className="flex w-full max-w-[1000px] flex-col items-center gap-6 text-center md:gap-7">
          {chipText && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: EASE }}>
            <Link
              href={chipHref}
              className="group/chip flex h-[30px] items-center gap-2 rounded-control border border-line bg-panel px-3 transition-[border-color,box-shadow] duration-300 hover:border-accent/50 hover:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_10%,transparent)]"
            >
              <span className="relative font-mono text-[12px] leading-4 text-accent">
                {chipTag}
                <span className="absolute -top-0.5 -right-1.5 size-1 animate-ping rounded-full bg-accent" />
              </span>
              <span className="text-[13px] leading-4 text-fg">
                {chipText}{" "}
                <span className="inline-block transition-transform duration-300 group-hover/chip:translate-x-0.5">→</span>
              </span>
            </Link>
          </motion.div>
          )}
          <SplitText
            as="h1"
            immediate
            delay={0.25}
            stagger={0.06}
            text={title}
            className="text-[clamp(44px,6.67vw,96px)] leading-[1] tracking-[-0.045em] text-fg"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: EASE }}
            className="max-w-[620px] text-[clamp(17px,1.39vw,20px)] leading-[1.5] text-muted"
          >
            {sub}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
            className="flex w-full flex-col items-center justify-center gap-2.5 sm:w-auto sm:flex-row"
          >
            <Button href={primary.href} size="lg" className="w-full sm:w-auto" wrapClassName="w-full sm:w-auto">
              {primary.apple && <Apple size={15} className="-mt-0.5" />} {primary.label}
            </Button>
            {secondary === "copy" ? (
              <CopyCommand className="w-full justify-center sm:w-auto" />
            ) : (
              <Button href={secondary.href} variant="secondary" size="lg" className="w-full sm:w-auto" wrapClassName="w-full sm:w-auto">
                {secondary.label}
              </Button>
            )}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.95 }}
            className="text-[13px] leading-4 text-muted"
          >
            {note}
          </motion.p>
        </div>
      </motion.div>

      {/* Product */}
      <div className="relative z-10 -mt-[clamp(200px,25vw,360px)] flex justify-center px-4 pb-[clamp(40px,4.9vw,70px)] [perspective:1600px] sm:px-6">
        <motion.div
          ref={productRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
          style={{ rotateX, y, scale, transformOrigin: "50% 0%" }}
          className="relative w-full max-w-[1200px] will-change-transform"
        >
          <motion.div
            aria-hidden
            style={{ opacity: glow }}
            className="absolute inset-0 rounded-[12px] shadow-[var(--glow-product)]"
          />
          <div className="relative overflow-hidden rounded-[12px] border border-line shadow-[0_30px_80px_-20px_rgb(40_44_34/0.28)] dark:shadow-[0_30px_80px_-10px_rgb(0_0_0/0.6)]">
            {product ?? (
              <ScaledFrame width={1200} height={750}>
                <EditorMock start="welcome" />
              </ScaledFrame>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
