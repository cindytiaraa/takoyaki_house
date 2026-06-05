/* ═══════════════════════════════════════════
   TAKOYAKI HOUSE — script.js
════════════════════════════════════════════ */

// ── Menu data (themed, images from dummyjson API mapped to takoyaki theme)
const MENU_OVERRIDES = [
    {
        name: "Takoyaki Original",
        desc: "Gurita segar, saus okonomiyaki, mayo & bonito",
        price: "Rp 15.000",
        badge: "Terlaris",
    },
    {
        name: "Takoyaki Cheese",
        desc: "Lelehan keju mozzarella di atas takoyaki original",
        price: "Rp 18.000",
        badge: "Favorit",
    },
    {
        name: "Takoyaki Spicy",
        desc: "Level pedas bisa disesuaikan, cocok buat yang berani",
        price: "Rp 17.000",
        badge: "🌶 Panas",
    },
    {
        name: "Dimsum",
        desc: "Dimsum isi daging sapi premium dengan saus pedas manis",
        price: "Rp 20.000",
        badge: "Baru",
        img: "https://i.pinimg.com/736x/0e/0d/a5/0e0da52ce8779a550e541809ee287fa0.jpg"
    },
    {
        name: "Matcha Latte",
        desc: "Green tea premium dengan susu segar, dingin menyegarkan",
        price: "Rp 16.000",
        badge: null,
        img: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&q=80"
    },
    {
        name: "Yuzu Lemonade",
        desc: "Lemon segar dengan citrus yuzu khas Jepang, served cold",
        price: "Rp 14.000",
        badge: null,
        img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&q=80"
    },
    {
        name: "Takoyaki Mix",
        desc: "Kombinasi 3 rasa: original, cheese & spicy dalam satu porsi",
        price: "Rp 22.000",
        badge: "Value",
        img: "https://i.pinimg.com/736x/fe/58/0c/fe580c83a433505a674e19b1a835ab2b.jpg"
    },
    {
        name: "Boba Milk Tea",
        desc: "Teh susu dengan tapioca pearl kenyal, dingin & manis",
        price: "Rp 15.000",
        badge: null,
        img: "https://i.pinimg.com/1200x/c5/b6/cc/c5b6cc29f5620edb28be371b49d3395b.jpg"
    }
];

// ── Testimonials
const TESTIMONIALS = [
    { name: "Budi S.", role: "Pelanggan Setia", stars: "★★★★★", text: "Takoyaki terenak yang pernah aku coba! Crispy di luar, lembut di dalam. Wajib coba cheese-nya!" },
    { name: "Ayu P.", role: "Food Blogger", stars: "★★★★★", text: "Rasanya otentik banget, beneran kayak di Tokyo. Sausnya juga nggak pasaran, bikin nagih." },
    { name: "Reza M.", role: "Mahasiswa ITS", stars: "★★★★☆", text: "Harga terjangkau, porsi kenyang. Matcha latte-nya juga enak banget jadi pelengkap!" },
    { name: "Sari W.", role: "Ibu Rumah Tangga", stars: "★★★★★", text: "Sering beli buat anak-anak, selalu habis. Pelayanannya juga ramah dan cepat. Recommended!" }
];

// Selected menu: { index -> qty }
const selectedMenu = {};

// ── Fallback images if Pinterest blocks
function fallbackImg(img, name) {
    img.onerror = null;
    img.src = `https://placehold.co/400x200/111111/ffffff?text=${encodeURIComponent(name)}`;
}

