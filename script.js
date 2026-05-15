const CURRENCY = 'EGP';
function formatPrice(n) { return n.toFixed(2) + ' ' + CURRENCY; }

// ===== Products Data Layer (No Default Products) =====
function getProducts() {
  const stored = localStorage.getItem('sh_products');
  if (stored) {
    try { return JSON.parse(stored); } catch(e) { /* fallback */ }
  }
  // Return empty array - no default products
  localStorage.setItem('sh_products', JSON.stringify([]));
  return [];
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
let selectedProduct = null;
let selectedColor = null;
let selectedSize = null;

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

// ===== Product Details Modal =====
function openProductDetails(productId) {
  const product = getProductById(productId);
  if (!product) return;
  
  selectedProduct = product;
  selectedColor = product.colors[0] || null;
  selectedSize = product.sizes[0] || null;
  
  let modal = $('#product-details-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'product-details-modal';
    modal.className = 'product-details-modal';
    document.body.appendChild(modal);
  }
  
  modal.innerHTML = `
    <div class="product-details-content">
      <button class="product-details-close" onclick="closeProductDetails()">&times;</button>
      <div class="product-details-grid">
        <div class="product-details-images">
          <div class="product-main-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
        </div>
        <div class="product-details-info">
          ${product.badge ? `<span class="section-label" style="background: var(--primary); color: #fff;">${product.badge}</span>` : ''}
          <h2>${product.name}</h2>
          <div class="product-details-price">${formatPrice(product.price)}</div>
          <div class="product-details-desc">${product.desc || 'Premium quality medical wear designed for comfort and style.'}</div>
          
          ${product.colors.length > 0 ? `
          <div class="product-option-group">
            <label class="product-option-label">Available Colors:</label>
            <div class="product-colors-grid">
              ${product.colors.map(color => `
                <div class="color-option ${color === selectedColor ? 'selected' : ''}" 
                     style="background: ${color};" 
                     onclick="selectColor('${color}')">
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
          
          ${product.sizes.length > 0 ? `
          <div class="product-option-group">
            <label class="product-option-label">Select Size:</label>
            <div class="product-sizes-grid">
              ${product.sizes.map(size => `
                <div class="size-option ${size === selectedSize ? 'selected' : ''}" 
                     onclick="selectSize('${size}')">
                  ${size}
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
          
          <div class="product-details-actions">
            <button class="btn btn-primary" onclick="addToCartFromDetails()">
              Add to Cart
            </button>
            <button class="btn btn-outline" onclick="orderOnInstagram()">
              Order on Instagram
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProductDetails();
  });
}

function closeProductDetails() {
  const modal = $('#product-details-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    selectedProduct = null;
    selectedColor = null;
    selectedSize = null;
  }
}

function selectColor(color) {
  selectedColor = color;
  $$('.color-option').forEach(el => {
    el.classList.toggle('selected', el.style.background === color);
  });
}

function selectSize(size) {
  selectedSize = size;
  $$('.size-option').forEach(el => {
    el.classList.toggle('selected', el.textContent.trim() === size);
  });
}

function addToCartFromDetails() {
  if (!selectedProduct) return;
  
  if (selectedProduct.sizes.length > 0 && !selectedSize) {
    showToast('Please select a size', 'error');
    return;
  }
  
  const cartItem = {
    productId: selectedProduct.id,
    name: selectedProduct.name,
    price: selectedProduct.price,
    image: selectedProduct.image,
    color: selectedColor,
    size: selectedSize
  };
  
  cart.push(cartItem);
  localStorage.setItem('sh_cart', JSON.stringify(cart));
  updateCartUI();
  showToast('Added to cart!');
  closeProductDetails();
}

function orderOnInstagram() {
  if (!selectedProduct) return;
  
  const message = `Hi! I'm interested in:\n\n${selectedProduct.name}\nPrice: ${formatPrice(selectedProduct.price)}${selectedColor ? `\nColor: ${selectedColor}` : ''}${selectedSize ? `\nSize: ${selectedSize}` : ''}\n\nCan you help me place an order?`;
  
  const instagramUrl = `https://www.instagram.com/sh_scrubly?igsh=dXIwY2kzMGV4cnk=`;
  window.open(instagramUrl, '_blank');
  showToast('Opening Instagram...');
}

// ===== Cart Functions =====
function updateCartUI() {
  const cartCount = $('.cart-count');
  const cartItems = $('.cart-items');
  const cartTotal = $('.cart-total-value');
  
  if (cartCount) cartCount.textContent = cart.length;
  
  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <p>Your cart is empty</p>
          <a href="scrubs.html" class="btn btn-primary">Shop Scrubs</a>
        </div>
      `;
    } else {
      cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-meta">
              ${item.color ? `Color: ${item.color}` : ''}
              ${item.size ? ` • Size: ${item.size}` : ''}
            </div>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${index})">&times;</button>
        </div>
      `).join('');
    }
  }
  
  if (cartTotal) {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = formatPrice(total);
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('sh_cart', JSON.stringify(cart));
  updateCartUI();
  showToast('Item removed from cart');
}

function clearCart() {
  cart = [];
  localStorage.setItem('sh_cart', JSON.stringify(cart));
  updateCartUI();
}

// ===== Navigation =====
function initNav() {
  const navbar = $('.navbar');
  const hamburger = $('.nav-hamburger');
  const mobileMenu = $('.mobile-menu');
  const mobileClose = $('.mobile-menu-close');
  const cartBtn = $('.nav-cart-btn');
  const cartSidebar = $('.cart-sidebar');
  const cartOverlay = $('.cart-overlay');
  const cartClose = $$('.cart-close');
  
  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });
  
  // Mobile menu
  hamburger?.addEventListener('click', () => {
    mobileMenu?.classList.add('open');
  });
  
  mobileClose?.addEventListener('click', () => {
    mobileMenu?.classList.remove('open');
  });
  
  // Cart sidebar
  cartBtn?.addEventListener('click', () => {
    cartSidebar?.classList.add('open');
    cartOverlay?.classList.add('open');
    updateCartUI();
  });
  
  cartClose.forEach(btn => {
    btn.addEventListener('click', () => {
      cartSidebar?.classList.remove('open');
      cartOverlay?.classList.remove('open');
      $('.order-modal')?.classList.remove('open');
    });
  });
  
  cartOverlay?.addEventListener('click', () => {
    cartSidebar?.classList.remove('open');
    cartOverlay?.classList.remove('open');
  });
  
  // Checkout
  const checkoutBtn = $('.cart-checkout-btn');
  checkoutBtn?.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }
    openOrderModal();
  });
}

