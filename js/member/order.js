/* order.js — Member Order Langsung */
const selectedItems = {}; // { id: qty }

document.addEventListener('DOMContentLoaded', () => {
    injectMemberLayout();
    if (!initMemberLayout('Order Langsung')) return;

    // Pre-fill name & phone dari akun member
    const user = Auth.getCurrentUser();
    if (user) {
        const nameEl  = document.getElementById('orderName');
        const phoneEl = document.getElementById('orderPhone');
        if (nameEl && !nameEl.value)  nameEl.value  = user.name  || '';
        if (phoneEl && !phoneEl.value) phoneEl.value = user.phone || '';
    }

    renderMenuGrid();

    document.getElementById('btnPreviewOrder')?.addEventListener('click', previewOrder);
    document.getElementById('btnSubmitOrder')?.addEventListener('click', submitOrder);
});

function renderMenuGrid() {
    const menu = window.dummyMenu || [];
    const grid = document.getElementById('orderMenuGrid');
    if (!grid) return;

    const available = menu.filter(m => m.status === 'available');
    if (available.length === 0) {
        grid.innerHTML = `<p style="color:var(--gray);font-size:0.88rem;">Tidak ada menu tersedia.</p>`;
        return;
    }

    grid.innerHTML = available.map(item => `
        <div class="order-menu-chip" id="chip-${item.id}" onclick="toggleChip(${item.id})">
            <div class="omc-name">${item.name}</div>
            <div class="omc-price">${item.price}</div>
            <div class="omc-qty-row" id="qtyrow-${item.id}" style="display:none;">
                <button class="omc-qty-btn" onclick="changeChipQty(event,${item.id},-1)">−</button>
                <span class="omc-qty-num" id="qnum-${item.id}">1</span>
                <button class="omc-qty-btn" onclick="changeChipQty(event,${item.id},1)">+</button>
            </div>
        </div>
    `).join('');
}

function toggleChip(id) {
    const chip = document.getElementById(`chip-${id}`);
    const qtyRow = document.getElementById(`qtyrow-${id}`);
    if (!chip) return;

    if (selectedItems[id]) {
        delete selectedItems[id];
        chip.classList.remove('selected');
        if (qtyRow) qtyRow.style.display = 'none';
    } else {
        selectedItems[id] = 1;
        chip.classList.add('selected');
        if (qtyRow) qtyRow.style.display = 'flex';
        const qnum = document.getElementById(`qnum-${id}`);
        if (qnum) qnum.textContent = '1';
    }

    updateSelectedCount();
    hideSummary();
}

function changeChipQty(e, id, delta) {
    e.stopPropagation();
    if (!selectedItems[id]) return;
    selectedItems[id] = Math.max(1, selectedItems[id] + delta);
    const qnum = document.getElementById(`qnum-${id}`);
    if (qnum) qnum.textContent = selectedItems[id];
    hideSummary();
}

function updateSelectedCount() {
    const count = Object.keys(selectedItems).length;
    const el = document.getElementById('selectedCount');
    if (el) el.textContent = `${count} item dipilih`;
}

function hideSummary() {
    const card = document.getElementById('orderSummaryCard');
    const btnSubmit = document.getElementById('btnSubmitOrder');
    const btnPreview = document.getElementById('btnPreviewOrder');
    if (card) card.style.display = 'none';
    if (btnSubmit) btnSubmit.style.display = 'none';
    if (btnPreview) btnPreview.style.display = 'inline-block';
}

function previewOrder() {
    const hint = document.getElementById('orderHint');
    const name  = document.getElementById('orderName')?.value.trim();
    const phone = document.getElementById('orderPhone')?.value.trim();

    if (Object.keys(selectedItems).length === 0) {
        if (hint) hint.style.display = 'block';
        return;
    }
    if (hint) hint.style.display = 'none';

    if (!name || !phone) {
        alert('Mohon isi nama dan nomor WhatsApp.');
        return;
    }

    const menu = window.dummyMenu || [];
    const linesEl = document.getElementById('orderSummaryLines');
    const totalEl = document.getElementById('orderSummaryTotal');
    const card    = document.getElementById('orderSummaryCard');
    const btnSubmit  = document.getElementById('btnSubmitOrder');
    const btnPreview = document.getElementById('btnPreviewOrder');

    let total = 0;
    const lines = Object.entries(selectedItems).map(([id, qty]) => {
        const item = menu.find(m => m.id === parseInt(id));
        if (!item) return '';
        const unit = parsePrice(item.price);
        const sub  = unit * qty;
        total += sub;
        return `<div class="ks-line"><span>${item.name} ×${qty}</span><strong>${fmtRp(sub)}</strong></div>`;
    }).join('');

    if (linesEl) linesEl.innerHTML = lines;
    if (totalEl) totalEl.textContent = fmtRp(total);
    if (card) { card.style.display = 'block'; card.scrollIntoView({ behavior:'smooth', block:'nearest' }); }
    if (btnSubmit)  btnSubmit.style.display  = 'inline-block';
    if (btnPreview) btnPreview.style.display = 'none';
}

function submitOrder() {
    const name  = document.getElementById('orderName')?.value.trim();
    const phone = document.getElementById('orderPhone')?.value.trim();
    const note  = document.getElementById('orderNote')?.value.trim();
    const resultEl = document.getElementById('orderResultMsg');

    if (!name || !phone || Object.keys(selectedItems).length === 0) return;

    const menu = window.dummyMenu || [];
    const orders = window.dummyOrders || [];

    const items = Object.entries(selectedItems).map(([id, qty]) => {
        const item = menu.find(m => m.id === parseInt(id));
        return { name: item.name, qty, price: parsePrice(item.price) };
    });

    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    const now   = new Date();
    const pad   = n => String(n).padStart(2, '0');
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const lastId  = orders.length > 0 ? orders[orders.length - 1].id : 'TX-9000';
    const nextNum = parseInt(String(lastId).replace('TX-', '')) + 1;
    const newOrder = {
        id: `TX-${nextNum}`,
        customerName: name,
        customerPhone: phone,
        items,
        totalPrice: total,
        date: dateStr,
        note: note || '',
        status: 'Pending'
    };

    orders.push(newOrder);
    if (typeof window.saveOrders === 'function') window.saveOrders();

    // Reset
    Object.keys(selectedItems).forEach(id => {
        delete selectedItems[id];
        document.getElementById(`chip-${id}`)?.classList.remove('selected');
        const qr = document.getElementById(`qtyrow-${id}`);
        if (qr) qr.style.display = 'none';
        const qn = document.getElementById(`qnum-${id}`);
        if (qn) qn.textContent = '1';
    });
    updateSelectedCount();

    document.getElementById('orderNote').value = '';
    document.getElementById('orderSummaryCard').style.display = 'none';
    document.getElementById('btnSubmitOrder').style.display   = 'none';
    document.getElementById('btnPreviewOrder').style.display  = 'inline-block';

    if (resultEl) {
        resultEl.className = 'order-result-msg success';
        resultEl.innerHTML = `<strong>Pesanan berhasil dikirim!</strong><br>
            Halo <strong>${name}</strong>, pesananmu (${items.map(i => i.name + ' ×' + i.qty).join(', ')}) sudah kami terima.<br>
            Kami akan menghubungi <strong>${phone}</strong> segera.<br>
            ${note ? `Catatan: ${note}` : ''}`;
        resultEl.style.display = 'block';
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}
