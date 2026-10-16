import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComputeStory } from "@/components/stories/compute-story";
import { PUBLISHED, findStory } from "@/lib/stories";

/** One component per published story. Add the slug here when a new story ships. */
const BODIES: Record<string, () => React.ReactNode> = {
  "every-model-starts-with-compute": () => <ComputeStory />,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return PUBLISHED.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = findStory(slug);
  return s ? { title: s.title.replace(/\.$/, ""), description: s.dek } : {};
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = findStory(slug) && BODIES[slug];
  if (!body) notFound();
  return body();
}
