import { leerCache, guardarCache } from "./cache.js";

const URL_API = "https://www.themealdb.com/api/json/v1/1/search.php";

export class ErrorBusqueda extends Error {}

export async function buscarRecetas(nombre) {
  const busqueda = nombre.trim().toLowerCase();
  const guardadas = leerCache(busqueda);

  // null indica que no hay caché válida; [] es una búsqueda guardada sin resultados.
  if (guardadas !== null) return guardadas;

  const parametros = new URLSearchParams({ s: busqueda });
  let respuesta;
  try {
    respuesta = await fetch(`${URL_API}?${parametros}`);
  } catch (error) {
    throw new ErrorBusqueda(
      "No se ha podido conectar con el servicio de recetas. Comprueba tu conexión y vuelve a intentarlo.",
      { cause: error },
    );
  }

  if (!respuesta.ok) {
    throw new ErrorBusqueda(
      `No se pudieron cargar las recetas (error HTTP ${respuesta.status}).`,
    );
  }

  let datos;
  try {
    datos = await respuesta.json();
  } catch (error) {
    const mensaje = error instanceof SyntaxError
      ? "El servicio de recetas ha devuelto una respuesta que no es JSON válido."
      : "No se ha podido leer la respuesta del servicio de recetas. Vuelve a intentarlo.";
    throw new ErrorBusqueda(mensaje, { cause: error });
  }

  if (datos?.meals !== null && !Array.isArray(datos?.meals)) {
    throw new ErrorBusqueda("La API ha devuelto una respuesta inesperada.");
  }

  // TheMealDB devuelve null cuando la búsqueda no encuentra recetas.
  const recetas = datos.meals ?? [];
  guardarCache(busqueda, recetas);
  return recetas;
}
