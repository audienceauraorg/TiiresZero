// =============================================
//  TIRES EASY TRUCK - Main Script
// =============================================

// --- Cart State ---
let cart = JSON.parse(localStorage.getItem('tet_cart') || '[]');

function catalogProductForCart(item) {
  const catalog = typeof PRODUCTS !== 'undefined' ? PRODUCTS : (window.SOURCE_PRODUCTS || []);
  return catalog.find(p => (item.id && String(p.id) === String(item.id)) ||
    (p.brand === item.brand && (`${p.name} ${p.size}` === item.name || item.name?.startsWith(`${p.name} `))));
}

// Upgrade carts created before product images were stored.
cart = cart.map(item => {
  const product = catalogProductForCart(item);
  return product ? { ...item, id: item.id || product.id, image: item.image || product.image } : item;
});
if (cart.length) localStorage.setItem('tet_cart', JSON.stringify(cart));

function saveCart() {
  localStorage.setItem('tet_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
  renderCartItems();
  const footer = document.getElementById('cartFooter');
  if (footer) footer.style.display = cart.length ? 'block' : 'none';
}

function renderCartItems() {
  const body = document.getElementById('cartBody');
  if (!body) return;
  if (cart.length === 0) {
    body.innerHTML = `<div class="cart-empty">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      <p>Your cart is empty</p>
      <a href="tires.html" class="btn-outline">Shop Tires</a>
    </div>`;
    return;
  }
  body.innerHTML = cart.map((item, idx) => {
    const product = catalogProductForCart(item);
    const image = item.image || product?.image;
    return `
    <div class="cart-item">
      <div class="cart-item-img">
        ${image ? `<img src="${image}" alt="${item.brand} ${item.name}" loading="lazy" />` : '<svg width="40" height="40" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="#1a1a1a"/><circle cx="32" cy="32" r="16" fill="none" stroke="#555" stroke-width="6"/><circle cx="32" cy="32" r="5" fill="#e60000"/></svg>'}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.brand} ${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
        <div class="cart-item-qty">Quantity: <strong>${item.qty}</strong></div>
      </div>
      <div class="cart-item-total">$${(item.price * item.qty).toFixed(2)}</div>
      <button class="cart-item-remove" onclick="removeFromCart(${idx})">×</button>
    </div>
  `;
  }).join('');
}

function addToCart(brand, name, price) {
  const product = catalogProductForCart({ brand, name });
  const existing = cart.find(i => i.brand === brand && i.name === name);
  if (existing) {
    existing.qty++;
    if (product) { existing.id = existing.id || product.id; existing.image = existing.image || product.image; }
  } else {
    cart.push({ id: product?.id, brand, name, price, image: product?.image, qty: 1 });
  }
  saveCart();
  openCart();
  showToast(`Added to cart: ${brand} ${name}`, 'success');
}

function selectedQuantity(trigger) {
  const scope = trigger?.closest('.product-card, .product-detail');
  return Math.max(1, parseInt(scope?.querySelector('.product-qty, #qtyInput')?.value, 10) || 1);
}

function addProductToCart(productId, button) {
  const product = (window.PRODUCTS || PRODUCTS).find(p => String(p.id) === String(productId));
  if (!product) return showToast('This product is no longer available.');
  addProductToCartByQuantity(product, selectedQuantity(button));
}

function addProductToCartByQuantity(product, qty) {
  const name = `${product.name} ${product.size}`;
  const existing = cart.find(item => item.brand === product.brand && item.name === name);
  if (existing) existing.qty += qty;
  else cart.push({ id: product.id, brand: product.brand, name, price: product.price, image: product.image, qty });
  saveCart();
  openCart();
  showToast(`Added ${qty} ${qty === 1 ? 'tire' : 'tires'} to cart`, 'success');
}

// --- WhatsApp orders ---
// English orders go to the US number, German orders to the German number.
const WHATSAPP_ORDER = {
  en: {
    number: '19842814824',
    greeting: 'Hello, I would like to order:',
    quantity: 'Quantity',
    unitPrice: 'Price per tire',
    subtotal: 'Subtotal',
    product: 'Product',
    closing: 'Please confirm availability, shipping and payment.',
  },
  de: {
    number: '4917613564657',
    greeting: 'Hallo, ich möchte Folgendes bestellen:',
    quantity: 'Menge',
    unitPrice: 'Preis pro Reifen',
    subtotal: 'Zwischensumme',
    product: 'Produkt',
    closing: 'Bitte bestätigen Sie Verfügbarkeit, Versand und Zahlung.',
  },
};

function openWhatsAppOrder(lang, text) {
  window.open(`https://wa.me/${WHATSAPP_ORDER[lang].number}?text=${encodeURIComponent(text)}`, '_blank');
}

function orderProductOnWhatsApp(productId, lang, trigger) {
  const product = (window.PRODUCTS || PRODUCTS).find(p => String(p.id) === String(productId));
  if (!product) return showToast(lang === 'de' ? 'Dieses Produkt ist nicht mehr verfügbar.' : 'This product is no longer available.');
  const qty = selectedQuantity(trigger);
  const t = WHATSAPP_ORDER[lang];
  const url = new URL(`product.html?id=${product.id}`, window.location.href).href;
  openWhatsAppOrder(lang, `${t.greeting}\n\n` +
    `*${product.brand} ${product.name} ${product.size}*\n` +
    `• ${t.quantity}: ${qty}\n` +
    `• ${t.unitPrice}: $${product.price.toFixed(2)}\n` +
    `• ${t.subtotal}: $${(product.price * qty).toFixed(2)}\n` +
    `• ${t.product}: ${url}\n\n` +
    t.closing);
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  saveCart();
}

function openCart() {
  document.getElementById('cartSidebar')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

// Cart icon click
document.querySelector('.cart-icon')?.addEventListener('click', e => {
  e.preventDefault();
  openCart();
});

// --- Selector Tabs ---
document.querySelectorAll('.selector-tab').forEach(tab => {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.selector-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.selector-panel').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    const target = document.getElementById('tab-' + this.dataset.tab);
    if (target) target.classList.add('active');
  });
});

