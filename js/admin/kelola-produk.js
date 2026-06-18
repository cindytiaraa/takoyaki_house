document.addEventListener("DOMContentLoaded", () => {

    initMenuManagement();
});

function initMenuManagement() {

    renderMenuTable();

    document
        .getElementById("menuCategoryFilter")
        .addEventListener(
            "change",
            renderMenuTable
        );

    document
        .getElementById("refreshMenuBtn")
        .addEventListener(
            "click",
            renderMenuTable
        );

    document
        .getElementById("addMenuBtn")
        .addEventListener(
            "click",
            openAddModal
        );

    document
        .getElementById("closeProductModal")
        .addEventListener(
            "click",
            closeModal
        );

    document
        .getElementById("productForm")
        .addEventListener(
            "submit",
            saveProduct
        );
}

function renderMenuTable() {

    const filter =
        document.getElementById(
            "menuCategoryFilter"
        ).value;

    const tbody =
        document.getElementById(
            "menuTableBody"
        );

    tbody.innerHTML = "";

    const filtered =
        window.dummyMenu.filter(menu =>
            filter === "all"
            || menu.category === filter
        );

    filtered.forEach(item => {

        tbody.innerHTML += `
        <tr>

            <td>${item.name}</td>

            <td>${item.category}</td>

            <td>${item.price}</td>

            <td>
                ${item.status}
            </td>

            <td>

                <button
                    class="menu-action-btn"
                    onclick="editProduct(${item.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteProduct(${item.id})">
                    Delete
                </button>

            </td>

        </tr>
        `;
    });

}

function openAddModal() {

    document
        .getElementById("productForm")
        .reset();

    document
        .getElementById("productModal")
        .classList
        .add("open");

}

function closeModal() {

    document
        .getElementById("productModal")
        .classList
        .remove("open");

}

function saveProduct(e) {

    e.preventDefault();

    alert("Save Product");

    closeModal();
}

function editProduct(id) {

    const product =
        window.dummyMenu.find(
            menu => menu.id === id
        );

    if (!product) return;

    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productBadge").value = product.badge || "";
    document.getElementById("productImg").value = product.img;
    document.getElementById("productDesc").value = product.desc;
    document.getElementById("productStatus").value = product.status;

    document
        .getElementById("productModal")
        .classList
        .add("open");
}

function deleteProduct(id) {

    if(confirm("Hapus produk?")){

        const index =
            window.dummyMenu.findIndex(
                menu => menu.id === id
            );

        if(index !== -1){

            window.dummyMenu.splice(index,1);

            renderMenuTable();
        }
    }
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