// ── Render menu cards
function renderMenu(items) {
    const grid = document.getElementById("menuGrid");
    grid.innerHTML = "";

    items.forEach((item, i) => {
        const card = document.createElement("div");
        card.className = "menu-card fade-in";
        card.style.animationDelay = `${i * 0.08}s`;
        card.innerHTML = `
            <div class="menu-card-img">
                <img src="${item.img}" alt="${item.name}" onerror="fallbackImg(this,'${item.name}')">
                ${item.badge ? `<span class="menu-card-badge">${item.badge}</span>` : ""}
            </div>
            <div class="menu-card-body">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <div class="menu-card-footer">
                    <span class="menu-price">${item.price}</span>
                    <button class="menu-order-btn" onclick="scrollToOrder(${i})">Pesan →</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Trigger animation
    setTimeout(() => {
        document.querySelectorAll(".menu-card.fade-in").forEach(el => el.classList.add("visible"));
    }, 50);
}

/* ──────────────────────────────────
   RENDER ORDER MENU PICKER (chips)
────────────────────────────────── */
function renderOrderPicker() {
    const picker = document.getElementById("orderMenuPicker");
    if (!picker) return;
    picker.innerHTML = "";

    MENU_OVERRIDES.forEach(item => {
        item.priceNum = parseInt(item.price.replace(/\D/g, ""));
    });

    MENU_OVERRIDES.forEach((item, i) => {
        const chip = document.createElement("div");
        chip.className = "menu-chip";
        chip.id = `chip-${i}`;
        chip.innerHTML = `
            <div>
                <div class="chip-name">${item.name}</div>
                <div class="chip-price">${item.price}</div>
            </div>
            <div class="chip-qty" id="qty-${i}">
                <button onclick="changeQty(${i},-1,event)">−</button>
                <span class="qty-count" id="qcount-${i}">1</span>
                <button onclick="changeQty(${i},+1,event)">+</button>
            </div>
        `;
        chip.addEventListener("click", () => toggleChip(i));
        picker.appendChild(chip);
    });
}

function toggleChip(idx) {
    const chip = document.getElementById(`chip-${idx}`);
    if (selectedMenu[idx]) {
        delete selectedMenu[idx];
        chip.classList.remove("selected");
    } else {
        selectedMenu[idx] = 1;
        chip.classList.add("selected");
        document.getElementById(`qcount-${idx}`).textContent = "1";
    }
    // Hide summary if user changes selection
    document.getElementById("orderSummary").style.display = "none";
    document.getElementById("btnSubmit").style.display = "none";
    document.getElementById("btnPreview").style.display = "inline-block";
}

function changeQty(idx, delta, e) {
    e.stopPropagation();
    const current = selectedMenu[idx] || 1;
    const next = Math.max(1, current + delta);
    selectedMenu[idx] = next;
    document.getElementById(`qcount-${idx}`).textContent = next;
}

/* ──────────────────────────────────
   SCROLL TO ORDER + highlight chip
────────────────────────────────── */
function scrollToOrder(menuIdx) {
    document.getElementById("order").scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
        // Auto-select the chip matching the menu card
        if (!selectedMenu[menuIdx]) {
            toggleChip(menuIdx);
        }
        // Briefly highlight
        const chip = document.getElementById(`chip-${menuIdx}`);
        if (chip) {
            chip.style.outline = "3px solid var(--orange)";
            chip.style.outlineOffset = "2px";
            setTimeout(() => { chip.style.outline = ""; chip.style.outlineOffset = ""; }, 1600);
        }
    }, 600);
}

/* ──────────────────────────────────
   PREVIEW ORDER (validation)
────────────────────────────────── */
function previewOrder() {
    const hint = document.getElementById("pickerHint");
    const name = document.getElementById("orderName").value.trim();
    const phone = document.getElementById("orderPhone").value.trim();
    const msg = document.getElementById("orderMsg");

    // Validate: menu must be selected
    if (Object.keys(selectedMenu).length === 0) {
        hint.style.display = "block";
        hint.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
    }
    hint.style.display = "none";

    // Validate: data diri
    if (!name || !phone) {
        msg.style.display = "block";
        msg.className = "order-msg error";
        msg.textContent = "⚠️ Mohon isi nama dan nomor WhatsApp terlebih dahulu.";
        msg.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
    }
    msg.style.display = "none";

    // Build summary
    const summaryList = document.getElementById("summaryList");
    summaryList.innerHTML = "";
    let total = 0;

    Object.entries(selectedMenu).forEach(([idx, qty]) => {
        const item = MENU_OVERRIDES[parseInt(idx)];
        const subtotal = item.priceNum * qty;
        total += subtotal;
        const row = document.createElement("div");
        row.className = "summary-item";
        row.innerHTML = `<span>${item.name} × ${qty}</span><span>Rp ${subtotal.toLocaleString("id-ID")}</span>`;
        summaryList.appendChild(row);
    });

    document.getElementById("summaryTotal").textContent = `Rp ${total.toLocaleString("id-ID")}`;

    // Show summary
    const summary = document.getElementById("orderSummary");
    summary.style.display = "block";
    document.getElementById("btnSubmit").style.display = "inline-block";
    document.getElementById("btnPreview").style.display = "none";
    summary.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ──────────────────────────────────
   SUBMIT ORDER
────────────────────────────────── */
function submitOrder() {
    const name = document.getElementById("orderName").value.trim();
    const phone = document.getElementById("orderPhone").value.trim();
    const note  = document.getElementById("orderNote").value.trim();
    const msg   = document.getElementById("orderMsg");

    // Final guard
    if (Object.keys(selectedMenu).length === 0 || !name || !phone) return;

    const menuStr = Object.entries(selectedMenu)
        .map(([idx, qty]) => `${MENU_OVERRIDES[idx].name} ×${qty}`)
        .join(", ");

    msg.style.display = "block";
    msg.className = "order-msg success";
    msg.innerHTML = `
        ✅ <strong>Pesanan berhasil!</strong><br>
        Halo <strong>${name}</strong>, pesananmu (<em>${menuStr}</em>) sudah kami terima.<br>
        Kami akan menghubungi <strong>${phone}</strong> segera.<br>
        💰 Silakan lakukan pembayaran di kasir saat pengambilan.<br>
        ${note ? `📝 Catatan: ${note}` : ""}
    `;

    // Reset form
    Object.keys(selectedMenu).forEach(k => {
        delete selectedMenu[k];
        const chip = document.getElementById(`chip-${k}`);
        if (chip) chip.classList.remove("selected");
    });
    document.getElementById("orderName").value = "";
    document.getElementById("orderPhone").value = "";
    document.getElementById("orderNote").value = "";
    document.getElementById("orderSummary").style.display = "none";
    document.getElementById("btnSubmit").style.display = "none";
    document.getElementById("btnPreview").style.display = "inline-block";

    msg.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ──────────────────────────────────
   JOIN MEMBER MODAL
────────────────────────────────── */
function openMember() {
    document.getElementById("memberModal").classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeMember() {
    document.getElementById("memberModal").classList.remove("open");
    document.body.style.overflow = "";
}

function handleMember() {
    const name  = document.getElementById("memberName").value.trim();
    const email = document.getElementById("memberEmail").value.trim();
    const pass  = document.getElementById("memberPassword").value.trim();

    if (!name || !email || !pass) {
        alert("⚠️ Please fill in all fields to create your account.");
        return;
    }
    if (!email.includes("@")) {
        alert("⚠️ Please enter a valid email address.");
        return;
    }
    if (pass.length < 6) {
        alert("⚠️ Password must be at least 6 characters.");
        return;
    }

    closeMember();
    // Small success toast
    const toast = document.createElement("div");
    toast.style.cssText = `
        position:fixed; bottom:24px; right:24px; z-index:9999;
        background:var(--navy); color:white;
        padding:14px 22px; border-radius:10px;
        font-family:var(--font-body); font-size:0.88rem; font-weight:500;
        box-shadow:0 8px 24px rgba(0,0,0,0.2);
        animation: slideInToast 0.3s ease;
    `;
    toast.innerHTML = `🎉 Welcome, <strong>${name}</strong>! Member account created.`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// ── Render testimonials
function renderTestimonials() {
    const grid = document.getElementById("testiGrid");
    grid.innerHTML = "";

    TESTIMONIALS.forEach((t) => {
        const card = document.createElement("div");
        card.className = "testi-card fade-in";
        card.innerHTML = `
            <div class="testi-stars">${t.stars}</div>
            <p class="testi-text">${t.text}</p>
            <div class="testi-author">
                <div class="testi-avatar">${t.name[0]}</div>
                <div>
                    <div class="testi-name">${t.name}</div>
                    <div class="testi-role">${t.role}</div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ── Fetch from API (dummyjson) — merge with our theme overrides
async function fetchMenu() {
    try {
        const res = await fetch("https://dummyjson.com/products?limit=8&select=id,title,price,thumbnail");
        if (!res.ok) throw new Error("API error");
        // API call confirms connectivity; use themed data
        renderMenu(MENU_OVERRIDES);
    } catch (err) {
        console.warn("API unavailable, using local data:", err.message);
        renderMenu(MENU_OVERRIDES);
    }
}

// ── Order form handler
function handleOrder() {
    const name = document.getElementById("orderName").value.trim();
    const phone = document.getElementById("orderPhone").value.trim();
    const msg = document.getElementById("orderMsg");

    if (!name || !phone) {
        msg.style.display = "block";
        msg.style.background = "#fdf3f3";
        msg.style.borderColor = "#e74c3c";
        msg.style.color = "#c0392b";
        msg.textContent = "⚠️ Mohon isi nama dan nomor WhatsApp terlebih dahulu.";
        return;
    }

    msg.style.display = "block";
    msg.style.background = "#eafaf1";
    msg.style.borderColor = "#27ae60";
    msg.style.color = "#1e8449";
    msg.textContent = `✅ Terima kasih, ${name}! Pesananmu sudah kami terima. Kami akan menghubungi ${phone} segera.`;

    // Reset
    document.getElementById("orderName").value = "";
    document.getElementById("orderPhone").value = "";
}

/* ──────────────────────────────────
   SCROLL ANIMATIONS
────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.12 });

function observeFadeIns() {
    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
}

// ── Navbar scroll effect
window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 20) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// ── Init
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");

    if (hamburger && mobileMenu) {
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.addEventListener("click", () => {
            const isOpen = mobileMenu.classList.toggle("open");
            hamburger.setAttribute("aria-expanded", String(isOpen));
        });

        mobileMenu.querySelectorAll("a").forEach(a => {
            a.addEventListener("click", () => {
                mobileMenu.classList.remove("open");
                hamburger.setAttribute("aria-expanded", "false");
            });
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                mobileMenu.classList.remove("open");
                hamburger.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Member modal
    document.getElementById("openMemberModal").addEventListener("click", openMember);
    document.getElementById("closeMemberModal").addEventListener("click", closeMember);
    document.getElementById("memberModal").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) closeMember();
    });

    // Init sections
    fetchMenu();
    renderTestimonials();
    renderOrderPicker();
    setTimeout(observeFadeIns, 200);
});