// --- Search by Size ---
function searchBySize() {
  const w = document.getElementById('sel-width')?.value;
  const r = document.getElementById('sel-ratio')?.value;
  const d = document.getElementById('sel-diameter')?.value;
  if (!w || !r || !d) {
    showToast('Please select Width, Ratio, and Diameter');
    return;
  }
  window.location.href = `tires.html?width=${w}&ratio=${r}&diameter=${d}`;
}

function searchBrand(brand) {
  window.location.href = `tires.html?brand=${encodeURIComponent(brand)}`;
}

// --- Header Search ---
document.querySelector('.search-btn')?.addEventListener('click', () => {
  const q = document.querySelector('.search-input')?.value.trim();
  if (q) window.location.href = `tires.html?q=${encodeURIComponent(q)}`;
});
document.querySelector('.search-input')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const q = e.target.value.trim();
    if (q) window.location.href = `tires.html?q=${encodeURIComponent(q)}`;
  }
});

// --- Newsletter ---
function subscribeNewsletter(e) {
  e.preventDefault();
  const email = e.target.querySelector('input').value;
  var waText = '━━━━━━━━━━━━━━━━━━━━━━\n' +
    '*📧 NEW NEWSLETTER SUBSCRIBER*\n' +
    '_Double Coin Heavy Duty Truck Warehouse_\n' +
    '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
    '• Email: ' + email + '\n' +
    '_Subscribed: ' + new Date().toLocaleString() + '_';
  window.open('https://wa.me/19842814824?text=' + encodeURIComponent(waText), '_blank');
  showToast('Thank you for subscribing, ' + email + '!', 'success');
  e.target.reset();
  return false;
}

// --- Local account system ---
// This keeps the demo storefront usable without a backend. Production deployments
// should replace these helpers with server-side authentication and sessions.
const AUTH_USERS_KEY = 'tet_users';
const AUTH_SESSION_KEY = 'tet_session';

function readAuthUsers() {
  try { return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '[]'); }
  catch { return []; }
}

async function hashAuthPassword(password) {
  if (window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return btoa(unescape(encodeURIComponent(password)));
}

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || 'null'); }
  catch { return null; }
}

function updateAuthUI() {
  const user = getCurrentUser();
  document.querySelectorAll('[data-auth-login]').forEach(link => {
    link.textContent = user ? 'Sign out' : 'Login';
    link.href = user ? '#' : 'login.html';
    if (user) link.onclick = () => { signOut(); return false; };
  });
  document.querySelectorAll('[data-auth-account]').forEach(link => {
    link.textContent = user ? (user.name || 'My Account') : 'My Account';
  });
}

async function registerUser(event) {
  event?.preventDefault?.();
  const name = document.getElementById('signupName')?.value.trim();
  const email = document.getElementById('signupEmail')?.value.trim().toLowerCase();
  const company = document.getElementById('signupCompany')?.value.trim() || '';
  const password = document.getElementById('signupPassword')?.value || '';
  const confirm = document.getElementById('signupPasswordConfirm')?.value || '';
  const plan = document.getElementById('planSelect')?.value || 'Pro — $19/mo';
  if (!name || !email || !password) return showToast('Please complete your name, email, and password.');
  if (password.length < 6) return showToast('Password must be at least 6 characters.');
  if (password !== confirm) return showToast('Passwords do not match.');
  const users = readAuthUsers();
  if (users.some(user => user.email === email)) return showToast('An account with this email already exists.');
  users.push({ name, email, company, plan, passwordHash: await hashAuthPassword(password), createdAt: new Date().toISOString() });
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ name, email, company, plan }));
  updateAuthUI();
  var waText = '━━━━━━━━━━━━━━━━━━━━━━\n' +
    '*👤 NEW MEMBER REGISTRATION*\n' +
    '_Double Coin Heavy Duty Truck Warehouse_\n' +
    '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
    '*📋 Member Details*\n' +
    '• Name: ' + name + '\n' +
    '• Email: ' + email + '\n' +
    '• Company: ' + (company || 'Not provided') + '\n' +
    '• Plan: ' + plan + '\n' +
    '\n_Registered: ' + new Date().toLocaleString() + '_';
  window.open('https://wa.me/19842814824?text=' + encodeURIComponent(waText), '_blank');
  showToast('Account created successfully.', 'success');
  setTimeout(() => { window.location.href = 'account.html'; }, 500);
  return false;
}

async function signInUser(event) {
  event?.preventDefault?.();
  const email = document.getElementById('email')?.value.trim().toLowerCase();
  const password = document.getElementById('password')?.value || '';
  const user = readAuthUsers().find(item => item.email === email);
  if (!user || user.passwordHash !== await hashAuthPassword(password)) return showToast('Email or password is incorrect.');
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ name: user.name, email: user.email, company: user.company, plan: user.plan }));
  updateAuthUI();
  showToast('Signed in successfully.', 'success');
  setTimeout(() => { window.location.href = 'account.html'; }, 500);
  return false;
}

function signOut() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  updateAuthUI();
  showToast('You have been signed out.', 'success');
}

// --- Toast ---
function showToast(msg, type = '') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast' + (type ? ' ' + type : '');
  void toast.offsetWidth;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// Init
updateAuthUI();
updateCartUI();
