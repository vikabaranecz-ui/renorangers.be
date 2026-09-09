import { chromium } from 'playwright';

const BASE = 'https://www.renorangers.be';
const SITEMAP = `${BASE}/sitemap.xml`;

const normalize = (value) => {
  try {
    const u = new URL(value, BASE);
    if (!['renorangers.be', 'www.renorangers.be'].includes(u.hostname)) return null;
    u.protocol = 'https:';
    u.hostname = 'www.renorangers.be';
    u.hash = '';
    if (u.pathname !== '/' && u.pathname.endsWith('/')) u.pathname = u.pathname.slice(0, -1);
    return u.toString();
  } catch {
    return null;
  }
};

const xml = await (await fetch(SITEMAP, { headers: { 'user-agent': 'RenoRangersRenderedSEOQA/1.0' } })).text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => normalize(m[1].trim())).filter(Boolean);
const uniqueUrls = [...new Set(urls)];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();

const issues = [];
const pages = [];
const outgoing = new Map();
const incoming = new Map(uniqueUrls.map(u => [u, new Set()]));

for (const url of uniqueUrls) {
  let response;
  try {
    response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (err) {
    issues.push({ type: 'navigation_error', url, detail: String(err) });
    continue;
  }

  const status = response?.status() ?? 0;
  const finalUrl = normalize(page.url());
  if (status !== 200) issues.push({ type: 'non_200', url, status });
  if (finalUrl !== url) issues.push({ type: 'unexpected_redirect', url, finalUrl });

  const data = await page.evaluate(() => {
    const meta = (name) => document.querySelector(`meta[name="${name}"]`)?.getAttribute('content')?.trim() || '';
    const prop = (name) => document.querySelector(`meta[property="${name}"]`)?.getAttribute('content')?.trim() || '';
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
    const h1s = [...document.querySelectorAll('h1')].map(h => h.textContent?.trim() || '').filter(Boolean);
    const bodyText = document.body?.innerText || '';
    const words = (bodyText.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’-]*\b/gu) || []).length;
    const links = [...document.querySelectorAll('a[href]')].map(a => a.href).filter(Boolean);
    return {
      title: document.title.trim(),
      description: meta('description'),
      robots: meta('robots').toLowerCase(),
      canonical,
      h1s,
      words,
      og: Boolean(prop('og:title') && prop('og:description')),
      twitter: Boolean(meta('twitter:title') && meta('twitter:description')),
      links,
    };
  });

  const canonical = normalize(data.canonical);
  if (!data.title) issues.push({ type: 'missing_title', url });
  if (!data.description) issues.push({ type: 'missing_meta_description', url });
  if (canonical !== url) issues.push({ type: 'canonical_mismatch', url, canonical });
  if (data.robots.includes('noindex')) issues.push({ type: 'unexpected_noindex', url, robots: data.robots });
  if (data.h1s.length === 0) issues.push({ type: 'missing_h1', url });
  if (data.h1s.length > 1) issues.push({ type: 'multiple_h1', url, count: data.h1s.length });
  if (data.words < 100) issues.push({ type: 'low_rendered_word_count', url, words: data.words });
  if (!data.og) issues.push({ type: 'missing_open_graph', url });
  if (!data.twitter) issues.push({ type: 'missing_twitter_card', url });

  const internal = new Set(data.links.map(normalize).filter(Boolean));
  outgoing.set(url, internal);
  for (const target of internal) {
    if (incoming.has(target)) incoming.get(target).add(url);
  }

  pages.push({
    url,
    status,
    title: data.title,
    description_length: data.description.length,
    canonical,
    robots: data.robots,
    h1_count: data.h1s.length,
    word_count: data.words,
    open_graph: data.og,
    twitter_card: data.twitter,
    internal_link_count: internal.size,
  });
}

const sitemapSet = new Set(uniqueUrls);
for (const url of uniqueUrls) {
  const inc = incoming.get(url) || new Set();
  const out = outgoing.get(url) || new Set();
  if (url !== `${BASE}/` && [...inc].filter(x => sitemapSet.has(x)).length === 0) {
    issues.push({ type: 'orphan_in_rendered_sitemap_graph', url });
  }
  if ([...out].filter(x => sitemapSet.has(x)).length === 0) {
    issues.push({ type: 'no_rendered_internal_outgoing_to_sitemap', url });
  }
}

await browser.close();

const counts = {};
for (const issue of issues) counts[issue.type] = (counts[issue.type] || 0) + 1;
const blockingTypes = new Set([
  'navigation_error', 'non_200', 'unexpected_redirect', 'missing_title', 'missing_meta_description',
  'canonical_mismatch', 'unexpected_noindex', 'missing_h1'
]);
const blockers = issues.filter(i => blockingTypes.has(i.type));

const report = {
  site: BASE,
  crawl_mode: 'rendered Chromium',
  sitemap_url_count: uniqueUrls.length,
  checked_pages: pages.length,
  issue_count: issues.length,
  blocking_issue_count: blockers.length,
  issue_counts: counts,
  issues,
  pages,
};

console.log(JSON.stringify(report, null, 2));
console.error(`SUMMARY: ${uniqueUrls.length} sitemap URLs, ${issues.length} findings, ${blockers.length} blocking findings`);
if (blockers.length) process.exit(1);
