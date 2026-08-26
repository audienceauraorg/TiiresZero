// =============================================
//  SHARED HEADER & FOOTER COMPONENTS
// =============================================

const HEADER_HTML = `
<div class="top-bar">
  <div class="container top-bar-inner">
    <span>Free shipping on orders over $500! Call us: <a href="tel:3104925660">(310) 492-5660</a></span>
    <div class="top-bar-links">
      <a href="order-tracking.html">Track Order</a>
      <a href="login.html" data-auth-login>Login</a>
      <a href="account.html" data-auth-account>My Account</a>
    </div>
  </div>
</div>
<header class="header">
  <div class="container header-inner">
    <a href="index.html" class="logo">
      <img src="logo.svg" alt="Double Coin Heavy Duty Truck Warehouse" height="48" />
    </a>
    <div class="header-search">
      <input type="text" placeholder="Search by tire size, brand, or model..." class="search-input" id="mainSearch"/>
      <button class="search-btn" onclick="headerSearch()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>
    </div>
    <div class="header-actions">
      <a href="account.html" class="action-icon" title="Account">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Account</span>
      </a>
      <a href="#" class="action-icon cart-icon" title="Cart" onclick="openCart(); return false;">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <span class="cart-count">0</span>
      </a>
    </div>
    <button class="hamburger" onclick="toggleMobileNav()" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
  <nav class="main-nav" id="mainNav">
    <div class="container nav-inner">
      <a href="deals.html" class="nav-link deals-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        Deals
      </a>
      <a href="membership.html" class="nav-link">Membership</a>
      <a href="financing.html" class="nav-link">Financing</a>
      <div class="nav-dropdown">
        <a href="tires.html" class="nav-link">Shop Tires &#9660;</a>
        <div class="dropdown-menu">
          <a href="tires.html?cat=all-position">All Position Tires</a>
          <a href="tires.html?cat=drive">Drive Tires</a>
          <a href="tires.html?cat=steer">Steer Tires</a>
          <a href="tires.html?cat=trailer">Trailer Tires</a>
          <a href="tires.html?cat=rv">Motorhome / RV</a>
        </div>
      </div>
      <a href="brands.html" class="nav-link">Brands</a>
      <a href="blog.html" class="nav-link">Blog</a>
    </div>
  </nav>
</header>`;

