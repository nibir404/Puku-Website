"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Check, Copy } from "./icons";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-panel hover:bg-[color-mix(in_oklab,var(--text)_86%,var(--accent))] shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]",
  secondary: "bg-panel text-fg border border-line hover:bg-hover hover:border-selected",
  ghost: "text-muted hover:text-fg hover:bg-hover",
};
const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[13px] leading-4 rounded-[8px]",
  md: "h-10 px-4 text-[14px] leading-[18px] rounded-control",
  lg: "h-[46px] px-5 text-[15px] leading-[18px] rounded-control",
};

export const buttonClass = (variant: Variant = "primary", size: Size = "md", extra = "") =>
  `group/btn relative inline-flex select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-sans font-[430] transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 ${variants[variant]} ${sizes[size]} ${extra}`;

/** Primary/secondary button with a soft magnetic pull and light sweep on hover. */
export function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  magnetic = true,
  wrapClassName = "",
  ...rest
}: {
  wrapClassName?: string;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  magnetic?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart">) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (!magnetic || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-0 transition-none group-hover/btn:animate-[sweep_900ms_ease-out] group-hover/btn:opacity-100"
        />
      )}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  );
  const cls = buttonClass(variant, size, className);

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset} className={`inline-flex ${wrapClassName}`}>
      {href ? (
        <Link href={href} className={cls}>
          {inner}
        </Link>
      ) : (
        <button className={cls} {...rest}>
          {inner}
        </button>
      )}
    </motion.div>
  );
}

/** `$ curl … | sh` pill — click copies, icon morphs to a check. */
export function CopyCommand({ command = "curl -fsSL puku.sh/install | sh", className = "" }: { command?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className={`group/copy relative inline-flex h-[46px] max-w-full items-center gap-2.5 rounded-control border border-line bg-panel px-4 font-mono text-[13px] leading-4 text-fg transition-[background-color,border-color,transform] duration-200 hover:border-selected hover:bg-hover active:scale-[0.98] ${className}`}
      aria-label={`Copy install command: ${command}`}
    >
      <span className="truncate">
        <span className="text-muted">$ </span>
        {command}
      </span>
      <span className="relative grid size-4 shrink-0 place-items-center text-muted transition-colors group-hover/copy:text-fg">
        <Copy
          className={`absolute transition-[opacity,scale,rotate] duration-300 ${copied ? "scale-50 rotate-45 opacity-0" : "scale-100 opacity-100"}`}
        />
        <Check
          className={`absolute text-success transition-[opacity,scale,rotate] duration-300 ${copied ? "scale-100 opacity-100" : "scale-50 -rotate-45 opacity-0"}`}
        />
      </span>
      <span
        className={`pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-control bg-fg px-2 py-1 font-sans text-[12px] text-panel transition-[opacity,translate] duration-200 ${
          copied ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        Copied
      </span>
    </button>
  );
}

export function TextLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`group/link inline-flex items-center gap-1 text-accent transition-colors hover:text-[color-mix(in_oklab,var(--accent)_80%,var(--text))] ${className}`}
    >
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-px transition-[background-size] duration-300 ease-out group-hover/link:bg-[length:100%_1px]">
        {children}
      </span>
      <span className="inline-block transition-transform duration-300 ease-out group-hover/link:translate-x-1">→</span>
    </Link>
  );
}
