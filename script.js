const CURRENCY = 'EGP';
function formatPrice(n) { return n.toFixed(2) + ' ' + CURRENCY; }
// ===== Default Products (seeded on first load) =====
const DEFAULT_PRODUCTS = [
  { id: 1, name: "Classic V-Neck Top", category: "scrubs", sub: "women", price: 45, image: "https://picsum.photos/seed/ws1/400/530.jpg", colors: ["#2D6A4F","#1A1A1A","#8B4513"], sizes: ["XS","S","M","L","XL","XXL"], badge: "Best Seller", desc: "Timeless V-neck design with side slits for effortless movement." },
  { id: 2, name: "Modern Fit Tunic", category: "scrubs", sub: "women", price: 48, image: "https://picsum.photos/seed/ws2/400/530.jpg", colors: ["#4A6FA5","#2D6A4F","#6B4C6E"], sizes: ["XS","S","M","L","XL"], badge: "", desc: "Contemporary tunic with princess seams for a flattering silhouette." },
  { id: 3, name: "Cargo Style Top", category: "scrubs", sub: "women", price: 52, image: "https://picsum.photos/seed/ws3/400/530.jpg", colors: ["#1A1A1A","#556B2F","#4A4A4A"], sizes: ["S","M","L","XL","XXL"], badge: "New", desc: "Functional cargo pockets with a sporty yet professional look." },
  { id: 4, name: "Wrap Style Top", category: "scrubs", sub: "women", price: 50, image: "https://picsum.photos/seed/ws4/400/530.jpg", colors: ["#8B2252","#2D6A4F","#1A1A1A"], sizes: ["XS","S","M","L","XL"], badge: "", desc: "Elegant wrap design that flatters every body type beautifully." },
  { id: 5, name: "Fitted Jogger Pants", category: "scrubs", sub: "women", price: 42, image: "https://picsum.photos/seed/ws5/400/530.jpg", colors: ["#2D6A4F","#1A1A1A","#4A4A4A"], sizes: ["XS","S","M","L","XL","XXL"], badge: "Popular", desc: "Tapered jogger fit with elastic ankle cuffs for modern style." },
  { id: 6, name: "Classic Straight Pants", category: "scrubs", sub: "women", price: 40, image: "https://picsum.photos/seed/ws6/400/530.jpg", colors: ["#2D6A4F","#1A1A1A","#556B2F"], sizes: ["XS","S","M","L","XL","XXL"], badge: "", desc: "Traditional straight-leg cut with a comfortable mid-rise waist." },
  { id: 7, name: "Flare Leg Pants", category: "scrubs", sub: "women", price: 44, image: "https://picsum.photos/seed/ws7/400/530.jpg", colors: ["#4A6FA5","#2D6A4F","#8B4513"], sizes: ["S","M","L","XL"], badge: "", desc: "Retro-inspired flare leg with a contemporary twist." },
  { id: 8, name: "Cargo Pocket Pants", category: "scrubs", sub: "women", price: 46, image: "https://picsum.photos/seed/ws8/400/530.jpg", colors: ["#1A1A1A","#556B2F","#4A4A4A"], sizes: ["XS","S","M","L","XL","XXL"], badge: "New", desc: "Multi-pocket cargo design for those who need extra storage." },
  { id: 9, name: "Classic V-Neck Top", category: "scrubs", sub: "men", price: 45, image: "https://picsum.photos/seed/ms1/400/530.jpg", colors: ["#2D6A4F","#1A1A1A","#4A6FA5"], sizes: ["S","M","L","XL","XXL","3XL"], badge: "Best Seller", desc: "Clean V-neck cut built for all-day professional comfort." },
  { id: 10, name: "Modern Fit Polo", category: "scrubs", sub: "men", price: 48, image: "https://picsum.photos/seed/ms2/400/530.jpg", colors: ["#2D6A4F","#1A1A1A","#556B2F"], sizes: ["S","M","L","XL","XXL"], badge: "", desc: "Polo-collar scrub top with a refined, tailored fit." },
  { id: 11, name: "Cargo Style Top", category: "scrubs", sub: "men", price: 52, image: "https://picsum.photos/seed/ms3/400/530.jpg", colors: ["#1A1A1A","#556B2F","#4A4A4A"], sizes: ["S","M","L","XL","XXL","3XL"], badge: "Popular", desc: "Heavy-duty cargo pockets with reinforced stitching." },
  { id: 12, name: "Henley Style Top", category: "scrubs", sub: "men", price: 50, image: "https://picsum.photos/seed/ms4/400/530.jpg", colors: ["#2D6A4F","#4A6FA5","#8B4513"], sizes: ["S","M","L","XL","XXL"], badge: "New", desc: "Casual henley placket for a relaxed yet polished look." },
  { id: 13, name: "Classic Straight Pants", category: "scrubs", sub: "men", price: 40, image: "https://picsum.photos/seed/ms5/400/530.jpg", colors: ["#2D6A4F","#1A1A1A","#4A4A4A"], sizes: ["S","M","L","XL","XXL","3XL"], badge: "", desc: "Roomy straight-leg fit with a drawstring waist." },
  { id: 14, name: "Modern Jogger Pants", category: "scrubs", sub: "men", price: 44, image: "https://picsum.photos/seed/ms6/400/530.jpg", colors: ["#1A1A1A","#2D6A4F","#556B2F"], sizes: ["S","M","L","XL","XXL"], badge: "Best Seller", desc: "Sleek jogger silhouette with professional appeal." },
  { id: 15, name: "Cargo Pocket Pants", category: "scrubs", sub: "men", price: 46, image: "https://picsum.photos/seed/ms7/400/530.jpg", colors: ["#4A4A4A","#2D6A4F","#1A1A1A"], sizes: ["S","M","L","XL","XXL","3XL"], badge: "", desc: "Rugged cargo pants designed for demanding shifts." },
  { id: 16, name: "Tall Fit Straight Pants", category: "scrubs", sub: "men", price: 42, image: "https://picsum.photos/seed/ms8/400/530.jpg", colors: ["#2D6A4F","#1A1A1A"], sizes: ["M","L","XL","XXL","3XL"], badge: "New", desc: "Extended length for taller frames, same great comfort." },
  { id: 17, name: "Classic Kimono Robe", category: "Lab Coats", sub: "women", price: 65, image: "https://picsum.photos/seed/wb1/400/530.jpg", colors: ["#F5F0E8","#E8DDD0","#D4C5B2"], sizes: ["S","M","L","XL"], badge: "Best Seller", desc: "Lightweight kimono style with an inner tie for secure closure." },
  { id: 18, name: "Luxury Shawl Collar", category: "Lab Coats", sub: "women", price: 75, image: "https://picsum.photos/seed/wb2/400/530.jpg", colors: ["#F5F0E8","#2D6A4F","#1A1A1A"], sizes: ["S","M","L","XL"], badge: "Premium", desc: "Plush shawl collar robe with deep pockets and belt loops." },
  { id: 19, name: "Lightweight Waffle", category: "Lab Coats", sub: "women", price: 55, image: "https://picsum.photos/seed/wb3/400/530.jpg", colors: ["#F5F0E8","#B8D4E3","#D4C5B2"], sizes: ["XS","S","M","L","XL"], badge: "", desc: "Breathable waffle weave perfect for warmer climates." },
  { id: 20, name: "Spa Style Robe", category: "Lab Coats", sub: "women", price: 60, image: "https://picsum.photos/seed/wb4/400/530.jpg", colors: ["#F5F0E8","#E8DDD0"], sizes: ["S","M","L","XL"], badge: "Popular", desc: "Professional spa-grade robe with snap closure option." },
  { id: 21, name: "Hooded Bathrobe", category: "Lab Coats", sub: "women", price: 70, image: "https://picsum.photos/seed/wb5/400/530.jpg", colors: ["#F5F0E8","#B8D4E3","#E8DDD0"], sizes: ["S","M","L","XL"], badge: "New", desc: "Cozy hooded design for extra warmth after a shower." },
  { id: 22, name: "Long Turkish Robe", category: "Lab Coats", sub: "women", price: 80, image: "https://picsum.photos/seed/wb6/400/530.jpg", colors: ["#F5F0E8","#2D6A4F"], sizes: ["S","M","L","XL"], badge: "Premium", desc: "Premium Turkish cotton with exceptional absorbency." },
  { id: 23, name: "Classic Kimono Robe", category: "Lab Coats", sub: "men", price: 65, image: "https://picsum.photos/seed/mb1/400/530.jpg", colors: ["#2D6A4F","#1A1A1A","#4A4A4A"], sizes: ["M","L","XL","XXL"], badge: "Best Seller", desc: "Timeless kimono cut in durable, quick-dry fabric." },
  { id: 24, name: "Luxury Shawl Collar", category: "Lab Coats", sub: "men", price: 75, image: "https://picsum.photos/seed/mb2/400/530.jpg", colors: ["#2D6A4F","#1A1A1A","#556B2F"], sizes: ["M","L","XL","XXL"], badge: "Premium", desc: "Hotel-quality shawl collar with premium cotton construction." },
  { id: 25, name: "Lightweight Waffle", category: "Lab Coats", sub: "men", price: 55, image: "https://picsum.photos/seed/mb3/400/530.jpg", colors: ["#F5F0E8","#2D6A4F","#4A4A4A"], sizes: ["M","L","XL","XXL"], badge: "", desc: "Light and breathable waffle weave for everyday comfort." },
  { id: 26, name: "Spa Style Robe", category: "Lab Coats", sub: "men", price: 60, image: "https://picsum.photos/seed/mb4/400/530.jpg", colors: ["#F5F0E8","#1A1A1A"], sizes: ["M","L","XL","XXL"], badge: "Popular", desc: "Clean-lined spa robe used by professionals worldwide." },
  { id: 27, name: "Hooded Bathrobe", category: "Lab Coats", sub: "men", price: 70, image: "https://picsum.photos/seed/mb5/400/530.jpg", colors: ["#2D6A4F","#1A1A1A","#4A4A4A"], sizes: ["M","L","XL","XXL"], badge: "New", desc: "Functional hood with deep side pockets for utility." },
  { id: 28, name: "Long Turkish Robe", category: "Lab Coats", sub: "men", price: 80, image: "https://picsum.photos/seed/mb6/400/530.jpg", colors: ["#F5F0E8","#2D6A4F","#1A1A1A"], sizes: ["M","L","XL","XXL"], badge: "Premium", desc: "Extra-long Turkish cotton robe with superior softness." },
];

