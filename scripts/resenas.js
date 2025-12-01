// Sistema de votación para reseñas
document.addEventListener('DOMContentLoaded', function() {
    // Agregar botones de votación a cada reseña
    document.querySelectorAll('.resena-card').forEach(resena => {
        const botonesDiv = document.createElement('div');
        botonesDiv.style.marginTop = '10px';
        botonesDiv.style.display = 'flex';
        botonesDiv.style.gap = '10px';
        
        botonesDiv.innerHTML = `
            <button class="btn-votar" data-voto="positivo" style="padding:5px 10px; background:#2ecc71; color:white; border:none; border-radius:5px;">
                <i class="fas fa-thumbs-up"></i> Útil
                <span class="contador-positivo">0</span>
            </button>
            <button class="btn-votar" data-voto="negativo" style="padding:5px 10px; background:#e74c3c; color:white; border:none; border-radius:5px;">
                <i class="fas fa-thumbs-down"></i> No útil
                <span class="contador-negativo">0</span>
            </button>
        `;
        
        resena.appendChild(botonesDiv);
        
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
                this.style.opacity = '0.8';
                
                // Guardar en localStorage
                const resenaId = resena.querySelector('.resena-cliente').textContent;
                guardarVoto(resenaId, tipo);
            });
        });
    });
    
    // Formulario para nueva reseña
    const formularioResena = document.createElement('div');
    formularioResena.innerHTML = `
        <div style="margin-top:40px; padding:20px; background:#f8f9fa; border-radius:10px;">
            <h2>Deja tu reseña</h2>
            <form id="nueva-resena">
                <input type="text" placeholder="Tu nombre" required style="width:100%; padding:10px; margin-bottom:10px;">
                <textarea placeholder="Tu experiencia..." rows="3" required style="width:100%; padding:10px; margin-bottom:10px;"></textarea>
                <div style="margin-bottom:10px;">
                    <label>Calificación:</label>
                    <div class="estrellas">
                        ${'<i class="fas fa-star" data-rating="1"></i>'.repeat(5)}
                    </div>
                </div>
                <button type="submit" style="padding:10px 20px; background:#3498db; color:white; border:none; border-radius:5px;">
                    Enviar Reseña
                </button>
            </form>
        </div>
    `;
    
    // Insertar después de las reseñas existentes
    const seccionResenas = document.querySelector('.resenas');
    if (seccionResenas) {
        seccionResenas.parentNode.insertBefore(formularioResena, seccionResenas.nextSibling);
        
        // Manejar estrellas
        const estrellas = formularioResena.querySelectorAll('.fa-star');
        let rating = 0;
        
        estrellas.forEach(estrella => {
            estrella.addEventListener('mouseover', function() {
                const valor = parseInt(this.getAttribute('data-rating'));
                resaltarEstrellas(valor);
            });
            
            estrella.addEventListener('click', function() {
                rating = parseInt(this.getAttribute('data-rating'));
                resaltarEstrellas(rating);
            });
        });
        
        formularioResena.querySelector('.estrellas').addEventListener('mouseleave', function() {
            resaltarEstrellas(rating);
        });
        
        // Enviar nueva reseña
        document.getElementById('nueva-resena').addEventListener('submit', function(e) {
            e.preventDefault();
            const nombre = this.querySelector('input').value;
            const texto = this.querySelector('textarea').value;
            
            if (rating === 0) {
                alert('Por favor, selecciona una calificación con estrellas');
                return;
            }
            
            // Crear nueva reseña
            const nuevaResena = document.createElement('article');
            nuevaResena.className = 'resena-card';
            nuevaResena.innerHTML = `
                <div class="resena-cliente">${nombre}</div>
                <div class="estrellas-resena" style="color:#f1c40f; margin-bottom:5px;">
                    ${'<i class="fas fa-star"></i>'.repeat(rating)}
                </div>
                <div class="resena-texto">${texto}</div>
            `;
            
            // Insertar al principio
            seccionResenas.insertBefore(nuevaResena, seccionResenas.firstChild);
            
            // Limpiar formulario
            this.reset();
            rating = 0;
            resaltarEstrellas(0);
            
            alert('¡Gracias por tu reseña!');
        });
    }
    
    function resaltarEstrellas(num) {
        const estrellas = formularioResena.querySelectorAll('.fa-star');
        estrellas.forEach((estrella, index) => {
            if (index < num) {
                estrella.style.color = '#f1c40f';
            } else {
                estrella.style.color = '#ddddddff';
            }
        });
    }
    
    function guardarVoto(resenaId, tipo) {
        const votos = JSON.parse(localStorage.getItem('votosResenas') || '{}');
        if (!votos[resenaId]) {
            votos[resenaId] = { positivo: 0, negativo: 0 };
        }
        votos[resenaId][tipo]++;
        localStorage.setItem('votosResenas', JSON.stringify(votos));
    }
});