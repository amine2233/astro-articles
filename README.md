# Dev Notes — Astro bilingual blog (EN/FR)

Static blog: Markdown files, no database, deployed to GitHub Pages with GitHub Actions.

- **Astro 7** static output, zero JavaScript by default (only the theme toggle)
- **EN/FR** with Astro's built-in i18n routing (`/en/...`, `/fr/...`)
- Typed frontmatter (a bad field fails the build)
- Per-language article list, tags, RSS feeds, sitemap with `hreflang`
- Light/dark theme, dual-theme code highlighting (Shiki)
- Drafts visible only in `npm run dev`

## Quick start

```bash
npm install
npm run dev          # http://localhost:4321/astro-blog/
npm run build        # type-check + static build to dist/
npm run preview      # serve dist/ locally
```

Requires Node ≥ 22.12.

## Writing an article

```bash
npm run new -- "My new post" --tags swift,ios            # creates EN + FR drafts
npm run new -- "Mon article" --lang fr --tags kotlin     # FR only
```

Or create the file by hand:

```
src/content/blog/en/my-post.md
src/content/blog/fr/my-post.md   ← same file name = translation of the same article
```

```md
---
title: "My post"
description: "One-line summary shown in lists and SEO."
date: 2026-09-28
updated: 2026-10-02     # optional
tags: [swift, ios]
draft: false            # true = hidden in production
---
```

A post without a translation is fine: the "Read in …" link simply doesn't appear.

## Project structure

```
src/
├── content.config.ts          # frontmatter schema (Zod)
├── content/blog/{en,fr}/      # your Markdown articles
├── i18n/ui.ts                 # UI strings + helpers (url(), getPosts(), …)
├── layouts/Base.astro         # <head>, SEO, hreflang, header, footer
├── components/                # Header (lang switcher, theme), PostCard
├── pages/
│   ├── index.astro            # redirects "/" to /en/ or /fr/ from browser language
│   └── [lang]/
│       ├── index.astro        # article list
│       ├── blog/[...slug].astro
│       ├── tags/index.astro, tags/[tag].astro
│       └── rss.xml.ts
└── styles/global.css          # all design tokens at the top (colors, fonts, width)
```

## Customization

| What | Where |
|---|---|
| Colors, fonts, width, dark mode | `:root` tokens in `src/styles/global.css` |
| Site name, tagline, UI labels | `src/i18n/ui.ts` |
| Add a language (e.g. `ar`) | `astro.config.mjs` `locales` + `languages` and `ui` in `src/i18n/ui.ts` + `src/content/blog/ar/` |
| Frontmatter fields (cover image, series…) | `src/content.config.ts` |
| Code theme | `markdown.shikiConfig.themes` in `astro.config.mjs` |
| Components inside articles | rename a post to `.mdx` after `npx astro add mdx` |

## Deploying to GitHub Pages

1. Push this folder to a GitHub repo (branch `main`).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push. `.github/workflows/deploy.yml` builds and deploys.

The workflow sets the URL automatically:

- `SITE_URL` = `https://<owner>.github.io`
- `BASE_PATH` = `/<repo-name>`

For a `<user>.github.io` repo or a **custom domain**, set `BASE_PATH: /` in the workflow (and `SITE_URL` to your domain; add a `public/CNAME` file containing the domain).

Locally, the defaults in `astro.config.mjs` are used (`/astro-blog`); override with
`SITE_URL=… BASE_PATH=/ npm run build`.

## Good next additions

- `npx astro add mdx` — components in articles
- [Pagefind](https://pagefind.app) — static full-text search, run after `astro build`
- Giscus — comments stored in GitHub Discussions
- `astro:assets` `<Image>` — optimized images / OG cover per post