// ===== Products Data Layer =====
function getProducts() {
  const stored = localStorage.getItem('sh_products');
  if (stored) {
    try { return JSON.parse(stored); } catch(e) { /* fallback */ }
  }
  // Seed defaults
  localStorage.setItem('sh_products', JSON.stringify(DEFAULT_PRODUCTS));
  return [...DEFAULT_PRODUCTS];
}

function saveProductsToStorage(prods) {
  localStorage.setItem('sh_products', JSON.stringify(prods));
}

function getProductById(id) {
  return getProducts().find(p => p.id === id);
}

function addProduct(data) {
  const prods = getProducts();
  const maxId = prods.reduce((max, p) => Math.max(max, p.id), 0);
  const newProduct = {
    id: maxId + 1,
    name: data.name,
    category: data.category,
    sub: data.sub,
    price: parseFloat(data.price),
    image: data.image || `https://picsum.photos/seed/prod${maxId+1}/400/530.jpg`,
    colors: data.colors.filter(c => c.trim() !== ''),
    sizes: data.sizes.filter(s => s !== ''),
    badge: data.badge || '',
    desc: data.desc || ''
  };
  prods.push(newProduct);
  saveProductsToStorage(prods);
  return newProduct;
}

function updateProduct(id, data) {
  const prods = getProducts();
  const idx = prods.findIndex(p => p.id === id);
  if (idx === -1) return null;
  prods[idx] = {
    ...prods[idx],
    name: data.name,
    category: data.category,
    sub: data.sub,
    price: parseFloat(data.price),
    image: data.image || prods[idx].image,
    colors: data.colors.filter(c => c.trim() !== ''),
    sizes: data.sizes.filter(s => s !== ''),
    badge: data.badge || '',
    desc: data.desc || ''
  };
  saveProductsToStorage(prods);
  return prods[idx];
}

