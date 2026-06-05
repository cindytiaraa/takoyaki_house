// ═══════════════════════════════════════════
// TAKOYAKI HOUSE — js/admin/dashboard.js
// ═══════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
    initSPA();
    initDashboardOverview();
    initMenuManagement();
    initOrdersManagement();
    initMembersManagement();
    initArticlesManagement();
    initGlobalSearch();
});

// ───────────────────────────────────────────
// 1. SPA NAVIGATION
// ───────────────────────────────────────────
function initSPA() {
    const sidebarLinks = document.querySelectorAll(".sidebar-menu a");
    const sections = document.querySelectorAll(".page-section");
    const pageTitle = document.getElementById("pageTitle");

    sidebarLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const view = link.getAttribute("data-view");

            // Update active menu link
            sidebarLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // Update active content section
            sections.forEach(sec => {
                if (sec.getAttribute("data-view") === view) {
                    sec.classList.add("active");
                } else {
                    sec.classList.remove("active");
                }
            });

            // Update page title text
            const titleMap = {
                "dashboard": "Dashboard Overview",
                "menu-management": "Menu Management",
                "orders": "Kelola Transaksi",
                "members": "Kelola Pengguna",
                "articles": "Kelola Artikel"
            };
            pageTitle.textContent = titleMap[view] || "Admin Panel";

            // Trigger data refresh on tab load
            if (view === "dashboard") {
                renderDashboardStats();
            } else if (view === "menu-management") {
                renderMenuTable();
            } else if (view === "orders") {
                renderOrdersTable();
            } else if (view === "members") {
                renderMembersTable();
            } else if (view === "articles") {
                renderArticlesTable();
            }
        });
    });

    // View All button on Dashboard recent orders
    const viewAllOrdersBtn = document.querySelector(".view-menu-btn[data-view-target='orders']");
    if (viewAllOrdersBtn) {
        viewAllOrdersBtn.addEventListener("click", () => {
            const targetLink = document.querySelector(".sidebar-menu a[data-view='orders']");
            if (targetLink) targetLink.click();
        });
    }
}

// ───────────────────────────────────────────
// 2. DASHBOARD OVERVIEW
// ───────────────────────────────────────────
function initDashboardOverview() {
    renderDashboardStats();
}

function renderDashboardStats() {
    // 1. Calculate orders count
    const totalOrders = window.dummyOrders.length;
    document.getElementById("totalOrdersStat").textContent = totalOrders;
    document.getElementById("ordersTrend").textContent = `+${Math.round(totalOrders * 0.15)}%`;

    // 2. Calculate Completed Revenue
    let totalRevenue = 0;
    window.dummyOrders.forEach(o => {
        if (o.status === "Completed") {
            totalRevenue += o.totalPrice;
        }
    });
    document.getElementById("totalRevenueStat").textContent = `Rp ${totalRevenue.toLocaleString("id-ID")}`;
    document.getElementById("revenueTrend").textContent = `+${totalRevenue > 0 ? '8%' : '0%'}`;

    // 3. Members Count
    const membersList = window.dummyAccounts ? window.dummyAccounts.filter(a => a.role === "member") : [];
    document.getElementById("totalMembersStat").textContent = membersList.length;
    document.getElementById("membersTrend").textContent = `+${Math.round(membersList.length * 0.08)}%`;

    // 4. Best Seller & Popular Menu Calculation
    const productCounts = {};
    window.dummyOrders.forEach(o => {
        o.items.forEach(it => {
            productCounts[it.name] = (productCounts[it.name] || 0) + it.qty;
        });
    });

    let bestSeller = "-";
    let maxQty = 0;
    Object.entries(productCounts).forEach(([name, qty]) => {
        if (qty > maxQty) {
            maxQty = qty;
            bestSeller = name;
        }
    });
    document.getElementById("bestSellerStat").textContent = bestSeller;

    // 5. Render Popular Menu List (from local state products mapped with order count)
    const popularGrid = document.getElementById("popularMenuList");
    popularGrid.innerHTML = "";
    const menuSorted = window.dummyMenu.slice().map(m => {
        return {
            ...m,
            orderCount: productCounts[m.name] || 0
        };
    }).sort((a, b) => b.orderCount - a.orderCount).slice(0, 3);

    menuSorted.forEach(item => {
        const div = document.createElement("div");
        div.className = "popular-item";
        div.style.marginBottom = "15px";
        div.innerHTML = `
            <img src="${item.img}" onerror="this.src='https://placehold.co/70x70?text=Menu'">
            <div>
                <h4>${item.name}</h4>
                <p>${item.orderCount} Orders</p>
            </div>
        `;
        popularGrid.appendChild(div);
    });

    // 6. Render Recent Orders List (latest 3 orders)
    const recentList = document.getElementById("recentOrdersList");
    recentList.innerHTML = "";
    const latestOrders = window.dummyOrders.slice().reverse().slice(0, 3);

    latestOrders.forEach(ord => {
        const itemNames = ord.items.map(i => i.name).join(", ");
        const statusClass = ord.status.toLowerCase() === "completed" ? "success" : (ord.status.toLowerCase() === "cancelled" ? "logout-btn" : "pending");
        const div = document.createElement("div");
        div.className = "order-item";
        div.innerHTML = `
            <div>
                <h4>${ord.customerName}</h4>
                <p>${itemNames}</p>
            </div>
            <span class="${statusClass}" style="padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight:600; text-transform:capitalize;">
                ${ord.status}
            </span>
        `;
        recentList.appendChild(div);
    });
}

