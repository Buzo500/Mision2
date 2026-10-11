function textoConDefecto(valor, porDefecto) {
  return typeof valor === "string" && valor.trim() ? valor.trim() : porDefecto;
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
    }));
}
