const DEFAULT_ACCOUNTS = [

    // =====================
    // ADMIN
    // =====================

    {
        id: 1,
        role: "admin",
        name: "Administrator",
        email: "admin@gmail.com",
        password: "123456",
        phone: "081234567890",
        status: "active"
    },


    // =====================
    // MEMBER
    // =====================

    {
        id: 2,
        role: "member",
        name: "Cindy Tiara",
        email: "cindy@gmail.com",
        password: "123456",
        phone: "081298765432",
        membership: "Gold",
        points: 240,
        favoriteMenu: "Cheese Melt Takoyaki",
        status: "active"
    },

    {
        id: 3,
        role: "member",
        name: "Ryo Barata",
        email: "ryo@gmail.com",
        password: "123456",
        phone: "081355555555",
        membership: "Bronze",
        points: 80,
        favoriteMenu: "Matcha Latte",
        status: "active"
    }
];

function loadAccounts() {
    try {
        const stored = localStorage.getItem('accounts');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (err) {
        console.warn('Gagal membaca accounts dari localStorage', err);
    }
    return DEFAULT_ACCOUNTS.slice();
}

const dummyAccounts = loadAccounts();

function saveAccounts() {
    try {
        localStorage.setItem('accounts', JSON.stringify(dummyAccounts));
    } catch (err) {
        console.warn('Gagal menyimpan accounts ke localStorage', err);
    }
}

// Expose to global so other scripts (login/register) can access and modify
window.dummyAccounts = dummyAccounts;
window.saveAccounts = saveAccounts;