// ===== Order Modal =====
function openOrderModal() {
  const modal = $('.order-modal');
  const summaryBox = $('.order-summary-box');
  
  if (summaryBox) {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    summaryBox.innerHTML = `
      ${cart.map(item => `
        <div class="order-item">
          <div>
            <div class="order-item-name">${item.name}</div>
            <div class="order-item-details">
              ${item.color ? `Color: ${item.color}` : ''}
              ${item.size ? ` • Size: ${item.size}` : ''}
            </div>
          </div>
          <div class="order-item-price">${formatPrice(item.price)}</div>
        </div>
      `).join('')}
      <div class="order-item order-total-row">
        <div class="order-item-name">Total</div>
        <div class="order-item-price">${formatPrice(total)}</div>
      </div>
    `;
  }
  
  modal?.classList.add('open');
  $('.cart-sidebar')?.classList.remove('open');
  $('.cart-overlay')?.classList.remove('open');
}

// ===== Order Form Submission =====
function initOrderForm() {
  const form = $('#order-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate
    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const address = form.querySelector('[name="address"]').value.trim();
    const notes = form.querySelector('[name="notes"]').value.trim();
    
    let valid = true;
    $$('.form-group').forEach(group => group.classList.remove('error'));
    
    if (!name) {
      form.querySelector('[name="name"]').closest('.form-group').classList.add('error');
      valid = false;
    }
    if (!phone) {
      form.querySelector('[name="phone"]').closest('.form-group').classList.add('error');
      valid = false;
    }
    if (!email) {
      form.querySelector('[name="email"]').closest('.form-group').classList.add('error');
      valid = false;
    }
    if (!address) {
      form.querySelector('[name="address"]').closest('.form-group').classList.add('error');
      valid = false;
    }
    
    if (!valid) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    // Create order
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      customer: { name, phone, email, address, notes },
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price, 0),
      status: 'pending'
    };
    
    // Save order
    const orders = JSON.parse(localStorage.getItem('sh_orders') || '[]');
    orders.push(order);
    localStorage.setItem('sh_orders', JSON.stringify(orders));
    
    // Send to Instagram (open Instagram DM)
    const message = `New Order #${order.id}\n\nCustomer: ${name}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}\n${notes ? `Notes: ${notes}\n` : ''}\n\nItems:\n${cart.map(item => `- ${item.name}${item.size ? ` (${item.size})` : ''}${item.color ? ` - ${item.color}` : ''} - ${formatPrice(item.price)}`).join('\n')}\n\nTotal: ${formatPrice(order.total)}`;
    
    const instagramUrl = `https://www.instagram.com/sh_scrubly?igsh=dXIwY2kzMGV4cnk=`;
    
    // Clear cart and close modal
    clearCart();
    $('.order-modal')?.classList.remove('open');
    form.reset();
    
    showToast('Order placed! Opening Instagram...');
    setTimeout(() => {
      window.open(instagramUrl, '_blank');
    }, 1000);
  });
}

