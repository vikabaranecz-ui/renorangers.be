import fs from 'node:fs';
import path from 'node:path';

const origin = 'https://www.renorangers.be';
const dist = path.resolve('dist');
const sitemapPath = path.resolve('public/sitemap.xml');

if (!fs.existsSync(dist)) throw new Error('dist directory missing');
if (!fs.existsSync(sitemapPath)) throw new Error('public/sitemap.xml missing');

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemap.matchAll(/<loc>(https:\/\/www\.renorangers\.be[^<]*)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) throw new Error('No Reno Rangers URLs found in sitemap');

const failures = [];

for (const url of urls) {
  const route = new URL(url).pathname;
  const filePath = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html');
  if (!fs.existsSync(filePath)) {
    failures.push(`${route}: missing static HTML shell at ${filePath}`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const canonical = route === '/' ? `${origin}/` : `${origin}${route}`;
  if (!html.includes(`<link rel="canonical" href="${canonical}"`)) {
    failures.push(`${route}: canonical does not match ${canonical}`);
  }
  if (!/<meta\s+name="robots"\s+content="index, follow"/i.test(html)) {
    failures.push(`${route}: robots is not index, follow`);
  }
  if (!/<title>[^<]{5,}<\/title>/i.test(html)) {
    failures.push(`${route}: missing/empty title`);
  }
  if (!/<meta\s+name="description"\s+content="[^"]{40,}"/i.test(html)) {
    failures.push(`${route}: missing/too-short meta description`);
  }
}

if (failures.length) {
  console.error('SEO health gate failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO health gate passed for ${urls.length} sitemap URLs.`);
