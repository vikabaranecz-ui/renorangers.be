import { chromium } from 'playwright';

const base = 'https://www.renorangers.be';
const failures = [];
const notes = [];

function ok(cond, msg) {
  if (!cond) failures.push(msg);
  else notes.push(`OK: ${msg}`);
}

const browser = await chromium.launch({ headless: true });
for (const viewport of [{name:'desktop', width:1440, height:1000}, {name:'mobile', width:390, height:844}]) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle', timeout: 60000 });

  const gtm = await page.locator('script[src*="googletagmanager.com/gtm.js"]').count();
  ok(gtm > 0, `${viewport.name}: GTM script is present`);

  const consentState = await page.evaluate(() => ({
    dataLayer: Array.isArray(window.dataLayer),
    stored: localStorage.getItem('rr_cookie_consent_v1')
  }));
  ok(consentState.dataLayer, `${viewport.name}: dataLayer exists`);

  const tel = page.locator('a[href^="tel:"]');
  const mail = page.locator('a[href^="mailto:"]');
  const wa = page.locator('a[href*="wa.me"], a[href*="whatsapp.com"]');
  ok(await tel.count() > 0, `${viewport.name}: phone CTA exists`);
  ok(await mail.count() > 0, `${viewport.name}: email CTA exists`);
  ok(await wa.count() > 0, `${viewport.name}: WhatsApp CTA exists`);

  if (await tel.count()) ok(await tel.first().isVisible(), `${viewport.name}: phone CTA is visible`);
  if (await mail.count()) ok(await mail.first().isVisible(), `${viewport.name}: email CTA is visible`);
  if (await wa.count()) ok(await wa.first().isVisible(), `${viewport.name}: WhatsApp CTA is visible`);

  await page.goto(`${base}/contact`, { waitUntil: 'networkidle', timeout: 60000 });
  const forms = page.locator('form');
  ok(await forms.count() > 0, `${viewport.name}: contact form exists`);
  if (await forms.count()) {
    const submit = forms.first().locator('button[type="submit"], input[type="submit"]');
    ok(await submit.count() > 0, `${viewport.name}: form submit control exists`);
    if (await submit.count()) ok(await submit.first().isVisible(), `${viewport.name}: form submit control is visible`);
  }
  await context.close();
}
await browser.close();

console.log(notes.join('\n'));
if (failures.length) {
  console.error('\nFAILURES:\n' + failures.map(x => `- ${x}`).join('\n'));
  process.exit(1);
}
console.log('\nLIVE TRACKING QA PASSED');