const FOOTER_HTML = `
<footer class="footer">
  <div class="footer-top">
    <div class="container footer-grid">
      <div class="footer-col">
        <div class="footer-logo">
          <img src="logo.svg" alt="Double Coin Heavy Duty Truck Warehouse" height="40" />
        </div>
        <p class="footer-desc">Save on the widest selection of major brand commercial truck tires online.</p>
        <div class="footer-contact">
          <p><a href="tel:3104925660">(310) 492-5660</a></p>
          <p><a href="mailto:info@doublecoins-heavyduty.com">info@doublecoins-heavyduty.com</a></p>
        </div>
        <div class="social-links">
          <a href="#" class="social-link" title="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          <a href="#" class="social-link" title="YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#111"/></svg></a>
          <a href="#" class="social-link" title="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
        </div>
      </div>
      <div class="footer-col">
        <h4 class="footer-heading">Shop Tires</h4>
        <ul class="footer-links">
          <li><a href="tires.html?cat=all-position">All Position Tires</a></li>
          <li><a href="tires.html?cat=steer">Steer Tires</a></li>
          <li><a href="tires.html?cat=drive">Drive Tires</a></li>
          <li><a href="tires.html?cat=trailer">Trailer Tires</a></li>
          <li><a href="tires.html?cat=rv">Motorhome / RV</a></li>
          <li><a href="deals.html">Deals &amp; Specials</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 class="footer-heading">Useful Links</h4>
        <ul class="footer-links">
          <li><a href="brands.html">All Brands</a></li>
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="financing.html">Financing</a></li>
          <li><a href="returns.html">Return Policy</a></li>
          <li><a href="membership.html">Membership</a></li>
          <li><a href="order-tracking.html">Track Your Order</a></li>
          <li><a href="blog.html">Blog</a></li>
          <li><a href="contact.html">Contact Us</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 class="footer-heading">Newsletter</h4>
        <p class="footer-desc">Subscribe to get exclusive deals and tire tips delivered to your inbox.</p>
        <form class="newsletter-form" onsubmit="subscribeNewsletter(event)">
          <input type="email" placeholder="Enter your email" class="newsletter-input" required/>
          <button type="submit" class="newsletter-btn">Subscribe</button>
        </form>
        <div class="footer-heading" style="margin-top:24px">We Accept</div>
        <div class="payment-icons">
          <img src="https://www.tires-easy-truck.com/medias/sys_master/images/images/ha7/hfb/9503593398302/VisaLogoSmall.webp" alt="Visa" class="payment-icon" />
          <img src="https://www.tires-easy-truck.com/medias/sys_master/images/images/h68/h0a/9503593463838/MastercardLogoSmall.webp" alt="Mastercard" class="payment-icon" />
          <img src="https://www.tires-easy-truck.com/medias/sys_master/images/images/hdb/h0f/9503593529374/AmericanExpressLogoSmall.webp" alt="American Express" class="payment-icon" />
          <img src="https://www.tires-easy-truck.com/medias/sys_master/images/images/h7f/h9a/9503593627678/PaypalLogoSmall.webp" alt="PayPal" class="payment-icon" />
          <img src="https://www.tires-easy-truck.com/medias/sys_master/images/images/h50/h08/9503593660446/DiscoverLogoSmall.webp" alt="Discover" class="payment-icon" />
        </div>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container footer-bottom-inner">
      <p>&copy; 2026 Double Coin Heavy Duty Truck Warehouse&reg; All Rights Reserved</p>
      <div class="footer-legal">
        <a href="privacy.html">Privacy Policy</a>
        <a href="terms.html">Terms &amp; Conditions</a>
        <a href="sitemap.html">Sitemap</a>
      </div>
    </div>
  </div>
</footer>
<div class="floating-contact">
  <a href="sms:+13104925660" class="floating-btn floating-btn-sms" title="SMS: 310-492-5660">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  </a>
  <a href="https://wa.me/13108781781" target="_blank" rel="noopener" class="floating-btn floating-btn-whatsapp" title="WhatsApp: 310-878-1781">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  </a>
</div>
<div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>
<div class="cart-sidebar" id="cartSidebar">
  <div class="cart-header">
    <h3>Your Cart</h3>
    <button class="cart-close" onclick="closeCart()">&times;</button>
  </div>
  <div class="cart-body" id="cartBody"></div>
  <div class="cart-footer" id="cartFooter" style="display:none">
    <div class="cart-total">Total: <strong id="cartTotal">$0.00</strong></div>
    <button class="btn-checkout" onclick="window.location.href='checkout.html'">Checkout</button>
  </div>
</div>`;

// Inject header and footer
document.addEventListener('DOMContentLoaded', () => {
  const headerEl = document.getElementById('site-header');
  if (headerEl) headerEl.innerHTML = HEADER_HTML;
  const footerEl = document.getElementById('site-footer');
  if (footerEl) footerEl.innerHTML = FOOTER_HTML;

  // After injection, init
  if (typeof initPage === 'function') initPage();
  if (typeof updateAuthUI === 'function') updateAuthUI();
  if (typeof updateCartUI === 'function') updateCartUI();
});

function toggleMobileNav() {
  const nav = document.getElementById('mainNav');
  const btn = document.querySelector('.hamburger');
  if (nav) nav.classList.toggle('open');
  if (btn) btn.classList.toggle('open');
}

function headerSearch() {
  const q = document.getElementById('mainSearch')?.value.trim();
  if (q) window.location.href = `tires.html?q=${encodeURIComponent(q)}`;
}

function subscribeNewsletter(e) {
  e.preventDefault();
  const email = e.target.querySelector('input').value;
  if (typeof sendEmail === 'function') {
    Promise.all([
      sendEmail('trucktireswarehouse@gmail.com','New Newsletter Subscriber','<h2>New Newsletter Subscription</h2><p><strong>Email:</strong> ' + email + '</p><p>Subscribed from the website footer.</p>'),
      sendEmail('info@doublecoins-heavyduty.com','New Newsletter Subscriber','<h2>New Newsletter Subscription</h2><p><strong>Email:</strong> ' + email + '</p><p>Subscribed from the website footer.</p>')
    ]).catch(function(err) { console.log('Newsletter email error:', err); });
  }
  showToast('Thank you for subscribing!', 'success');
  e.target.reset();
}
