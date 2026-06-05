const DEFAULT_ARTICLES = [
    {
        id: 1,
        title: "Rahasia Kulit Crispy Takoyaki Khas Tokyo",
        content: "Banyak orang bertanya-tanya, bagaimana cara membuat kulit takoyaki yang garing di luar namun tetap lembut meleleh di dalam. Kuncinya terletak pada wajan besi panas yang telah diolesi minyak dengan merata dan racikan adonan cair dengan perbandingan air-tepung yang tepat. Di Takoyaki House, kami memanggangnya dengan wajan tradisional Jepang yang diimpor langsung demi menjaga cita rasa autentik.",
        image: "https://i.pinimg.com/736x/37/c3/cb/37c3cb99aa3054e970036fa4bb50ad95.jpg",
        category: "Tips & Trik",
        date: "2026-06-03",
        status: "Published"
    },
    {
        id: 2,
        title: "Manfaat Gurita Segar untuk Kesehatan Tubuh Kita",
        content: "Gurita bukan sekadar isi takoyaki yang lezat! Gurita segar mengandung protein tinggi berkualitas, rendah kalori, serta kaya akan vitamin B12, selenium, dan zat besi. Selain itu, kandungan asam amino taurin dalam gurita sangat baik untuk kesehatan jantung dan membantu metabolisme lemak tubuh. Nikmati varian Takoyaki Original kami yang kaya akan gurita segar berkualitas tinggi!",
        image: "https://i.pinimg.com/736x/fe/58/0c/fe580c83a433505a674e19b1a835ab2b.jpg",
        category: "Kesehatan",
        date: "2026-06-04",
        status: "Published"
    },
    {
        id: 3,
        title: "Promo Spesial Ulang Tahun Takoyaki House Ke-3",
        content: "Kabar gembira buat semua Takoyaki Lovers di Surabaya! Menyambut hari ulang tahun Takoyaki House yang ke-3, dapatkan promo Buy 1 Get 1 Free untuk semua varian takoyaki pada tanggal 10 Juni 2026 mendatang. Cukup tunjukkan kartu member digital Anda ke kasir terdekat saat melakukan transaksi. Jangan lewatkan kesempatan emas ini, ajak teman dan keluarga Anda!",
        image: "https://i.pinimg.com/736x/0e/0d/a5/0e0da52ce8779a550e541809ee287fa0.jpg",
        category: "Promo",
        date: "2026-06-05",
        status: "Published"
    }
];

function loadArticles() {
    try {
        const stored = localStorage.getItem('articles');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (err) {
        console.warn('Gagal membaca articles dari localStorage', err);
    }
    return DEFAULT_ARTICLES.slice();
}

const dummyArticles = loadArticles();

function saveArticles() {
    try {
        localStorage.setItem('articles', JSON.stringify(dummyArticles));
    } catch (err) {
        console.warn('Gagal menyimpan articles ke localStorage', err);
    }
}

// Expose to global
window.dummyArticles = dummyArticles;
window.saveArticles = saveArticles;
