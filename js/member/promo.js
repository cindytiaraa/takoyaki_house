/* promo.js */
const PROMOS = [
    { title:'Diskon 10% Setiap Hari', tag:'Member Exclusive', desc:'Berlaku untuk semua menu. Tunjukkan kartu member atau login sebelum checkout.', until:'31 Desember 2026', color:'linear-gradient(135deg,#FF7A00,#e55a00)' },
    { title:'Free Takoyaki Ultah', tag:'Birthday Reward', desc:'1 porsi takoyaki gratis di hari ulang tahunmu. Konfirmasi ke kasir dengan KTP.', until:'Sepanjang tahun', color:'linear-gradient(135deg,#1E2A5A,#2a3a7a)' },
    { title:'Flash Sale Jumat', tag:'Weekly Deal', desc:'Diskon 20% setiap Jumat mulai 17:00. Terbatas 50 porsi pertama.', until:'Setiap Jumat', color:'linear-gradient(135deg,#059669,#047857)' },
    { title:'Beli 2 Gratis 1 Minuman', tag:'Bundle Hemat', desc:'Setiap pembelian 2 porsi takoyaki, dapatkan 1 minuman pilihan gratis.', until:'30 Juni 2026', color:'linear-gradient(135deg,#7c3aed,#6d28d9)' },
    { title:'Referral Bonus 500 Poin', tag:'Refer a Friend', desc:'Ajak temanmu daftar member. Kamu dan temanmu sama-sama dapat 500 poin.', until:'Berlaku terus', color:'linear-gradient(135deg,#dc2626,#b91c1c)' },
    { title:'Priority Order Tanpa Antri', tag:'Member Benefit', desc:'Pesananmu diproses lebih dulu dari non-member. Berlaku di jam sibuk.', until:'Selama aktif member', color:'linear-gradient(135deg,#0284c7,#0369a1)' },
];

document.addEventListener('DOMContentLoaded', () => {
    injectMemberLayout();
    if (!initMemberLayout('Tawaran & Promo')) return;
    renderPromos();
});

function renderPromos() {
    const grid = document.getElementById('promoGrid');
    if (!grid) return;

    grid.innerHTML = PROMOS.map(p => `
        <div class="promo-card">
            <div class="promo-card-head" style="background:${p.color};">
                <span class="promo-tag-badge">${p.tag}</span>
                <h3>${p.title}</h3>
            </div>
            <div class="promo-card-body">
                <p class="promo-desc">${p.desc}</p>
                <p class="promo-until">Berlaku hingga: <strong>${p.until}</strong></p>
            </div>
        </div>
    `).join('');
}
