# Async Odyssey

Misión M2 · Async Odyssey

## Uso de IA

Utilicé ChatGPT como apoyo para explorar ideas acerca del diseño de la página y como estructurar los distintos scripts. Dos prompts reales relevantes fueron:

- «Quiero que me des ideas para hacer la misión 2».
- «Crees que debería dividir la parte de los scripts en distintos archivos? M eesta quedando bastante largo y aún me queda bastante...».

Dentro de las ideas que me dio para la página estaban hacer como una pokedex de busqueda de pokemon usando una api publica que hay pero al final me decanté por la que he usado ahora que es la busqueda de recetas de cocina.

Revisé los cambios fase a fase antes de confirmarlos en Git y mantuve separados el HTML, el CSS y los JavaScript.

## Autopsia

1. Buscar al enviar el formulario: La API se consulta al pulsar «Buscar» o Enter, sin generar peticiones con cada pulsación. El campo y el botón Buscar permanecen activos durante la carga para poder cambiar de búsqueda. Cada consulta recibe un identificador y solo la más reciente puede actualizar los resultados, los errores, la carga y el foco. Las peticiones anteriores siguen su curso y pueden guardar sus datos en caché, pero sus respuestas no sobrescriben la interfaz. El filtro de categorías permanece desactivado mientras se esperan los nuevos resultados.

2. Guardar la caché con caducidad: Cada búsqueda se guarda en `localStorage` junto con su fecha, en el formato `{ fecha, datos }`. Los resultados se reutilizan durante 24 horas, incluso después de recargar la página; pasada esa duración, la siguiente búsqueda vuelve a consultar la API. Las entradas antiguas sin fecha, dañadas o caducadas se ignoran. Un array vacío sigue siendo una búsqueda válida sin resultados. Si el almacenamiento está bloqueado o lleno, la aplicación sigue funcionando mediante la API.