// ===== Preloader =====
function initPreloader() {
  const preloader = $('.preloader');
  if (!preloader) return;
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 800);
  });
}

// ===== Reveal Animation =====
function initReveal() {
  const reveals = $$('.reveal');
  if (reveals.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });
  
  reveals.forEach(el => observer.observe(el));
}

// ===== Category Counts =====
function updateCategoryCounts() {
  const products = getProducts();
  
  const counts = {
    'scrubs-women': products.filter(p => p.category === 'scrubs' && p.sub === 'women').length,
    'scrubs-men': products.filter(p => p.category === 'scrubs' && p.sub === 'men').length,
    'labcoats-women': products.filter(p => p.category === 'Lab Coats' && p.sub === 'women').length,
    'labcoats-men': products.filter(p => p.category === 'Lab Coats' && p.sub === 'men').length
  };
  
  Object.keys(counts).forEach(key => {
    const el = $(`[data-count="${key}"]`);
    if (el) el.textContent = `${counts[key]} Products`;
  });
}

// ===== Category Pages =====
function initCategoryPage(category) {
  const tabBtns = $$('.tab-btn');
  const productsGrid = $('.products-grid');
  
  function renderProducts() {
    const products = getProducts();
    const filtered = products.filter(p => p.category === category && p.sub === currentTab);
    
    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="products-empty">
          <div class="products-empty-icon">📦</div>
          <h3>No Products Yet</h3>
          <p>Products will appear here once they are added.</p>
        </div>
      `;
      return;
    }
    
    productsGrid.innerHTML = filtered.map(product => `
      <div class="product-card reveal" onclick="openProductDetails(${product.id})">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        </div>
        <div class="product-info">
          <div class="product-name">${product.name}</div>
          <div class="product-desc">${product.desc || ''}</div>
          <div class="product-price">${formatPrice(product.price)}</div>
          ${product.colors.length > 0 ? `
            <div class="product-colors">
              ${product.colors.slice(0, 4).map(color => `
                <div class="color-dot" style="background: ${color};"></div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
    
    initReveal();
  }
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentTab = btn.dataset.tab;
      renderProducts();
    });
  });
  
  renderProducts();
}

// ===== Admin Functions (simplified) =====
function initAdminGate() {
  // Check if already authenticated
  if (sessionStorage.getItem('sh_admin_auth') === 'true') {
    $('#admin-gate').style.display = 'none';
    $('#admin-dashboard').style.display = 'block';
    initAdmin();
  }
}

function getAdminPassword() {
  return localStorage.getItem('sh_admin_password') || 'scrubly2025';
}

function setAdminPassword(newPassword) {
  localStorage.setItem('sh_admin_password', newPassword);
}

function initAdmin() {
  renderAdminProducts();
  renderAdminOrders();
  renderAdminStats();
}

