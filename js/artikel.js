/* ═══════════════════════════════════════════
   ARTIKEL.JS — Arsip Artikel
════════════════════════════════════════════ */

let artikelCurrentCat = 'Semua';

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getExcerpt(content, maxLen = 100) {
    if (!content) return '';
    return content.length > maxLen ? content.slice(0, maxLen) + '…' : content;
}

function renderArtikel(cat) {
    const grid = document.getElementById('artikelGrid');
    const empty = document.getElementById('artikelEmpty');
    const articles = window.dummyArticles || [];

    const filtered = cat === 'Semua'
        ? articles.filter(a => a.status === 'Published')
        : articles.filter(a => a.status === 'Published' && a.category === cat);

    if (filtered.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    grid.innerHTML = filtered.map(a => `
        <article class="artikel-card fade-in" onclick="window.location.href='detail-artikel.html?id=${a.id}'">
            <div class="artikel-card-img">
                <img src="${a.image}" alt="${a.title}" loading="lazy" onerror="this.src='https://i.pinimg.com/736x/37/c3/cb/37c3cb99aa3054e970036fa4bb50ad95.jpg'">
                <span class="artikel-card-cat">${a.category}</span>
            </div>
            <div class="artikel-card-body">
                <span class="artikel-card-date">${formatDate(a.date)}</span>
                <h3>${a.title}</h3>
                <p>${getExcerpt(a.content, 110)}</p>
                <span class="artikel-card-link">Baca Selengkapnya →</span>
            </div>
        </article>
    `).join('');

    // trigger fade-in
    setTimeout(() => {
        document.querySelectorAll('.artikel-card.fade-in').forEach(el => el.classList.add('visible'));
    }, 80);
}

document.addEventListener('DOMContentLoaded', () => {
    // wait for articleData to be ready
    setTimeout(() => renderArtikel('Semua'), 100);

    // filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            artikelCurrentCat = btn.dataset.cat;
            renderArtikel(artikelCurrentCat);
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