// ───────────────────────────────────────────
// 3. KELOLA PRODUK (MENU MANAGEMENT)
// ───────────────────────────────────────────
let editingProductId = null;

function initMenuManagement() {
    const addBtn = document.getElementById("addMenuBtn");
    const closeBtn = document.getElementById("closeProductModal");
    const modal = document.getElementById("productModal");
    const form = document.getElementById("productForm");
    const categoryFilter = document.getElementById("menuCategoryFilter");
    const refreshBtn = document.getElementById("refreshMenuBtn");

    addBtn.addEventListener("click", () => {
        editingProductId = null;
        form.reset();
        document.getElementById("productId").value = "";
        document.getElementById("productModalTitle").textContent = "Add Menu Item";
        modal.classList.add("open");
    });

    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("open"); });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("productId").value;
        const name = document.getElementById("productName").value.trim();
        const price = document.getElementById("productPrice").value.trim();
        const category = document.getElementById("productCategory").value;
        const badge = document.getElementById("productBadge").value.trim();
        const img = document.getElementById("productImg").value.trim();
        const desc = document.getElementById("productDesc").value.trim();
        const status = document.getElementById("productStatus").value;

        if (id) {
            // Edit mode
            const index = window.dummyMenu.findIndex(m => m.id === parseInt(id));
            if (index !== -1) {
                window.dummyMenu[index] = { id: parseInt(id), name, price, category, badge: badge || null, img, desc, status };
            }
        } else {
            // Create mode
            const newId = window.dummyMenu.length > 0 ? Math.max(...window.dummyMenu.map(m => m.id)) + 1 : 1;
            window.dummyMenu.push({ id: newId, name, price, category, badge: badge || null, img, desc, status });
        }

        window.saveMenu();
        modal.classList.remove("open");
        renderMenuTable();
        renderDashboardStats();
    });

    categoryFilter.addEventListener("change", renderMenuTable);
    refreshBtn.addEventListener("click", renderMenuTable);

    renderMenuTable();
}

