import { getCollection, type CollectionEntry } from 'astro:content';

export const languages = { en: 'English', fr: 'Français' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';
export const langs = Object.keys(languages) as Lang[];

/** UI strings. Add a key here and TypeScript forces you to translate it. */
const ui = {
  en: {
    'site.title': 'Dev Notes',
    'site.tagline': 'Articles on Swift, Kotlin, backend and CLI tooling.',
    'nav.posts': 'Articles',
    'nav.tags': 'Tags',
    'nav.rss': 'RSS',
    'post.readingTime': '{n} min read',
    'post.updated': 'Updated',
    'post.translation': 'Lire en français',
    'post.back': '← All articles',
    'tags.title': 'Articles tagged “{tag}”',
    'list.empty': 'No articles yet.',
    'theme.toggle': 'Toggle theme',
  },
  fr: {
    'site.title': 'Dev Notes',
    'site.tagline': 'Articles sur Swift, Kotlin, le backend et l’outillage CLI.',
    'nav.posts': 'Articles',
    'nav.tags': 'Tags',
    'nav.rss': 'RSS',
    'post.readingTime': '{n} min de lecture',
    'post.updated': 'Mis à jour',
    'post.translation': 'Read in English',
    'post.back': '← Tous les articles',
    'tags.title': 'Articles avec le tag « {tag} »',
    'list.empty': 'Aucun article pour le moment.',
    'theme.toggle': 'Changer de thème',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UIKey = keyof (typeof ui)['en'];

export function useTranslations(lang: Lang) {
  return (key: UIKey, vars: Record<string, string | number> = {}) =>
    Object.entries(vars).reduce<string>(
      (s, [k, v]) => s.replace(`{${k}}`, String(v)),
      ui[lang][key] ?? ui[defaultLang][key],
    );
}

/** Prefix a path with the configured `base` (needed on GitHub Pages sub-paths). */
export function url(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

export function formatDate(date: Date, lang: Lang) {
  return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** "en/swift-concurrency" → { lang: "en", slug: "swift-concurrency" } */
export function splitId(id: string) {
  const [lang, ...rest] = id.split('/');
  return { lang: lang as Lang, slug: rest.join('/') };
}

/** Published posts for one language, newest first. Drafts show only in `astro dev`. */
export async function getPosts(lang: Lang) {
  const posts = await getCollection(
    'blog',
    (p) => splitId(p.id).lang === lang && (import.meta.env.DEV || !p.data.draft),
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Map of slug → available languages, used for the language switcher and hreflang. */
export async function getTranslations(post: CollectionEntry<'blog'>) {
  const { slug } = splitId(post.id);
  const all = await getCollection('blog', (p) => splitId(p.id).slug === slug);
  return all.map((p) => splitId(p.id).lang);
}

export function readingTime(body: string | undefined) {
  const words = (body ?? '').trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
