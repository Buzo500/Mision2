export function iniciarRender({
  mensaje,
  estadoResultados,
  tituloResultados,
  iconoEstado,
  contenedorRecetas,
  botonReintentar,
  selectorCategoria,
  resumen,
  resumenCategorias,
  detalle,
  nombreDetalle,
  origenDetalle,
  ingredientesDetalle,
  sinIngredientes,
  instruccionesDetalle,
}) {
  const documento = contenedorRecetas.ownerDocument;

  function cambiarCarga(cargando) {
    botonReintentar.disabled = cargando;
    selectorCategoria.disabled = cargando || selectorCategoria.options.length <= 1;
    contenedorRecetas.setAttribute("aria-busy", String(cargando));
  }

  function mostrarEstado(titulo, texto) {
    contenedorRecetas.textContent = "";
    estadoResultados.classList.remove("estado-error", "con-resultados");
    iconoEstado.hidden = false;
    botonReintentar.hidden = true;
    tituloResultados.textContent = titulo;
    mensaje.textContent = texto;
  }

  function mostrarError(texto = "No se han podido cargar las recetas. Vuelve a intentarlo en unos momentos.") {
    mostrarEstado(
      "Esta vez no hemos llegado a la mesa.",
      texto,
    );
    estadoResultados.classList.add("estado-error");
    botonReintentar.hidden = false;
  }

  function mostrarCategorias(categorias) {
    selectorCategoria.textContent = "";
    const todas = documento.createElement("option");
    todas.value = "";
    todas.textContent = "Todas las categorías";
    selectorCategoria.appendChild(todas);

    categorias.forEach((grupo) => {
      const opcion = documento.createElement("option");
      opcion.value = grupo.categoria;
      opcion.textContent = grupo.categoria;
      selectorCategoria.appendChild(opcion);
    });

    selectorCategoria.disabled = categorias.length === 0;
  }

  function mostrarResumen(categorias) {
    resumenCategorias.textContent = "";
    resumen.hidden = categorias.length === 0;

    categorias.forEach((grupo) => {
      const elemento = documento.createElement("li");
      const nombre = documento.createElement("span");
      nombre.textContent = grupo.categoria;
      const cantidad = documento.createElement("strong");
      cantidad.textContent = grupo.cantidad;
      elemento.appendChild(nombre);
      elemento.appendChild(cantidad);
      resumenCategorias.appendChild(elemento);
    });
  }

  function crearTarjeta(receta, indice) {
    const tarjeta = documento.createElement("article");
    tarjeta.classList.add("tarjeta-receta");

    const fotografia = documento.createElement("div");
    fotografia.classList.add("foto-receta");

    const sinImagen = documento.createElement("p");
    sinImagen.classList.add("sin-imagen");
    sinImagen.textContent = "Imagen no disponible";
    fotografia.appendChild(sinImagen);

    if (receta.imagen) {
      const imagen = documento.createElement("img");
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

    const categoria = documento.createElement("p");
    categoria.classList.add("categoria-receta");
    categoria.textContent = receta.categoria;

    const nombre = documento.createElement("h4");
    nombre.textContent = receta.nombre;

    const origen = documento.createElement("p");
    origen.classList.add("origen-receta");
    origen.textContent = receta.origen;

    const boton = documento.createElement("button");
    boton.type = "button";
    boton.classList.add("boton-texto", "ver-receta");
    boton.setAttribute("data-indice", indice);
    boton.setAttribute("aria-label", `Ver receta: ${receta.nombre}`);
    boton.textContent = "Ver receta";
    const flecha = documento.createElement("span");
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

  function mostrarRecetas(recetas, busqueda, categoria = "") {
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

  function mostrarDetalle(receta) {
    nombreDetalle.textContent = receta.nombre;
    origenDetalle.textContent = `${receta.categoria} · ${receta.origen}`;
    instruccionesDetalle.textContent = receta.instrucciones;
    ingredientesDetalle.textContent = "";
    sinIngredientes.hidden = receta.ingredientes.length > 0;

    receta.ingredientes.forEach((ingrediente) => {
      const elemento = documento.createElement("li");
      const nombre = documento.createElement("span");
      nombre.textContent = ingrediente.nombre;
      const cantidad = documento.createElement("span");
      cantidad.textContent = ingrediente.cantidad;
      elemento.appendChild(nombre);
      elemento.appendChild(cantidad);
      ingredientesDetalle.appendChild(elemento);
    });

    detalle.hidden = false;
    nombreDetalle.focus();
  }

  function ocultarDetalle() {
    detalle.hidden = true;
    nombreDetalle.textContent = "";
    origenDetalle.textContent = "";
    instruccionesDetalle.textContent = "";
    ingredientesDetalle.textContent = "";
  }

  return {
    cambiarCarga,
    mostrarEstado,
    mostrarError,
    mostrarRecetas,
    mostrarCategorias,
    mostrarResumen,
    mostrarDetalle,
    ocultarDetalle,
  };
}
