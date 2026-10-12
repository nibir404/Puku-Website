# Puku Website

Marketing site for Puku, built from the Paper design file. It uses Next.js 15 (App Router), Tailwind CSS v4, Framer Motion, GSAP, Lenis and canvas-based pixel/dot effects.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Structure

- `src/app/*` — 15 routes: Home, Editor, CLI, Chat, App, Coming soon, Pricing, Download, Changelog, Blog, Blog post, About, Contact, Legal and 404.
- `src/app/globals.css` — Puku design tokens (light and dark). They are switched with `data-theme` by `next-themes`.
- `src/components/mock/*` — live, interactive product demos rendered at design size and scaled to fit:
  - `editor`: file tree, tabs, an agent that streams a diff, Keep and Undo.
  - `terminal`: real input, /help, /sandbox, …, a run-approval prompt and test output.
  - `chat`: a replica of chat.puku.sh, with threads, model and Think toggles, cited answers and Send to CLI.
  - `phone`: approve, deny or swipe; live sessions.
- `src/components/fx/pixel-canvas.tsx` — animates the Paper pixel art (`public/data/*.json`):
  - The hero dot field has a cursor lens and parallax.
  - Story backdrops show a dot-wave.
  - The CTA "P" gathers into shape.
  - The Dhaka skyline in the footer assembles, then its windows twinkle.
- `src/components/smooth-scroll.tsx` — Lenis smooth scroll, synced with GSAP ScrollTrigger.

Puku Chat (https://chat.puku.sh/new) and the docs (https://docs.puku.sh) are external products. The site links to them and does not rebuild them.
