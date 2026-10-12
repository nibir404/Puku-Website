import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { StorySection } from "@/components/home/stories";
import { CTA, Releases } from "@/components/home/sections";
import { ScaledFrame } from "@/components/mock/frame";
import { TerminalMock } from "@/components/mock/terminal";
import { Eyebrow, Heading, Section } from "@/components/page/blocks";
import { DevPanels, InstallTabs, Jobs, RoutingFlow } from "@/components/page/cli";

export const metadata: Metadata = { title: "Puku CLI", description: "Your agent, right in the terminal." };

export default function CliPage() {
  return (
    <>
      <Hero
        stage="wave"
        chipTag="CLI"
        chipText="Puku CLI v1.8.66 · background tasks"
        title="Your agent, right in the terminal."
        sub="Inspect your project, automate tasks and coordinate infrastructure. It plans first and asks before it runs anything."
        primary={{ label: "Install the CLI", href: "#install" }}
        note="v1.8.66 · macOS · Linux · WSL · then run puku"
        product={
          <ScaledFrame width={1200} height={750}>
            <TerminalMock />
          </ScaledFrame>
        }
      />
      <StorySection
        story={{
          step: 2,
          lead: "Or watch it from the browser.",
          caption: "Every CLI session streams to the web view, so you can follow along, read the transcript, or send the next message from anywhere.",
          from: "right",
          mock: "chat",
          border: true,
        }}
      />
      <Section className="scroll-mt-20" >
        <div id="install" className="flex scroll-mt-28 flex-col gap-14">
          <div className="flex flex-col gap-5">
            <Eyebrow className="tracking-[0.12em]">01 — INSTALL</Eyebrow>
            <Heading text="Run automation, infrastructure operations and execution workflows from your terminal." className="max-w-[900px] leading-[1.167]! tracking-[-0.02em]!" />
          </div>
          <InstallTabs />
          <RoutingFlow />
        </div>
      </Section>
      <section className="container-x pt-[clamp(72px,8.3vw,120px)]">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <Eyebrow>02 — WHAT IT DOES</Eyebrow>
            <Heading text="Four jobs it takes off your plate." className="tracking-[-0.035em]!" />
          </div>
          <Jobs
            items={[
              { title: "Deployments", body: "Coordinate infrastructure changes across environments with full project context.", prompt: "› deploy api to staging, then smoke test" },
              { title: "Automation", body: "Hand repetitive engineering and infrastructure tasks to an agent, as a one-off or a saved skill.", prompt: "› $users-docs --runner --open-pr" },
              { title: "Inspection", body: "Ask about runtime systems, services and deployment state without leaving the terminal.", prompt: "› why is p95 up on /checkout?" },
              { title: "Project context", body: "Project memory and context-aware execution in one workflow, shared with Puku Editor.", prompt: '› /memory add "use pnpm, never npm"' },
            ]}
          />
        </div>
      </section>
      <section className="container-x pt-[clamp(72px,8.3vw,120px)]">
        <DevPanels />
      </section>
      <Releases eyebrow="03 — RECENT RELEASES" border={false} />
      <CTA
        title="Install the CLI in one line."
        sub="Native installer or npm. Works in any terminal."
        primary={{ label: "Read the docs", href: "https://docs.puku.sh" }}
      />
    </>
  );
}
