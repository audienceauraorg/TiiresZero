# Catalog sync

`products.js` now prefers `window.SOURCE_PRODUCTS`, loaded from `products.generated.js` before the catalog code on every page.

To refresh the catalog from the official product sitemap:

```powershell
node sync-products.mjs --concurrency 4
```

For rate-limited runs, use small resumable shifts:

```powershell
node sync-products.mjs --shift 0 --shift-size 25 --concurrency 1
node sync-products.mjs --shift 1 --shift-size 25 --concurrency 1
node merge-products.mjs
```

Each shift writes its own checkpoint and never overwrites the merged catalog. Re-run only the failed shift, then merge again.

The sync scans truck-size product pages, retries throttled requests, extracts the source SKU, title, size, category, price, availability, and product image, and writes `products.generated.js` only after the scan completes. It excludes pages that are not marked **In Stock**, have no product photo, or are not commercial truck products.