function deleteProduct(id) {
  let prods = getProducts();
  prods = prods.filter(p => p.id !== id);
  saveProductsToStorage(prods);
}

// ===== State =====
let cart = JSON.parse(localStorage.getItem('sh_cart')) || [];
let currentTab = 'women';

// ===== DOM Helpers =====
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

// ===== Toast System =====
function showToast(message, type = 'success') {
  let container = $('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '&#10003;' : '&#10007;'}</span><span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ===== Cart Management =====
function saveCart() {
  localStorage.setItem('sh_cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = $('.cart-count');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
  }
}

function addToCart(productId, size = null, color = null) {
  const product = getProductById(productId);
  if (!product) return;
  const selectedSize = size || product.sizes[Math.min(2, product.sizes.length - 1)];
  const selectedColor = color || product.colors[0];
  const key = `${productId}-${selectedSize}-${selectedColor}`;
  const existing = cart.find(item => item.key === key);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      key, id: productId, name: product.name, price: product.price,
      image: product.image, size: selectedSize, color: selectedColor, qty: 1
    });
  }
  saveCart();
  showToast(`${product.name} added to cart`);
}

function removeFromCart(key) {
  cart = cart.filter(item => item.key !== key);
  saveCart();
  renderCart();
}

function updateQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(key); return; }
  saveCart();
  renderCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

