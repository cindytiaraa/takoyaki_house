/* ═══════════════════════════════════════════
   TAKOYAKI HOUSE — js/member/home.js
   Handles member area state and actions
════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Require user to be logged in as a member (or admin)
    if (!Auth.requireAuth(['member', 'admin'], '../auth/login.html')) {
        return;
    }

    const user = Auth.getCurrentUser();
    
    // 2. Set user's name
    const memberNameEl = document.getElementById('memberName');
    if (memberNameEl && user) {
        memberNameEl.textContent = user.name;
    }

    // 3. Handle logout
    const logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            Auth.logout('../auth/login.html');
        });
    }
});
