/* ═══════════════════════════════════════════
   KERANJANG.JS
════════════════════════════════════════════ */

function getCart() {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); }
    catch { return []; }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function parsePrice(priceStr) {
    // "Rp 15.000" → 15000
    return parseInt(priceStr.replace(/[^\d]/g, '')) || 0;
}

function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
}

function renderKeranjang() {
    const cart = getCart();
    const list = document.getElementById('keranjangList');
    const summaryLines = document.getElementById('summaryLines');
    const summaryTotal = document.getElementById('summaryTotal');
    const checkoutBtn = document.getElementById('btnCheckout');

    if (cart.length === 0) {
        list.innerHTML = `
            <div class="keranjang-empty">
                <div class="empty-icon">🛒</div>
                <h3>Keranjangmu kosong</h3>
                <p>Belum ada produk yang kamu tambahkan.</p>
                <a href="menu.html" class="btn-primary">Lihat Menu</a>
            </div>`;
        if (summaryLines) summaryLines.innerHTML = '';
        if (summaryTotal) summaryTotal.textContent = 'Rp 0';
        if (checkoutBtn) checkoutBtn.style.opacity = '0.5';
        return;
    }

    if (checkoutBtn) checkoutBtn.style.opacity = '1';

    list.innerHTML = cart.map((item, idx) => {
        const unitPrice = parsePrice(item.price);
        const subtotal = unitPrice * item.qty;
        return `
        <div class="cart-item fade-in">
            <div class="cart-item-img">
                <img src="${item.img}" alt="${item.name}" onerror="this.src='https://i.pinimg.com/736x/37/c3/cb/37c3cb99aa3054e970036fa4bb50ad95.jpg'">
            </div>
            <div class="cart-item-info">
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-price">${item.price} / porsi</p>
                <div class="cart-qty-wrap">
                    <button class="cart-qty-btn" onclick="changeCartQty(${idx}, -1)">−</button>
                    <span class="cart-qty-count">${item.qty}</span>
                    <button class="cart-qty-btn" onclick="changeCartQty(${idx}, 1)">+</button>
                </div>
            </div>
            <span class="cart-item-subtotal">${formatRupiah(subtotal)}</span>
            <button class="cart-item-remove" onclick="removeCartItem(${idx})" title="Hapus">✕</button>
        </div>`;
    }).join('');

    setTimeout(() => {
        document.querySelectorAll('.cart-item.fade-in').forEach(el => el.classList.add('visible'));
    }, 60);

    // Summary
    let total = 0;
    const lines = cart.map(item => {
        const unitPrice = parsePrice(item.price);
        const subtotal = unitPrice * item.qty;
        total += subtotal;
        return `<div class="summary-line"><span>${item.name} x${item.qty}</span><strong>${formatRupiah(subtotal)}</strong></div>`;
    });
    if (summaryLines) summaryLines.innerHTML = lines.join('');
    if (summaryTotal) summaryTotal.textContent = formatRupiah(total);

    // Save total to sessionStorage for pembayaran page
    sessionStorage.setItem('cartTotal', total);
}

function changeCartQty(idx, delta) {
    const cart = getCart();
    if (!cart[idx]) return;
    cart[idx].qty = Math.max(1, cart[idx].qty + delta);
    saveCart(cart);
    renderKeranjang();
}

function removeCartItem(idx) {
    const cart = getCart();
    cart.splice(idx, 1);
    saveCart(cart);
    renderKeranjang();
}

document.addEventListener('DOMContentLoaded', () => {
    // Seed dummy cart if empty (for demo purposes)
    const cart = getCart();
    if (cart.length === 0 && window.dummyMenu) {
        const demo = (window.dummyMenu || []).slice(0, 2).map(p => ({ ...p, qty: 1 }));
        saveCart(demo);
    }

    setTimeout(renderKeranjang, 100);

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
