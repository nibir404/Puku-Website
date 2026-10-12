import type { Metadata } from "next";
import { CTA } from "@/components/home/sections";
import { Changelog } from "@/components/page/changelog";

export const metadata: Metadata = { title: "Changelog", description: "Every release across Editor, CLI, Chat and App." };

export default function ChangelogPage() {
  return (
    <>
      <Changelog />
      <CTA />
    </>
  );
}
