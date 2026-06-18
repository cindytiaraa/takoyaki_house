/* keranjang.js — Member Keranjang */
document.addEventListener('DOMContentLoaded', () => {
    injectMemberLayout();
    if (!initMemberLayout('Keranjang')) return;
    renderCart();
});

function renderCart() {
    const cart = getCart();
    const listEl    = document.getElementById('cartList');
    const summaryEl = document.getElementById('cartSummaryCard');
    const checkoutBtn = document.getElementById('ksCheckoutBtn');
    if (!listEl) return;

    if (cart.length === 0) {
        listEl.innerHTML = `
            <div class="m-empty">
                <div class="m-empty-icon">🛒</div>
                <p>Keranjangmu kosong.<br><a href="../menu.html">Lihat menu →</a></p>
            </div>`;
        if (summaryEl) summaryEl.style.display = 'none';
        return;
    }

    if (summaryEl) summaryEl.style.display = 'block';
    if (checkoutBtn) {
        checkoutBtn.style.opacity = '1';
        checkoutBtn.style.pointerEvents = 'auto';
    }

    listEl.innerHTML = cart.map((item, idx) => {
        const unit = parsePrice(item.price);
        const sub  = unit * item.qty;
        return `
        <div class="cart-item-row">
            <div class="cart-img">
                <img src="${item.img}" alt="${item.name}"
                     onerror="this.src='https://i.pinimg.com/736x/37/c3/cb/37c3cb99aa3054e970036fa4bb50ad95.jpg'">
            </div>
            <div class="cart-info">
                <div class="cart-name">${item.name}</div>
                <div class="cart-price">${item.price} / porsi</div>
                <div class="cart-qty">
                    <button class="cart-qty-btn" onclick="changeQty(${idx},-1)">−</button>
                    <span class="cart-qty-num">${item.qty}</span>
                    <button class="cart-qty-btn" onclick="changeQty(${idx},1)">+</button>
                </div>
            </div>
            <span class="cart-subtotal">${fmtRp(sub)}</span>
            <button class="cart-remove-btn" onclick="removeItem(${idx})" title="Hapus">✕</button>
        </div>`;
    }).join('');

    // Summary
    let total = 0;
    const lines = cart.map(item => {
        const sub = parsePrice(item.price) * item.qty;
        total += sub;
        return `<div class="ks-line"><span>${item.name} ×${item.qty}</span><strong>${fmtRp(sub)}</strong></div>`;
    });
    const linesEl = document.getElementById('ksLines');
    if (linesEl) linesEl.innerHTML = lines.join('');

    const totalEl = document.getElementById('ksTotal');
    if (totalEl) totalEl.textContent = fmtRp(total);

    sessionStorage.setItem('cartTotal', total);
    sessionStorage.setItem('cartItems', JSON.stringify(cart));
}

window.changeQty = function(idx, delta) {
    const cart = getCart();
    if (!cart[idx]) return;
    cart[idx].qty = Math.max(1, cart[idx].qty + delta);
    saveCart(cart);
    renderCart();
};

window.removeItem = function(idx) {
    const cart = getCart();
    cart.splice(idx, 1);
    saveCart(cart);
    renderCart();
};