// ===== Render Cart =====
function renderCart() {
  const itemsContainer = $('.cart-items');
  const totalEl = $('.cart-total-value');
  const footerEl = $('.cart-footer');
  if (!itemsContainer) return;
  if (cart.length === 0) {
    itemsContainer.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">&#128717;</div><p>Your cart is empty</p></div>`;
    footerEl.style.display = 'none';
    return;
  }
  footerEl.style.display = 'block';
  itemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-image"><img src="${item.image}" alt="${item.name}" loading="lazy"></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">Size: ${item.size} &middot; <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.color};vertical-align:middle;margin:0 2px;"></span></div>
        <div class="cart-item-bottom">
          <div class="cart-qty">
            <button onclick="updateQty('${item.key}', -1)">&minus;</button>
            <span>${item.qty}</span>
            <button onclick="updateQty('${item.key}', 1)">&plus;</button>
          </div>
          <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.key}')">Remove</button>
      </div>
    </div>
  `).join('');
  totalEl.textContent = `${formatPrice(getCartTotal())}`;
}

// ===== Cart Sidebar Toggle =====
function openCart() {
  renderCart();
  $('.cart-overlay').classList.add('open');
  $('.cart-sidebar').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  $('.cart-overlay').classList.remove('open');
  $('.cart-sidebar').classList.remove('open');
  document.body.style.overflow = '';
}

// ===== Order Modal =====
function openOrderModal() {
  if (cart.length === 0) { showToast('Your cart is empty', 'error'); return; }
  closeCart();
  setTimeout(() => {
    const modal = $('.modal-overlay.order-modal');
    const summaryBox = $('.order-summary-box');
    summaryBox.innerHTML = `
      <h4>Order Summary (${cart.reduce((s,i)=>s+i.qty,0)} items)</h4>
      ${cart.map(i => `<div class="order-summary-item"><span>${i.name} (${i.size}) x${i.qty}</span><span>${formatPrice(i.price*i.qty)}</span></div>`).join('')}
      <div class="order-summary-total"><span>Total</span><span>${formatPrice(getCartTotal())}</span></div>
    `;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }, 300);
}
function closeOrderModal() {
  $('.modal-overlay.order-modal').classList.remove('open');
  document.body.style.overflow = '';
}

// ===== Submit Order =====
function submitOrder(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('[name="name"]').value.trim();
  const phone = form.querySelector('[name="phone"]').value.trim();
  const email = form.querySelector('[name="email"]').value.trim();
  const address = form.querySelector('[name="address"]').value.trim();
  const notes = form.querySelector('[name="notes"]').value.trim();
  let valid = true;
  $$('.form-group[data-required]', form).forEach(g => {
    const input = g.querySelector('input, textarea');
    if (!input.value.trim()) { g.classList.add('error'); valid = false; }
    else { g.classList.remove('error'); }
  });
  if (!valid) { showToast('Please fill all required fields', 'error'); return; }
  const orders = JSON.parse(localStorage.getItem('sh_orders')) || [];
  const order = {
    id: 'SH' + Date.now().toString(36).toUpperCase(),
    date: new Date().toISOString(),
    customer: { name, phone, email, address, notes },
    items: [...cart],
    total: getCartTotal(),
    status: 'pending'
  };
  orders.unshift(order);
  localStorage.setItem('sh_orders', JSON.stringify(orders));
  cart = [];
  saveCart();
  form.reset();
  closeOrderModal();
  showToast('Order placed successfully! We will contact you soon.');
}

// ===== Render Products =====
function renderProducts(container, items) {
  if (!container) return;
  if (items.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);">
      <div style="font-size:3rem;margin-bottom:12px;opacity:0.3;">&#128717;</div>
      <p>No products found in this category.</p>
    </div>`;
    return;
  }
  container.innerHTML = items.map((p, i) => `
    <div class="product-card reveal reveal-delay-${(i % 4) + 1}">
      <div class="product-card-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="product-card-badge">${p.badge}</span>` : ''}
        <div class="product-card-actions">
          <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
      <div class="product-card-info">
        <div class="product-card-category">${p.sub === 'women' ? "Women's" : "Men's"} ${p.category === 'scrubs' ? 'Scrubs' : 'Lab Coats'}</div>
        <div class="product-card-name">${p.name}</div>
        <div class="product-card-colors">
          ${p.colors.map(c => `<span class="color-dot" style="background:${c}"></span>`).join('')}
        </div>
        <div class="product-card-bottom">
          <div class="product-card-price">${formatPrice(p.price)}</div>
        </div>
      </div>
    </div>
  `).join('');
  setTimeout(initReveal, 100);
}

// ===== Page-specific Product Rendering =====
function initCategoryPage(category) {
  const grid = $('.products-grid');
  const tabBtns = $$('.tab-btn');
  if (!grid) return;
  function render(tab) {
    currentTab = tab;
    const filtered = getProducts().filter(p => p.category === category && p.sub === tab);
    renderProducts(grid, filtered);
  }
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.tab);
    });
  });
  render('women');
}

function initFeaturedProducts() {
  const grid = $('.featured-grid');
  if (!grid) return;
  const featured = getProducts().filter(p => p.badge).slice(0, 8);
  renderProducts(grid, featured);
}

// ===== Dynamic Category Counts =====
function updateCategoryCounts() {
  const products = getProducts();
  const counts = {
    'scrubs-women':   products.filter(p => p.category === 'scrubs'    && p.sub === 'women').length,
    'scrubs-men':     products.filter(p => p.category === 'scrubs'    && p.sub === 'men').length,
    'labcoats-women': products.filter(p => p.category === 'Lab Coats' && p.sub === 'women').length,
    'labcoats-men':   products.filter(p => p.category === 'Lab Coats' && p.sub === 'men').length,
  };
  document.querySelectorAll('[data-count]').forEach(el => {
    const key = el.dataset.count;
    const n = counts[key] || 0;
    el.textContent = n + (n === 1 ? ' Product' : ' Products');
  });
}

// ===== Navigation =====
function initNav() {
  const navbar = $('.navbar');
  const hamburger = $('.nav-hamburger');
  const mobileMenu = $('.mobile-menu');
  const mobileClose = $('.mobile-menu-close');
  const isHomepage = !!$('.hero');
  if (isHomepage) navbar.classList.add('transparent');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
    } else {
      navbar.classList.remove('scrolled');
      if (isHomepage) navbar.classList.add('transparent');
    }
  });
  if (hamburger) {
    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
    mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
    $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
  }
  const cartBtn = $('.nav-cart-btn');
  if (cartBtn) cartBtn.addEventListener('click', openCart);
  const cartOverlay = $('.cart-overlay');
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
  const cartClose = $('.cart-close');
  if (cartClose) cartClose.addEventListener('click', closeCart);
  const checkoutBtn = $('.cart-checkout-btn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', openOrderModal);
  const orderModal = $('.modal-overlay.order-modal');
  if (orderModal) orderModal.addEventListener('click', (e) => { if (e.target === orderModal) closeOrderModal(); });
  const orderClose = $('.modal-close-btn');
  if (orderClose) orderClose.addEventListener('click', closeOrderModal);
  const orderForm = $('#order-form');
  if (orderForm) orderForm.addEventListener('submit', submitOrder);
  $$('.form-group[data-required] input, .form-group[data-required] textarea').forEach(input => {
    input.addEventListener('input', () => input.closest('.form-group').classList.remove('error'));
  });
  updateCartCount();
}

// ===== Scroll Reveal =====
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

// ===== Preloader =====
function initPreloader() {
  window.addEventListener('load', () => {
    const preloader = $('.preloader');
    if (preloader) {
      setTimeout(() => preloader.classList.add('hidden'), 600);
      setTimeout(() => preloader.remove(), 1200);
    }
  });
}

// ===== Admin Password Gate =====
const ADMIN_PASSWORD = 'scrubly2025';

function initAdminGate() {
  const gate = $('#admin-gate');
  const dashboard = $('#admin-dashboard');
  if (!gate || !dashboard) return;
  if (sessionStorage.getItem('sh_admin_auth') === 'true') {
    gate.style.display = 'none';
    dashboard.style.display = 'block';
    initAdmin();
    return;
  }
  gate.style.display = 'flex';
  dashboard.style.display = 'none';
  const form = $('#admin-login-form');
  const errorEl = $('#admin-login-error');
  const passInput = $('#admin-password');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (passInput.value === ADMIN_PASSWORD) {
      sessionStorage.setItem('sh_admin_auth', 'true');
      gate.style.display = 'none';
      dashboard.style.display = 'block';
      initAdmin();
    } else {
      errorEl.style.display = 'block';
      passInput.value = '';
      passInput.focus();
      gate.querySelector('.admin-login-card').style.animation = 'none';
      requestAnimationFrame(() => {
        gate.querySelector('.admin-login-card').style.animation = 'shake 0.5s ease';
      });
    }
  });
  passInput.focus();
}

// ===== Admin Functions =====
function initAdmin() {
  renderAdminStats();
  renderAdminOrders();
  renderAdminProducts();
  window.addEventListener('storage', () => {
    renderAdminStats();
    renderAdminOrders();
  });
}

function renderAdminStats() {
  const orders = JSON.parse(localStorage.getItem('sh_orders')) || [];
  const products = getProducts();
  const pending = orders.filter(o => o.status === 'pending').length;
  const completed = orders.filter(o => o.status === 'completed').length;
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const setVal = (sel, val) => { const el = $(sel); if (el) el.textContent = val; };
  setVal('#stat-total', orders.length);
  setVal('#stat-pending', pending);
  setVal('#stat-completed', completed);
  setVal('#stat-revenue', formatPrice(revenue));
  setVal('#stat-products', products.length);
}

function renderAdminOrders() {
  const orders = JSON.parse(localStorage.getItem('sh_orders')) || [];
  const tbody = $('#orders-tbody');
  if (!tbody) return;
  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="admin-empty"><div class="admin-empty-icon">&#128203;</div><p>No orders yet</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = orders.map(order => `
    <tr>
      <td><strong>${order.id}</strong></td>
      <td>${order.customer.name}<br><small style="color:var(--text-muted)">${order.customer.phone}</small></td>
      <td>${order.items.length} item(s)</td>
      <td><strong>${formatPrice(order.total)}</strong></td>
      <td><span class="status-badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
      <td>
        <div style="display:flex;gap:8px;align-items:center;">
          <select class="admin-status-select" onchange="updateOrderStatus('${order.id}', this.value)">
            <option value="pending" ${order.status==='pending'?'selected':''}>Pending</option>
            <option value="processing" ${order.status==='processing'?'selected':''}>Processing</option>
            <option value="completed" ${order.status==='completed'?'selected':''}>Completed</option>
          </select>
          <button class="admin-btn-sm admin-btn-view" onclick="viewOrderDetail('${order.id}')">View</button>
          <button class="admin-btn-sm admin-btn-delete" onclick="deleteOrder('${order.id}')">&times;</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function updateOrderStatus(orderId, status) {
  const orders = JSON.parse(localStorage.getItem('sh_orders')) || [];
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    localStorage.setItem('sh_orders', JSON.stringify(orders));
    renderAdminStats();
    renderAdminOrders();
    showToast('Order status updated');
  }
}

