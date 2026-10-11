# Pasaporte gastronómico

Proyecto de la misión 2 de Programación Web I: una aplicación para descubrir recetas mediante la API pública TheMealDB, con Vite y JavaScript.

## Estado del proyecto

**Fase 4 de 5 terminada.** El buscador consulta TheMealDB al pulsar Buscar o Enter y muestra tarjetas con fotografía, nombre, categoría y procedencia. Permite filtrar las recetas por categoría, consultar un resumen de la búsqueda y abrir los ingredientes y la preparación en la misma página. Las búsquedas válidas se guardan en `localStorage` para reutilizarlas sin repetir la petición, incluso después de recargar la página. Se mantienen los estados de inicio, carga, error y sin resultados, y el botón para reintentar.

| Fase | Contenido | Estado |
| --- | --- | --- |
| 1 | Vite, HTML, CSS y módulos iniciales | Terminada |
| 2 | Búsqueda real, tarjetas y estados de carga, error y vacío | Terminada |
| 3 | Filtro por categoría, resumen y detalle de receta | Terminada |
| 4 | Caché de respuestas en localStorage | Terminada |
| 5 | Revisión de casos límite y documentación final | Pendiente |

El filtro y el detalle aprovechan los datos de la búsqueda actual, sin nuevas peticiones. La caché cumple el bonus de evitar consultas repetidas a la API cuando el navegador permite guardar los datos.

## Puesta en marcha

Se necesita una versión de Node.js compatible con Vite 8. El entorno de trabajo utiliza Node.js 24.15.0.

```bash
npm install
npm run dev
```

Abre la dirección que indique la terminal. Para generar y revisar la versión de producción:

```bash
npm run build
npm run preview
```

`package-lock.json` fija las versiones de las dependencias y se incluye en Git. `node_modules` y `dist` se excluyen mediante `.gitignore`. Vite es la única dependencia del proyecto.

## Cómo funciona la búsqueda

1. `main.js` escucha el evento `submit` y evita que el formulario recargue la página.
2. Se eliminan los espacios de los extremos con `trim`. Si solo hay espacios, se muestra una indicación y no se hace ninguna petición.
3. Se muestra el mensaje de carga y se desactivan temporalmente la entrada y el botón. La variable `cargando` también impide iniciar otra búsqueda mientras hay una pendiente.
4. `api.js` normaliza el nombre con `trim().toLowerCase()` y consulta la caché. Si existe un array guardado, lo devuelve directamente. Si no, construye la consulta con `URLSearchParams`, llama a `fetch`, comprueba `respuesta.ok`, lee el JSON y guarda el resultado válido.
5. `logica.js` descarta elementos que no son objetos con `filter` y utiliza `map` para preparar los campos que mostrará la interfaz.
6. `render.js` crea las tarjetas con `createElement` y escribe los textos con `textContent`.
7. Si hay un error, `catch` muestra un mensaje y permite reintentar. `finally` recupera los controles tanto en éxito como en error.

La búsqueda se realiza por nombre de plato, principalmente en inglés. No se hace una petición por cada tecla pulsada. El botón de reintento utiliza la última consulta fallida, aunque se haya escrito otro texto después.

## Caché en localStorage

`cache.js` se encarga únicamente de leer y guardar. Utiliza `getItem`, `setItem`, `JSON.parse` y `JSON.stringify`, con `try/catch` para que un problema de almacenamiento no interrumpa la búsqueda.

- Cada búsqueda tiene su propia clave, por ejemplo `pasaporte:recetas:v1:chicken`. El prefijo identifica los datos de esta aplicación.
- `Chicken`, `chicken` y ` chicken ` usan la misma clave. La consulta enviada a la API también está normalizada; el texto visible conserva lo escrito por el usuario, sin los espacios exteriores.
- `leerCache` devuelve `null` cuando no hay datos válidos y un array cuando hay una búsqueda guardada. Un array vacío `[]` también es un acierto de caché: indica que esa búsqueda no encontró recetas.
- Se guardan los datos completos de las recetas para mantener disponibles las categorías, los ingredientes y la preparación. No se guardan los archivos de las imágenes, solo sus direcciones.
- Los errores HTTP, de red, de JSON o de estructura de la respuesta no se guardan. Una respuesta válida debe contener `meals: null` o un array.
- Si el JSON guardado está dañado o no contiene un array, se consulta la API. Una respuesta correcta reemplaza esa entrada. Si `localStorage` está bloqueado o lleno, se siguen mostrando las recetas recibidas, aunque puede ser necesario volver a pedirlas en futuras búsquedas.

