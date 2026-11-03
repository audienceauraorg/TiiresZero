// =============================================
//  PRODUCT DATABASE
// =============================================

const PRODUCTS = window.SOURCE_PRODUCTS || [];

// Utility: render stars HTML
function starsHTML(n) {
  return '&#9733;'.repeat(Math.floor(n)) + (n % 1 ? '&#9734;' : (n < 5 ? '&#9734;'.repeat(5 - Math.floor(n)) : '')) ;
}

// Tire SVG icon
function tireSVG(size = 120) {
  const h = size, cx = h/2, r1 = h/2 - 4, r2 = r1 * 0.65, r3 = r1 * 0.35, r4 = r1 * 0.12;
  const spoke = r2 * 0.85;
  const angles = [0, 60, 120, 180, 240, 300];
  const spokes = angles.map(a => {
    const rad = a * Math.PI / 180;
    return `<line x1="${cx}" y1="${cx}" x2="${cx + spoke * Math.sin(rad)}" y2="${cx - spoke * Math.cos(rad)}" stroke="#666" stroke-width="${size*0.055}" stroke-linecap="round"/>`;
  }).join('');
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${cx}" cy="${cx}" r="${r1}" fill="#1a1a1a" stroke="#333" stroke-width="${size*0.04}"/>
    <circle cx="${cx}" cy="${cx}" r="${r2}" fill="none" stroke="#555" stroke-width="${size*0.125}"/>
    <circle cx="${cx}" cy="${cx}" r="${r3}" fill="#2a2a2a"/>${spokes}
    <circle cx="${cx}" cy="${cx}" r="${r4}" fill="#e60000"/>
  </svg>`;
}

function tireImageHTML(p, size = 120) {
  if (p.image) {
    return `<img src="${p.image}" alt="${p.brand} ${p.name}" width="${size}" height="${size}" loading="lazy" style="width:${size}px;height:${size}px;object-fit:contain" />`;
  }
  return tireSVG(size);
}

const BRAND_LOGOS = {
  Arisun: 'https://www.tires-easy-truck.com/medias/sys_master/images/images/h6a/hf4/9503592415262/arisun-tires-logo.webp',
  Continental: 'https://www.tires-easy-truck.com/medias/sys_master/images/images/h0b/haa/9503592185886/continental-logo.webp',
  Cooper: 'https://www.tires-easy-truck.com/medias/sys_master/images/images/h82/h4f/9503592251422/cooper-logo.webp',
  'Double Coin': 'https://www.tires-easy-truck.com/medias/sys_master/images/images/h3b/h61/9503592513566/double-coin-logo.webp',
  Fortune: 'https://www.tires-easy-truck.com/medias/sys_master/images/images/hd1/hb0/9503592546334/fortune-logo.webp',
  Goodride: 'https://www.tires-easy-truck.com/medias/sys_master/images/images/h73/h01/9503592611870/goodride-logo.webp',
  Goodyear: 'https://www.tires-easy-truck.com/medias/sys_master/images/images/h52/hf2/9503592218654/goodyear-logo.webp',
  Hankook: 'https://www.tires-easy-truck.com/medias/sys_master/images/images/hb1/had/9503592284190/hankook-logo.webp',
  Hercules: 'https://www.tires-easy-truck.com/medias/sys_master/images/images/h38/h5c/9503592742942/hercules-logo.webp',
  Ironman: 'https://www.tires-easy-truck.com/medias/sys_master/images/images/ha2/h0c/9503592775710/ironman-tires-logo.webp',
  Milestar: 'https://www.tires-easy-truck.com/medias/sys_master/images/images/h71/h9e/9503592808478/milestar-logo.webp',
  Toyo: 'https://www.tires-easy-truck.com/medias/sys_master/images/images/he9/hb2/9503592349726/toyo-logo.webp'
};

function productScore(p) {
  const score = Number(p.testScore ?? p.easyTestScore);
  return Number.isFinite(score) && score > 0 ? score.toFixed(1) : '7.6';
}

function productScoreLabel(p) {
  const score = Number(productScore(p));
  return score >= 8.5 ? 'Excellent' : score >= 7 ? 'Great' : 'Good';
}

// Get URL param
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// Filter products
function filterProducts(opts = {}) {
  let list = [...PRODUCTS];
  if (opts.cat) list = list.filter(p => p.cat === opts.cat);
  if (opts.brand) list = list.filter(p => p.brand.toLowerCase() === opts.brand.toLowerCase());
  if (opts.q) {
    const q = opts.q.toLowerCase();
    list = list.filter(p =>
      p.brand.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.size.toLowerCase().includes(q) ||
      p.cat.toLowerCase().includes(q)
    );
  }
  if (opts.width || opts.ratio || opts.diameter) {
    const w = opts.width, r = opts.ratio, d = opts.diameter;
    list = list.filter(p => {
      const s = p.size.replace('/', '').toLowerCase();
      return (!w || s.includes(w)) && (!d || s.includes(d.replace('.', '')));
    });
  }
  if (opts.maxPrice) list = list.filter(p => p.price <= parseFloat(opts.maxPrice));
  if (opts.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (opts.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (opts.sort === 'name') list.sort((a, b) => (a.brand + a.name).localeCompare(b.brand + b.name));
  else if (opts.sort === 'rating') list.sort((a, b) => b.stars - a.stars);
  return list;
}

const WHATSAPP_ORDER_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

function whatsAppOrderButtonsHTML(productId) {
  return `<div class="whatsapp-order">
        <button class="btn-whatsapp-order" type="button" onclick="orderProductOnWhatsApp('${productId}', 'en', this)">${WHATSAPP_ORDER_ICON} Order on WhatsApp</button>
        <button class="btn-whatsapp-order" type="button" lang="de" onclick="orderProductOnWhatsApp('${productId}', 'de', this)">${WHATSAPP_ORDER_ICON} Per WhatsApp bestellen</button>
      </div>`;
}

// Product card HTML
function productCardHTML(p) {
  const badge = p.oldPrice ? '<div class="product-badge">SALE</div>' : (p.reviews > 30 ? '<div class="product-badge">BEST SELLER</div>' : '');
  const oldP = p.oldPrice ? `<span class="price-old">$${p.oldPrice.toFixed(2)}</span>` : '';
  const stars = Array.from({length: 5}, (_, i) => i < Math.floor(p.stars) ? '&#9733;' : '&#9734;').join('');
  const catLabel = {
    'all-position': 'All Position',
    'drive': 'Commercial Drive',
    'steer': 'Commercial Steer',
    'trailer': 'Commercial Trailer',
    'rv': 'Motorhome / RV'
  }[p.cat] || p.cat;
  const loadText = p.load || p.loadIndex || '';
  const plyText = p.ply ? `${p.ply}-Ply` : '';
  const fitmentText = [p.size, loadText, plyText].filter(Boolean).join(' ') + ' Tires';
  const brandLogo = BRAND_LOGOS[p.brand] || '';
  return `<article class="product-card">
    ${badge}
    <div class="product-card-media">
      <a href="product.html?id=${p.id}" class="product-img-link" aria-label="View ${p.brand} ${p.name} ${p.size}">
        <div class="product-img">${tireImageHTML(p, 156)}</div>
      </a>
      <span class="availability-pill"><span></span> In Stock</span>
    </div>
    <div class="product-info">
      <div class="product-heading">
        <div class="product-heading-copy">
          <span class="product-brand">${p.brand}</span>
          <a href="product.html?id=${p.id}"><h4 class="product-name">${p.name} ${p.size}</h4></a>
        </div>
        ${brandLogo ? `<img class="product-brand-logo" src="${brandLogo}" alt="${p.brand}" loading="lazy" onerror="this.style.display='none'" />` : ''}
      </div>
      <span class="product-category">${catLabel}</span>
      <div class="product-fitment">${fitmentText}</div>
      <div class="easy-test-score"><span>easy test score</span><span class="score-info" title="Double Coin Heavy Duty Truck Warehouse product score">i</span><strong>${productScore(p)}</strong><em>${productScoreLabel(p)}</em></div>
      <div class="product-stars">${stars} <span class="review-count">${p.reviews ? `(${p.reviews} reviews)` : 'No reviews yet'}</span></div>
      <div class="product-price">
        <span class="price-label">Per tire</span>
        ${oldP}
        <span class="price-current">$${p.price.toFixed(2)}</span>
      </div>
      <div class="product-actions">
        <label class="product-qty-label"><span class="sr-only">Quantity</span><select class="product-qty" aria-label="Quantity"><option value="1">1 tire</option><option value="2">2 tires</option><option value="4" selected>4 tires</option><option value="6">6 tires</option><option value="8">8 tires</option></select></label>
        <button class="btn-add-cart product-add-button" type="button" onclick="addProductToCart('${p.id}', this)"><span class="delivery-cart-icon" aria-hidden="true">🛒</span> ADD TO CART</button>
      </div>
      ${whatsAppOrderButtonsHTML(p.id)}
    </div>
  </article>`;
}
