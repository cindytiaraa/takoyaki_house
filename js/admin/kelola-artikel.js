document.addEventListener(
    "DOMContentLoaded",
    initArticlesManagement
);

function initArticlesManagement(){

    renderArticlesTable();

    document
        .getElementById("addArticleBtn")
        .addEventListener(
            "click",
            openArticleModal
        );

    document
        .getElementById("closeArticleModal")
        .addEventListener(
            "click",
            closeArticleModal
        );

    document
        .getElementById("refreshArticlesBtn")
        .addEventListener(
            "click",
            renderArticlesTable
        );

    document
        .getElementById("articleCategoryFilter")
        .addEventListener(
            "change",
            renderArticlesTable
        );

    document
        .getElementById("articleForm")
        .addEventListener(
            "submit",
            saveArticle
        );
}

function renderArticlesTable(){

    const filter =
        document.getElementById(
            "articleCategoryFilter"
        ).value;

    const tbody =
        document.getElementById(
            "articlesTableBody"
        );

    tbody.innerHTML = "";

    const filtered =
        window.dummyArticles.filter(
            article =>

            filter === "all"
            || article.category === filter
        );

    filtered.forEach(article => {

        tbody.innerHTML += `
        <tr>

            <td>
                <strong>
                    ${article.title}
                </strong>
            </td>

            <td>
                ${article.category}
            </td>

            <td>
                ${article.date}
            </td>

            <td>
                ${article.status}
            </td>

            <td>
                <button
                    class="edit-btn"
                    onclick="editArticle(${article.id})">

                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteArticle(${article.id})">

                    Delete
                </button>

            </td>

        </tr>
        `;
    });
}

function openArticleModal(){

    document
        .getElementById("articleForm")
        .reset();

    document
        .getElementById("articleId")
        .value = "";

    document
        .getElementById("articleModalTitle")
        .textContent = "Add Article";

    document
        .getElementById("articleModal")
        .classList
        .add("open");
}

function closeArticleModal(){

    document
        .getElementById("articleModal")
        .classList
        .remove("open");
}

function editArticle(id){

    const article =
        window.dummyArticles.find(
            item => item.id === id
        );

    if(!article) return;

    document.getElementById("articleId").value = article.id;
    document.getElementById("articleTitle").value = article.title;
    document.getElementById("articleCategory").value = article.category;
    document.getElementById("articleImg").value = article.image;
    document.getElementById("articleContent").value = article.content;
    document.getElementById("articleStatus").value = article.status;

    document
        .getElementById("articleModalTitle")
        .textContent = "Edit Article";

    document
        .getElementById("articleModal")
        .classList
        .add("open");
}

function saveArticle(e){

    e.preventDefault();

    alert("Save Article");

    closeArticleModal();

    renderArticlesTable();
}

function deleteArticle(id){

    if(!confirm("Hapus artikel?")){
        return;
    }

    const index =
        window.dummyArticles.findIndex(
            article =>
            article.id === id
        );

    if(index !== -1){

        window.dummyArticles.splice(
            index,
            1
        );

        if(window.saveArticles){
            window.saveArticles();
        }

        renderArticlesTable();
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