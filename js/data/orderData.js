const DEFAULT_ORDERS = [
    {
        id: "TX-9021",
        customerName: "Cindy Tiara",
        customerPhone: "081298765432",
        items: [
            { name: "Takoyaki Cheese", qty: 2, price: 18000 }
        ],
        totalPrice: 36000,
        date: "2026-06-05 18:30:10",
        note: "Saus keju dipisah ya",
        status: "Completed"
    },
    {
        id: "TX-9022",
        customerName: "Ayu Pratiwi",
        customerPhone: "081234567890",
        items: [
            { name: "Matcha Latte", qty: 1, price: 16000 },
            { name: "Takoyaki Original", qty: 1, price: 15000 }
        ],
        totalPrice: 31000,
        date: "2026-06-05 19:15:22",
        note: "Mayo agak banyakan",
        status: "Pending"
    },
    {
        id: "TX-9023",
        customerName: "Budi Santoso",
        customerPhone: "081388888888",
        items: [
            { name: "Takoyaki Mix", qty: 2, price: 22000 }
        ],
        totalPrice: 44000,
        date: "2026-06-04 14:02:11",
        note: "",
        status: "Completed"
    },
    {
        id: "TX-9024",
        customerName: "Ryo Barata",
        customerPhone: "081355555555",
        items: [
            { name: "Takoyaki Spicy", qty: 1, price: 17000 },
            { name: "Boba Milk Tea", qty: 1, price: 15000 }
        ],
        totalPrice: 32000,
        date: "2026-06-05 20:01:00",
        note: "Takoyaki level 5 super pedas!",
        status: "Pending"
    }
];

function loadOrders() {
    try {
        const stored = localStorage.getItem('orders');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (err) {
        console.warn('Gagal membaca orders dari localStorage', err);
    }
    return DEFAULT_ORDERS.slice();
}

const dummyOrders = loadOrders();

function saveOrders() {
    try {
        localStorage.setItem('orders', JSON.stringify(dummyOrders));
    } catch (err) {
        console.warn('Gagal menyimpan orders ke localStorage', err);
    }
}

// Expose to global
window.dummyOrders = dummyOrders;
window.saveOrders = saveOrders;
