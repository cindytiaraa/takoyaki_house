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

function renderFilterArtikel(){
    const wrap = document.getElementById("artikelFilter");
    const articles = window.dummyArticles || [];
    const categories = [
        "Semua",
        ...new Set(
            articles
                .filter(a => a.status === "Published")
                .map(a => a.category)
        )
    ];
    wrap.innerHTML = categories.map((cat,index)=>`
        <button
            class="filter-btn ${index===0 ? 'active' : ''}"
            data-cat="${cat}">
            ${cat}
        </button>
    `).join("");
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

function renderPopularArtikel(){
    const wrap = document.getElementById("popularList");
    if(!wrap) return;
    const articles = (window.dummyArticles || [])
        .filter(a=>a.status==="Published")
        .slice(0,3);
    wrap.innerHTML = articles.map(a=>`
        <a href="detail-artikel.html?id=${a.id}">
            <img src="${a.image}" alt="${a.title}">
            <div>
                <h4>${a.title}</h4>
                <span>${a.category}</span>
            </div>
        </a>
    `).join("");
}

function renderKategoriArtikel(){
    const wrap = document.getElementById("sidebarCategory");
    if(!wrap) return;
    const categories = [
        ...new Set(
            (window.dummyArticles||[])
            .filter(a=>a.status==="Published")
            .map(a=>a.category)
        )
    ];
    wrap.innerHTML = categories.map(cat=>`

        <li>${cat}</li>

    `).join("");
}

function initSearch(){
    const input = document.getElementById("artikelSearch");
    if(!input) return;
    input.addEventListener("input",()=>{
        const keyword = input.value.toLowerCase();
        const cards = document.querySelectorAll(".artikel-card");
        cards.forEach(card=>{
            const title = card.querySelector("h3").innerText.toLowerCase();
            card.style.display =
                title.includes(keyword)
                ? ""
                : "none";
        });
    });
}

document.addEventListener("DOMContentLoaded",()=>{
    renderFilterArtikel();
    renderArtikel("Semua");
    renderPopularArtikel();
    renderKategoriArtikel();
    initSearch();

    document.addEventListener("click",(e)=>{
        if(!e.target.classList.contains("filter-btn")) return;
        document
            .querySelectorAll(".filter-btn")
            .forEach(btn=>btn.classList.remove("active"));
        e.target.classList.add("active");
        renderArtikel(e.target.dataset.cat);
    });
});