// Sistema de reservas para servicios
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn-comprar').forEach(boton => {
        if (boton.textContent.includes('Reservar') || boton.textContent.includes('Comenzar') || boton.textContent.includes('Unirse')) {
            boton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Obtener datos del servicio
                const card = this.closest('.producto-card');
                const servicio = card.querySelector('h3').textContent;
                const precio = card.querySelector('.producto-precio').textContent;
                
                // Mostrar formulario de reserva
                const modalHTML = `
                    <div id="modal-reserva" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:white; padding:30px; border-radius:10px; box-shadow:0 0 20px rgba(0,0,0,0.3); z-index:1000; width:90%; max-width:400px;">
                        <h3>Reservar: ${servicio}</h3>
                        <p>Precio: ${precio}</p>
                        
                        <form id="form-reserva" style="margin-top:15px;">
                            <label>Nombre:</label>
                            <input type="text" required style="width:100%; padding:8px; margin-bottom:10px;">
                            
                            <label>Email:</label>
                            <input type="email" required style="width:100%; padding:8px; margin-bottom:10px;">
                            
                            <label>Fecha deseada:</label>
                            <input type="date" required style="width:100%; padding:8px; margin-bottom:15px;">
                            
                            <div style="display:flex; gap:10px;">
                                <button type="submit" style="flex:1; padding:10px; background:#2ecc71; color:white; border:none; border-radius:5px;">
                                    Confirmar Reserva
                                </button>
                                <button type="button" onclick="cerrarReserva()" style="flex:1; padding:10px; background:#e74c3c; color:white; border:none; border-radius:5px;">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                    <div id="overlay-reserva" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999;"></div>
                `;
                
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                
                // Manejar envío del formulario
                document.getElementById('form-reserva').addEventListener('submit', function(e) {
                    e.preventDefault();
                    alert('¡Reserva confirmada! Te contactaremos pronto para coordinar los detalles.');
                    cerrarReserva();
                });
            });
        }
    });
    
    window.cerrarReserva = function() {
        document.getElementById('modal-reserva')?.remove();
        document.getElementById('overlay-reserva')?.remove();
    };
});