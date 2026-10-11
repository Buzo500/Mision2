const mensaje = document.querySelector("#mensaje");
const estadoResultados = document.querySelector("#estado-resultados");
const tituloResultados = document.querySelector("#titulo-resultados");
const iconoEstado = document.querySelector("#icono-estado");
const contenedorRecetas = document.querySelector("#recetas");
const entrada = document.querySelector("#busqueda");
const botonBuscar = document.querySelector("#boton-buscar");
const botonReintentar = document.querySelector("#boton-reintentar");

export function cambiarCarga(cargando) {
  entrada.disabled = cargando;
  botonBuscar.disabled = cargando;
  botonReintentar.disabled = cargando;
  contenedorRecetas.setAttribute("aria-busy", String(cargando));
}

export function mostrarEstado(titulo, texto) {
  contenedorRecetas.textContent = "";
  estadoResultados.classList.remove("estado-error", "con-resultados");
  iconoEstado.hidden = false;
  botonReintentar.hidden = true;
  tituloResultados.textContent = titulo;
  mensaje.textContent = texto;
}

export function mostrarError() {
  mostrarEstado(
    "Esta vez no hemos llegado a la mesa.",
    "No se han podido cargar las recetas. Comprueba tu conexión o vuelve a intentarlo en unos momentos.",
  );
  estadoResultados.classList.add("estado-error");
  botonReintentar.hidden = false;
}

function crearTarjeta(receta) {
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("tarjeta-receta");

  const fotografia = document.createElement("div");
  fotografia.classList.add("foto-receta");

  const sinImagen = document.createElement("p");
  sinImagen.classList.add("sin-imagen");
  sinImagen.textContent = "Imagen no disponible";
  fotografia.appendChild(sinImagen);

  if (receta.imagen) {
    const imagen = document.createElement("img");
    imagen.alt = receta.nombre;
    imagen.loading = "lazy";
    sinImagen.hidden = true;
    imagen.addEventListener("error", () => {
      imagen.hidden = true;
      sinImagen.hidden = false;
    });
    imagen.src = receta.imagen;
    fotografia.appendChild(imagen);
  }

  const categoria = document.createElement("p");
  categoria.classList.add("categoria-receta");
  categoria.textContent = receta.categoria;

  const nombre = document.createElement("h4");
  nombre.textContent = receta.nombre;

  const origen = document.createElement("p");
  origen.classList.add("origen-receta");
  origen.textContent = receta.origen;

  tarjeta.appendChild(fotografia);
  tarjeta.appendChild(categoria);
  tarjeta.appendChild(nombre);
  tarjeta.appendChild(origen);
  return tarjeta;
}

export function mostrarRecetas(recetas, busqueda) {
  if (recetas.length === 0) {
    mostrarEstado(
      "Un destino por descubrir.",
      `No hay recetas para «${busqueda}». Prueba otro nombre en inglés, como chicken o cake.`,
    );
    return;
  }

  const titulo = recetas.length === 1 ? "1 receta para descubrir" : `${recetas.length} recetas para descubrir`;
  mostrarEstado(titulo, `Resultados para «${busqueda}».`);
  estadoResultados.classList.add("con-resultados");
  iconoEstado.hidden = true;

  recetas.forEach((receta) => {
    contenedorRecetas.appendChild(crearTarjeta(receta));
  });
}
