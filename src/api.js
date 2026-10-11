const URL_API = "https://www.themealdb.com/api/json/v1/1/search.php";

export async function buscarRecetas(nombre) {
  const parametros = new URLSearchParams({ s: nombre });
  const respuesta = await fetch(`${URL_API}?${parametros}`);

  if (!respuesta.ok) {
    throw new Error(
      `No se pudieron cargar las recetas (error HTTP ${respuesta.status}).`,
    );
  }

  const datos = await respuesta.json();

  if (datos?.meals === undefined) {
    throw new Error("La API ha devuelto una respuesta inesperada.");
  }

  // TheMealDB devuelve null cuando la búsqueda no encuentra recetas.
  return datos.meals ?? [];
}
