document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar el carrito si hay un nav o botones de agregar al carrito
    const botonesAgregar = document.querySelectorAll('.btn-comprar');
    const nav = document.querySelector('nav ul');
    
    // Si no hay botones de agregar al carrito y no hay nav, no inicializar el carrito
    if (botonesAgregar.length === 0 && !nav) {
        return;
    }
    
    // Cargar carrito desde LocalStorage o inicializar vacío
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Si hay nav, agregar el ícono del carrito
    if (nav) {
        const itemCarrito = document.createElement('li');
        itemCarrito.innerHTML = `
            <a href="#" id="ver-carrito">
                <i class="fas fa-shopping-cart"></i> Carrito 
                <span id="contador-carrito">${carrito.length}</span>
            </a>
        `;
        nav.appendChild(itemCarrito);
    }
    
    // Modal para el carrito
    const modalHTML = `
        <div id="modal-carrito" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:white; padding:20px; border-radius:10px; box-shadow:0 0 20px rgba(0,0,0,0.2); z-index:1000; min-width:300px;">
            <h3>Tu Carrito</h3>
            <div id="items-carrito"></div>
            <p>Total: $<span id="total-carrito">0</span></p>
            <button id="btn-cerrar-carrito">Cerrar</button>
            <button id="btn-vaciar-carrito">Vaciar Carrito</button>
            <button id="btn-checkout" style="background:#27ae60; color:white; border:none; padding:10px; border-radius:5px; margin-top:10px; width:100%;">
                <i class="fas fa-shopping-bag"></i> Finalizar Compra
            </button>
        </div>
        <div id="overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999;"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Inicializar carrito al cargar la página
    actualizarCarrito();
    
    // Agregar funcionalidad a botones "Agregar al Carrito"
    botonesAgregar.forEach(boton => {
        if (boton.textContent.includes('Carrito')) {
            boton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Obtener datos del producto
                const card = this.closest('.producto-card');
                const nombre = card.querySelector('h3').textContent;
                const precioTexto = card.querySelector('.producto-precio').textContent;
                const precio = parseFloat(precioTexto.replace('$', '').replace('.', '').replace(',', ''));
                
                // Agregar al carrito
                agregarAlCarrito({ 
                    nombre, 
                    precio,
                    id: Date.now(), // ID único para cada producto
                    cantidad: 1
                });
                
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
    
    // Función para guardar carrito en LocalStorage
    function guardarCarritoEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        console.log('Carrito guardado en LocalStorage:', carrito);
    }
    
    // Funciones del carrito
    function agregarAlCarrito(producto) {
        // Verificar si el producto ya existe en el carrito
        const productoExistente = carrito.find(item => item.nombre === producto.nombre);
        
        if (productoExistente) {
            // Si ya existe, aumentar cantidad
            productoExistente.cantidad += 1;
        } else {
            // Si no existe, agregarlo
            carrito.push(producto);
        }
        
        guardarCarritoEnLocalStorage();
        actualizarCarrito();
    }
    
    function actualizarCarrito() {
        // Actualizar contador en el nav
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        const contadorCarrito = document.getElementById('contador-carrito');
        if (contadorCarrito) {
            contadorCarrito.textContent = totalItems;
        }
        
        // Actualizar modal
        const itemsDiv = document.getElementById('items-carrito');
        const totalSpan = document.getElementById('total-carrito');
        
        let total = 0;
        itemsDiv.innerHTML = '';
        
        carrito.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            itemsDiv.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee;">
                    <div>
                        <strong>${item.nombre}</strong>
                        <div style="font-size:0.8em; color:#666;">
                            $${item.precio} × ${item.cantidad}
                            <button class="btn-restar" data-index="${index}" style="margin-left:5px; padding:2px 6px; font-size:0.8em;">-</button>
                            <button class="btn-sumar" data-index="${index}" style="margin-left:5px; padding:2px 6px; font-size:0.8em;">+</button>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span>$${subtotal.toFixed(2)}</span>
                        <button class="btn-eliminar" data-index="${index}" style="color:red; border:none; background:none; cursor:pointer;">✕</button>
                    </div>
                </div>
            `;
        });
        
        totalSpan.textContent = total.toFixed(2);
        
        // Mostrar mensaje si el carrito está vacío
        if (carrito.length === 0) {
            itemsDiv.innerHTML = '<p style="text-align:center; color:#666;">Tu carrito está vacío</p>';
        }
        
        // Agregar eventos a los botones de modificar cantidad y eliminar
        document.querySelectorAll('.btn-restar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                modificarCantidad(index, -1);
            });
        });
        
        document.querySelectorAll('.btn-sumar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                modificarCantidad(index, 1);
            });
        });
        
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                eliminarDelCarrito(index);
            });
        });
    }
    
    function modificarCantidad(index, cambio) {
        const item = carrito[index];
        item.cantidad += cambio;
        
        if (item.cantidad <= 0) {
            carrito.splice(index, 1);
        }
        
        guardarCarritoEnLocalStorage();
        actualizarCarrito();
    }
    
    function eliminarDelCarrito(index) {
        carrito.splice(index, 1);
        guardarCarritoEnLocalStorage();
        actualizarCarrito();
    }
    
    function vaciarCarrito() {
        carrito = [];
        guardarCarritoEnLocalStorage();
        actualizarCarrito();
        alert('Carrito vaciado');
        
        // Limpiar también el SessionStorage para evitar que aparezca el modal de checkout pendiente
        sessionStorage.removeItem('checkout');
        sessionStorage.removeItem('checkoutIniciado');
    }
    
    function verCarrito() {
        document.getElementById('modal-carrito').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
        actualizarCarrito();
    }
    
    function cerrarCarrito() {
        document.getElementById('modal-carrito').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }
    
    // Evento para abrir carrito
    const verCarritoBtn = document.getElementById('ver-carrito');
    if (verCarritoBtn) {
        verCarritoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            verCarrito();
        });
    }
    
    // Evento para botón de checkout
    document.getElementById('btn-checkout').addEventListener('click', function() {
        if (carrito.length === 0) {
            alert('Tu carrito está vacío. Agrega productos primero.');
            return;
        }
        iniciarCheckout();
    });
    
    // Evento para cerrar carrito
    document.getElementById('btn-cerrar-carrito').addEventListener('click', cerrarCarrito);
    
    // Evento para vaciar carrito
    document.getElementById('btn-vaciar-carrito').addEventListener('click', vaciarCarrito);
    
    // Sistema de checkout con SessionStorage
    function iniciarCheckout() {
        if (carrito.length === 0) {
            alert('No hay productos en el carrito');
            return;
        }
        
        // Guardar carrito actual en SessionStorage (temporal)
        sessionStorage.setItem('checkout', JSON.stringify(carrito));
        sessionStorage.setItem('checkoutIniciado', new Date().toISOString());
        
        // Redirigir a página de checkout (simulada)
        mostrarModalCheckout();
    }
    
    function mostrarModalCheckout() {
        // Cerrar modal del carrito primero
        document.getElementById('modal-carrito').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        
        const modalHTML = `
            <div id="modal-checkout" style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:white; padding:30px; border-radius:10px; box-shadow:0 0 30px rgba(0,0,0,0.3); z-index:1002; width:90%; max-width:500px;">
                <h3><i class="fas fa-shopping-bag"></i> Finalizar Compra</h3>
                <div id="resumen-checkout" style="max-height:200px; overflow-y:auto; margin:15px 0;"></div>
                <form id="form-checkout" style="margin-top:20px;">
                    <input type="text" placeholder="Nombre completo" required style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ddd; border-radius:4px;">
                    <input type="email" placeholder="Email" required style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ddd; border-radius:4px;">
                    <button type="submit" style="width:100%; padding:12px; background:#27ae60; color:white; border:none; border-radius:5px; cursor:pointer;">
                        <i class="fas fa-lock"></i> Completar Compra
                    </button>
                </form>
                <button id="btn-cancelar-checkout" style="width:100%; padding:12px; background:#e74c3c; color:white; border:none; border-radius:5px; margin-top:10px; cursor:pointer;">
                    Cancelar
                </button>
            </div>
            <div id="overlay-checkout" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1001;"></div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Mostrar resumen
        const resumen = document.getElementById('resumen-checkout');
        let total = 0;
        
        resumen.innerHTML = carrito.map(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            return `<div style="display:flex; justify-content:space-between; padding:5px 0;">
                <span>${item.nombre} (x${item.cantidad})</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>`;
        }).join('') + `<hr><div style="display:flex; justify-content:space-between; font-weight:bold; padding-top:10px;">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
        </div>`;
        
        // Manejar envío del formulario
        document.getElementById('form-checkout').addEventListener('submit', function(e) {
            e.preventDefault();
            completarCompra();
        });
        
        // Evento para cancelar checkout
        document.getElementById('btn-cancelar-checkout').addEventListener('click', cerrarCheckout);
    }
    
    function completarCompra() {
        // Aquí iría la lógica real de pago
        const nombre = document.querySelector('#form-checkout input[type="text"]').value;
        
        // Guardar compra en LocalStorage para historial
        const compra = {
            fecha: new Date().toISOString(),
            productos: carrito,
            total: document.querySelector('#resumen-checkout div:last-child span:last-child').textContent
        };
        
        // Guardar en historial de compras
        const historial = JSON.parse(localStorage.getItem('historialCompras')) || [];
        historial.push(compra);
        localStorage.setItem('historialCompras', JSON.stringify(historial));
        
        // Limpiar SessionStorage
        sessionStorage.removeItem('checkout');
        sessionStorage.removeItem('checkoutIniciado');
        
        // Vaciar carrito
        carrito.length = 0;
        localStorage.removeItem('carrito');
        
        alert(`¡Compra completada ${nombre}! Gracias por tu compra. Recibirás un email con los detalles.`);
        cerrarCheckout();
        
        // Actualizar carrito
        actualizarCarrito();
    }
    
    function cerrarCheckout() {
        document.getElementById('modal-checkout')?.remove();
        document.getElementById('overlay-checkout')?.remove();
    }
    
    // Verificar al cargar la página si hay un checkout en proceso
    // SOLO si hay botones de agregar al carrito (es decir, en página de productos)
    if (botonesAgregar.length > 0) {
        const checkoutIniciado = sessionStorage.getItem('checkoutIniciado');
        
        if (checkoutIniciado) {
            const tiempoTranscurrido = Date.now() - new Date(checkoutIniciado).getTime();
            const minutosTranscurridos = tiempoTranscurrido / (1000 * 60);
            
            // Si han pasado menos de 30 minutos, mostrar checkout
            if (minutosTranscurridos < 30) {
                mostrarModalCheckout();
            } else {
                // Limpiar SessionStorage si ha pasado mucho tiempo
                sessionStorage.removeItem('checkout');
                sessionStorage.removeItem('checkoutIniciado');
            }
        }
    }
});