const CURRENCY = 'EGP';
function formatPrice(n) { return n.toFixed(2) + ' ' + CURRENCY; }

// ===== Data Version (bump to force re-seed) =====
const DATA_VERSION = 3;

// ===== Default Products (empty — add via admin) =====
const DEFAULT_PRODUCTS = [];

// ===== Products Data Layer =====
function getProducts() {
  // Check version — if outdated, clear and re-seed
  if (localStorage.getItem('sh_data_version') !== String(DATA_VERSION)) {
    localStorage.removeItem('sh_products');
    localStorage.setItem('sh_data_version', DATA_VERSION);
  }
  const stored = localStorage.getItem('sh_products');
  if (stored) {
    try { return JSON.parse(stored); } catch(e) { /* fallback */ }
  }
  localStorage.setItem('sh_products', JSON.stringify(DEFAULT_PRODUCTS));
  return [...DEFAULT_PRODUCTS];
}

function saveProductsToStorage(prods) {
  localStorage.setItem('sh_products', JSON.stringify(prods));
}

function getProductById(id) {
  return getProducts().find(p => String(p.id) === String(id));
}

function addProduct(data) {
  const prods = getProducts();
  const maxId = prods.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
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
  const idx = prods.findIndex(p => String(p.id) === String(id));
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
  prods = prods.filter(p => String(p.id) !== String(id));
  saveProductsToStorage(prods);
}

// ===== State =====
let cart = JSON.parse(localStorage.getItem('sh_cart')) || [];
let currentTab = 'women';
let _detailSelectedColor = null;
let _detailSelectedSize = null;
let _detailProductId = null;

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

function addToCart(productId, size, color) {
  const product = getProductById(productId);
  if (!product) return;
  const selectedSize = size || product.sizes[Math.min(2, product.sizes.length - 1)];
  const selectedColor = color || product.colors[0] || '#4EA88A';
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
    customer: {
      name: form.querySelector('[name="name"]').value.trim(),
      phone: form.querySelector('[name="phone"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      address: form.querySelector('[name="address"]').value.trim(),
      notes: form.querySelector('[name="notes"]').value.trim()
    },
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

// ===== Product Detail Modal =====
function createProductDetailModal() {
  if ($('.product-detail-modal')) return;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay product-detail-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="modal" style="padding:0;overflow:hidden;" role="dialog" aria-label="Product details">
      <div class="product-detail-grid">
        <div class="product-detail-image">
          <button class="product-detail-close" onclick="closeProductDetail()" aria-label="Close">&times;</button>
          <img id="detail-image" src="" alt="">
          <div class="product-detail-badge" id="detail-badge" style="display:none;"></div>
        </div>
        <div class="product-detail-info">
          <div class="product-detail-category" id="detail-category"></div>
          <h2 class="product-detail-name" id="detail-name"></h2>
          <div class="product-detail-price" id="detail-price"></div>
          <div class="product-detail-section" id="detail-colors-section">
            <label>Color</label>
            <div class="detail-colors" id="detail-colors"></div>
          </div>
          <div class="product-detail-section" id="detail-sizes-section">
            <label>Size</label>
            <div class="detail-sizes" id="detail-sizes"></div>
          </div>
          <p class="product-detail-desc" id="detail-desc"></p>
          <button class="btn btn-primary product-detail-add-btn" id="detail-add-btn" onclick="addDetailToCart()">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeProductDetail();
  });
}

