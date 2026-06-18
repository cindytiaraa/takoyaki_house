/* home.js — Member Beranda */
document.addEventListener('DOMContentLoaded', () => {
    injectMemberLayout();
    if (!initMemberLayout('Beranda')) return;

    const user = Auth.getCurrentUser();
    if (!user) return;

    // Hero name
    const heroName = document.getElementById('heroName');
    if (heroName) heroName.textContent = user.name ? user.name.split(' ')[0] : 'Member';

    // Stats
    setText('statMembership', user.membership || 'Bronze');
    setText('statPoints', user.points ?? 0);

    const orders = window.dummyOrders || [];
    const myOrders = getMyOrders(orders, user);
    setText('statOrders', myOrders.length);
    setText('statDone', myOrders.filter(o => o.status === 'Completed').length);

    // Recent orders
    renderRecentOrders(myOrders.slice().reverse().slice(0, 4));
});

function getMyOrders(orders, user) {
    return orders.filter(o =>
        (user.name && o.customerName === user.name) ||
        (user.phone && o.customerPhone === user.phone)
    );
}

function renderRecentOrders(orders) {
    const container = document.getElementById('homeRecentOrders');
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = `<div class="m-empty"><div class="m-empty-icon">📋</div><p>Belum ada order. <a href="order.html">Pesan sekarang →</a></p></div>`;
        return;
    }

    container.innerHTML = orders.map(o => {
        const statusCls = o.status === 'Completed' ? 'status-completed' : o.status === 'Cancelled' ? 'status-cancelled' : 'status-pending';
        const items = o.items.map(i => i.name).join(', ');
        return `
        <div class="home-order-item">
            <div class="hoi-left">
                <strong>#${o.id} — ${items}</strong>
                <span>${o.date}</span>
            </div>
            <div class="hoi-right">
                <span class="hoi-price">Rp ${o.totalPrice.toLocaleString('id-ID')}</span>
                <span class="status-badge ${statusCls}">${o.status}</span>
            </div>
        </div>`;
    }).join('');
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}
