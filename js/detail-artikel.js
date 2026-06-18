/* ═══════════════════════════════════════════
   DETAIL-ARTIKEL.JS
════════════════════════════════════════════ */

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

function renderDetailArtikel() {
    const articles = window.dummyArticles || [];
    const id = getIdFromUrl();
    const article = articles.find(a => a.id === id);
    const main = document.getElementById('artikelDetailMain');

    if (!article) {
        main.innerHTML = `<div style="text-align:center;padding:80px 0;">
            <p style="color:var(--gray);font-size:0.95rem;">Artikel tidak ditemukan.</p>
            <a href="artikel.html" class="btn-primary" style="margin-top:20px;display:inline-block;">← Kembali ke Arsip</a>
        </div>`;
        return;
    }

    // Update page title & breadcrumb
    document.title = `${article.title} — Takoyaki House`;
    const breadcrumb = document.getElementById('breadcrumbTitle');
    if (breadcrumb) breadcrumb.textContent = article.title.length > 40 ? article.title.slice(0, 40) + '…' : article.title;

    main.innerHTML = `
        <span class="detail-cat-badge">${article.category}</span>
        <h1 class="detail-title">${article.title}</h1>
        <div class="detail-meta">
            <span>📅 ${formatDate(article.date)}</span>
            <span>✍️ Tim Takoyaki House</span>
            <span>⏱ 2 menit baca</span>
        </div>
        <div class="detail-cover">
            <img src="${article.image}" alt="${article.title}" onerror="this.src='https://i.pinimg.com/736x/37/c3/cb/37c3cb99aa3054e970036fa4bb50ad95.jpg'">
        </div>
        <div class="detail-content">
            ${article.content.split('. ').map(s => s.trim()).filter(Boolean)
                .reduce((acc, s, i) => {
                    if (i % 3 === 0) acc.push([]);
                    acc[acc.length - 1].push(s);
                    return acc;
                }, [])
                .map(group => `<p>${group.join('. ')}${group[group.length-1].endsWith('.') ? '' : '.'}</p>`)
                .join('')}
        </div>
        <a href="artikel.html" class="detail-back">← Kembali ke Arsip Artikel</a>
    `;
}

function renderSidebarArtikel() {
    const articles = window.dummyArticles || [];
    const id = getIdFromUrl();
    const others = articles.filter(a => a.id !== id && a.status === 'Published').slice(0, 4);
    const container = document.getElementById('sidebarArtikel');
    if (!container) return;

    if (others.length === 0) {
        container.innerHTML = '<p style="font-size:0.80rem;color:var(--gray);">Belum ada artikel lain.</p>';
        return;
    }

    container.innerHTML = others.map(a => `
        <div class="sidebar-artikel-item" onclick="window.location.href='detail-artikel.html?id=${a.id}'">
            <div class="sab-img">
                <img src="${a.image}" alt="${a.title}" onerror="this.src='https://i.pinimg.com/736x/37/c3/cb/37c3cb99aa3054e970036fa4bb50ad95.jpg'">
            </div>
            <div class="sab-info">
                <p class="sab-cat">${a.category}</p>
                <p class="sab-title">${a.title}</p>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        renderDetailArtikel();
        renderSidebarArtikel();
    }, 100);

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
