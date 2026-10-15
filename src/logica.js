function textoConDefecto(valor, porDefecto) {
  return typeof valor === "string" && valor.trim() ? valor.trim() : porDefecto;
}

function prepararIngredientes(receta) {
  // La API reparte los ingredientes y sus cantidades en veinte campos numerados.
  return Array.from({ length: 20 })
    .map((valor, indice) => ({
      nombre: textoConDefecto(receta[`strIngredient${indice + 1}`], ""),
      cantidad: textoConDefecto(receta[`strMeasure${indice + 1}`], ""),
    }))
    .filter((ingrediente) => ingrediente.nombre !== "");
}

export function prepararRecetas(datos) {
  // Conservamos los campos que utiliza la interfaz y damos valor a los ausentes.
  return datos
    .filter((receta) => receta !== null && typeof receta === "object")
    .map((receta) => ({
      id: textoConDefecto(receta.idMeal, ""),
      nombre: textoConDefecto(receta.strMeal, "Receta sin nombre"),
      categoria: textoConDefecto(receta.strCategory, "Sin categoría"),
      origen: textoConDefecto(receta.strArea, "Origen no disponible"),
      imagen: textoConDefecto(receta.strMealThumb, ""),
      instrucciones: textoConDefecto(receta.strInstructions, "Preparación no disponible."),
      ingredientes: prepararIngredientes(receta),
    }));
}

export function filtrarPorCategoria(recetas, categoria) {
  return recetas.filter((receta) => categoria === "" || receta.categoria === categoria);
}

export function resumirCategorias(recetas) {
  const grupos = recetas.reduce((resumen, receta) => {
    const cantidad = resumen.get(receta.categoria) ?? 0;
    resumen.set(receta.categoria, cantidad + 1);
    return resumen;
  }, new Map());

  return Array.from(grupos, ([categoria, cantidad]) => ({ categoria, cantidad }));
}
