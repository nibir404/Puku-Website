"use client";

import Image from "next/image";
import { PixelCanvas } from "@/components/fx/pixel-canvas";
import { Stagger } from "@/components/fx/reveal";
import { Cloud, Palette, Wand } from "@/components/ui/icons";

const ITEMS = [
  { name: "Puku Co-Work", Icon: Wand, body: "A shared space where your team and agents plan, split and review work together.", art: "cowork" },
  { name: "Puku Design", Icon: Palette, body: "Turn a sketch or a screenshot into components that use your design system.", art: "design" },
  { name: "Puku Cloud", Icon: Cloud, body: "Run agents in the background on hosted sandboxes, with logs you can replay.", art: "cloud" },
] as const;

export function SoonCards() {
  return (
    <section className="container-x pb-10">
      <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3" itemClassName="flex" y={24}>
        {ITEMS.map(({ name, Icon, body, art }) => (
          <article key={name} className="group/soon flex w-full flex-col gap-7 rounded-panel border border-line bg-panel p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-selected sm:p-8">
            <div className="relative grid aspect-[350/170] place-items-center overflow-hidden rounded-control border border-line bg-sidebar">
              {art === "cowork" ? (
                <Image src="/img/cowork.jpg" alt="Puku Co-Work preview" fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover object-left-top transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/soon:scale-105" />
              ) : (
                <>
                  <div className="absolute inset-0 opacity-60">
                    <PixelCanvas name={art === "design" ? "cta" : "shader"} mode={art === "design" ? "gather" : "wave"} fit="cover" align="bottom" className="size-full" />
                  </div>
                  <span className="relative font-mono text-[12px] tracking-[0.1em] text-muted transition-colors group-hover/soon:text-fg">{name.toUpperCase()}</span>
                </>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2.5 text-[20px] leading-6 font-[570] text-fg">
                  <Icon className="transition-transform duration-500 group-hover/soon:rotate-12" />
                  {name}
                </span>
                <span className="rounded-control bg-sidebar px-2 py-[3px] text-[12px] leading-4 text-muted">Soon</span>
              </div>
              <p className="text-[15px] leading-[22px] text-muted">{body}</p>
            </div>
          </article>
        ))}
      </Stagger>
    </section>
  );
}
