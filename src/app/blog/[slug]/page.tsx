import type { Metadata } from "next";
import { CTA } from "@/components/home/sections";
import { Post } from "@/components/page/blog";
import { POSTS } from "@/lib/posts";

const FEATURED = { slug: "designing-a-readable-sandbox", title: "Designing a sandbox you can actually read", dek: "How we turned four config files and a wall of flags into one table.", cat: "Product", date: "OCT 9, 2026" };

const find = (slug: string) => {
  const p = POSTS.find((x) => x.slug === slug);
  return p ? { title: p.title, dek: p.dek, cat: p.cat, date: `${p.date.toUpperCase()}, 2026` } : FEATURED;
};

export function generateStaticParams() {
  return [{ slug: FEATURED.slug }, ...POSTS.map((p) => ({ slug: p.slug }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = find(slug);
  return { title: p.title, description: p.dek };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = find(slug);
  return (
    <>
      <Post {...p} />
      <CTA title="Try what we write about." />
    </>
  );
}