function renderAdminStats() {
  const products = getProducts();
  const orders = JSON.parse(localStorage.getItem('sh_orders') || '[]');
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  
  const statsHtml = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;margin-bottom:40px;">
      <div style="background:var(--card);padding:24px;border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);">
        <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Total Products</div>
        <div style="font-size:2.2rem;font-weight:700;color:var(--primary);">${products.length}</div>
      </div>
      <div style="background:var(--card);padding:24px;border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);">
        <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Total Orders</div>
        <div style="font-size:2.2rem;font-weight:700;color:var(--accent-dark);">${orders.length}</div>
      </div>
      <div style="background:var(--card);padding:24px;border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);">
        <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Pending Orders</div>
        <div style="font-size:2.2rem;font-weight:700;color:#F59E0B;">${pendingOrders}</div>
      </div>
      <div style="background:var(--card);padding:24px;border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);">
        <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Total Revenue</div>
        <div style="font-size:2.2rem;font-weight:700;color:#10B981;">${formatPrice(totalRevenue)}</div>
      </div>
    </div>
  `;
  
  const container = $('#admin-stats-container');
  if (container) container.innerHTML = statsHtml;
}

function renderAdminProducts() {
  const products = getProducts();
  const tbody = $('#admin-products-tbody');
  if (!tbody) return;
  
  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;padding:60px 20px;color:var(--text-muted);">
          <div style="font-size:3rem;opacity:0.2;margin-bottom:14px;">📦</div>
          <div style="font-size:1.1rem;margin-bottom:8px;">No products yet</div>
          <div style="font-size:0.9rem;">Click "Add Product" to create your first product</div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = products.map(p => `
    <tr>
      <td>${p.id}</td>
      <td><img src="${p.image}" alt="${p.name}" style="width:50px;height:65px;object-fit:cover;border-radius:6px;"></td>
      <td><strong>${p.name}</strong></td>
      <td><span style="font-size:0.75rem;padding:4px 10px;background:var(--bg);border-radius:50px;">${p.category}</span></td>
      <td><span style="font-size:0.75rem;padding:4px 10px;background:var(--bg-warm);border-radius:50px;">${p.sub}</span></td>
      <td style="font-weight:700;color:var(--primary);">${formatPrice(p.price)}</td>
      <td>
        <button onclick="openProductModal(${p.id})" style="padding:6px 12px;background:var(--primary);color:#fff;border-radius:6px;font-size:0.8rem;margin-right:6px;">Edit</button>
        <button onclick="adminDeleteProduct(${p.id})" style="padding:6px 12px;background:rgba(239,68,68,0.1);color:#EF4444;border-radius:6px;font-size:0.8rem;">Delete</button>
      </td>
    </tr>
  `).join('');
}

function renderAdminOrders() {
  const orders = JSON.parse(localStorage.getItem('sh_orders') || '[]');
  const tbody = $('#admin-orders-tbody');
  if (!tbody) return;
  
  if (orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:60px 20px;color:var(--text-muted);">
          <div style="font-size:3rem;opacity:0.2;margin-bottom:14px;">📋</div>
          <div style="font-size:1.1rem;margin-bottom:8px;">No orders yet</div>
          <div style="font-size:0.9rem;">Orders will appear here once customers place them</div>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = orders.reverse().map(order => `
    <tr>
      <td>#${order.id}</td>
      <td>${new Date(order.date).toLocaleDateString()}</td>
      <td><strong>${order.customer.name}</strong><br><small style="color:var(--text-muted);">${order.customer.phone}</small></td>
      <td>${order.items.length} item${order.items.length > 1 ? 's' : ''}</td>
      <td style="font-weight:700;color:var(--primary);">${formatPrice(order.total)}</td>
      <td>
        <select onchange="updateOrderStatus(${order.id}, this.value)" style="padding:6px 12px;border:2px solid var(--border);border-radius:6px;font-size:0.8rem;">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
          <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
          <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
    </tr>
  `).join('');
}

function updateOrderStatus(orderId, newStatus) {
  const orders = JSON.parse(localStorage.getItem('sh_orders') || '[]');
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    localStorage.setItem('sh_orders', JSON.stringify(orders));
    showToast('Order status updated');
    renderAdminStats();
  }
}

function openProductModal(productId = null) {
  const modal = $('#product-modal');
  const form = $('#product-form');
  if (!modal || !form) return;
  
  // Clear colors container
  const colorsContainer = $('#product-colors-container');
  if (colorsContainer) colorsContainer.innerHTML = '';
  
  if (productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    form.querySelector('[name="name"]').value = product.name;
    form.querySelector('[name="category"]').value = product.category;
    form.querySelector('[name="sub"]').value = product.sub;
    form.querySelector('[name="price"]').value = product.price;
    form.querySelector('[name="badge"]').value = product.badge;
    form.querySelector('[name="desc"]').value = product.desc;
    $('#final-image-value').value = product.image;
    
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
    addColorField('#1B2B4A');
    addColorField('#8CA899');
    
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
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function addColorField(value = '') {
  const container = $('#product-colors-container');
  if (!container) return;
  
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:8px;';
  row.innerHTML = `
    <input type="color" value="${value || '#1B2B4A'}" style="width:38px;height:38px;border:2px solid var(--border);border-radius:8px;padding:2px;cursor:pointer;background:var(--bg);" oninput="this.nextElementSibling.value=this.value">
    <input type="text" value="${value}" placeholder="#1B2B4A" style="flex:1;padding:10px 14px;border:2px solid var(--border);border-radius:8px;font-size:0.85rem;font-family:monospace;outline:none;background:var(--bg);" oninput="if(/^#[0-9A-Fa-f]{6}$/.test(this.value))this.previousElementSibling.value=this.value">
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
  const image = $('#final-image-value').value.trim();
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
  updateCategoryCounts();
}

function adminDeleteProduct(id) {
  const product = getProductById(id);
  if (!product) return;
  if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
  deleteProduct(id);
  renderAdminProducts();
  renderAdminStats();
  updateCategoryCounts();
  showToast('Product deleted');
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNav();
  initReveal();
  updateCartUI();
  updateCategoryCounts();
  initOrderForm();
  
  if ($('[data-category="scrubs"]')) { initCategoryPage('scrubs'); }
  if ($('[data-category="Lab Coats"]')) { initCategoryPage('Lab Coats'); }
  if ($('.admin-page')) { initAdminGate(); }
});
