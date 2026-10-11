# Pasaporte gastronómico

Proyecto de la misión 2 de Programación Web I: una aplicación para descubrir recetas mediante la API pública TheMealDB, con Vite y JavaScript.

## Estado del proyecto

**Fase 1 de 5: estructura e interfaz, con el diseño rehecho.** Los controles están desactivados porque todavía no están conectados a la API. La página indica «Recetario en preparación». No se muestran recetas inventadas ni se realizan peticiones a la API. La fotografía de portada es un recurso estático local. La caché se incorporará en la fase 4.

## Diseño

La interfaz tiene un estilo editorial: fondo marfil, texto verde oliva, titulares con Georgia, fotografía protagonista y separadores finos. La cabecera, la portada, el buscador y el cierre ocupan el 92% de la ventana, con un margen del 4% a cada lado y sin un ancho máximo que los estreche en monitores grandes. El titular y la fotografía ajustan su tamaño a la ventana con `clamp`, `vw` y `vh`; los párrafos conservan límites de anchura para facilitar su lectura. La fotografía se sirve desde el proyecto, sin depender de una URL externa al abrir la página.

Se utilizan fuentes del sistema y CSS propio, sin librerías de diseño. Flexbox organiza la navegación y los controles; Grid divide la portada y el formulario en columnas. El objetivo actual es el uso en PC; se conservan las media queries anteriores, pero no es necesario ampliar el trabajo para móvil o tablet. Los enlaces tienen foco visible, hay un enlace para saltar al contenido y el desplazamiento suave se desactiva cuando el usuario prefiere reducir el movimiento.

| Fase | Contenido | Estado |
| --- | --- | --- |
| 1 | Vite, HTML, CSS y módulos iniciales | Preparada |
| 2 | Búsqueda real, tarjetas y estados de carga, error y vacío | Pendiente |
| 3 | Filtro por categoría, resumen y detalle de receta | Pendiente |
| 4 | Caché de respuestas en localStorage | Pendiente |
| 5 | Revisión de casos límite y documentación final | Pendiente |

## Puesta en marcha

Se necesita una versión de Node.js compatible con Vite 8. El entorno de trabajo dispone de Node.js 24.15.0.

```bash
npm install
npm run dev
```

Abre la dirección que indique la terminal. Para generar y revisar la versión de producción:

```bash
npm run build
npm run preview
```

La instalación genera `package-lock.json`, que debe incluirse en Git para fijar las versiones de las dependencias. `node_modules` y `dist` se excluyen mediante `.gitignore`.

## Estructura actual

```text
index.html       Estructura de la página y controles accesibles
src/main.js      Punto de entrada y coordinación
src/render.js    Escritura de contenido en el DOM
src/style.css    Presentación y adaptación a pantallas pequeñas
public/images/  Fotografía estática de la portada
package.json    Configuración de módulos, scripts y dependencia de Vite
```

En las siguientes fases se añadirán `api.js`, `logica.js` y `cache.js` con sus respectivas responsabilidades.

## Conceptos utilizados

- HTML semántico y separación de estructura, presentación y comportamiento.
- Módulos ES con `import` y `export`.
- `const`, funciones, `querySelector` y `textContent`.
- Vite como servidor de desarrollo y herramienta de compilación.
- CSS con Flexbox, Grid y media queries para pantallas pequeñas.

El uso de `textContent` permite escribir texto en el DOM sin interpretarlo como HTML. `main.js` coordina el inicio; `render.js` se encarga de mostrar el mensaje.

## Comprobación de la fase 1

La estructura mínima de Vite se creó manualmente tras un problema inicial de acceso a npm. Las dependencias ya están disponibles y `npm run build` compila correctamente con Vite 8.3.4. También pasan `node --check` en ambos módulos y la revisión de IDs, enlaces internos, etiquetas y referencias ARIA.

El rediseño se ha revisado en el navegador a 1280, 768 y 375 píxeles: la fotografía carga desde el proyecto, los enlaces de navegación funcionan y no hay desbordamiento horizontal. No se han observado errores ni avisos en la consola de la página.

Después de esa revisión se eliminó el límite de 1280 píxeles del contenedor para aprovechar monitores grandes. La compilación de este ajuste pasa y el servidor local devuelve HTTP 200. La comprobación visual posterior del ajuste queda pendiente porque se denegó el permiso del navegador.

Después de instalar:

1. Ejecutar `npm run dev` y comprobar que se ve la página sin errores en la consola.
2. Ampliar la ventana en un monitor de PC: el contenido debe ocupar el 92% del ancho, sin quedar limitado a 1280 píxeles ni producir desplazamiento horizontal.
3. Comprobar que el enlace «Explorar el recetario» lleva al buscador.
4. Ejecutar `npm run build`.

## Uso de IA

He utilizado Codex (OpenAI) para proponer y comparar ideas, generar la estructura inicial y rehacer el diseño de esta primera fase. Codex ha escrito el HTML, el CSS y los módulos iniciales, y ha seleccionado una fotografía de Unsplash.

Prompts reales relevantes:

> Vale, desarrolla toda la primera idea que has puesto, importante que tambien cumplas el bonus de añadir la cache en localStorage para no repetir peticiones ya hechas. Si quieres ve dándome el código en 5 fases ya si voy haciendo los commits y tal

> Codex, sé que lo puedes hacer mucho mejor, anda currate mejor el diseño, que parezca una web de verdad, elegante, ya sabes que no parezca que lo haya hecho una IA. Empieza desde cero con el diseño, como tu sabes

**Verificación:** Codex ha comprobado la compilación de producción, la sintaxis de JavaScript, las referencias del HTML y la presentación en el navegador en escritorio y móvil. Esta sección se actualizará con las comprobaciones realizadas en cada fase.

**Trabajo escrito a mano:** pendiente de que el estudiante indique sus cambios y comprobaciones. No se atribuyen como propios cambios que todavía no ha realizado.

## Autopsia

Decisiones de esta fase, que se revisarán al terminar el proyecto:

1. **Usar JavaScript con Vite.** Permite trabajar directamente los módulos ES y el DOM del temario. Se descartó añadir TypeScript en esta entrega para mantener el alcance centrado en los requisitos de la misión.
2. **Separar el renderizado desde el inicio.** Aunque ahora solo muestra un mensaje, este módulo alojará las tarjetas y los estados de carga y error. Se descartó concentrar todo en `main.js` para mantener las responsabilidades claras cuando crezca la aplicación.

## Fuente de los datos

[TheMealDB](https://www.themealdb.com/api.php). La conexión se incorporará en la fase 2. Los filtros y resúmenes se aplicarán a los resultados de la búsqueda cargada, no a toda la base de datos.

## Fotografía

`public/images/pasta-verde.jpg` procede de [Unsplash](https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=1400&q=85). Se usa para ambientar la portada; no representa una receta recibida de TheMealDB. El encuadre se ajusta con `object-fit` en CSS, sin modificar la fotografía original.
