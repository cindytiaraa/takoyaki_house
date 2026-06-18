/* ═══════════════════════════════════════════
   MEMBER COMPONENTS — member-components.js
   Inject topbar + drawer ke semua halaman member
   Panggil injectMemberLayout() sebelum initMemberLayout()
════════════════════════════════════════════ */

function injectMemberLayout() {
    // ── TOPBAR ───────────────────────────────
    const topbarHTML = `
    <div class="member-topbar" id="memberTopbar">
        <button class="topbar-hamburger" id="topbarHamburger" aria-label="Buka menu">
            <span></span><span></span><span></span>
        </button>
        <a href="home.html" class="topbar-logo">
            <img src="../../img/logo.jpg"
                 onerror="this.src='https://i.pinimg.com/736x/37/c3/cb/37c3cb99aa3054e970036fa4bb50ad95.jpg'"
                 alt="Logo">
            <span class="topbar-logo-text">Takoyaki House</span>
        </a>
        <span class="topbar-page-title" id="topbarPageTitle"></span>
        <div class="topbar-right">
            <a href="keranjang.html" class="topbar-cart-btn" id="topbarCartBtn">
                🛒
                <span class="topbar-cart-count" id="cartCount">0</span>
            </a>
            <div class="topbar-user-avatar" id="topbarAvatar" onclick="openDrawer()">M</div>
        </div>
    </div>`;

    // ── DRAWER ───────────────────────────────
    const drawerHTML = `
    <div class="drawer-overlay" id="drawerOverlay"></div>
    <aside class="member-drawer" id="memberDrawer">
        <div class="drawer-top">
            <div class="drawer-logo">
                <img src="../../img/logo.jpg"
                     onerror="this.src='https://i.pinimg.com/736x/37/c3/cb/37c3cb99aa3054e970036fa4bb50ad95.jpg'"
                     alt="Logo">
                <div>
                    <h2>Takoyaki House</h2>
                    <p>Member Area</p>
                </div>
            </div>
            <button class="drawer-close" id="drawerCloseBtn" aria-label="Tutup">✕</button>
        </div>

        <div class="drawer-user">
            <div class="drawer-avatar" id="drawerAvatar">M</div>
            <div>
                <div class="drawer-user-name" id="drawerUserName">Member</div>
                <div class="drawer-user-tier" id="drawerUserTier">Bronze</div>
            </div>
        </div>

        <nav class="drawer-nav">
            <a href="home.html">
                <span class="nav-icon">🏠</span> Beranda
            </a>
            <a href="riwayat.html">
                <span class="nav-icon">📋</span> Riwayat Transaksi
            </a>
            <a href="notifikasi.html">
                <span class="nav-icon">🔔</span> Notifikasi
            </a>
            <a href="profil.html">
                <span class="nav-icon">👤</span> Profil Saya
            </a>
            <a href="promo.html">
                <span class="nav-icon">🎁</span> Tawaran &amp; Promo
            </a>
            <a href="favorit.html">
                <span class="nav-icon">⭐</span> Menu Favorit
            </a>
            <a href="keranjang.html">
                <span class="nav-icon">🛒</span> Keranjang
                <span class="nav-badge" id="drawerCartBadge" style="display:none;">0</span>
            </a>
            <a href="order.html">
                <span class="nav-icon">⚡</span> Order Langsung
            </a>
            <a href="../menu.html">
                <span class="nav-icon">🍡</span> Lihat Menu
            </a>
        </nav>

        <div class="drawer-bottom">
            <button class="drawer-logout" id="drawerLogout">
                🚪 Logout
            </button>
        </div>
    </aside>`;

    // Inject before <body> first child
    document.body.insertAdjacentHTML('afterbegin', drawerHTML + topbarHTML);
}

window.injectMemberLayout = injectMemberLayout;
