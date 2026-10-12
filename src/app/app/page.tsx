import type { Metadata } from "next";
import { CTA } from "@/components/home/sections";
import { StorySection } from "@/components/home/stories";
import { IconCards, PageHero, StatusRows, Waitlist } from "@/components/page/common";
import { icon } from "@/lib/icon";

export const metadata: Metadata = { title: "Puku App (preview)", description: "Your agents, in your pocket." };

export default function AppPage() {
  return (
    <>
      <PageHero chip={{ tag: "PREVIEW", text: "Puku App · iOS TestFlight is open →" }} title="Your agents, in your pocket." sub="A mobile preview for chats, attachments, projects, and dictated prompts. Installation is coming soon." stageHeight="clamp(560px,44.4vw,640px)">
        <Waitlist cta="Join the preview" note="iOS via TestFlight first, Android next. One email when your invite is ready." />
      </PageHero>
      <div className="h-[clamp(24px,4vw,60px)]" />
      <StorySection
        story={{ step: 4, lead: "Check in from your phone.", caption: "Approve a command, answer a question, or read the PR from anywhere. Your sessions keep running on your machine. Try it — tap Approve or swipe the card.", from: "up", mock: "phone" }}
      />
      <section className="container-x">
        <IconCards
          className="mx-auto max-w-[1120px]"
          items={[
            { icon: icon(<><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></>), title: "Approve on the go", body: "Run once, always allow, or skip. The CLI resumes the second you tap." },
            { icon: icon(<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />), title: "Live runs", body: "Follow each step of an Editor or CLI session as it happens." },
            { icon: icon(<><path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" /></>), title: "Quiet notifications", body: "Only when something needs you. Everything else waits in Now." },
            { icon: icon(<><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" /><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" /></>), title: "Chat anywhere", body: "Your Puku Chat history, synced, with voice input." },
          ]}
        />
      </section>
      <StatusRows
        eyebrow="ROADMAP"
        title="Where the preview is going."
        rows={[
          { tag: "NOW", tone: "success", text: "Chats, attachments, projects", meta: "TestFlight preview" },
          { tag: "NEXT", tone: "warning", text: "Dictated prompts, approvals, live runs", meta: "In testing" },
          { tag: "LATER", tone: "muted", text: "App Store and Android", meta: "Installation coming soon" },
        ]}
      />
      <CTA title="Join the App preview." sub="Chats, attachments, projects and dictated prompts on iPhone." primary={{ label: "Join TestFlight", href: "#top" }} secondary={{ label: "TestFlight preview · iOS", href: "/changelog" }} />
    </>
  );
}
