document.addEventListener("DOMContentLoaded", () => {

    renderDashboardStats();

});

function renderDashboardStats() {

    const totalOrders = window.dummyOrders.length;

    document.getElementById("totalOrdersStat").textContent =
        totalOrders;

    document.getElementById("ordersTrend").textContent =
        `+${Math.round(totalOrders * 0.15)}%`;

    let totalRevenue = 0;

    window.dummyOrders.forEach(order => {

        if (order.status === "Completed") {
            totalRevenue += order.totalPrice;
        }

    });

    document.getElementById("totalRevenueStat").textContent =
        `Rp ${totalRevenue.toLocaleString("id-ID")}`;

    document.getElementById("revenueTrend").textContent =
        `+${totalRevenue > 0 ? "8%" : "0%"}`;

    const members =
        window.dummyAccounts.filter(
            account => account.role === "member"
        );

    document.getElementById("totalMembersStat").textContent =
        members.length;

    document.getElementById("membersTrend").textContent =
        `+${Math.round(members.length * 0.08)}%`;

    const productCounts = {};

    window.dummyOrders.forEach(order => {

        order.items.forEach(item => {

            productCounts[item.name] =
                (productCounts[item.name] || 0) + item.qty;

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

    document.getElementById("bestSellerStat").textContent =
        bestSeller;

    renderPopularMenu(productCounts);

    renderRecentOrders();
}

function renderPopularMenu(productCounts) {

    const container =
        document.getElementById("popularMenuList");

    container.innerHTML = "";

    const menuSorted =
        window.dummyMenu
            .map(menu => ({
                ...menu,
                orderCount:
                    productCounts[menu.name] || 0
            }))
            .sort((a, b) =>
                b.orderCount - a.orderCount
            )
            .slice(0, 3);

    menuSorted.forEach(item => {

        container.innerHTML += `
            <div class="popular-item">

                <img src="${item.img}">

                <div>
                    <h4>${item.name}</h4>
                    <p>${item.orderCount} Orders</p>
                </div>

            </div>
        `;
    });
}

function renderRecentOrders() {

    const container =
        document.getElementById("recentOrdersList");

    container.innerHTML = "";

    const latestOrders =
        window.dummyOrders
            .slice()
            .reverse()
            .slice(0, 3);

    latestOrders.forEach(order => {

        const items =
            order.items
                .map(item => item.name)
                .join(", ");

        const statusClass =
            order.status === "Completed"
                ? "success"
                : "pending";

        container.innerHTML += `
            <div class="order-item">

                <div>
                    <h4>${order.customerName}</h4>
                    <p>${items}</p>
                </div>

                <span class="${statusClass}">
                    ${order.status}
                </span>

            </div>
        `;
    });
}

// =========================
// LOGOUT
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const logoutBtn =
        document.querySelector(".logout-btn");

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {

        const confirmLogout =
            confirm("Yakin ingin logout?");

        if (!confirmLogout) return;

        localStorage.removeItem("currentUser");

        window.location.href =
            "../auth/login.html";

    });

});