#!/usr/bin/env node
/**
 * Build the local catalog from the Tires Easy Truck product sitemap.
 * Usage: node sync-products.mjs [--limit 0] [--concurrency 12]
 * The default keeps only products whose source page says "In Stock".
 */
import fs from 'node:fs/promises';

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  if (process.argv[i].startsWith('--')) args.set(process.argv[i], process.argv[i + 1] ?? 'true');
}
const limit = Number(args.get('--limit') ?? 0);
const concurrency = Math.max(1, Number(args.get('--concurrency') ?? 4));
const shift = Number(args.get('--shift') ?? -1);
const shiftSize = Math.max(1, Number(args.get('--shift-size') ?? 50));
const SITEMAP = 'https://www.tires-easy-truck.com/medias/sys_master/root/hc6/h27/9163946786846/truckSite-PRODUCT-en-USD-7284296522954890994.xml';

const text = (value) => value.replace(/\s+/g, ' ').trim();
const decode = (value) => value.replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"');
const slugTitle = (value) => decode(value).replace(/\s+(?:[A-Z0-9]+\/)?\d+PLY\s*$/, '').trim();
const category = (value) => {
  const match = value.match(/Commercial (All Position|Drive|Steer|Trailer)/i);
  return match ? ({ 'All Position': 'all-position', Drive: 'drive', Steer: 'steer', Trailer: 'trailer' }[match[1]]) : null;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function fetchText(url) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const proxy = await fetch(`https://r.jina.ai/http://${url.replace(/^https?:\/\//, '')}`, { signal: AbortSignal.timeout(10000) }).catch(() => null);
    if (proxy?.ok) return proxy.text();
    await wait(1500 * (attempt + 1));
  }
  throw new Error(`rate limited or unavailable: ${url}`);
}

const sitemap = await (await fetch(SITEMAP, { signal: AbortSignal.timeout(30000) })).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+\/tirecode\/[^<]+)<\/loc>/g)].map((match) => match[1]);
// This storefront is for commercial truck tires. Passenger-car URLs and
// unrelated brands in the master sitemap are intentionally excluded.
const truckBrands = ['goodyear', 'continental', 'double-coin', 'hankook', 'cooper', 'toyo', 'fortune', 'goodride', 'arisun', 'hercules', 'ironman', 'milestar'];
const truckUrls = urls.filter((url) => truckBrands.some((brand) => url.includes(`/${brand}-tires/`)) && /(?:17\.5|19\.5|22\.5|24\.5)/.test(url));
const offset = shift >= 0 ? shift * shiftSize : Number(args.get('--offset') ?? 0);
const selected = limit > 0 ? truckUrls.slice(offset, offset + limit) : (shift >= 0 ? truckUrls.slice(offset, offset + shiftSize) : truckUrls.slice(offset));
let cursor = 0;
const products = [];

async function readProduct(url) {
  const page = await fetchText(url);
  const title = page.match(/^# (.+)$/m)?.[1] ?? '';
  const image = page.match(/!\[Image 6[^\]]*\]\((https?:\/\/[^)\s]+)\)/)?.[1]?.replace(/^http:/, 'https:');
  const inStock = /Availability[\s\S]{0,120}In Stock/i.test(page);
  const cat = category(page);
  if (!title || !image || /no-image/i.test(image) || !inStock || !cat) return null;

  const brandSlug = url.match(/\/([^/]+)-tires\//)?.[1] ?? '';
  const brand = brandSlug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  const parts = title.replace(new RegExp(`^${brand}\\s+`, 'i'), '').split(' ');
  const sizeIndex = parts.findIndex((part) => /\d+[R-]\d+|\d+\/\d+R\d+/i.test(part));
  const size = sizeIndex >= 0 ? parts[sizeIndex] : '';
  const name = slugTitle(parts.slice(0, sizeIndex >= 0 ? sizeIndex : parts.length).join(' '));
  const price = Number((page.match(/Per Tire:\s*\$([\d,]+(?:\.\d{2})?)/i)?.[1] ?? '0').replace(',', '')) || 0;
  if (!brand || !name || !size || !price) return null;
  return {
    id: url.split('/').pop(), brand, name, size, cat, price,
    oldPrice: null, stars: 0, reviews: 0, load: '', ply: '',
    desc: `${brand} ${name} commercial truck tire.`, image,
    sourceUrl: url, availability: 'In Stock'
  };
}

async function worker() {
  while (cursor < selected.length) {
    const index = cursor++;
    try {
      const product = await readProduct(selected[index]);
      if (product) products.push(product);
    } catch (error) {
      console.warn(`Skipped ${selected[index]}: ${error.message}`);
    }
    if ((index + 1) % 100 === 0) console.log(`Scanned ${index + 1}/${selected.length}; imported ${products.length}`);
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));
products.sort((a, b) => `${a.brand} ${a.name} ${a.size}`.localeCompare(`${b.brand} ${b.name} ${b.size}`));
if (shift >= 0) {
  await fs.writeFile(`products.generated.shift-${shift}.json`, JSON.stringify(products, null, 2), 'utf8');
  console.log(`Shift ${shift} complete: imported ${products.length} products into products.generated.shift-${shift}.json`);
} else {
  await fs.writeFile('products.generated.js', `window.SOURCE_PRODUCTS = ${JSON.stringify(products, null, 2)};\n`, 'utf8');
  console.log(`Imported ${products.length} in-stock products into products.generated.js`);
}
