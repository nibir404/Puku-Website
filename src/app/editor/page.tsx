import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { StorySection } from "@/components/home/stories";
import { CTA } from "@/components/home/sections";
import { ScaledFrame } from "@/components/mock/frame";
import { EditorMock } from "@/components/mock/editor";
import { Eyebrow, FeatureRow, Heading, MentionCard, NextEditCard, Section, ShortcutList, Statement } from "@/components/page/blocks";
import { Reveal } from "@/components/fx/reveal";
import { GraphRun } from "@/components/page/graph-run";

export const metadata: Metadata = { title: "Puku Editor", description: "The editor where the agent sits beside you." };

export default function EditorPage() {
  return (
    <>
      <Hero
        chipTag="EDITOR"
        chipText="Puku Editor 2.7 · next-edit completion"
        title="The editor where the agent sits beside you."
        sub="A fast desktop editor with an agent that reads your project, proposes diffs, and waits for you to keep them."
        note="Apple silicon · Intel · x64 · arm64 · imports VS Code settings"
        product={
          <ScaledFrame width={1200} height={750}>
            <EditorMock start="diff" />
          </ScaledFrame>
        }
      />
      <StorySection
        story={{ step: 1, lead: "Open any repo.", caption: "Clone, open or generate a workspace. Your VS Code settings, keybindings and extensions come with you.", from: "up", mock: "editor-welcome", border: true }}
      />
      <Section>
        <div className="flex flex-col gap-14">
          <div className="flex flex-col gap-5">
            <Eyebrow className="tracking-[0.12em]">01 — PUKU GRAPH</Eyebrow>
            <Heading text="Puku Graph guides the agent to the right code." className="max-w-[820px] leading-[1.167]! tracking-[-0.02em]!" />
          </div>
          <GraphRun />
          <Statement lead="Shared context." body="Puku keeps what it learns across sessions and teammates, so nobody explains the codebase twice." />
        </div>
      </Section>
      <Section>
        <div className="flex flex-col gap-14">
          <div className="flex flex-col gap-3">
            <Eyebrow className="tracking-[0.08em]">02 — WHAT IT DOES</Eyebrow>
            <Heading medium text="Less switching. More finished work." className="max-w-[700px]" />
          </div>
          <Reveal className="flex flex-col gap-4 lg:flex-row">
            <NextEditCard />
            <MentionCard />
          </Reveal>
          <FeatureRow
            items={[
              { title: "Skills", body: "Save a workflow once as a skill. Run it from the Editor, CLI or Chat." },
              { title: "Git-aware reviews", body: "Ask for a review of your branch. Comments land inline, ready to accept." },
              { title: "Keyboard first", body: "Every action has a shortcut. ⌘K finds the rest." },
              { title: "Brings your setup", body: "Imports VS Code settings, keybindings and extensions on first launch." },
            ]}
          />
        </div>
      </Section>
      <section className="container-x pt-[clamp(72px,8.3vw,120px)]">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="flex w-full max-w-[400px] shrink-0 flex-col gap-3">
            <Eyebrow>03 — SHORTCUTS</Eyebrow>
            <Heading text="Learn six keys. Skip the mouse." className="tracking-[-0.035em]!" />
            <Reveal delay={0.2}>
              <p className="text-[17px] leading-[26px] text-muted">Press ⌘/ in the editor to see every binding.</p>
            </Reveal>
          </div>
          <div className="w-full lg:w-[760px]">
            <ShortcutList
              items={[
                { label: "Open agent", keys: "⌘ L" },
                { label: "Edit selection inline", keys: "⌘ I" },
                { label: "Accept next edit", keys: "⇥" },
                { label: "Keep all changes", keys: "⌘ ↵" },
                { label: "Command palette", keys: "⌘ K" },
                { label: "Open in Puku CLI", keys: "⌃ `" },
              ]}
            />
          </div>
        </div>
      </section>
      <section className="container-x py-[clamp(72px,8.3vw,120px)]">
        <div className="flex flex-col gap-8">
          <Eyebrow>04 — RUNS ON</Eyebrow>
          <FeatureRow
            cols={3}
            items={[
              { title: "macOS", body: "12 Monterey or later · Apple silicon & Intel" },
              { title: "Windows", body: "Windows 10 or 11 · x64 & arm64" },
              { title: "Linux", body: ".deb · .rpm · AppImage" },
            ]}
          />
        </div>
      </section>
      <CTA title="Open your repo in Puku Editor." sub="Free download. Your VS Code settings come with you." />
    </>
  );
}
