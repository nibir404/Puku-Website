import type { IsoArtName } from "@/lib/iso-art";

/** Story categories double as the filters on /stories. */
export type StoryCat = "Milestones" | "Models" | "Partners";

export type StoryMeta = {
  slug: string;
  cat: StoryCat;
  title: string;
  dek: string;
  art: IsoArtName;
  /** Unpublished stories show on /stories as "Coming soon" and have no route. */
  published: boolean;
  chapters?: number;
  minutes?: number;
  featured?: boolean;
};

/** Add a story here (and its chapters in components/stories) to publish it at /stories/[slug]. */
export const STORIES: StoryMeta[] = [
  {
    slug: "every-model-starts-with-compute",
    cat: "Milestones",
    title: "Every model starts with compute.",
    dek: "Puku AI joins NVIDIA Inception: $100K in GPU credits, four ecosystem partners, and two core models on new ground.",
    art: "inception",
    published: true,
    chapters: 6,
    minutes: 2,
    featured: true,
  },
  { slug: "inside-puku-ai-2-9", cat: "Models", title: "Inside puku-ai-2.9", dek: "How our general-purpose LLM is built, layer by layer.", art: "thumb-tower", published: false },
  { slug: "meet-feluda-1-0", cat: "Models", title: "Meet feluda-1.0", dek: "Why we trained a model just for cybersecurity.", art: "thumb-cubes", published: false },
  { slug: "four-partners-one-network", cat: "Partners", title: "Four partners, one network", dek: "Lambda, Bria, Nebius and Scaleway, and what each one unlocks.", art: "thumb-disc", published: false },
];

export const PUBLISHED = STORIES.filter((s) => s.published);
export const findStory = (slug: string) => PUBLISHED.find((s) => s.slug === slug);
