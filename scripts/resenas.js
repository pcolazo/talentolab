// Sistema de votación para reseñas
document.addEventListener('DOMContentLoaded', function() {
    console.log('resenas.js cargado correctamente');
    
    // AGREGAR CSS PARA LAS ESTRELLAS
    const starStyles = document.createElement('style');
    starStyles.textContent = `
        .estrellas {
            display: inline-flex;
            gap: 5px;
            margin-left: 10px;
        }
        .fa-star {
            color: #ddd;
            cursor: pointer;
            font-size: 20px;
            transition: color 0.3s;
        }
        .fa-star:hover {
            color: #f1c40f;
        }
        .estrella-seleccionada {
            color: #f1c40f !important;
        }
        .estrellas-resena {
            color: #f1c40f;
            margin-bottom: 5px;
            font-size: 16px;
        }
        .btn-votar {
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .btn-votar[data-voto="positivo"] {
            background: #2ecc71;
            color: white;
        }
        .btn-votar[data-voto="negativo"] {
            background: #e74c3c;
            color: white;
        }
        .btn-votar:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(starStyles);
    
    // 1. Sistema de votación para reseñas existentes
    document.querySelectorAll('.resena-card').forEach(resena => {
        const botonesDiv = document.createElement('div');
        botonesDiv.style.marginTop = '10px';
        botonesDiv.style.display = 'flex';
        botonesDiv.style.gap = '10px';
        
        botonesDiv.innerHTML = `
            <button class="btn-votar" data-voto="positivo">
                <i class="fas fa-thumbs-up"></i> Útil
                <span class="contador-positivo">0</span>
            </button>
            <button class="btn-votar" data-voto="negativo">
                <i class="fas fa-thumbs-down"></i> No útil
                <span class="contador-negativo">0</span>
            </button>
        `;
        
        resena.appendChild(botonesDiv);
        
        // Cargar votos guardados
        const resenaId = resena.querySelector('.resena-cliente').textContent;
        const votos = JSON.parse(localStorage.getItem('votosResenas') || '{}');
        if (votos[resenaId]) {
            const contadorPositivo = botonesDiv.querySelector('.contador-positivo');
            const contadorNegativo = botonesDiv.querySelector('.contador-negativo');
            contadorPositivo.textContent = votos[resenaId].positivo || 0;
            contadorNegativo.textContent = votos[resenaId].negativo || 0;
            
            // Deshabilitar botones si ya votó
            const yaVoto = localStorage.getItem(`voto_${resenaId}`);
            if (yaVoto) {
                botonesDiv.querySelectorAll('.btn-votar').forEach(b => b.disabled = true);
            }
        }
        
        // Manejar votos
        const botones = botonesDiv.querySelectorAll('.btn-votar');
        botones.forEach(boton => {
            boton.addEventListener('click', function() {
                const tipo = this.getAttribute('data-voto');
                const contador = this.querySelector(`.contador-${tipo}`);
                let count = parseInt(contador.textContent) || 0;
                contador.textContent = count + 1;
                
                // Deshabilitar botones después de votar
                botones.forEach(b => b.disabled = true);
                
                // Guardar en localStorage
                guardarVoto(resenaId, tipo);
            });
        });
    });
    
    // 2. Formulario para nueva reseña
    const seccionResenas = document.querySelector('.resenas');
    if (seccionResenas) {
        const formularioResena = document.createElement('div');
        formularioResena.innerHTML = `
            <div style="margin-top:40px; padding:20px; background:#f8f9fa; border-radius:10px;">
                <h2>Deja tu reseña</h2>
                <form id="nueva-resena">
                    <input type="text" placeholder="Tu nombre" required 
                           style="width:100%; padding:10px; margin-bottom:10px;">
                    <textarea placeholder="Tu experiencia..." rows="3" required 
                              style="width:100%; padding:10px; margin-bottom:10px;"></textarea>
                    <div style="margin-bottom:10px; display:flex; align-items:center;">
                        <label style="margin-right:10px;">Calificación:</label>
                        <div class="estrellas">
                            <i class="fas fa-star" data-rating="1"></i>
                            <i class="fas fa-star" data-rating="2"></i>
                            <i class="fas fa-star" data-rating="3"></i>
                            <i class="fas fa-star" data-rating="4"></i>
                            <i class="fas fa-star" data-rating="5"></i>
                        </div>
                        <span id="rating-text" style="margin-left:10px; color:#666;"></span>
                    </div>
                    <button type="submit" 
                            style="padding:10px 20px; background:#3498db; color:white; border:none; border-radius:5px;">
                        Enviar Reseña
                    </button>
                </form>
            </div>
        `;
        
        seccionResenas.parentNode.insertBefore(formularioResena, seccionResenas.nextSibling);
        
        // 3. CORRECCIÓN: Sistema de estrellas mejorado
        const estrellas = formularioResena.querySelectorAll('.fa-star');
        let ratingSeleccionado = 0;
        const ratingText = formularioResena.querySelector('#rating-text');
        
        // Función para actualizar visualmente las estrellas
        function actualizarEstrellas(rating) {
            estrellas.forEach(estrella => {
                const valorEstrella = parseInt(estrella.getAttribute('data-rating'));
                
                if (valorEstrella <= rating) {
                    estrella.classList.add('estrella-seleccionada');
                } else {
                    estrella.classList.remove('estrella-seleccionada');
                }
            });
            
            // Actualizar texto
            const textos = ["", "Malo", "Regular", "Bueno", "Muy bueno", "Excelente"];
            ratingText.textContent = rating > 0 ? textos[rating] : "";
        }
        
        // Evento para cuando el mouse PASA POR ENCIMA (previsualización)
        estrellas.forEach(estrella => {
            estrella.addEventListener('mouseover', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                actualizarEstrellas(rating);
            });
        });
        
        // Evento para cuando el mouse SALE del contenedor de estrellas
        formularioResena.querySelector('.estrellas').addEventListener('mouseleave', function() {
            actualizarEstrellas(ratingSeleccionado);
        });
        
        // Evento para cuando se HACE CLIC (selección definitiva)
        estrellas.forEach(estrella => {
            estrella.addEventListener('click', function() {
                ratingSeleccionado = parseInt(this.getAttribute('data-rating'));
                console.log('Estrella seleccionada:', ratingSeleccionado);
                actualizarEstrellas(ratingSeleccionado);
            });
        });
        
        // 4. Enviar nueva reseña
        formularioResena.querySelector('#nueva-resena').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = this.querySelector('input').value.trim();
            const texto = this.querySelector('textarea').value.trim();
            
            if (!nombre || !texto) {
                alert('Por favor, completa todos los campos');
                return;
            }
            
            if (ratingSeleccionado === 0) {
                alert('Por favor, selecciona una calificación con estrellas');
                return;
            }
            
            // Crear nueva reseña
            const nuevaResena = document.createElement('article');
            nuevaResena.className = 'resena-card';
            
            // Crear estrellas para la reseña
            let estrellasHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= ratingSeleccionado) {
                    estrellasHTML += '<i class="fas fa-star" style="color:#f1c40f;"></i>';
                } else {
                    estrellasHTML += '<i class="fas fa-star" style="color:#ddd;"></i>';
                }
            }
            
            nuevaResena.innerHTML = `
                <div class="resena-cliente">${nombre}</div>
                <div class="estrellas-resena">${estrellasHTML}</div>
                <div class="resena-texto">${texto}</div>
            `;
            
            // Insertar al principio de las reseñas
            seccionResenas.insertBefore(nuevaResena, seccionResenas.firstChild);
            
            // Limpiar formulario
            this.reset();
            ratingSeleccionado = 0;
            actualizarEstrellas(0);
            ratingText.textContent = "";
            
            // Mostrar mensaje de éxito
            const mensaje = document.createElement('div');
            mensaje.textContent = '¡Gracias por tu reseña!';
            mensaje.style.cssText = 'background: #2ecc71; color: white; padding: 10px; border-radius: 5px; margin-top: 10px; text-align: center;';
            this.appendChild(mensaje);
            setTimeout(() => mensaje.remove(), 3000);
        });
    }
    
    // Función para guardar votos en localStorage
    function guardarVoto(resenaId, tipo) {
        const votos = JSON.parse(localStorage.getItem('votosResenas') || '{}');
        if (!votos[resenaId]) {
            votos[resenaId] = { positivo: 0, negativo: 0 };
        }
        votos[resenaId][tipo]++;
        localStorage.setItem('votosResenas', JSON.stringify(votos));
        localStorage.setItem(`voto_${resenaId}`, 'true');
    }
});