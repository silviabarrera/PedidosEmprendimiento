let productosStock = [];
let productosEncargo = [];
let carritoStock = [];
let carritoEncargo = [];
let lastFocusedElement;

// 1. Cargar datos del JSON
async function fetchProducts() {
    try {
        const response = await fetch('productos.json');
        const data = await response.json();
        
        productosStock = data.stockHoy.filter(p => p.disponible);
        productosEncargo = data.paraEncargar.filter(p => p.disponible);
        
        renderGrids();
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

// 2. Renderizar Grids
function renderGrids() {
    document.getElementById('grid-stock').innerHTML = productosStock.map(p => createCard(p, 'stock')).join('');
    document.getElementById('grid-encargo').innerHTML = productosEncargo.map(p => createCard(p, 'encargo')).join('');
    
    // Configurar fecha mínima de entrega
    const dateInput = document.getElementById('date-encargo');
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    dateInput.min = targetDate.toISOString().split("T")[0];
}

// 3. Crear Tarjeta de Producto
function createCard(p, tipo) {
    return `
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm img-zoom transition-all hover:shadow-md flex flex-col relative">
            <div class="relative h-32 md:h-44 overflow-hidden">
                <img src="${p.img}" class="w-full h-full object-cover transition-transform duration-500" alt="${p.nombre}">
                <button onclick="openZoom('${p.img}', this)" 
                        class="lupa-btn absolute top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10" 
                        aria-label="Ver imagen de ${p.nombre}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                </button>
            </div>
            <div class="p-3 flex flex-col flex-grow text-center">
                <h4 class="font-bold text-sm md:text-base mb-1">${p.nombre}</h4>
                <p class="text-bakery-olive font-black text-lg mb-3">$${p.precio}</p>
                <button onclick="addToCart('${tipo}', ${p.id})" class="mt-auto bg-bakery-olive text-white py-2 rounded-xl text-xs font-bold uppercase hover:bg-bakery-chocolate transition-colors">
                    + Agregar
                </button>
            </div>
        </div>
    `;
}

// 4. Lógica de Carrito
function addToCart(tipo, id) {
    const dataList = tipo === 'stock' ? productosStock : productosEncargo;
    const cart = tipo === 'stock' ? carritoStock : carritoEncargo;
    const prod = dataList.find(p => p.id === id);
    
    const existing = cart.find(item => item.id === id);
    if (existing) existing.qty++;
    else cart.push({ ...prod, qty: 1 });
    
    updateUI(tipo);
    const container = document.getElementById(`container-pedido-${tipo}`);
    container.classList.remove('hidden-cart');
    container.scrollIntoView({ behavior: 'smooth' });
}

function changeQty(tipo, id, delta) {
    const cart = tipo === 'stock' ? carritoStock : carritoEncargo;
    const index = cart.findIndex(item => item.id === id);
    if (index > -1) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) cart.splice(index, 1);
    }
    if (cart.length === 0) document.getElementById(`container-pedido-${tipo}`).classList.add('hidden-cart');
    updateUI(tipo);
}

function updateUI(tipo) {
    const list = document.getElementById(`lista-pedido-${tipo}`);
    const cart = tipo === 'stock' ? carritoStock : carritoEncargo;
    
    list.innerHTML = cart.map(item => `
        <div class="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-bakery-olive/10 animate-fadeIn">
            <div><p class="font-bold text-sm">${item.nombre}</p><p class="text-xs text-bakery-olive font-bold">$${item.precio * item.qty}</p></div>
            <div class="flex items-center gap-3">
                <button type="button" onclick="changeQty('${tipo}', ${item.id}, -1)" class="w-8 h-8 rounded-full border border-bakery-olive/20 hover:bg-bakery-olive hover:text-white transition-colors">-</button>
                <span class="font-bold w-4 text-center">${item.qty}</span>
                <button type="button" onclick="changeQty('${tipo}', ${item.id}, 1)" class="w-8 h-8 rounded-full border border-bakery-olive/20 hover:bg-bakery-olive hover:text-white transition-colors">+</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((acc, i) => acc + (i.precio * i.qty), 0);
    document.getElementById(`total-${tipo}`).innerText = `$${total}`;
}

// 5. WhatsApp
function enviarWhatsApp(tipo) {
    const cart = tipo === 'stock' ? carritoStock : carritoEncargo;
    const name = document.getElementById(`name-${tipo}`).value;
    const pay = document.getElementById(`pay-${tipo}`).value;
    const addr = document.getElementById(`address-${tipo}`).value;
    const date = tipo === 'encargo' ? document.getElementById('date-encargo').value : null;

    if (!name || !addr || (tipo === 'encargo' && !date)) {
        alert("Por favor completa los datos del formulario.");
        return;
    }

    let msg = `*NUEVO PEDIDO: ${tipo.toUpperCase()}*%0A`;
    msg += `------------------------------%0A`;
    msg += `*Cliente:* ${name}%0A`;
    if (date) msg += `*Día Entrega:* ${date}%0A`;
    msg += `*Pago:* ${pay}%0A`;
    msg += `*Dirección:* ${addr}%0A`;
    msg += `*Ubicación:* https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}%0A`;
    msg += `------------------------------%0A`;
    cart.forEach(i => msg += `• ${i.qty}x ${i.nombre} ($${i.precio * i.qty})%0A`);
    msg += `------------------------------%0A`;
    msg += `*TOTAL: $${cart.reduce((acc, i) => acc + (i.precio * i.qty), 0)}*`;

    window.open(`https://wa.me/5493885187505?text=${msg}`, '_blank');
}

// 6. Zoom Modal
function openZoom(src, triggerEl) {
    lastFocusedElement = triggerEl;
    const modal = document.getElementById('image-modal');
    document.getElementById('modal-img').src = src;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('close-modal-btn').focus();
    document.body.style.overflow = 'hidden';
}

function closeZoom() {
    const modal = document.getElementById('image-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
}

// 7. Autocomplete de Google Maps
function initAutocomplete() {
    const inputs = document.getElementsByClassName('autocomplete');
    for (let input of inputs) {
        new google.maps.places.Autocomplete(input, {
            componentRestrictions: { country: "ar" },
            fields: ["geometry", "name"],
            types: ["address"],
        });
    }
}

// Escuchar tecla Esc para cerrar modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeZoom();
});

// Arrancar APP
window.onload = fetchProducts;