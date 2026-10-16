import type { Metadata } from "next";
import { CTA } from "@/components/home/sections";
import { StoryIndex } from "@/components/stories/story-index";

export const metadata: Metadata = { title: "Stories", description: "Milestones, models and partnerships, each told as a short story you can scroll through." };

export default function StoriesPage() {
  return (
    <>
      <StoryIndex />
      <CTA title="Build with us." />
    </>
  );
}
