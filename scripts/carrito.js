// Sistema de carrito de compras
document.addEventListener('DOMContentLoaded', function() {
    let carrito = [];
    const contadorCarrito = document.createElement('span');
    
    // Inicializar carrito en el nav
    const nav = document.querySelector('nav ul');
    const itemCarrito = document.createElement('li');
    itemCarrito.innerHTML = `
        <a href="#" id="ver-carrito">
            <i class="fas fa-shopping-cart"></i> Carrito 
            <span id="contador-carrito">0</span>
        </a>
    `;
    nav.appendChild(itemCarrito);
    
    // Modal para el carrito
    const modalHTML = `
        <div id="modal-carrito" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:white; padding:20px; border-radius:10px; box-shadow:0 0 20px rgba(0,0,0,0.2); z-index:1000; min-width:300px;">
            <h3>Tu Carrito</h3>
            <div id="items-carrito"></div>
            <p>Total: $<span id="total-carrito">0</span></p>
            <button onclick="cerrarCarrito()">Cerrar</button>
            <button onclick="vaciarCarrito()">Vaciar Carrito</button>
        </div>
        <div id="overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999;"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Agregar funcionalidad a botones "Agregar al Carrito"
    document.querySelectorAll('.btn-comprar').forEach(boton => {
        if (boton.textContent.includes('Carrito')) {
            boton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Obtener datos del producto
                const card = this.closest('.producto-card');
                const nombre = card.querySelector('h3').textContent;
                const precioTexto = card.querySelector('.producto-precio').textContent;
                const precio = parseFloat(precioTexto.replace('$', '').replace('.', '').replace(',', ''));
                
                // Agregar al carrito
                agregarAlCarrito({ nombre, precio });
                
                // Feedback visual
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
                this.style.background = '#27ae60';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = '';
                }, 1500);
            });
        }
    });
    
    // Funciones del carrito
    window.agregarAlCarrito = function(producto) {
        carrito.push(producto);
        actualizarCarrito();
    };
    
    window.actualizarCarrito = function() {
        // Actualizar contador
        document.getElementById('contador-carrito').textContent = carrito.length;
        
        // Actualizar modal
        const itemsDiv = document.getElementById('items-carrito');
        const totalSpan = document.getElementById('total-carrito');
        
        let total = 0;
        itemsDiv.innerHTML = '';
        
        carrito.forEach((item, index) => {
            total += item.precio;
            itemsDiv.innerHTML += `
                <div style="display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid #eee;">
                    <span>${item.nombre}</span>
                    <span>$${item.precio}</span>
                    <button onclick="eliminarDelCarrito(${index})" style="color:red; border:none; background:none;">✕</button>
                </div>
            `;
        });
        
        totalSpan.textContent = total.toFixed(2);
    };
    
    window.eliminarDelCarrito = function(index) {
        carrito.splice(index, 1);
        actualizarCarrito();
    };
    
    window.vaciarCarrito = function() {
        carrito = [];
        actualizarCarrito();
    };
    
    window.verCarrito = function() {
        document.getElementById('modal-carrito').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    };
    
    window.cerrarCarrito = function() {
        document.getElementById('modal-carrito').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    };
    
    // Evento para abrir carrito
    document.getElementById('ver-carrito').addEventListener('click', function(e) {
        e.preventDefault();
        verCarrito();
    });
});