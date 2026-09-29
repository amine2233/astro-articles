#!/usr/bin/env node
// Usage: npm run new -- "My post title" [--lang en|fr|both] [--tags swift,ios]
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const title = args.find((a) => !a.startsWith('--'));
if (!title) {
  console.error('Usage: npm run new -- "My post title" [--lang en|fr|both] [--tags a,b]');
  process.exit(1);
}
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const lang = opt('lang', 'both');
const tags = opt('tags', '').split(',').filter(Boolean);
const slug = title
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const date = new Date().toISOString().slice(0, 10);

for (const l of lang === 'both' ? ['en', 'fr'] : [lang]) {
  const dir = `src/content/blog/${l}`;
  const file = `${dir}/${slug}.md`;
  if (existsSync(file)) { console.warn(`skip: ${file} exists`); continue; }
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, `---
title: "${title.replace(/"/g, '\\"')}"
description: ""
date: ${date}
tags: [${tags.join(', ')}]
draft: true
---

`);
  console.log(`created ${file}`);
}