function openProductDetail(productId) {
  const product = getProductById(productId);
  if (!product) return;
  createProductDetailModal();

  _detailProductId = productId;
  _detailSelectedColor = product.colors[0] || '#4EA88A';
  _detailSelectedSize = product.sizes[0] || 'M';

  // Populate
  const img = $('#detail-image');
  img.src = product.image;
  img.alt = product.name;
  $('#detail-category').textContent = (product.sub === 'women' ? "Women's " : "Men's ") + (product.category === 'scrubs' ? 'Scrubs' : 'Lab Coats');
  $('#detail-name').textContent = product.name;
  $('#detail-price').textContent = formatPrice(product.price);
  $('#detail-desc').textContent = product.desc || '';

  // Badge
  const badgeEl = $('#detail-badge');
  if (product.badge) {
    badgeEl.textContent = product.badge;
    badgeEl.style.display = 'block';
  } else {
    badgeEl.style.display = 'none';
  }

  // Colors
  const colorsSection = $('#detail-colors-section');
  const colorsContainer = $('#detail-colors');
  if (product.colors.length > 0) {
    colorsSection.style.display = 'block';
    colorsContainer.innerHTML = product.colors.map((c, i) =>
      `<div class="detail-color ${i === 0 ? 'selected' : ''}" style="background:${c}" data-color="${c}" onclick="selectDetailColor(this, '${c}')"></div>`
    ).join('');
  } else {
    colorsSection.style.display = 'none';
  }

  // Sizes
  const sizesSection = $('#detail-sizes-section');
  const sizesContainer = $('#detail-sizes');
  if (product.sizes.length > 0) {
    sizesSection.style.display = 'block';
    sizesContainer.innerHTML = product.sizes.map((s, i) =>
      `<div class="detail-size ${i === 0 ? 'selected' : ''}" data-size="${s}" onclick="selectDetailSize(this, '${s}')">${s}</div>`
    ).join('');
  } else {
    sizesSection.style.display = 'none';
  }

  const modal = $('.product-detail-modal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductDetail() {
  const modal = $('.product-detail-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function selectDetailColor(el, color) {
  $$('.detail-color').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  _detailSelectedColor = color;
}

function selectDetailSize(el, size) {
  $$('.detail-size').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  _detailSelectedSize = size;
}

function addDetailToCart() {
  if (!_detailProductId) return;
  addToCart(_detailProductId, _detailSelectedSize, _detailSelectedColor);
  closeProductDetail();
}

// ===== Render Products =====
function renderProducts(container, items) {
  if (!container) return;
  if (items.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);">
      <div style="font-size:3rem;margin-bottom:12px;opacity:0.3;">&#128717;</div>
      <p>No products found in this category.</p>
      <p style="font-size:0.85rem;margin-top:8px;">Add products via the Admin Dashboard.</p>
    </div>`;
    return;
  }
  container.innerHTML = items.map((p, i) => `
    <div class="product-card reveal reveal-delay-${(i % 4) + 1}" onclick="openProductDetail(${p.id})">
      <div class="product-card-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="product-card-badge">${p.badge}</span>` : ''}
        <div class="product-card-actions">
          <button class="btn" onclick="event.stopPropagation(); openProductDetail(${p.id})">View Details</button>
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

  // Try to load logo image
  const logoImg = $('.nav-logo-img');
  if (logoImg) {
    const testImg = new Image();
    testImg.onload = function() { logoImg.classList.add('visible'); };
    testImg.src = logoImg.src;
  }
  const footerLogoImg = $('.footer-logo-img');
  if (footerLogoImg) {
    const testImg2 = new Image();
    testImg2.onload = function() { footerLogoImg.classList.add('visible'); };
    testImg2.src = footerLogoImg.src;
  }

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

// ===== Admin Password =====
function getAdminPassword() {
  return localStorage.getItem('sh_admin_password') || 'scrubly2025';
}
function setAdminPassword(newPass) {
  localStorage.setItem('sh_admin_password', newPass);
}

// ===== Admin Password Gate =====
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
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (passInput.value === getAdminPassword()) {
      sessionStorage.setItem('sh_admin_auth', 'true');
      gate.style.display = 'none';
      dashboard.style.display = 'block';
      initAdmin();
    } else {
      errorEl.style.display = 'block';
      passInput.value = '';
      passInput.focus();
      const card = gate.querySelector('.admin-login-card');
      card.style.animation = 'none';
      requestAnimationFrame(() => { card.style.animation = 'shake 0.5s ease'; });
    }
  });
  if (passInput) passInput.focus();
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
  const countEl = $('#orders-count');
  if (countEl) countEl.textContent = orders.length;
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
  const countEl = $('#products-count');
  const products = getProducts();
  if (countEl) countEl.textContent = products.length;
  if (!tbody) return;
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

  // Reset image upload state
  if (typeof removeUploadedImage === 'function') removeUploadedImage();

  // Reset colors
  const colorsContainer = $('#product-colors-container');
  if (colorsContainer) colorsContainer.innerHTML = '';

  if (mode === 'edit') {
    const product = getProductById(productId);
    if (!product) return;
    form.querySelector('[name="name"]').value = product.name;
    form.querySelector('[name="category"]').value = product.category;
    form.querySelector('[name="sub"]').value = product.sub;
    form.querySelector('[name="price"]').value = product.price;
    const finalImg = document.getElementById('final-image-value');
    if (finalImg) finalImg.value = product.image;
    form.querySelector('[name="badge"]').value = product.badge;
    form.querySelector('[name="desc"]').value = product.desc;
    // Colors
    product.colors.forEach(c => addColorField(c));
    if (product.colors.length === 0) addColorField('');
    // Sizes
    $$('#product-form input[name="sizes"]').forEach(cb => {
      cb.checked = product.sizes.includes(cb.value);
    });
    // Image preview
    if (product.image) {
      const previewImg = document.getElementById('upload-preview-img');
      const previewContainer = document.getElementById('upload-preview');
      const uploadZone = document.getElementById('upload-zone');
      if (previewImg && previewContainer && uploadZone) {
        previewImg.src = product.image;
        previewContainer.classList.add('visible');
        uploadZone.style.display = 'none';
        if (product.image.startsWith('data:')) {
          if (typeof currentBase64Image !== 'undefined') currentBase64Image = product.image;
          const fnEl = document.getElementById('upload-file-name');
          const fsEl = document.getElementById('upload-file-size');
          if (fnEl) fnEl.textContent = 'Uploaded image';
          if (fsEl) fsEl.textContent = Math.round((product.image.length * 3) / 4 / 1024) + ' KB';
        } else {
          const urlInput = document.getElementById('image-url-input');
          if (urlInput) urlInput.value = product.image;
          const fnEl = document.getElementById('upload-file-name');
          const fsEl = document.getElementById('upload-file-size');
          if (fnEl) fnEl.textContent = 'External URL';
          if (fsEl) fsEl.textContent = 'Linked';
        }
      }
    }
  } else {
    form.reset();
    form.querySelector('[name="category"]').value = 'scrubs';
    form.querySelector('[name="sub"]').value = 'women';
    addColorField('#4EA88A');
    addColorField('#1A1A1A');
    $$('#product-form input[name="sizes"]').forEach(cb => {
      cb.checked = ['S','M','L','XL'].includes(cb.value);
    });
    const finalImg = document.getElementById('final-image-value');
    if (finalImg) finalImg.value = '';
  }

  // Store mode
  if (typeof _productMode !== 'undefined') _productMode = mode;
  if (typeof _productEditId !== 'undefined') _productEditId = productId || null;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = $('#product-modal');
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
  if (typeof removeUploadedImage === 'function') removeUploadedImage();
}

