import type { Metadata } from "next";
import { CTA } from "@/components/home/sections";
import { BlogIndex } from "@/components/page/blog";

export const metadata: Metadata = { title: "Blog", description: "Notes from the workbench." };

export default function BlogPage() {
  return (
    <>
      <BlogIndex />
      <CTA title="Try what we write about." />
    </>
  );
}
