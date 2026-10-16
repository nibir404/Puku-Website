"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isFocusRoute } from "@/lib/routes";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { PixelCanvas } from "@/components/fx/pixel-canvas";
import { useThemeSwitch } from "@/components/ui/theme-toggle";
import { EASE } from "@/components/fx/reveal";

const COLS = [
  {
    title: "PRODUCT",
    links: [
      ["Puku Editor", "/editor"],
      ["Puku CLI", "/cli"],
      ["Puku Chat", "/chat"],
      ["Puku App", "/app"],
      ["Pricing", "/pricing"],
    ],
  },
  {
    title: "RESOURCES",
    links: [
      ["Docs", "https://docs.puku.sh"],
      ["Changelog", "/changelog"],
      ["Download", "/download"],
      ["Blog", "/blog"],
      ["Status", "/contact"],
    ],
  },
  {
    title: "COMPANY",
    links: [
      ["About", "/about"],
      ["Stories", "/stories"],
      ["Contact", "/contact"],
      ["Support", "/contact"],
      ["Careers · soon", ""],
    ],
  },
  {
    title: "LEGAL",
    links: [
      ["Terms", "/privacy"],
      ["Privacy", "/privacy"],
      ["Refunds", "/privacy"],
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  if (isFocusRoute(pathname)) return null;
  return (
    <footer className="relative isolate overflow-hidden border-t border-line bg-sidebar">
      {/* Glow */}
      <div
        aria-hidden
        className="absolute top-[300px] left-1/2 -z-10 h-[520px] w-[1000px] max-w-[140vw] -translate-x-1/2 rounded-[50%] blur-[40px] dark:h-[560px]"
        style={{
          background: "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 9%, transparent), transparent)",
        }}
      />
      {/* Dhaka skyline · pixel (pixels assemble bottom→top 900ms; windows twinkle) */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[clamp(260px,41.7vw,600px)]">
        <PixelCanvas name="skyline" mode="assemble" fit="cover" align="bottom" className="size-full opacity-70 dark:opacity-55" />
      </div>

      <div className="container-x relative flex min-h-[clamp(720px,58.3vw,840px)] flex-col justify-between pt-16 md:pt-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex w-full max-w-[360px] shrink-0 flex-col gap-5"
          >
            <Link href="/" className="flex w-fit items-center gap-2.5">
              <Logo size={20} />
              <span className="text-[18px] leading-[22px] text-fg">Puku</span>
            </Link>
            <p className="text-[clamp(26px,2.3vw,32px)] leading-[1.125] tracking-[-0.03em] text-fg">
              A calmer place to build, ship and learn.
            </p>
            <ThemeSegment />
          </motion.div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4 sm:gap-14">
            {COLS.map((col, ci) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, delay: 0.06 * ci, ease: EASE }}
                className="flex flex-col"
              >
                <div className="text-[11px] leading-[30px] tracking-[0.1em] text-muted">{col.title}</div>
                {col.links.map(([label, href]) =>
                  href ? (
                    <Link
                      key={label}
                      href={href}
                      className="group/fl relative w-fit text-[14px] leading-[30px] text-fg transition-colors hover:text-accent"
                    >
                      <span className="inline-block transition-transform duration-300 ease-out group-hover/fl:translate-x-1">{label}</span>
                    </Link>
                  ) : (
                    <span key={label} className="text-[14px] leading-[30px] text-muted">
                      {label}
                    </span>
                  ),
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div
          className="relative -mx-[clamp(16px,5.56vw,80px)] mt-24 flex flex-col items-start gap-2 px-[clamp(16px,5.56vw,80px)] py-5 sm:h-[72px] sm:flex-row sm:items-center sm:justify-between sm:py-0"
          style={{
            backgroundImage: "linear-gradient(180deg, color-mix(in oklab, var(--sidebar) 0%, transparent) 0%, color-mix(in oklab, var(--sidebar) 95%, transparent) 40%)",
          }}
        >
          <span className="text-[12px] leading-4 text-muted">© 2026 Puku AI</span>
          <span className="text-[12px] leading-4 text-muted">Visa · Mastercard · bKash · Nagad via SSLCommerz</span>
          <span className="flex gap-1 text-[12px] leading-4 text-fg">
            {["Discord", "YouTube", "LinkedIn"].map((s, i) => (
              <span key={s}>
                <a href="#" className="transition-colors hover:text-accent">
                  {s}
                </a>
                {i < 2 && <span className="text-muted"> · </span>}
              </span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}

function ThemeSegment() {
  const { mounted, theme, apply } = useThemeSwitch();
  const current = mounted ? theme ?? "system" : "light";
  return (
    <div role="radiogroup" aria-label="Theme" className="flex w-fit gap-0.5 rounded-[8px] border border-line p-[3px]">
      {(["system", "light", "dark"] as const).map((t) => (
        <button
          key={t}
          role="radio"
          aria-checked={current === t}
          onClick={() => apply(t)}
          className={`relative px-2.5 py-1 text-[12px] leading-4 capitalize transition-colors duration-200 ${current === t ? "text-fg" : "text-muted hover:text-fg"}`}
        >
          {current === t && (
            <motion.span layoutId="theme-pill" className="absolute inset-0 rounded-control bg-hover" transition={{ type: "spring", stiffness: 500, damping: 36 }} />
          )}
          <span className="relative">{t}</span>
        </button>
      ))}
    </div>
  );
}
