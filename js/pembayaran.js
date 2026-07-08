/* ═══════════════════════════════════════════
   PEMBAYARAN.JS
════════════════════════════════════════════ */

const PAYMENT_METHODS = [
    { id: "transfer", name: "Transfer Bank", sub: "BCA / BRI / Mandiri", icon: "TF" },
    { id: "ewallet", name: "E-Wallet / QRIS", sub: "GoPay, OVO, DANA", icon: "QR" },
    { id: "cod", name: "Bayar di Tempat", sub: "Cash on delivery", icon: "COD" },
];

let selectedPaymentMethod = null;

function getCart() {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); }
    catch { return []; }
}

function parsePrice(priceStr) {
    return parseInt(String(priceStr).replace(/[^\d]/g, '')) || 0;
}

function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
}

function cartTotal(cart) {
    return cart.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0);
}

function renderPaymentMethods() {
    const wrap = document.getElementById('paymentMethods');
    if (!wrap) return;
    wrap.innerHTML = PAYMENT_METHODS.map(m => `
        <div class="payment-method-card" data-method="${m.id}">
            <div class="payment-method-icon">${m.icon}</div>
            <div>
                <div class="payment-method-name">${m.name}</div>
                <div class="payment-method-sub">${m.sub}</div>
            </div>
        </div>
    `).join('');

    wrap.querySelectorAll('.payment-method-card').forEach(card => {
        card.addEventListener('click', () => {
            wrap.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedPaymentMethod = card.dataset.method;
        });
    });
}

function renderReviewAndSummary(cart) {
    const review = document.getElementById('pembayaranReview');
    const lines = document.getElementById('paySummaryLines');
    const totalEl = document.getElementById('paySummaryTotal');
    const confirmBtn = document.getElementById('btnConfirmPayment');
    const cartCount = document.getElementById('cartCount');

    if (cartCount) cartCount.textContent = cart.reduce((n, i) => n + i.qty, 0);

    if (cart.length === 0) {
        review.innerHTML = `
            <div class="pembayaran-empty">
                <p>Belum ada produk di keranjang.</p>
                <a href="menu.html">Lihat Menu →</a>
            </div>`;
        if (lines) lines.innerHTML = '';
        if (totalEl) totalEl.textContent = 'Rp 0';
        if (confirmBtn) { confirmBtn.disabled = true; confirmBtn.style.opacity = '0.5'; confirmBtn.style.cursor = 'not-allowed'; }
        return;
    }

    review.innerHTML = cart.map(item => {
        const unitPrice = parsePrice(item.price);
        const subtotal = unitPrice * item.qty;
        return `
        <div class="cart-item">
            <div class="cart-item-img">
                <img src="${item.img}" alt="${item.name}" onerror="this.src='https://i.pinimg.com/736x/37/c3/cb/37c3cb99aa3054e970036fa4bb50ad95.jpg'">
            </div>
            <div class="cart-item-info">
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-price">${item.price} x ${item.qty}</p>
            </div>
            <span class="cart-item-subtotal">${formatRupiah(subtotal)}</span>
        </div>`;
    }).join('');

    const total = cartTotal(cart);
    if (lines) {
        lines.innerHTML = cart.map(item => {
            const subtotal = parsePrice(item.price) * item.qty;
            return `<div class="summary-line"><span>${item.name} x${item.qty}</span><strong>${formatRupiah(subtotal)}</strong></div>`;
        }).join('');
    }
    if (totalEl) totalEl.textContent = formatRupiah(total);
    if (confirmBtn) { confirmBtn.disabled = false; confirmBtn.style.opacity = '1'; confirmBtn.style.cursor = 'pointer'; }
}

function showSuccess(order) {
    const section = document.getElementById('pembayaranInner');
    if (!section) return;
    section.innerHTML = `
        <div class="pembayaran-success">
            <div class="pembayaran-success-badge">OK</div>
            <h2>Pembayaran Berhasil Dikonfirmasi</h2>
            <p>Nomor transaksi kamu: <span class="tx-id">#${order.id}</span></p>
            <p>Pesanan akan segera diproses. Terima kasih, ${order.customerName}!</p>
            <div class="pembayaran-success-actions">
                <a href="history.html" class="btn-primary">Lihat History Transaksi</a>
                <a href="home.html" class="btn-outline">Kembali ke Home</a>
            </div>
        </div>
    `;
    section.style.display = 'block';
    section.style.gridTemplateColumns = 'unset';
}

function confirmPayment() {
    const cart = getCart();
    if (cart.length === 0) return;

    const name = document.getElementById('payName').value.trim();
    const phone = document.getElementById('payPhone').value.trim();

    if (!name || !phone) {
        alert('Mohon isi nama dan nomor WhatsApp terlebih dahulu.');
        return;
    }
    if (!selectedPaymentMethod) {
        alert('Silakan pilih metode pembayaran.');
        return;
    }

    const methodLabel = PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod)?.name || selectedPaymentMethod;
    const total = cartTotal(cart);

    const order = {
        id: 'TX-' + Date.now().toString().slice(-6),
        customerName: name,
        customerPhone: phone,
        items: cart.map(item => ({ name: item.name, qty: item.qty, price: parsePrice(item.price) })),
        totalPrice: total,
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        note: 'Metode pembayaran: ' + methodLabel,
        status: 'Pending',
    };

    if (Array.isArray(window.dummyOrders)) {
        window.dummyOrders.unshift(order);
        window.saveOrders?.();
    }

    localStorage.setItem('cart', JSON.stringify([]));
    showSuccess(order);
}

document.addEventListener('DOMContentLoaded', () => {
    renderPaymentMethods();
    setTimeout(() => renderReviewAndSummary(getCart()), 60);

    document.getElementById('btnConfirmPayment')?.addEventListener('click', confirmPayment);
});
