// Sistema de preferencias de usuario con LocalStorage
document.addEventListener('DOMContentLoaded', function() {
    const formPreferencias = document.getElementById('form-preferencias');
    
    // Cargar preferencias guardadas
    cargarPreferencias();
    
    if (formPreferencias) {
        formPreferencias.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre-usuario').value;
            const tema = document.getElementById('tema-sitio').value;
            
            // Guardar en LocalStorage
            localStorage.setItem('preferencias', JSON.stringify({
                nombre: nombre,
                tema: tema,
                fecha: new Date().toISOString()
            }));
            
            // Aplicar preferencias
            aplicarPreferencias();
            
            // Mostrar feedback
            mostrarMensaje(`¡Hola ${nombre}! Tus preferencias han sido guardadas.`, 'success');
        });
    }
    
    // Función para cargar preferencias
    function cargarPreferencias() {
        const preferenciasGuardadas = JSON.parse(localStorage.getItem('preferencias'));
        
        if (preferenciasGuardadas) {
            // Rellenar formulario
            document.getElementById('nombre-usuario').value = preferenciasGuardadas.nombre || '';
            document.getElementById('tema-sitio').value = preferenciasGuardadas.tema || 'light';
            
            // Aplicar preferencias
            aplicarPreferencias();
        }
    }
    
    // Función para aplicar preferencias
    function aplicarPreferencias() {
        const preferencias = JSON.parse(localStorage.getItem('preferencias'));
        
        if (!preferencias) return;
        
        // Aplicar tema
        document.body.classList.remove('tema-light', 'tema-dark', 'tema-blue');
        document.body.classList.add(`tema-${preferencias.tema}`);
        
        // Mostrar saludo personalizado si hay nombre
        if (preferencias.nombre) {
            mostrarSaludoPersonalizado(preferencias.nombre);
        }
    }
    
    // Función para mostrar saludo
    function mostrarSaludoPersonalizado(nombre) {
        let saludo = document.getElementById('saludo-personalizado');
        
        if (!saludo) {
            saludo = document.createElement('div');
            saludo.id = 'saludo-personalizado';
            saludo.style.cssText = `
                background: linear-gradient(135deg, #3498db, #2ecc71);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                margin: 10px 0;
                text-align: center;
                font-weight: bold;
            `;
            
            const header = document.querySelector('header');
            header.parentNode.insertBefore(saludo, header.nextSibling);
        }
        
        saludo.innerHTML = `
            <i class="fas fa-hand-wave"></i> ¡Bienvenido de nuevo, ${nombre}! 
            <small style="opacity:0.8;">(${new Date().toLocaleDateString()})</small>
        `;
    }
    
    // Función para mostrar mensajes
    function mostrarMensaje(texto, tipo) {
        const mensaje = document.createElement('div');
        mensaje.textContent = texto;
        mensaje.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-weight: bold;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        if (tipo === 'success') {
            mensaje.style.backgroundColor = '#2ecc71';
            mensaje.style.color = 'white';
        } else {
            mensaje.style.backgroundColor = '#e74c3c';
            mensaje.style.color = 'white';
        }
        
        document.body.appendChild(mensaje);
        
        setTimeout(() => {
            mensaje.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => mensaje.remove(), 300);
        }, 3000);
    }
});