document.addEventListener(
    "DOMContentLoaded",
    initMembersManagement
);

function initMembersManagement(){

    renderMembersTable();

    document
        .getElementById("memberStatusFilter")
        .addEventListener(
            "change",
            renderMembersTable
        );

    document
        .getElementById("refreshMembersBtn")
        .addEventListener(
            "click",
            renderMembersTable
        );

    document
        .getElementById("closeMemberModalBtn")
        .addEventListener(
            "click",
            closeMemberModal
        );

    document
        .getElementById("memberForm")
        .addEventListener(
            "submit",
            saveMember
        );
}

function renderMembersTable() {

    const tbody = document.getElementById("membersTableBody");

    const filter =
        document.getElementById("memberStatusFilter").value;

    tbody.innerHTML = "";

    const members =
        window.dummyAccounts.filter(account => {

            return account.role === "member";

        });

    const filtered =
        members.filter(member => {

            return filter === "all"
                || member.status === filter;

        });

    if (filtered.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    Tidak ada data member
                </td>
            </tr>
        `;

        return;
    }

    filtered.forEach(member => {

        tbody.innerHTML += `
        <tr>

            <td>
                ${member.name}
            </td>

            <td>
                <div>${member.email}</div>
                <small>${member.phone}</small>
            </td>

            <td>
                ${member.membership || "-"}
            </td>

            <td>
                ${member.points || 0}
            </td>

            <td>
                <span class="${
                    member.status === "active"
                        ? "success"
                        : "pending"
                }">
                    ${member.status}
                </span>
            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editMember(${member.id})">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteMember(${member.id})">

                    Hapus

                </button>

            </td>

        </tr>
        `;
    });
}

function editMember(id){

    const member =
        window.dummyAccounts.find(
            account => account.id === id
        );

    if(!member) return;

    document.getElementById("memberId").value = member.id;
    document.getElementById("memberNameInput").value = member.name;
    document.getElementById("memberEmailInput").value = member.email;
    document.getElementById("memberPhoneInput").value = member.phone;
    document.getElementById("memberMembershipInput").value = member.membership;
    document.getElementById("memberPointsInput").value = member.points;
    document.getElementById("memberStatusInput").value = member.status;

    document
        .getElementById("memberEditModal")
        .classList
        .add("open");
}

function closeMemberModal(){

    document
        .getElementById("memberEditModal")
        .classList
        .remove("open");
}

function saveMember(e){

    e.preventDefault();

    const id =
        parseInt(
            document.getElementById(
                "memberId"
            ).value
        );

    const index =
        window.dummyAccounts.findIndex(
            member =>
            member.id === id
        );

    if(index === -1) return;

    window.dummyAccounts[index].name =
    document.getElementById(
        "memberNameInput"
    ).value;

    window.dummyAccounts[index].email =
        document.getElementById(
            "memberEmailInput"
        ).value;

    window.dummyAccounts[index].phone =
        document.getElementById(
            "memberPhoneInput"
        ).value;

    window.dummyAccounts[index].membership =
        document.getElementById(
            "memberMembershipInput"
        ).value;

    window.dummyAccounts[index].points =
        parseInt(
            document.getElementById(
                "memberPointsInput"
            ).value
        );

    window.dummyAccounts[index].status =
        document.getElementById(
            "memberStatusInput"
        ).value;

    saveAccounts();
    closeMemberModal();
    renderMembersTable();
}

function deleteMember(id){

    if(!confirm("Hapus member?")){
        return;
    }

    const index =
        window.dummyAccounts.findIndex(
            member =>
            member.id === id
        );

    if(index !== -1){

        window.dummyAccounts.splice(
            index,
            1
        );

        if(window.saveAccounts){
            window.saveAccounts();
        }

        renderMembersTable();
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