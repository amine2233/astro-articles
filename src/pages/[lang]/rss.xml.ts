import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, langs, splitId, useTranslations, type Lang } from '../../i18n/ui';

export function getStaticPaths() {
  return langs.map((lang) => ({ params: { lang } }));
}

/** One RSS feed per language: /en/rss.xml and /fr/rss.xml */
export async function GET(context: APIContext) {
  const lang = context.params.lang as Lang;
  const t = useTranslations(lang);
  const posts = await getPosts(lang);
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');

  return rss({
    title: `${t('site.title')} (${lang.toUpperCase()})`,
    description: t('site.tagline'),
    site: new URL(`${base}/${lang}/`, context.site!).href,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      categories: post.data.tags,
      link: `${base}/${lang}/blog/${splitId(post.id).slug}/`,
    })),
    customData: `<language>${lang === 'fr' ? 'fr-fr' : 'en-us'}</language>`,
  });
}
