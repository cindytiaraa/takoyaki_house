/* ═══════════════════════════════════════════
   DETAIL-PRODUK.JS
════════════════════════════════════════════ */

let dpQty = 1;

function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch { return []; }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product, qty) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ ...product, qty });
    }
    saveCart(cart);
}

function showToast(msg) {
    const toast = document.getElementById('dpToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function updateQtyDisplay() {
    const el = document.getElementById('dpQtyCount');
    if (el) el.textContent = dpQty;
}

function renderDetailProduk() {
    const menu = window.dummyMenu || [];
    const id = getIdFromUrl();
    const product = menu.find(p => p.id === id);
    const inner = document.getElementById('detailProdukInner');

    if (!product) {
        inner.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:80px 0;">
            <p style="color:var(--gray);font-size:0.95rem;">Produk tidak ditemukan.</p>
            <a href="menu.html" class="btn-primary" style="margin-top:20px;display:inline-block;">← Kembali ke Menu</a>
        </div>`;
        return;
    }

    document.title = `${product.name} — Takoyaki House`;
    const breadcrumb = document.getElementById('breadcrumbProduk');
    if (breadcrumb) breadcrumb.textContent = product.name;

    const isAvailable = product.status === 'available';
    const badgeHtml = product.badge ? `<span class="dp-badge ${!isAvailable ? 'dp-badge-unavailable' : ''}">${product.badge}</span>` : '';

    inner.innerHTML = `
        <div class="dp-img-block fade-in">
            <div class="dp-img-main">
                <img src="${product.img}" alt="${product.name}" onerror="this.src='https://i.pinimg.com/736x/37/c3/cb/37c3cb99aa3054e970036fa4bb50ad95.jpg'">
            </div>
        </div>
        <div class="dp-info fade-in">
            ${badgeHtml}
            <p class="dp-category">${product.category}</p>
            <h1 class="dp-title">${product.name}</h1>
            <p class="dp-price">${product.price}</p>
            <p class="dp-desc">${product.desc}</p>
            <div class="dp-meta">
                <div class="dp-meta-row"><span>Kategori</span><strong>${product.category}</strong></div>
                <div class="dp-meta-row"><span>Status</span><strong style="color:${isAvailable ? '#27ae60' : 'var(--gray)'}">${isAvailable ? '✅ Tersedia' : '❌ Habis'}</strong></div>
                <div class="dp-meta-row"><span>Rating</span><strong>⭐ 4.8 / 5.0</strong></div>
            </div>
            <div class="dp-actions">
                <div class="dp-qty-wrap">
                    <button class="dp-qty-btn" id="dpQtyMinus" onclick="changeQty(-1)">−</button>
                    <span class="dp-qty-count" id="dpQtyCount">1</span>
                    <button class="dp-qty-btn" id="dpQtyPlus" onclick="changeQty(1)">+</button>
                </div>
                <button class="dp-btn-cart" ${!isAvailable ? 'disabled' : ''} onclick="handleAddToCart()">
                    🛒 Tambah ke Keranjang
                </button>
                <a href="order.html" class="dp-btn-order">⚡ Order Langsung</a>
            </div>
        </div>
    `;

    setTimeout(() => {
        document.querySelectorAll('.dp-info.fade-in, .dp-img-block.fade-in').forEach(el => el.classList.add('visible'));
    }, 80);

    // Store product ref
    window._dpCurrentProduct = product;
}

function changeQty(delta) {
    dpQty = Math.max(1, dpQty + delta);
    updateQtyDisplay();
}

function handleAddToCart() {
    const product = window._dpCurrentProduct;
    if (!product) return;
    addToCart(product, dpQty);
    showToast(`✅ ${dpQty}x ${product.name} ditambahkan ke keranjang!`);
}

function renderRelated() {
    const menu = window.dummyMenu || [];
    const id = getIdFromUrl();
    const product = menu.find(p => p.id === id);
    const grid = document.getElementById('relatedGrid');
    if (!grid || !product) return;

    const related = menu
        .filter(p => p.id !== id && p.status === 'available')
        .slice(0, 4);

    grid.innerHTML = related.map(p => `
        <div class="menu-card" onclick="window.location.href='detail-produk.html?id=${p.id}'">
            <div class="menu-card-img">
                <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://i.pinimg.com/736x/37/c3/cb/37c3cb99aa3054e970036fa4bb50ad95.jpg'">
                ${p.badge ? `<span class="menu-card-badge">${p.badge}</span>` : ''}
            </div>
            <div class="menu-card-body">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <div class="menu-card-footer">
                    <span class="menu-price">${p.price}</span>
                    <span class="menu-see-more">Lihat →</span>
                </div>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        renderDetailProduk();
        renderRelated();
    }, 100);

    // navbar scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // hamburger
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    }

    // member modal
    const openBtn = document.getElementById('openMemberModal');
    const closeBtn = document.getElementById('closeMemberModal');
    const modal = document.getElementById('memberModal');
    if (openBtn) openBtn.addEventListener('click', () => modal.classList.add('open'));
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
});
