// Auth helper utilities
// Usage:
//   const user = Auth.getCurrentUser();
//   Auth.requireAuth(['admin'], '../pages/login.html');
//   Auth.logout('../pages/login.html');

const Auth = (function(){
    function getCurrentUser(){
        try{
            const raw = localStorage.getItem('currentUser');
            return raw ? JSON.parse(raw) : null;
        }catch(e){ return null; }
    }

    function saveCurrentUser(user){
        if(!user) return;
        const copy = Object.assign({}, user);
        delete copy.password;
        localStorage.setItem('currentUser', JSON.stringify(copy));
        window.currentUser = copy;
    }

    function logout(redirect='pages/login.html'){
        localStorage.removeItem('currentUser');
        window.currentUser = null;
        // If current page is login already, just reload
        if(window.location.pathname.endsWith('/login.html') || window.location.pathname.endsWith('login.html')){
            window.location.reload();
            return;
        }
        window.location.href = redirect;
    }

    // roles: array of allowed roles, e.g. ['admin'] or [] for any logged user
    function requireAuth(roles=[], redirect='pages/login.html'){
        const user = getCurrentUser();
        if(!user){
            alert('Akses terlarang — silakan login.');
            window.location.href = redirect;
            return false;
        }
        if(Array.isArray(roles) && roles.length > 0 && !roles.includes(user.role)){
            alert('Akses terlarang — hak akses tidak mencukupi.');
            window.location.href = redirect;
            return false;
        }
        return true;
    }

    return {
        getCurrentUser,
        saveCurrentUser,
        logout,
        requireAuth
    };
})();

window.Auth = Auth;
