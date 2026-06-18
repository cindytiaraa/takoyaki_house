/* ═══════════════════════════════════════════
   HISTORY.JS — History Transaksi
════════════════════════════════════════════ */

let historyCurrentStatus = 'Semua';

function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getStatusClass(status) {
    if (status === 'Completed') return 'status-completed';
    if (status === 'Pending') return 'status-pending';
    return 'status-cancelled';
}

function renderStats(orders) {
    const container = document.getElementById('historyStats');
    if (!container) return;
    const total = orders.length;
    const completed = orders.filter(o => o.status === 'Completed').length;
    const totalSpend = orders.filter(o => o.status === 'Completed')
        .reduce((sum, o) => sum + o.totalPrice, 0);

    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon">🧾</div>
            <div class="stat-info">
                <div class="stat-value">${total}</div>
                <div class="stat-label">Total Transaksi</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
                <div class="stat-value">${completed}</div>
                <div class="stat-label">Berhasil</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
                <div class="stat-value">${formatRupiah(totalSpend)}</div>
                <div class="stat-label">Total Pengeluaran</div>
            </div>
        </div>
    `;
}

function renderHistory(statusFilter) {
    const orders = window.dummyOrders || [];
    const list = document.getElementById('historyList');
    if (!list) return;

    const filtered = statusFilter === 'Semua'
        ? orders
        : orders.filter(o => o.status === statusFilter);

    if (filtered.length === 0) {
        list.innerHTML = `<p class="history-empty">Tidak ada transaksi dengan status "${statusFilter}".</p>`;
        return;
    }

    list.innerHTML = filtered.map(order => {
        const itemChips = order.items.map(item =>
            `<span class="history-item-chip">${item.name} x${item.qty}</span>`
        ).join('');

        const noteHtml = order.note
            ? `<p class="history-note">📝 Catatan: "${order.note}"</p>`
            : '';

        return `
        <div class="history-card fade-in">
            <div class="history-card-top">
                <span class="history-tx-id">#${order.id}</span>
                <span class="history-date">📅 ${formatDate(order.date)}</span>
                <span class="history-status ${getStatusClass(order.status)}">${order.status}</span>
            </div>
            <div class="history-card-items">${itemChips}</div>
            <div class="history-card-bottom">
                <span class="history-customer">👤 <strong>${order.customerName}</strong> &nbsp;|&nbsp; 📞 ${order.customerPhone}</span>
                <span class="history-total">${formatRupiah(order.totalPrice)}</span>
                ${noteHtml}
            </div>
        </div>`;
    }).join('');

    setTimeout(() => {
        document.querySelectorAll('.history-card.fade-in').forEach(el => el.classList.add('visible'));
    }, 80);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const orders = window.dummyOrders || [];
        renderStats(orders);
        renderHistory('Semua');
    }, 100);

    // filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            historyCurrentStatus = btn.dataset.status;
            renderHistory(historyCurrentStatus);
        });
    });

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