function renderMenuTable() {
    const tableBody = document.getElementById("menuTableBody");
    const filter = document.getElementById("menuCategoryFilter").value;
    tableBody.innerHTML = "";

    const filtered = window.dummyMenu.filter(m => filter === "all" || m.category === filter);

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="menu-empty">Tidak ada produk dalam kategori ini.</td></tr>`;
        return;
    }

    filtered.forEach(item => {
        const tr = document.createElement("tr");
        const isAvailable = item.status === "available";
        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:12px;">
                    <img src="${item.img}" style="width:45px; height:45px; border-radius:10px; object-fit:cover;" onerror="this.src='https://placehold.co/45x45?text=Menu'">
                    <div>
                        <strong style="font-size:14px; color:var(--dashboard-text);">${item.name}</strong>
                        ${item.badge ? `<span style="font-size:10px; background:var(--dashboard-soft); color:var(--dashboard-accent); padding:2px 6px; border-radius:10px; margin-left:6px; font-weight:600;">${item.badge}</span>` : ""}
                        <p style="font-size:11px; color:var(--dashboard-muted); margin-top:2px;">${item.desc.substring(0, 48)}...</p>
                    </div>
                </div>
            </td>
            <td><span class="menu-badge" style="background:#e0f2fe; color:#0369a1;">${item.category}</span></td>
            <td><strong style="color:var(--dashboard-accent);">${item.price}</strong></td>
            <td>
                <span class="${isAvailable ? 'success' : 'pending'}" style="padding:6px 12px; border-radius:20px; font-size:12px; font-weight:600; display:inline-block;">
                    ${isAvailable ? 'Available' : 'Out of Stock'}
                </span>
            </td>
            <td>
                <div style="display:flex; gap:8px;">
                    <button class="menu-action-btn" onclick="editProduct(${item.id})">✏️ Edit</button>
                    <button class="menu-action-btn" style="background:#fef2f2; color:#ef4444;" onclick="deleteProduct(${item.id})">🗑️ Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

window.editProduct = (id) => {
    const item = window.dummyMenu.find(m => m.id === id);
    if (!item) return;

    document.getElementById("productId").value = item.id;
    document.getElementById("productName").value = item.name;
    document.getElementById("productPrice").value = item.price;
    document.getElementById("productCategory").value = item.category;
    document.getElementById("productBadge").value = item.badge || "";
    document.getElementById("productImg").value = item.img;
    document.getElementById("productDesc").value = item.desc;
    document.getElementById("productStatus").value = item.status;

    document.getElementById("productModalTitle").textContent = "Edit Menu Item";
    document.getElementById("productModal").classList.add("open");
};

window.deleteProduct = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus menu ini dari katalog?")) {
        const index = window.dummyMenu.findIndex(m => m.id === id);
        if (index !== -1) {
            window.dummyMenu.splice(index, 1);
            window.saveMenu();
            renderMenuTable();
            renderDashboardStats();
        }
    }
};

// ───────────────────────────────────────────
// 4. KELOLA TRANSAKSI (ORDERS)
// ───────────────────────────────────────────
function initOrdersManagement() {
    const statusFilter = document.getElementById("orderStatusFilter");
    const refreshBtn = document.getElementById("refreshOrdersBtn");

    statusFilter.addEventListener("change", renderOrdersTable);
    refreshBtn.addEventListener("click", renderOrdersTable);

    renderOrdersTable();
}

function renderOrdersTable() {
    const tableBody = document.getElementById("ordersTableBody");
    const filter = document.getElementById("orderStatusFilter").value;
    tableBody.innerHTML = "";

    const filtered = window.dummyOrders.filter(o => filter === "all" || o.status === filter);

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="menu-empty">Tidak ada transaksi terdaftar.</td></tr>`;
        return;
    }

    filtered.forEach(order => {
        const tr = document.createElement("tr");
        const itemsList = order.items.map(it => `${it.name} (${it.qty}x)`).join("<br>");
        const statusClass = order.status.toLowerCase() === "completed" ? "success" : (order.status.toLowerCase() === "cancelled" ? "logout-btn" : "pending");

        // Action buttons based on status
        let actionButtons = "";
        if (order.status === "Pending") {
            actionButtons = `
                <button class="menu-action-btn" style="background:#dcfce7; color:#15803d; margin-right:4px;" onclick="updateOrderStatus('${order.id}', 'Completed')">✅ Selesai</button>
                <button class="menu-action-btn" style="background:#fee2e2; color:#b91c1c;" onclick="updateOrderStatus('${order.id}', 'Cancelled')">❌ Batal</button>
            `;
        } else {
            actionButtons = `<span style="font-size:12px; color:var(--dashboard-muted); font-style:italic;">No Actions</span>`;
        }

        tr.innerHTML = `
            <td><strong>#${order.id}</strong></td>
            <td>
                <div style="font-size:14px; font-weight:600;">${order.customerName}</div>
                <div style="font-size:11px; color:var(--dashboard-muted);">${order.customerPhone}</div>
                ${order.note ? `<div style="font-size:10px; background:#fff8e1; color:#b78103; padding:2px 6px; border-radius:4px; margin-top:4px; display:inline-block;">📝 ${order.note}</div>` : ""}
            </td>
            <td style="font-size:13px; line-height:1.4;">${itemsList}</td>
            <td><strong style="color:var(--dashboard-accent);">Rp ${order.totalPrice.toLocaleString("id-ID")}</strong></td>
            <td style="font-size:12px; color:var(--dashboard-muted);">${order.date}</td>
            <td>
                <span class="${statusClass}" style="padding:6px 12px; border-radius:20px; font-size:12px; font-weight:600; text-transform:capitalize; display:inline-block;">
                    ${order.status}
                </span>
            </td>
            <td>
                <div style="display:flex;">
                    ${actionButtons}
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

window.updateOrderStatus = (orderId, newStatus) => {
    const order = window.dummyOrders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        window.saveOrders();
        renderOrdersTable();
        renderDashboardStats();
    }
};

// ───────────────────────────────────────────
// 5. KELOLA PENGGUNA (MEMBERS)
// ───────────────────────────────────────────
function initMembersManagement() {
    const statusFilter = document.getElementById("memberStatusFilter");
    const refreshBtn = document.getElementById("refreshMembersBtn");
    const modal = document.getElementById("memberEditModal");
    const closeBtn = document.getElementById("closeMemberModalBtn");
    const form = document.getElementById("memberForm");

    statusFilter.addEventListener("change", renderMembersTable);
    refreshBtn.addEventListener("click", renderMembersTable);

    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("open"); });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById("memberId").value);
        const name = document.getElementById("memberNameInput").value.trim();
        const email = document.getElementById("memberEmailInput").value.trim();
        const phone = document.getElementById("memberPhoneInput").value.trim();
        const membership = document.getElementById("memberMembershipInput").value;
        const points = parseInt(document.getElementById("memberPointsInput").value);
        const status = document.getElementById("memberStatusInput").value;

        const idx = window.dummyAccounts.findIndex(acc => acc.id === id);
        if (idx !== -1) {
            window.dummyAccounts[idx].name = name;
            window.dummyAccounts[idx].email = email;
            window.dummyAccounts[idx].phone = phone;
            window.dummyAccounts[idx].membership = membership;
            window.dummyAccounts[idx].points = points;
            window.dummyAccounts[idx].status = status;
            window.saveAccounts();
        }

        modal.classList.remove("open");
        renderMembersTable();
        renderDashboardStats();
    });

    renderMembersTable();
}

function renderMembersTable() {
    const tableBody = document.getElementById("membersTableBody");
    const filter = document.getElementById("memberStatusFilter").value;
    tableBody.innerHTML = "";

    const membersOnly = window.dummyAccounts ? window.dummyAccounts.filter(a => a.role === "member") : [];
    const filtered = membersOnly.filter(m => filter === "all" || m.status === filter);

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="menu-empty">Tidak ada member pengguna terdaftar.</td></tr>`;
        return;
    }

    filtered.forEach(m => {
        const tr = document.createElement("tr");
        const isAct = m.status === "active";
        const tierClass = m.membership.toLowerCase() === "gold" ? "background:#fef3c7; color:#d97706;" : (m.membership.toLowerCase() === "silver" ? "background:#f1f5f9; color:#475569;" : "background:#ffedd5; color:#c2410c;");

        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:36px; height:36px; border-radius:50%; background:var(--dashboard-soft); color:var(--dashboard-accent); font-weight:700; display:flex; align-items:center; justify-content:center;">
                        ${m.name.charAt(0)}
                    </div>
                    <strong>${m.name}</strong>
                </div>
            </td>
            <td>
                <div style="font-size:13px; color:var(--dashboard-text);">${m.email}</div>
                <div style="font-size:11px; color:var(--dashboard-muted);">${m.phone}</div>
            </td>
            <td><span class="menu-badge" style="${tierClass}">${m.membership}</span></td>
            <td><strong style="color:var(--dashboard-text);">${m.points} pts</strong></td>
            <td>
                <span class="${isAct ? 'success' : 'pending'}" style="padding:6px 12px; border-radius:20px; font-size:12px; font-weight:600; display:inline-block;">
                    ${isAct ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>
                <div style="display:flex; gap:8px;">
                    <button class="menu-action-btn" onclick="editMember(${m.id})">✏️ Edit</button>
                    <button class="menu-action-btn" style="background:#fef2f2; color:#ef4444;" onclick="deleteMember(${m.id})">🗑️ Hapus</button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

window.editMember = (id) => {
    const m = window.dummyAccounts.find(acc => acc.id === id);
    if (!m) return;

    document.getElementById("memberId").value = m.id;
    document.getElementById("memberNameInput").value = m.name;
    document.getElementById("memberEmailInput").value = m.email;
    document.getElementById("memberPhoneInput").value = m.phone;
    document.getElementById("memberMembershipInput").value = m.membership;
    document.getElementById("memberPointsInput").value = m.points;
    document.getElementById("memberStatusInput").value = m.status;

    document.getElementById("memberEditModal").classList.add("open");
};

window.deleteMember = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus member ini dari database?")) {
        const index = window.dummyAccounts.findIndex(acc => acc.id === id);
        if (index !== -1) {
            window.dummyAccounts.splice(index, 1);
            window.saveAccounts();
            renderMembersTable();
            renderDashboardStats();
        }
    }
};

// ───────────────────────────────────────────
// 6. KELOLA ARTIKEL
// ───────────────────────────────────────────
function initArticlesManagement() {
    const addBtn = document.getElementById("addArticleBtn");
    const closeBtn = document.getElementById("closeArticleModal");
    const modal = document.getElementById("articleModal");
    const form = document.getElementById("articleForm");
    const categoryFilter = document.getElementById("articleCategoryFilter");
    const refreshBtn = document.getElementById("refreshArticlesBtn");

    addBtn.addEventListener("click", () => {
        form.reset();
        document.getElementById("articleId").value = "";
        document.getElementById("articleModalTitle").textContent = "Add Article";
        modal.classList.add("open");
    });

    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("open"); });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("articleId").value;
        const title = document.getElementById("articleTitle").value.trim();
        const category = document.getElementById("articleCategory").value;
        const img = document.getElementById("articleImg").value.trim();
        const content = document.getElementById("articleContent").value.trim();
        const status = document.getElementById("articleStatus").value;

        if (id) {
            // Edit
            const index = window.dummyArticles.findIndex(a => a.id === parseInt(id));
            if (index !== -1) {
                window.dummyArticles[index] = {
                    id: parseInt(id),
                    title,
                    category,
                    image: img,
                    content,
                    date: window.dummyArticles[index].date,
                    status
                };
            }
        } else {
            // Create
            const newId = window.dummyArticles.length > 0 ? Math.max(...window.dummyArticles.map(a => a.id)) + 1 : 1;
            const today = new Date().toISOString().split('T')[0];
            window.dummyArticles.push({
                id: newId,
                title,
                category,
                image: img,
                content,
                date: today,
                status
            });
        }

        window.saveArticles();
        modal.classList.remove("open");
        renderArticlesTable();
    });

    categoryFilter.addEventListener("change", renderArticlesTable);
    refreshBtn.addEventListener("click", renderArticlesTable);

    renderArticlesTable();
}

