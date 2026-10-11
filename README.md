# Pasaporte gastronómico

Proyecto de la misión 2 de Programación Web I: una aplicación para descubrir recetas mediante la API pública TheMealDB, con Vite y JavaScript.

## Estado del proyecto

**Fase 2 de 5 terminada.** El buscador consulta TheMealDB al pulsar Buscar o Enter y muestra tarjetas con fotografía, nombre, categoría y procedencia. Hay estados visibles de inicio, carga, error y sin resultados, además de un botón para reintentar una consulta fallida.

| Fase | Contenido | Estado |
| --- | --- | --- |
| 1 | Vite, HTML, CSS y módulos iniciales | Terminada |
| 2 | Búsqueda real, tarjetas y estados de carga, error y vacío | Terminada |
| 3 | Filtro por categoría, resumen y detalle de receta | Pendiente |
| 4 | Caché de respuestas en localStorage | Pendiente |
| 5 | Revisión de casos límite y documentación final | Pendiente |

El selector de categorías permanece desactivado hasta la fase 3. La caché todavía no está implementada: repetir una búsqueda vuelve a consultar la API.

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
4. `api.js` construye la consulta con `URLSearchParams`, llama a `fetch`, comprueba `respuesta.ok` y lee el JSON.
5. `logica.js` descarta elementos que no son objetos con `filter` y utiliza `map` para preparar los campos que mostrará la interfaz.
6. `render.js` crea las tarjetas con `createElement` y escribe los textos con `textContent`.
7. Si hay un error, `catch` muestra un mensaje y permite reintentar. `finally` recupera los controles tanto en éxito como en error.

La búsqueda se realiza por nombre de plato, principalmente en inglés. No se hace una petición por cada tecla pulsada. El botón de reintento utiliza la última consulta fallida, aunque se haya escrito otro texto después.

## Estructura

```text
index.html       Estructura de la página y controles
src/main.js      Eventos y coordinación de la búsqueda
src/api.js       Petición HTTP y lectura de la respuesta
src/logica.js    Transformación de los datos de la API
src/render.js    Estados y tarjetas en el DOM
src/style.css    Diseño y estilos de las tarjetas
public/images/  Fotografía estática de la portada
package.json    Módulos ES, scripts y dependencia de Vite
```

`cache.js` se incorporará en la fase 4. Las funciones de filtrado y resumen se añadirán a `logica.js` en la fase 3.

## Estados y datos incompletos

- **Inicio:** invita a buscar un plato; no solicita datos automáticamente.
- **Carga:** muestra qué consulta está buscando, vacía los resultados anteriores y bloquea nuevas peticiones hasta terminar.
- **Resultados:** muestra cuántas recetas se han recibido y sus tarjetas.
- **Sin resultados:** `meals: null` se convierte en un array vacío; se propone probar otro nombre.
- **Error:** los errores HTTP, de red, de JSON o de respuesta inesperada llegan al `catch` y permiten reintentar. No se confunden con una búsqueda sin coincidencias.
- **Datos incompletos:** los campos ausentes muestran textos como «Sin categoría» u «Origen no disponible». Si falta una imagen o no se puede cargar, aparece «Imagen no disponible».

`map` crea un array nuevo con objetos sencillos, sin modificar los datos originales. `forEach` se utiliza para añadir las tarjetas al DOM, una acción por receta. Los datos de la API y la búsqueda se insertan como texto, sin `innerHTML`.

## Diseño

Se mantiene el diseño editorial de la fase 1: fondo marfil, verde oliva, titulares con Georgia, fotografía protagonista y separadores finos. El contenido ocupa el 92% de la ventana, sin un límite global de 1280 píxeles que lo estreche en monitores grandes. El objetivo actual es el uso en PC.

Las tarjetas mantienen esos colores y tipografías. Su cuadrícula utiliza CSS Grid. Hay etiquetas para los controles, foco visible, un mensaje con `role="status"` y `aria-live="polite"`, y un enlace para saltar al contenido. Al terminar la búsqueda se devuelve el foco al campo de entrada. El desplazamiento suave se desactiva si el usuario prefiere reducir el movimiento.

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

### Comprobación manual

1. Arrancar el proyecto y buscar `chicken`: deben aparecer tarjetas reales.
2. Buscar `Arrabiata`: debe aparecer una receta y el contador en singular.
3. Buscar `zzzzzzsinrecetas987`: deben desaparecer las tarjetas anteriores y aparecer el mensaje de búsqueda vacía.
4. Escribir solo espacios: no debe hacerse una petición.
5. En DevTools, pestaña Network, seleccionar una conexión lenta y buscar: el mensaje de carga debe verse y los controles deben estar desactivados hasta terminar.
6. Cambiar Network a Offline y hacer una búsqueda nueva: debe aparecer el error. Recuperar la conexión y pulsar «Volver a intentar»: deben cargarse los resultados sin recargar la página.
7. Volver a dejar Network en su configuración normal después de probar.

## Uso de IA

He utilizado Codex (OpenAI) para comparar ideas, generar la estructura, rehacer el diseño e implementar la búsqueda y los estados de la fase 2. Codex ha escrito el HTML, CSS y JavaScript, seleccionado la fotografía de portada y ejecutado las comprobaciones descritas arriba.

Prompts reales relevantes:

> Vale, desarrolla toda la primera idea que has puesto, importante que tambien cumplas el bonus de añadir la cache en localStorage para no repetir peticiones ya hechas. Si quieres ve dándome el código en 5 fases ya si voy haciendo los commits y tal

> Ya he hecho el commit, vamos con la fase 2. Conecta la API y añade la búsqueda de recetas con los estados de carga, error y sin resultados, manteniendo el diseño que tenemos.

**Cómo se verificó:** compilación, comprobación de sintaxis, consultas reales a la API y pruebas de integración con datos simulados para provocar los distintos estados. La revisión visual de esta fase está pendiente.

**Trabajo escrito a mano:** pendiente de que el estudiante indique sus cambios y comprobaciones. No se atribuyen como propios cambios que todavía no ha realizado.

## Autopsia

1. **Propagar los errores de la API hasta `main.js`.** Se descartó devolver `[]` desde un `catch` en `api.js`, porque eso haría parecer que un fallo de red es una búsqueda sin resultados. Solo una respuesta vacía válida se representa con un array vacío; los errores muestran un mensaje diferente y permiten reintentar.
2. **Buscar al enviar el formulario y bloquear temporalmente los controles.** Se descartó consultar con cada pulsación porque produciría más peticiones y complicaría el orden de las respuestas. El envío con Buscar o Enter permite un flujo sencillo que se puede seguir con `async/await` y `try/catch/finally`.

## Fuente de los datos

[Documentación de TheMealDB](https://www.themealdb.com/api.php). Se utiliza el endpoint de búsqueda por nombre `https://www.themealdb.com/api/json/v1/1/search.php` con el parámetro `s` y la clave de prueba `1`, permitida para uso educativo.

Los filtros y resúmenes de la siguiente fase se aplicarán a las recetas cargadas en la búsqueda, no a toda la base de datos.

## Fotografía de portada

`public/images/pasta-verde.jpg` procede de [Unsplash](https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=1400&q=85). Es un recurso estático para ambientar la portada. Las fotografías de las tarjetas sí proceden de la respuesta de TheMealDB.
