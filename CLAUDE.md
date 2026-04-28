# Project notes

Live: https://www.bernting.se (GH Pages, custom domain). Auto-deploys on push to `main` via `.github/workflows/deploy.yml`.

## Root redirect

`/` redirects to `https://william.bernting.se` via three signals in `index.html`: inline `window.location.replace`, `<meta http-equiv="refresh">`, and `<link rel="canonical">`. Subpaths are unaffected — they hit `404.html` instead.

If you remove the redirect, also revisit whether the multi-entry HTML setup below is still worth keeping.

## Multi-entry HTML setup (don't break this)

Both `index.html` and `404.html` live at the repo root and are wired as Vite entries via `build.rollupOptions.input` in `vite.config.ts`. Each gets its own bundled assets injected.

- `index.html` → has the root-redirect tags
- `404.html` → plain SPA shell (no redirect tags) — GH Pages serves this for any unmatched path; the SPA boots and TanStack Router reads `location.pathname`

Do **not** put `404.html` in `public/` — Vite copies that dir verbatim, and the script tag would still reference `/src/main.tsx` (dev path), which 404s in production. The previous workaround was `cp dist/index.html dist/404.html` in the workflow, which worked but couples the two files.

## `vite.config.js` shadows `vite.config.ts`

`pnpm build` runs `tsc -b && vite build`. `tsconfig.node.json` has `composite: true` and includes `vite.config.ts`, so `tsc -b` emits `vite.config.js` next to it. Vite then prefers the `.js` over the `.ts`.

`vite.config.js` is gitignored, but locally it'll reappear after any `pnpm build`. If edits to `vite.config.ts` aren't taking effect, delete `vite.config.js` or re-run `tsc -b`.

## SPA on GH Pages: subpaths return HTTP 404

By convention, GH Pages serves `404.html` with a 404 status for any unmatched path. The SPA still loads and routes correctly for users, but crawlers see the 404. No rafgraph-style `?/path` rewrite is implemented; add one if subpath SEO becomes important.

## Build will fail on any TS error

The deploy workflow runs `tsc -b` before `vite build`. A TS error anywhere in the project (including stories, configs) blocks deploy. Storybook story files in `src/stories/` are part of the typecheck.
