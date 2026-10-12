import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { ScaledFrame } from "@/components/mock/frame";
import { EditorMock } from "@/components/mock/editor";
import { TerminalMock } from "@/components/mock/terminal";
import { Platforms } from "@/components/page/download";
import { InstallTabs } from "@/components/page/cli";
import { FeatureRow, Heading } from "@/components/page/blocks";
import { Reveal } from "@/components/fx/reveal";

export const metadata: Metadata = { title: "Download", description: "Download Puku — one workbench for Editor, CLI, Chat and App." };

export default function DownloadPage() {
  return (
    <>
      <Hero
        stage="wave"
        chipText=""
        title="Download Puku"
        sub="One workbench for Editor, CLI, Chat and App. Free to start."
        note="Version 2.7.0 · Apple Silicon · .dmg 142 MB · Intel build below"
        product={
          <ScaledFrame width={1200} height={750}>
            <EditorMock start="diff" />
          </ScaledFrame>
        }
      />
      <Platforms />
      <section className="container-x pt-[clamp(72px,8.3vw,120px)]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex w-full shrink-0 flex-col gap-6 lg:w-[520px]">
            <Reveal y={8}>
              <div className="font-mono text-[12px] leading-4 tracking-[0.08em] text-muted">02 — PUKU CLI</div>
            </Reveal>
            <Heading text="Install the CLI in one line." className="font-[570] tracking-[-0.02em]!" />
            <InstallTabs />
            <p className="text-[15px] leading-[22px] text-muted">macOS, Linux and WSL. Or npm install -g @puku/cli.</p>
          </div>
          <Reveal delay={0.2} className="w-full overflow-hidden rounded-panel border border-line shadow-[var(--shadow-window)]">
            <ScaledFrame width={1200} height={750}>
              <TerminalMock />
            </ScaledFrame>
          </Reveal>
        </div>
      </section>
      <section className="container-x py-[clamp(72px,8.3vw,120px)]">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <Reveal y={8}>
              <div className="font-mono text-[12px] leading-4 tracking-[0.08em] text-muted">03 — TRY PUKU</div>
            </Reveal>
            <Heading text="Every surface, one account." className="font-[570] tracking-[-0.02em]!" />
          </div>
          <FeatureRow
            items={[
              { title: "Puku Editor", body: "The AI-native editor for macOS, Windows and Linux." },
              { title: "Puku CLI", body: "Agents in your terminal, on any repo." },
              { title: "Puku Chat", body: "Runs in your browser at chat.puku.sh." },
              { title: "Puku App · preview", body: "iOS via TestFlight. Android coming soon." },
            ]}
          />
        </div>
      </section>
    </>
  );
}
