/* riwayat.js — Riwayat Transaksi */
let currentFilter = 'Semua';

document.addEventListener('DOMContentLoaded', () => {
    injectMemberLayout();
    if (!initMemberLayout('Riwayat Transaksi')) return;

    const user = Auth.getCurrentUser();
    const orders = window.dummyOrders || [];
    const myOrders = orders.filter(o =>
        (user.name && o.customerName === user.name) ||
        (user.phone && o.customerPhone === user.phone)
    );

    // Stats
    const done = myOrders.filter(o => o.status === 'Completed');
    const spend = done.reduce((s, o) => s + o.totalPrice, 0);
    setText('rwTotal', myOrders.length);
    setText('rwDone', done.length);
    setText('rwSpend', 'Rp ' + spend.toLocaleString('id-ID'));

    // Render default
    renderRiwayat(myOrders, 'Semua');

    // Filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.dataset.status;
            renderRiwayat(myOrders, currentFilter);
        });
    });
});

function renderRiwayat(orders, status) {
    const filtered = status === 'Semua' ? orders : orders.filter(o => o.status === status);
    const container = document.getElementById('riwayatList');
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="m-empty"><div class="m-empty-icon">📋</div><p>Tidak ada transaksi ${status !== 'Semua' ? '"' + status + '"' : ''}.</p></div>`;
        return;
    }

    container.innerHTML = filtered.slice().reverse().map(o => {
        const cls = o.status === 'Completed' ? 'status-completed' : o.status === 'Cancelled' ? 'status-cancelled' : 'status-pending';
        const chips = o.items.map(i => `<span class="filter-chip" style="cursor:default;">${i.name} ×${i.qty}</span>`).join('');
        return `
        <div class="home-order-item" style="flex-direction:column;align-items:flex-start;gap:10px;">
            <div style="display:flex;justify-content:space-between;width:100%;align-items:center;flex-wrap:wrap;gap:8px;">
                <span style="font-family:var(--font-display);font-size:0.95rem;font-weight:700;">#${o.id}</span>
                <span style="font-size:0.75rem;color:var(--gray);">📅 ${o.date}</span>
                <span class="status-badge ${cls}">${o.status}</span>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">${chips}</div>
            <div style="display:flex;justify-content:space-between;width:100%;align-items:center;flex-wrap:wrap;gap:6px;">
                ${o.note ? `<span style="font-size:0.75rem;color:var(--gray);font-style:italic;">📝 ${o.note}</span>` : '<span></span>'}
                <span class="hoi-price">Rp ${o.totalPrice.toLocaleString('id-ID')}</span>
            </div>
        </div>`;
    }).join('');
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}
