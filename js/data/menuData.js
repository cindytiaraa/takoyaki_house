const DEFAULT_MENU = [
    {
        id: 1,
        name: "Takoyaki Original",
        desc: "Gurita segar, saus okonomiyaki, mayo & bonito",
        price: "Rp 15.000",
        category: "Takoyaki",
        badge: "Terlaris",
        img: "https://i.pinimg.com/736x/37/c3/cb/37c3cb99aa3054e970036fa4bb50ad95.jpg",
        status: "available"
    },
    {
        id: 2,
        name: "Takoyaki Cheese",
        desc: "Lelehan keju mozzarella di atas takoyaki original",
        price: "Rp 18.000",
        category: "Takoyaki",
        badge: "Favorit",
        img: "https://i.pinimg.com/736x/fe/58/0c/fe580c83a433505a674e19b1a835ab2b.jpg",
        status: "available"
    },
    {
        id: 3,
        name: "Takoyaki Spicy",
        desc: "Level pedas bisa disesuaikan, cocok buat yang berani",
        price: "Rp 17.000",
        category: "Takoyaki",
        badge: "🌶 Panas",
        img: "https://i.pinimg.com/736x/55/e8/37/55e8379c9c8ef79ba132402d24b693b1.jpg",
        status: "available"
    },
    {
        id: 4,
        name: "Dimsum Premium",
        desc: "Dimsum isi daging sapi premium dengan saus pedas manis",
        price: "Rp 20.000",
        category: "Side Menu",
        badge: "Baru",
        img: "https://i.pinimg.com/736x/0e/0d/a5/0e0da52ce8779a550e541809ee287fa0.jpg",
        status: "available"
    },
    {
        id: 5,
        name: "Matcha Latte",
        desc: "Green tea premium dengan susu segar, dingin menyegarkan",
        price: "Rp 16.000",
        category: "Drinks",
        badge: null,
        img: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&q=80",
        status: "available"
    },
    {
        id: 6,
        name: "Yuzu Lemonade",
        desc: "Lemon segar dengan citrus yuzu khas Jepang, served cold",
        price: "Rp 14.000",
        category: "Drinks",
        badge: null,
        img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&q=80",
        status: "available"
    },
    {
        id: 7,
        name: "Takoyaki Mix",
        desc: "Kombinasi 3 rasa: original, cheese & spicy dalam satu porsi",
        price: "Rp 22.000",
        category: "Takoyaki",
        badge: "Value",
        img: "https://i.pinimg.com/736x/fe/58/0c/fe580c83a433505a674e19b1a835ab2b.jpg",
        status: "available"
    },
    {
        id: 8,
        name: "Boba Milk Tea",
        desc: "Teh susu dengan tapioca pearl kenyal, dingin & manis",
        price: "Rp 15.000",
        category: "Drinks",
        badge: null,
        img: "https://i.pinimg.com/1200x/c5/b6/cc/c5b6cc29f5620edb28be371b49d3395b.jpg",
        status: "available"
    }
];

function loadMenu() {
    try {
        const stored = localStorage.getItem('products');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (err) {
        console.warn('Gagal membaca products dari localStorage', err);
    }
    return DEFAULT_MENU.slice();
}

const dummyMenu = loadMenu();

function saveMenu() {
    try {
        localStorage.setItem('products', JSON.stringify(dummyMenu));
    } catch (err) {
        console.warn('Gagal menyimpan products ke localStorage', err);
    }
}

// Expose to global
window.dummyMenu = dummyMenu;
window.saveMenu = saveMenu;