function deleteOrder(orderId) {
  let orders = JSON.parse(localStorage.getItem('sh_orders')) || [];
  orders = orders.filter(o => o.id !== orderId);
  localStorage.setItem('sh_orders', JSON.stringify(orders));
  renderAdminStats();
  renderAdminOrders();
  showToast('Order deleted');
}

function viewOrderDetail(orderId) {
  const orders = JSON.parse(localStorage.getItem('sh_orders')) || [];
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  const modal = $('.modal-overlay.detail-modal');
  const body = $('#detail-modal-body');
  if (!modal || !body) return;
  const date = new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  body.innerHTML = `
    <div class="order-detail-section">
      <h4>Order Information</h4>
      <div class="order-detail-row"><span class="label">Order ID</span><span><strong>${order.id}</strong></span></div>
      <div class="order-detail-row"><span class="label">Date</span><span>${date}</span></div>
      <div class="order-detail-row"><span class="label">Status</span><span class="status-badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></div>
    </div>
    <div class="order-detail-section">
      <h4>Customer Details</h4>
      <div class="order-detail-row"><span class="label">Name</span><span>${order.customer.name}</span></div>
      <div class="order-detail-row"><span class="label">Phone</span><span>${order.customer.phone}</span></div>
      <div class="order-detail-row"><span class="label">Email</span><span>${order.customer.email}</span></div>
      <div class="order-detail-row"><span class="label">Address</span><span>${order.customer.address}</span></div>
      ${order.customer.notes ? `<div class="order-detail-row"><span class="label">Notes</span><span>${order.customer.notes}</span></div>` : ''}
    </div>
    <div class="order-detail-section">
      <h4>Items</h4>
      <div class="order-detail-items-list">
        ${order.items.map(item => `
          <div class="order-detail-item">
            <span>${item.name} (${item.size}) x${item.qty}</span>
            <span>${formatPrice(item.price * item.qty)}</span>
          </div>
        `).join('')}
        <div class="order-detail-item" style="border-top:2px solid var(--border);margin-top:8px;padding-top:12px;font-weight:700;">
          <span>Total</span><span style="color:var(--primary-dark);font-size:1.05rem;">${formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDetailModal() {
  const modal = $('.modal-overlay.detail-modal');
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
}

function clearAllOrders() {
  if (!confirm('Are you sure you want to delete all orders?')) return;
  localStorage.removeItem('sh_orders');
  renderAdminStats();
  renderAdminOrders();
  showToast('All orders cleared');
}

// ===== Admin Products Management =====
function renderAdminProducts() {
  const tbody = $('#products-tbody');
  if (!tbody) return;
  const products = getProducts();
  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="admin-empty"><div class="admin-empty-icon">&#128717;</div><p>No products yet. Add your first product!</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:48px;height:48px;border-radius:8px;overflow:hidden;flex-shrink:0;background:var(--bg-warm);">
            <img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" loading="lazy">
          </div>
          <div>
            <div style="font-weight:600;font-size:0.88rem;">${p.name}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">${p.category === 'scrubs' ? 'Scrubs' : 'Lab Coats'} &middot; ${p.sub === 'women' ? "Women's" : "Men's"}</div>
          </div>
        </div>
      </td>
      <td style="font-size:0.85rem;">${p.category === 'scrubs' ? 'Scrubs' : 'Lab Coats'}</td>
      <td style="font-size:0.85rem;">${p.sub === 'women' ? "Women's" : "Men's"}</td>
      <td><strong>${formatPrice(p.price)}</strong></td>
      <td>
        <div style="display:flex;gap:4px;">
          ${p.colors.map(c => `<span style="width:18px;height:18px;border-radius:50%;background:${c};display:inline-block;border:1px solid var(--border);"></span>`).join('')}
        </div>
      </td>
      <td style="font-size:0.8rem;color:var(--text-muted);">${p.sizes.join(', ')}</td>
      <td>
        <div style="display:flex;gap:6px;">
          <button class="admin-btn-sm admin-btn-view" onclick="openProductModal('edit', ${p.id})">Edit</button>
          <button class="admin-btn-sm admin-btn-delete" onclick="adminDeleteProduct(${p.id})">&times;</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openProductModal(mode, productId) {
  const modal = $('#product-modal');
  const title = $('#product-modal-title');
  const form = $('#product-form');
  if (!modal || !form) return;

  title.textContent = mode === 'edit' ? 'Edit Product' : 'Add New Product';

  // Reset colors
  const colorsContainer = $('#product-colors-container');
  colorsContainer.innerHTML = '';

  if (mode === 'edit') {
    const product = getProductById(productId);
    if (!product) return;
    form.querySelector('[name="name"]').value = product.name;
    form.querySelector('[name="category"]').value = product.category;
    form.querySelector('[name="sub"]').value = product.sub;
    form.querySelector('[name="price"]').value = product.price;
    document.getElementById('final-image-value').value = product.image;
    form.querySelector('[name="badge"]').value = product.badge;
    form.querySelector('[name="desc"]').value = product.desc;
    // Colors
    product.colors.forEach(c => addColorField(c));
    if (product.colors.length === 0) addColorField('');
    // Sizes
    $$('#product-form input[name="sizes"]').forEach(cb => {
      cb.checked = product.sizes.includes(cb.value);
    });
    form.dataset.mode = 'edit';
    form.dataset.productId = productId;
  } else {
    form.reset();
    form.querySelector('[name="category"]').value = 'scrubs';
    form.querySelector('[name="sub"]').value = 'women';
    addColorField('#2D6A4F');
    addColorField('#1A1A1A');
    // Default sizes
    $$('#product-form input[name="sizes"]').forEach(cb => {
      cb.checked = ['S','M','L','XL'].includes(cb.value);
    });
    form.dataset.mode = 'add';
    form.dataset.productId = '';
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = $('#product-modal');
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
}

function addColorField(value = '') {
  const container = $('#product-colors-container');
  if (!container) return;
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:8px;';
  row.innerHTML = `
    <input type="color" value="${value || '#2D6A4F'}" style="width:38px;height:38px;border:2px solid var(--border);border-radius:8px;padding:2px;cursor:pointer;background:var(--bg);" oninput="this.nextElementSibling.value=this.value">
    <input type="text" value="${value}" placeholder="#2D6A4F" style="flex:1;padding:10px 14px;border:2px solid var(--border);border-radius:8px;font-size:0.85rem;font-family:monospace;outline:none;background:var(--bg);" oninput="if(/^#[0-9A-Fa-f]{6}$/.test(this.value))this.previousElementSibling.value=this.value">
    <button type="button" onclick="this.parentElement.remove()" style="width:36px;height:36px;border-radius:8px;background:rgba(239,68,68,0.1);color:#EF4444;display:flex;align-items:center;justify-content:center;font-size:1.1rem;border:none;cursor:pointer;flex-shrink:0;">&times;</button>
  `;
  container.appendChild(row);
}

function submitProductForm(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('[name="name"]').value.trim();
  const category = form.querySelector('[name="category"]').value;
  const sub = form.querySelector('[name="sub"]').value;
  const price = form.querySelector('[name="price"]').value;
  const image = document.getElementById('final-image-value').value.trim();
  const badge = form.querySelector('[name="badge"]').value.trim();
  const desc = form.querySelector('[name="desc"]').value.trim();

  if (!name || !price) {
    showToast('Name and price are required', 'error');
    return;
  }

  // Collect colors
  const colorInputs = $$('#product-colors-container input[type="text"]');
  const colors = Array.from(colorInputs).map(i => i.value.trim());

  // Collect sizes
  const sizeCheckboxes = $$('#product-form input[name="sizes"]:checked');
  const sizes = Array.from(sizeCheckboxes).map(cb => cb.value);

  if (sizes.length === 0) {
    showToast('Select at least one size', 'error');
    return;
  }

  const data = { name, category, sub, price, image, badge, desc, colors, sizes };
  const mode = form.dataset.mode;
  const productId = parseInt(form.dataset.productId);

  if (mode === 'edit' && productId) {
    updateProduct(productId, data);
    showToast('Product updated successfully');
  } else {
    addProduct(data);
    showToast('Product added successfully');
  }

  closeProductModal();
  renderAdminProducts();
  renderAdminStats();
}

function adminDeleteProduct(id) {
  const product = getProductById(id);
  if (!product) return;
  if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
  deleteProduct(id);
  renderAdminProducts();
  renderAdminStats();
  showToast('Product deleted');
}

function resetProductsToDefault() {
  if (!confirm('Reset all products to defaults? Custom products will be lost.')) return;
  saveProductsToStorage(DEFAULT_PRODUCTS);
  renderAdminProducts();
  renderAdminStats();
  showToast('Products reset to defaults');
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNav();
  initReveal();
  // Seed products on first visit (for storefront pages)
  getProducts();
  updateCategoryCounts();
  if ($('.hero')) { initFeaturedProducts(); }
  if ($('[data-category="scrubs"]')) { initCategoryPage('scrubs'); }
  if ($('[data-category="Lab Coats"]')) { initCategoryPage('Lab Coats'); }
  if ($('.admin-page')) { initAdminGate(); }
});
