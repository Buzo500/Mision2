const PREFIJO_CACHE = "pasaporte:recetas:v1:";
const DURACION_CACHE_MS = 24 * 60 * 60 * 1000;

export function leerCache(busqueda) {
  try {
    const guardado = localStorage.getItem(`${PREFIJO_CACHE}${busqueda}`);
    if (guardado === null) return null;

    const entrada = JSON.parse(guardado);
    const antiguedad = Date.now() - entrada?.fecha;
    if (
      !Number.isFinite(entrada?.fecha) ||
      antiguedad < 0 ||
      antiguedad >= DURACION_CACHE_MS ||
      !Array.isArray(entrada?.datos)
    ) {
      return null;
    }

    return entrada.datos;
  } catch (error) {
    // Una caché dañada o bloqueada no debe impedir consultar la API.
    console.warn("No se ha podido leer la caché de recetas:", error);
    return null;
  }
}

export function guardarCache(busqueda, recetas) {
  try {
    const entrada = { fecha: Date.now(), datos: recetas };
    localStorage.setItem(`${PREFIJO_CACHE}${busqueda}`, JSON.stringify(entrada));
  } catch (error) {
    // Si no hay espacio o permiso, las recetas recibidas se muestran igualmente.
    console.warn("No se ha podido guardar la caché de recetas:", error);
  }
}