La caché pertenece al navegador y al origen de la página: cambiar de navegador o de puerto de Vite utiliza otro almacenamiento. Se conserva hasta que se borren sus entradas; no tiene caducidad automática. Esto simplifica el código, pero una receta actualizada en la API no se renovará mientras se conserve su búsqueda guardada. Para renovarla, se puede eliminar su clave concreta desde DevTools, sin borrar otros datos del navegador.

La caché permite consultar datos ya guardados sin conexión mientras la aplicación está abierta. No convierte la web en una aplicación completamente disponible sin conexión: la página y las fotografías pueden necesitar red.

## Filtro, resumen y detalle

- **Categorías:** el selector contiene las categorías presentes en la búsqueda. `filtrarPorCategoria` utiliza `filter`; la opción «Todas las categorías» tiene el valor vacío y permite ver de nuevo todas las recetas.
- **Resumen:** `resumirCategorias` utiliza `reduce` para acumular un array de grupos con su categoría y cantidad. `find` busca si el grupo ya existe: si existe, suma uno; si no, lo añade. El resumen «En esta búsqueda» cuenta todas las recetas recibidas y no cambia al seleccionar una categoría. El contador sobre las tarjetas sí refleja las recetas visibles.
- **Ingredientes:** TheMealDB devuelve veinte pares de campos numerados. `Array.from` y `map` los convierten en objetos con nombre y cantidad; `filter` descarta los nombres vacíos. Una cantidad ausente se deja en blanco.
- **Detalle:** un único evento `click` en el contenedor de tarjetas localiza el botón con `closest`. Su atributo `data-indice` indica la posición dentro del array de recetas visibles, de modo que también funciona después de filtrar o si falta el identificador de la API.
- **Nuevas búsquedas:** se vacían los datos anteriores, se restablece el selector y se ocultan el resumen y el detalle. Cambiar de categoría también cierra el detalle para que no quede abierta una receta ajena a las tarjetas visibles.

`recetasCargadas` conserva el resultado completo y `recetasVisibles` contiene el resultado del filtro. Los ingredientes y las instrucciones ya vienen en la respuesta de búsqueda: no hace falta consultar otro endpoint. Los nombres, ingredientes y preparación se muestran en el idioma original de la API.

## Estructura

```text
index.html       Estructura de la página y controles
src/main.js      Eventos y coordinación de búsqueda, filtro y detalle
src/api.js       Petición HTTP y lectura de la respuesta
src/cache.js     Lectura y escritura de búsquedas en localStorage
src/logica.js    Transformación, filtrado y resumen de los datos
src/render.js    Estados, categorías, tarjetas y detalle en el DOM
src/style.css    Diseño, tarjetas, resumen y detalle
public/images/  Fotografía estática de la portada
package.json    Módulos ES, scripts y dependencia de Vite
```

La interfaz sigue recibiendo un array tanto si procede de la API como de la caché; `main.js` y `render.js` no necesitan conocer su origen.

## Estados y datos incompletos

- **Inicio:** invita a buscar un plato; no solicita datos automáticamente.
- **Carga:** muestra qué consulta está buscando, vacía los resultados anteriores y bloquea nuevas peticiones hasta terminar.
- **Resultados:** muestra cuántas recetas se han recibido y sus tarjetas.
- **Sin resultados:** `meals: null` se convierte en un array vacío; se propone probar otro nombre.
- **Error:** los errores HTTP, de red, de JSON o de respuesta inesperada llegan al `catch` y permiten reintentar. No se confunden con una búsqueda sin coincidencias.
- **Datos incompletos:** los campos ausentes muestran textos como «Sin categoría» u «Origen no disponible». Si falta una imagen o no se puede cargar, aparece «Imagen no disponible». El detalle avisa si no hay ingredientes o preparación.

`map` crea un array nuevo con objetos sencillos, sin modificar los datos originales. `filter` devuelve un array nuevo y `reduce` modifica únicamente los grupos de su propio acumulador. `forEach` se utiliza para añadir elementos al DOM. Los datos de la API y la búsqueda se insertan como texto, sin `innerHTML`.

## Diseño

Se mantiene el diseño editorial de la fase 1: fondo marfil, verde oliva, titulares con Georgia, fotografía protagonista y separadores finos. El contenido ocupa el 92% de la ventana, sin un límite global de 1280 píxeles que lo estreche en monitores grandes. El objetivo actual es el uso en PC.

Las tarjetas mantienen esos colores y tipografías. Su cuadrícula utiliza CSS Grid. El detalle separa los ingredientes y la preparación en dos columnas y conserva los saltos de línea del texto original con `white-space: pre-line`. Hay etiquetas para los controles, foco visible, un mensaje con `role="status"` y `aria-live="polite"`, y un enlace para saltar al contenido. Al terminar la búsqueda se devuelve el foco al campo de entrada. Al abrir el detalle, el foco pasa a su título; al cerrarlo, vuelve al botón de la tarjeta. El desplazamiento suave se desactiva si el usuario prefiere reducir el movimiento.

