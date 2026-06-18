/* profil.js */
document.addEventListener('DOMContentLoaded', () => {
    injectMemberLayout();
    if (!initMemberLayout('Profil Saya')) return;

    const user = Auth.getCurrentUser();
    if (!user) return;

    fillForm(user);

    document.getElementById('btnSaveProfil')?.addEventListener('click', saveProfil);
    document.getElementById('btnChangePass')?.addEventListener('click', changePass);
});

function fillForm(user) {
    const initial = (user.name || 'M')[0].toUpperCase();
    setText('profilAvatarBig', initial);
    setText('profilDisplayName', user.name || 'Member');
    setText('profilTierBadge', (user.membership || 'Bronze') + ' Member');
    setText('profilPoints', user.points ?? 0);
    setVal('profilName', user.name);
    setVal('profilEmail', user.email);
    setVal('profilPhone', user.phone);
    setVal('profilFav', user.favoriteMenu);
}

function saveProfil() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const name  = document.getElementById('profilName')?.value.trim();
    const phone = document.getElementById('profilPhone')?.value.trim();
    const fav   = document.getElementById('profilFav')?.value.trim();
    const msg   = document.getElementById('profilSaveMsg');

    if (!name) { showMsg(msg, 'Nama tidak boleh kosong.', true); return; }

    const accounts = window.dummyAccounts || [];
    const idx = accounts.findIndex(a => a.id === user.id);
    if (idx !== -1) {
        accounts[idx].name = name;
        accounts[idx].phone = phone;
        accounts[idx].favoriteMenu = fav;
        if (typeof window.saveAccounts === 'function') window.saveAccounts();
    }

    const updated = { ...user, name, phone, favoriteMenu: fav };
    if (typeof Auth.saveCurrentUser === 'function') Auth.saveCurrentUser(updated);
    fillForm(updated);
    fillLayoutUser();

    showMsg(msg, '✅ Profil berhasil disimpan!', false);
}

function changePass() {
    const user    = Auth.getCurrentUser();
    const newPass = document.getElementById('profilNewPass')?.value.trim();
    const confPass = document.getElementById('profilConfPass')?.value.trim();
    const msg     = document.getElementById('passSaveMsg');

    if (!newPass || newPass.length < 6) { showMsg(msg, '⚠️ Password minimal 6 karakter.', true); return; }
    if (newPass !== confPass) { showMsg(msg, '⚠️ Konfirmasi password tidak cocok.', true); return; }

    const accounts = window.dummyAccounts || [];
    const idx = accounts.findIndex(a => a.id === user.id);
    if (idx !== -1) {
        accounts[idx].password = newPass;
        if (typeof window.saveAccounts === 'function') window.saveAccounts();
    }

    document.getElementById('profilNewPass').value = '';
    document.getElementById('profilConfPass').value = '';
    showMsg(msg, '✅ Password berhasil diubah!', false);
}

function showMsg(el, text, isError) {
    if (!el) return;
    el.textContent = text;
    el.className = 'profil-save-msg' + (isError ? ' error' : '');
    setTimeout(() => { el.textContent = ''; }, 3000);
}

function fillLayoutUser() {
    const user = Auth.getCurrentUser();
    if (!user) return;
    const initial = (user.name || 'M')[0].toUpperCase();
    setText('drawerUserName', user.name || 'Member');
    setText('drawerAvatar', initial);
    setText('topbarAvatar', initial);
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}
function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
}
