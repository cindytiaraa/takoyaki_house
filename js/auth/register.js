/* ═══════════════════════════════════════════
   TAKOYAKI HOUSE — js/auth/register.js
   Handles register form submission & validation
════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    const registerForm = document.getElementById('registerForm');
    const nameInput    = document.getElementById('fullName');
    const emailInput   = document.getElementById('email');
    const passInput    = document.getElementById('password');
    const submitBtn    = document.getElementById('registerSubmit');
    const errorBox     = document.getElementById('registerError');

    if (!registerForm) return;

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister();
    });

    function handleRegister() {
        const name     = nameInput.value.trim();
        const email    = emailInput.value.trim().toLowerCase();
        const password = passInput.value;

        // Clear previous error
        showError('');

        // Validasi field kosong
        if (!name || !email || !password) {
            showError('⚠️ Mohon isi semua field terlebih dahulu.');
            return;
        }

        // Validasi format email
        if (!email.includes('@') || !email.includes('.')) {
            showError('⚠️ Format email tidak valid.');
            return;
        }

        // Validasi panjang password
        if (password.length < 6) {
            showError('⚠️ Password minimal 6 karakter.');
            return;
        }

        // Cek email sudah terdaftar
        const accounts = window.dummyAccounts || [];
        const existing = accounts.find(acc => acc.email.toLowerCase() === email);
        if (existing) {
            showError('❌ Email ini sudah terdaftar. Silakan gunakan email lain atau login.');
            return;
        }

        // Loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Membuat Akun...';

        setTimeout(() => {
            // Buat akun baru
            const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
            const newUser = {
                id: newId,
                role: 'member',
                name: name,
                email: email,
                password: password,
                phone: '',
                membership: 'Bronze',
                points: 0,
                favoriteMenu: '',
                status: 'active'
            };

            // Simpan ke dummyAccounts & localStorage
            accounts.push(newUser);
            window.saveAccounts();

            // Auto-login setelah register
            Auth.saveCurrentUser(newUser);

            showToast(`🎉 Selamat datang, ${name}! Akun berhasil dibuat.`);

            // Redirect ke home member
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);

        }, 700);
    }

    // Show inline error message
    function showError(msg) {
        if (!errorBox) return;
        if (!msg) {
            errorBox.style.display = 'none';
            errorBox.textContent = '';
            return;
        }
        errorBox.textContent = msg;
        errorBox.style.display = 'block';
    }

    // Toast notification
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position:fixed; bottom:24px; right:24px; z-index:9999;
            background:var(--navy); color:white;
            padding:14px 22px; border-radius:10px;
            font-family:var(--font-body); font-size:0.88rem; font-weight:500;
            box-shadow:0 8px 24px rgba(0,0,0,0.2);
            animation: slideInToast 0.3s ease;
        `;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Clear error on typing
    [nameInput, emailInput, passInput].forEach(el => {
        if (el) el.addEventListener('input', () => showError(''));
    });
});
