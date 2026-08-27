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

function addProductToCart(productId, button) {
  const product = (window.PRODUCTS || PRODUCTS).find(p => String(p.id) === String(productId));
  if (!product) return showToast('This product is no longer available.');
  const card = button?.closest('.product-card');
  const qty = Math.max(1, parseInt(card?.querySelector('.product-qty')?.value, 10) || 1);
  addProductToCartByQuantity(product, qty);
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

function addToCartWithDelivery(productId, trigger) {
  const product = (window.PRODUCTS || PRODUCTS).find(p => String(p.id) === String(productId));
  if (!product) return showToast('This product is no longer available.');
  const scope = trigger?.closest('.product-card, .product-detail');
  const qty = Math.max(1, parseInt(scope?.querySelector('.product-qty, #qtyInput')?.value, 10) || 1);
  const savedZip = localStorage.getItem('tet_delivery_zip');
  if (savedZip) return addProductToCartByQuantity(product, qty);
  openDeliveryModal(product, qty, true);
}

function checkDeliveryOptions(productId, trigger) {
  const product = (window.PRODUCTS || PRODUCTS).find(p => String(p.id) === String(productId));
  if (!product) return showToast('This product is no longer available.');
  const scope = trigger?.closest('.product-card, .product-detail');
  const qty = Math.max(1, parseInt(scope?.querySelector('.product-qty, #qtyInput')?.value, 10) || 1);
  openDeliveryModal(product, qty, false);
}

function openDeliveryModal(product, qty, addAfterCheck) {
  document.querySelector('.delivery-modal-backdrop')?.remove();
  const backdrop = document.createElement('div');
  backdrop.className = 'delivery-modal-backdrop';
  backdrop.dataset.productId = product.id;
  backdrop.dataset.qty = qty;
  backdrop.dataset.addAfter = addAfterCheck ? 'true' : 'false';
  backdrop.innerHTML = `<section class="delivery-modal" role="dialog" aria-modal="true" aria-labelledby="deliveryModalTitle">
    <button type="button" class="delivery-modal-close" aria-label="Close" onclick="this.closest('.delivery-modal-backdrop').remove()">×</button>
    <h3 id="deliveryModalTitle">Check delivery options</h3>
    <p>${product.brand} ${product.name} ${product.size} · ${qty} ${qty === 1 ? 'tire' : 'tires'}</p>
    <form class="delivery-modal-form" onsubmit="return confirmDeliveryAvailability(event)">
      <input name="zip" inputmode="numeric" autocomplete="postal-code" placeholder="Enter any ZIP code" aria-label="ZIP code" />
      <button type="submit">Check</button>
    </form>
    <div class="delivery-result" id="deliveryResult"></div>
  </section>`;
  backdrop.addEventListener('click', event => { if (event.target === backdrop) backdrop.remove(); });
  document.body.appendChild(backdrop);
  backdrop.querySelector('input')?.focus();
}

function confirmDeliveryAvailability(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const zip = form.querySelector('input[name="zip"]')?.value.trim() || 'your ZIP code';
  const result = form.parentElement.querySelector('#deliveryResult');
  localStorage.setItem('tet_delivery_zip', zip);
  result.innerHTML = `<strong>Delivery available</strong><br>We deliver to ${zip}. Standard delivery: 3–7 business days. Expedited options are available at checkout.`;
  result.style.display = 'block';
  const backdrop = form.closest('.delivery-modal-backdrop');
  if (backdrop?.dataset.addAfter === 'true') {
    const product = (window.PRODUCTS || PRODUCTS).find(p => String(p.id) === String(backdrop.dataset.productId));
    if (product) {
      setTimeout(() => {
        backdrop.remove();
        addProductToCartByQuantity(product, Math.max(1, parseInt(backdrop.dataset.qty, 10) || 1));
      }, 350);
    }
  }
  return false;
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
  Promise.all([
    sendEmail('trucktireswarehouse@gmail.com','New Newsletter Subscriber','<h2>New Newsletter Subscription</h2><p><strong>Email:</strong> ' + email + '</p><p>Subscribed from the website footer.</p>'),
    sendEmail('info@doublecoins-heavyduty.com','New Newsletter Subscriber','<h2>New Newsletter Subscription</h2><p><strong>Email:</strong> ' + email + '</p><p>Subscribed from the website footer.</p>')
  ]).catch(function(err) { console.log('Newsletter email error:', err); });
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
  var signupBody = '<h2>New Member Registration</h2>' +
    '<p><strong>Name:</strong> ' + name + '</p>' +
    '<p><strong>Email:</strong> ' + email + '</p>' +
    '<p><strong>Company:</strong> ' + (company || 'Not provided') + '</p>' +
    '<p><strong>Plan:</strong> ' + plan + '</p>' +
    '<p><strong>Date:</strong> ' + new Date().toLocaleString() + '</p>';
  var welcomeBody = '<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif">' +
    '<div style="background:#1a1a1a;padding:24px;text-align:center"><h1 style="color:#fff;margin:0;font-size:22px">Double Coin Heavy Duty Truck Warehouse</h1></div>' +
    '<div style="padding:28px;background:#fff">' +
    '<h2 style="color:#1a1a1a;margin-top:0">Welcome, ' + name + '!</h2>' +
    '<p style="color:#555;font-size:14px;line-height:1.7">Your account has been created successfully. You now have access to exclusive member pricing and features.</p>' +
    '<p style="font-size:14px"><strong>Plan:</strong> ' + plan + '</p>' +
    '<hr style="border:none;border-top:1px solid #eee;margin:24px 0">' +
    '<p style="font-size:13px;color:#999">If you have any questions, contact us at <a href="tel:3104925660" style="color:#e60000">(310) 492-5660</a>.</p>' +
    '</div>' +
    '<div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#999">&copy; 2026 Double Coin Heavy Duty Truck Warehouse. All rights reserved.</div>' +
    '</div>';
  try {
    await Promise.all([
      sendEmail('trucktireswarehouse@gmail.com','New Member Signup: ' + name, signupBody),
      sendEmail('info@doublecoins-heavyduty.com','New Member Signup: ' + name, signupBody),
      sendEmail(email,'Welcome to Double Coin Heavy Duty Truck Warehouse', welcomeBody)
    ]);
  } catch(e) { console.log('Signup email error:', e.message); }
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

// --- Email via PHP mail ---
function sendEmail(to, subject, body) {
  return fetch('send-email.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: to, subject: subject, body: body })
  }).then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.ok) { console.log('Email sent to ' + to); return 'OK'; }
      console.error('Email failed to ' + to, data.error);
      return 'FAILED';
    }).catch(function(err) {
      console.error('Email request failed:', err);
      return 'FAILED';
    });
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