function addColorField(value = '') {
  const container = $('#product-colors-container');
  if (!container) return;
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:8px;';
  row.innerHTML = `
    <input type="color" value="${value || '#4EA88A'}" style="width:38px;height:38px;border:2px solid var(--border);border-radius:8px;padding:2px;cursor:pointer;background:var(--bg);" oninput="this.nextElementSibling.value=this.value">
    <input type="text" value="${value}" placeholder="#4EA88A" style="flex:1;padding:10px 14px;border:2px solid var(--border);border-radius:8px;font-size:0.85rem;font-family:monospace;outline:none;background:var(--bg);" oninput="if(/^#[0-9A-Fa-f]{6}$/.test(this.value))this.previousElementSibling.value=this.value">
    <button type="button" onclick="this.parentElement.remove()" style="width:36px;height:36px;border-radius:8px;background:rgba(239,68,68,0.1);color:#EF4444;display:flex;align-items:center;justify-content:center;font-size:1.1rem;border:none;cursor:pointer;flex-shrink:0;">&times;</button>
  `;
  container.appendChild(row);
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

function adminLogout() {
  sessionStorage.removeItem('sh_admin_auth');
  const gate = $('#admin-gate');
  const dashboard = $('#admin-dashboard');
  if (gate) gate.style.display = 'flex';
  if (dashboard) dashboard.style.display = 'none';
  const errorEl = $('#admin-login-error');
  if (errorEl) errorEl.style.display = 'none';
  const pwInput = $('#admin-password');
  if (pwInput) { pwInput.value = ''; pwInput.focus(); }
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNav();
  initReveal();
  getProducts();
  updateCategoryCounts();
  if ($('.hero')) { initFeaturedProducts(); }
  if ($('[data-category="scrubs"]')) { initCategoryPage('scrubs'); }
  if ($('[data-category="Lab Coats"]')) { initCategoryPage('Lab Coats'); }
  if ($('.admin-page')) { initAdminGate(); }
});