## Comprobaciones realizadas en la fase 2

- `npm run build`: correcto con Vite 8.3.4.
- `node --check`: correcto en los cuatro módulos JavaScript.
- Consulta real mediante `buscarRecetas('chicken')`: 25 recetas en el momento de la comprobación.
- Consulta real sin coincidencias: array vacío.
- Pruebas de integración del DOM con respuestas simuladas: inicio, validación de espacios, carga, bloqueo de envíos simultáneos, codificación de la búsqueda, éxito, vacío y recuperación de controles.
- Error HTTP 503, fallo de red, JSON inválido y respuestas inesperadas: error visible y botón de reintento.
- Reintento tras modificar el campo: vuelve a consultar el nombre original y recupera el foco.
- Campos ausentes, textos con etiquetas HTML e imagen fallida: valores por defecto, texto seguro y sustituto de la imagen.

Las pruebas de integración se ejecutaron en Node con jsdom como herramienta temporal externa al repositorio. No se ha añadido una dependencia de pruebas a la aplicación. Estas pruebas comprueban el comportamiento del DOM, pero no el aspecto visual en un navegador. La revisión visual de las nuevas tarjetas queda pendiente porque el permiso del navegador se había denegado.

## Comprobaciones realizadas en la fase 3

- `npm run build`, `node --check` en los cuatro módulos y `git diff --check`: correctos.
- Funciones de transformación, filtro y resumen con datos congelados: no modifican la entrada. Comprobados ingredientes vacíos, ingrediente número 20, categorías repetidas y campos ausentes.
- Integración del DOM: opciones sin categorías duplicadas, recuentos correctos, filtro local y vuelta a todas las recetas. El resumen conserva el total de la búsqueda mientras el contador de tarjetas cambia.
- Abrir una receta después de filtrar, pulsar la flecha dentro del botón y cerrar el detalle: contenido y foco correctos, sin peticiones adicionales.
- Nueva búsqueda, espacios, carga, vacío y error: se limpian el detalle, las categorías y el resumen anteriores. Un reintento correcto recupera los controles y los datos.
- Detalle sin identificador, sin ingredientes o sin instrucciones; textos que contienen HTML: valores de reserva y contenido mostrado como texto.
- Consulta real `Arrabiata`: una receta de categoría `Vegetarian`, ocho ingredientes y preparación disponible en el momento de la comprobación.
- Repetidas las pruebas de integración de la fase 2: correctas.

La revisión visual en un navegador sigue pendiente; las comprobaciones de esta fase verifican datos y comportamiento del DOM.

## Comprobaciones realizadas en la fase 4

- `npm run build` y `node --check` en los cinco módulos JavaScript: correctos.
- Búsqueda inicial, repetición con cambios de mayúsculas y espacios, y consultas distintas: solo se pide a la API lo que no está guardado.
- Búsqueda sin coincidencias: `[]` se guarda y se reutiliza sin confundirlo con la ausencia de caché.
- JSON guardado corrupto y valores que no son arrays: se consulta la API para recuperar los datos.
- Error al leer o guardar en `localStorage`: la búsqueda sigue devolviendo las recetas de la API. Los errores de red, HTTP, JSON y estructura no se almacenan y permiten reintentar.
- Integración con jsdom: búsqueda repetida con red simulada como desconectada, filtro, resumen y detalle correctos, sin nuevas llamadas a `fetch`.
- Reinicio simulado del DOM y los módulos, conservando el contenido de `localStorage`: la búsqueda guardada se recupera sin una petición.
- Repetidas las pruebas de las fases 2 y 3 con almacenamiento simulado sin retención, para comprobar también el funcionamiento cuando no se pueden conservar búsquedas.

Las pruebas siguen siendo herramientas temporales externas al repositorio; no se añaden dependencias a la aplicación. La persistencia se ha comprobado recreando la aplicación con los datos guardados, sin automatizar un navegador. No se modifica el diseño en esta fase.

### Comprobación manual

