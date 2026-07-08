const selectedItems = {}; // { id: qty }

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const menuId = params.get("id");
     if(menuId){
        selectedItems[menuId] = 1;
    }
    
    renderMenuGrid();
    document
        .getElementById("btnPreview")
        ?.addEventListener("click", previewOrder);
    document
        .getElementById("btnSubmit")
        ?.addEventListener("click", submitOrder);
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
        <div class="order-menu-card ${selectedItems[item.id] ? 'selected' : ''}" id="chip-${item.id}">
            <img src="${item.img}" alt="${item.name}">
            <div class="order-menu-body">
                ${item.badge ? `<span class="menu-card-badge">${item.badge}</span>` : ''}

                <h4>${item.name}</h4>

                <p class="order-menu-desc">
                    ${item.desc}
                </p>

                <div class="order-menu-footer">

                    <span class="order-menu-price">
                        ${item.price}
                    </span>

                    <div class="order-qty">

                        <button onclick="changeQty(event,${item.id},-1)">−</button>

                        <span id="qnum-${item.id}">
                            ${selectedItems[item.id] || 0}
                        </span>

                        <button onclick="
                        if(!selectedItems[${item.id}]){
                            toggleItem(${item.id});
                        }else{
                            changeQty(event,${item.id},1);
                        }
                        ">+</button>

                    </div>
                </div>
            </div>
        </div>
        `).join('');
}

function toggleItem(id) {
    if (selectedItems[id]) {
        delete selectedItems[id];
    } else {
        selectedItems[id] = 1;
    }
    renderMenuGrid();
    updateSummary();
}

function changeQty(e,id,delta){
    e.stopPropagation();
    if(!selectedItems[id]) return;
    selectedItems[id]+=delta;
    if(selectedItems[id]<=0){
        delete selectedItems[id];
    }
    renderMenuGrid();
    updateSummary();
}

function updateSummary() {
    const summary = document.getElementById("orderSummary");
    const list = document.getElementById("summaryList");
    const totalEl = document.getElementById("summaryTotal");
    let total = 0;
    const html = Object.entries(selectedItems).map(([id, qty]) => {
        const item = window.dummyMenu.find(m => m.id == id);
        if (!item) return "";
        const subtotal = parsePrice(item.price) * qty;
        total += subtotal;
        return `
            <div class="summary-item">
                <span>${item.name} × ${qty}</span>
                <strong>${fmtRp(subtotal)}</strong>
            </div>
        `;
    }).join("");
    list.innerHTML = html;
    totalEl.textContent = fmtRp(total);
    summary.style.display =
        Object.keys(selectedItems).length
            ? "block"
            : "none";
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
        alert('⚠️ Mohon isi nama dan nomor WhatsApp.');
        return;
    }

    const menu = window.dummyMenu || [];
    const linesEl = document.getElementById('summaryList');
    const totalEl = document.getElementById('summaryTotal');
    const card    = document.getElementById('orderSummary');
    const btnSubmit  = document.getElementById('btnSubmit');
    const btnPreview = document.getElementById('btnPreview');

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
        resultEl.innerHTML = `✅ <strong>Pesanan berhasil dikirim!</strong><br>
            Halo <strong>${name}</strong>, pesananmu (${items.map(i => i.name + ' ×' + i.qty).join(', ')}) sudah kami terima.<br>
            Kami akan menghubungi <strong>${phone}</strong> segera.<br>
            ${note ? `📝 Catatan: ${note}` : ''}`;
        resultEl.style.display = 'block';
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function parsePrice(price){
    return Number(
        price
            .replace("Rp","")
            .replace(/\./g,"")
            .replace(/\s/g,"")
            .replace(",","")
    );
}

function fmtRp(number){
    return "Rp " + number.toLocaleString("id-ID");
}