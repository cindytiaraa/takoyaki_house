document.addEventListener("DOMContentLoaded", () => {

    initOrdersManagement();

});

function initOrdersManagement() {

    renderOrdersTable();

    document
        .getElementById("orderStatusFilter")
        .addEventListener(
            "change",
            renderOrdersTable
        );

    document
        .getElementById("refreshOrdersBtn")
        .addEventListener(
            "click",
            renderOrdersTable
        );

}

function renderOrdersTable() {

    const filter =
        document.getElementById(
            "orderStatusFilter"
        ).value;

    const tbody =
        document.getElementById(
            "ordersTableBody"
        );

    tbody.innerHTML = "";

    const filtered =
        window.dummyOrders.filter(order => {

            return filter === "all"
                || order.status === filter;

        });

    if(filtered.length === 0){

        tbody.innerHTML = `
        <tr>
            <td colspan="7">
                Tidak ada transaksi
            </td>
        </tr>
        `;

        return;
    }

    filtered.forEach(order => {

        const items =
            order.items
                .map(item =>
                    `${item.name} (${item.qty}x)`
                )
                .join("<br>");

        const statusClass =
            order.status === "Completed"
                ? "success"
                : order.status === "Cancelled"
                ? "danger"
                : "pending";

        let actionButtons = "";

        if(order.status === "Pending"){

            actionButtons = `
                <button
                    class="complete-btn"
                    onclick="
                    updateOrderStatus(
                    '${order.id}',
                    'Completed'
                    )">

                    Selesai

                </button>

                <button
                    class="cancel-btn"
                    onclick="
                    updateOrderStatus(
                    '${order.id}',
                    'Cancelled'
                    )">

                    Batal

                </button>
            `;
        }
        else{

            actionButtons = `
                <span class="no-action">
                    No Action
                </span>
            `;
        }

        tbody.innerHTML += `

        <tr>

            <td>
                #${order.id}
            </td>

            <td>

                <strong>
                    ${order.customerName}
                </strong>

                <br>

                ${order.customerPhone}

            </td>

            <td>
                ${items}
            </td>

            <td>

                Rp
                ${order.totalPrice.toLocaleString("id-ID")}

            </td>

            <td>
                ${order.date}
            </td>

            <td>

                <span class="${statusClass}">
                    ${order.status}
                </span>

            </td>

            <td>
                ${actionButtons}
            </td>

        </tr>
        `;
    });
}

function updateOrderStatus(
    orderId,
    newStatus
){

    const order =
        window.dummyOrders.find(
            item =>
            item.id === orderId
        );

    if(!order) return;

    order.status = newStatus;

    if(window.saveOrders){
        window.saveOrders();
    }

    renderOrdersTable();
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