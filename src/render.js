const mensaje = document.querySelector("#mensaje");
const estadoResultados = document.querySelector("#estado-resultados");
const tituloResultados = document.querySelector("#titulo-resultados");
const iconoEstado = document.querySelector("#icono-estado");
const contenedorRecetas = document.querySelector("#recetas");
const entrada = document.querySelector("#busqueda");
const botonBuscar = document.querySelector("#boton-buscar");
const botonReintentar = document.querySelector("#boton-reintentar");
const selectorCategoria = document.querySelector("#categoria");
const resumen = document.querySelector("#resumen");
const resumenCategorias = document.querySelector("#resumen-categorias");
const detalle = document.querySelector("#detalle");
const nombreDetalle = document.querySelector("#detalle-nombre");
const origenDetalle = document.querySelector("#detalle-origen");
const ingredientesDetalle = document.querySelector("#detalle-ingredientes");
const sinIngredientes = document.querySelector("#sin-ingredientes");
const instruccionesDetalle = document.querySelector("#detalle-instrucciones");

export function cambiarCarga(cargando) {
  entrada.disabled = cargando;
  botonBuscar.disabled = cargando;
  botonReintentar.disabled = cargando;
  selectorCategoria.disabled = cargando || selectorCategoria.options.length <= 1;
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

export function mostrarCategorias(categorias) {
  selectorCategoria.textContent = "";
  const todas = document.createElement("option");
  todas.value = "";
  todas.textContent = "Todas las categorías";
  selectorCategoria.appendChild(todas);

  categorias.forEach((grupo) => {
    const opcion = document.createElement("option");
    opcion.value = grupo.categoria;
    opcion.textContent = grupo.categoria;
    selectorCategoria.appendChild(opcion);
  });

  selectorCategoria.disabled = categorias.length === 0;
}

export function mostrarResumen(categorias) {
  resumenCategorias.textContent = "";
  resumen.hidden = categorias.length === 0;

  categorias.forEach((grupo) => {
    const elemento = document.createElement("li");
    const nombre = document.createElement("span");
    nombre.textContent = grupo.categoria;
    const cantidad = document.createElement("strong");
    cantidad.textContent = grupo.cantidad;
    elemento.appendChild(nombre);
    elemento.appendChild(cantidad);
    resumenCategorias.appendChild(elemento);
  });
}

function crearTarjeta(receta, indice) {
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

  const boton = document.createElement("button");
  boton.type = "button";
  boton.classList.add("boton-texto", "ver-receta");
  boton.setAttribute("data-indice", indice);
  boton.setAttribute("aria-label", `Ver receta: ${receta.nombre}`);
  boton.textContent = "Ver receta";
  const flecha = document.createElement("span");
  flecha.textContent = "↗";
  flecha.setAttribute("aria-hidden", "true");
  boton.appendChild(flecha);

  tarjeta.appendChild(fotografia);
  tarjeta.appendChild(categoria);
  tarjeta.appendChild(nombre);
  tarjeta.appendChild(origen);
  tarjeta.appendChild(boton);
  return tarjeta;
}

export function mostrarRecetas(recetas, busqueda, categoria = "") {
  if (recetas.length === 0) {
    mostrarEstado(
      "Un destino por descubrir.",
      categoria
        ? `No hay recetas de la categoría «${categoria}» en esta búsqueda. Prueba con todas las categorías.`
        : `No hay recetas para «${busqueda}». Prueba otro nombre en inglés, como chicken o cake.`,
    );
    return;
  }

  const titulo = recetas.length === 1 ? "1 receta para descubrir" : `${recetas.length} recetas para descubrir`;
  const textoCategoria = categoria ? ` Categoría: ${categoria}.` : "";
  mostrarEstado(titulo, `Resultados para «${busqueda}».${textoCategoria}`);
  estadoResultados.classList.add("con-resultados");
  iconoEstado.hidden = true;

  recetas.forEach((receta, indice) => {
    contenedorRecetas.appendChild(crearTarjeta(receta, indice));
  });
}

export function mostrarDetalle(receta) {
  nombreDetalle.textContent = receta.nombre;
  origenDetalle.textContent = `${receta.categoria} · ${receta.origen}`;
  instruccionesDetalle.textContent = receta.instrucciones;
  ingredientesDetalle.textContent = "";
  sinIngredientes.hidden = receta.ingredientes.length > 0;

  receta.ingredientes.forEach((ingrediente) => {
    const elemento = document.createElement("li");
    const nombre = document.createElement("span");
    nombre.textContent = ingrediente.nombre;
    const cantidad = document.createElement("span");
    cantidad.textContent = ingrediente.cantidad;
    elemento.appendChild(nombre);
    elemento.appendChild(cantidad);
    ingredientesDetalle.appendChild(elemento);
  });

  detalle.hidden = false;
  nombreDetalle.focus();
}

export function ocultarDetalle() {
  detalle.hidden = true;
  nombreDetalle.textContent = "";
  origenDetalle.textContent = "";
  instruccionesDetalle.textContent = "";
  ingredientesDetalle.textContent = "";
}
