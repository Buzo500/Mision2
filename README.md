# Alquimista Express

Misión M2 · Async Odyssey

## Uso de IA

Utilicé ChatGPT como apoyo para explorar ideas acerca del diseño de la página y como estructurar los distintos scripts. Dos prompts reales relevantes fueron:

- «Quiero que me des ideas para hacer la misión 2».
- «Crees que debería dividir la parte de los scripts en distintos archivos? M eesta quedando bastante largo y aún me queda bastante...».

Dentro de las ideas que me dio para la página estaban hacer como una pokedex de busqueda de pokemon usando una api publica que hay pero al final me decanté por la que he usado ahora que es la busqueda de recetas de cocina.

Revisé los cambios fase a fase antes de confirmarlos en Git y mantuve separados el HTML, el CSS y los JavaScript.

## Autopsia

1. Buscar al enviar el formulario: La API se consulta al pulsar «Buscar» o Enter. Descarté buscar con cada pulsación porque generaría peticiones mientras el usuario todavía está escribiendo y complicaría el control del orden de las respuestas. Durante la búsqueda se desactivan los controles para evitar consultas simultáneas.

2. Guardar la caché sin caducidad automática: Cada búsqueda se guarda en `localStorage` para reutilizar sus resultados, incluso después de recargar la página. Descarté añadir fechas de expiración para mantener una implementación sencilla y fácil de explicar. Como contrapartida, si una receta cambia en la API, habrá que eliminar su entrada de caché para obtener la versión actualizada.