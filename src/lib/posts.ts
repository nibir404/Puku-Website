export type Cat = "Product" | "Engineering" | "Guides";
export const POSTS: { slug: string; cat: Cat; date: string; title: string; dek: string; cover: "wave" | "wave-lg" | "feat" | "editor" }[] = [
  { slug: "pkce-refresh", cat: "Engineering", date: "Oct 2", title: "PKCE refresh without the logout loop", dek: "What broke when sessions expired mid-run, and the fix.", cover: "wave" },
  { slug: "writing-puku-md", cat: "Guides", date: "Sep 28", title: "Writing a PUKU.md your agents will follow", dek: "Short rules beat long docs. Six patterns that work.", cover: "wave-lg" },
  { slug: "one-memory", cat: "Product", date: "Sep 20", title: "One memory, four surfaces", dek: "Why Puku shares context instead of syncing it.", cover: "feat" },
  { slug: "terminal-asks", cat: "Product", date: "Sep 12", title: "A terminal that asks before it acts", dek: "Inside the permission prompts in Puku CLI 1.8.", cover: "editor" },
];
