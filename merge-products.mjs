import fs from 'node:fs/promises';

const files = (await fs.readdir('.'))
  .filter((name) => /^products\.generated\.shift-\d+\.json$/.test(name))
  .sort((a, b) => Number(a.match(/(\d+)/)[1]) - Number(b.match(/(\d+)/)[1]));
const merged = [];
const seen = new Set();
for (const file of files) {
  const rows = JSON.parse(await fs.readFile(file, 'utf8'));
  for (const row of rows) {
    const key = row.sourceUrl || `${row.brand}|${row.name}|${row.size}`;
    if (!seen.has(key)) { seen.add(key); merged.push(row); }
  }
}
await fs.writeFile('products.generated.js', `window.SOURCE_PRODUCTS = ${JSON.stringify(merged, null, 2)};\n`, 'utf8');
console.log(`Merged ${merged.length} products from ${files.length} completed shifts.`);
