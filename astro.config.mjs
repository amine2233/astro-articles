// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ─── Deployment settings ────────────────────────────────────────────────
// SITE: your GitHub Pages origin (or custom domain).
// BASE: the repository name when deploying to https://<user>.github.io/<repo>/.
//       Use '/' for a <user>.github.io repo or a custom domain.
// Both can be overridden from CI with environment variables.
const SITE = process.env.SITE_URL ?? 'https://your-user.github.io';
const BASE = process.env.BASE_PATH ?? '/astro-blog';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: {
      prefixDefaultLocale: true, // URLs: /en/... and /fr/...
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en-US', fr: 'fr-FR' } },
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
    },
  },
});
