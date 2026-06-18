/* favorit.js */
let currentCat = 'Semua';

document.addEventListener('DOMContentLoaded', () => {
    injectMemberLayout();
    if (!initMemberLayout('Menu Favorit')) return;

    renderFavorit('Semua');

    document.querySelectorAll('.fav-filter-chips .filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.fav-filter-chips .filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentCat = chip.dataset.cat;
            renderFavorit(currentCat);
        });
    });
});

function renderFavorit(cat) {
    const menu = window.dummyMenu || [];
    const grid = document.getElementById('favGrid');
    if (!grid) return;

    const filtered = cat === 'Semua'
        ? menu.filter(m => m.status === 'available')
        : menu.filter(m => m.status === 'available' && m.category === cat);

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="m-empty" style="grid-column:1/-1"><div class="m-empty-icon">🍡</div><p>Belum ada menu di kategori ini.</p></div>`;
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <div class="fav-menu-card" onclick="window.location.href='../detail-produk.html?id=${p.id}'">
            <img class="fav-menu-img" src="${p.img}" alt="${p.name}"
                 onerror="this.src='https://i.pinimg.com/736x/37/c3/cb/37c3cb99aa3054e970036fa4bb50ad95.jpg'">
            <div class="fav-menu-body">
                <div class="fav-menu-name">${p.name}</div>
                <div class="fav-menu-desc">${p.desc}</div>
                <div class="fav-menu-footer">
                    <span class="fav-menu-price">${p.price}</span>
                    <button class="fav-add-btn" onclick="addToCartFav(event, ${p.id})">+ Keranjang</button>
                </div>
            </div>
        </div>
    `).join('');
}

function addToCartFav(e, id) {
    e.stopPropagation();
    const menu = window.dummyMenu || [];
    const product = menu.find(p => p.id === id);
    if (!product) return;

    const cart = getCart();
    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    saveCart(cart);
    showToast(`✅ ${product.name} ditambahkan ke keranjang!`);
}

function showToast(msg) {
    let toast = document.getElementById('memberToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'memberToast';
        toast.className = 'member-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}
