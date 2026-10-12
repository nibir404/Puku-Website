import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { StorySection } from "@/components/home/stories";
import { CTA } from "@/components/home/sections";
import { ScaledFrame } from "@/components/mock/frame";
import { ChatMock } from "@/components/mock/chat";
import { Eyebrow, Heading, Section } from "@/components/page/blocks";
import { Handoff, Modes, PrivacyRow } from "@/components/page/chat";

export const metadata: Metadata = { title: "Puku Chat", description: "Research that turns into work." };

const CHAT = "https://chat.puku.sh/new";

export default function ChatPage() {
  return (
    <>
      <Hero
        chipTag="CHAT"
        chipText="Research mode now cites every claim"
        title={"Research that\nturns into work."}
        sub="Chat, work with files, and explore projects and research in your browser."
        primary={{ label: "Open Puku Chat", href: CHAT }}
        secondary={{ label: "See plans", href: "/pricing" }}
        note="chat.puku.sh · no install · works in any modern browser"
        product={
          <ScaledFrame width={1440} height={900}>
            <ChatMock start="new" />
          </ScaledFrame>
        }
      />
      <StorySection
        story={{ step: 1, lead: "Research with receipts.", caption: "Research mode searches the web and your project, cites every claim and flags what it couldn't verify.", from: "left", mock: "chat", border: true }}
      />
      <StorySection
        story={{ step: 2, lead: "Answers become artifacts.", caption: "Docs, code and slides open beside the chat, ready to edit or send to the CLI as a task.", from: "left", mock: "chat-new" }}
      />
      <Section>
        <div className="flex flex-col gap-14">
          <div className="flex flex-col gap-3">
            <Eyebrow className="tracking-[0.08em]">THREE WAYS TO ASK</Eyebrow>
            <Heading medium text="Pick the depth. Puku picks the tools." className="max-w-[700px]" />
          </div>
          <Modes />
        </div>
      </Section>
      <Handoff />
      <PrivacyRow />
      <CTA
        title="Ask your first question."
        sub="Chat, files and research — right in your browser."
        primary={{ label: "Open Puku Chat", href: CHAT }}
        secondary={{ label: "chat.puku.sh", href: CHAT }}
      />
    </>
  );
}
