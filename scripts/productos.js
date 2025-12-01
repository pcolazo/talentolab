const productos = document.querySelectorAll(".producto-card");

productos.forEach(producto => {
  const descripcion = producto.querySelector("p");

  descripcion.style.display = "none";

  const botonVer = document.createElement("button");
  botonVer.textContent = "Ver descripción";
  botonVer.classList.add("btn-comprar"); // 👈 reutilizamos la clase

  const precio = producto.querySelector(".producto-precio");
  precio.insertAdjacentElement("afterend", botonVer);

  botonVer.addEventListener("click", () => {
    if (descripcion.style.display === "none") {
      descripcion.style.display = "block";
      botonVer.textContent = "Ocultar descripción";
    } else {
      descripcion.style.display = "none";
      botonVer.textContent = "Ver descripción";
    }
  });
});
