/* ═══════════════════════════════════════════
   TAKOYAKI HOUSE — js/auth/login.js
   Handles login form submission & validation
════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    const loginForm   = document.getElementById('loginForm');
    const emailInput  = document.getElementById('email');
    const passInput   = document.getElementById('password');
    const submitBtn   = document.getElementById('loginSubmit');
    const errorBox    = document.getElementById('loginError');

    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });

    function handleLogin() {
        const email    = emailInput.value.trim().toLowerCase();
        const password = passInput.value;

        // Clear previous error
        showError('');

        // Basic validation
        if (!email || !password) {
            showError('⚠️ Mohon isi email dan password terlebih dahulu.');
            return;
        }

        // Loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';

        // Simulate a brief loading delay for UX
        setTimeout(() => {
            // Find matching account from dummyAccounts
            const accounts = window.dummyAccounts || [];
            const user = accounts.find(acc =>
                acc.email.toLowerCase() === email && acc.password === password
            );

            if (!user) {
                // Set flag and redirect to general home (untuk umum) with error message
                localStorage.setItem('authError', 'belum_ada_akun');
                window.location.href = '../home.html';
                return;
            }

            if (user.status === 'inactive') {
                showError('🚫 Akun kamu tidak aktif. Hubungi admin untuk bantuan.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In';
                return;
            }

            // Save session via Auth helper
            Auth.saveCurrentUser(user);

            // Show success toast
            showToast(`✅ Selamat datang kembali, ${user.name}!`);

            // Redirect based on role
            setTimeout(() => {
                if (user.role === 'admin') {
                    window.location.href = '../admin/dashboard.html';
                } else if (user.role === 'member') {
                    window.location.href = '../member/home.html';
                } else {
                    window.location.href = '../home.html';
                }
            }, 900);

        }, 600);
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

    // Clear error on input
    [emailInput, passInput].forEach(el => {
        el.addEventListener('input', () => showError(''));
    });
});
