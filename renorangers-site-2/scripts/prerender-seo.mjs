import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const indexPath = path.join(dist, 'index.html');
if (!fs.existsSync(indexPath)) throw new Error(`Missing Vite output: ${indexPath}`);

const baseHtml = fs.readFileSync(indexPath, 'utf8');
const origin = 'https://www.renorangers.be';
const routes = [
  ['/', 'Reno Rangers | Renovatiebedrijf Antwerpen', 'Renovatiebedrijf in Antwerpen voor totaalrenovatie, badkamerrenovatie & binnenafwerking. Vraag een gratis offerte aan.'],
  ['/badkamerrenovatie-antwerpen', 'Badkamerrenovatie Antwerpen | Reno Rangers', 'Badkamerrenovatie in Antwerpen door Reno Rangers. Eén aanspreekpunt, duidelijke planning en correcte oplevering.'],
  ['/diensten', 'Diensten | Reno Rangers Antwerpen', 'Bekijk de renovatiediensten van Reno Rangers in Antwerpen: badkamerrenovatie, totaalrenovatie en binnenafwerking.'],
  ['/projecten', 'Projecten | Reno Rangers Antwerpen', 'Bekijk recente renovatieprojecten van Reno Rangers in Antwerpen en omgeving.'],
  ['/contact', 'Contact | Reno Rangers Antwerpen', 'Neem contact op met Reno Rangers voor een offerte of advies over uw renovatieproject.'],
  ['/over-ons', 'Over Ons | Reno Rangers Renovatiebedrijf Antwerpen', 'Leer Reno Rangers kennen: renovatieaannemer in Antwerpen met focus op vakmanschap en duidelijke planning.'],
  ['/blog', 'Blog | Reno Rangers Renovatietips', 'Lees renovatietips van Reno Rangers over badkamerrenovatie, totaalrenovatie en binnenafwerking.'],
  ['/privacybeleid', 'Privacybeleid | Reno Rangers', 'Lees het privacybeleid van Reno Rangers.'],
  ['/projecten/badkamerrenovatie-antwerpen', 'Badkamerrenovatie Antwerpen | Reno Rangers Project', 'Bekijk dit badkamerrenovatieproject in Antwerpen door Reno Rangers.'],
  ['/projecten/mortex-badkamer-merksem', 'Mortex Badkamer Merksem | Reno Rangers Project', 'Bekijk deze mortex badkamerrenovatie in Merksem door Reno Rangers.'],
  ['/projecten/mortex-badkamer-antwerpen', 'Mortex Badkamer Antwerpen | Reno Rangers Project', 'Bekijk deze mortex badkamer in Antwerpen door Reno Rangers.'],
  ['/projecten/volledige-badkamer-antwerpen', 'Volledige Badkamerrenovatie Antwerpen | Reno Rangers', 'Bekijk deze volledige badkamerrenovatie in Antwerpen door Reno Rangers.'],
  ['/projecten/badkamer-paars-meubel-merksem', 'Badkamer met Paars Meubel Merksem | Reno Rangers', 'Bekijk deze badkamerrenovatie in Merksem door Reno Rangers.'],
  ['/projecten/keukenrenovatie-antwerpen', 'Keukenrenovatie Antwerpen | Reno Rangers Project', 'Bekijk deze keukenrenovatie in Antwerpen door Reno Rangers.'],
  ['/projecten/living-binnenafwerking-antwerpen', 'Living & Binnenafwerking Antwerpen | Reno Rangers', 'Bekijk dit binnenafwerkingsproject in Antwerpen door Reno Rangers.'],
  ['/projecten/badkamerrenovatie-londerzeel', 'Badkamerrenovatie Londerzeel | Reno Rangers Project', 'Bekijk deze badkamerrenovatie in Londerzeel door Reno Rangers.'],
  ['/blog/wat-kost-badkamerrenovatie-antwerpen-2026', 'Wat kost een badkamerrenovatie in Antwerpen in 2026? | Reno Rangers', 'Lees welke factoren de kostprijs van een badkamerrenovatie in Antwerpen bepalen.'],
  ['/blog/totaalrenovatie-alles-wat-u-moet-weten', 'Totaalrenovatie: alles wat u moet weten | Reno Rangers Antwerpen', 'Lees wat u moet weten over planning en aanpak van een totaalrenovatie.'],
  ['/blog/trends-binnenafwerking-belgische-woningen-2026', 'Trends in binnenafwerking voor Belgische woningen | Reno Rangers', 'Bekijk inspiratie en trends voor binnenafwerking in Belgische woningen.'],
  ['/blog/hoe-juiste-renovatie-aannemer-kiezen', 'Hoe kiest u de juiste renovatie-aannemer? | Reno Rangers', 'Lees waar u op kunt letten bij het kiezen van een renovatie-aannemer.'],
];

const esc = (v) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function stripUnverifiedSearchAction(html) {
  return html.replace(/\s*<!-- JSON-LD: WebSite \+ SearchAction -->[\s\S]*?<script type="application\/ld\+json">[\s\S]*?"potentialAction"[\s\S]*?<\/script>/i, '');
}

function stripUnverifiedBusinessFacts(html) {
  let out = html;
  out = out.replace(/\s*"address"\s*:\s*\{[\s\S]*?\}\s*,\s*"geo"\s*:\s*\{[\s\S]*?\}\s*,/i, '');
  out = out.replace(/\s*"aggregateRating"\s*:\s*\{[\s\S]*?\}\s*,/i, '');
  out = out.replace(/\s*"priceRange"\s*:\s*"[^"]*"\s*,/i, '');
  return out;
}

function buildHtml(route, title, description) {
  const canonical = route === '/' ? `${origin}/` : `${origin}${route}`;
  let html = stripUnverifiedBusinessFacts(stripUnverifiedSearchAction(baseHtml));
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="description" content="${esc(description)}" />`);
  html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?\s*>/i, `<link rel="canonical" href="${canonical}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:url" content="${canonical}" />`);
  html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:title" content="${esc(title)}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:description" content="${esc(description)}" />`);
  html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="twitter:title" content="${esc(title)}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="twitter:description" content="${esc(description)}" />`);
  html = html.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?\s*>/i, '<meta name="robots" content="index, follow" />');
  return html;
}

for (const [route, title, description] of routes) {
  const html = buildHtml(route, title, description);
  if (route === '/') {
    fs.writeFileSync(indexPath, html);
  } else {
    const outDir = path.join(dist, route.slice(1));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html);
  }
}

console.log(`Generated SEO shells for ${routes.length} indexable routes.`);