1. Arrancar el proyecto y buscar `chicken`: deben aparecer tarjetas con datos de TheMealDB, obtenidos de la API o de la caché si ya se había buscado.
2. Buscar `Arrabiata`: debe aparecer una receta y el contador en singular.
3. Buscar `zzzzzzsinrecetas987`: deben desaparecer las tarjetas anteriores y aparecer el mensaje de búsqueda vacía.
4. Escribir solo espacios: no debe hacerse una petición.
5. En DevTools, pestaña Network, seleccionar una conexión lenta y buscar un nombre que todavía no esté guardado: el mensaje de carga debe verse y los controles deben estar desactivados hasta terminar.
6. Cambiar Network a Offline y hacer una búsqueda nueva: debe aparecer el error. Recuperar la conexión y pulsar «Volver a intentar»: deben cargarse los resultados sin recargar la página.
7. Volver a dejar Network en su configuración normal después de probar.
8. Buscar `chicken` y seleccionar una categoría disponible: las tarjetas y su contador deben cambiar; el resumen «En esta búsqueda» debe conservar sus recuentos. Volver a «Todas las categorías».
9. Pulsar «Ver receta»: deben aparecer los ingredientes y la preparación. Pulsar «Volver a las recetas»: el detalle debe cerrarse y el foco volver a la tarjeta.
10. Con un detalle abierto, realizar otra búsqueda: no deben mantenerse ingredientes, categorías ni recuentos de la anterior. En Network, filtrar y abrir detalles no debe producir peticiones al endpoint de búsqueda; las imágenes sí pueden descargarse al mostrarse.

### Comprobación manual del bonus

1. En DevTools → Application → Local Storage, eliminar solo `pasaporte:recetas:v1:chicken` si existe. Mantener la conexión normal.
2. En Network, filtrar por `search.php` y buscar `chicken`: debe registrarse una petición y aparecer la clave en Local Storage.
3. Limpiar el listado de Network y buscar ` CHICKEN `: deben mostrarse las mismas recetas sin otra petición a `search.php`.
4. Recargar la página con conexión, limpiar Network y buscar otra vez `chicken`: debe reutilizar la entrada guardada. No se cargan tarjetas automáticamente al abrir la página.
5. Con la página abierta, activar Offline y buscar `chicken`: deben aparecer los datos guardados. Buscar un nombre nuevo debe mostrar el error. Restaurar la conexión al terminar.
6. Buscar un nombre sin coincidencias dos veces: la segunda búsqueda tampoco debe consultar `search.php`. Las imágenes se descargan por separado y no forman parte de este bonus.

## Uso de IA

He utilizado Codex (OpenAI) para comparar ideas, generar la estructura, rehacer el diseño e implementar las fases 2, 3 y 4: búsqueda, estados, filtro, resumen, detalle y caché en `localStorage`. Codex ha escrito el HTML, CSS y JavaScript, seleccionado la fotografía de portada y ejecutado las comprobaciones descritas arriba.

Prompts reales relevantes:

> Vale, desarrolla toda la primera idea que has puesto, importante que tambien cumplas el bonus de añadir la cache en localStorage para no repetir peticiones ya hechas. Si quieres ve dándome el código en 5 fases ya si voy haciendo los commits y tal

> Ya he hecho el commit, vamos con la fase 2. Conecta la API y añade la búsqueda de recetas con los estados de carga, error y sin resultados, manteniendo el diseño que tenemos.

**Cómo se verificó:** compilación, comprobación de sintaxis, consultas reales a la API y pruebas de integración con datos simulados para provocar los distintos estados. La revisión visual de esta fase está pendiente.

**Trabajo escrito a mano:** pendiente de que el estudiante indique sus cambios y comprobaciones. No se atribuyen como propios cambios que todavía no ha realizado.

## Autopsia

1. **Propagar los errores de la API hasta `main.js` y no guardarlos en caché.** Se descartó devolver `[]` desde un `catch` en `api.js`, porque eso haría parecer que un fallo de red es una búsqueda sin resultados y podría guardarse como tal. Solo una respuesta vacía válida se representa con un array vacío; los errores muestran un mensaje diferente y permiten reintentar.
2. **Guardar cada búsqueda completa sin caducidad automática.** Se descartó añadir fechas de expiración para mantener una caché sencilla de explicar: una clave por consulta normalizada y un array como valor. Esto evita peticiones repetidas y conserva los datos necesarios para filtros y detalles, pero requiere eliminar la entrada para recibir futuras actualizaciones de la API. Una caché con caducidad sería una ampliación posible.

## Fuente de los datos

[Documentación de TheMealDB](https://www.themealdb.com/api.php). Se utiliza el endpoint de búsqueda por nombre `https://www.themealdb.com/api/json/v1/1/search.php` con el parámetro `s` y la clave de prueba `1`, permitida para uso educativo.

Los filtros y resúmenes se aplican a las recetas cargadas en la búsqueda, no a toda la base de datos.

## Fotografía de portada

`public/images/pasta-verde.jpg` procede de [Unsplash](https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=1400&q=85). Es un recurso estático para ambientar la portada. Las fotografías de las tarjetas sí proceden de la respuesta de TheMealDB.
