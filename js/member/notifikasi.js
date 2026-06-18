/* notifikasi.js */

// Notifikasi dummy — diambil dari dummyOrders user + statis promo
const STATIC_NOTIFS = [
    { id:'n1', icon:'🎁', title:'Promo Member Aktif!', desc:'Diskon 10% berlaku setiap hari. Tunjukkan kartu member saat checkout.', time:'Hari ini', unread: true },
    { id:'n2', icon:'🎂', title:'Free Takoyaki di Hari Ulang Tahun', desc:'Dapatkan 1 porsi takoyaki gratis di hari ulang tahunmu. Hubungi kami sehari sebelumnya.', time:'2 hari lalu', unread: true },
    { id:'n3', icon:'⚡', title:'Flash Sale Setiap Jumat!', desc:'Diskon 20% untuk semua menu setiap hari Jumat mulai jam 17:00.', time:'5 hari lalu', unread: false },
    { id:'n4', icon:'📦', title:'Layanan Priority Order', desc:'Sebagai member, pesananmu akan diproses lebih cepat tanpa antri panjang.', time:'1 minggu lalu', unread: false },
];

let readIds = [];

document.addEventListener('DOMContentLoaded', () => {
    injectMemberLayout();
    if (!initMemberLayout('Notifikasi')) return;

    const user = Auth.getCurrentUser();
    const orders = window.dummyOrders || [];
    const myOrders = orders.filter(o =>
        (user.name && o.customerName === user.name) ||
        (user.phone && o.customerPhone === user.phone)
    ).slice(-3).reverse();

    // Order-based notifikasi
    const orderNotifs = myOrders.map(o => ({
        id: 'o' + o.id,
        icon: o.status === 'Completed' ? '✅' : o.status === 'Cancelled' ? '❌' : '🕐',
        title: `Pesanan #${o.id} — ${o.status}`,
        desc: `${o.items.map(i => i.name + ' ×' + i.qty).join(', ')} · Rp ${o.totalPrice.toLocaleString('id-ID')}`,
        time: o.date,
        unread: o.status === 'Pending',
    }));

    const allNotifs = [...orderNotifs, ...STATIC_NOTIFS];
    renderNotifs(allNotifs);

    document.getElementById('markAllRead')?.addEventListener('click', () => {
        readIds = allNotifs.map(n => n.id);
        renderNotifs(allNotifs.map(n => ({ ...n, unread: false })));
    });
});

function renderNotifs(notifs) {
    const container = document.getElementById('notifList');
    if (!container) return;

    if (notifs.length === 0) {
        container.innerHTML = `<div class="m-empty"><div class="m-empty-icon">🔔</div><p>Tidak ada notifikasi.</p></div>`;
        return;
    }

    container.innerHTML = notifs.map(n => `
        <div class="notif-item ${n.unread && !readIds.includes(n.id) ? 'unread' : ''}">
            <div class="notif-icon">${n.icon}</div>
            <div class="notif-body">
                <div class="notif-title">${n.title}</div>
                <div class="notif-desc">${n.desc}</div>
                <div class="notif-time">${n.time}</div>
            </div>
            <div class="notif-dot"></div>
        </div>
    `).join('');
}
