/* ═══════════════════════════════════════════
   MEMBER LAYOUT JS — member-layout.js
   Shared di semua halaman member:
   · Drawer sidebar (hamburger toggle)
   · Auth guard
   · Cart badge update
   · User info fill
════════════════════════════════════════════ */

/* ── Cart helpers */
function getCart() {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); }
    catch { return []; }
}
function saveCart(c) {
    localStorage.setItem('cart', JSON.stringify(c));
    updateCartBadge();
}
function parsePrice(p) { return parseInt(String(p).replace(/[^\d]/g, '')) || 0; }
function fmtRp(n) { return 'Rp ' + n.toLocaleString('id-ID'); }

function updateCartBadge() {
    const cart = getCart();
    const qty = cart.reduce((s, i) => s + (i.qty || 0), 0);

    // Topbar badge
    document.querySelectorAll('.topbar-cart-count, #cartCount').forEach(el => {
        el.textContent = qty;
        el.style.display = qty > 0 ? 'inline-block' : 'none';
    });
    // Drawer badge
    const drawerBadge = document.getElementById('drawerCartBadge');
    if (drawerBadge) {
        drawerBadge.textContent = qty;
        drawerBadge.style.display = qty > 0 ? 'inline-block' : 'none';
    }
}

/* ── Drawer */
function openDrawer() {
    document.getElementById('memberDrawer')?.classList.add('open');
    document.getElementById('drawerOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeDrawer() {
    document.getElementById('memberDrawer')?.classList.remove('open');
    document.getElementById('drawerOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
}

/* ── Set active link in drawer based on current page */
function setActiveDrawerLink() {
    const page = window.location.pathname.split('/').pop();
    document.querySelectorAll('.drawer-nav a').forEach(a => {
        const href = a.getAttribute('href') || '';
        const linkPage = href.split('/').pop();
        if (linkPage === page) a.classList.add('active');
        else a.classList.remove('active');
    });
}

/* ── Fill user info into drawer & topbar */
function fillLayoutUser() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const initial = (user.name || 'M')[0].toUpperCase();

    // Drawer
    const dName = document.getElementById('drawerUserName');
    const dTier = document.getElementById('drawerUserTier');
    const dAvatar = document.getElementById('drawerAvatar');
    if (dName) dName.textContent = user.name || 'Member';
    if (dTier) dTier.textContent = user.membership || 'Bronze';
    if (dAvatar) dAvatar.textContent = initial;

    // Topbar avatar
    const tAvatar = document.getElementById('topbarAvatar');
    if (tAvatar) tAvatar.textContent = initial;
}

/* ── Init — call this from every member page */
function initMemberLayout(pageTitleText, authRedirect) {
    // Auth guard
    const redirect = authRedirect || '../../pages/auth/login.html';
    if (!Auth.requireAuth(['member', 'admin'], redirect)) return false;

    // Page title in topbar
    const titleEl = document.getElementById('topbarPageTitle');
    if (titleEl && pageTitleText) titleEl.textContent = pageTitleText;

    // Hamburger
    const hamburger = document.getElementById('topbarHamburger');
    if (hamburger) hamburger.addEventListener('click', openDrawer);

    // Drawer close button
    const drawerClose = document.getElementById('drawerCloseBtn');
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

    // Overlay click → close
    const overlay = document.getElementById('drawerOverlay');
    if (overlay) overlay.addEventListener('click', closeDrawer);

    // Logout
    const logoutBtn = document.getElementById('drawerLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Yakin ingin logout?')) {
                Auth.logout('../../pages/auth/login.html');
            }
        });
    }

    fillLayoutUser();
    setActiveDrawerLink();
    updateCartBadge();

    return true;
}

window.getCart = getCart;
window.saveCart = saveCart;
window.parsePrice = parsePrice;
window.fmtRp = fmtRp;
window.updateCartBadge = updateCartBadge;
window.initMemberLayout = initMemberLayout;
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
