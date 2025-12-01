// Validación avanzada del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const mensajesTable = document.querySelector('table tbody');
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validarCampo(this);
        });
        
        input.addEventListener('input', function() {
            limpiarError(this);
        });
    });
    
    // Envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let valido = true;
        inputs.forEach(input => {
            if (!validarCampo(input)) {
                valido = false;
            }
        });
        
        if (valido) {
            // Simular envío exitoso
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const mensaje = document.getElementById('mensaje').value;
            
            // Agregar a la tabla de mensajes
            const nuevaFila = document.createElement('tr');
            nuevaFila.innerHTML = `
                <td>${nombre}</td>
                <td>${email}</td>
                <td>${mensaje.substring(0, 30)}${mensaje.length > 30 ? '...' : ''}</td>
                <td><span style="color: orange;">Pendiente</span></td>
            `;
            mensajesTable.insertBefore(nuevaFila, mensajesTable.firstChild);
            
            // Limpiar formulario
            form.reset();
            
            // Mostrar mensaje de éxito
            mostrarMensaje('¡Mensaje enviado! Te contactaremos pronto.', 'success');
            
            // Simular envío real después de 2 segundos
            setTimeout(() => {
                form.submit(); // Envío real a Formspree
            }, 2000);
        } else {
            mostrarMensaje('Por favor, corrige los errores en el formulario.', 'error');
        }
    });
    
    // Funciones de validación
    function validarCampo(campo) {
        const valor = campo.value.trim();
        const tipo = campo.type;
        const id = campo.id;
        
        limpiarError(campo);
        
        if (!valor) {
            mostrarError(campo, 'Este campo es obligatorio');
            return false;
        }
        
        if (id === 'email' && !validarEmail(valor)) {
            mostrarError(campo, 'Ingresa un email válido');
            return false;
        }
        
        if (id === 'nombre' && valor.length < 2) {
            mostrarError(campo, 'El nombre debe tener al menos 2 caracteres');
            return false;
        }
        
        if (id === 'mensaje' && valor.length < 10) {
            mostrarError(campo, 'El mensaje debe tener al menos 10 caracteres');
            return false;
        }
        
        return true;
    }
    
    function validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function mostrarError(campo, mensaje) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-mensaje';
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.9em';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = mensaje;
        
        campo.style.borderColor = '#e74c3c';
        campo.parentNode.appendChild(errorDiv);
    }
    
    function limpiarError(campo) {
        campo.style.borderColor = '#ddd';
        const error = campo.parentNode.querySelector('.error-mensaje');
        if (error) error.remove();
    }
    
    function mostrarMensaje(texto, tipo) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.textContent = texto;
        mensajeDiv.style.position = 'fixed';
        mensajeDiv.style.top = '20px';
        mensajeDiv.style.right = '20px';
        mensajeDiv.style.padding = '15px 20px';
        mensajeDiv.style.borderRadius = '5px';
        mensajeDiv.style.zIndex = '10000';
        mensajeDiv.style.fontWeight = 'bold';
        
        if (tipo === 'success') {
            mensajeDiv.style.backgroundColor = '#2ecc71';
            mensajeDiv.style.color = 'white';
        } else {
            mensajeDiv.style.backgroundColor = '#e74c3c';
            mensajeDiv.style.color = 'white';
        }
        
        document.body.appendChild(mensajeDiv);
        
        setTimeout(() => {
            mensajeDiv.remove();
        }, 5000);
    }
});