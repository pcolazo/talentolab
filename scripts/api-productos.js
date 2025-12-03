// api-productos.js - Consumo de API FakeStore con filtros
document.addEventListener('DOMContentLoaded', function() {
    console.log('API Productos cargado');
    
    // Elementos del DOM
    const productosContainer = document.getElementById('productos-api-container');
    const mensajeCargando = document.getElementById('mensaje-cargando');
    const mensajeSinProductos = document.getElementById('mensaje-sin-productos');
    const recargarBtn = document.getElementById('recargar-productos');
    const buscador = document.getElementById('buscador-api');
    const ordenPrecio = document.getElementById('orden-precio');
    const botonesFiltro = document.querySelectorAll('button[data-categoria]');
    
    // Variables
    let productosOriginales = [];
    let productosFiltrados = [];
    let categoriaActiva = 'todos';
    
    // URL de la API (FakeStore API)
    const API_URL = 'https://fakestoreapi.com/products';
    
    // Función principal para cargar productos
    async function cargarProductos() {
        try {
            mostrarCargando();
            
            const respuesta = await fetch(API_URL);
            
            if (!respuesta.ok) {
                throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
            }
            
            const productos = await respuesta.json();
            productosOriginales = productos;
            
            // Aplicar filtro inicial (tecnología por defecto)
            aplicarFiltro('electronics');
            
            // Configurar eventos
            configurarEventos();
            
            ocultarCargando();
            
        } catch (error) {
            console.error('Error al cargar productos:', error);
            mostrarError(error.message);
        }
    }
    
    // Mostrar estado de carga
    function mostrarCargando() {
        mensajeCargando.style.display = 'block';
        mensajeSinProductos.style.display = 'none';
        productosContainer.innerHTML = '';
    }
    
    // Ocultar estado de carga
    function ocultarCargando() {
        mensajeCargando.style.display = 'none';
    }
    
    // Mostrar error
    function mostrarError(mensaje) {
        mensajeCargando.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle"></i>
                <h5>Error al cargar productos</h5>
                <p>${mensaje}</p>
                <button onclick="cargarProductos()" class="btn btn-sm btn-outline-primary">
                    Reintentar
                </button>
            </div>
        `;
    }
    
    // Aplicar filtro por categoría
    function aplicarFiltro(categoria) {
        categoriaActiva = categoria;
        
        if (categoria === 'todos') {
            productosFiltrados = [...productosOriginales];
        } else {
            productosFiltrados = productosOriginales.filter(
                producto => producto.category === categoria
            );
        }
        
        // Actualizar botones activos
        botonesFiltro.forEach(boton => {
            if (boton.dataset.categoria === categoria) {
                boton.classList.add('active');
                boton.classList.remove('btn-outline-primary');
                boton.classList.add('btn-primary');
            } else {
                boton.classList.remove('active');
                boton.classList.remove('btn-primary');
                boton.classList.add('btn-outline-primary');
            }
        });
        
        // Aplicar búsqueda si hay texto
        const terminoBusqueda = buscador.value.trim();
        if (terminoBusqueda) {
            buscarProductos(terminoBusqueda);
        } else {
            renderizarProductos(productosFiltrados);
        }
    }
    
    // Buscar productos por texto
    function buscarProductos(termino) {
        const terminoLower = termino.toLowerCase();
        
        const productosBuscados = productosFiltrados.filter(producto => {
            return producto.title.toLowerCase().includes(terminoLower) ||
                   producto.description.toLowerCase().includes(terminoLower);
        });
        
        renderizarProductos(productosBuscados);
    }
    
    // Ordenar productos
    function ordenarProductos(orden) {
        let productosOrdenados = [...productosFiltrados];
        
        switch (orden) {
            case 'precio-asc':
                productosOrdenados.sort((a, b) => a.price - b.price);
                break;
            case 'precio-desc':
                productosOrdenados.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                productosOrdenados.sort((a, b) => b.rating.rate - a.rating.rate);
                break;
            default:
                // Orden original
                productosOrdenados.sort((a, b) => a.id - b.id);
        }
        
        renderizarProductos(productosOrdenados);
    }
    
    // Renderizar productos en el DOM
    function renderizarProductos(productos) {
        productosContainer.innerHTML = '';
        
        if (productos.length === 0) {
            mensajeSinProductos.style.display = 'block';
            return;
        }
        
        mensajeSinProductos.style.display = 'none';
        
        productos.forEach(producto => {
            const productoHTML = crearTarjetaProducto(producto);
            productosContainer.innerHTML += productoHTML;
        });
        
        // Agregar eventos a los botones de agregar
        agregarEventosCarrito();
    }
    
    // Crear tarjeta de producto HTML
    function crearTarjetaProducto(producto) {
        // Limitar descripción
        const descripcionCorta = producto.description.length > 80 
            ? producto.description.substring(0, 80) + '...' 
            : producto.description;
        
        // Crear estrellas de rating
        let estrellasHTML = '';
        const rating = Math.round(producto.rating.rate);
        for (let i = 1; i <= 5; i++) {
            estrellasHTML += i <= rating 
                ? '<i class="fas fa-star text-warning"></i>' 
                : '<i class="far fa-star text-muted"></i>';
        }
        
        return `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-img-top text-center p-3" style="height: 200px; background: #f8f9fa;">
                        <img src="${producto.image}" 
                             alt="${producto.title}"
                             class="img-fluid h-100"
                             style="object-fit: contain;"
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/300x300/e0e0e0/666666?text=Producto'">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="mb-2">
                            <span class="badge bg-info">${producto.category}</span>
                        </div>
                        <h5 class="card-title" style="height: 48px; overflow: hidden;">${producto.title}</h5>
                        <p class="card-text text-muted small flex-grow-1">
                            ${descripcionCorta}
                        </p>
                        <div class="mt-auto">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="h5 text-primary mb-0">$${producto.price.toFixed(2)}</span>
                                <div>
                                    <small class="text-warning">${estrellasHTML}</small>
                                    <small class="text-muted">(${producto.rating.count})</small>
                                </div>
                            </div>
                            <button class="btn btn-success w-100 btn-agregar-api" 
                                    data-id="${producto.id}"
                                    data-nombre="${producto.title}"
                                    data-precio="${producto.price}"
                                    data-imagen="${producto.image}">
                                <i class="fas fa-cart-plus me-2"></i> Agregar al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Agregar eventos para agregar al carrito
    function agregarEventosCarrito() {
        document.querySelectorAll('.btn-agregar-api').forEach(boton => {
            boton.addEventListener('click', function() {
                const producto = {
                    id: this.dataset.id,
                    nombre: this.dataset.nombre,
                    precio: parseFloat(this.dataset.precio),
                    imagen: this.dataset.imagen,
                    categoria: 'API Product',
                    tipo: 'api'
                };
                
                // Guardar en LocalStorage (simulación de carrito)
                agregarAlCarrito(producto);
                
                // Feedback visual
                const originalTexto = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check me-2"></i> ¡Agregado!';
                this.disabled = true;
                this.classList.remove('btn-success');
                this.classList.add('btn-primary');
                
                setTimeout(() => {
                    this.innerHTML = originalTexto;
                    this.disabled = false;
                    this.classList.remove('btn-primary');
                    this.classList.add('btn-success');
                }, 1500);
            });
        });
    }
    
    // Función para agregar al carrito (simulación)
    function agregarAlCarrito(producto) {
        // Obtener carrito actual
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        // Verificar si el producto ya está en el carrito
        const existe = carrito.find(item => item.id === producto.id && item.tipo === 'api');
        
        if (existe) {
            existe.cantidad = (existe.cantidad || 1) + 1;
        } else {
            producto.cantidad = 1;
            carrito.push(producto);
        }
        
        // Guardar en LocalStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Mostrar notificación
        mostrarNotificacion(`"${producto.nombre}" agregado al carrito`);
        
        //if (typeof actualizarCarrito === "function") {
        //actualizarCarrito();
        // }
        // ACTUALIZAR CONTADOR DEL CARRITO MANUALMENTE
        const contador = document.getElementById('contador-carrito');
        if (contador) {
            // Releer carrito desde localStorage
            const carritoLS = JSON.parse(localStorage.getItem('carrito')) || [];
            const total = carritoLS.reduce((sum, item) => sum + (item.cantidad || 1), 0);
            contador.textContent = total;
        }
    }
    
    // Mostrar notificación
    function mostrarNotificacion(mensaje) {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = 'alert alert-success alert-dismissible fade show position-fixed';
        notificacion.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 1000;
            min-width: 300px;
        `;
        notificacion.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notificacion);
        
        // Auto-eliminar después de 3 segundos
        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    }
    
    // Configurar todos los eventos
    function configurarEventos() {
        // Botones de filtro
        botonesFiltro.forEach(boton => {
            boton.addEventListener('click', function() {
                aplicarFiltro(this.dataset.categoria);
            });
        });
        
        // Buscador
        buscador.addEventListener('input', function() {
            buscarProductos(this.value);
        });
        
        // Ordenamiento
        ordenPrecio.addEventListener('change', function() {
            ordenarProductos(this.value);
        });
        
        // Botón recargar
        if (recargarBtn) {
            recargarBtn.addEventListener('click', cargarProductos);
        }
    }
    
    // Iniciar carga de productos
    cargarProductos();
    
    // Exponer función global para reintentar
    window.cargarProductos = cargarProductos;
});
