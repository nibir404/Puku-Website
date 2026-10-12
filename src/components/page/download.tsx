"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Stagger } from "@/components/fx/reveal";
import { TextLink } from "@/components/ui/button";

type OS = "macOS" | "Windows" | "Linux";
const PLATFORMS: { os: OS; builds: { name: string; file: string; size: string }[] }[] = [
  { os: "macOS", builds: [{ name: "Apple silicon", file: ".dmg", size: "142 MB" }, { name: "Intel", file: ".dmg", size: "148 MB" }] },
  { os: "Windows", builds: [{ name: "x64", file: ".exe", size: "131 MB" }, { name: "arm64", file: ".exe", size: "129 MB" }] },
  { os: "Linux", builds: [{ name: "Debian / Ubuntu", file: ".deb", size: "118 MB" }, { name: "Fedora / RHEL", file: ".rpm", size: "119 MB" }, { name: "Any distro", file: "AppImage", size: "126 MB" }] },
];

export function Platforms() {
  const [os, setOs] = useState<OS>("macOS");
  const [dl, setDl] = useState<{ key: string; p: number } | null>(null);
  useEffect(() => {
    const ua = navigator.userAgent;
    setOs(/Win/.test(ua) ? "Windows" : /Linux|X11/.test(ua) && !/Android/.test(ua) ? "Linux" : "macOS");
  }, []);
  useEffect(() => {
    if (!dl || dl.p >= 100) return;
    const t = setTimeout(() => setDl((d) => d && { ...d, p: Math.min(100, d.p + 4 + Math.random() * 9) }), 90);
    return () => clearTimeout(t);
  }, [dl]);

  return (
    <section className="border-t border-line py-14">
      <div className="container-x flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-[28px] leading-[34px] font-[570] tracking-[-0.02em] text-fg">Puku Editor</h2>
          <span className="font-mono text-[12px] leading-4 text-muted">
            v2.7.0 · released Oct 6 · <TextLink href="/changelog" className="font-mono text-[12px]">release notes</TextLink>
          </span>
        </div>
        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3" itemClassName="flex" y={16}>
          {PLATFORMS.map((p) => (
            <div
              key={p.os}
              onMouseEnter={() => setOs(p.os)}
              className={`flex w-full flex-col gap-4 rounded-panel border bg-panel p-6 transition-[border-color,box-shadow] duration-300 ${os === p.os ? "border-fg shadow-[0_18px_40px_-28px_rgb(40_44_34/0.45)]" : "border-line"}`}
            >
              <div className="flex justify-between">
                <span className="text-[17px] leading-[22px] font-[570] text-fg">{p.os}</span>
                <AnimatePresence>
                  {os === p.os && (
                    <motion.span layoutId="detected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-mono text-[11px] leading-[14px] text-accent">
                      DETECTED
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex flex-col border-t border-line">
                {p.builds.map((b, i) => {
                  const key = p.os + b.name;
                  const active = dl?.key === key;
                  return (
                    <button
                      key={b.name}
                      onClick={() => setDl({ key, p: 0 })}
                      className={`group/dl relative flex justify-between overflow-hidden py-3 text-left ${i < p.builds.length - 1 ? "border-b border-line" : ""}`}
                    >
                      {active && <motion.span className="absolute inset-y-0 left-0 bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]" animate={{ width: `${dl!.p}%` }} />}
                      <span className="relative text-[14px] leading-[18px] text-fg">
                        {b.name} <span className="text-[12px] text-muted opacity-0 transition-opacity group-hover/dl:opacity-100">· {b.size}</span>
                      </span>
                      <span className="relative font-mono text-[12px] leading-4 text-accent">
                        {active ? (dl!.p >= 100 ? "✓ ready" : `${Math.round(dl!.p)}%`) : (
                          <>
                            {b.file} <span className="inline-block transition-transform group-hover/dl:translate-y-0.5">↓</span>
                          </>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