function renderArticlesTable() {
    const tableBody = document.getElementById("articlesTableBody");
    const filter = document.getElementById("articleCategoryFilter").value;
    tableBody.innerHTML = "";

    const filtered = window.dummyArticles.filter(a => filter === "all" || a.category === filter);

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="menu-empty">Tidak ada artikel diterbitkan.</td></tr>`;
        return;
    }

    filtered.forEach(art => {
        const tr = document.createElement("tr");
        const isPub = art.status === "Published";

        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:12px;">
                    <img src="${art.image}" style="width:50px; height:35px; border-radius:6px; object-fit:cover;" onerror="this.src='https://placehold.co/50x35?text=Blog'">
                    <div style="max-width:320px;">
                        <strong style="font-size:14px; color:var(--dashboard-text); display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                            ${art.title}
                        </strong>
                        <span style="font-size:11px; color:var(--dashboard-muted);">${art.content.substring(0, 50)}...</span>
                    </div>
                </div>
            </td>
            <td><span class="menu-badge" style="background:#f3e8ff; color:#7e22ce;">${art.category}</span></td>
            <td style="font-size:12px; color:var(--dashboard-muted);">${art.date}</td>
            <td>
                <span class="${isPub ? 'success' : 'pending'}" style="padding:6px 12px; border-radius:20px; font-size:12px; font-weight:600; display:inline-block;">
                    ${art.status}
                </span>
            </td>
            <td>
                <div style="display:flex; gap:8px;">
                    <button class="menu-action-btn" onclick="editArticle(${art.id})">✏️ Edit</button>
                    <button class="menu-action-btn" style="background:#fef2f2; color:#ef4444;" onclick="deleteArticle(${art.id})">🗑️ Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

window.editArticle = (id) => {
    const art = window.dummyArticles.find(a => a.id === id);
    if (!art) return;

    document.getElementById("articleId").value = art.id;
    document.getElementById("articleTitle").value = art.title;
    document.getElementById("articleCategory").value = art.category;
    document.getElementById("articleImg").value = art.image;
    document.getElementById("articleContent").value = art.content;
    document.getElementById("articleStatus").value = art.status;

    document.getElementById("articleModalTitle").textContent = "Edit Article";
    document.getElementById("articleModal").classList.add("open");
};

window.deleteArticle = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
        const index = window.dummyArticles.findIndex(a => a.id === id);
        if (index !== -1) {
            window.dummyArticles.splice(index, 1);
            window.saveArticles();
            renderArticlesTable();
        }
    }
};

// ───────────────────────────────────────────
// 7. GLOBAL SEARCH
// ───────────────────────────────────────────
function initGlobalSearch() {
    const searchInput = document.getElementById("dashboardSearch");

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        const activeLink = document.querySelector(".sidebar-menu a.active");
        const activeView = activeLink ? activeLink.getAttribute("data-view") : "dashboard";

        if (activeView === "menu-management") {
            const tableBody = document.getElementById("menuTableBody");
            const filter = document.getElementById("menuCategoryFilter").value;
            tableBody.innerHTML = "";

            const filtered = window.dummyMenu.filter(m => {
                const matchesCat = filter === "all" || m.category === filter;
                const matchesQuery = m.name.toLowerCase().includes(query) || m.desc.toLowerCase().includes(query);
                return matchesCat && matchesQuery;
            });

            if (filtered.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5" class="menu-empty">No matching products found.</td></tr>`;
                return;
            }

            filtered.forEach(item => {
                const tr = document.createElement("tr");
                const isAvailable = item.status === "available";
                tr.innerHTML = `
                    <td>
                        <div style="display:flex; align-items:center; gap:12px;">
                            <img src="${item.img}" style="width:45px; height:45px; border-radius:10px; object-fit:cover;" onerror="this.src='https://placehold.co/45x45?text=Menu'">
                            <div>
                                <strong style="font-size:14px; color:var(--dashboard-text);">${item.name}</strong>
                                ${item.badge ? `<span style="font-size:10px; background:var(--dashboard-soft); color:var(--dashboard-accent); padding:2px 6px; border-radius:10px; margin-left:6px; font-weight:600;">${item.badge}</span>` : ""}
                                <p style="font-size:11px; color:var(--dashboard-muted); margin-top:2px;">${item.desc.substring(0, 48)}...</p>
                            </div>
                        </div>
                    </td>
                    <td><span class="menu-badge" style="background:#e0f2fe; color:#0369a1;">${item.category}</span></td>
                    <td><strong style="color:var(--dashboard-accent);">${item.price}</strong></td>
                    <td>
                        <span class="${isAvailable ? 'success' : 'pending'}" style="padding:6px 12px; border-radius:20px; font-size:12px; font-weight:600; display:inline-block;">
                            ${isAvailable ? 'Available' : 'Out of Stock'}
                        </span>
                    </td>
                    <td>
                        <div style="display:flex; gap:8px;">
                            <button class="menu-action-btn" onclick="editProduct(${item.id})">✏️ Edit</button>
                            <button class="menu-action-btn" style="background:#fef2f2; color:#ef4444;" onclick="deleteProduct(${item.id})">🗑️ Delete</button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        } else if (activeView === "orders") {
            const tableBody = document.getElementById("ordersTableBody");
            const filter = document.getElementById("orderStatusFilter").value;
            tableBody.innerHTML = "";

            const filtered = window.dummyOrders.filter(o => {
                const matchesStatus = filter === "all" || o.status === filter;
                const matchesQuery = o.id.toLowerCase().includes(query) || o.customerName.toLowerCase().includes(query) || o.customerPhone.includes(query);
                return matchesStatus && matchesQuery;
            });

            if (filtered.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="7" class="menu-empty">No matching orders found.</td></tr>`;
                return;
            }

            filtered.forEach(order => {
                const tr = document.createElement("tr");
                const itemsList = order.items.map(it => `${it.name} (${it.qty}x)`).join("<br>");
                const statusClass = order.status.toLowerCase() === "completed" ? "success" : (order.status.toLowerCase() === "cancelled" ? "logout-btn" : "pending");

                let actionButtons = "";
                if (order.status === "Pending") {
                    actionButtons = `
                        <button class="menu-action-btn" style="background:#dcfce7; color:#15803d; margin-right:4px;" onclick="updateOrderStatus('${order.id}', 'Completed')">✅ Selesai</button>
                        <button class="menu-action-btn" style="background:#fee2e2; color:#b91c1c;" onclick="updateOrderStatus('${order.id}', 'Cancelled')">❌ Batal</button>
                    `;
                } else {
                    actionButtons = `<span style="font-size:12px; color:var(--dashboard-muted); font-style:italic;">No Actions</span>`;
                }

                tr.innerHTML = `
                    <td><strong>#${order.id}</strong></td>
                    <td>
                        <div style="font-size:14px; font-weight:600;">${order.customerName}</div>
                        <div style="font-size:11px; color:var(--dashboard-muted);">${order.customerPhone}</div>
                    </td>
                    <td style="font-size:13px; line-height:1.4;">${itemsList}</td>
                    <td><strong style="color:var(--dashboard-accent);">Rp ${order.totalPrice.toLocaleString("id-ID")}</strong></td>
                    <td style="font-size:12px; color:var(--dashboard-muted);">${order.date}</td>
                    <td>
                        <span class="${statusClass}" style="padding:6px 12px; border-radius:20px; font-size:12px; font-weight:600; text-transform:capitalize; display:inline-block;">
                            ${order.status}
                        </span>
                    </td>
                    <td><div style="display:flex;">${actionButtons}</div></td>
                `;
                tableBody.appendChild(tr);
            });
        } else if (activeView === "members") {
            const tableBody = document.getElementById("membersTableBody");
            const filter = document.getElementById("memberStatusFilter").value;
            tableBody.innerHTML = "";

            const membersOnly = window.dummyAccounts ? window.dummyAccounts.filter(a => a.role === "member") : [];
            const filtered = membersOnly.filter(m => {
                const matchesStatus = filter === "all" || m.status === filter;
                const matchesQuery = m.name.toLowerCase().includes(query) || m.email.toLowerCase().includes(query) || m.phone.includes(query);
                return matchesStatus && matchesQuery;
            });

            if (filtered.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="6" class="menu-empty">No matching members found.</td></tr>`;
                return;
            }

            filtered.forEach(m => {
                const tr = document.createElement("tr");
                const isAct = m.status === "active";
                const tierClass = m.membership.toLowerCase() === "gold" ? "background:#fef3c7; color:#d97706;" : (m.membership.toLowerCase() === "silver" ? "background:#f1f5f9; color:#475569;" : "background:#ffedd5; color:#c2410c;");

                tr.innerHTML = `
                    <td>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <div style="width:36px; height:36px; border-radius:50%; background:var(--dashboard-soft); color:var(--dashboard-accent); font-weight:700; display:flex; align-items:center; justify-content:center;">
                                ${m.name.charAt(0)}
                            </div>
                            <strong>${m.name}</strong>
                        </div>
                    </td>
                    <td>
                        <div style="font-size:13px; color:var(--dashboard-text);">${m.email}</div>
                        <div style="font-size:11px; color:var(--dashboard-muted);">${m.phone}</div>
                    </td>
                    <td><span class="menu-badge" style="${tierClass}">${m.membership}</span></td>
                    <td><strong style="color:var(--dashboard-text);">${m.points} pts</strong></td>
                    <td>
                        <span class="${isAct ? 'success' : 'pending'}" style="padding:6px 12px; border-radius:20px; font-size:12px; font-weight:600; display:inline-block;">
                            ${isAct ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                    <td>
                        <div style="display:flex; gap:8px;">
                            <button class="menu-action-btn" onclick="editMember(${m.id})">✏️ Edit</button>
                            <button class="menu-action-btn" style="background:#fef2f2; color:#ef4444;" onclick="deleteMember(${m.id})">🗑️ Hapus</button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        } else if (activeView === "articles") {
            const tableBody = document.getElementById("articlesTableBody");
            const filter = document.getElementById("articleCategoryFilter").value;
            tableBody.innerHTML = "";

            const filtered = window.dummyArticles.filter(a => {
                const matchesCat = filter === "all" || a.category === filter;
                const matchesQuery = a.title.toLowerCase().includes(query) || a.content.toLowerCase().includes(query);
                return matchesCat && matchesQuery;
            });

            if (filtered.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5" class="menu-empty">No matching articles found.</td></tr>`;
                return;
            }

            filtered.forEach(art => {
                const tr = document.createElement("tr");
                const isPub = art.status === "Published";

                tr.innerHTML = `
                    <td>
                        <div style="display:flex; align-items:center; gap:12px;">
                            <img src="${art.image}" style="width:50px; height:35px; border-radius:6px; object-fit:cover;" onerror="this.src='https://placehold.co/50x35?text=Blog'">
                            <div style="max-width:320px;">
                                <strong style="font-size:14px; color:var(--dashboard-text); display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                    ${art.title}
                                </strong>
                                <span style="font-size:11px; color:var(--dashboard-muted);">${art.content.substring(0, 50)}...</span>
                            </div>
                        </div>
                    </td>
                    <td><span class="menu-badge" style="background:#f3e8ff; color:#7e22ce;">${art.category}</span></td>
                    <td style="font-size:12px; color:var(--dashboard-muted);">${art.date}</td>
                    <td>
                        <span class="${isPub ? 'success' : 'pending'}" style="padding:6px 12px; border-radius:20px; font-size:12px; font-weight:600; display:inline-block;">
                            ${art.status}
                        </span>
                    </td>
                    <td>
                        <div style="display:flex; gap:8px;">
                            <button class="menu-action-btn" onclick="editArticle(${art.id})">✏️ Edit</button>
                            <button class="menu-action-btn" style="background:#fef2f2; color:#ef4444;" onclick="deleteArticle(${art.id})">🗑️ Delete</button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        }
    });
}
